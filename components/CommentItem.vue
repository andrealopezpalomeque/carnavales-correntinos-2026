<template>
  <div class="p-4">
    <div class="flex items-start space-x-3">
      <!-- Author Avatar -->
      <NuxtLink :to="`/profile/${comment.author.uid}`" class="flex-shrink-0">
        <img 
          v-if="comment.author.photoURL" 
          :src="comment.author.photoURL" 
          :alt="comment.author.displayName"
          class="w-8 h-8 rounded-full object-cover hover:ring-2 hover:ring-green-500 transition-all"
        />
        <div 
          v-else 
          class="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold hover:ring-2 hover:ring-green-500 transition-all"
        >
          {{ getInitials(comment.author.displayName) }}
        </div>
      </NuxtLink>

      <div class="flex-1 min-w-0">
        <!-- Comment Header -->
        <div class="flex items-center space-x-2 mb-1">
          <NuxtLink 
            :to="`/profile/${comment.author.uid}`" 
            class="font-semibold text-sm text-gray-900 hover:text-green-600 transition-colors"
          >
            {{ comment.author.displayName }}
          </NuxtLink>
          
          <span class="text-gray-300">•</span>
          
          <time :datetime="comment.createdAt.toISOString()" class="text-xs text-gray-500">
            {{ formatTimeAgo(comment.createdAt) }}
          </time>
          
          <span v-if="comment.isEdited" class="text-xs text-gray-500">
            • Editado
          </span>
        </div>

        <!-- Comment Content -->
        <div v-if="!isEditing" class="mb-2">
          <p class="text-sm text-gray-900 whitespace-pre-wrap break-words">{{ comment.content }}</p>
        </div>

        <!-- Edit Form -->
        <div v-else class="mb-2">
          <form @submit.prevent="saveEdit" class="space-y-2">
            <textarea
              v-model="editText"
              rows="2"
              class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              :maxlength="COMMENT_CONSTRAINTS.MAX_CONTENT_LENGTH"
              @keydown="handleEditKeyDown"
              ref="editTextarea"
            />
            <div class="flex items-center justify-between">
              <span class="text-xs text-gray-500">
                {{ editText.length }}/{{ COMMENT_CONSTRAINTS.MAX_CONTENT_LENGTH }}
              </span>
              <div class="flex items-center space-x-2">
                <button
                  type="button"
                  @click="cancelEdit"
                  class="px-3 py-1.5 text-xs text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  :disabled="!canSaveEdit || isSaving"
                  class="px-3 py-1.5 bg-green-600 text-white text-xs rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  {{ isSaving ? 'Guardando...' : 'Guardar' }}
                </button>
              </div>
            </div>
          </form>
        </div>

        <!-- Comment Actions -->
        <div class="flex items-center space-x-4">
          <!-- Like Button (placeholder) -->
          <button
            class="flex items-center space-x-1 text-xs text-gray-500 hover:text-green-600 transition-colors"
            disabled
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
            <span>{{ comment.likes > 0 ? comment.likes : 'Me gusta' }}</span>
          </button>
          
          <!-- Reply Button -->
          <button
            @click="handleReply"
            class="flex items-center space-x-1 text-xs text-gray-500 hover:text-green-600 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
            </svg>
            <span>Responder</span>
          </button>
          
          <!-- Edit/Delete Menu -->
          <div v-if="canEditComment" class="relative">
            <button
              @click="showMenu = !showMenu"
              class="text-xs text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-md hover:bg-gray-100"
              @blur="showMenu = false"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
              </svg>
            </button>
            
            <div v-if="showMenu" class="absolute right-0 bottom-8 w-32 bg-white rounded-md shadow-lg border border-gray-200 z-50">
              <button
                @click="startEdit; showMenu = false"
                class="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
                <span>Editar</span>
              </button>
              <button
                @click="deleteComment; showMenu = false"
                class="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center space-x-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
                <span>Eliminar</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Replies (placeholder for nested comments) -->
        <div v-if="hasReplies" class="mt-3 pl-4 border-l-2 border-gray-100">
          <button
            class="text-xs text-green-600 hover:text-green-700 font-medium"
            @click="toggleReplies"
          >
            {{ showReplies ? 'Ocultar respuestas' : `Ver respuestas (${replyCount})` }}
          </button>
          
          <!-- Replies would be loaded and displayed here -->
          <div v-if="showReplies" class="mt-2 text-xs text-gray-500">
            Las respuestas anidadas estarán disponibles pronto...
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">¿Eliminar comentario?</h3>
        <p class="text-gray-600 mb-6">
          Esta acción no se puede deshacer. El comentario será eliminado permanentemente.
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { posts } from '~/utils/postService'
import type { CommentWithAuthor } from '~/types/post'
import { COMMENT_CONSTRAINTS } from '~/types/post'

// Props
interface Props {
  comment: CommentWithAuthor
  postId: string
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  reply: [comment: CommentWithAuthor]
  commentUpdated: [comment: CommentWithAuthor]
  commentDeleted: [commentId: string]
}>()

// Composables
const { authUser } = useAuthEnhanced()

// State
const showMenu = ref(false)
const showDeleteConfirm = ref(false)
const showReplies = ref(false)
const isEditing = ref(false)
const editText = ref('')
const isSaving = ref(false)
const isDeleting = ref(false)
const editTextarea = ref<HTMLTextAreaElement>()

// Computed
const canEditComment = computed(() => {
  const canEdit = authUser.value?.uid === props.comment.authorId
  console.log('CommentItem - canEditComment check:', {
    authUserId: authUser.value?.uid,
    commentAuthorId: props.comment.authorId,
    canEdit
  })
  return canEdit
})

const canSaveEdit = computed(() => {
  const trimmed = editText.value.trim()
  return trimmed.length >= COMMENT_CONSTRAINTS.MIN_CONTENT_LENGTH &&
         trimmed.length <= COMMENT_CONSTRAINTS.MAX_CONTENT_LENGTH &&
         trimmed !== props.comment.content.trim()
})

const hasReplies = computed(() => false) // Placeholder for reply functionality
const replyCount = computed(() => 0) // Placeholder

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
    return `${diffMinutes}min`
  } else if (diffHours < 24) {
    return `${diffHours}h`
  } else if (diffDays < 7) {
    return `${diffDays}d`
  } else {
    return date.toLocaleDateString('es-ES', {
      month: 'short',
      day: 'numeric'
    })
  }
}

const handleReply = () => {
  emit('reply', props.comment)
}

const startEdit = async (event?: Event) => {
  if (event) {
    event.stopPropagation()
  }
  showMenu.value = false
  isEditing.value = true
  editText.value = props.comment.content
  
  await nextTick()
  if (editTextarea.value) {
    editTextarea.value.focus()
    editTextarea.value.setSelectionRange(editText.value.length, editText.value.length)
  }
}

const cancelEdit = () => {
  isEditing.value = false
  editText.value = ''
}

const saveEdit = async () => {
  if (!canSaveEdit.value || !authUser.value || isSaving.value) return

  try {
    isSaving.value = true
    
    const result = await posts.updateComment(
      props.comment.id!,
      authUser.value.uid,
      editText.value.trim()
    )

    if (result.success && result.data) {
      const enrichedComment = await posts.enrichCommentWithAuthor(result.data)
      if (enrichedComment) {
        emit('commentUpdated', enrichedComment)
        isEditing.value = false
        editText.value = ''
      }
    } else {
      console.error('Error updating comment:', result.error)
    }
  } catch (error) {
    console.error('Error updating comment:', error)
  } finally {
    isSaving.value = false
  }
}

const deleteComment = (event?: Event) => {
  if (event) {
    event.stopPropagation()
  }
  showMenu.value = false
  showDeleteConfirm.value = true
}

const confirmDelete = async () => {
  if (!authUser.value || isDeleting.value) return

  try {
    isDeleting.value = true
    
    const result = await posts.deleteComment(props.comment.id!, authUser.value.uid)
    
    if (result.success) {
      emit('commentDeleted', props.comment.id!)
      showDeleteConfirm.value = false
    } else {
      console.error('Error deleting comment:', result.error)
    }
  } catch (error) {
    console.error('Error deleting comment:', error)
  } finally {
    isDeleting.value = false
  }
}

const toggleReplies = () => {
  showReplies.value = !showReplies.value
  // In a real implementation, this would load replies
}

const handleEditKeyDown = (event: KeyboardEvent) => {
  if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
    event.preventDefault()
    saveEdit()
  } else if (event.key === 'Escape') {
    cancelEdit()
  }
}

</script>

<style scoped>
/* Custom focus styles for better accessibility */
.focus-visible:focus {
  outline: 2px solid #10b981;
  outline-offset: 2px;
}
</style>