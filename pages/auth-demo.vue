<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-12 px-4">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          Autenticación con Google
        </h1>
        <p class="text-lg text-gray-600">
          Demo de integración con Firebase Auth
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Authentication Section -->
        <div class="bg-white rounded-2xl shadow-lg p-8">
          <h2 class="text-2xl font-bold text-gray-800 mb-6">
            Estado de Autenticación
          </h2>

          <!-- Auth Status -->
          <div class="mb-6">
            <div class="flex items-center gap-3 mb-4">
              <div 
                class="w-3 h-3 rounded-full"
                :class="isAuthenticated ? 'bg-green-500' : 'bg-red-500'"
              />
              <span class="font-medium">
                {{ isAuthenticated ? 'Autenticado' : 'No autenticado' }}
              </span>
            </div>

            <div v-if="isLoading" class="text-gray-500">
              Verificando estado de autenticación...
            </div>
          </div>

          <!-- Google Sign-in Component -->
          <GoogleSignIn
            @sign-in-success="handleSignInSuccess"
            @sign-in-error="handleSignInError"
            @sign-out-success="handleSignOutSuccess"
            @sign-out-error="handleSignOutError"
          />

          <!-- Messages -->
          <div v-if="message" class="mt-4">
            <div 
              class="p-4 rounded-lg"
              :class="messageType === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'"
            >
              {{ message }}
            </div>
          </div>
        </div>

        <!-- User Information Section -->
        <div class="bg-white rounded-2xl shadow-lg p-8">
          <h2 class="text-2xl font-bold text-gray-800 mb-6">
            Información del Usuario
          </h2>

          <div v-if="isAuthenticated && user" class="space-y-4">
            <!-- User Avatar -->
            <div class="flex items-center gap-4 mb-6">
              <div class="relative">
                <img 
                  v-if="user.photoURL" 
                  :src="user.photoURL" 
                  :alt="userDisplayName"
                  class="w-16 h-16 rounded-full object-cover border-4 border-green-200"
                />
                <div 
                  v-else 
                  class="w-16 h-16 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-xl"
                >
                  {{ userInitials }}
                </div>
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-900">{{ userDisplayName }}</h3>
                <p class="text-gray-600">{{ user.email }}</p>
              </div>
            </div>

            <!-- User Details -->
            <div class="space-y-3">
              <div class="flex justify-between py-2 border-b border-gray-100">
                <span class="font-medium text-gray-600">UID:</span>
                <span class="text-gray-900 font-mono text-sm">{{ user.uid }}</span>
              </div>
              
              <div class="flex justify-between py-2 border-b border-gray-100">
                <span class="font-medium text-gray-600">Email verificado:</span>
                <span 
                  class="px-2 py-1 rounded-full text-xs font-medium"
                  :class="user.emailVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                >
                  {{ user.emailVerified ? 'Sí' : 'No' }}
                </span>
              </div>

              <div class="flex justify-between py-2 border-b border-gray-100">
                <span class="font-medium text-gray-600">Proveedor:</span>
                <span class="text-gray-900">Google</span>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="mt-6 space-y-3">
              <button
                @click="refreshUserToken"
                :disabled="refreshingToken"
                class="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                {{ refreshingToken ? 'Actualizando...' : 'Actualizar Token' }}
              </button>

              <button
                @click="checkEmailDomain"
                class="w-full px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                Verificar Dominio de Email
              </button>
            </div>
          </div>

          <div v-else class="text-center text-gray-500 py-8">
            <svg class="w-16 h-16 mx-auto mb-4 opacity-30" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clip-rule="evenodd"/>
            </svg>
            <p>Inicia sesión para ver tu información</p>
          </div>
        </div>
      </div>

      <!-- Debug Information (Development only) -->
      <div v-if="isDevelopment" class="mt-8 bg-gray-900 text-green-400 rounded-2xl p-6">
        <h3 class="text-lg font-bold mb-4 text-white">🔧 Debug Info (Solo Desarrollo)</h3>
        <pre class="text-sm overflow-auto">{{ debugInfo }}</pre>
      </div>

      <!-- Back to Home -->
      <div class="text-center mt-12">
        <NuxtLink
          to="/"
          class="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
          Volver al Inicio
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Set page meta
definePageMeta({
  title: 'Autenticación - Demo',
  description: 'Demo de autenticación con Google y Firebase'
})

// Use the auth composable
const {
  user,
  isAuthenticated,
  isLoading,
  error,
  refreshToken,
  hasEmailDomain,
  userDisplayName,
  userInitials
} = useAuth()

// Local state
const message = ref('')
const messageType = ref('success')
const refreshingToken = ref(false)

// Development flag
const isDevelopment = process.dev

// Computed debug info
const debugInfo = computed(() => ({
  isAuthenticated: isAuthenticated.value,
  isLoading: isLoading.value,
  error: error.value,
  user: user.value ? {
    uid: user.value.uid,
    email: user.value.email,
    displayName: user.value.displayName,
    emailVerified: user.value.emailVerified
  } : null,
  timestamp: new Date().toISOString()
}))

// Helper function to show temporary messages
const showMessage = (text, type = 'success') => {
  message.value = text
  messageType.value = type
  
  setTimeout(() => {
    message.value = ''
  }, 5000)
}

// Event handlers
const handleSignInSuccess = (userData) => {
  console.log('Sign-in successful:', userData)
  showMessage(`¡Bienvenido, ${userData?.displayName || userData?.email}!`, 'success')
}

const handleSignInError = (errorMessage) => {
  console.error('Sign-in error:', errorMessage)
  showMessage(`Error: ${errorMessage}`, 'error')
}

const handleSignOutSuccess = () => {
  console.log('Sign-out successful')
  showMessage('Sesión cerrada correctamente', 'success')
}

const handleSignOutError = (errorMessage) => {
  console.error('Sign-out error:', errorMessage)
  showMessage(`Error al cerrar sesión: ${errorMessage}`, 'error')
}

// Refresh user token
const refreshUserToken = async () => {
  refreshingToken.value = true
  try {
    const token = await refreshToken()
    if (token) {
      showMessage('Token actualizado correctamente', 'success')
      console.log('New token:', token.substring(0, 20) + '...')
    } else {
      showMessage('No se pudo actualizar el token', 'error')
    }
  } catch (error) {
    showMessage(`Error: ${error.message}`, 'error')
  } finally {
    refreshingToken.value = false
  }
}

// Check email domain
const checkEmailDomain = () => {
  if (!user.value?.email) {
    showMessage('No hay email para verificar', 'error')
    return
  }

  const isGmail = hasEmailDomain('@gmail.com')
  const domain = user.value.email.split('@')[1]
  
  showMessage(
    `Email domain: ${domain} ${isGmail ? '(Gmail detectado)' : ''}`, 
    'success'
  )
}

// Watch for errors
watch(error, (newError) => {
  if (newError) {
    showMessage(newError, 'error')
  }
})
</script>

<style scoped>
pre {
  white-space: pre-wrap;
  word-break: break-word;
}
</style>