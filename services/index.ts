import { getFirestore, collection, getDocs, doc, updateDoc, increment } from 'firebase/firestore'

export default class FirebaseService {
  private db

  constructor() {
    try {
      const { $firebase } = useNuxtApp()
      console.log('Firebase service constructor - $firebase:', !!$firebase)
      console.log('Firebase service constructor - $firebase.db:', !!$firebase?.db)
      this.db = $firebase?.db || null
      
      if (!this.db) {
        console.warn('Firebase database not available in service constructor')
      }
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
      console.log('Fetching facts from Firestore...')
      const factsCollection = collection(this.db, 'funfacts')
      const snapshot = await getDocs(factsCollection)
      const facts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      console.log('Fetched facts:', facts.length, 'items')
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
      console.log('Voting for fact:', id)
      const factRef = doc(this.db, 'funfacts', id)
      await updateDoc(factRef, { votes: increment(1) })
      console.log('Vote successful for fact:', id)
    } catch (error) {
      console.error('Error voting for fact:', error)
      throw error
    }
  }
}