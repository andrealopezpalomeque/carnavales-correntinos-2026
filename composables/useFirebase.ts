import { collection, getDocs, doc, updateDoc, increment } from 'firebase/firestore'

// Composable to access Firebase with proper error handling
export const useFirebase = () => {
  const { $firebase } = useNuxtApp()
  
  const isFirebaseReady = computed(() => {
    return !!$firebase?.db
  })

  const getFacts = async () => {
    if (!$firebase?.db) {
      console.error('useFirebase: Firebase database not available')
      return []
    }
    
    try {
      console.log('useFirebase: Fetching facts from Firestore...')
      const factsCollection = collection($firebase.db, 'funfacts')
      const snapshot = await getDocs(factsCollection)
      const facts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      console.log('useFirebase: Fetched facts:', facts.length, 'items')
      return facts
    } catch (error) {
      console.error('useFirebase: Error fetching facts:', error)
      return []
    }
  }

  const voteFact = async (id: string) => {
    if (!$firebase?.db) {
      console.error('useFirebase: Firebase database not available for voting')
      throw new Error('Firebase database not available')
    }
    
    try {
      console.log('useFirebase: Voting for fact:', id)
      const factRef = doc($firebase.db, 'funfacts', id)
      await updateDoc(factRef, { votes: increment(1) })
      console.log('useFirebase: Vote successful for fact:', id)
    } catch (error) {
      console.error('useFirebase: Error voting for fact:', error)
      throw error
    }
  }

  return {
    isFirebaseReady,
    getFacts,
    voteFact
  }
}