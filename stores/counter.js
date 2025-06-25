import { defineStore } from 'pinia'
export const useFunFactsStore = defineStore('funfacts', {
  state: () => ({
    facts: [
      "El Carnaval de Corrientes es considerado el más antiguo del país.",
      "Corrientes es conocida como la Capital Nacional del Carnaval.",
      // ...add more facts!
    ]
  }),
})
