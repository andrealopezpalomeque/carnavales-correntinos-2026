import type { User } from 'firebase/auth'
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  type Auth 
} from 'firebase/auth'

export interface AuthUser {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  emailVerified: boolean
}

export interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

// Global auth state to ensure consistency across components
const globalAuthState = reactive<AuthState>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null
})

let authInitialized = false

export const useAuth = () => {
  // Always return the same global state
  const authState = globalAuthState

  // Check if we're on the client side
  if (process.server) {
    return {
      user: readonly(ref(null)),
      isAuthenticated: readonly(ref(false)),
      isLoading: readonly(ref(true)),
      error: readonly(ref(null)),
      signInWithGoogle: async () => ({ success: false, error: 'Server-side rendering' }),
      signOutUser: async () => ({ success: false, error: 'Server-side rendering' }),
      refreshToken: async () => null,
      hasEmailDomain: () => false,
      userDisplayName: computed(() => 'Usuario'),
      userInitials: computed(() => 'U')
    }
  }

  // Try to get Firebase auth
  const getFirebaseAuth = (): Auth | null => {
    try {
      const { $firebase } = useNuxtApp()
      return $firebase?.auth || null
    } catch (error) {
      console.warn('Firebase not available yet:', error)
      return null
    }
  }

  // Convert Firebase User to our AuthUser interface
  const mapFirebaseUser = (firebaseUser: User): AuthUser => ({
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName,
    photoURL: firebaseUser.photoURL,
    emailVerified: firebaseUser.emailVerified
  })

  // Initialize auth state listener
  const initializeAuth = () => {
    if (authInitialized) return

    const auth = getFirebaseAuth()
    if (!auth) {
      // Try again in a bit
      setTimeout(initializeAuth, 1000)
      return
    }

    authInitialized = true
    console.log('Initializing Firebase auth listener...')

    onAuthStateChanged(auth, (firebaseUser) => {
      authState.isLoading = false
      if (firebaseUser) {
        authState.user = mapFirebaseUser(firebaseUser)
        authState.isAuthenticated = true
        authState.error = null
        console.log('User authenticated:', authState.user)
      } else {
        authState.user = null
        authState.isAuthenticated = false
        console.log('User not authenticated')
      }
    }, (error) => {
      console.error('Auth state change error:', error)
      authState.error = 'Error de autenticación'
      authState.isLoading = false
    })
  }

  // Google Sign-in
  const signInWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    const auth = getFirebaseAuth()
    if (!auth) {
      const errorMessage = 'Firebase no está disponible'
      authState.error = errorMessage
      return { success: false, error: errorMessage }
    }

    try {
      authState.isLoading = true
      authState.error = null

      const provider = new GoogleAuthProvider()
      provider.addScope('email')
      provider.addScope('profile')

      console.log('Starting Google sign-in...')
      const result = await signInWithPopup(auth, provider)
      
      if (result.user) {
        authState.user = mapFirebaseUser(result.user)
        authState.isAuthenticated = true
        console.log('Google sign-in successful:', authState.user)
        return { success: true }
      }
      
      return { success: false, error: 'No se pudo obtener la información del usuario' }
    } catch (error: any) {
      console.error('Error en Google Sign-in:', error)
      
      let errorMessage = 'Error al iniciar sesión con Google'
      
      // Handle specific Firebase auth errors
      switch (error.code) {
        case 'auth/popup-closed-by-user':
          errorMessage = 'La ventana de inicio de sesión fue cerrada'
          break
        case 'auth/popup-blocked':
          errorMessage = 'El navegador bloqueó la ventana emergente'
          break
        case 'auth/cancelled-popup-request':
          errorMessage = 'Solicitud de inicio de sesión cancelada'
          break
        case 'auth/network-request-failed':
          errorMessage = 'Error de conexión. Verifica tu internet'
          break
        case 'auth/too-many-requests':
          errorMessage = 'Demasiados intentos. Inténtalo más tarde'
          break
        default:
          errorMessage = error.message || 'Error desconocido al iniciar sesión'
      }
      
      authState.error = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      authState.isLoading = false
    }
  }

  // Sign out
  const signOutUser = async (): Promise<{ success: boolean; error?: string }> => {
    const auth = getFirebaseAuth()
    if (!auth) {
      return { success: false, error: 'Firebase no está disponible' }
    }

    try {
      authState.isLoading = true
      authState.error = null

      await signOut(auth)
      
      authState.user = null
      authState.isAuthenticated = false
      console.log('Sign-out successful')
      
      return { success: true }
    } catch (error: any) {
      console.error('Error al cerrar sesión:', error)
      const errorMessage = 'Error al cerrar sesión'
      authState.error = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      authState.isLoading = false
    }
  }

  // Check if user has specific email domain (optional utility)
  const hasEmailDomain = (domain: string): boolean => {
    return authState.user?.email?.endsWith(domain) ?? false
  }

  // Refresh user token (useful for API calls)
  const refreshToken = async (): Promise<string | null> => {
    const auth = getFirebaseAuth()
    if (!auth) return null

    try {
      if (auth.currentUser) {
        return await auth.currentUser.getIdToken(true)
      }
      return null
    } catch (error) {
      console.error('Error refreshing token:', error)
      return null
    }
  }

  // Initialize auth on composable creation (client-side only)
  if (process.client) {
    // Use nextTick to ensure Vue is fully mounted
    nextTick(() => {
      initializeAuth()
    })
  }

  return {
    // State (readonly to prevent external modifications)
    user: readonly(toRef(authState, 'user')),
    isAuthenticated: readonly(toRef(authState, 'isAuthenticated')),
    isLoading: readonly(toRef(authState, 'isLoading')),
    error: readonly(toRef(authState, 'error')),
    
    // Methods
    signInWithGoogle,
    signOutUser,
    refreshToken,
    hasEmailDomain,
    
    // Computed
    userDisplayName: computed(() => 
      authState.user?.displayName || authState.user?.email || 'Usuario'
    ),
    userInitials: computed(() => {
      const name = authState.user?.displayName || authState.user?.email || 'U'
      return name.split(' ')
        .map(word => word.charAt(0).toUpperCase())
        .slice(0, 2)
        .join('')
    })
  }
}