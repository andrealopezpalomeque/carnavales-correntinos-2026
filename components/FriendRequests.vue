<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-semibold text-gray-900">Solicitudes de Amistad</h3>
      <button
        @click="loadFriendRequests"
        :disabled="isLoading"
        class="text-sm text-gray-500 hover:text-gray-700 transition-colors"
        title="Actualizar solicitudes"
      >
        <svg class="w-4 h-4" :class="{ 'animate-spin': isLoading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
        </svg>
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading && requests.length === 0" class="flex items-center justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      <span class="ml-2 text-gray-600">Cargando solicitudes...</span>
    </div>

    <!-- Empty State -->
    <div v-else-if="requests.length === 0" class="text-center py-8">
      <div class="mx-auto h-16 w-16 text-gray-400 mb-4">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.196-2.121M9 6a3 3 0 106 0 3 3 0 00-6 0zm9 13a5 5 0 01-10 0h10z"/>
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">No hay solicitudes pendientes</h3>
      <p class="text-gray-600">Cuando recibas solicitudes de amistad aparecerán aquí.</p>
    </div>

    <!-- Friend Requests List -->
    <div v-else class="space-y-4">
      <div
        v-for="request in requests"
        :key="request.id"
        class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <div class="flex items-center flex-1 min-w-0">
          <!-- User Avatar -->
          <NuxtLink :to="`/profile/${request.fromUser.uid}`" class="flex-shrink-0">
            <img 
              v-if="request.fromUser.photoURL" 
              :src="request.fromUser.photoURL" 
              :alt="request.fromUser.displayName"
              class="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
            />
            <div 
              v-else 
              class="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center font-medium"
            >
              {{ getInitials(request.fromUser.displayName) }}
            </div>
          </NuxtLink>
          
          <!-- User Info -->
          <div class="ml-4 flex-1 min-w-0">
            <div class="flex items-center space-x-2">
              <NuxtLink 
                :to="`/profile/${request.fromUser.uid}`" 
                class="font-medium text-gray-900 hover:text-green-600 transition-colors truncate"
              >
                {{ request.fromUser.displayName }}
              </NuxtLink>
              
              <!-- Carnival Badges -->
              <span 
                v-if="request.fromUser.favoriteComparsa" 
                class="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
              >
                🎆 {{ request.fromUser.favoriteComparsa }}
              </span>
            </div>
            <p class="text-sm text-gray-500 truncate">
              {{ formatTimeAgo(request.createdAt) }}
            </p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center space-x-2 ml-4">
          <button
            @click="respondToRequest(request.id!, 'accepted')"
            :disabled="isLoading"
            class="px-3 py-1 bg-green-100 text-green-700 hover:bg-green-200 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
            title="Aceptar solicitud"
          >
            ✓ Aceptar
          </button>
          <button
            @click="respondToRequest(request.id!, 'declined')"
            :disabled="isLoading"
            class="px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
            title="Rechazar solicitud"
          >
            ✗ Rechazar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { dbService } from '~/utils/database'
import type { FriendRequest } from '~/types/user'

// Composables
const { authUser } = useAuthEnhanced()
const { 
  isLoading, 
  respondToFriendRequest, 
  getFriendRequests 
} = useUserInteractions()

// State
const requests = ref<(FriendRequest & { fromUser: any })[]>([])

// Methods
const getInitials = (name: string): string => {
  if (!name) return 'U'
  return name.split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('')
}

const formatTimeAgo = (date: Date): string => {
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffMinutes = Math.ceil(diffTime / (1000 * 60))
  const diffHours = Math.ceil(diffTime / (1000 * 60 * 60))
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffMinutes < 60) {
    return `Hace ${diffMinutes} min`
  } else if (diffHours < 24) {
    return `Hace ${diffHours}h`
  } else if (diffDays < 7) {
    return `Hace ${diffDays}d`
  } else {
    return date.toLocaleDateString('es-ES', {
      month: 'short',
      day: 'numeric'
    })
  }
}

const loadFriendRequests = async () => {
  if (!authUser.value) return
  
  try {
    const pendingRequests = await getFriendRequests('received')
    console.log('📨 Received friend requests:', pendingRequests)
    
    // Enrich with user data
    const enrichedRequests = []
    for (const request of pendingRequests) {
      const fromUser = await dbService.getUserProfile(request.fromUserId)
      if (fromUser) {
        enrichedRequests.push({
          ...request,
          fromUser
        })
      }
    }
    
    requests.value = enrichedRequests
    console.log('✨ Enriched friend requests:', enrichedRequests)
  } catch (error) {
    console.error('Error loading friend requests:', error)
  }
}

const respondToRequest = async (requestId: string, response: 'accepted' | 'declined') => {
  const success = await respondToFriendRequest(requestId, response)
  
  if (success) {
    // Remove the request from the list
    requests.value = requests.value.filter(req => req.id !== requestId)
  }
}

// Lifecycle
onMounted(() => {
  loadFriendRequests()
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