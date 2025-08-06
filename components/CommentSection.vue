<template>
  <div class="bg-gray-50 border-t border-gray-100">
    <!-- Comment Form -->
    <div class="p-4 border-b border-gray-100">
      <div class="flex items-start space-x-3">
        <!-- User Avatar -->
        <img 
          v-if="authUser?.photoURL" 
          :src="authUser.photoURL" 
          :alt="authUser.displayName || 'Usuario'"
          class="w-8 h-8 rounded-full object-cover flex-shrink-0"
        />
        <div 
          v-else 
          class="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0"
        >
          {{ getInitials(authUser?.displayName || authUser?.email || 'U') }}
        </div>

        <!-- Comment Input -->
        <div class="flex-1">
          <form @submit.prevent="submitComment" class="space-y-3">
            <textarea
              v-model="commentText"
              :placeholder="replyingTo ? `Responder a ${replyingTo.author.displayName}...` : 'Escribe un comentario...'"
              rows="2"
              class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              :maxlength="COMMENT_CONSTRAINTS.MAX_CONTENT_LENGTH"
              @keydown="handleKeyDown"
            />
            
            <div class="flex items-center justify-between">
              <span class="text-xs text-gray-500">
                {{ commentText.length }}/{{ COMMENT_CONSTRAINTS.MAX_CONTENT_LENGTH }}
              </span>
              
              <div class="flex items-center space-x-2">
                <button
                  v-if="replyingTo"
                  type="button"
                  @click="cancelReply"
                  class="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  :disabled="!canSubmitComment || isSubmitting"
                  class="px-4 py-1.5 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {{ isSubmitting ? 'Enviando...' : (replyingTo ? 'Responder' : 'Comentar') }}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Comments List -->
    <div class="divide-y divide-gray-100">
      <!-- Loading State -->
      <div v-if="isLoading" class="p-4 text-center">
        <div class="flex items-center justify-center space-x-2">
          <svg class="animate-spin h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
          </svg>
          <span class="text-sm text-gray-600">Cargando comentarios...</span>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="p-4 bg-red-50 border border-red-200 rounded-md mx-4 mt-4">
        <p class="text-sm text-red-700">{{ error }}</p>
        <button
          @click="loadComments"
          class="mt-2 text-sm text-red-600 hover:text-red-800 font-medium"
        >
          Reintentar
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="!isLoading && comments.length === 0" class="p-4 text-center">
        <p class="text-sm text-gray-600">Sé el primero en comentar...</p>
      </div>

      <!-- Comments -->
      <div v-else>
        <CommentItem
          v-for="comment in comments"
          :key="comment.id"
          :comment="comment"
          :post-id="postId"
          @reply="handleReply"
          @comment-updated="handleCommentUpdated"
          @comment-deleted="handleCommentDeleted"
        />
      </div>

      <!-- Load More Comments -->
      <div v-if="hasMoreComments && !isLoading" class="p-4 text-center">
        <button
          @click="loadMoreComments"
          :disabled="isLoadingMore"
          class="text-sm text-green-600 hover:text-green-700 font-medium disabled:opacity-50"
        >
          {{ isLoadingMore ? 'Cargando más...' : 'Ver más comentarios' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { posts } from '~/utils/postService'
import type { CommentWithAuthor } from '~/types/post'
import { COMMENT_CONSTRAINTS } from '~/types/post'

// Props
interface Props {
  postId: string
  commentsCount?: number
  isVisible: boolean
}

const props = defineProps<Props>()

// Composables
const { authUser } = useAuthEnhanced()

// State
const comments = ref<CommentWithAuthor[]>([])
const commentText = ref('')
const isLoading = ref(false)
const isLoadingMore = ref(false)
const isSubmitting = ref(false)
const error = ref('')
const hasMoreComments = ref(false)
const replyingTo = ref<CommentWithAuthor | null>(null)

// Computed
const canSubmitComment = computed(() => {
  return commentText.value.trim().length >= COMMENT_CONSTRAINTS.MIN_CONTENT_LENGTH &&
         commentText.value.length <= COMMENT_CONSTRAINTS.MAX_CONTENT_LENGTH
})

// Methods
const getInitials = (name: string): string => {
  if (!name) return 'U'
  return name.split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('')
}

const loadComments = async () => {
  if (!props.postId || isLoading.value) return

  try {
    isLoading.value = true
    error.value = ''

    const result = await posts.getComments(props.postId, 10)
    
    if (result.success && result.data) {
      const enrichedComments = await posts.enrichCommentsWithAuthors(result.data)
      comments.value = enrichedComments
      hasMoreComments.value = result.hasMore || false
    } else {
      error.value = result.error || 'Error al cargar los comentarios'
    }
  } catch (err: any) {
    error.value = 'Error inesperado al cargar los comentarios'
    console.error('Error loading comments:', err)
  } finally {
    isLoading.value = false
  }
}

const loadMoreComments = async () => {
  if (isLoadingMore.value) return

  try {
    isLoadingMore.value = true
    
    // For now, just load more comments from the beginning
    // In a real implementation, you'd use pagination
    const result = await posts.getComments(props.postId, comments.value.length + 10)
    
    if (result.success && result.data) {
      const enrichedComments = await posts.enrichCommentsWithAuthors(result.data)
      comments.value = enrichedComments
      hasMoreComments.value = result.hasMore || false
    }
  } catch (err) {
    console.error('Error loading more comments:', err)
  } finally {
    isLoadingMore.value = false
  }
}

const submitComment = async () => {
  if (!canSubmitComment.value || !authUser.value || isSubmitting.value) return

  try {
    isSubmitting.value = true
    
    const result = await posts.createComment(
      props.postId,
      authUser.value.uid,
      commentText.value.trim(),
      replyingTo.value?.id
    )

    if (result.success && result.data) {
      const enrichedComment = await posts.enrichCommentWithAuthor(result.data)
      if (enrichedComment) {
        if (replyingTo.value) {
          // Add reply to the parent comment
          // For now, just add to the end - in a real implementation, you'd nest it properly
          comments.value.push(enrichedComment)
        } else {
          // Add new top-level comment to the beginning
          comments.value.unshift(enrichedComment)
        }
        
        commentText.value = ''
        replyingTo.value = null
        
        // Emit event to update post comment count
        emit('commentAdded')
      }
    } else {
      error.value = result.error || 'Error al crear el comentario'
    }
  } catch (err: any) {
    error.value = 'Error inesperado al crear el comentario'
    console.error('Error creating comment:', err)
  } finally {
    isSubmitting.value = false
  }
}

const handleReply = (comment: CommentWithAuthor) => {
  replyingTo.value = comment
  // Focus on the textarea (in a real implementation)
}

const cancelReply = () => {
  replyingTo.value = null
  commentText.value = ''
}

const handleCommentUpdated = (updatedComment: CommentWithAuthor) => {
  const index = comments.value.findIndex(c => c.id === updatedComment.id)
  if (index !== -1) {
    comments.value[index] = updatedComment
  }
}

const handleCommentDeleted = (commentId: string) => {
  comments.value = comments.value.filter(c => c.id !== commentId)
  emit('commentDeleted')
}

const handleKeyDown = (event: KeyboardEvent) => {
  // Submit on Ctrl/Cmd + Enter
  if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
    event.preventDefault()
    submitComment()
  }
}

// Emits
const emit = defineEmits<{
  commentAdded: []
  commentDeleted: []
}>()

// Watch for visibility changes to load comments
watch(() => props.isVisible, (isVisible) => {
  if (isVisible && comments.value.length === 0) {
    loadComments()
  }
})

// Load comments when component mounts if visible
onMounted(() => {
  if (props.isVisible) {
    loadComments()
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