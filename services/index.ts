import { getFirestore, collection, getDocs, doc, updateDoc, increment } from 'firebase/firestore'

export default class FirebaseService {
  private db

  constructor() {
    const { $db } = useNuxtApp()
    this.db = $db
  }

  // Facts
  async getFacts() {
    if (!this.db) return []
    
    const factsCollection = collection(this.db, 'funfacts')
    const snapshot = await getDocs(factsCollection)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  }

  async voteFact(id: string) {
    if (!this.db) return
    
    const factRef = doc(this.db, 'funfacts', id)
    await updateDoc(factRef, { votes: increment(1) })
  }
}