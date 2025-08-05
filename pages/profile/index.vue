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

      <!-- Friend Requests -->
      <div class="mt-8">
        <FriendRequests />
      </div>

      <!-- Friends List -->
      <div class="mt-8">
        <FriendsList />
      </div>

      <!-- Activity Summary -->
      <div class="mt-8 bg-white rounded-lg shadow-md p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Resumen de Actividad</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div class="text-center">
            <div class="text-2xl font-bold text-green-600">{{ membershipDays }}</div>
            <div class="text-sm text-gray-600">Días como miembro</div>
          </div>
          <div class="text-center">
            <div class="text-sm font-medium text-gray-900">{{ lastLoginFormatted }}</div>
            <div class="text-sm text-gray-600">Último acceso</div>
          </div>
          <div class="text-center">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                  :class="userProfile?.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
              {{ userProfile?.isActive ? 'Activa' : 'Inactiva' }}
            </span>
            <div class="text-sm text-gray-600 mt-1">Estado de la cuenta</div>
          </div>
        </div>
        
        <!-- New User Setup Notice -->
        <div v-if="isNewUser" class="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div class="flex items-center">
            <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="flex-1">
              <h4 class="text-sm font-medium text-blue-900">Completa tu configuración</h4>
              <p class="text-sm text-blue-700 mt-1">Personaliza tu perfil para una mejor experiencia</p>
            </div>
            <NuxtLink 
              to="/profile/setup" 
              class="ml-4 px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
            >
              Completar
            </NuxtLink>
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
          
          <div class="flex items-center justify-between">
            <div>
              <h4 class="text-sm font-medium text-gray-900">Mostrar biografía</h4>
              <p class="text-sm text-gray-500">Permite que otros usuarios vean tu biografía</p>
            </div>
            <button
              @click="toggleBioVisibility"
              :class="userProfile?.preferences?.privacy?.showBio ? 'bg-green-600' : 'bg-gray-200'"
              class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              <span
                :class="userProfile?.preferences?.privacy?.showBio ? 'translate-x-5' : 'translate-x-0'"
                class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
              />
            </button>
          </div>
        </div>
      </div>

      <!-- Data Management -->
      <div class="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Gestión de Datos</h3>
        <p class="text-sm text-gray-600 mb-4">
          Descarga una copia de todos tus datos almacenados en la plataforma.
        </p>
        <button 
          @click="downloadProfileData"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm flex items-center gap-2"
          :disabled="isDownloading"
        >
          <svg v-if="isDownloading" class="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
          </svg>
          <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          {{ isDownloading ? 'Descargando...' : 'Descargar mis datos' }}
        </button>
      </div>

      <!-- Social Interactions -->
      <div class="mt-8 bg-white rounded-lg shadow-md p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Mis Interacciones</h3>
        
        <!-- Interaction Stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div class="text-center p-4 bg-red-50 rounded-lg">
            <div class="text-2xl font-bold text-red-600">{{ userProfile?.interactions?.likesReceived || 0 }}</div>
            <div class="text-sm text-gray-600">Likes recibidos</div>
          </div>
          <div class="text-center p-4 bg-blue-50 rounded-lg">
            <div class="text-2xl font-bold text-blue-600">{{ userProfile?.interactions?.friendsCount || 0 }}</div>
            <div class="text-sm text-gray-600">Amigos</div>
          </div>
          <div class="text-center p-4 bg-purple-50 rounded-lg">
            <div class="text-2xl font-bold text-purple-600">{{ userProfile?.interactions?.likesGiven || 0 }}</div>
            <div class="text-sm text-gray-600">Likes dados</div>
          </div>
          <div class="text-center p-4 bg-yellow-50 rounded-lg">
            <div class="text-2xl font-bold text-yellow-600">{{ pendingFriendRequests.length }}</div>
            <div class="text-sm text-gray-600">Solicitudes pendientes</div>
          </div>
        </div>

        <!-- Friend Requests -->
        <div v-if="pendingFriendRequests.length > 0" class="mb-6">
          <h4 class="text-md font-semibold text-gray-900 mb-3">Solicitudes de Amistad</h4>
          <div class="space-y-3">
            <div 
              v-for="request in pendingFriendRequests" 
              :key="request.id"
              class="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg"
            >
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                </div>
                <div>
                  <div class="font-medium text-gray-900">Solicitud de amistad</div>
                  <div class="text-sm text-gray-600">{{ formatDate(request.createdAt) }}</div>
                </div>
              </div>
              <div class="flex space-x-2">
                <button
                  @click="respondToFriendRequest(request.id!, 'accepted')"
                  :disabled="isRespondingToRequest"
                  class="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  Aceptar
                </button>
                <button
                  @click="respondToFriendRequest(request.id!, 'declined')"
                  :disabled="isRespondingToRequest"
                  class="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 disabled:opacity-50 transition-colors"
                >
                  Rechazar
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="flex flex-wrap gap-3">
          <NuxtLink 
            to="/users" 
            class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm flex items-center space-x-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.196-2.121M9 6a3 3 0 106 0 3 3 0 00-6 0zm9 13a5 5 0 01-10 0h10z"/>
            </svg>
            <span>Explorar Usuarios</span>
          </NuxtLink>
        </div>
      </div>

      <!-- Danger Zone -->
      <div class="mt-8 bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 class="text-lg font-semibold text-red-900 mb-4">Zona de Peligro</h3>
        <p class="text-sm text-red-700 mb-4">
          Las siguientes acciones son permanentes y no se pueden deshacer.
        </p>
        <div class="flex gap-2">
          <button
            @click="showDeactivateConfirmation"
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 text-sm"
          >
            Desactivar Cuenta
          </button>
          <button
            @click="deleteAccount"
            class="px-4 py-2 bg-red-800 text-white rounded-md hover:bg-red-900 transition-colors duration-200 text-sm"
          >
            Eliminar Cuenta Permanentemente
          </button>
        </div>
      </div>
    </div>

    <!-- Account Deactivation Confirmation Modal -->
    <div v-if="showDeactivateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold text-red-900 mb-4">Desactivar Cuenta</h3>
        <p class="text-gray-700 mb-6">
          ¿Estás seguro de que quieres desactivar tu cuenta? Podrás reactivarla más tarde.
        </p>
        
        <div class="flex gap-3">
          <button
            @click="cancelDeactivateAccount"
            class="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancelar
          </button>
          <button
            @click="confirmDeactivateAccount"
            :disabled="isDeactivating"
            class="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {{ isDeactivating ? 'Desactivando...' : 'Desactivar' }}
          </button>
        </div>
      </div>
    </div>
    
    <!-- Account Deletion Confirmation Modal -->
    <div v-if="showDeleteConfirmation" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold text-red-900 mb-4">Eliminar Cuenta Permanentemente</h3>
        <p class="text-gray-700 mb-4">
          Esta acción eliminará permanentemente tu cuenta y todos tus datos. No se puede deshacer.
        </p>
        <p class="text-gray-700 mb-4">
          Para confirmar, escribe <strong>ELIMINAR</strong> en el campo de abajo:
        </p>
        
        <input
          v-model="deleteConfirmationText"
          type="text"
          placeholder="Escribe ELIMINAR"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 mb-4"
        />
        
        <div class="flex gap-3">
          <button
            @click="cancelDeleteAccount"
            class="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancelar
          </button>
          <button
            @click="confirmDeleteAccount"
            :disabled="deleteConfirmationText !== 'ELIMINAR' || isDeletingAccount"
            class="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {{ isDeletingAccount ? 'Eliminando...' : 'Eliminar Cuenta' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

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
  updateUserProfile 
} = useAuthEnhanced()

const { 
  getFriendRequests, 
  respondToFriendRequest: respondToRequest 
} = useUserInteractions()

// Get Firebase auth user for lastSignInTime
const { $firebase } = useNuxtApp()
const authUser = computed(() => $firebase?.auth?.currentUser)

// Local state
const isDownloading = ref(false)
const isDeletingAccount = ref(false)
const showDeleteConfirmation = ref(false)
const deleteConfirmationText = ref('')
const showDeactivateModal = ref(false)
const isDeactivating = ref(false)

// Friend requests state
const pendingFriendRequests = ref<any[]>([])
const isLoadingRequests = ref(false)
const isRespondingToRequest = ref(false)

// Reactive values for dates to avoid initial undefined issues
const membershipDays = ref(0)
const lastLoginFormatted = ref('Cargando...')

// Helper function to safely convert various date formats to Date object
const parseDate = (rawDate: any): Date | null => {
  if (!rawDate) return null
  
  try {
    // Handle Firebase server timestamp placeholder (not yet resolved)
    if (typeof rawDate === 'object' && rawDate !== null && '_methodName' in rawDate && rawDate._methodName === 'serverTimestamp') {
      // Server timestamp hasn't been resolved yet, return null
      return null
    }
    
    // Handle Firestore timestamp with seconds property
    if (typeof rawDate === 'object' && rawDate !== null && 'seconds' in rawDate && typeof rawDate.seconds === 'number') {
      return new Date(rawDate.seconds * 1000)
    }
    
    // Handle Firestore timestamp with nanoseconds property (alternative format)
    if (typeof rawDate === 'object' && rawDate !== null && 'nanoseconds' in rawDate && 'seconds' in rawDate) {
      return new Date(rawDate.seconds * 1000 + rawDate.nanoseconds / 1000000)
    }
    
    // Handle Firestore timestamp with toDate method
    if (typeof rawDate === 'object' && rawDate !== null && typeof rawDate.toDate === 'function') {
      return rawDate.toDate()
    }
    
    // Handle string dates
    if (typeof rawDate === 'string') {
      const date = new Date(rawDate)
      return isNaN(date.getTime()) ? null : date
    }
    
    // Handle numeric timestamps
    if (typeof rawDate === 'number') {
      // Distinguish between seconds and milliseconds
      const date = new Date(rawDate < 10000000000 ? rawDate * 1000 : rawDate)
      return isNaN(date.getTime()) ? null : date
    }
    
    // Handle Date objects
    if (rawDate instanceof Date) {
      return isNaN(rawDate.getTime()) ? null : rawDate
    }
    
    return null
  } catch (error) {
    console.error('Error parsing date:', error, rawDate)
    return null
  }
}

// Function to calculate membership days
const calculateMembershipDays = (createdAt: any) => {
  if (!createdAt) return 0
  
  const createdDate = parseDate(createdAt)
  if (!createdDate) {
    // Don't log warning if it's a server timestamp placeholder
    if (!(typeof createdAt === 'object' && createdAt?._methodName === 'serverTimestamp')) {
      console.warn('Invalid createdAt date:', createdAt)
    }
    return 0
  }
  
  const diffTime = Math.abs(Date.now() - createdDate.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

// Function to format last login date using Firebase Auth lastSignInTime
const formatLastLogin = () => {
  if (!authUser.value?.metadata?.lastSignInTime) return 'Nunca'
  
  try {
    // Firebase Auth provides lastSignInTime as an ISO string
    const date = new Date(authUser.value.metadata.lastSignInTime)
    
    if (isNaN(date.getTime())) {
      console.warn('Invalid lastSignInTime:', authUser.value.metadata.lastSignInTime)
      return 'Fecha no disponible'
    }
    
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  } catch (error) {
    console.error('Error formatting last sign in date:', error)
    return 'Error en fecha'
  }
}

// Watch for changes in userProfile and authUser to update date values
watch([userProfile, authUser], ([newProfile, newAuthUser]) => {
  if (newProfile) {
    // Update membership days
    membershipDays.value = calculateMembershipDays(newProfile.createdAt)
  }
  
  if (newAuthUser) {
    // Update last login formatted using Firebase Auth data
    lastLoginFormatted.value = formatLastLogin()
  }
}, { immediate: true, deep: true })

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

const toggleBioVisibility = async () => {
  if (!userProfile.value) return
  
  const newValue = !userProfile.value.preferences.privacy.showBio
  
  await updateUserProfile({
    preferences: {
      ...userProfile.value.preferences,
      privacy: {
        ...userProfile.value.preferences.privacy,
        showBio: newValue
      }
    }
  })
}

const showDeactivateConfirmation = () => {
  showDeactivateModal.value = true
}

const confirmDeactivateAccount = async () => {
  try {
    isDeactivating.value = true
    await updateUserProfile({ isActive: false })
    alert('Tu cuenta ha sido desactivada.')
    showDeactivateModal.value = false
  } catch (error) {
    console.error('Error deactivating account:', error)
    alert('Error al desactivar la cuenta.')
  } finally {
    isDeactivating.value = false
  }
}

const cancelDeactivateAccount = () => {
  showDeactivateModal.value = false
}

const deleteAccount = async () => {
  // Show confirmation modal
  showDeleteConfirmation.value = true
}

const confirmDeleteAccount = async () => {
  if (deleteConfirmationText.value !== 'ELIMINAR') {
    return
  }

  try {
    isDeletingAccount.value = true
    
    if (!userProfile.value?.uid) {
      alert('No se pudo encontrar la información del usuario.')
      return
    }

    // Delete user's Firestore document
    const { $firebase } = useNuxtApp()
    if ($firebase?.db) {
      const { doc, deleteDoc } = await import('firebase/firestore')
      const userDocRef = doc($firebase.db, 'users', userProfile.value.uid)
      await deleteDoc(userDocRef)
    }

    // Delete user's Firebase Auth account
    if ($firebase?.auth?.currentUser) {
      const { deleteUser } = await import('firebase/auth')
      await deleteUser($firebase.auth.currentUser)
    }

    // Show success message
    alert('Tu cuenta ha sido eliminada permanentemente.')
    
    // Redirect to home page
    navigateTo('/')
  } catch (error: any) {
    console.error('Error deleting account:', error)
    
    // Handle specific Firebase errors
    let errorMessage = 'Error al eliminar la cuenta.'
    if (error.code === 'auth/requires-recent-login') {
      errorMessage = 'Por seguridad, debes iniciar sesión nuevamente antes de eliminar tu cuenta.'
    }
    
    alert(errorMessage)
  } finally {
    isDeletingAccount.value = false
    showDeleteConfirmation.value = false
    deleteConfirmationText.value = ''
  }
}

const cancelDeleteAccount = () => {
  showDeleteConfirmation.value = false
  deleteConfirmationText.value = ''
}

// Friend request management
const loadFriendRequests = async () => {
  try {
    isLoadingRequests.value = true
    const requests = await getFriendRequests('received')
    pendingFriendRequests.value = requests
  } catch (error) {
    console.error('Error loading friend requests:', error)
  } finally {
    isLoadingRequests.value = false
  }
}

const respondToFriendRequest = async (requestId: string, response: 'accepted' | 'declined') => {
  try {
    isRespondingToRequest.value = true
    const success = await respondToRequest(requestId, response)
    
    if (success) {
      // Remove the request from the list
      pendingFriendRequests.value = pendingFriendRequests.value.filter(req => req.id !== requestId)
      
      // Refresh user profile to update stats
      await updateUserProfile({})
    }
  } catch (error) {
    console.error('Error responding to friend request:', error)
  } finally {
    isRespondingToRequest.value = false
  }
}

const formatDate = (date: Date | string): string => {
  const dateObj = date instanceof Date ? date : new Date(date)
  const diffTime = Math.abs(new Date().getTime() - dateObj.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 1) return 'Ayer'
  if (diffDays < 7) return `Hace ${diffDays} días`
  if (diffDays < 30) return `Hace ${Math.ceil(diffDays / 7)} semanas`
  
  return dateObj.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Auto-refresh functions
const refreshProfileData = async () => {
  // Refresh user profile to get updated interaction counts
  await updateUserProfile({})
  // Refresh friend requests
  await loadFriendRequests()
}

// Load friend requests on mount and set up auto-refresh
onMounted(() => {
  loadFriendRequests()
  
  // Refresh every 2 minutes (less aggressive)
  const interval = setInterval(loadFriendRequests, 120000)
  
  // Refresh when page becomes visible again
  const handleVisibilityChange = () => {
    if (!document.hidden) {
      refreshProfileData()
    }
  }
  
  document.addEventListener('visibilitychange', handleVisibilityChange)
  
  // Cleanup interval and event listener on unmount
  onUnmounted(() => {
    clearInterval(interval)
    document.removeEventListener('visibilitychange', handleVisibilityChange)
  })
})

// Authentication is handled by the 'auth' middleware
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