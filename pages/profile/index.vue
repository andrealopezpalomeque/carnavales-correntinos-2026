<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4 max-w-4xl">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Mi Perfil</h1>
        <p class="text-gray-600">Gestiona tu información personal y preferencias</p>
      </div>

      <!-- Profile Component -->
      <UserProfile />

      <!-- Additional Profile Sections -->
      <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Activity Summary -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Resumen de Actividad</h3>
          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Días como miembro:</span>
              <span class="font-medium">{{ membershipDays }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Último acceso:</span>
              <span class="font-medium">{{ lastLoginFormatted }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Estado de la cuenta:</span>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="userProfile?.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                {{ userProfile?.isActive ? 'Activa' : 'Inactiva' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
          <div class="space-y-3">
            <NuxtLink 
              to="/profile/setup" 
              class="block w-full btn-secondary text-center"
              v-if="isNewUser"
            >
              Completar Configuración
            </NuxtLink>
            
            <button 
              @click="downloadProfileData"
              class="w-full btn-secondary"
              :disabled="isDownloading"
            >
              <svg v-if="isDownloading" class="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              {{ isDownloading ? 'Descargando...' : 'Descargar mis datos' }}
            </button>
            
            <button 
              @click="refreshProfileData"
              class="w-full btn-secondary"
              :disabled="isRefreshing"
            >
              <svg v-if="isRefreshing" class="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              {{ isRefreshing ? 'Actualizando...' : 'Actualizar datos' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Privacy Settings -->
      <div class="mt-8 bg-white rounded-lg shadow-md p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Configuración de Privacidad</h3>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h4 class="text-sm font-medium text-gray-900">Perfil público</h4>
              <p class="text-sm text-gray-500">Permite que otros usuarios vean tu perfil básico</p>
            </div>
            <button
              @click="toggleProfileVisibility"
              :class="userProfile?.preferences?.privacy?.showProfile ? 'bg-green-600' : 'bg-gray-200'"
              class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              <span
                :class="userProfile?.preferences?.privacy?.showProfile ? 'translate-x-5' : 'translate-x-0'"
                class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
              />
            </button>
          </div>
          
          <div class="flex items-center justify-between">
            <div>
              <h4 class="text-sm font-medium text-gray-900">Mostrar email</h4>
              <p class="text-sm text-gray-500">Permite que otros usuarios vean tu dirección de email</p>
            </div>
            <button
              @click="toggleEmailVisibility"
              :class="userProfile?.preferences?.privacy?.showEmail ? 'bg-green-600' : 'bg-gray-200'"
              class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              <span
                :class="userProfile?.preferences?.privacy?.showEmail ? 'translate-x-5' : 'translate-x-0'"
                class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
              />
            </button>
          </div>
        </div>
      </div>

      <!-- Danger Zone -->
      <div class="mt-8 bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 class="text-lg font-semibold text-red-900 mb-4">Zona de Peligro</h3>
        <p class="text-sm text-red-700 mb-4">
          Las siguientes acciones son permanentes y no se pueden deshacer.
        </p>
        <div class="space-y-3">
          <button
            @click="deactivateAccount"
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 text-sm"
          >
            Desactivar Cuenta
          </button>
          <button
            @click="deleteAccount"
            class="px-4 py-2 bg-red-800 text-white rounded-md hover:bg-red-900 transition-colors duration-200 text-sm ml-3"
          >
            Eliminar Cuenta Permanentemente
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// Page meta
definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

// SEO
useSeoMeta({
  title: 'Mi Perfil - Carnavales Correntinos 2026',
  description: 'Gestiona tu perfil y configuraciones en Carnavales Correntinos 2026'
})

// Composables
const { 
  userProfile, 
  isAuthenticated, 
  isNewUser,
  updateUserProfile,
  refreshUserProfile 
} = useAuthEnhanced()

// Local state
const isDownloading = ref(false)
const isRefreshing = ref(false)

// Computed properties
const membershipDays = computed(() => {
  if (!userProfile.value?.createdAt) return 0
  const diffTime = Math.abs(new Date() - new Date(userProfile.value.createdAt))
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
})

const lastLoginFormatted = computed(() => {
  if (!userProfile.value?.lastLoginAt) return 'Nunca'
  return new Date(userProfile.value.lastLoginAt).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
})

// Methods
const downloadProfileData = async () => {
  try {
    isDownloading.value = true
    
    // Create downloadable JSON of user data
    const userData = {
      profile: userProfile.value,
      downloadDate: new Date().toISOString(),
      version: '1.0'
    }
    
    const blob = new Blob([JSON.stringify(userData, null, 2)], { 
      type: 'application/json' 
    })
    
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `perfil-carnavales-${userProfile.value?.uid}-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
  } catch (error) {
    console.error('Error downloading profile data:', error)
  } finally {
    isDownloading.value = false
  }
}

const refreshProfileData = async () => {
  try {
    isRefreshing.value = true
    await refreshUserProfile()
  } catch (error) {
    console.error('Error refreshing profile:', error)
  } finally {
    isRefreshing.value = false
  }
}

const toggleProfileVisibility = async () => {
  if (!userProfile.value) return
  
  const newValue = !userProfile.value.preferences.privacy.showProfile
  
  await updateUserProfile({
    preferences: {
      ...userProfile.value.preferences,
      privacy: {
        ...userProfile.value.preferences.privacy,
        showProfile: newValue
      }
    }
  })
}

const toggleEmailVisibility = async () => {
  if (!userProfile.value) return
  
  const newValue = !userProfile.value.preferences.privacy.showEmail
  
  await updateUserProfile({
    preferences: {
      ...userProfile.value.preferences,
      privacy: {
        ...userProfile.value.preferences.privacy,
        showEmail: newValue
      }
    }
  })
}

const deactivateAccount = async () => {
  const confirmed = confirm('¿Estás seguro de que quieres desactivar tu cuenta? Podrás reactivarla más tarde.')
  
  if (confirmed) {
    try {
      await updateUserProfile({ isActive: false })
      alert('Tu cuenta ha sido desactivada.')
    } catch (error) {
      console.error('Error deactivating account:', error)
      alert('Error al desactivar la cuenta.')
    }
  }
}

const deleteAccount = async () => {
  const confirmed = confirm('¿Estás ABSOLUTAMENTE seguro? Esta acción eliminará permanentemente tu cuenta y todos tus datos. Escribe "ELIMINAR" para confirmar.')
  
  if (confirmed) {
    const confirmation = prompt('Escribe "ELIMINAR" para confirmar:')
    if (confirmation === 'ELIMINAR') {
      try {
        // TODO: Implement account deletion
        alert('Funcionalidad de eliminación de cuenta aún no implementada.')
      } catch (error) {
        console.error('Error deleting account:', error)
        alert('Error al eliminar la cuenta.')
      }
    }
  }
}

// Check authentication
onMounted(() => {
  if (!isAuthenticated.value) {
    navigateTo('/auth')
  }
})
</script>

<style scoped>
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