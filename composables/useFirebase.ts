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
      const factsCollection = collection($firebase.db, 'funfacts')
      const snapshot = await getDocs(factsCollection)
      const facts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      return facts
    } catch (error) {
      return []
    }
  }

  const voteFact = async (id: string) => {
    if (!$firebase?.db) {
      console.error('useFirebase: Firebase database not available for voting')
      throw new Error('Firebase database not available')
    }

    // Check if user is authenticated for voting
    const { isAuthenticated } = useAuthEnhanced()
    if (!isAuthenticated.value) {
      throw new Error('Debes iniciar sesión para votar')
    }
    
    try {
      const factRef = doc($firebase.db, 'funfacts', id)
      await updateDoc(factRef, { votes: increment(1) })
    } catch (error) {
      if (error.code === 'permission-denied') {
        throw new Error('No tienes permisos para votar')
      }
      throw error
    }
  }

  return {
    isFirebaseReady,
    getFacts,
    voteFact
  }
}