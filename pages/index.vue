<template>
  <div class="min-h-screen flex flex-col">
    <!-- Show unauthorized access component if there's an auth error indicating whitelist failure -->
    <UnauthorizedAccess 
      v-if="!isLoading && authError && authError.includes('autorizada')"
      :message="authError"
    />
    
    <!-- Normal content -->
    <div v-else>
      <main class="flex-1">
        <!-- Loading State -->
        <div v-if="isLoading" class="min-h-[60vh] flex flex-col items-center justify-center">
          <div class="flex items-center justify-center gap-3 text-gray-600">
            <svg class="animate-spin h-8 w-8" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            <span class="text-lg font-medium">Cargando...</span>
          </div>
        </div>

      <!-- Content when not loading -->
      <div v-else>
        <!-- Countdown - Always visible -->
        <section id="countdown" class="section-compact min-h-[60vh] flex flex-col items-center justify-center" aria-labelledby="countdown-heading">
          <Countdown />
        </section>

        <!-- Auth Gate Message for Non-Authenticated Users -->
        <section v-if="!isAuthenticated" class="min-h-[40vh] flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50">
          <LayoutContainer variant="app" class="w-full mx-auto text-center p-8">
            <div class="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-gray-900 mb-4">¡Contenido Exclusivo!</h2>
            <p class="text-gray-600 mb-6">
              Para acceder a fotos, curiosidades, noticias y playlists del carnaval, necesitas iniciar sesión.
            </p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 max-w-4xl mx-auto">
              <div class="flex items-center gap-4 bg-white/60 backdrop-blur-sm rounded-full px-6 py-4 border border-green-200">
                <div class="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                  <span class="text-white text-lg">🎭</span>
                </div>
                <span class="text-base font-medium text-gray-700">Galería de fotos exclusivas</span>
              </div>
              
              <div class="flex items-center gap-4 bg-white/60 backdrop-blur-sm rounded-full px-6 py-4 border border-green-200">
                <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                  <span class="text-white text-lg">📰</span>
                </div>
                <span class="text-base font-medium text-gray-700">Noticias del carnaval</span>
              </div>
              
              <div class="flex items-center gap-4 bg-white/60 backdrop-blur-sm rounded-full px-6 py-4 border border-green-200">
                <div class="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                  <span class="text-white text-lg">🎵</span>
                </div>
                <span class="text-base font-medium text-gray-700">Playlists temáticas</span>
              </div>
              
              <div class="flex items-center gap-4 bg-white/60 backdrop-blur-sm rounded-full px-6 py-4 border border-green-200">
                <div class="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                  <span class="text-white text-lg">🎪</span>
                </div>
                <span class="text-base font-medium text-gray-700">Curiosidades y datos</span>
              </div>
            </div>
          </LayoutContainer>
        </section>

        <!-- Protected Content - Only for Authenticated Users -->
        <template v-if="isAuthenticated">
          <Gallery/>
          <FunFacts/>
          <RelatedNews/>
          <SpotifyPlaylists />
        </template>
      </div>
    </main>
    <Footer />
    </div>
  </div>
</template>

<script setup>
import Countdown from '~/components/Countdown.vue'
import FunFacts from '~/components/FunFacts.vue'
import Gallery from '~/components/Gallery.vue'
import RelatedNews from '~/components/RelatedNews.vue'
import SpotifyPlaylists from '~/components/SpotifyPlaylists.vue'
import Footer from '~/components/Footer.vue'

// Authentication state
const { isAuthenticated, isLoading, error: authError } = useAuthEnhanced()
</script>
