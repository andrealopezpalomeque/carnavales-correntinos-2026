<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4 max-w-6xl">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Directorio de Usuarios</h1>
        <p class="text-gray-600">Encuentra y conecta con otros miembros de la comunidad</p>
      </div>

      <!-- Search and Filters -->
      <div class="bg-white rounded-lg shadow mb-6 p-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Search -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Buscar usuarios
            </label>
            <div class="relative">
              <input
                v-model="searchTerm"
                type="text"
                placeholder="Buscar por nombre o email..."
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                @input="debouncedSearch"
              />
              <svg class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
          </div>

          <!-- Role Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Filtrar por rol
            </label>
            <select
              v-model="roleFilter"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              @change="filterUsers"
            >
              <option value="">Todos</option>
              <option value="admin">Administradores</option>
              <option value="moderator">Moderadores</option>
              <option value="user">Usuarios</option>
            </select>
          </div>
        </div>

        <!-- Quick Stats -->
        <div class="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="text-center">
            <div class="text-2xl font-bold text-green-600">{{ stats.total }}</div>
            <div class="text-sm text-gray-600">Total</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-blue-600">{{ stats.active }}</div>
            <div class="text-sm text-gray-600">Activos</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-purple-600">{{ stats.admins }}</div>
            <div class="text-sm text-gray-600">Administradores</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-yellow-600">{{ stats.newUsers }}</div>
            <div class="text-sm text-gray-600">Nuevos</div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center py-8">
        <div class="flex items-center space-x-2">
          <svg class="animate-spin h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
          </svg>
          <span class="text-gray-600">Cargando usuarios...</span>
        </div>
      </div>

      <!-- No Results -->
      <div v-else-if="filteredUsers.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No se encontraron usuarios</h3>
        <p class="mt-1 text-sm text-gray-500">
          {{ searchTerm ? 'Intenta con diferentes términos de búsqueda' : 'No hay usuarios para mostrar' }}
        </p>
      </div>

      <!-- Users Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="user in paginatedUsers"
          :key="user.uid"
          class="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200 overflow-hidden"
        >
          <!-- User Card -->
          <div class="p-6">
            <div class="flex items-center space-x-4">
              <!-- Avatar -->
              <div class="flex-shrink-0">
                <img 
                  v-if="user.photoURL" 
                  :src="user.photoURL" 
                  :alt="user.displayName || 'Usuario'"
                  class="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                />
                <div 
                  v-else 
                  class="w-16 h-16 rounded-full bg-green-500 text-white flex items-center justify-center text-xl font-bold border-2 border-gray-200"
                >
                  {{ getInitials(user.displayName || user.email) }}
                </div>
              </div>

              <!-- User Info -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center space-x-2">
                  <h3 class="text-lg font-semibold text-gray-900 truncate">
                    {{ user.displayName || 'Sin nombre' }}
                  </h3>
                  <span 
                    v-if="user.role === 'admin'"
                    class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                  >
                    Admin
                  </span>
                  <span 
                    v-else-if="user.role === 'moderator'"
                    class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    Mod
                  </span>
                </div>

                <p v-if="user.preferences?.privacy?.showEmail" class="text-sm text-gray-600 truncate">
                  {{ user.email }}
                </p>

                <p v-if="user.bio" class="text-sm text-gray-600 mt-1 line-clamp-2">
                  {{ user.bio }}
                </p>

                <!-- Status Badges -->
                <div class="flex items-center space-x-2 mt-2">
                  <span 
                    v-if="user.isNewUser"
                    class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                  >
                    Nuevo
                  </span>
                  <span 
                    v-if="!user.isActive"
                    class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"
                  >
                    Inactivo
                  </span>
                  <span 
                    v-if="isOnline(user)"
                    class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                  >
                    <div class="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                    En línea
                  </span>
                </div>
              </div>
            </div>

            <!-- User Stats -->
            <div class="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <span class="text-gray-500">Miembro desde:</span>
                <div class="font-medium">{{ formatDate(user.createdAt) }}</div>
              </div>
              <div>
                <span class="text-gray-500">Último acceso:</span>
                <div class="font-medium">{{ formatDate(user.lastLoginAt) }}</div>
              </div>
            </div>

            <!-- Interaction Stats -->
            <div v-if="user.interactions" class="mt-4 grid grid-cols-2 gap-2 text-xs text-gray-600">
              <div class="flex items-center space-x-1">
                <svg class="w-3 h-3 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                </svg>
                <span>{{ user.interactions.likesReceived }} likes</span>
              </div>
              <div class="flex items-center space-x-1">
                <svg class="w-3 h-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.196-2.121M9 6a3 3 0 106 0 3 3 0 00-6 0zm9 13a5 5 0 01-10 0h10z"/>
                </svg>
                <span>{{ user.interactions.friendsCount }} amigos</span>
              </div>
            </div>

            <!-- User Interaction Buttons -->
            <div class="mt-4">
              <UserInteractionButtons 
                :target-user="user" 
                compact
                @interaction-update="handleInteractionUpdate(user)"
              />
            </div>

            <!-- Actions -->
            <div class="mt-4 flex space-x-2">
              <NuxtLink
                :to="`/profile/${user.uid}`"
                class="flex-1 px-3 py-2 text-sm font-medium text-green-700 bg-green-100 rounded-md hover:bg-green-200 transition-colors text-center"
              >
                Ver Perfil
              </NuxtLink>
              <button
                v-if="canContact(user)"
                @click="contactUser(user)"
                class="flex-1 px-3 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors"
              >
                Contactar
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="mt-8 flex justify-center">
        <nav class="flex space-x-2">
          <button
            @click="currentPage--"
            :disabled="currentPage === 1"
            class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="currentPage = page"
            :class="{
              'bg-green-600 text-white': page === currentPage,
              'bg-white text-gray-700 hover:bg-gray-50': page !== currentPage
            }"
            class="px-3 py-2 text-sm font-medium border border-gray-300 rounded-md"
          >
            {{ page }}
          </button>
          
          <button
            @click="currentPage++"
            :disabled="currentPage === totalPages"
            class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Siguiente
          </button>
        </nav>
      </div>
    </div>

    <!-- Profile Modal -->
    <div v-if="selectedUser" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="closeModal">
      <div class="bg-white rounded-lg p-6 max-w-2xl w-full m-4 max-h-[90vh] overflow-y-auto" @click.stop>
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold text-gray-900">Perfil de Usuario</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        
        <!-- User Profile Content -->
        <div class="space-y-6">
          <!-- Avatar and Basic Info -->
          <div class="flex items-center space-x-6">
            <img 
              v-if="selectedUser.photoURL" 
              :src="selectedUser.photoURL" 
              :alt="selectedUser.displayName || 'Usuario'"
              class="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
            />
            <div 
              v-else 
              class="w-24 h-24 rounded-full bg-green-500 text-white flex items-center justify-center text-3xl font-bold border-4 border-gray-200"
            >
              {{ getInitials(selectedUser.displayName || selectedUser.email) }}
            </div>
            
            <div>
              <h4 class="text-2xl font-bold text-gray-900">{{ selectedUser.displayName || 'Sin nombre' }}</h4>
              <p v-if="selectedUser.preferences?.privacy?.showEmail" class="text-gray-600">{{ selectedUser.email }}</p>
              <div class="flex items-center space-x-2 mt-2">
                <span :class="getRoleBadgeClasses(selectedUser.role)" class="px-2 py-1 rounded-full text-xs font-medium capitalize">
                  {{ selectedUser.role }}
                </span>
                <span v-if="selectedUser.isNewUser" class="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Nuevo Usuario
                </span>
              </div>
            </div>
          </div>

          <!-- Bio -->
          <div v-if="selectedUser.bio">
            <h5 class="text-lg font-semibold text-gray-900 mb-2">Sobre mí</h5>
            <p class="text-gray-700">{{ selectedUser.bio }}</p>
          </div>

          <!-- Stats Grid -->
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-gray-50 p-4 rounded-lg">
              <div class="text-sm text-gray-600">Miembro desde</div>
              <div class="text-lg font-semibold text-gray-900">{{ formatLongDate(selectedUser.createdAt) }}</div>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg">
              <div class="text-sm text-gray-600">Último acceso</div>
              <div class="text-lg font-semibold text-gray-900">{{ formatLongDate(selectedUser.lastLoginAt) }}</div>
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

// SEO
useSeoMeta({
  title: 'Directorio de Usuarios - Carnavales Correntinos 2026',
  description: 'Encuentra y conecta con otros miembros de la comunidad de Carnavales Correntinos'
})

// Composables
const { authUser, hasRole } = useAuthEnhanced()

// State
const users = ref<UserProfile[]>([])
const isLoading = ref(false)
const selectedUser = ref<UserProfile | null>(null)

// Search and filters
const searchTerm = ref('')
const roleFilter = ref('')

// Pagination
const currentPage = ref(1)
const pageSize = ref(12)

// Computed
const stats = computed(() => ({
  total: users.value.length,
  active: users.value.filter(u => u.isActive).length,
  admins: users.value.filter(u => u.role === 'admin').length,
  newUsers: users.value.filter(u => u.isNewUser).length
}))

const filteredUsers = computed(() => {
  let filtered = users.value.filter(user => 
    // Only show users with public profiles (except admins can see all)
    user.preferences?.privacy?.showProfile || hasRole('admin')
  )

  // Search filter
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    filtered = filtered.filter(user =>
      user.displayName?.toLowerCase().includes(term) ||
      (user.preferences?.privacy?.showEmail && user.email.toLowerCase().includes(term)) ||
      user.firstName?.toLowerCase().includes(term) ||
      user.lastName?.toLowerCase().includes(term)
    )
  }

  // Role filter
  if (roleFilter.value) {
    filtered = filtered.filter(user => user.role === roleFilter.value)
  }

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredUsers.value.length / pageSize.value))

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredUsers.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value
  
  // Always show first page
  if (total > 0) pages.push(1)
  
  // Show pages around current page
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  
  if (start > 2) pages.push('...')
  
  for (let i = start; i <= end; i++) {
    if (i > 1 && i < total) pages.push(i)
  }
  
  if (end < total - 1) pages.push('...')
  
  // Always show last page
  if (total > 1) pages.push(total)
  
  return pages
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

const formatDate = (date: any): string => {
  const parsedDate = parseDate(date)
  if (!parsedDate) {
    return 'Fecha no disponible'
  }
  
  const diffTime = Math.abs(new Date().getTime() - parsedDate.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 1) return 'Ayer'
  if (diffDays < 7) return `Hace ${diffDays} días`
  if (diffDays < 30) return `Hace ${Math.ceil(diffDays / 7)} semanas`
  
  return parsedDate.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatLongDate = (date: any): string => {
  const parsedDate = parseDate(date)
  if (!parsedDate) {
    return 'Fecha no disponible'
  }
  
  return parsedDate.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getRoleBadgeClasses = (role: string): string => {
  switch (role) {
    case 'admin':
      return 'bg-purple-100 text-purple-800'
    case 'moderator':
      return 'bg-blue-100 text-blue-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const isOnline = (user: UserProfile): boolean => {
  // Consider a user online if last login was within last 5 minutes
  const parsedDate = parseDate(user.lastLoginAt)
  if (!parsedDate) return false
  
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
  return parsedDate > fiveMinutesAgo
}

const canContact = (user: UserProfile): boolean => {
  // Users can contact others if they have public email or are admins
  return user.preferences?.privacy?.showEmail || hasRole('admin')
}

const loadUsers = async () => {
  try {
    isLoading.value = true
    users.value = await dbService.getUsers({ isActive: true })
  } catch (error) {
    console.error('Error loading users:', error)
  } finally {
    isLoading.value = false
  }
}

const filterUsers = () => {
  currentPage.value = 1 // Reset to first page when filtering
}

const debouncedSearch = debounce(() => {
  currentPage.value = 1 // Reset to first page when searching
}, 300)

const viewProfile = (user: UserProfile) => {
  selectedUser.value = user
}

const closeModal = () => {
  selectedUser.value = null
}

const contactUser = (user: UserProfile) => {
  if (user.preferences?.privacy?.showEmail) {
    window.location.href = `mailto:${user.email}`
  }
}

const handleInteractionUpdate = async (user: UserProfile) => {
  // Reload the user to get updated interaction counts
  try {
    const updatedUser = await dbService.getUserProfile(user.uid)
    if (updatedUser) {
      const userIndex = users.value.findIndex(u => u.uid === user.uid)
      if (userIndex !== -1) {
        users.value[userIndex] = updatedUser
      }
    }
  } catch (error) {
    console.error('Error updating user data:', error)
  }
}

// Utility function for debouncing
function debounce(func: Function, wait: number) {
  let timeout: ReturnType<typeof setTimeout>
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Lifecycle
onMounted(() => {
  loadUsers()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
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