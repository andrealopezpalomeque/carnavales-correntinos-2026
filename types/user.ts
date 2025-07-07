// Firebase Auth User (datos básicos de autenticación)
export interface AuthUser {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  emailVerified: boolean
}

// User Profile (datos completos en Firestore)
export interface UserProfile {
  uid: string
  email: string
  displayName: string
  photoURL: string | null
  firstName: string | null
  lastName: string | null
  bio: string | null
  preferences: UserPreferences
  role: UserRole
  isActive: boolean
  isNewUser: boolean
  createdAt: Date
  updatedAt: Date
  lastLoginAt: Date
}

// Preferencias del usuario
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  language: 'es' | 'en'
  notifications: {
    email: boolean
    push: boolean
    marketing: boolean
  }
  privacy: {
    showEmail: boolean
    showProfile: boolean
  }
}

// Roles de usuario
export type UserRole = 'admin' | 'moderator' | 'user'

// Estado de autenticación extendido
export interface AuthState {
  // Firebase Auth
  authUser: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  
  // User Profile
  userProfile: UserProfile | null
  isProfileLoading: boolean
  isNewUser: boolean
  profileError: string | null
}

// Datos para crear/actualizar perfil
export interface CreateUserProfileData {
  firstName?: string
  lastName?: string
  bio?: string
  preferences?: Partial<UserPreferences>
}

export interface UpdateUserProfileData extends CreateUserProfileData {
  displayName?: string
  photoURL?: string
}

// Respuesta de operaciones
export interface AuthResponse {
  success: boolean
  error?: string
  data?: any
}