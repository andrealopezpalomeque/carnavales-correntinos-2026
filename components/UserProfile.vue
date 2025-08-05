<template>
  <div class="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto" role="main" aria-labelledby="profile-heading">
    <div class="flex items-center justify-between mb-6">
      <h2 id="profile-heading" class="text-2xl font-bold text-gray-900">Mi Perfil</h2>
      <button
        @click="toggleEditMode"
        class="btn-secondary text-sm"
        :disabled="isLoading"
        :aria-label="isEditMode ? 'Cancelar edición de perfil' : 'Editar perfil'"
      >
        {{ isEditMode ? 'Cancelar' : 'Editar' }}
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" aria-hidden="true"></div>
      <span class="ml-2 text-gray-600">Cargando perfil...</span>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
      <p class="text-red-700">{{ error }}</p>
      <button
        @click="refreshProfile"
        class="mt-2 text-sm text-red-600 hover:text-red-800 underline"
        aria-label="Reintentar carga del perfil"
      >
        Reintentar
      </button>
    </div>

    <!-- No Profile State -->
    <div v-else-if="!userProfile && !isLoading" class="text-center py-8">
      <p class="text-gray-600 mb-4">No se pudo cargar el perfil</p>
      <button
        @click="refreshProfile"
        class="btn-primary bg-green-600 hover:bg-green-700"
        aria-label="Intentar cargar el perfil nuevamente"
      >
        Intentar de nuevo
      </button>
    </div>

    <!-- Profile Content -->
    <div v-else-if="userProfile">
      <!-- Avatar Section -->
      <div class="flex flex-col sm:flex-row sm:items-start mb-6 space-y-4 sm:space-y-0">
        <div class="flex-shrink-0 self-center sm:self-start">
          <div :class="{ 'mb-12': isEditMode }">
            <AvatarUploadSimple
              :current-url="userProfile.photoURL"
              :alt-text="userDisplayName"
              :initials="userInitials"
              :show-edit-button="isEditMode"
              :show-actions="isEditMode"
              size="lg"
              @upload-success="handleAvatarUpload"
              @upload-error="handleAvatarError"
              @remove-avatar="handleAvatarRemove"
            />
          </div>
        </div>
        
        <div class="sm:ml-4 text-center sm:text-left min-w-0 flex-1">
          <h3 class="text-xl font-semibold text-gray-900 truncate">{{ userDisplayName }}</h3>
          <p class="text-gray-600 truncate">{{ userProfile.email }}</p>
          <span 
            v-if="isNewUser"
            class="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mt-1"
          >
            Nuevo Usuario
          </span>
        </div>
      </div>

      <!-- Profile Form -->
      <form @submit.prevent="saveProfile" class="space-y-4">
        <!-- Display Name -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Nombre para mostrar
          </label>
          <input
            v-model="formData.displayName"
            :disabled="!isEditMode"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-50"
            placeholder="Tu nombre completo"
          />
        </div>

        <!-- First Name -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <input
              v-model="formData.firstName"
              :disabled="!isEditMode"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-50"
              placeholder="Tu nombre"
            />
          </div>

          <!-- Last Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Apellido
            </label>
            <input
              v-model="formData.lastName"
              :disabled="!isEditMode"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-50"
              placeholder="Tu apellido"
            />
          </div>
        </div>

        <!-- Bio -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Biografía
          </label>
          <textarea
            v-model="formData.bio"
            :disabled="!isEditMode"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-50"
            placeholder="Cuéntanos sobre ti..."
          />
        </div>

        <!-- Carnival Preferences -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Favorite Comparsa -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Comparsa Favorita
            </label>
            <select
              v-model="formData.favoriteComparsa"
              :disabled="!isEditMode"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-50"
            >
              <option value="">Seleccionar comparsa...</option>
              <option value="Ara Berá">Ara Berá</option>
              <option value="Sapucay">Sapucay</option>
              <option value="Copacabana">Copacabana</option>
              <option value="Arandú Beleza">Arandú Beleza</option>
            </select>
          </div>

          <!-- Favorite Agrupacion -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Agrupación Musical Favorita
            </label>
            <select
              v-model="formData.favoriteAgrupacion"
              :disabled="!isEditMode"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-50"
            >
              <option value="">Seleccionar agrupación...</option>
              <option value="Samba Show">Samba Show</option>
              <option value="Samba Total">Samba Total</option>
              <option value="Imperio Bahiano">Imperio Bahiano</option>
              <option value="Kamandukahia">Kamandukahia</option>
              <option value="Sambanda">Sambanda</option>
            </select>
          </div>
        </div>

        <!-- Preferences -->
        <div v-if="isEditMode" class="border-t pt-4">
          <h4 class="text-lg font-medium text-gray-900 mb-3">Preferencias</h4>
          
          <!-- Theme -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Tema
            </label>
            <select
              v-model="formData.preferences.theme"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="light">Claro</option>
              <option value="dark">Oscuro</option>
              <option value="system">Sistema</option>
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
                <span class="ml-2 text-sm text-gray-700">Notificaciones por email</span>
              </label>
              <label class="flex items-center">
                <input
                  v-model="formData.preferences.notifications.push"
                  type="checkbox"
                  class="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span class="ml-2 text-sm text-gray-700">Notificaciones push</span>
              </label>
              <label class="flex items-center">
                <input
                  v-model="formData.preferences.notifications.marketing"
                  type="checkbox"
                  class="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span class="ml-2 text-sm text-gray-700">Comunicaciones de marketing</span>
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
                  v-model="formData.preferences.privacy.showEmail"
                  type="checkbox"
                  class="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span class="ml-2 text-sm text-gray-700">Mostrar email en perfil público</span>
              </label>
              <label class="flex items-center">
                <input
                  v-model="formData.preferences.privacy.showProfile"
                  type="checkbox"
                  class="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span class="ml-2 text-sm text-gray-700">Perfil público visible</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Save Button -->
        <div v-if="isEditMode" class="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            @click="cancelEdit"
            class="btn-secondary"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="isSaving"
            class="btn-primary bg-green-600 hover:bg-green-700"
          >
            <span v-if="isSaving" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              Guardando...
            </span>
            <span v-else>Guardar Cambios</span>
          </button>
        </div>
      </form>

      <!-- Profile Stats -->
      <div class="border-t pt-4 mt-6">
        <h4 class="text-lg font-medium text-gray-900 mb-3">Información de la Cuenta</h4>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span class="text-gray-600">Miembro desde:</span>
            <p class="font-medium">{{ formatCreationDate() }}</p>
          </div>
          <div>
            <span class="text-gray-600">Último acceso:</span>
            <p class="font-medium">{{ formatLastSignInDate() }}</p>
          </div>
          <div>
            <span class="text-gray-600">Rol:</span>
            <p class="font-medium capitalize">{{ userProfile.role }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import type { UpdateUserProfileData } from '~/types/user'

// Composables
const { 
  userProfile, 
  isAuthenticated, 
  isProfileLoading, 
  profileError,
  updateUserProfile,
  refreshUserProfile,
  userDisplayName,
  userInitials,
  isNewUser
} = useAuthEnhanced()

const { 
  notifyProfileUpdated, 
  notifyProfileError, 
  notifyAvatarUploaded,
  notifySuccess,
  notifyError 
} = useNotifications()

// Get Firebase auth user for lastSignInTime and creationTime
const { $firebase } = useNuxtApp()
const authUser = computed(() => $firebase?.auth?.currentUser)

// Local state
const isEditMode = ref(false)
const isSaving = ref(false)
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
const isLoading = computed(() => isProfileLoading.value)
const error = computed(() => profileError.value)

// Watch for profile changes to update form
watch(userProfile, (newProfile) => {
  if (newProfile) {
    formData.value = {
      displayName: newProfile.displayName || '',
      firstName: newProfile.firstName || '',
      lastName: newProfile.lastName || '',
      bio: newProfile.bio || '',
      favoriteComparsa: newProfile.favoriteComparsa || undefined,
      favoriteAgrupacion: newProfile.favoriteAgrupacion || undefined,
      preferences: { ...newProfile.preferences }
    }
  }
}, { immediate: true })

// Methods
const toggleEditMode = () => {
  isEditMode.value = !isEditMode.value
  if (!isEditMode.value) {
    cancelEdit()
  }
}

const cancelEdit = () => {
  isEditMode.value = false
  // Reset form data
  if (userProfile.value) {
    formData.value = {
      displayName: userProfile.value.displayName || '',
      firstName: userProfile.value.firstName || '',
      lastName: userProfile.value.lastName || '',
      bio: userProfile.value.bio || '',
      favoriteComparsa: userProfile.value.favoriteComparsa || undefined,
      favoriteAgrupacion: userProfile.value.favoriteAgrupacion || undefined,
      preferences: { ...userProfile.value.preferences }
    }
  }
}

const saveProfile = async () => {
  if (!formData.value) return

  try {
    isSaving.value = true
    const result = await updateUserProfile(formData.value)
    
    if (result.success) {
      isEditMode.value = false
      notifyProfileUpdated()
    } else {
      console.error('Error updating profile:', result.error)
      notifyProfileError(result.error || 'Error al actualizar el perfil')
    }
  } catch (error) {
    console.error('Error saving profile:', error)
  } finally {
    isSaving.value = false
  }
}

const refreshProfile = async () => {
  await refreshUserProfile()
}

const handleAvatarUpload = async (avatarDataUrl: string) => {
  try {
    await updateUserProfile({ photoURL: avatarDataUrl })
    notifyAvatarUploaded()
  } catch (error) {
    console.error('Error updating avatar:', error)
    notifyError('Error de Avatar', 'No se pudo actualizar tu foto de perfil')
  }
}

const handleAvatarError = (error: string) => {
  console.error('Avatar upload error:', error)
  notifyError('Error de Carga', error)
}

const handleAvatarRemove = async () => {
  try {
    await updateUserProfile({ photoURL: null })
    notifySuccess('Avatar Eliminado', 'Tu foto de perfil ha sido eliminada')
  } catch (error) {
    console.error('Error removing avatar:', error)
    notifyError('Error al Eliminar', 'No se pudo eliminar tu foto de perfil')
  }
}

// Date formatting functions using Firebase Auth metadata
const formatCreationDate = (): string => {
  // First try Firebase Auth creationTime, then fallback to userProfile createdAt
  if (authUser.value?.metadata?.creationTime) {
    try {
      const date = new Date(authUser.value.metadata.creationTime)
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      }
    } catch (error) {
      console.error('Error formatting creation date from auth:', error)
    }
  }
  
  // Fallback to userProfile createdAt
  if (userProfile.value?.createdAt) {
    try {
      const date = userProfile.value.createdAt instanceof Date 
        ? userProfile.value.createdAt 
        : new Date(userProfile.value.createdAt)
      
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      }
    } catch (error) {
      console.error('Error formatting creation date from profile:', error)
    }
  }
  
  return 'No disponible'
}

const formatLastSignInDate = (): string => {
  if (!authUser.value?.metadata?.lastSignInTime) return 'Nunca'
  
  try {
    // Firebase Auth provides lastSignInTime as an ISO string
    const date = new Date(authUser.value.metadata.lastSignInTime)
    
    if (isNaN(date.getTime())) {
      console.warn('Invalid lastSignInTime:', authUser.value.metadata.lastSignInTime)
      return 'Fecha no disponible'
    }
    
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (error) {
    console.error('Error formatting last sign in date:', error)
    return 'Error en fecha'
  }
}

// Legacy formatDate function (removed, replaced with specific functions above)

// Authentication is handled by page middleware
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