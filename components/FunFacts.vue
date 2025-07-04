<template>
  <section id="fun-facts" class="section-standard bg-gradient-to-br from-green-50 to-emerald-50 min-h-screen">
    <div class="container-standard">
      <!-- Header with modern style -->
      <div class="text-center mb-16">
        <div class="flex items-center justify-center mb-6">
          <div class="h-px bg-gradient-to-r from-transparent via-green-400 to-transparent flex-1"></div>
          <span class="px-6 text-6xl">🎭</span>
          <div class="h-px bg-gradient-to-r from-transparent via-green-400 to-transparent flex-1"></div>
        </div>
        <h2 class="text-5xl font-bold bg-gradient-to-r from-green-600 via-emerald-500 to-green-700 bg-clip-text text-transparent mb-4">
          Curiosidades del Carnaval
        </h2>
        <p class="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed">
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

      <!-- Facts Layout - Comic Bubble Style -->
      <div 
        v-else
        class="max-w-6xl mx-auto space-y-8"
      >
        <div
          v-for="(fact, index) in factsStore.facts"
          :key="fact.id"
          :class="[
            'group relative transition-all duration-700 hover:scale-105',
            index % 2 === 0 ? 'flex flex-col lg:flex-row items-start' : 'flex flex-col lg:flex-row-reverse items-start'
          ]"
          :style="{ animationDelay: `${index * 200}ms` }"
        >
          <!-- Character/Icon Side -->
          <div :class="[
            'relative flex-shrink-0 z-10',
            index % 2 === 0 ? 'lg:mr-8 mb-4 lg:mb-0' : 'lg:ml-8 mb-4 lg:mb-0'
          ]">
            <div class="relative">
              <!-- Character Circle -->
              <div class="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl border-4 border-white group-hover:shadow-green-500/30 transition-all duration-500 group-hover:scale-110">
                <span class="text-4xl animate-bounce">{{ getRandomEmoji(index) }}</span>
              </div>
              <!-- Speaking indicator -->
              <div class="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                <span class="text-xs">💬</span>
              </div>
            </div>
          </div>

          <!-- Speech Bubble -->
          <div :class="[
            'relative flex-1 min-w-0',
            index % 2 === 0 ? 'speech-bubble-right' : 'speech-bubble-left'
          ]">
            <div class="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 group-hover:shadow-2xl group-hover:border-green-200 transition-all duration-500 relative overflow-hidden">
              <!-- Background Pattern -->
              <div class="absolute inset-0 opacity-5">
                <div class="absolute top-4 right-4 text-6xl text-green-500 rotate-12">🎭</div>
                <div class="absolute bottom-4 left-4 text-4xl text-emerald-400 -rotate-12">🎪</div>
              </div>
              
              <!-- Content -->
              <div class="relative z-10">
                <!-- Fact Number Badge -->
                <div class="inline-flex items-center bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-4 py-2 rounded-full text-sm font-bold mb-4 shadow-sm">
                  <span class="text-lg mr-2">🔥</span>
                  Curiosidad #{{ index + 1 }}
                </div>

                <!-- Fact Text -->
                <p class="text-gray-700 text-lg leading-relaxed mb-6 group-hover:text-gray-800 transition-colors font-medium">
                  "{{ fact.text }}"
                </p>

                <!-- Interactive Footer -->
                <div class="flex items-center justify-between rounded-2xl p-4">
                  <!-- Vote Display -->
                  <div class="flex items-center space-x-3">
                    <div class="flex items-center bg-white rounded-full px-4 py-2 shadow-sm">
                      <svg class="w-5 h-5 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                      </svg>
                      <span class="text-sm font-bold text-gray-700">{{ fact.votes }}</span>
                      <span class="text-xs text-gray-500 ml-1">{{ fact.votes === 1 ? 'voto' : 'votos' }}</span>
                    </div>
                  </div>

                  <!-- Vote Button -->
                  <button
                    @click="factsStore.voteFact(fact.id)"
                    :disabled="factsStore.votingId === fact.id"
                    class="group/btn relative overflow-hidden bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-full font-medium transition-all duration-300 hover:scale-110 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
                    :aria-label="`Votar por curiosidad ${index + 1}`"
                  >
                    <div class="flex items-center space-x-2">
                      <span 
                        v-if="factsStore.votingId === fact.id"
                        class="inline-block animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      ></span>
                      <span v-else class="text-xl">👍</span>
                      <span class="text-sm font-medium">
                        {{ factsStore.votingId === fact.id ? 'Votando...' : '¡Me gusta!' }}
                      </span>
                    </div>
                    
                    <!-- Button sparkle effect -->
                    <div class="absolute inset-0 -top-1 -left-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover/btn:opacity-30 transform -skew-x-12 group-hover/btn:animate-pulse"></div>
                  </button>
                </div>
              </div>

              <!-- Shine effect on hover -->
              <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-10 transform -skew-x-12 group-hover:animate-shimmer pointer-events-none"></div>
            </div>
          </div>
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
    </div>
  </section>
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
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-100px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(100px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
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
    transform: translateY(-10px);
  }
}

/* Animation for facts */
.space-y-8 > div:nth-child(odd) {
  animation: slideInLeft 0.8s ease-out forwards;
  opacity: 0;
}

.space-y-8 > div:nth-child(even) {
  animation: slideInRight 0.8s ease-out forwards;
  opacity: 0;
}

/* Speech Bubble Styles */
.speech-bubble-right::before {
  content: '';
  position: absolute;
  left: -15px;
  top: 30px;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 15px 15px 15px 0;
  border-color: transparent #ffffff transparent transparent;
  filter: drop-shadow(-2px 2px 4px rgba(0, 0, 0, 0.1));
  z-index: 20;
}

.speech-bubble-left::before {
  content: '';
  position: absolute;
  right: -15px;
  top: 30px;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 15px 0 15px 15px;
  border-color: transparent transparent transparent #ffffff;
  filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.1));
  z-index: 20;
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
  animation-duration: 0.6s;
}

/* Custom shadows */
.hover\:shadow-3xl:hover {
  box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .speech-bubble-right::before,
  .speech-bubble-left::before {
    display: none;
  }
  
  .space-y-8 > div:nth-child(odd),
  .space-y-8 > div:nth-child(even) {
    animation: fadeInUp 0.8s ease-out forwards;
  }
}

/* Loading state for new layout */
.space-y-8 .animate-pulse {
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
</style>