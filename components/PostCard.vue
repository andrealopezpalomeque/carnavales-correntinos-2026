<template>
  <article class="bg-white rounded-lg shadow-md overflow-hidden">
    <!-- Post Header -->
    <div class="p-3 sm:p-4 border-b border-gray-100">
      <div class="flex items-start justify-between">
        <div class="flex items-center space-x-2 sm:space-x-3">
          <!-- Author Avatar -->
          <NuxtLink :to="`/profile/${post.author.uid}`" class="flex-shrink-0">
            <img 
              v-if="post.author.photoURL" 
              :src="post.author.photoURL" 
              :alt="post.author.displayName"
              class="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover hover:ring-2 hover:ring-green-500 transition-all"
            />
            <div 
              v-else 
              class="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-500 text-white flex items-center justify-center text-xs sm:text-sm font-bold hover:ring-2 hover:ring-green-500 transition-all"
            >
              {{ getInitials(post.author.displayName) }}
            </div>
          </NuxtLink>

          <!-- Author Info -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center space-x-2">
              <NuxtLink 
                :to="`/profile/${post.author.uid}`" 
                class="font-semibold text-gray-900 hover:text-green-600 transition-colors"
              >
                {{ post.author.displayName }}
              </NuxtLink>
              
              <!-- Carnival Badges -->
              <span 
                v-if="post.author.favoriteComparsa" 
                class="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
              >
                🎆 {{ post.author.favoriteComparsa }}
              </span>
              <span 
                v-if="post.author.favoriteAgrupacion" 
                class="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800"
              >
                🎵 {{ post.author.favoriteAgrupacion }}
              </span>
            </div>
            
            <!-- Post Metadata -->
            <div class="flex items-center space-x-2 mt-1">
              <time :datetime="post.createdAt.toISOString()" class="text-sm text-gray-500">
                {{ formatTimeAgo(post.createdAt) }}
              </time>
              
              <!-- Privacy Indicator -->
              <span class="text-gray-300">•</span>
              <span class="text-sm text-gray-500 flex items-center space-x-1">
                <component :is="getPrivacyIcon(post.privacy)" class="w-3 h-3" />
                <span>{{ getPrivacyLabel(post.privacy) }}</span>
              </span>
              
              <!-- Location -->
              <template v-if="post.location">
                <span class="text-gray-300">•</span>
                <span class="text-sm text-gray-500 flex items-center space-x-1">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  <span>{{ post.location }}</span>
                </span>
              </template>
              
              <!-- Edited Indicator -->
              <template v-if="post.isEdited">
                <span class="text-gray-300">•</span>
                <span class="text-sm text-gray-500">Editado</span>
              </template>
            </div>
          </div>
        </div>

        <!-- Post Actions Menu -->
        <div class="relative" v-if="canEditPost">
          <button
            @click="showMenu = !showMenu"
            class="p-1 rounded-full hover:bg-gray-100 transition-colors"
            @blur="showMenu = false"
          >
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
            </svg>
          </button>
          
          <!-- Dropdown Menu -->
          <div v-if="showMenu" class="absolute right-0 top-8 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
            <button
              @click="editPost"
              class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
              <span>Editar</span>
            </button>
            <button
              @click="deletePost"
              class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
              <span>Eliminar</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Post Content -->
    <div class="p-3 sm:p-4">
      <!-- Text Content -->
      <div v-if="post.content" class="prose prose-sm max-w-none">
        <p class="text-gray-900 whitespace-pre-wrap break-words">{{ post.content }}</p>
      </div>

      <!-- Tags -->
      <div v-if="post.tags && post.tags.length > 0" class="flex flex-wrap gap-2 mt-3">
        <span
          v-for="tag in post.tags"
          :key="tag"
          class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors cursor-pointer"
          @click="searchByTag(tag)"
        >
          #{{ tag }}
        </span>
      </div>

      <!-- Images (placeholder for future implementation) -->
      <div v-if="post.images && post.images.length > 0" class="mt-4">
        <div class="grid gap-2" :class="getImageGridClass(post.images.length)">
          <div
            v-for="(image, index) in post.images"
            :key="index"
            class="bg-gray-200 rounded-lg aspect-square flex items-center justify-center"
          >
            <span class="text-gray-500 text-sm">Imagen {{ index + 1 }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Post Interactions -->
    <div class="px-3 sm:px-4 py-3 border-t border-gray-100">
      <!-- Interaction Stats -->
      <div v-if="post.likes > 0 || post.comments > 0" class="flex items-center justify-between text-sm text-gray-500 mb-3">
        <div class="flex items-center space-x-4">
          <span v-if="post.likes > 0" class="flex items-center space-x-1">
            <svg class="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
            <span>{{ post.likes }} {{ post.likes === 1 ? 'like' : 'likes' }}</span>
          </span>
          <span v-if="post.comments > 0">
            {{ post.comments }} {{ post.comments === 1 ? 'comentario' : 'comentarios' }}
          </span>
        </div>
      </div>

      <!-- Interaction Buttons -->
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-1 sm:space-x-4">
          <!-- Like Button -->
          <button
            @click="toggleLike"
            :disabled="isLiking"
            class="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors duration-200"
            :class="userHasLiked ? 'text-red-600 bg-red-50 hover:bg-red-100' : 'text-gray-700 hover:bg-gray-100'"
          >
            <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
            <span class="hidden sm:inline">{{ userHasLiked ? 'Te gusta' : 'Me gusta' }}</span>
            <span class="sm:hidden">{{ userHasLiked ? '❤️' : '🤍' }}</span>
          </button>

          <!-- Comment Button -->
          <button
            @click="toggleComments"
            class="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors duration-200"
          >
            <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
            </svg>
            <span class="hidden sm:inline">Comentar</span>
            <span class="sm:hidden">💬</span>
          </button>

          <!-- Share Button (placeholder) -->
          <button
            class="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors duration-200"
            disabled
          >
            <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"/>
            </svg>
            <span class="hidden sm:inline">Compartir</span>
            <span class="sm:hidden">📤</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Comments Section -->
    <CommentSection
      v-if="showComments"
      :post-id="post.id!"
      :comments-count="post.comments"
      :is-visible="showComments"
      @comment-added="handleCommentAdded"
      @comment-deleted="handleCommentDeleted"
    />

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">¿Eliminar publicación?</h3>
        <p class="text-gray-600 mb-6">
          Esta acción no se puede deshacer. La publicación será eliminada permanentemente.
        </p>
        <div class="flex justify-end space-x-3">
          <button
            @click="showDeleteConfirm = false"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
          <button
            @click="confirmDelete"
            :disabled="isDeleting"
            class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {{ isDeleting ? 'Eliminando...' : 'Eliminar' }}
          </button>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { posts } from '~/utils/postService'
import type { PostWithAuthor } from '~/types/post'

// Props
interface Props {
  post: PostWithAuthor
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  postUpdated: [post: PostWithAuthor]
  postDeleted: [postId: string]
}>()

// Composables
const { authUser } = useAuthEnhanced()

// Local state
const showMenu = ref(false)
const showComments = ref(false)
const showDeleteConfirm = ref(false)
const isLiking = ref(false)
const isDeleting = ref(false)
const userHasLiked = ref(false) // TODO: Load from user interactions

// Computed
const canEditPost = computed(() => 
  authUser.value?.uid === props.post.authorId
)

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

const getPrivacyIcon = (privacy: string) => {
  switch (privacy) {
    case 'public':
      return 'svg' // Globe icon component
    case 'friends':
      return 'svg' // Friends icon component
    case 'comparsa':
    case 'agrupacion':
      return 'svg' // Group icon component
    default:
      return 'svg'
  }
}

const getPrivacyLabel = (privacy: string): string => {
  switch (privacy) {
    case 'public':
      return 'Público'
    case 'friends':
      return 'Amigos'
    case 'comparsa':
      return 'Comparsa'
    case 'agrupacion':
      return 'Agrupación'
    default:
      return 'Público'
  }
}

const getImageGridClass = (count: number): string => {
  if (count === 1) return 'grid-cols-1'
  if (count === 2) return 'grid-cols-2'
  if (count === 3) return 'grid-cols-3'
  return 'grid-cols-2'
}

const searchByTag = (tag: string) => {
  // TODO: Implement tag search
  console.log('Search by tag:', tag)
}

const toggleLike = async () => {
  if (!authUser.value || isLiking.value) return

  try {
    isLiking.value = true

    if (userHasLiked.value) {
      const result = await posts.unlike(props.post.id!, authUser.value.uid)
      if (result.success) {
        userHasLiked.value = false
        // Update like count (optimistic update)
        const updatedPost = { ...props.post, likes: props.post.likes - 1 }
        emit('postUpdated', updatedPost)
      }
    } else {
      const result = await posts.like(props.post.id!, authUser.value.uid)
      if (result.success) {
        userHasLiked.value = true
        // Update like count (optimistic update)
        const updatedPost = { ...props.post, likes: props.post.likes + 1 }
        emit('postUpdated', updatedPost)
      }
    }
  } catch (error) {
    console.error('Error toggling like:', error)
  } finally {
    isLiking.value = false
  }
}

const toggleComments = () => {
  showComments.value = !showComments.value
}

const editPost = () => {
  showMenu.value = false
  // TODO: Implement post editing
  console.log('Edit post:', props.post.id)
}

const deletePost = () => {
  showMenu.value = false
  showDeleteConfirm.value = true
}

const confirmDelete = async () => {
  if (!authUser.value || isDeleting.value) return

  try {
    isDeleting.value = true
    
    const result = await posts.delete(props.post.id!, authUser.value.uid)
    
    if (result.success) {
      emit('postDeleted', props.post.id!)
      showDeleteConfirm.value = false
    } else {
      console.error('Error deleting post:', result.error)
    }
  } catch (error) {
    console.error('Error deleting post:', error)
  } finally {
    isDeleting.value = false
  }
}

const handleCommentAdded = () => {
  // Update post comment count optimistically
  const updatedPost = { ...props.post, comments: props.post.comments + 1 }
  emit('postUpdated', updatedPost)
}

const handleCommentDeleted = () => {
  // Update post comment count optimistically
  const updatedPost = { ...props.post, comments: Math.max(0, props.post.comments - 1) }
  emit('postUpdated', updatedPost)
}
</script>

<style scoped>
/* Custom scrollbar for long content */
.prose::-webkit-scrollbar {
  width: 4px;
}

.prose::-webkit-scrollbar-track {
  background: transparent;
}

.prose::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 2px;
}

.prose::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>