<template>
  <nav class="bg-white shadow-md border-b border-gray-100 sticky top-0 z-50">
    <div class="container-standard">
      <div class="flex justify-between items-center h-16">
        <!-- Logo Section -->
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <!-- Carnival Logo -->
            <div class="w-12 h-12 bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300">
              <span class="text-2xl">🥳</span>
            </div>
          </div>
        </div>

        <!-- Desktop Navigation Links -->
        <div class="hidden md:flex items-center space-x-8">
          <a v-for="section in sections" :key="section.id" :href="`#${section.id}`" class="text-gray-700 hover:text-green-600 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-green-50">
            {{ section.name }} 
          </a>
        </div>

        <!-- CTA Button -->
        <div class="hidden md:block">
          <button class="btn-primary bg-green-600 text-white hover:bg-green-700 text-sm">
            Iniciar Sesión
          </button>
        </div>

        <!-- Mobile menu button -->
        <div class="md:hidden">
          <button @click="mobileMenuOpen = !mobileMenuOpen" class="text-gray-700 hover:text-green-600 focus:outline-none focus:text-green-600 transition-colors duration-200 p-2">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <div v-show="mobileMenuOpen" class="md:hidden bg-white border-t border-gray-100">
      <div class="container-standard pt-2 pb-3 space-y-1">
        <!-- Mobile Navigation Links -->
        <a v-for="section in sections" :key="section.id" :href="`#${section.id}`" @click="closeMobileMenu" class="text-gray-700 hover:text-green-600 hover:bg-green-50 block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200">
          {{ section.name }}
        </a>

        <!-- Mobile CTA Button -->
        <div class="pt-4 pb-2">
          <button @click="closeMobileMenu" class="btn-primary w-full bg-green-600 text-white hover:bg-green-700 text-base">
            Iniciar Sesión
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'

// Mobile menu state
const mobileMenuOpen = ref(false)

// Close mobile menu
const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

const sections = [
  { id: 'countdown', name: 'Cuenta Regresiva' },
  { id: 'photos', name: 'Fotos' },
  { id: 'fun-facts', name: 'Curiosidades' },
  { id: 'related-news', name: 'Noticias Relacionadas' },
]
</script>