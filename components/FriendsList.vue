<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-semibold text-gray-900">Mis Amigos</h3>
      <button
        @click="loadFriends"
        :disabled="isLoading"
        class="text-sm text-gray-500 hover:text-gray-700 transition-colors"
        title="Actualizar lista de amigos"
      >
        <svg class="w-4 h-4" :class="{ 'animate-spin': isLoading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
        </svg>
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading && friends.length === 0" class="flex items-center justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      <span class="ml-2 text-gray-600">Cargando amigos...</span>
    </div>

    <!-- Empty State -->
    <div v-else-if="friends.length === 0" class="text-center py-8">
      <div class="mx-auto h-16 w-16 text-gray-400 mb-4">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.196-2.121M9 6a3 3 0 106 0 3 3 0 00-6 0zm9 13a5 5 0 01-10 0h10z"/>
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">Aún no tienes amigos</h3>
      <p class="text-gray-600 mb-4">Conecta con otros miembros de la comunidad para ampliar tu red.</p>
      <NuxtLink 
        to="/users" 
        class="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.196-2.121M9 6a3 3 0 106 0 3 3 0 00-6 0zm9 13a5 5 0 01-10 0h10z"/>
        </svg>
        Explorar usuarios
      </NuxtLink>
    </div>

    <!-- Friends Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div
        v-for="friend in friends"
        :key="friend.uid"
        class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <!-- Friend Avatar -->
        <NuxtLink :to="`/profile/${friend.uid}`" class="flex-shrink-0">
          <img 
            v-if="friend.photoURL" 
            :src="friend.photoURL" 
            :alt="friend.displayName"
            class="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
          />
          <div 
            v-else 
            class="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center font-medium"
          >
            {{ getInitials(friend.displayName) }}
          </div>
        </NuxtLink>
        
        <!-- Friend Info -->
        <div class="ml-3 flex-1 min-w-0">
          <div class="flex items-center space-x-2">
            <NuxtLink 
              :to="`/profile/${friend.uid}`" 
              class="font-medium text-gray-900 hover:text-green-600 transition-colors truncate"
            >
              {{ friend.displayName }}
            </NuxtLink>
            
            <!-- Online Status -->
            <span 
              v-if="isOnline(friend)"
              class="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
            >
              <div class="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></div>
              En línea
            </span>
          </div>
          
          <!-- Carnival Badges -->
          <div class="flex items-center space-x-1 mt-1">
            <span 
              v-if="friend.favoriteComparsa" 
              class="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
            >
              🎆 {{ friend.favoriteComparsa }}
            </span>
            <span 
              v-if="friend.favoriteAgrupacion" 
              class="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800"
            >
              🎵 {{ friend.favoriteAgrupacion }}
            </span>
          </div>
        </div>

        <!-- Actions Menu -->
        <div class="relative ml-2">
          <button
            @click="toggleMenu(friend.uid)"
            class="p-1 text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"/>
            </svg>
          </button>
          
          <!-- Dropdown Menu -->
          <div
            v-if="openMenuId === friend.uid"
            v-click-outside="() => closeMenu()"
            class="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200"
          >
            <div class="py-1">
              <NuxtLink
                :to="`/profile/${friend.uid}`"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Ver perfil
              </NuxtLink>
              <button
                @click="startRemoveFriend(friend)"
                class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                Eliminar de amigos
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Show More Button -->
    <div v-if="friends.length > 0 && hasMore" class="text-center mt-6">
      <button
        @click="loadMoreFriends"
        :disabled="isLoadingMore"
        class="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
      >
        <span v-if="isLoadingMore" class="flex items-center">
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
          </svg>
          Cargando más...
        </span>
        <span v-else>Ver más amigos</span>
      </button>
    </div>

    <!-- Remove Friend Confirmation Modal -->
    <div v-if="friendToRemove" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Eliminar amistad</h3>
        <p class="text-gray-700 mb-6">
          ¿Estás seguro de que quieres eliminar a <strong>{{ friendToRemove.displayName }}</strong> de tu lista de amigos?
        </p>
        
        <div class="flex gap-3">
          <button
            @click="cancelRemoveFriend"
            class="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancelar
          </button>
          <button
            @click="confirmRemoveFriend"
            :disabled="isRemoving"
            class="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {{ isRemoving ? 'Eliminando...' : 'Eliminar' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { UserProfile } from '~/types/user'

// Composables
const { authUser } = useAuthEnhanced()
const { 
  isLoading,
  getUserFriends,
  removeFriend
} = useUserInteractions()

const { notifySuccess, notifyError } = useNotifications()

// State
const friends = ref<UserProfile[]>([])
const isLoadingMore = ref(false)
const hasMore = ref(false)
const openMenuId = ref<string | null>(null)
const friendToRemove = ref<UserProfile | null>(null)
const isRemoving = ref(false)

// Methods
const getInitials = (name: string): string => {
  if (!name) return 'U'
  return name.split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('')
}

const isOnline = (user: UserProfile): boolean => {
  if (!user.lastLoginAt) return false
  
  try {
    const lastLogin = new Date(user.lastLoginAt)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
    return lastLogin > fiveMinutesAgo
  } catch (error) {
    return false
  }
}

const loadFriends = async () => {
  if (!authUser.value) return
  
  try {
    const userFriends = await getUserFriends()
    friends.value = userFriends
    console.log('👥 Loaded friends:', userFriends)
  } catch (error) {
    console.error('Error loading friends:', error)
    notifyError('Error', 'No se pudieron cargar los amigos')
  }
}

const loadMoreFriends = async () => {
  // Implementation for pagination if needed
  console.log('Load more friends - to be implemented')
}

const toggleMenu = (friendId: string) => {
  openMenuId.value = openMenuId.value === friendId ? null : friendId
}

const closeMenu = () => {
  openMenuId.value = null
}

const startRemoveFriend = (friend: UserProfile) => {
  friendToRemove.value = friend
  closeMenu()
}

const cancelRemoveFriend = () => {
  friendToRemove.value = null
}

const confirmRemoveFriend = async () => {
  if (!friendToRemove.value) return
  
  try {
    isRemoving.value = true
    const success = await removeFriend(friendToRemove.value.uid)
    
    if (success) {
      // Remove friend from local list
      friends.value = friends.value.filter(friend => friend.uid !== friendToRemove.value!.uid)
      notifySuccess('Amistad eliminada', `Ya no eres amigo de ${friendToRemove.value.displayName}`)
    }
  } catch (error) {
    console.error('Error removing friend:', error)
  } finally {
    isRemoving.value = false
    friendToRemove.value = null
  }
}

// Custom directive for click outside
const vClickOutside = {
  beforeMount(el: HTMLElement, binding: any) {
    el.clickOutsideEvent = function(event: Event) {
      if (!(el === event.target || el.contains(event.target as Node))) {
        binding.value()
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el: HTMLElement) {
    document.removeEventListener('click', el.clickOutsideEvent)
  }
}

// Lifecycle
onMounted(() => {
  loadFriends()
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