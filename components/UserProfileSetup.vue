<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <div class="mx-auto h-16 w-16 bg-green-500 rounded-full flex items-center justify-center">
          <span class="text-2xl">👋</span>
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          ¡Bienvenido!
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Completa tu perfil para personalizar tu experiencia
        </p>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6">
        <!-- Progress Bar -->
        <div class="mb-6">
          <div class="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progreso del perfil</span>
            <span>{{ progressPercentage }}%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div 
              class="bg-green-600 h-2 rounded-full transition-all duration-300"
              :style="{ width: progressPercentage + '%' }"
            ></div>
          </div>
        </div>

        <!-- Current User Info -->
        <div class="flex items-center mb-6 p-3 bg-gray-50 rounded-lg">
          <img 
            v-if="authUser?.photoURL" 
            :src="authUser.photoURL" 
            :alt="authUser.displayName || 'Usuario'"
            class="w-12 h-12 rounded-full object-cover border-2 border-gray-200 aspect-square"
          />
          <div 
            v-else 
            class="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center text-lg font-bold aspect-square"
          >
            {{ getInitials(authUser?.displayName || authUser?.email || 'U') }}
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-gray-900">
              {{ authUser?.displayName || authUser?.email }}
            </p>
            <p class="text-xs text-gray-500">{{ authUser?.email }}</p>
          </div>
        </div>

        <!-- Setup Form -->
        <form @submit.prevent="completeSetup" class="space-y-4" aria-labelledby="setup-form-heading">
          <h3 id="setup-form-heading" class="sr-only">Formulario de configuración de perfil</h3>
          <!-- Display Name -->
          <div>
            <label for="display-name" class="block text-sm font-medium text-gray-700 mb-1">
              Nombre para mostrar *
            </label>
            <input
              id="display-name"
              v-model="formData.displayName"
              type="text"
              required
              aria-required="true"
              aria-describedby="display-name-help"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="¿Cómo te gusta que te llamen?"
            />
            <p id="display-name-help" class="sr-only">Este será el nombre que otros usuarios vean</p>
          </div>

          <!-- First Name -->
          <div>
            <label for="first-name" class="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <input
              id="first-name"
              v-model="formData.firstName"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Tu nombre"
            />
          </div>

          <!-- Last Name -->
          <div>
            <label for="last-name" class="block text-sm font-medium text-gray-700 mb-1">
              Apellido
            </label>
            <input
              id="last-name"
              v-model="formData.lastName"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Tu apellido"
            />
          </div>

          <!-- Bio -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Sobre ti
            </label>
            <textarea
              v-model="formData.bio"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Cuéntanos un poco sobre ti..."
            />
          </div>

          <!-- Carnival Preferences -->
          <div class="border-t pt-4">
            <h3 class="text-lg font-medium text-gray-900 mb-3">🎉 Preferencias de Carnaval</h3>
            
            <!-- Favorite Comparsa -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                ¿Cuál es tu comparsa favorita?
              </label>
              <select
                v-model="formData.favoriteComparsa"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Seleccionar comparsa...</option>
                <option value="Ara Berá">Ara Berá</option>
                <option value="Sapucay">Sapucay</option>
                <option value="Copacabana">Copacabana</option>
                <option value="Arandú Beleza">Arandú Beleza</option>
              </select>
              <p class="text-xs text-gray-500 mt-1">Las cuatro comparsas que compiten por el título principal</p>
            </div>

            <!-- Favorite Agrupacion -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                ¿Cuál es tu agrupación musical favorita?
              </label>
              <select
                v-model="formData.favoriteAgrupacion"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Seleccionar agrupación...</option>
                <option value="Samba Show">Samba Show</option>
                <option value="Samba Total">Samba Total</option>
                <option value="Imperio Bahiano">Imperio Bahiano</option>
                <option value="Kamandukahia">Kamandukahia</option>
                <option value="Sambanda">Sambanda</option>
              </select>
              <p class="text-xs text-gray-500 mt-1">Agrupaciones con batería y estilo samba enredo</p>
            </div>
          </div>

          <!-- Preferences -->
          <div class="border-t pt-4">
            <h3 class="text-lg font-medium text-gray-900 mb-3">Preferencias</h3>
            
            <!-- Theme -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Tema preferido
              </label>
              <select
                v-model="formData.preferences.theme"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="system">Seguir sistema</option>
                <option value="light">Claro</option>
                <option value="dark">Oscuro</option>
              </select>
            </div>

            <!-- Language -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Idioma
              </label>
              <select
                v-model="formData.preferences.language"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="es">Español</option>
                <option value="en">English</option>
              </select>
            </div>

            <!-- Notifications -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Notificaciones
              </label>
              <div class="space-y-2">
                <label class="flex items-center">
                  <input
                    v-model="formData.preferences.notifications.email"
                    type="checkbox"
                    class="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span class="ml-2 text-sm text-gray-700">Recibir notificaciones por email</span>
                </label>
                <label class="flex items-center">
                  <input
                    v-model="formData.preferences.notifications.push"
                    type="checkbox"
                    class="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span class="ml-2 text-sm text-gray-700">Notificaciones push</span>
                </label>
              </div>
            </div>

            <!-- Privacy -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Privacidad
              </label>
              <div class="space-y-2">
                <label class="flex items-center">
                  <input
                    v-model="formData.preferences.privacy.showProfile"
                    type="checkbox"
                    class="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span class="ml-2 text-sm text-gray-700">Hacer mi perfil público</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="bg-red-50 border border-red-200 rounded-md p-3">
            <p class="text-red-700 text-sm">{{ error }}</p>
          </div>

          <!-- Action Buttons -->
          <div class="flex space-x-3 pt-4">
            <button
              type="button"
              @click="skipSetup"
              class="flex-1 btn-secondary"
              :disabled="isLoading"
            >
              Saltar por ahora
            </button>
            <button
              type="submit"
              class="flex-1 btn-primary bg-green-600 hover:bg-green-700"
              :disabled="isLoading"
            >
              <span v-if="isLoading" class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Guardando...
              </span>
              <span v-else>Completar Perfil</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { UpdateUserProfileData } from '~/types/user'

// Composables
const { 
  authUser, 
  isAuthenticated, 
  isLoading: isAuthLoading,
  profileError,
  updateUserProfile,
  refreshUserProfile
} = useAuthEnhanced()

// Local state
const isLoading = ref(false)
const error = ref('')

// Form data (using UpdateUserProfileData to include displayName)
const formData = ref<UpdateUserProfileData>({
  displayName: '',
  firstName: '',
  lastName: '',
  bio: '',
  favoriteComparsa: undefined,
  favoriteAgrupacion: undefined,
  preferences: {
    theme: 'system',
    language: 'es',
    notifications: {
      email: true,
      push: true,
      marketing: false
    },
    privacy: {
      showEmail: false,
      showProfile: true
    }
  }
})

// Computed
const progressPercentage = computed(() => {
  const fields = [
    formData.value.displayName,
    formData.value.firstName,
    formData.value.lastName,
    formData.value.bio,
    formData.value.favoriteComparsa,
    formData.value.favoriteAgrupacion
  ]
  
  const filledFields = fields.filter(field => field && field.trim() !== '').length
  return Math.round((filledFields / fields.length) * 100)
})

// Methods
const getInitials = (name: string): string => {
  return name.split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('')
}

const completeSetup = async () => {
  if (!formData.value.displayName?.trim()) {
    error.value = 'El nombre para mostrar es obligatorio'
    return
  }

  try {
    isLoading.value = true
    error.value = ''

    const result = await updateUserProfile(formData.value)
    
    if (result.success) {
      // Mark user as no longer new
      const markAsNotNewResult = await updateUserProfile({ isNewUser: false })
      
      if (markAsNotNewResult.success) {
        // Redirect to dashboard or home
        await navigateTo('/')
      } else {
        error.value = markAsNotNewResult.error || 'Error al finalizar configuración'
      }
    } else {
      error.value = result.error || 'Error al completar el perfil'
    }
  } catch (err) {
    error.value = 'Error inesperado al completar el perfil'
  } finally {
    isLoading.value = false
  }
}

const skipSetup = async () => {
  try {
    isLoading.value = true
    
    // Mark user as no longer new but keep minimal profile
    await updateUserProfile({ 
      isNewUser: false,
      displayName: authUser.value?.displayName || authUser.value?.email || 'Usuario'
    })
    
    // Redirect to dashboard or home
    await navigateTo('/')
  } catch (err) {
    console.error('Error skipping setup:', err)
  } finally {
    isLoading.value = false
  }
}

// Initialize form with auth user data
onMounted(() => {
  // Authentication is handled by page middleware
  if (authUser.value) {
    formData.value.displayName = authUser.value.displayName || authUser.value.email || ''
    
    // Try to split display name into first and last name
    if (authUser.value.displayName) {
      const nameParts = authUser.value.displayName.split(' ')
      if (nameParts.length >= 2) {
        formData.value.firstName = nameParts[0]
        formData.value.lastName = nameParts.slice(1).join(' ')
      }
    }
  }
})
</script>

<style scoped>
.btn-primary {
  @apply px-4 py-2 rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2;
}

.btn-secondary {
  @apply px-4 py-2 rounded-md font-medium border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500;
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