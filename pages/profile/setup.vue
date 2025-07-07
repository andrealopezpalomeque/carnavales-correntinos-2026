<template>
  <div>
    <UserProfileSetup />
  </div>
</template>

<script setup>
// Page meta
definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

// SEO
useSeoMeta({
  title: 'Configurar Perfil - Carnavales Correntinos 2026',
  description: 'Completa tu perfil para personalizar tu experiencia en Carnavales Correntinos 2026'
})
</script>