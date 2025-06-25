<template>
  <nav class="fixed w-full bg-white shadow z-50 flex justify-center gap-8 py-4">
    <a v-for="section in sections" :key="section.id"
      :href="'#' + section.id"
      class="hover:text-primary font-semibold transition"
      >{{ section.name }}</a>
  </nav>
</template>
<script setup>
const sections = [
  { id: 'photos', name: 'Fotos' },
  { id: 'countdown', name: 'Cuenta Regresiva' },
  { id: 'fun-facts', name: 'Curiosidades' },
]
</script>
