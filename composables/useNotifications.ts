import { ref, computed, reactive } from 'vue'

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
  persistent?: boolean
  actions?: NotificationAction[]
  createdAt: Date
}

export interface NotificationAction {
  label: string
  action: () => void
  style?: 'primary' | 'secondary' | 'danger'
}

// Global notification state
const notifications = ref<Notification[]>([])
const notificationId = ref(0)

export const useNotifications = () => {
  // Add notification
  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt'>): string => {
    const id = `notification-${++notificationId.value}`
    const newNotification: Notification = {
      ...notification,
      id,
      createdAt: new Date(),
      duration: notification.duration ?? (notification.persistent ? 0 : 5000)
    }

    notifications.value.push(newNotification)

    // Auto-remove if not persistent
    if (!newNotification.persistent && newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, newNotification.duration)
    }

    return id
  }

  // Remove notification
  const removeNotification = (id: string): void => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  // Clear all notifications
  const clearAll = (): void => {
    notifications.value = []
  }

  // Success notification
  const notifySuccess = (title: string, message: string, options?: Partial<Notification>): string => {
    return addNotification({
      type: 'success',
      title,
      message,
      ...options
    })
  }

  // Error notification
  const notifyError = (title: string, message: string, options?: Partial<Notification>): string => {
    return addNotification({
      type: 'error',
      title,
      message,
      persistent: true, // Errors should be persistent by default
      ...options
    })
  }

  // Warning notification
  const notifyWarning = (title: string, message: string, options?: Partial<Notification>): string => {
    return addNotification({
      type: 'warning',
      title,
      message,
      ...options
    })
  }

  // Info notification
  const notifyInfo = (title: string, message: string, options?: Partial<Notification>): string => {
    return addNotification({
      type: 'info',
      title,
      message,
      ...options
    })
  }

  // Authentication-specific notifications
  const notifyAuthSuccess = (message: string = 'Sesión iniciada correctamente'): string => {
    return notifySuccess('¡Bienvenido!', message)
  }

  const notifyAuthError = (error: string): string => {
    return notifyError('Error de Autenticación', error)
  }

  const notifyLogout = (): string => {
    return notifyInfo('Sesión Cerrada', 'Has cerrado sesión correctamente')
  }

  // Profile-specific notifications
  const notifyProfileUpdated = (): string => {
    return notifySuccess('Perfil Actualizado', 'Tu perfil se ha actualizado correctamente')
  }

  const notifyProfileError = (error: string): string => {
    return notifyError('Error de Perfil', error)
  }

  const notifyAvatarUploaded = (): string => {
    return notifySuccess('Avatar Actualizado', 'Tu foto de perfil se ha actualizado correctamente')
  }

  // Permission notifications
  const notifyPermissionDenied = (action: string): string => {
    return notifyWarning('Permisos Insuficientes', `No tienes permisos para ${action}`)
  }

  // Network notifications
  const notifyNetworkError = (): string => {
    return notifyError('Error de Conexión', 'Verifica tu conexión a internet e inténtalo de nuevo')
  }

  // Confirmation notifications with actions
  const notifyConfirmation = (
    title: string, 
    message: string, 
    onConfirm: () => void, 
    onCancel?: () => void
  ): string => {
    return addNotification({
      type: 'warning',
      title,
      message,
      persistent: true,
      actions: [
        {
          label: 'Confirmar',
          action: () => {
            onConfirm()
            // The notification will be removed after action
          },
          style: 'danger'
        },
        {
          label: 'Cancelar',
          action: () => {
            if (onCancel) onCancel()
            // The notification will be removed after action
          },
          style: 'secondary'
        }
      ]
    })
  }

  return {
    // State
    notifications: readonly(notifications),
    
    // Core methods
    addNotification,
    removeNotification,
    clearAll,
    
    // Convenience methods
    notifySuccess,
    notifyError,
    notifyWarning,
    notifyInfo,
    
    // Specific notifications
    notifyAuthSuccess,
    notifyAuthError,
    notifyLogout,
    notifyProfileUpdated,
    notifyProfileError,
    notifyAvatarUploaded,
    notifyPermissionDenied,
    notifyNetworkError,
    notifyConfirmation,
    
    // Computed
    hasNotifications: computed(() => notifications.value.length > 0),
    errorCount: computed(() => notifications.value.filter(n => n.type === 'error').length),
    unreadCount: computed(() => notifications.value.length)
  }
}