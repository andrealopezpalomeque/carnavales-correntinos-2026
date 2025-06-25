<template>
  <div class="text-center my-8">
    <h2 class="text-2xl mb-2">¡Faltan...</h2>
    <div class="text-4xl font-bold">{{ countdown }}</div>
    <p class="mt-2">para el inicio de los Carnavales Correntinos 2026</p>
    <div class="flex flex-col md:flex-row gap-4">
      <a
        href="https://www.facebook.com/carnavalcorrentino"
        target="_blank"
        rel="noopener noreferrer"
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
      >
        Facebook
      </a>
      <a
        href="https://www.instagram.com/carnavalcorrentino/"
        target="_blank"
        rel="noopener noreferrer"
        class="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 transition-colors"
      >
        Instagram
      </a>
      <a
        href="https://www.youtube.com/c/CarnavalCorrentino"
        target="_blank"
        rel="noopener noreferrer"
        class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
      >
        YouTube
      </a>    
      <a
        href="https://www.carnavalcorrentino.com.ar"
        target="_blank"
        rel="noopener noreferrer"
        class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
      >
        Sitio Oficial
      </a>
    </div>
  </div>
</template>
<script setup>
import { useIntervalFn } from '@vueuse/core'
import { ref } from 'vue'

const targetDate = new Date('2026-01-31T22:00:00-03:00')
const countdown = ref('')
function updateCountdown() {
  const now = new Date()
  let diff = Math.max(0, targetDate - now)
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  diff -= days * 1000 * 60 * 60 * 24
  const hours = Math.floor(diff / (1000 * 60 * 60))
  diff -= hours * 1000 * 60 * 60
  const minutes = Math.floor(diff / (1000 * 60))
  diff -= minutes * 1000 * 60
  const seconds = Math.floor(diff / 1000)
  countdown.value = `${days}d ${hours}h ${minutes}m ${seconds}s`
}
useIntervalFn(updateCountdown, 1000)
updateCountdown()
</script>
