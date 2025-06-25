import { defineStore } from 'pinia'
import FirebaseService from '@/services/index'

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
        const service = new FirebaseService()
        this.facts = await service.getFacts()
      } finally {
        this.isLoading = false
      }
    },

    async voteFact(id) {
      this.votingId = id
      try {
        const service = new FirebaseService()
        await service.voteFact(id)
        const factIndex = this.facts.findIndex(fact => fact.id === id)
        if (factIndex !== -1) {
          this.facts[factIndex].votes++
        }
      } finally {
        this.votingId = null
      }
    }
  }
})