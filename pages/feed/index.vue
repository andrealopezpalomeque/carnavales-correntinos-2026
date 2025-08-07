<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 max-w-2xl py-4 sm:py-8">
      <!-- Page Header -->
      <div class="mb-6 sm:mb-8">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Feed Social</h1>
        <p class="text-sm sm:text-base text-gray-600">Mantente conectado con la comunidad de Carnavales Correntinos</p>
      </div>

      <!-- Post Creator -->
      <div class="mb-6 sm:mb-8">
        <PostCreator @post-created="handlePostCreated" />
      </div>

      <!-- Feed Controls -->
      <div class="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div class="flex items-center space-x-4 w-full sm:w-auto">
          <select
            v-model="feedFilter"
            @change="loadFeed"
            class="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 w-full sm:w-auto"
          >
            <option value="all">Todas las publicaciones</option>
            <option value="friends">Solo amigos</option>
            <option value="comparsa">Mi comparsa</option>
            <option value="agrupacion">Mi agrupación</option>
          </select>
        </div>

        <button
          @click="refreshFeed"
          :disabled="isLoading"
          class="flex items-center justify-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 transition-colors w-full sm:w-auto"
        >
          <svg 
            class="w-4 h-4" 
            :class="{ 'animate-spin': isLoading }"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          <span>Actualizar</span>
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading && posts.length === 0" class="flex justify-center py-12">
        <div class="flex items-center space-x-2">
          <svg class="animate-spin h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
          </svg>
          <span class="text-gray-600">Cargando publicaciones...</span>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div class="flex items-center">
          <svg class="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z"/>
          </svg>
          <div>
            <h3 class="text-sm font-medium text-red-800">Error al cargar el feed</h3>
            <p class="text-sm text-red-700 mt-1">{{ error }}</p>
          </div>
        </div>
        <button
          @click="loadFeed"
          class="mt-3 px-3 py-2 text-sm font-medium text-red-800 bg-red-100 rounded-md hover:bg-red-200 transition-colors"
        >
          Reintentar
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="!isLoading && posts.length === 0" class="text-center py-12">
        <div class="max-w-md mx-auto">
          <svg class="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10m0 0V6a2 2 0 00-2-2H9a2 2 0 00-2 2v2m10 0v10a2 2 0 01-2 2H9a2 2 0 01-2-2V8m10 0H7"/>
          </svg>
          <h3 class="text-lg font-medium text-gray-900 mb-2">No hay publicaciones</h3>
          <p class="text-gray-600 mb-6">
            {{ getEmptyStateMessage() }}
          </p>
          <div class="space-y-3">
            <NuxtLink
              to="/users"
              class="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
              </svg>
              Descubrir personas
            </NuxtLink>
            <div>
              <button
                @click="feedFilter = 'all'; loadFeed()"
                class="text-green-600 hover:text-green-700 text-sm font-medium"
              >
                Ver todas las publicaciones públicas
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Posts Feed -->
      <div v-else class="space-y-6">
        <PostCard
          v-for="post in posts"
          :key="post.id"
          :post="post"
          @post-updated="handlePostUpdated"
          @post-deleted="handlePostDeleted"
        />

        <!-- Load More Button -->
        <div v-if="hasMore" class="text-center py-6">
          <button
            @click="loadMorePosts"
            :disabled="isLoadingMore"
            class="px-6 py-3 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            <span v-if="isLoadingMore" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              Cargando más...
            </span>
            <span v-else>Cargar más publicaciones</span>
          </button>
        </div>
      </div>

      <!-- Friends Suggestion (if no friends) -->
      <div v-if="!isLoading && posts.length === 0 && friendsCount === 0" class="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div class="flex items-start">
          <svg class="w-6 h-6 text-blue-600 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.196-2.121M9 6a3 3 0 106 0 3 3 0 00-6 0zm9 13a5 5 0 01-10 0h10z"/>
          </svg>
          <div>
            <h3 class="text-lg font-medium text-blue-900 mb-2">¡Conecta con la comunidad!</h3>
            <p class="text-blue-700 mb-4">
              Agrega amigos para ver sus publicaciones en tu feed. Encuentra personas que comparten tus mismas pasiones por el carnaval.
            </p>
            <NuxtLink
              to="/users"
              class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Explorar usuarios
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { posts as postService } from '~/utils/postService'
import type { PostWithAuthor, PostFilterBy } from '~/types/post'

// Page metadata
definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

useSeoMeta({
  title: 'Feed Social - Carnavales Correntinos 2026',
  description: 'Mantente conectado con la comunidad de Carnavales Correntinos. Comparte y descubre contenido sobre el carnaval.'
})

// Composables
const { authUser, userProfile } = useAuthEnhanced()

// State
const feedPosts = ref<PostWithAuthor[]>([])
const isLoading = ref(false)
const isLoadingMore = ref(false)
const error = ref('')
const hasMore = ref(false)
const nextCursor = ref<string>()
const feedFilter = ref<PostFilterBy>('all') // Default to 'all' to show content immediately
const friendsCount = ref(0)

// Computed
const posts = computed(() => feedPosts.value)

// Methods
const loadFeed = async (resetPosts = true) => {
  if (!authUser.value) {
    console.error('❌ No authenticated user found')
    return
  }

  try {
    console.log('🔄 Loading feed...', { resetPosts, filter: feedFilter.value, userId: authUser.value.uid })
    
    if (resetPosts) {
      isLoading.value = true
      feedPosts.value = []
    } else {
      isLoadingMore.value = true
    }
    error.value = ''

    // Get user's feed posts
    const result = await postService.getFeed(authUser.value.uid, {
      filterBy: feedFilter.value,
      limit: 10,
      cursor: resetPosts ? undefined : nextCursor.value
    })

    console.log('📋 Feed result:', result)

    if (result.success && result.data) {
      console.log('📄 Raw posts received:', result.data.length)
      
      // Enrich posts with author information
      const enrichedPosts = await postService.enrichWithAuthors(result.data)
      console.log('✨ Enriched posts:', enrichedPosts.length)
      
      if (resetPosts) {
        feedPosts.value = enrichedPosts
      } else {
        feedPosts.value.push(...enrichedPosts)
      }

      hasMore.value = result.hasMore || false
      nextCursor.value = result.nextCursor
      
      console.log('✅ Feed loaded successfully. Total posts:', feedPosts.value.length)
    } else {
      console.error('❌ Feed loading failed:', result.error)
      error.value = result.error || 'Error al cargar el feed'
    }
  } catch (err: any) {
    console.error('❌ Error loading feed:', err)
    error.value = 'Error inesperado al cargar el feed'
  } finally {
    isLoading.value = false
    isLoadingMore.value = false
  }
}

const loadMorePosts = async () => {
  if (!hasMore.value || isLoadingMore.value) return
  await loadFeed(false)
}

const refreshFeed = async () => {
  await loadFeed(true)
}

const handlePostCreated = async (newPost: any) => {
  // Add the new post to the beginning of the feed
  const enrichedPost = await postService.enrichWithAuthor(newPost)
  if (enrichedPost) {
    feedPosts.value.unshift(enrichedPost)
  }
}

const handlePostUpdated = (updatedPost: PostWithAuthor) => {
  const index = feedPosts.value.findIndex(p => p.id === updatedPost.id)
  if (index !== -1) {
    feedPosts.value[index] = updatedPost
  }
}

const handlePostDeleted = (postId: string) => {
  feedPosts.value = feedPosts.value.filter(p => p.id !== postId)
}

const getEmptyStateMessage = (): string => {
  switch (feedFilter.value) {
    case 'friends':
      return 'Aún no hay publicaciones de tus amigos. ¡Agrega amigos para ver su contenido!'
    case 'comparsa':
      return userProfile.value?.favoriteComparsa 
        ? `No hay publicaciones de tu comparsa ${userProfile.value.favoriteComparsa}.`
        : 'Selecciona tu comparsa favorita en tu perfil para ver publicaciones relacionadas.'
    case 'agrupacion':
      return userProfile.value?.favoriteAgrupacion
        ? `No hay publicaciones de tu agrupación ${userProfile.value.favoriteAgrupacion}.`
        : 'Selecciona tu agrupación musical favorita en tu perfil para ver publicaciones relacionadas.'
    case 'all':
      return '¡Sé el primero en publicar! Comparte algo sobre el carnaval con la comunidad.'
    default:
      return 'No hay publicaciones disponibles en este momento.'
  }
}

const loadUserStats = async () => {
  if (!userProfile.value) return
  
  // Get user's friend count
  friendsCount.value = userProfile.value.interactions?.friendsCount || 0
}

// Lifecycle
onMounted(async () => {
  await loadUserStats()
  await loadFeed()
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