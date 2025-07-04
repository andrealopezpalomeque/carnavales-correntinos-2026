<template>
  <section id="fun-facts" class="section-standard bg-gradient-to-br from-green-50 to-emerald-50 min-h-screen">
    <div class="container-standard">
      <!-- Header -->
      <div class="text-center mb-12">
        <h2 class="text-4xl font-bold text-gray-800 mb-4">
          🎭 Curiosidades del Carnaval
        </h2>
        <p class="text-gray-600 text-lg max-w-2xl mx-auto">
          Descubre datos fascinantes sobre la celebración más esperada del año.
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="factsStore.isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="n in 6" 
          :key="n"
          class="bg-white rounded-2xl shadow-lg p-6 animate-pulse"
        >
          <div class="h-4 bg-gray-200 rounded mb-4"></div>
          <div class="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
          <div class="h-4 bg-gray-200 rounded w-1/2"></div>
          <div class="flex justify-between items-center mt-6">
            <div class="h-6 bg-gray-200 rounded w-20"></div>
            <div class="h-8 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
      </div>

      <!-- Facts Grid -->
      <div 
        v-else
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md"
      >
        <div
          v-for="(fact, index) in factsStore.facts"
          :key="fact.id"
          class="card-feature group overflow-hidden border border-gray-100"
          :style="{ animationDelay: `${index * 100}ms` }"
        >
          <!-- Card Header -->
          <div class="bg-gradient-to-r from-green-500 to-emerald-500 h-2"></div>
          
          <!-- Card Content -->
          <div class="p-6">
            <!-- Fact Icon -->
            <div class="flex items-center mb-4">
              <div class="w-10 h-10 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center mr-3">
                <span class="text-xl">🎪</span>
              </div>
              <div class="text-sm text-gray-500 font-medium">
                Curiosidad #{{ index + 1 }}
              </div>
            </div>

            <!-- Fact Text -->
            <p class="text-gray-700 text-base leading-relaxed mb-6 group-hover:text-gray-800 transition-colors">
              {{ fact.text }}
            </p>

            <!-- Footer -->
            <div class="flex items-center justify-between">
              <!-- Vote Count -->
              <div class="flex items-center text-gray-500 whitespace-nowrap">
                <svg class="w-4 h-4 mr-1 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                </svg>
                <span class="text-sm font-medium  inline">{{ fact.votes }}</span>
                <span class="text-xs ml-1  inline">{{ fact.votes === 1 ? 'voto' : 'votos' }}</span>
              </div>

              <!-- Vote Button -->
              <button
                @click="factsStore.voteFact(fact.id)"
                :disabled="factsStore.votingId === fact.id"
                class="btn-secondary group/btn relative overflow-hidden bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                :aria-label="`Votar por curiosidad ${index + 1}`"
              >
                <div class="flex items-center space-x-2">
                  <span 
                    v-if="factsStore.votingId === fact.id"
                    class="inline-block animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  ></span>
                  <span v-else class="text-lg">👍</span>
                  <span class="text-sm">
                    {{ factsStore.votingId === fact.id ? 'Votando...' : 'Votar' }}
                  </span>
                </div>
                
                <!-- Button shine effect -->
                <div class="absolute inset-0 -top-1 -left-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover/btn:opacity-20 transform -skew-x-12 group-hover/btn:animate-pulse"></div>
              </button>
            </div>
          </div>

          <!-- Hover Effect Border -->
          <div class="absolute inset-0 border-2 border-transparent group-hover:border-green-200 rounded-2xl transition-colors duration-300 pointer-events-none"></div>
        </div>
      </div>

      <!-- Empty State -->
      <div 
        v-if="!factsStore.isLoading && factsStore.facts.length === 0"
        class="text-center py-16"
      >
        <div class="text-6xl mb-4">😢</div>
        <h3 class="text-2xl font-bold text-gray-700 mb-2">No hay curiosidades disponibles</h3>
        <p class="text-gray-500">¡Vuelve pronto para descubrir datos fascinantes!</p>
      </div>

      <!-- Stats Footer -->
      <div 
        v-if="!factsStore.isLoading && factsStore.facts.length > 0"
        class="mt-16 text-center"
      >
        <div class="card-feature max-w-md mx-auto border-t-4 border-green-500">
          <h3 class="text-lg font-bold text-gray-800 mb-2">📊 Estadísticas</h3>
          <div class="grid grid-cols-2 gap-sm">
            <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4">
              <div class="text-2xl font-bold text-green-600">{{ factsStore.facts.length }}</div>
              <div class="text-sm text-gray-600">Curiosidades</div>
            </div>
            <div class="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4">
              <div class="text-2xl font-bold text-emerald-600">
                {{ factsStore.facts.reduce((sum, fact) => sum + fact.votes, 0) }}
              </div>
              <div class="text-sm text-gray-600">Votos totales</div>
            </div>
          </div>
        </div>
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

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.grid > div {
  animation: fadeInUp 0.6s ease-out forwards;
  opacity: 0;
}

/* Custom shadow for enhanced depth */
.hover\:shadow-3xl:hover {
  box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
}
</style>