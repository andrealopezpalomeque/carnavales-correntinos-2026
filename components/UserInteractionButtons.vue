<template>
  <div class="flex space-x-2">
    <!-- Like Button -->
    <button
      @click="handleLikeToggle"
      :disabled="isLoading || isCurrentUser"
      :class="[
        'flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200',
        isLiked 
          ? 'bg-red-100 text-red-700 hover:bg-red-200' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
        (isLoading || isCurrentUser) && 'opacity-50 cursor-not-allowed'
      ]"
      :title="isCurrentUser ? 'No puedes darte like a ti mismo' : (isLiked ? 'Quitar like' : 'Dar like')"
    >
      <svg 
        :class="['w-4 h-4', isLiked ? 'text-red-500' : 'text-gray-500']" 
        :fill="isLiked ? 'currentColor' : 'none'" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
      </svg>
      <span>{{ isLiked ? 'Liked' : 'Like' }}</span>
      <span v-if="likesCount > 0" class="text-xs bg-white bg-opacity-50 px-1 rounded">
        {{ likesCount }}
      </span>
    </button>

    <!-- Friend Button -->
    <button
      @click="handleFriendAction"
      :disabled="isLoading || isCurrentUser"
      :class="[
        'flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200',
        getFriendButtonClasses(),
        (isLoading || isCurrentUser) && 'opacity-50 cursor-not-allowed'
      ]"
      :title="isCurrentUser ? 'No puedes agregarte como amigo' : getFriendButtonTitle()"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path 
          v-if="friendRequestStatus === 'friends'" 
          stroke-linecap="round" 
          stroke-linejoin="round" 
          stroke-width="2" 
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
        <path 
          v-else-if="friendRequestStatus === 'sent'" 
          stroke-linecap="round" 
          stroke-linejoin="round" 
          stroke-width="2" 
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
        <path 
          v-else-if="friendRequestStatus === 'received'" 
          stroke-linecap="round" 
          stroke-linejoin="round" 
          stroke-width="2" 
          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
        />
        <path 
          v-else 
          stroke-linecap="round" 
          stroke-linejoin="round" 
          stroke-width="2" 
          d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
        />
      </svg>
      <span>{{ getFriendButtonText() }}</span>
      <span v-if="friendsCount > 0" class="text-xs bg-white bg-opacity-50 px-1 rounded">
        {{ friendsCount }}
      </span>
    </button>

    <!-- Friend Request Response Buttons (when received a request) -->
    <div v-if="friendRequestStatus === 'received'" class="flex space-x-1">
      <button
        @click="handleFriendRequestResponse('accepted')"
        :disabled="isLoading"
        class="px-2 py-1 bg-green-100 text-green-700 hover:bg-green-200 rounded text-xs font-medium transition-colors duration-200 disabled:opacity-50"
        title="Aceptar solicitud"
      >
        ✓
      </button>
      <button
        @click="handleFriendRequestResponse('declined')"
        :disabled="isLoading"
        class="px-2 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded text-xs font-medium transition-colors duration-200 disabled:opacity-50"
        title="Rechazar solicitud"
      >
        ✗
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import type { UserProfile } from '~/types/user'

// Props
interface Props {
  targetUser: UserProfile
  compact?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  compact: false
})

// Emits
const emit = defineEmits<{
  interactionUpdate: []
}>()

// Composables
const { authUser } = useAuthEnhanced()
const { 
  isLoading, 
  likeUser, 
  unlikeUser, 
  sendFriendRequest, 
  respondToFriendRequest, 
  removeFriend, 
  getRelationshipStatus,
  getFriendRequests
} = useUserInteractions()

// State
const isLiked = ref(false)
const isFriend = ref(false)
const friendRequestStatus = ref<'none' | 'sent' | 'received' | 'friends'>('none')
const pendingFriendRequestId = ref<string | null>(null)

// Computed
const isCurrentUser = computed(() => 
  authUser.value?.uid === props.targetUser.uid
)

const likesCount = computed(() => 
  props.targetUser.interactions?.likesReceived || 0
)

const friendsCount = computed(() => 
  props.targetUser.interactions?.friendsCount || 0
)

// Methods
const loadRelationshipStatus = async () => {
  if (isCurrentUser.value) return
  
  try {
    const status = await getRelationshipStatus(props.targetUser.uid)
    isLiked.value = status.isLiked
    isFriend.value = status.isFriend
    friendRequestStatus.value = status.friendRequestStatus
    
    // If we received a friend request, get the request ID
    if (status.friendRequestStatus === 'received') {
      const receivedRequests = await getFriendRequests('received')
      const targetRequest = receivedRequests.find(req => req.fromUserId === props.targetUser.uid)
      if (targetRequest) {
        pendingFriendRequestId.value = targetRequest.id
      }
    }
  } catch (error) {
    console.error('Error loading relationship status:', error)
  }
}

const handleLikeToggle = async () => {
  if (isCurrentUser.value || isLoading.value) return
  
  console.log('🔘 Like button clicked, current state:', isLiked.value ? 'liked' : 'not liked')
  
  const success = isLiked.value 
    ? await unlikeUser(props.targetUser.uid)
    : await likeUser(props.targetUser.uid)
    
  console.log('🔘 Like operation result:', success)
    
  if (success) {
    isLiked.value = !isLiked.value
    emit('interactionUpdate')
  }
}

const handleFriendAction = async () => {
  if (isCurrentUser.value || isLoading.value) return
  
  let success = false
  
  switch (friendRequestStatus.value) {
    case 'none':
      success = await sendFriendRequest(props.targetUser.uid)
      if (success) {
        friendRequestStatus.value = 'sent'
      }
      break
      
    case 'sent':
      // Could implement cancel request functionality here
      console.log('Friend request already sent')
      break
      
    case 'friends':
      // Confirm unfriend action
      if (confirm('¿Estás seguro de que quieres eliminar esta amistad?')) {
        success = await removeFriend(props.targetUser.uid)
        if (success) {
          friendRequestStatus.value = 'none'
          isFriend.value = false
          emit('interactionUpdate')
        }
      }
      break
  }
  
  if (success) {
    emit('interactionUpdate')
  }
}

const handleFriendRequestResponse = async (response: 'accepted' | 'declined') => {
  if (!pendingFriendRequestId.value) {
    // If we don't have the request ID, fetch it first
    console.log('No pending request ID, fetching friend requests...')
    const receivedRequests = await getFriendRequests('received')
    const targetRequest = receivedRequests.find(req => req.fromUserId === props.targetUser.uid)
    if (targetRequest) {
      pendingFriendRequestId.value = targetRequest.id
    } else {
      console.error('Could not find friend request ID')
      await loadRelationshipStatus()
      return
    }
  }
  
  console.log(`Responding to friend request ${pendingFriendRequestId.value} with ${response}`)
  const success = await respondToFriendRequest(pendingFriendRequestId.value, response)
  
  if (success) {
    if (response === 'accepted') {
      friendRequestStatus.value = 'friends'
      isFriend.value = true
    } else {
      friendRequestStatus.value = 'none'
    }
    pendingFriendRequestId.value = null // Clear the request ID
    emit('interactionUpdate')
  }
}

const getFriendButtonClasses = () => {
  switch (friendRequestStatus.value) {
    case 'friends':
      return 'bg-green-100 text-green-700 hover:bg-green-200'
    case 'sent':
      return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
    case 'received':
      return 'bg-blue-100 text-blue-700 hover:bg-blue-200'
    default:
      return 'bg-gray-100 text-gray-700 hover:bg-gray-200'
  }
}

const getFriendButtonText = () => {
  switch (friendRequestStatus.value) {
    case 'friends':
      return 'Amigos'
    case 'sent':
      return 'Enviado'
    case 'received':
      return 'Responder'
    default:
      return 'Agregar'
  }
}

const getFriendButtonTitle = () => {
  switch (friendRequestStatus.value) {
    case 'friends':
      return 'Eliminar amistad'
    case 'sent':
      return 'Solicitud enviada'
    case 'received':
      return 'Responder solicitud de amistad'
    default:
      return 'Enviar solicitud de amistad'
  }
}

// Lifecycle
onMounted(() => {
  if (!isCurrentUser.value) {
    loadRelationshipStatus()
  }
})

// Watch for target user changes
watch(() => props.targetUser.uid, () => {
  if (!isCurrentUser.value) {
    loadRelationshipStatus()
  }
}, { immediate: false })
</script>