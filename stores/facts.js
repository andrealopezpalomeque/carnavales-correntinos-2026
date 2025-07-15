import { defineStore } from 'pinia'

export const useFactsStore = defineStore('facts', {
  state: () => ({
    facts: [],
    isLoading: false,
    votingId: null,
    userVotes: new Set(), // Track which facts user has voted on
    totalVotes: 0,
    recentVotes: [], // Track recent voting activity
    isRealTimeEnabled: false
  }),

  getters: {
    // Get facts sorted by vote count
    topFacts: (state) => {
      return [...state.facts].sort((a, b) => b.votes - a.votes)
    },
    
    // Get the most voted fact
    mostVotedFact: (state) => {
      return state.facts.reduce((prev, current) => 
        (prev.votes > current.votes) ? prev : current, state.facts[0])
    },
    
    // Check if user has voted on a fact
    hasUserVoted: (state) => (factId) => {
      return state.userVotes.has(factId)
    },
    
    // Get vote percentage for each fact
    votePercentages: (state) => {
      const total = state.totalVotes
      return state.facts.map(fact => ({
        id: fact.id,
        percentage: total > 0 ? Math.round((fact.votes / total) * 100) : 0
      }))
    }
  },

  actions: {
    async fetchFacts() {
      this.isLoading = true
      try {
        // Use the composable directly
        const { getFacts } = useFirebase()
        this.facts = await getFacts()
        this.calculateTotalVotes()
        this.loadUserVotes()
      } catch (error) {
        console.warn('Firebase not available, using sample data')
        // Fallback to sample data if Firebase is not available
        this.facts = [
          { id: '1', text: 'El Carnaval de Corrientes es el más largo de Argentina, durando más de 10 noches.', votes: 45 },
          { id: '2', text: 'La primera murga correntina fue creada en 1920 por inmigrantes europeos.', votes: 32 },
          { id: '3', text: 'El Corsódromo "Nolo Alías" puede albergar hasta 35,000 espectadores.', votes: 28 },
          { id: '4', text: 'Las comparsas correntinas pueden tener hasta 200 integrantes en escena.', votes: 19 },
          { id: '5', text: 'El carnaval correntino es declarado Fiesta Nacional desde 1997.', votes: 15 },
          { id: '6', text: 'La Sapucay es el grito característico que identifica al carnaval correntino.', votes: 12 },
          { id: '7', text: 'Las carrozas del carnaval pueden medir hasta 8 metros de altura.', votes: 8 },
          { id: '8', text: 'El primer carnaval oficial de Corrientes se celebró en 1982.', votes: 6 }
        ]
        this.calculateTotalVotes()
        this.loadUserVotes()
      } finally {
        this.isLoading = false
      }
    },

    async voteFact(id) {
      // Check if user already voted
      if (this.hasUserVoted(id)) {
        if (process.client && window.useNotifications) {
          const { notifyWarning } = useNotifications()
          notifyWarning('¡Ya votaste!', 'Solo puedes votar una vez por curiosidad')
        }
        return
      }

      this.votingId = id
      try {
        // Try to use Firebase first
        const { voteFact } = useFirebase()
        await voteFact(id)
        
        const factIndex = this.facts.findIndex(fact => fact.id === id)
        if (factIndex !== -1) {
          this.facts[factIndex].votes++
          this.userVotes.add(id)
          this.saveUserVotes()
          this.calculateTotalVotes()
          
          // Add to recent activity
          this.addRecentVote(id)
        }
        
        // Show success notification with celebration
        if (process.client && window.useNotifications) {
          const { notifySuccess } = useNotifications()
          notifySuccess('¡Gracias! 🎉', 'Tu voto ha sido registrado')
        }
      } catch (error) {
        // Fallback to local voting if Firebase is not available
        console.warn('Firebase voting not available, using local voting')
        
        // Simulate delay for better UX
        await new Promise(resolve => setTimeout(resolve, 500))
        
        const factIndex = this.facts.findIndex(fact => fact.id === id)
        if (factIndex !== -1) {
          this.facts[factIndex].votes++
          this.userVotes.add(id)
          this.saveUserVotes()
          this.calculateTotalVotes()
          
          // Add to recent activity
          this.addRecentVote(id)
        }
        
        // Show success notification
        if (process.client && window.useNotifications) {
          const { notifySuccess } = useNotifications()
          notifySuccess('¡Gracias! 🎉', 'Tu voto ha sido registrado (modo local)')
        }
      } finally {
        this.votingId = null
      }
    },

    // Calculate total votes across all facts
    calculateTotalVotes() {
      this.totalVotes = this.facts.reduce((sum, fact) => sum + fact.votes, 0)
    },

    // Save user votes to localStorage
    saveUserVotes() {
      if (process.client) {
        localStorage.setItem('userVotes', JSON.stringify([...this.userVotes]))
      }
    },

    // Load user votes from localStorage
    loadUserVotes() {
      if (process.client) {
        const saved = localStorage.getItem('userVotes')
        if (saved) {
          this.userVotes = new Set(JSON.parse(saved))
        }
      }
    },

    // Add recent vote activity
    addRecentVote(factId) {
      const fact = this.facts.find(f => f.id === factId)
      if (fact) {
        this.recentVotes.unshift({
          factId,
          factText: fact.text,
          timestamp: new Date().toISOString()
        })
        // Keep only last 10 votes
        this.recentVotes = this.recentVotes.slice(0, 10)
      }
    },

    // Enable real-time updates (could be extended with WebSockets)
    enableRealTime() {
      this.isRealTimeEnabled = true
      // In a real app, you'd set up WebSocket or Firebase real-time listeners here
    },

    // Disable real-time updates
    disableRealTime() {
      this.isRealTimeEnabled = false
    }
  }
})