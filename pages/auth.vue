<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Header -->
      <div class="text-center">
        <div class="mx-auto h-20 w-20 bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 rounded-full flex items-center justify-center shadow-lg mb-6">
          <span class="text-3xl">🥳</span>
        </div>
        <h2 class="text-3xl font-extrabold text-gray-900 mb-2">
          ¡Bienvenido!
        </h2>
        <p class="text-gray-600">
          Inicia sesión para acceder al contenido exclusivo de Carnavales Correntinos 2026
        </p>
      </div>

      <!-- Auth Section -->
      <div class="bg-white rounded-xl shadow-lg p-8">
        <!-- Loading State -->
        <div v-if="isLoading" class="text-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p class="text-gray-600">Cargando...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <div class="flex">
            <svg class="h-5 w-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
            </svg>
            <div>
              <h3 class="text-sm font-medium text-red-800">Error de autenticación</h3>
              <p class="text-sm text-red-700 mt-1">{{ error }}</p>
            </div>
          </div>
        </div>

        <!-- Already authenticated -->
        <div v-else-if="isAuthenticated" class="text-center py-8">
          <div class="text-green-600 text-5xl mb-4">✅</div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">¡Ya tienes sesión iniciada!</h3>
          <p class="text-gray-600 mb-6">Serás redirigido automáticamente...</p>
          <NuxtLink to="/" class="btn-primary bg-green-600 hover:bg-green-700">
            Ir al inicio
          </NuxtLink>
        </div>

        <!-- Sign In Form -->
        <div v-else class="space-y-6">
          <div class="text-center">
            <h3 class="text-lg font-medium text-gray-900 mb-2">Iniciar Sesión</h3>
            <p class="text-sm text-gray-600">
              Usa tu cuenta de Google para acceder
            </p>
          </div>

          <!-- Google Sign In Button -->
          <button
            @click="handleSignIn"
            :disabled="isSigningIn"
            class="w-full flex justify-center items-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <svg v-if="isSigningIn" class="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            <svg v-else class="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>{{ isSigningIn ? 'Iniciando sesión...' : 'Continuar con Google' }}</span>
          </button>

          <!-- Info Section -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="text-sm font-medium text-gray-900 mb-2">¿Por qué necesito iniciar sesión?</h4>
            <ul class="text-xs text-gray-600 space-y-1">
              <li>• Acceso a fotos exclusivas del carnaval</li>
              <li>• Noticias y actualizaciones en tiempo real</li>
              <li>• Playlists temáticas de música carnavalera</li>
              <li>• Datos curiosos y estadísticas</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Back to Home -->
      <div class="text-center">
        <NuxtLink 
          to="/" 
          class="text-sm text-gray-600 hover:text-green-600 transition-colors duration-200"
        >
          ← Volver al inicio
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

// Page meta
definePageMeta({
  middleware: 'guest', // Only show to non-authenticated users
  layout: 'default'
})

// SEO
useSeoMeta({
  title: 'Iniciar Sesión - Carnavales Correntinos 2026',
  description: 'Inicia sesión para acceder al contenido exclusivo de Carnavales Correntinos 2026'
})

// Composables
const { 
  isAuthenticated, 
  isLoading, 
  error, 
  signInWithGoogle, 
  userDisplayName 
} = useAuthEnhanced()

const { notifyAuthSuccess, notifyAuthError } = useNotifications()

// Local state
const isSigningIn = ref(false)

// Methods
const handleSignIn = async () => {
  try {
    isSigningIn.value = true
    const result = await signInWithGoogle()
    
    if (result.success) {
      notifyAuthSuccess(`¡Bienvenido, ${userDisplayName.value}!`)
      // Redirect will happen automatically via auth watcher
    } else {
      notifyAuthError(result.error || 'Error al iniciar sesión')
    }
  } catch (error) {
    console.error('Error during sign in:', error)
    notifyAuthError('Error inesperado al iniciar sesión')
  } finally {
    isSigningIn.value = false
  }
}

// Watch for authentication changes
watch(isAuthenticated, (authenticated) => {
  if (authenticated) {
    // Redirect to home page after successful authentication
    setTimeout(() => {
      navigateTo('/')
    }, 1000)
  }
}, { immediate: true })
</script>

<style scoped>
.btn-primary {
  @apply px-6 py-3 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>