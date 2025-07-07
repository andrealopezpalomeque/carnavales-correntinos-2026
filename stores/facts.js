import { defineStore } from 'pinia'

export const useFactsStore = defineStore('facts', {
  state: () => ({
    facts: [],
    isLoading: false,
    votingId: null
  }),

  actions: {
    async fetchFacts() {
      this.isLoading = true
      try {
        console.log('Facts store: Starting fetchFacts')
        
        // Use the composable directly
        const { getFacts } = useFirebase()
        this.facts = await getFacts()
        
        console.log('Facts store: Fetched facts:', this.facts.length)
      } catch (error) {
        console.error('Facts store: Error in fetchFacts:', error)
        this.facts = []
      } finally {
        this.isLoading = false
      }
    },

    async voteFact(id) {
      this.votingId = id
      try {
        console.log('Facts store: Starting voteFact for id:', id)
        
        // Use the composable directly
        const { voteFact } = useFirebase()
        await voteFact(id)
        
        const factIndex = this.facts.findIndex(fact => fact.id === id)
        if (factIndex !== -1) {
          this.facts[factIndex].votes++
          console.log('Facts store: Updated votes for fact:', id)
        }
      } catch (error) {
        console.error('Facts store: Error in voteFact:', error)
      } finally {
        this.votingId = null
      }
    }
  }
})