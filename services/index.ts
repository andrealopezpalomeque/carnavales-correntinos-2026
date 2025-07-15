import { getFirestore, collection, getDocs, doc, updateDoc, increment } from 'firebase/firestore'

export default class FirebaseService {
  private db

  constructor() {
    try {
      const { $firebase } = useNuxtApp()
      this.db = $firebase?.db || null
    } catch (error) {
      console.error('Error in Firebase service constructor:', error)
      this.db = null
    }
  }

  // Facts
  async getFacts() {
    if (!this.db) {
      console.error('Firebase database not available in getFacts')
      return []
    }
    
    try {
      const factsCollection = collection(this.db, 'funfacts')
      const snapshot = await getDocs(factsCollection)
      const facts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      return facts
    } catch (error) {
      console.error('Error fetching facts:', error)
      return []
    }
  }

  async voteFact(id: string) {
    if (!this.db) {
      console.error('Firebase database not available in voteFact')
      return
    }
    
    try {
      const factRef = doc(this.db, 'funfacts', id)
      await updateDoc(factRef, { votes: increment(1) })
    } catch (error) {
      console.error('Error voting for fact:', error)
      throw error
    }
  }
}