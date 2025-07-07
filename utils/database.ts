import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter, 
  serverTimestamp,
  type DocumentData,
  type QueryConstraint,
  type DocumentSnapshot,
  type Firestore 
} from 'firebase/firestore'
import type { UserProfile } from '~/types/user'

// Database utility class for centralized database operations
export class DatabaseService {
  private db: Firestore | null = null

  constructor() {
    this.initializeFirestore()
  }

  private initializeFirestore() {
    try {
      const { $firebase } = useNuxtApp()
      this.db = $firebase?.db || null
    } catch (error) {
      console.warn('Firestore not available:', error)
    }
  }

  private ensureFirestore(): Firestore {
    if (!this.db) {
      this.initializeFirestore()
    }
    
    if (!this.db) {
      throw new Error('Firestore no está disponible')
    }
    
    return this.db
  }

  // Generic CRUD operations
  async create<T extends DocumentData>(
    collectionName: string, 
    documentId: string, 
    data: T
  ): Promise<void> {
    const db = this.ensureFirestore()
    const docRef = doc(db, collectionName, documentId)
    
    await setDoc(docRef, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
  }

  async read<T = DocumentData>(
    collectionName: string, 
    documentId: string
  ): Promise<T | null> {
    const db = this.ensureFirestore()
    const docRef = doc(db, collectionName, documentId)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      const data = docSnap.data()
      return {
        ...data,
        id: docSnap.id,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate()
      } as T
    }
    
    return null
  }

  async update<T extends DocumentData>(
    collectionName: string, 
    documentId: string, 
    data: Partial<T>
  ): Promise<void> {
    const db = this.ensureFirestore()
    const docRef = doc(db, collectionName, documentId)
    
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    })
  }

  async delete(collectionName: string, documentId: string): Promise<void> {
    const db = this.ensureFirestore()
    const docRef = doc(db, collectionName, documentId)
    await deleteDoc(docRef)
  }

  // Query operations
  async query<T = DocumentData>(
    collectionName: string, 
    constraints: QueryConstraint[] = []
  ): Promise<T[]> {
    const db = this.ensureFirestore()
    const collectionRef = collection(db, collectionName)
    const q = query(collectionRef, ...constraints)
    
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    } as T))
  }

  // Paginated query
  async queryPaginated<T = DocumentData>(
    collectionName: string, 
    constraints: QueryConstraint[] = [],
    pageSize: number = 10,
    lastDocument?: DocumentSnapshot
  ): Promise<{ data: T[], hasMore: boolean, lastDoc?: DocumentSnapshot }> {
    const db = this.ensureFirestore()
    const collectionRef = collection(db, collectionName)
    
    let queryConstraints = [...constraints, limit(pageSize + 1)]
    
    if (lastDocument) {
      queryConstraints.push(startAfter(lastDocument))
    }
    
    const q = query(collectionRef, ...queryConstraints)
    const querySnapshot = await getDocs(q)
    
    const docs = querySnapshot.docs
    const hasMore = docs.length > pageSize
    
    const data = docs.slice(0, pageSize).map(doc => ({
      ...doc.data(),
      id: doc.id,
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    } as T))
    
    return {
      data,
      hasMore,
      lastDoc: hasMore ? docs[pageSize - 1] : undefined
    }
  }

  // User-specific operations
  async createUserProfile(userId: string, profileData: Partial<UserProfile>): Promise<void> {
    await this.create('users', userId, profileData)
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    return await this.read<UserProfile>('users', userId)
  }

  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<void> {
    await this.update('users', userId, updates)
  }

  async deleteUserProfile(userId: string): Promise<void> {
    await this.delete('users', userId)
  }

  // Get users with filters
  async getUsers(filters: {
    role?: string
    isActive?: boolean
    limit?: number
  } = {}): Promise<UserProfile[]> {
    const constraints: QueryConstraint[] = []
    
    if (filters.role) {
      constraints.push(where('role', '==', filters.role))
    }
    
    if (filters.isActive !== undefined) {
      constraints.push(where('isActive', '==', filters.isActive))
    }
    
    constraints.push(orderBy('createdAt', 'desc'))
    
    if (filters.limit) {
      constraints.push(limit(filters.limit))
    }
    
    return await this.query<UserProfile>('users', constraints)
  }

  // Search users by display name
  async searchUsers(searchTerm: string, limitCount: number = 10): Promise<UserProfile[]> {
    // Note: For better search, consider using Algolia or similar
    // This is a basic implementation using Firestore queries
    const constraints: QueryConstraint[] = [
      where('displayName', '>=', searchTerm),
      where('displayName', '<=', searchTerm + '\uf8ff'),
      orderBy('displayName'),
      limit(limitCount)
    ]
    
    return await this.query<UserProfile>('users', constraints)
  }

  // Content operations (facts, news, playlists, photos)
  async createContent<T extends DocumentData>(
    type: 'facts' | 'news' | 'playlists' | 'photos',
    data: T
  ): Promise<string> {
    const db = this.ensureFirestore()
    const collectionRef = collection(db, type)
    const docRef = doc(collectionRef)
    
    await setDoc(docRef, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
    
    return docRef.id
  }

  async getContent<T = DocumentData>(
    type: 'facts' | 'news' | 'playlists' | 'photos',
    filters: {
      isActive?: boolean
      limit?: number
      orderBy?: string
    } = {}
  ): Promise<T[]> {
    const constraints: QueryConstraint[] = []
    
    if (filters.isActive !== undefined) {
      constraints.push(where('isActive', '==', filters.isActive))
    }
    
    const orderByField = filters.orderBy || 'createdAt'
    constraints.push(orderBy(orderByField, 'desc'))
    
    if (filters.limit) {
      constraints.push(limit(filters.limit))
    }
    
    return await this.query<T>(type, constraints)
  }

  // Analytics and logging
  async logUserAction(userId: string, action: string, metadata?: any): Promise<void> {
    try {
      const logData = {
        userId,
        action,
        metadata: metadata || {},
        timestamp: serverTimestamp(),
        userAgent: navigator.userAgent,
        url: window.location.href
      }
      
      const db = this.ensureFirestore()
      const logsRef = collection(db, 'logs')
      const docRef = doc(logsRef)
      
      await setDoc(docRef, logData)
    } catch (error) {
      // Log to console but don't throw error to avoid breaking the main flow
      console.warn('Failed to log user action:', { userId, action, error })
    }
  }

  // Batch operations
  async batchUpdate<T extends DocumentData>(
    updates: Array<{
      collection: string
      documentId: string
      data: Partial<T>
    }>
  ): Promise<void> {
    const db = this.ensureFirestore()
    const batch = db.batch ? db.batch() : null
    
    if (!batch) {
      throw new Error('Batch operations not supported')
    }
    
    updates.forEach(update => {
      const docRef = doc(db, update.collection, update.documentId)
      batch.update(docRef, {
        ...update.data,
        updatedAt: serverTimestamp()
      })
    })
    
    await batch.commit()
  }

  // Check if user exists
  async userExists(userId: string): Promise<boolean> {
    const user = await this.getUserProfile(userId)
    return user !== null
  }

  // Get user count
  async getUserCount(): Promise<number> {
    const users = await this.getUsers()
    return users.length
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      const db = this.ensureFirestore()
      // Try to read a document to verify connection
      const testDoc = doc(db, 'health', 'test')
      await getDoc(testDoc)
      return true
    } catch (error) {
      console.error('Database health check failed:', error)
      return false
    }
  }
}

// Export singleton instance
export const dbService = new DatabaseService()

// Export utility functions for direct use
export const db = {
  // User operations
  createUser: (userId: string, data: Partial<UserProfile>) => 
    dbService.createUserProfile(userId, data),
  getUser: (userId: string) => 
    dbService.getUserProfile(userId),
  updateUser: (userId: string, data: Partial<UserProfile>) => 
    dbService.updateUserProfile(userId, data),
  deleteUser: (userId: string) => 
    dbService.deleteUserProfile(userId),
  searchUsers: (term: string, limit?: number) => 
    dbService.searchUsers(term, limit),
  
  // Content operations
  createContent: <T extends DocumentData>(
    type: 'facts' | 'news' | 'playlists' | 'photos', 
    data: T
  ) => dbService.createContent(type, data),
  getContent: <T = DocumentData>(
    type: 'facts' | 'news' | 'playlists' | 'photos', 
    filters?: any
  ) => dbService.getContent<T>(type, filters),
  
  // Logging
  logAction: (userId: string, action: string, metadata?: any) => 
    dbService.logUserAction(userId, action, metadata),
  
  // Utilities
  healthCheck: () => dbService.healthCheck(),
  userExists: (userId: string) => dbService.userExists(userId),
  getUserCount: () => dbService.getUserCount()
}