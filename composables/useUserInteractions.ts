import { ref, computed } from 'vue'
import { dbService } from '~/utils/database'
import type { 
  UserProfile, 
  UserLike, 
  FriendRequest, 
  Friendship, 
  InteractionResponse
} from '~/types/user'

export const useUserInteractions = () => {
  // State
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  
  // Composables
  const { authUser } = useAuthEnhanced()
  const { notifySuccess, notifyError } = useNotifications()

  // Helper to clear error
  const clearError = () => {
    error.value = null
  }

  // Like functionality
  const likeUser = async (targetUserId: string): Promise<boolean> => {
    if (!authUser.value?.uid) {
      error.value = 'Usuario no autenticado'
      return false
    }

    try {
      isLoading.value = true
      clearError()
      
      const result = await dbService.likeUser(authUser.value.uid, targetUserId)
      
      if (result.success) {
        notifySuccess('¡Like enviado!', 'Has dado like a este usuario')
        return true
      } else {
        error.value = result.error || 'Error al dar like'
        notifyError('Error', result.error || 'Error al dar like')
        return false
      }
    } catch (err: any) {
      error.value = err.message || 'Error inesperado'
      notifyError('Error', 'Error inesperado al dar like')
      return false
    } finally {
      isLoading.value = false
    }
  }

  const unlikeUser = async (targetUserId: string): Promise<boolean> => {
    if (!authUser.value?.uid) {
      error.value = 'Usuario no autenticado'
      return false
    }

    try {
      isLoading.value = true
      clearError()
      
      const result = await dbService.unlikeUser(authUser.value.uid, targetUserId)
      
      if (result.success) {
        notifySuccess('Like eliminado', 'Has quitado tu like de este usuario')
        return true
      } else {
        error.value = result.error || 'Error al quitar like'
        notifyError('Error', result.error || 'Error al quitar like')
        return false
      }
    } catch (err: any) {
      error.value = err.message || 'Error inesperado'
      notifyError('Error', 'Error inesperado al quitar like')
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Friend functionality
  const sendFriendRequest = async (targetUserId: string): Promise<boolean> => {
    if (!authUser.value?.uid) {
      error.value = 'Usuario no autenticado'
      return false
    }

    try {
      isLoading.value = true
      clearError()
      
      const result = await dbService.sendFriendRequest(authUser.value.uid, targetUserId)
      
      if (result.success) {
        notifySuccess('Solicitud enviada', 'Solicitud de amistad enviada exitosamente')
        return true
      } else {
        error.value = result.error || 'Error al enviar solicitud'
        notifyError('Error', result.error || 'Error al enviar solicitud')
        return false
      }
    } catch (err: any) {
      error.value = err.message || 'Error inesperado'
      notifyError('Error', 'Error inesperado al enviar solicitud')
      return false
    } finally {
      isLoading.value = false
    }
  }

  const respondToFriendRequest = async (requestId: string, response: 'accepted' | 'declined'): Promise<boolean> => {
    if (!authUser.value?.uid) {
      error.value = 'Usuario no autenticado'
      return false
    }

    try {
      isLoading.value = true
      clearError()
      
      const result = await dbService.respondToFriendRequest(requestId, response, authUser.value.uid)
      
      if (result.success) {
        const message = response === 'accepted' ? 'Solicitud aceptada' : 'Solicitud rechazada'
        const description = response === 'accepted' ? 'Ahora son amigos' : 'Solicitud rechazada'
        notifySuccess(message, description)
        return true
      } else {
        error.value = result.error || 'Error al responder solicitud'
        notifyError('Error', result.error || 'Error al responder solicitud')
        return false
      }
    } catch (err: any) {
      error.value = err.message || 'Error inesperado'
      notifyError('Error', 'Error inesperado al responder solicitud')
      return false
    } finally {
      isLoading.value = false
    }
  }

  const removeFriend = async (friendUserId: string): Promise<boolean> => {
    if (!authUser.value?.uid) {
      error.value = 'Usuario no autenticado'
      return false
    }

    try {
      isLoading.value = true
      clearError()
      
      const result = await dbService.removeFriend(authUser.value.uid, friendUserId)
      
      if (result.success) {
        notifySuccess('Amistad eliminada', 'Ya no son amigos')
        return true
      } else {
        error.value = result.error || 'Error al eliminar amistad'
        notifyError('Error', result.error || 'Error al eliminar amistad')
        return false
      }
    } catch (err: any) {
      error.value = err.message || 'Error inesperado'
      notifyError('Error', 'Error inesperado al eliminar amistad')
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Get relationship status
  const getRelationshipStatus = async (targetUserId: string) => {
    if (!authUser.value?.uid) {
      return {
        isLiked: false,
        isFriend: false,
        friendRequestStatus: 'none' as const
      }
    }

    try {
      const status = await dbService.getRelationshipStatus(authUser.value.uid, targetUserId)
      return status
    } catch (err) {
      console.error('Error getting relationship status:', err)
      return {
        isLiked: false,
        isFriend: false,
        friendRequestStatus: 'none' as const
      }
    }
  }

  // Get user data
  const getUserLikes = async (userId: string, type: 'given' | 'received' = 'received'): Promise<UserLike[]> => {
    try {
      return await dbService.getUserLikes(userId, type)
    } catch (err) {
      console.error('Error getting user likes:', err)
      return []
    }
  }

  const getFriendRequests = async (type: 'sent' | 'received' = 'received'): Promise<FriendRequest[]> => {
    if (!authUser.value?.uid) return []
    
    try {
      return await dbService.getFriendRequests(authUser.value.uid, type)
    } catch (err) {
      console.error('Error getting friend requests:', err)
      return []
    }
  }

  const getUserFriends = async (userId?: string): Promise<UserProfile[]> => {
    const targetUserId = userId || authUser.value?.uid
    if (!targetUserId) return []
    
    try {
      return await dbService.getUserFriends(targetUserId)
    } catch (err) {
      console.error('Error getting user friends:', err)
      return []
    }
  }

  return {
    // State
    isLoading: readonly(isLoading),
    error: readonly(error),
    clearError,
    
    // Like functions
    likeUser,
    unlikeUser,
    
    // Friend functions
    sendFriendRequest,
    respondToFriendRequest,
    removeFriend,
    
    // Query functions
    getRelationshipStatus,
    getUserLikes,
    getFriendRequests,
    getUserFriends
  }
}