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
import type { 
  UserProfile, 
  UserLike, 
  FriendRequest, 
  UserFollow, 
  Friendship, 
  InteractionResponse,
  FriendRequestStatus,
  UserInteractions
} from '~/types/user'

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
    
    // If no filters are specified, just order by createdAt
    if (!filters.role && filters.isActive === undefined) {
      constraints.push(orderBy('createdAt', 'desc'))
      
      if (filters.limit) {
        constraints.push(limit(filters.limit))
      }
      
      return await this.query<UserProfile>('users', constraints)
    }
    
    // If we have filters, we need to do client-side filtering to avoid index requirements
    let results = await this.query<UserProfile>('users', [])
    
    // Apply filters client-side
    if (filters.role) {
      results = results.filter(user => user.role === filters.role)
    }
    
    if (filters.isActive !== undefined) {
      results = results.filter(user => user.isActive === filters.isActive)
    }
    
    // Sort by createdAt
    results.sort((a, b) => {
      const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt)
      const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt)
      return dateB.getTime() - dateA.getTime()
    })
    
    // Apply limit
    if (filters.limit) {
      results = results.slice(0, filters.limit)
    }
    
    return results
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

  // ============== USER INTERACTIONS ==============

  // Like system
  async likeUser(fromUserId: string, toUserId: string): Promise<InteractionResponse> {
    try {
      if (fromUserId === toUserId) {
        return { success: false, error: 'No puedes darte like a ti mismo' }
      }

      const db = this.ensureFirestore()
      
      // Check if like already exists
      const existingLike = await this.getUserLike(fromUserId, toUserId)
      if (existingLike) {
        return { success: false, error: 'Ya has dado like a este usuario' }
      }

      // Create like document
      const likesRef = collection(db, 'userLikes')
      const likeDoc = doc(likesRef)
      
      const likeData: UserLike = {
        fromUserId,
        toUserId,
        createdAt: new Date()
      }

      await setDoc(likeDoc, {
        ...likeData,
        createdAt: serverTimestamp()
      })

      // Update interaction counts
      await this.updateUserInteractionCounts(fromUserId)
      await this.updateUserInteractionCounts(toUserId)

      return { success: true, data: { id: likeDoc.id, ...likeData } }
    } catch (error: any) {
      console.error('Error liking user:', error)
      return { success: false, error: error.message || 'Error al dar like' }
    }
  }

  async unlikeUser(fromUserId: string, toUserId: string): Promise<InteractionResponse> {
    try {
      const db = this.ensureFirestore()
      
      // Find existing like
      const likesRef = collection(db, 'userLikes')
      const q = query(
        likesRef,
        where('fromUserId', '==', fromUserId),
        where('toUserId', '==', toUserId)
      )
      
      const querySnapshot = await getDocs(q)
      
      if (querySnapshot.empty) {
        return { success: false, error: 'No has dado like a este usuario' }
      }

      // Delete the like
      const likeDoc = querySnapshot.docs[0]
      await deleteDoc(likeDoc.ref)

      // Update interaction counts
      await this.updateUserInteractionCounts(fromUserId)
      await this.updateUserInteractionCounts(toUserId)

      return { success: true }
    } catch (error: any) {
      console.error('Error unliking user:', error)
      return { success: false, error: error.message || 'Error al quitar like' }
    }
  }

  async getUserLike(fromUserId: string, toUserId: string): Promise<UserLike | null> {
    try {
      const db = this.ensureFirestore()
      const likesRef = collection(db, 'userLikes')
      const q = query(
        likesRef,
        where('fromUserId', '==', fromUserId),
        where('toUserId', '==', toUserId)
      )
      
      const querySnapshot = await getDocs(q)
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0]
        const data = doc.data()
        return {
          id: doc.id,
          fromUserId: data.fromUserId,
          toUserId: data.toUserId,
          createdAt: data.createdAt?.toDate() || new Date()
        }
      }
      
      return null
    } catch (error) {
      console.error('Error getting user like:', error)
      return null
    }
  }

  async getUserLikes(userId: string, type: 'given' | 'received' = 'received'): Promise<UserLike[]> {
    try {
      const db = this.ensureFirestore()
      const likesRef = collection(db, 'userLikes')
      const field = type === 'given' ? 'fromUserId' : 'toUserId'
      
      const q = query(
        likesRef,
        where(field, '==', userId),
        orderBy('createdAt', 'desc')
      )
      
      const querySnapshot = await getDocs(q)
      
      return querySnapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          fromUserId: data.fromUserId,
          toUserId: data.toUserId,
          createdAt: data.createdAt?.toDate() || new Date()
        }
      })
    } catch (error) {
      console.error('Error getting user likes:', error)
      return []
    }
  }

  // Friend system
  async sendFriendRequest(fromUserId: string, toUserId: string): Promise<InteractionResponse> {
    try {
      if (fromUserId === toUserId) {
        return { success: false, error: 'No puedes enviarte una solicitud a ti mismo' }
      }

      const db = this.ensureFirestore()
      
      // Check if request already exists
      const existingRequest = await this.getFriendRequest(fromUserId, toUserId)
      if (existingRequest) {
        return { success: false, error: 'Ya existe una solicitud de amistad' }
      }

      // Check if they're already friends
      const friendship = await this.getFriendship(fromUserId, toUserId)
      if (friendship) {
        return { success: false, error: 'Ya son amigos' }
      }

      // Create friend request
      const requestsRef = collection(db, 'friendRequests')
      const requestDoc = doc(requestsRef)
      
      const requestData: FriendRequest = {
        fromUserId,
        toUserId,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      }

      await setDoc(requestDoc, {
        ...requestData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })

      return { success: true, data: { id: requestDoc.id, ...requestData } }
    } catch (error: any) {
      console.error('Error sending friend request:', error)
      return { success: false, error: error.message || 'Error al enviar solicitud' }
    }
  }

  async respondToFriendRequest(requestId: string, response: 'accepted' | 'declined', userId: string): Promise<InteractionResponse> {
    try {
      const db = this.ensureFirestore()
      const requestRef = doc(db, 'friendRequests', requestId)
      const requestDoc = await getDoc(requestRef)
      
      if (!requestDoc.exists()) {
        return { success: false, error: 'Solicitud no encontrada' }
      }

      const requestData = requestDoc.data() as FriendRequest
      
      if (requestData.toUserId !== userId) {
        return { success: false, error: 'No tienes permiso para responder esta solicitud' }
      }

      if (requestData.status !== 'pending') {
        return { success: false, error: 'Esta solicitud ya fue respondida' }
      }

      // Update request status
      await updateDoc(requestRef, {
        status: response,
        updatedAt: serverTimestamp()
      })

      // If accepted, create friendship
      if (response === 'accepted') {
        const friendshipsRef = collection(db, 'friendships')
        const friendshipDoc = doc(friendshipsRef)
        
        await setDoc(friendshipDoc, {
          user1Id: requestData.fromUserId,
          user2Id: requestData.toUserId,
          createdAt: serverTimestamp()
        })

        // Update interaction counts
        await this.updateUserInteractionCounts(requestData.fromUserId)
        await this.updateUserInteractionCounts(requestData.toUserId)
      }

      return { success: true }
    } catch (error: any) {
      console.error('Error responding to friend request:', error)
      return { success: false, error: error.message || 'Error al responder solicitud' }
    }
  }

  async getFriendRequest(fromUserId: string, toUserId: string): Promise<FriendRequest | null> {
    try {
      const db = this.ensureFirestore()
      const requestsRef = collection(db, 'friendRequests')
      
      // Check both directions
      const q1 = query(
        requestsRef,
        where('fromUserId', '==', fromUserId),
        where('toUserId', '==', toUserId)
      )
      
      const q2 = query(
        requestsRef,
        where('fromUserId', '==', toUserId),
        where('toUserId', '==', fromUserId)
      )
      
      const [snapshot1, snapshot2] = await Promise.all([
        getDocs(q1),
        getDocs(q2)
      ])
      
      const snapshot = !snapshot1.empty ? snapshot1 : snapshot2
      
      if (!snapshot.empty) {
        const doc = snapshot.docs[0]
        const data = doc.data()
        return {
          id: doc.id,
          fromUserId: data.fromUserId,
          toUserId: data.toUserId,
          status: data.status,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        }
      }
      
      return null
    } catch (error) {
      console.error('Error getting friend request:', error)
      return null
    }
  }

  async getFriendRequests(userId: string, type: 'sent' | 'received' = 'received'): Promise<FriendRequest[]> {
    try {
      const db = this.ensureFirestore()
      const requestsRef = collection(db, 'friendRequests')
      const field = type === 'sent' ? 'fromUserId' : 'toUserId'
      
      const q = query(
        requestsRef,
        where(field, '==', userId),
        where('status', '==', 'pending'),
        orderBy('createdAt', 'desc')
      )
      
      const querySnapshot = await getDocs(q)
      
      return querySnapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          fromUserId: data.fromUserId,
          toUserId: data.toUserId,
          status: data.status,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        }
      })
    } catch (error) {
      console.error('Error getting friend requests:', error)
      return []
    }
  }

  async getFriendship(user1Id: string, user2Id: string): Promise<Friendship | null> {
    try {
      const db = this.ensureFirestore()
      const friendshipsRef = collection(db, 'friendships')
      
      // Check both combinations since friendship is bidirectional
      const q1 = query(
        friendshipsRef,
        where('user1Id', '==', user1Id),
        where('user2Id', '==', user2Id)
      )
      
      const q2 = query(
        friendshipsRef,
        where('user1Id', '==', user2Id),
        where('user2Id', '==', user1Id)
      )
      
      const [snapshot1, snapshot2] = await Promise.all([
        getDocs(q1),
        getDocs(q2)
      ])
      
      const snapshot = !snapshot1.empty ? snapshot1 : snapshot2
      
      if (!snapshot.empty) {
        const doc = snapshot.docs[0]
        const data = doc.data()
        return {
          id: doc.id,
          user1Id: data.user1Id,
          user2Id: data.user2Id,
          createdAt: data.createdAt?.toDate() || new Date()
        }
      }
      
      return null
    } catch (error) {
      console.error('Error getting friendship:', error)
      return null
    }
  }

  async getUserFriends(userId: string): Promise<UserProfile[]> {
    try {
      const db = this.ensureFirestore()
      const friendshipsRef = collection(db, 'friendships')
      
      // Get friendships where user is either user1 or user2
      const q1 = query(friendshipsRef, where('user1Id', '==', userId))
      const q2 = query(friendshipsRef, where('user2Id', '==', userId))
      
      const [snapshot1, snapshot2] = await Promise.all([
        getDocs(q1),
        getDocs(q2)
      ])
      
      // Extract friend IDs
      const friendIds = new Set<string>()
      
      snapshot1.docs.forEach(doc => {
        const data = doc.data()
        friendIds.add(data.user2Id)
      })
      
      snapshot2.docs.forEach(doc => {
        const data = doc.data()
        friendIds.add(data.user1Id)
      })
      
      // Get friend profiles
      const friends: UserProfile[] = []
      for (const friendId of friendIds) {
        const friend = await this.getUserProfile(friendId)
        if (friend) {
          friends.push(friend)
        }
      }
      
      return friends
    } catch (error) {
      console.error('Error getting user friends:', error)
      return []
    }
  }

  async removeFriend(user1Id: string, user2Id: string): Promise<InteractionResponse> {
    try {
      const friendship = await this.getFriendship(user1Id, user2Id)
      
      if (!friendship) {
        return { success: false, error: 'No son amigos' }
      }

      const db = this.ensureFirestore()
      await deleteDoc(doc(db, 'friendships', friendship.id!))

      // Update interaction counts
      await this.updateUserInteractionCounts(user1Id)
      await this.updateUserInteractionCounts(user2Id)

      return { success: true }
    } catch (error: any) {
      console.error('Error removing friend:', error)
      return { success: false, error: error.message || 'Error al eliminar amigo' }
    }
  }

  // Update user interaction counts
  async updateUserInteractionCounts(userId: string): Promise<void> {
    try {
      const [likesReceived, likesGiven, friends] = await Promise.all([
        this.getUserLikes(userId, 'received'),
        this.getUserLikes(userId, 'given'),
        this.getUserFriends(userId)
      ])

      const interactions: UserInteractions = {
        likesReceived: likesReceived.length,
        likesGiven: likesGiven.length,
        friendsCount: friends.length,
        followersCount: 0, // Will implement later
        followingCount: 0  // Will implement later
      }

      await this.updateUserProfile(userId, { interactions })
    } catch (error) {
      console.error('Error updating interaction counts:', error)
    }
  }

  // Check relationship status between two users
  async getRelationshipStatus(currentUserId: string, targetUserId: string): Promise<{
    isLiked: boolean
    isFriend: boolean
    friendRequestStatus: 'none' | 'sent' | 'received' | 'friends'
  }> {
    try {
      const [like, friendship, friendRequest] = await Promise.all([
        this.getUserLike(currentUserId, targetUserId),
        this.getFriendship(currentUserId, targetUserId),
        this.getFriendRequest(currentUserId, targetUserId)
      ])

      let friendRequestStatus: 'none' | 'sent' | 'received' | 'friends' = 'none'
      
      if (friendship) {
        friendRequestStatus = 'friends'
      } else if (friendRequest) {
        if (friendRequest.status === 'pending') {
          friendRequestStatus = friendRequest.fromUserId === currentUserId ? 'sent' : 'received'
        }
      }

      return {
        isLiked: !!like,
        isFriend: !!friendship,
        friendRequestStatus
      }
    } catch (error) {
      console.error('Error getting relationship status:', error)
      return {
        isLiked: false,
        isFriend: false,
        friendRequestStatus: 'none'
      }
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