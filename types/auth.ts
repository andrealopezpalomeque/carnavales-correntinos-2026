import type { User } from 'firebase/auth'

export interface AuthUser {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  emailVerified: boolean
  createdAt?: string
  lastLoginAt?: string
}

export interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface SignInResult {
  success: boolean
  error?: string
  user?: AuthUser
}

export interface AuthProvider {
  google: 'google'
  email: 'email'
  anonymous: 'anonymous'
}

export interface UserClaims {
  role?: string
  permissions?: string[]
  subscriptionLevel?: 'free' | 'premium' | 'enterprise'
}

// Firebase Auth Error Codes
export type FirebaseAuthErrorCode = 
  | 'auth/popup-closed-by-user'
  | 'auth/popup-blocked'
  | 'auth/cancelled-popup-request'
  | 'auth/network-request-failed'
  | 'auth/too-many-requests'
  | 'auth/user-disabled'
  | 'auth/user-not-found'
  | 'auth/wrong-password'
  | 'auth/email-already-in-use'
  | 'auth/weak-password'
  | 'auth/invalid-email'
  | 'auth/operation-not-allowed'
  | 'auth/requires-recent-login'

// Extend the global namespace for Nuxt app
declare module '#app' {
  interface NuxtApp {
    $firebase: {
      app: any
      auth: any
      db?: any
      storage?: any
    }
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $firebase: {
      app: any
      auth: any
      db?: any
      storage?: any
    }
  }
}