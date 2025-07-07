import { defineNuxtPlugin } from '#app'
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getAuth, connectAuthEmulator } from 'firebase/auth'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig().public
  
  // Check if all required config is present
  const firebaseConfig = {
    apiKey: config.FIREBASE_API_KEY,
    authDomain: config.FIREBASE_AUTH_DOMAIN,
    projectId: config.FIREBASE_PROJECT_ID,
    storageBucket: config.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: config.FIREBASE_MESSAGING_SENDER_ID,
    appId: config.FIREBASE_APP_ID,
  }

  // Log configuration for debugging (remove sensitive info)
  console.log('Firebase config loaded:', {
    hasApiKey: !!firebaseConfig.apiKey,
    authDomain: firebaseConfig.authDomain,
    projectId: firebaseConfig.projectId,
    hasAppId: !!firebaseConfig.appId
  })

  // Check if we have the required config
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.error('Firebase configuration missing required fields')
    return {
      provide: {
        firebase: null
      }
    }
  }

  try {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig)
    const db = getFirestore(app)
    const storage = getStorage(app)
    const auth = getAuth(app)
    
    console.log('Firebase initialized successfully', { auth: !!auth })

    // Note: Auth emulator is disabled for production-like development
    // Uncomment the lines below if you want to use Firebase Auth emulator
    // if (process.dev && !auth.emulatorConfig) {
    //   try {
    //     connectAuthEmulator(auth, 'http://localhost:9099')
    //   } catch (error) {
    //     console.warn('Firebase Auth emulator not available:', error)
    //   }
    // }

    return {
      provide: {
        firebase: {
          app,
          auth,
          db,
          storage
        }
      }
    }
  } catch (error) {
    console.error('Firebase initialization failed:', error)
    return {
      provide: {
        firebase: null
      }
    }
  }
})
