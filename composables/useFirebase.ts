import { 
  collection, 
  getDocs, 
  doc, 
  updateDoc, 
  increment, 
  setDoc, 
  getDoc,
  query,
  where 
} from 'firebase/firestore'

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
      console.error('Error fetching facts:', error)
      return []
    }
  }

  const voteFact = async (factId) => {
    if (!$firebase?.db) {
      throw new Error('Firebase database not available')
    }

    // Get current user
    const { isAuthenticated, userProfile } = useAuthEnhanced()
    if (!isAuthenticated.value || !userProfile.value) {
      throw new Error('Debes iniciar sesión para votar')
    }
    
    try {
      const userId = userProfile.value.uid
      
      // Check if user already voted
      const voteDocId = `${userId}_${factId}`
      const userVoteRef = doc($firebase.db, 'userVotes', voteDocId)
      const existingVote = await getDoc(userVoteRef)
      
      if (existingVote.exists()) {
        throw new Error('Ya has votado por esta curiosidad')
      }
      
      // Create user vote record
      await setDoc(userVoteRef, {
        userId: userId,
        factId: factId,
        votedAt: new Date().toISOString(),
        userEmail: userProfile.value.email
      })
      
      // Update fact vote count
      const factRef = doc($firebase.db, 'funfacts', factId)
      await updateDoc(factRef, { 
        votes: increment(1) 
      })
      
      console.log('Vote recorded successfully')
    } catch (error) {
      console.error('Error voting:', error)
      throw error
    }
  }

  const getUserVotes = async () => {
    if (!$firebase?.db) {
      return []
    }

    const { isAuthenticated, userProfile } = useAuthEnhanced()
    if (!isAuthenticated.value || !userProfile.value) {
      return []
    }

    try {
      const userId = userProfile.value.uid
      const userVotesCollection = collection($firebase.db, 'userVotes')
      const userVotesQuery = query(userVotesCollection, where('userId', '==', userId))
      const snapshot = await getDocs(userVotesQuery)
      
      const userVotes = snapshot.docs.map(doc => doc.data().factId)
      console.log('User votes loaded:', userVotes)
      return userVotes
    } catch (error) {
      console.error('Error loading user votes:', error)
      return []
    }
  }

  const hasUserVoted = async (factId) => {
    if (!$firebase?.db) {
      return false
    }

    const { isAuthenticated, userProfile } = useAuthEnhanced()
    if (!isAuthenticated.value || !userProfile.value) {
      return false
    }

    try {
      const userId = userProfile.value.uid
      const voteDocId = `${userId}_${factId}`
      const userVoteRef = doc($firebase.db, 'userVotes', voteDocId)
      const voteDoc = await getDoc(userVoteRef)
      return voteDoc.exists()
    } catch (error) {
      console.error('Error checking user vote:', error)
      return false
    }
  }

  return {
    isFirebaseReady,
    getFacts,
    voteFact,
    getUserVotes,
    hasUserVoted
  }
}