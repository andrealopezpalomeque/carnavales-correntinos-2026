<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-50 space-y-3 max-w-sm w-full">
      <TransitionGroup
        name="notification"
        tag="div"
        class="space-y-3"
      >
        <div
          v-for="notification in notifications"
          :key="notification.id"
          :class="notificationClasses(notification.type)"
          class="rounded-lg shadow-lg border p-4 relative animate-slide-in"
        >
          <!-- Icon -->
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <svg
                v-if="notification.type === 'success'"
                class="h-5 w-5 text-green-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                />
              </svg>
              
              <svg
                v-else-if="notification.type === 'error'"
                class="h-5 w-5 text-red-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd"
                />
              </svg>
              
              <svg
                v-else-if="notification.type === 'warning'"
                class="h-5 w-5 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
              
              <svg
                v-else-if="notification.type === 'info'"
                class="h-5 w-5 text-blue-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            
            <!-- Content -->
            <div class="ml-3 flex-1">
              <h3 class="text-sm font-medium" :class="titleClasses(notification.type)">
                {{ notification.title }}
              </h3>
              <p class="mt-1 text-sm" :class="messageClasses(notification.type)">
                {{ notification.message }}
              </p>
              
              <!-- Actions -->
              <div v-if="notification.actions" class="mt-3 flex space-x-2">
                <button
                  v-for="action in notification.actions"
                  :key="action.label"
                  @click="handleAction(notification.id, action)"
                  :class="actionClasses(action.style || 'secondary')"
                  class="text-xs font-medium px-3 py-1 rounded-md transition-colors duration-200"
                >
                  {{ action.label }}
                </button>
              </div>
            </div>
            
            <!-- Close Button -->
            <div class="ml-4 flex-shrink-0">
              <button
                @click="removeNotification(notification.id)"
                class="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors duration-200"
              >
                <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
          
          <!-- Progress Bar for timed notifications -->
          <div
            v-if="!notification.persistent && notification.duration"
            class="absolute bottom-0 left-0 h-1 bg-gray-200 rounded-bl-lg rounded-br-lg overflow-hidden"
            style="width: 100%"
          >
            <div
              class="h-full transition-all ease-linear"
              :class="progressBarClasses(notification.type)"
              :style="{ 
                width: '100%',
                animation: `shrink ${notification.duration}ms linear forwards`
              }"
            />
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { NotificationAction } from '~/composables/useNotifications'

// Composables
const { notifications, removeNotification } = useNotifications()

// Methods
const notificationClasses = (type: string): string => {
  const baseClasses = 'bg-white border-l-4'
  
  switch (type) {
    case 'success':
      return `${baseClasses} border-green-400`
    case 'error':
      return `${baseClasses} border-red-400`
    case 'warning':
      return `${baseClasses} border-yellow-400`
    case 'info':
      return `${baseClasses} border-blue-400`
    default:
      return `${baseClasses} border-gray-400`
  }
}

const titleClasses = (type: string): string => {
  switch (type) {
    case 'success':
      return 'text-green-800'
    case 'error':
      return 'text-red-800'
    case 'warning':
      return 'text-yellow-800'
    case 'info':
      return 'text-blue-800'
    default:
      return 'text-gray-800'
  }
}

const messageClasses = (type: string): string => {
  switch (type) {
    case 'success':
      return 'text-green-600'
    case 'error':
      return 'text-red-600'
    case 'warning':
      return 'text-yellow-600'
    case 'info':
      return 'text-blue-600'
    default:
      return 'text-gray-600'
  }
}

const actionClasses = (style: string): string => {
  switch (style) {
    case 'primary':
      return 'bg-green-600 text-white hover:bg-green-700'
    case 'danger':
      return 'bg-red-600 text-white hover:bg-red-700'
    case 'secondary':
    default:
      return 'bg-gray-200 text-gray-800 hover:bg-gray-300'
  }
}

const progressBarClasses = (type: string): string => {
  switch (type) {
    case 'success':
      return 'bg-green-400'
    case 'error':
      return 'bg-red-400'
    case 'warning':
      return 'bg-yellow-400'
    case 'info':
      return 'bg-blue-400'
    default:
      return 'bg-gray-400'
  }
}

const handleAction = (notificationId: string, action: NotificationAction) => {
  action.action()
  removeNotification(notificationId)
}
</script>

<style scoped>
/* Notification transitions */
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.notification-move {
  transition: transform 0.3s ease;
}

/* Slide in animation */
@keyframes slide-in {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-slide-in {
  animation: slide-in 0.3s ease-out;
}

/* Progress bar shrink animation */
@keyframes shrink {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}
</style>