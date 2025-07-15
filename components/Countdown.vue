<template>
  <LayoutContainer variant="app" class="section-hero">
    <!-- Hero Title Section -->
    <div class="text-center mb-10">
      <h1 class="text-5xl md:text-7xl leading-tight mb-4 font-bold">
        <span class="bg-gradient-to-r from-green-600 via-emerald-500 to-green-700 bg-clip-text text-transparent">
          Carnavales Correntinos
        </span>
        <span class="block text-6xl md:text-8xl bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent font-extrabold">
          2026
        </span>
      </h1>
      <p class="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
        La fiesta más colorida de Argentina está por comenzar
      </p>
    </div>

    <!-- Countdown Display -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
      <div class="group bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl p-6 hover:bg-white transition-all duration-500 hover:border-green-400/50 hover:shadow-xl hover:shadow-green-500/10 shadow-lg hover:scale-105">
        <div class="text-center">
          <div class="text-5xl md:text-7xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2 font-inter group-hover:scale-110 transition-transform duration-300">
            {{ days }}
          </div>
          <div class="text-base md:text-lg font-semibold text-green-600 uppercase tracking-wider">
            Días
          </div>
        </div>
      </div>
      
      <div class="group bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl p-6 hover:bg-white transition-all duration-500 hover:border-green-400/50 hover:shadow-xl hover:shadow-green-500/10 shadow-lg hover:scale-105">
        <div class="text-center">
          <div class="text-5xl md:text-7xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2 font-inter group-hover:scale-110 transition-transform duration-300">
            {{ hours }}
          </div>
          <div class="text-base md:text-lg font-semibold text-green-600 uppercase tracking-wider">
            Horas
          </div>
        </div>
      </div>
      
      <div class="group bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl p-6 hover:bg-white transition-all duration-500 hover:border-green-400/50 hover:shadow-xl hover:shadow-green-500/10 shadow-lg hover:scale-105">
        <div class="text-center">
          <div class="text-5xl md:text-7xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2 font-inter group-hover:scale-110 transition-transform duration-300">
            {{ minutes }}
          </div>
          <div class="text-base md:text-lg font-semibold text-green-600 uppercase tracking-wider">
            Minutos
          </div>
        </div>
      </div>
      
      <div class="group bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl p-6 hover:bg-white transition-all duration-500 hover:border-green-400/50 hover:shadow-xl hover:shadow-green-500/10 shadow-lg hover:scale-105">
        <div class="text-center">
          <div class="text-5xl md:text-7xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2 font-inter group-hover:scale-110 transition-transform duration-300">
            {{ seconds }}
          </div>
          <div class="text-base md:text-lg font-semibold text-green-600 uppercase tracking-wider">
            Segundos
          </div>
        </div>
      </div>
    </div>

    <!-- Date Info -->
    <div class="text-center">
      <p class="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm border border-green-200/50 text-green-700 rounded-full font-semibold text-lg hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 hover:scale-105">
        31 de Enero • 22:00 hs
      </p>
    </div>
  </LayoutContainer>
</template>

<script setup>
import { useIntervalFn } from '@vueuse/core'
import { ref } from 'vue'

const targetDate = new Date('2026-01-31T22:00:00-03:00')

const days = ref(0)
const hours = ref(0)
const minutes = ref(0)
const seconds = ref(0)

function updateCountdown() {
  const now = new Date()
  let diff = Math.max(0, targetDate.getTime() - now.getTime())

  days.value = Math.floor(diff / (1000 * 60 * 60 * 24))
  diff -= days.value * 1000 * 60 * 60 * 24

  hours.value = Math.floor(diff / (1000 * 60 * 60))
  diff -= hours.value * 1000 * 60 * 60

  minutes.value = Math.floor(diff / (1000 * 60))
  diff -= minutes.value * 1000 * 60

  seconds.value = Math.floor(diff / 1000)
}

useIntervalFn(updateCountdown, 1000)
updateCountdown()
</script>

<style scoped>
/* Custom gradient text */
.bg-clip-text {
  -webkit-background-clip: text;
  background-clip: text;
}

/* Glass morphism effect enhancement */
.backdrop-blur-sm {
  backdrop-filter: blur(8px);
}

/* Enhanced hover animations */
.group:hover {
  transform: translateY(-4px);
}

/* Custom transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.duration-300 {
  transition-duration: 300ms;
}

.duration-500 {
  transition-duration: 500ms;
}
</style>