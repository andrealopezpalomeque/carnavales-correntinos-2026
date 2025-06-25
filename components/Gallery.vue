<template>
  <section class="w-full flex flex-col items-center py-12">
    <h2 class="text-xl font-bold mb-6">Galería</h2>
    <div class="relative w-full max-w-lg flex flex-col items-center">
      <img
        :src="images[current].src"
        :alt="images[current].title"
        class="rounded-xl shadow-lg w-full object-cover h-72"
      />
      <div class="mt-2 text-center">{{ images[current].title }}</div>
      <div class="flex gap-4 mt-4">
        <button
          class="px-3 py-1 bg-primary text-white rounded hover:bg-secondary"
          @click="prev"
          :disabled="current === 0"
        >
          ⬅️
        </button>
        <button
          class="px-3 py-1 bg-primary text-white rounded hover:bg-secondary"
          @click="next"
          :disabled="current === images.length - 1"
        >
          ➡️
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const images = [
  { src: '/images/carnaval1@2x.png', title: 'Comparsa Sapucay' },
  { src: '/images/carnaval2@2x.png', title: 'Corsos 2024' },
  { src: '/images/carnaval3@2x.png', title: 'Cierre de Carnaval' },
]

const current = ref(0)
function prev() {
  if (current.value > 0) current.value--
}
function next() {
  if (current.value < images.length - 1) current.value++
}
</script>