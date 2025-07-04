<template>
  <div class="container-content section-hero">
    <!-- Hero Title Section -->
    <div class="text-center mb-16">
      <h1 class="text-5xl md:text-7xl text-gray-800 leading-tight mb-4 font-inter font-extralight">
        Carnavales Correntinos
        <span class="block text-secondary bg-gradient-to-r from-secondary to-accent bg-clip-text">
          2026
        </span>
      </h1>
      <p class="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
        La fiesta más colorida de Argentina está por comenzar
      </p>
    </div>

    <!-- Countdown Display -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-lg mb-12">
      <div class="text-center">
        <div class="text-6xl md:text-8xl font-bold text-primary mb-2 font-inter animate-pulse">
          {{ days }}
        </div>
        <div class="text-base md:text-lg font-semibold text-primary uppercase tracking-wider">
          Días
        </div>
      </div>
      
      <div class="text-center">
        <div class="text-6xl md:text-8xl font-bold text-primary mb-2 font-inter animate-pulse">
          {{ hours }}
        </div>
        <div class="text-base md:text-lg font-semibold text-primary uppercase tracking-wider">
          Horas
        </div>
      </div>
      
      <div class="text-center">
        <div class="text-6xl md:text-8xl font-bold text-primary mb-2 font-inter animate-pulse">
          {{ minutes }}
        </div>
        <div class="text-base md:text-lg font-semibold text-primary uppercase tracking-wider">
          Minutos
        </div>
      </div>
      
      <div class="text-center">
        <div class="text-6xl md:text-8xl font-bold text-primary mb-2 font-inter animate-pulse">
          {{ seconds }}
        </div>
        <div class="text-base md:text-lg font-semibold text-primary uppercase tracking-wider">
          Segundos
        </div>
      </div>
    </div>

    <!-- Date Info -->
    <div class="text-center">
      <p class="inline-flex items-center px-6 py-3 bg-primary-light text-primary rounded-full font-semibold text-lg border border-primary text-green-600 hover:shadow-md transition-all">
        31 de Enero • 22:00 hs
      </p>
    </div>
  </div>
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