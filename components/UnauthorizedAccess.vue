<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <!-- Warning Icon -->
        <div class="mx-auto h-20 w-20 bg-red-100 rounded-full flex items-center justify-center">
          <svg class="h-10 w-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        
        <!-- Title -->
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
          Acceso No Autorizado
        </h2>
        
        <!-- Message -->
        <p class="mt-4 text-base text-gray-600 leading-relaxed">
          {{ message }}
        </p>
        
        <!-- Additional Info -->
        <div class="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p class="text-sm text-yellow-800">
            <strong>¿Crees que esto es un error?</strong><br>
            Contacta al administrador del sistema con tu dirección de email para solicitar acceso.
          </p>
        </div>
        
        <!-- Contact Information -->
        <div class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 class="text-sm font-medium text-blue-900 mb-2">Información de Contacto</h3>
          <p class="text-sm text-blue-800">
            Email: <a href="mailto:andrealopezpalomeque@gmail.com" class="underline hover:text-blue-600">andrealopezpalomeque@gmail.com</a>
          </p>
        </div>
        
        <!-- Actions -->
        <div class="mt-8 space-y-3">
          <button
            @click="tryAgain"
            class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
          >
            Intentar de Nuevo
          </button>
          
          <button
            @click="goHome"
            class="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
          >
            Volver al Inicio
          </button>
        </div>
        
        <!-- Debug Info (only in development) -->
        <div v-if="isDev && debugInfo" class="mt-8 p-4 bg-gray-100 border border-gray-300 rounded-lg text-left">
          <h3 class="text-sm font-medium text-gray-900 mb-2">Información de Debug</h3>
          <pre class="text-xs text-gray-700 whitespace-pre-wrap">{{ debugInfo }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  message?: string
  debugInfo?: string
}

const props = withDefaults(defineProps<Props>(), {
  message: 'Tu dirección de email no está autorizada para acceder a esta aplicación.',
  debugInfo: ''
})

const isDev = computed(() => process.dev)

const tryAgain = () => {
  // Clear any cached auth state and reload
  localStorage.clear()
  sessionStorage.clear()
  window.location.reload()
}

const goHome = () => {
  navigateTo('/')
}
</script>