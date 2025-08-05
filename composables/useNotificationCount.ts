import { ref, computed } from 'vue'
import { dbService } from '~/utils/database'

export const useNotificationCount = () => {
  // State
  const friendRequestCount = ref(0)
  const isLoading = ref(false)
  
  // Composables
  const { authUser } = useAuthEnhanced()

  // Computed
  const totalNotifications = computed(() => friendRequestCount.value)
  const hasNotifications = computed(() => totalNotifications.value > 0)

  // Methods
  const loadFriendRequestCount = async () => {
    if (!authUser.value?.uid) {
      friendRequestCount.value = 0
      return
    }

    try {
      isLoading.value = true
      const requests = await dbService.getFriendRequests(authUser.value.uid, 'received')
      friendRequestCount.value = requests.length
    } catch (error) {
      console.error('Error loading friend request count:', error)
      friendRequestCount.value = 0
    } finally {
      isLoading.value = false
    }
  }

  const refreshNotificationCount = async () => {
    await loadFriendRequestCount()
  }

  return {
    // State
    friendRequestCount: readonly(friendRequestCount),
    totalNotifications: readonly(totalNotifications),
    hasNotifications: readonly(hasNotifications),
    isLoading: readonly(isLoading),
    
    // Methods
    loadFriendRequestCount,
    refreshNotificationCount
  }
}