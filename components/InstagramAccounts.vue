<template>
  <LayoutSection 
    id="instagram-accounts" 
    background="white" 
    spacing="base" 
    min-height="auto"
    container="app"
    class="relative overflow-hidden"
  >
    <!-- Header -->
    <div class="text-center mb-12">
      <div class="inline-flex items-center gap-3 mb-6">
        <div class="w-12 h-12 bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-500 rounded-xl flex items-center justify-center">
          <svg class="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        </div>
        <h2 class="text-3xl font-bold text-gray-900">Síguenos en Instagram</h2>
      </div>
      <p class="text-gray-600 max-w-2xl mx-auto">
        Mantente al día con las últimas novedades del Carnaval Correntino 2026
      </p>
    </div>

    <!-- Enhanced Call to Action -->
    <div class="max-w-5xl mx-auto">
      <!-- Main CTA Section -->
      <div class="bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 rounded-3xl p-8 md:p-12 mb-8">
        <div class="text-center mb-10">
          <div class="text-6xl mb-6">📱✨</div>
          <h3 class="text-3xl font-bold text-gray-900 mb-4">
            ¡No te pierdas nada del Carnaval!
          </h3>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            Sigue nuestras cuentas oficiales para estar al día con preparativos, ensayos, noticias y toda la magia del carnaval.
          </p>
        </div>

        <!-- Instagram Accounts Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div
            v-for="(account, index) in instagramAccounts"
            :key="account.id"
            class="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 border border-gray-100"
            :style="{ animationDelay: `${index * 200}ms` }"
          >
            <!-- Account Header -->
            <div class="flex items-center gap-4 mb-4">
              <div class="relative">
                <div class="w-16 h-16 bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-500 rounded-full p-0.5">
                  <div class="w-full h-full bg-white rounded-full p-0.5">
                    <div 
                      class="w-full h-full rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-2xl"
                    >
                      {{ account.emoji }}
                    </div>
                  </div>
                </div>
                <!-- Verified badge -->
                <div v-if="account.verified" class="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                  <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </div>
              </div>
              <div>
                <h4 class="font-bold text-gray-900">{{ account.username }}</h4>
                <p class="text-sm text-gray-500">{{ account.followers }} seguidores</p>
              </div>
            </div>

            <!-- Account Description -->
            <p class="text-gray-600 text-sm mb-4 leading-relaxed">
              {{ account.description }}
            </p>

            <!-- Account Preview -->
            <div class="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 mb-4">
              <div class="flex items-center gap-2 text-xs text-gray-500 mb-2">
                <span>📷</span>
                <span>Vista previa</span>
              </div>
              <div class="text-sm text-gray-700">
                "{{ account.preview }}"
              </div>
            </div>

            <!-- Follow Button -->
            <button
              @click="openInstagram(account.url)"
              class="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <span>Seguir {{ account.username }}</span>
            </button>
          </div>
        </div>

        <!-- Additional Benefits -->
        <div class="bg-white rounded-2xl p-6 border border-gray-100">
          <h4 class="text-lg font-semibold text-gray-900 mb-4 text-center">¿Qué vas a encontrar?</h4>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="text-center">
              <div class="text-3xl mb-2">🎭</div>
              <div class="font-medium text-gray-900 mb-1">Preparativos exclusivos</div>
              <div class="text-sm text-gray-600">Ensayos, vestuarios y detrás de escena</div>
            </div>
            <div class="text-center">
              <div class="text-3xl mb-2">📸</div>
              <div class="font-medium text-gray-900 mb-1">Fotos y videos únicos</div>
              <div class="text-sm text-gray-600">Momentos especiales del carnaval</div>
            </div>
            <div class="text-center">
              <div class="text-3xl mb-2">🎪</div>
              <div class="font-medium text-gray-900 mb-1">Noticias en tiempo real</div>
              <div class="text-sm text-gray-600">Últimas novedades y anuncios</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </LayoutSection>
</template>

<script setup>
// Instagram accounts data for the Call to Action section
const instagramAccounts = [
  {
    id: 1,
    username: "@carnavalcorrientes",
    emoji: "🎭",
    url: "https://instagram.com/carnavalcorrientes",
    verified: true,
    followers: "45.2K",
    description: "Cuenta oficial del Carnaval de Corrientes. Capital Nacional del Carnaval. Noticias, preparativos y toda la magia del carnaval correntino.",
    preview: "¡La preparación para el Carnaval 2026 ya comenzó! Ensayos intensivos en el Corsódromo..."
  },
  {
    id: 2,
    username: "@correntesturismo",
    emoji: "🏖️",
    url: "https://instagram.com/correntesturismo",
    verified: true,
    followers: "28.7K",
    description: "Descubre la magia de Corrientes. Turismo, cultura y tradiciones que enamoran. Información turística oficial de la provincia.",
    preview: "Los colores de Corrientes se preparan para brillar nuevamente en el carnaval más esperado..."
  },
  {
    id: 3,
    username: "@sapucayoficial",
    emoji: "🐓",
    url: "https://www.instagram.com/sapucayoficial/",
    verified: false,
    followers: "12.4K",
    description: "Comparsa Sapucay - Pasión, color y alegría en cada paso. Siguenos para no perderte nuestros ensayos y presentaciones.",
    preview: "¡Sapucay se alista para volver a conquistar el corsódromo! Nuevos vestuarios y coreografías..."
  }
]

// Method to open Instagram
const openInstagram = (url) => {
  window.open(url, '_blank', 'noopener,noreferrer')
}
</script>

<style scoped>
/* Card animation */
.grid > div {
  animation: slideInUp 0.6s ease-out forwards;
  opacity: 0;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Button effects */
button:active {
  transform: scale(0.95);
}

/* Smooth transitions */
* {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}
</style>