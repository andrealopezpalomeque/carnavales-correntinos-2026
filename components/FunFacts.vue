<template>
  <section id="fun-facts" class="py-12 flex flex-col items-center">
    <h2 class="text-xl font-bold mb-6">Curiosidades del Carnaval</h2>
    <div v-if="factsStore.isLoading" class="text-center py-4">
      Cargando curiosidades...
    </div>
    <div 
      v-else
      v-for="fact in factsStore.facts" 
      :key="fact.id" 
      class="bg-white rounded-lg shadow p-4 m-2 w-full max-w-md flex justify-between items-center"
    >
      <span>{{ fact.text }}</span>
      <div class="flex items-center">
        <span class="text-gray-500 mr-2 text-sm">{{ fact.votes }} votos</span>
        <button
          class="flex items-center bg-primary text-white px-3 py-1 rounded hover:bg-secondary transition-colors"
          @click="factsStore.voteFact(fact.id)"
          :disabled="factsStore.votingId === fact.id"
          aria-label="Votar por esta curiosidad"
        >
          <span class="mr-1">👍</span>
          <span v-if="factsStore.votingId === fact.id">...</span>
          <span v-else>Votar</span>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue'
import { useFactsStore } from '@/stores/facts'

const factsStore = useFactsStore()

onMounted(() => {
  factsStore.fetchFacts()
});
</script>