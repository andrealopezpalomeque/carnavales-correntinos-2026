<template>
  <div class="google-signin-wrapper">
    <!-- Sign-in Button -->
    <button
      v-if="!isAuthenticated"
      @click="handleGoogleSignIn"
      :disabled="isLoading || signingIn"
      class="google-signin-btn"
      :class="{
        'loading': isLoading || signingIn,
        'error': error
      }"
    >
      <!-- Loading Spinner -->
      <div v-if="isLoading || signingIn" class="loading-spinner">
        <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
          <circle 
            class="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            stroke-width="4"
          />
          <path 
            class="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        <span>{{ signingIn ? 'Iniciando sesión...' : 'Cargando...' }}</span>
      </div>

      <!-- Google Logo and Text -->
      <div v-else class="google-btn-content">
        <svg class="google-logo" viewBox="0 0 24 24" width="20" height="20">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        <span>{{ buttonText }}</span>
      </div>
    </button>

    <!-- User Info (when authenticated) -->
    <div v-else class="user-info">
      <div class="user-avatar">
        <img 
          v-if="user?.photoURL" 
          :src="user.photoURL" 
          :alt="userDisplayName"
          class="avatar-img"
        />
        <div v-else class="avatar-placeholder">
          {{ userInitials }}
        </div>
      </div>
      
      <div class="user-details">
        <p class="user-name">{{ userDisplayName }}</p>
        <p class="user-email">{{ user?.email }}</p>
      </div>

      <button
        @click="handleSignOut"
        :disabled="isLoading"
        class="sign-out-btn"
        title="Cerrar sesión"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
        </svg>
        <span class="sr-only">Cerrar sesión</span>
      </button>
    </div>

    <!-- Error Message -->
    <div v-if="error && !isLoading" class="error-message">
      <svg class="error-icon" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
      </svg>
      <span>{{ error }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  buttonText?: string
  showUserInfo?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'outline' | 'minimal'
}

interface Emits {
  signInSuccess: [user: any]
  signInError: [error: string]
  signOutSuccess: []
  signOutError: [error: string]
}

const props = withDefaults(defineProps<Props>(), {
  buttonText: 'Iniciar sesión con Google',
  showUserInfo: true,
  size: 'md',
  variant: 'default'
})

const emit = defineEmits<Emits>()

// Use our auth composable
const {
  user,
  isAuthenticated,
  isLoading,
  error,
  signInWithGoogle,
  signOutUser,
  userDisplayName,
  userInitials
} = useAuth()

// Local loading state for this component
const signingIn = ref(false)

// Handle Google Sign-in
const handleGoogleSignIn = async () => {
  signingIn.value = true
  
  try {
    const result = await signInWithGoogle()
    
    if (result.success) {
      emit('signInSuccess', user.value)
    } else {
      emit('signInError', result.error || 'Error al iniciar sesión')
    }
  } catch (error: any) {
    emit('signInError', error.message || 'Error inesperado')
  } finally {
    signingIn.value = false
  }
}

// Handle Sign-out
const handleSignOut = async () => {
  try {
    const result = await signOutUser()
    
    if (result.success) {
      emit('signOutSuccess')
    } else {
      emit('signOutError', result.error || 'Error al cerrar sesión')
    }
  } catch (error: any) {
    emit('signOutError', error.message || 'Error inesperado')
  }
}

// Watch for authentication changes
watch(isAuthenticated, (newVal) => {
  if (newVal && user.value) {
    nextTick(() => {
      emit('signInSuccess', user.value)
    })
  }
})
</script>

<style scoped>
.google-signin-wrapper {
  @apply w-full max-w-sm mx-auto;
}

/* Sign-in Button Styles */
.google-signin-btn {
  @apply w-full flex items-center justify-center gap-3 px-6 py-3 bg-white border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md;
}

.google-signin-btn:disabled {
  @apply opacity-70 cursor-not-allowed hover:bg-white hover:border-gray-300 hover:shadow-sm;
}

.google-signin-btn.loading {
  @apply bg-gray-50 border-gray-400;
}

.google-signin-btn.error {
  @apply border-red-300 hover:border-red-400;
}

.google-btn-content {
  @apply flex items-center justify-center gap-3;
}

.google-logo {
  @apply flex-shrink-0;
}

.loading-spinner {
  @apply flex items-center justify-center gap-3 text-gray-600;
}

/* User Info Styles */
.user-info {
  @apply flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg shadow-sm;
}

.user-avatar {
  @apply flex-shrink-0;
}

.avatar-img {
  @apply w-10 h-10 rounded-full object-cover border-2 border-gray-200;
}

.avatar-placeholder {
  @apply w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-medium text-sm;
}

.user-details {
  @apply flex-1 min-w-0;
}

.user-name {
  @apply text-sm font-medium text-gray-900 truncate;
}

.user-email {
  @apply text-xs text-gray-500 truncate;
}

.sign-out-btn {
  @apply flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200;
}

/* Error Message Styles */
.error-message {
  @apply mt-3 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm;
}

.error-icon {
  @apply w-4 h-4 flex-shrink-0;
}

/* Size Variants */
.google-signin-btn.size-sm {
  @apply px-4 py-2 text-sm;
}

.google-signin-btn.size-lg {
  @apply px-8 py-4 text-lg;
}

/* Variant Styles */
.google-signin-btn.variant-outline {
  @apply bg-transparent border-2 border-green-500 text-green-600 hover:bg-green-50;
}

.google-signin-btn.variant-minimal {
  @apply bg-transparent border-none text-green-600 hover:bg-green-50 shadow-none hover:shadow-none;
}

/* Screen Reader Only */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Animations */
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

/* Responsive adjustments */
@media (max-width: 480px) {
  .google-signin-wrapper {
    @apply max-w-none;
  }
  
  .google-signin-btn {
    @apply px-4 py-3 text-sm;
  }
  
  .user-info {
    @apply p-3;
  }
  
  .user-name {
    @apply text-xs;
  }
  
  .user-email {
    @apply text-xs;
  }
}
</style>