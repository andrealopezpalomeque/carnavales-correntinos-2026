<template>
  <LayoutSection 
    id="fun-facts" 
    background="gradient" 
    spacing="base" 
    min-height="screen"
    container="app"
    class="relative overflow-hidden"
    aria-labelledby="fun-facts-heading"
  >
      <!-- Header with modern style -->
      <div class="text-center mb-16">
        <div class="flex items-center justify-center mb-6">
          <div class="h-px bg-gradient-to-r from-transparent via-green-400 to-transparent flex-1"></div>
          <span class="px-6 text-6xl">🎭</span>
          <div class="h-px bg-gradient-to-r from-transparent via-green-400 to-transparent flex-1"></div>
        </div>
        <h2 id="fun-facts-heading" class="text-5xl font-bold bg-gradient-to-r from-green-600 via-emerald-500 to-green-700 bg-clip-text text-transparent mb-4">
          Curiosidades del Carnaval
        </h2>
        <p class="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed">
          Descubre datos fascinantes sobre la celebración más esperada del año.
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="factsStore.isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <div 
          v-for="n in 8" 
          :key="n"
          class="bg-white rounded-2xl shadow-lg p-4 animate-pulse"
        >
          <div class="flex items-center mb-3">
            <div class="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
            <div class="h-4 bg-gray-200 rounded w-16"></div>
          </div>
          <div class="h-3 bg-gray-200 rounded mb-2"></div>
          <div class="h-3 bg-gray-200 rounded mb-3 w-3/4"></div>
          <div class="flex justify-between items-center">
            <div class="h-5 bg-gray-200 rounded w-12"></div>
            <div class="h-6 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
      </div>

      <!-- Facts Layout - Compact Cards -->
      <div 
        v-else
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-7xl mx-auto"
      >
        <div
          v-for="(fact, index) in factsStore.facts"
          :key="fact.id"
          class="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:border-green-200 border border-gray-100 overflow-hidden"
          :style="{ animationDelay: `${index * 100}ms` }"
        >
          <!-- Card Header -->
          <div class="p-4 pb-3">
            <div class="flex items-center justify-between mb-3">
              <!-- Character Icon -->
              <div class="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-md group-hover:shadow-green-500/30 transition-all duration-300 group-hover:scale-110">
                <span class="text-lg animate-bounce">{{ getRandomEmoji(index) }}</span>
              </div>
              
              <!-- Fact Number Badge -->
              <div class="inline-flex items-center bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">
                <span class="text-sm mr-1">🔥</span>
                #{{ index + 1 }}
              </div>
            </div>

            <!-- Fact Text -->
            <p class="text-gray-700 text-sm leading-relaxed group-hover:text-gray-800 transition-colors font-medium mb-3">
              "{{ fact.text }}"
            </p>
          </div>

          <!-- Card Footer -->
          <div class="px-4 pb-4">
            <div class="flex items-center justify-between">
              <!-- Vote Display -->
              <div class="flex items-center bg-gray-50 rounded-full px-3 py-1">
                <svg class="w-4 h-4 mr-1 text-green-600" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                </svg>
                <span class="text-xs font-bold text-gray-700">{{ fact.votes }}</span>
              </div>

              <!-- Vote Button -->
              <button
                @click="factsStore.voteFact(fact.id)"
                :disabled="factsStore.votingId === fact.id"
                class="group/btn relative overflow-hidden bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-3 py-2 rounded-full font-medium transition-all duration-300 hover:scale-110 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-md text-xs"
                :aria-label="`Votar por curiosidad ${index + 1}`"
              >
                <div class="flex items-center space-x-1">
                  <span 
                    v-if="factsStore.votingId === fact.id"
                    class="inline-block animate-spin w-3 h-3 border border-white border-t-transparent rounded-full"
                    aria-hidden="true"
                  ></span>
                  <span v-else class="text-sm" aria-hidden="true">👍</span>
                  <span class="text-xs font-medium">
                    {{ factsStore.votingId === fact.id ? 'Votando...' : '¡Me gusta!' }}
                  </span>
                </div>
                
                <!-- Button sparkle effect -->
                <div class="absolute inset-0 -top-1 -left-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover/btn:opacity-30 transform -skew-x-12 group-hover/btn:animate-pulse"></div>
              </button>
            </div>
          </div>

          <!-- Hover Background Pattern -->
          <div class="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none">
            <div class="absolute top-2 right-2 text-2xl text-green-500 rotate-12">🎭</div>
            <div class="absolute bottom-2 left-2 text-2xl text-emerald-400 -rotate-12">🎪</div>
          </div>

          <!-- Shine effect on hover -->
          <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-10 transform -skew-x-12 group-hover:animate-shimmer pointer-events-none"></div>
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

      <!-- Bottom Stats -->
      <div 
        v-if="!factsStore.isLoading && factsStore.facts.length > 0"
        class="mt-20 text-center"
      >
        <div class="inline-flex items-center gap-8 bg-white/70 backdrop-blur-sm border border-green-200/50 rounded-2xl px-8 py-6 shadow-lg">
          <div class="text-center">
            <div class="text-3xl font-bold text-green-600 mb-1">{{ factsStore.facts.length }}</div>
            <div class="text-sm text-gray-600">Curiosidades</div>
          </div>
          <div class="w-px h-12 bg-green-200"></div>
          <div class="text-center">
            <div class="text-3xl font-bold text-emerald-600 mb-1">
              {{ factsStore.facts.reduce((sum, fact) => sum + fact.votes, 0) }}
            </div>
            <div class="text-sm text-gray-600">Votos totales</div>
          </div>
        </div>
      </div>
  </LayoutSection>
</template>

<script setup>
import { onMounted } from 'vue'
import { useFactsStore } from '@/stores/facts'

const factsStore = useFactsStore()

// Fun emojis for each fact character
const funEmojis = ['🤯', '😱', '🤔', '😮', '🧐', '🤩', '😲', '🤗', '🎭', '🎪', '🎨', '🎯']

const getRandomEmoji = (index) => {
  return funEmojis[index % funEmojis.length]
}

onMounted(() => {
  factsStore.fetchFacts()
});
</script>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%) skewX(-12deg);
  }
  100% {
    transform: translateX(300%) skewX(-12deg);
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6px);
  }
}

/* Animation for fact cards */
.grid > div {
  animation: fadeInUp 0.6s ease-out forwards;
  opacity: 0;
}

/* Custom gradient text */
.bg-clip-text {
  -webkit-background-clip: text;
  background-clip: text;
}

/* Custom animations */
.animate-shimmer {
  animation: shimmer 2s ease-in-out;
}

.animate-bounce {
  animation: bounce 2s ease-in-out infinite;
}

/* Hover effects */
.group:hover .animate-bounce {
  animation-duration: 0.8s;
}

/* Card hover effects */
.group:hover {
  transform: translateY(-4px) scale(1.02);
}

/* Enhanced grid responsiveness */
@media (max-width: 1280px) {
  :deep(.xl\:grid-cols-4) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 1024px) {
  :deep(.lg\:grid-cols-3) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  :deep(.md\:grid-cols-2) {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
  
  .gap-4 {
    gap: 0.75rem;
  }
  
  .text-5xl {
    font-size: 2.5rem;
  }
  
  .mb-16 {
    margin-bottom: 2rem;
  }
}

@media (max-width: 480px) {
  .p-4 {
    padding: 0.75rem;
  }
  
  .pb-3 {
    padding-bottom: 0.5rem;
  }
  
  .text-sm {
    font-size: 0.8rem;
  }

  .w-10,
  .h-10 {
    width: 2rem;
    height: 2rem;
  }
}

/* Loading state animations */
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Enhanced card shadows */
.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.group:hover .shadow-lg {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Smooth transitions for all interactive elements */
.group {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Vote button enhancements */
.group [class*="group\/btn"]:hover {
  box-shadow: 0 8px 25px -5px rgba(34, 197, 94, 0.4);
}

/* Character icon glow effect */
.group:hover .bg-gradient-to-br {
  box-shadow: 0 0 20px rgba(34, 197, 94, 0.3);
}

/* Grid masonry effect for different height cards (if needed) */
.grid {
  align-items: start;
}

/* Compact spacing adjustments */
.gap-4 {
  gap: 1rem;
}

/* Ensure cards have consistent minimum height */
.group {
  min-height: 160px;
  height: fit-content;
}

/* Text size optimizations for compact cards */
.text-xs {
  font-size: 0.75rem;
  line-height: 1rem;
}

.text-sm {
  font-size: 0.875rem;
  line-height: 1.25rem;
}

/* Button scaling improvements */
.group [class*="group\/btn"]:hover {
  transform: scale(1.05);
}

/* Enhanced visual feedback */
.border-gray-100 {
  border-color: rgb(243 244 246);
}

.group:hover [class*="border-gray-100"] {
  border-color: rgb(187 247 208);
}
</style>