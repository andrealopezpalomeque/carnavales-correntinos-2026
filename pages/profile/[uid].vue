<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4 max-w-4xl">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center py-8">
        <div class="flex items-center space-x-2">
          <svg class="animate-spin h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
          </svg>
          <span class="text-gray-600">Cargando perfil...</span>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <div class="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <svg class="mx-auto h-12 w-12 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z"/>
          </svg>
          <h3 class="text-lg font-medium text-red-900 mb-2">Error al cargar perfil</h3>
          <p class="text-red-700 mb-4">{{ error }}</p>
          <button
            @click="loadUserProfile"
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>

      <!-- Profile Content -->
      <div v-else-if="userProfile">
        <!-- Header -->
        <div class="mb-8 flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Perfil de {{ userProfile.displayName || 'Usuario' }}</h1>
            <p class="text-gray-600">Miembro de la comunidad Carnavales Correntinos</p>
          </div>
          <NuxtLink 
            to="/users" 
            class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center space-x-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            <span>Volver al directorio</span>
          </NuxtLink>
        </div>

        <!-- Profile Card -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <!-- Cover Photo Placeholder -->
          <div class="h-32 bg-gradient-to-r from-green-400 to-blue-500"></div>
          
          <!-- Profile Info -->
          <div class="px-6 py-6">
            <div class="flex flex-col sm:flex-row sm:items-start sm:space-x-6">
              <!-- Avatar -->
              <div class="flex-shrink-0 self-center sm:self-start -mt-16 sm:-mt-12">
                <img 
                  v-if="userProfile.photoURL" 
                  :src="userProfile.photoURL" 
                  :alt="userProfile.displayName || 'Usuario'"
                  class="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                />
                <div 
                  v-else 
                  class="w-24 h-24 rounded-full bg-green-500 text-white flex items-center justify-center text-2xl font-bold border-4 border-white shadow-md"
                >
                  {{ getInitials(userProfile.displayName || userProfile.email) }}
                </div>
              </div>

              <!-- User Details -->
              <div class="flex-1 text-center sm:text-left mt-4 sm:mt-0">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 class="text-2xl font-bold text-gray-900">{{ userProfile.displayName || 'Sin nombre' }}</h2>
                    <p v-if="userProfile.preferences?.privacy?.showEmail" class="text-gray-600">{{ userProfile.email }}</p>
                    <div class="flex items-center justify-center sm:justify-start space-x-2 mt-2">
                      <span 
                        v-if="userProfile.role === 'admin'"
                        class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                      >
                        Administrador
                      </span>
                      <span 
                        v-else-if="userProfile.role === 'moderator'"
                        class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        Moderador
                      </span>
                      <span 
                        v-if="userProfile.isNewUser"
                        class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                      >
                        Nuevo Usuario
                      </span>
                      <span 
                        v-if="isOnline"
                        class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                      >
                        <div class="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                        En línea
                      </span>
                    </div>
                  </div>

                  <!-- Interaction Buttons -->
                  <div class="mt-4 sm:mt-0">
                    <UserInteractionButtons 
                      :target-user="userProfile" 
                      @interaction-update="loadUserProfile"
                    />
                  </div>
                </div>

                <!-- Bio -->
                <div v-if="userProfile.bio" class="mt-4">
                  <h3 class="text-lg font-semibold text-gray-900 mb-2">Sobre mí</h3>
                  <p class="text-gray-700">{{ userProfile.bio }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div class="bg-white rounded-lg shadow p-6 text-center">
            <div class="text-3xl font-bold text-red-600">{{ userProfile.interactions?.likesReceived || 0 }}</div>
            <div class="text-sm text-gray-600">Likes recibidos</div>
          </div>
          <div class="bg-white rounded-lg shadow p-6 text-center">
            <div class="text-3xl font-bold text-blue-600">{{ userProfile.interactions?.friendsCount || 0 }}</div>
            <div class="text-sm text-gray-600">Amigos</div>
          </div>
          <div class="bg-white rounded-lg shadow p-6 text-center">
            <div class="text-3xl font-bold text-green-600">{{ membershipDays }}</div>
            <div class="text-sm text-gray-600">Días como miembro</div>
          </div>
          <div class="bg-white rounded-lg shadow p-6 text-center">
            <div class="text-3xl font-bold text-purple-600">{{ userProfile.interactions?.likesGiven || 0 }}</div>
            <div class="text-sm text-gray-600">Likes dados</div>
          </div>
        </div>

        <!-- Activity Timeline -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Información de la cuenta</h3>
          <div class="space-y-4">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
              <div>
                <div class="font-medium text-gray-900">Se unió el {{ formatJoinDate() }}</div>
                <div class="text-sm text-gray-600">Miembro desde hace {{ membershipDays }} días</div>
              </div>
            </div>
            
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div>
                <div class="font-medium text-gray-900">Último acceso: {{ formatLastLogin() }}</div>
                <div class="text-sm text-gray-600">{{ getLastSeenStatus() }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { dbService } from '~/utils/database'
import type { UserProfile } from '~/types/user'

// Page meta
definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

// Route
const route = useRoute()
const targetUserId = route.params.uid as string

// SEO (will be updated when profile loads)
const title = ref('Perfil de Usuario - Carnavales Correntinos 2026')
const description = ref('Perfil de usuario en la comunidad de Carnavales Correntinos')

useSeoMeta({
  title,
  description
})

// Composables
const { authUser, hasRole } = useAuthEnhanced()

// State
const userProfile = ref<UserProfile | null>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)

// Computed
const isCurrentUser = computed(() => 
  authUser.value?.uid === targetUserId
)

const membershipDays = computed(() => {
  if (!userProfile.value?.createdAt) return 0
  
  const createdDate = parseDate(userProfile.value.createdAt)
  if (!createdDate) return 0
    
  const diffTime = Math.abs(Date.now() - createdDate.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
})

const isOnline = computed(() => {
  if (!userProfile.value?.lastLoginAt) return false
  
  const lastLogin = parseDate(userProfile.value.lastLoginAt)
  if (!lastLogin) return false
    
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
  return lastLogin > fiveMinutesAgo
})

// Methods
const getInitials = (name: string): string => {
  if (!name) return 'U'
  return name.split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('')
}

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

const formatJoinDate = (): string => {
  if (!userProfile.value?.createdAt) return 'Fecha no disponible'
  
  const date = parseDate(userProfile.value.createdAt)
  if (!date) return 'Fecha no disponible'
    
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatLastLogin = (): string => {
  if (!userProfile.value?.lastLoginAt) return 'Nunca'
  
  const date = parseDate(userProfile.value.lastLoginAt)
  if (!date) return 'Fecha no disponible'
    
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getLastSeenStatus = (): string => {
  if (!userProfile.value?.lastLoginAt) return 'Nunca se ha conectado'
  
  const date = parseDate(userProfile.value.lastLoginAt)
  if (!date) return 'Fecha no disponible'
    
  const diffTime = Math.abs(Date.now() - date.getTime())
  const diffMinutes = Math.floor(diffTime / (1000 * 60))
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffMinutes < 5) return 'En línea ahora'
  if (diffMinutes < 60) return `Visto hace ${diffMinutes} minutos`
  if (diffHours < 24) return `Visto hace ${diffHours} horas`
  return `Visto hace ${diffDays} días`
}

const loadUserProfile = async () => {
  try {
    isLoading.value = true
    error.value = null
    
    const profile = await dbService.getUserProfile(targetUserId)
    
    if (!profile) {
      error.value = 'Usuario no encontrado'
      return
    }

    // Check if profile is public or if user has permission to view
    const canViewProfile = profile.preferences?.privacy?.showProfile || 
                          hasRole('admin') || 
                          isCurrentUser.value

    if (!canViewProfile) {
      error.value = 'Este perfil es privado'
      return
    }

    userProfile.value = profile
    
    // Update SEO
    title.value = `${profile.displayName || 'Usuario'} - Carnavales Correntinos 2026`
    description.value = profile.bio 
      ? `Perfil de ${profile.displayName || 'usuario'}: ${profile.bio.substring(0, 160)}...`
      : `Perfil de ${profile.displayName || 'usuario'} en la comunidad de Carnavales Correntinos`
      
  } catch (err: any) {
    console.error('Error loading user profile:', err)
    error.value = err.message || 'Error al cargar el perfil'
  } finally {
    isLoading.value = false
  }
}

// Redirect current user to their own profile page
const checkAndRedirect = () => {
  if (isCurrentUser.value) {
    navigateTo('/profile')
  }
}

// Lifecycle
onMounted(() => {
  checkAndRedirect()
  if (!isCurrentUser.value) {
    loadUserProfile()
  }
})
</script>

<style scoped>
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