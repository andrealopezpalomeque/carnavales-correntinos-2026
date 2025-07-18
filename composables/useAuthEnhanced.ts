import type { User } from 'firebase/auth'
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  type Auth 
} from 'firebase/auth'
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  serverTimestamp,
  type Firestore 
} from 'firebase/firestore'
import { dbService } from '~/utils/database'
import { isEmailWhitelisted, getWhitelistErrorMessage } from '~/utils/emailWhitelist'
import type { 
  AuthUser, 
  UserProfile, 
  AuthState, 
  CreateUserProfileData,
  UpdateUserProfileData,
  AuthResponse,
  UserPreferences 
} from '~/types/user'

// Estado global de autenticación
const globalAuthState = reactive<AuthState>({
  authUser: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  userProfile: null,
  isProfileLoading: false,
  isNewUser: false,
  profileError: null
})

let authInitialized = false

// Preferencias por defecto
const defaultPreferences: UserPreferences = {
  theme: 'system',
  language: 'es',
  notifications: {
    email: true,
    push: true,
    marketing: false
  },
  privacy: {
    showEmail: false,
    showProfile: true
  }
}

export const useAuthEnhanced = () => {
  const authState = globalAuthState

  // Verificar si estamos en el servidor
  if (process.server) {
    return {
      authUser: readonly(ref(null)),
      userProfile: readonly(ref(null)),
      isAuthenticated: readonly(ref(false)),
      isLoading: readonly(ref(true)),
      isProfileLoading: readonly(ref(false)),
      isNewUser: readonly(ref(false)),
      error: readonly(ref(null)),
      profileError: readonly(ref(null)),
      signInWithGoogle: async () => ({ success: false, error: 'Server-side rendering' }),
      signOutUser: async () => ({ success: false, error: 'Server-side rendering' }),
      createUserProfile: async () => ({ success: false, error: 'Server-side rendering' }),
      updateUserProfile: async () => ({ success: false, error: 'Server-side rendering' }),
      refreshUserProfile: async () => ({ success: false, error: 'Server-side rendering' }),
      userDisplayName: computed(() => 'Usuario'),
      userInitials: computed(() => 'U'),
      hasRole: () => false
    }
  }

  // Obtener Firebase Auth y Firestore
  const getFirebaseServices = (): { auth: Auth | null, db: Firestore | null } => {
    try {
      const { $firebase } = useNuxtApp()
      return {
        auth: $firebase?.auth || null,
        db: $firebase?.db || null
      }
    } catch (error) {
      console.warn('Firebase not available yet:', error)
      return { auth: null, db: null }
    }
  }

  // Convertir Firebase User a AuthUser
  const mapFirebaseUser = (firebaseUser: User): AuthUser => ({
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName,
    photoURL: firebaseUser.photoURL,
    emailVerified: firebaseUser.emailVerified
  })

  // Crear perfil de usuario en Firestore
  const createUserProfile = async (userData: CreateUserProfileData = {}): Promise<AuthResponse> => {
    const { db } = getFirebaseServices()
    if (!db || !authState.authUser) {
      return { success: false, error: 'Firebase o usuario no disponible' }
    }

    try {
      authState.isProfileLoading = true
      authState.profileError = null

      const userProfile: UserProfile = {
        uid: authState.authUser.uid,
        email: authState.authUser.email || '',
        displayName: authState.authUser.displayName || '',
        photoURL: authState.authUser.photoURL,
        firstName: userData.firstName || null,
        lastName: userData.lastName || null,
        bio: userData.bio || null,
        preferences: { ...defaultPreferences, ...userData.preferences },
        role: 'user',
        isActive: true,
        isNewUser: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLoginAt: new Date()
      }

      const userDocRef = doc(db, 'users', authState.authUser.uid)
      await setDoc(userDocRef, {
        ...userProfile,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastLoginAt: serverTimestamp()
      })

      authState.userProfile = userProfile
      authState.isNewUser = true

      return { success: true, data: userProfile }
    } catch (error: any) {
      console.error('Error creando perfil de usuario:', error)
      const errorMessage = 'Error al crear perfil de usuario'
      authState.profileError = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      authState.isProfileLoading = false
    }
  }

  // Obtener perfil de usuario de Firestore
  const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
    const { db } = getFirebaseServices()
    if (!db) return null

    try {
      const userDocRef = doc(db, 'users', uid)
      const userDoc = await getDoc(userDocRef)
      
      if (userDoc.exists()) {
        const data = userDoc.data()
        return {
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          lastLoginAt: data.lastLoginAt?.toDate() || new Date()
        } as UserProfile
      }
      
      return null
    } catch (error) {
      console.error('Error obteniendo perfil de usuario:', error)
      return null
    }
  }

  // Actualizar perfil de usuario
  const updateUserProfile = async (updates: UpdateUserProfileData): Promise<AuthResponse> => {
    
    const { db } = getFirebaseServices()
    if (!db || !authState.authUser) {
      return { success: false, error: 'Firebase o usuario no disponible' }
    }


    try {
      authState.isProfileLoading = true
      authState.profileError = null

      const userDocRef = doc(db, 'users', authState.authUser.uid)
      
      const updateData = {
        ...updates,
        updatedAt: serverTimestamp()
      }

      await updateDoc(userDocRef, updateData)

      // Actualizar estado local
      if (authState.userProfile) {
        authState.userProfile = {
          ...authState.userProfile,
          ...updates,
          updatedAt: new Date()
        }
      }

      // Log profile update activity
      try {
        await dbService.logUserAction(authState.authUser.uid, 'profile_update', {
          updatedFields: Object.keys(updates),
          ...updates
        })
      } catch (logError) {
        console.warn('⚠️ Failed to log user action, but continuing:', logError)
      }

      return { success: true, data: authState.userProfile }
    } catch (error: any) {
      console.error('💥 Error in updateUserProfile:', error)
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        stack: error.stack
      })
      const errorMessage = `Error al actualizar perfil de usuario: ${error.message || error.code || 'Error desconocido'}`
      authState.profileError = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      authState.isProfileLoading = false
    }
  }

  // Refrescar perfil de usuario
  const refreshUserProfile = async (): Promise<AuthResponse> => {
    if (!authState.authUser) {
      return { success: false, error: 'Usuario no autenticado' }
    }

    try {
      authState.isProfileLoading = true
      const profile = await getUserProfile(authState.authUser.uid)
      
      if (profile) {
        authState.userProfile = profile
        authState.isNewUser = profile.isNewUser
        return { success: true, data: profile }
      }
      
      return { success: false, error: 'Perfil no encontrado' }
    } catch (error) {
      console.error('Error refrescando perfil:', error)
      return { success: false, error: 'Error al refrescar perfil' }
    } finally {
      authState.isProfileLoading = false
    }
  }

  // Inicializar estado de autenticación
  const initializeAuth = () => {
    if (authInitialized) return

    const { auth } = getFirebaseServices()
    if (!auth) {
      setTimeout(initializeAuth, 1000)
      return
    }

    authInitialized = true

    onAuthStateChanged(auth, async (firebaseUser) => {
      authState.isLoading = false
      
      if (firebaseUser) {
        // Check email whitelist first
        if (!isEmailWhitelisted(firebaseUser.email || '')) {
          console.warn('Email not whitelisted:', firebaseUser.email)
          
          // Log unauthorized access attempt
          await dbService.logUserAction(firebaseUser.uid, 'unauthorized_access_attempt', {
            email: firebaseUser.email,
            reason: 'email_not_whitelisted'
          }).catch(() => {
            // Ignore logging errors for unauthorized users
          })
          
          // Sign out the user immediately
          await signOut(auth)
          
          // Set error state
          authState.authUser = null
          authState.isAuthenticated = false
          authState.userProfile = null
          authState.isNewUser = false
          authState.error = getWhitelistErrorMessage()
          
          return
        }
        
        authState.authUser = mapFirebaseUser(firebaseUser)
        authState.isAuthenticated = true
        authState.error = null
        
        
        // Cargar perfil de usuario
        const profile = await getUserProfile(firebaseUser.uid)
        
        if (profile) {
          authState.userProfile = profile
          authState.isNewUser = profile.isNewUser
          
          // Actualizar último login
          await updateUserProfile({ 
            lastLoginAt: serverTimestamp() as any 
          })
          
          // Log user activity
          await dbService.logUserAction(firebaseUser.uid, 'login', {
            loginMethod: 'existing_user',
            isNewUser: profile.isNewUser,
            email: firebaseUser.email
          })
        } else {
          // Es un nuevo usuario, crear perfil
          await createUserProfile()
          
          // Log new user registration
          await dbService.logUserAction(firebaseUser.uid, 'register', {
            registrationMethod: 'google',
            isNewUser: true,
            email: firebaseUser.email
          })
        }
      } else {
        authState.authUser = null
        authState.isAuthenticated = false
        authState.userProfile = null
        authState.isNewUser = false
      }
    }, (error) => {
      console.error('Error en cambio de estado de autenticación:', error)
      authState.error = 'Error de autenticación'
      authState.isLoading = false
    })
  }

  // Iniciar sesión con Google
  const signInWithGoogle = async (): Promise<AuthResponse> => {
    const { auth } = getFirebaseServices()
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

      const result = await signInWithPopup(auth, provider)
      
      if (result.user) {
        // Double-check email whitelist after successful Google auth
        if (!isEmailWhitelisted(result.user.email || '')) {
          console.warn('Email not whitelisted during sign-in:', result.user.email)
          
          // Log unauthorized access attempt
          await dbService.logUserAction(result.user.uid, 'unauthorized_signin_attempt', {
            email: result.user.email,
            reason: 'email_not_whitelisted',
            provider: 'google'
          }).catch(() => {
            // Ignore logging errors for unauthorized users
          })
          
          // Sign out immediately
          await signOut(auth)
          
          const errorMessage = getWhitelistErrorMessage()
          authState.error = errorMessage
          return { success: false, error: errorMessage }
        }
        
        authState.authUser = mapFirebaseUser(result.user)
        authState.isAuthenticated = true
        return { success: true, data: authState.authUser }
      }
      
      return { success: false, error: 'No se pudo obtener la información del usuario' }
    } catch (error: any) {
      console.error('Error en inicio de sesión con Google:', error)
      
      let errorMessage = 'Error al iniciar sesión con Google'
      
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

  // Cerrar sesión
  const signOutUser = async (): Promise<AuthResponse> => {
    const { auth } = getFirebaseServices()
    if (!auth) {
      return { success: false, error: 'Firebase no está disponible' }
    }

    try {
      authState.isLoading = true
      authState.error = null

      // Log logout activity before signing out (with error handling)
      if (authState.authUser) {
        try {
          await dbService.logUserAction(authState.authUser.uid, 'logout', {
            logoutMethod: 'manual'
          })
        } catch (logError) {
          console.warn('Could not log logout activity:', logError)
          // Continue with logout even if logging fails
        }
      }

      await signOut(auth)
      
      authState.authUser = null
      authState.isAuthenticated = false
      authState.userProfile = null
      authState.isNewUser = false
      
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

  // Verificar rol de usuario
  const hasRole = (role: string): boolean => {
    return authState.userProfile?.role === role
  }

  // Inicializar autenticación en el cliente
  if (process.client) {
    nextTick(() => {
      initializeAuth()
    })
  }

  return {
    // Estado (solo lectura)
    authUser: readonly(toRef(authState, 'authUser')),
    userProfile: readonly(toRef(authState, 'userProfile')),
    isAuthenticated: readonly(toRef(authState, 'isAuthenticated')),
    isLoading: readonly(toRef(authState, 'isLoading')),
    isProfileLoading: readonly(toRef(authState, 'isProfileLoading')),
    isNewUser: readonly(toRef(authState, 'isNewUser')),
    error: readonly(toRef(authState, 'error')),
    profileError: readonly(toRef(authState, 'profileError')),
    
    // Métodos
    signInWithGoogle,
    signOutUser,
    createUserProfile,
    updateUserProfile,
    refreshUserProfile,
    hasRole,
    
    // Computadas
    userDisplayName: computed(() => 
      authState.userProfile?.displayName || 
      authState.authUser?.displayName || 
      authState.authUser?.email || 
      'Usuario'
    ),
    userInitials: computed(() => {
      const name = authState.userProfile?.displayName || 
                  authState.authUser?.displayName || 
                  authState.authUser?.email || 
                  'U'
      return name.split(' ')
        .map(word => word.charAt(0).toUpperCase())
        .slice(0, 2)
        .join('')
    })
  }
}