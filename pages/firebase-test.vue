<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4">
    <div class="max-w-2xl mx-auto">
      <div class="bg-white rounded-lg shadow-lg p-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-8 text-center">
          🔥 Firebase Configuration Test
        </h1>

        <!-- Firebase Config Status -->
        <div class="space-y-4 mb-8">
          <h2 class="text-xl font-semibold text-gray-800">Configuration Status:</h2>
          
          <div class="grid grid-cols-1 gap-3">
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span class="font-medium">Project ID:</span>
              <span class="text-sm font-mono">{{ firebaseConfig.projectId || 'Not set' }}</span>
            </div>
            
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span class="font-medium">Auth Domain:</span>
              <span class="text-sm font-mono">{{ firebaseConfig.authDomain || 'Not set' }}</span>
            </div>
            
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span class="font-medium">API Key:</span>
              <span class="text-sm font-mono">{{ firebaseConfig.apiKey ? '✅ Set' : '❌ Missing' }}</span>
            </div>
            
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span class="font-medium">App ID:</span>
              <span class="text-sm font-mono">{{ firebaseConfig.appId ? '✅ Set' : '❌ Missing' }}</span>
            </div>
          </div>
        </div>

        <!-- Firebase Auth Status -->
        <div class="space-y-4 mb-8">
          <h2 class="text-xl font-semibold text-gray-800">Authentication Status:</h2>
          
          <div class="p-4 rounded-lg" :class="authStatus.color">
            <div class="flex items-center gap-3">
              <span class="text-2xl">{{ authStatus.icon }}</span>
              <div>
                <p class="font-medium">{{ authStatus.title }}</p>
                <p class="text-sm">{{ authStatus.message }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Test Sign-in Button -->
        <div class="text-center space-y-4">
          <button
            @click="testGoogleSignIn"
            :disabled="isTestingSignIn || !canTestSignIn"
            class="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-3"
          >
            <svg v-if="isTestingSignIn" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            <span>{{ isTestingSignIn ? 'Testing...' : 'Test Google Sign-in' }}</span>
          </button>

          <p class="text-sm text-gray-600">
            This will test the actual Google Sign-in popup
          </p>
        </div>

        <!-- Test Results -->
        <div v-if="testResult" class="mt-6 p-4 rounded-lg" :class="testResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'">
          <div class="flex items-start gap-3">
            <span class="text-xl">{{ testResult.success ? '✅' : '❌' }}</span>
            <div>
              <p class="font-medium" :class="testResult.success ? 'text-green-800' : 'text-red-800'">
                {{ testResult.success ? 'Success!' : 'Error' }}
              </p>
              <p class="text-sm" :class="testResult.success ? 'text-green-600' : 'text-red-600'">
                {{ testResult.message }}
              </p>
              <div v-if="testResult.details" class="mt-2 p-2 bg-gray-100 rounded text-xs font-mono">
                {{ testResult.details }}
              </div>
            </div>
          </div>
        </div>

        <!-- Instructions -->
        <div class="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 class="font-medium text-yellow-800 mb-2">🚨 If you see errors:</h3>
          <ol class="text-sm text-yellow-700 space-y-1 list-decimal list-inside">
            <li>Make sure Google Sign-in is enabled in <a href="https://console.firebase.google.com/" target="_blank" class="underline">Firebase Console</a></li>
            <li>Check that your domain is in the authorized domains list</li>
            <li>Verify your Firebase configuration values are correct</li>
            <li>Ensure you're not using the Firebase emulator</li>
          </ol>
        </div>

        <!-- Back to Home -->
        <div class="text-center mt-8">
          <NuxtLink
            to="/"
            class="inline-flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors duration-200"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            Back to Home
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Set page meta
definePageMeta({
  title: 'Firebase Test',
  description: 'Test Firebase configuration and Google Sign-in'
})

// Get runtime config
const config = useRuntimeConfig()

// Firebase configuration from env
const firebaseConfig = {
  projectId: config.public.FIREBASE_PROJECT_ID,
  authDomain: config.public.FIREBASE_AUTH_DOMAIN,
  apiKey: config.public.FIREBASE_API_KEY,
  appId: config.public.FIREBASE_APP_ID
}

// Auth composable
const { signInWithGoogle, isAuthenticated, user, error } = useAuth()

// Local state
const isTestingSignIn = ref(false)
const testResult = ref(null)

// Computed auth status
const authStatus = computed(() => {
  if (error.value) {
    return {
      icon: '❌',
      title: 'Authentication Error',
      message: error.value,
      color: 'bg-red-50 border border-red-200'
    }
  }
  
  if (isAuthenticated.value && user.value) {
    return {
      icon: '✅',
      title: 'Authenticated',
      message: `Signed in as ${user.value.displayName || user.value.email}`,
      color: 'bg-green-50 border border-green-200'
    }
  }
  
  return {
    icon: '⏳',
    title: 'Not Authenticated',
    message: 'Ready to test Google Sign-in',
    color: 'bg-blue-50 border border-blue-200'
  }
})

// Can test sign-in if not already authenticated and no errors
const canTestSignIn = computed(() => !isAuthenticated.value && !error.value)

// Test Google Sign-in
const testGoogleSignIn = async () => {
  if (isTestingSignIn.value || !canTestSignIn.value) return

  isTestingSignIn.value = true
  testResult.value = null

  try {
    console.log('Starting Google Sign-in test...')
    const result = await signInWithGoogle()
    
    if (result.success) {
      testResult.value = {
        success: true,
        message: 'Google Sign-in completed successfully!',
        details: user.value ? `User: ${user.value.displayName} (${user.value.email})` : null
      }
    } else {
      testResult.value = {
        success: false,
        message: result.error || 'Unknown error occurred',
        details: 'Check the browser console for more details'
      }
    }
  } catch (error) {
    console.error('Test sign-in error:', error)
    testResult.value = {
      success: false,
      message: error.message || 'Unexpected error occurred',
      details: error.code || error.toString()
    }
  } finally {
    isTestingSignIn.value = false
  }
}

// Log configuration on mount (client-side only)
onMounted(() => {
  console.log('Firebase Test Page - Configuration:', {
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain,
    hasApiKey: !!firebaseConfig.apiKey,
    hasAppId: !!firebaseConfig.appId
  })
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