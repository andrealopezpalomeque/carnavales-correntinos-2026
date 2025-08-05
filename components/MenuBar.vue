<template>
  <nav class="bg-white shadow-md border-b border-gray-100 sticky top-0 z-50" role="navigation" aria-label="Navegación principal">
    <div class="container-app">
      <div class="flex justify-between items-center h-16">
        <!-- Logo Section -->
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <!-- Carnival Logo -->
            <NuxtLink to="/" @click="scrollToTop" class="block" aria-label="Ir al inicio">
              <div class="w-12 h-12 bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer">
                <span class="text-2xl" aria-hidden="true">🥳</span>
              </div>
            </NuxtLink>
          </div>
        </div>

        <!-- Desktop Navigation Links -->
        <div v-if="isAuthenticated" class="hidden md:flex items-center space-x-8">
          <button 
            v-for="section in visibleSections" 
            :key="section.id" 
            @click="scrollToSection(section.id)"
            class="text-gray-700 hover:text-green-600 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-green-50"
            :aria-label="`Ir a sección ${section.name}`"
          >
            {{ section.name }} 
          </button>
        </div>

        <!-- Authentication Section -->
        <div class="hidden md:block">
          <!-- Sign-in Button (when not authenticated) -->
          <button 
            v-if="!isAuthenticated"
            @click="handleSignIn"
            :disabled="isLoading"
            class="btn-primary bg-green-600 text-white hover:bg-green-700 text-sm flex items-center gap-2"
            :class="{ 'opacity-70 cursor-not-allowed': isLoading }"
            :aria-label="isLoading ? 'Cargando...' : 'Iniciar sesión con Google'"
          >
            <svg v-if="isLoading" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            <span>{{ isLoading ? 'Cargando...' : 'Iniciar Sesión' }}</span>
          </button>

          <!-- User Menu (when authenticated) -->
          <div v-else class="relative" ref="userMenuRef">
            <!-- Loading state for user data -->
            <div v-if="!isUserDataReady" class="flex items-center gap-2 p-2">
              <div class="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
              <div class="hidden lg:block w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
              <div class="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
            
            <!-- User menu button when data is ready -->
            <button 
              v-else
              @click="userMenuOpen = !userMenuOpen"
              class="flex items-center gap-2 text-gray-700 hover:text-green-600 focus:outline-none focus:text-green-600 transition-colors duration-200 p-2"
              :aria-expanded="userMenuOpen"
              aria-haspopup="true"
              aria-label="Abrir menú de usuario"
            >
              <img 
                v-if="userProfile?.photoURL" 
                :src="userProfile.photoURL" 
                :alt="userDisplayName"
                class="w-8 h-8 rounded-full object-cover border-2 border-gray-200 aspect-square"
              />
              <div 
                v-else 
                class="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-medium text-sm aspect-square"
              >
                {{ userInitials }}
              </div>
              <span class="hidden lg:block text-sm font-medium">{{ userDisplayName }}</span>
              <svg class="w-4 h-4 transition-transform duration-200" :class="{ 'rotate-180': userMenuOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>

            <!-- User Dropdown Menu -->
            <div 
              v-show="userMenuOpen && isUserDataReady"
              class="absolute right-0 mt-2 w-64 max-w-xs bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
            >
              <div class="px-4 py-2 border-b border-gray-100 relative">
                <p class="text-sm font-medium text-gray-900 truncate">{{ userDisplayName }}</p>
                <p class="text-xs text-gray-500 truncate break-all">{{ authUser?.email }}</p>
                <div v-if="isNewUser" class="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  Nuevo
                </div>
              </div>
              <div class="px-4 py-2 border-b border-gray-100 space-y-1">
                <NuxtLink to="/feed" @click="userMenuOpen = false" class="w-full text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200 flex items-center gap-2 p-2 rounded">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
                  </svg>
                  Feed Social
                </NuxtLink>
                <NuxtLink to="/users" @click="userMenuOpen = false" class="w-full text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200 flex items-center gap-2 p-2 rounded">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
                  </svg>
                  Descubrir Usuarios
                </NuxtLink>
                <NuxtLink to="/profile" @click="userMenuOpen = false" class="w-full text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200 flex items-center gap-2 p-2 rounded">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                  Mi Perfil
                </NuxtLink>
              </div>
              <button
                @click="handleSignOut"
                :disabled="isLoading"
                class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200 flex items-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                </svg>
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>

        <!-- Mobile menu button -->
        <div class="md:hidden">
          <button 
            @click="mobileMenuOpen = !mobileMenuOpen" 
            class="text-gray-700 hover:text-green-600 focus:outline-none focus:text-green-600 transition-colors duration-200 p-2"
            :aria-expanded="mobileMenuOpen"
            aria-controls="mobile-menu"
            :aria-label="mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'"
          >
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <div v-show="mobileMenuOpen" id="mobile-menu" class="md:hidden bg-white border-t border-gray-100">
      <div class="container-app pt-2 pb-3 space-y-1">
        <!-- Mobile Navigation Links -->
        <button 
          v-if="isAuthenticated" 
          v-for="section in visibleSections" 
          :key="section.id" 
          @click="scrollToSection(section.id); closeMobileMenu()" 
          class="text-gray-700 hover:text-green-600 hover:bg-green-50 block w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-all duration-200"
        >
          {{ section.name }}
        </button>

        <!-- Mobile Authentication Section -->
        <div class="pt-4 pb-2">
          <!-- Mobile Sign-in Button (when not authenticated) -->
          <button 
            v-if="!isAuthenticated"
            @click="handleSignIn"
            :disabled="isLoading"
            class="btn-primary w-full bg-green-600 text-white hover:bg-green-700 text-base flex items-center justify-center gap-2"
            :class="{ 'opacity-70 cursor-not-allowed': isLoading }"
          >
            <svg v-if="isLoading" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            <span>{{ isLoading ? 'Cargando...' : 'Iniciar Sesión' }}</span>
          </button>

          <!-- Mobile User Info (when authenticated) -->
          <div v-else class="space-y-3">
            <!-- Loading state for mobile user data -->
            <div v-if="!isUserDataReady" class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div class="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
              <div class="flex-1 min-w-0">
                <div class="w-32 h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div class="w-24 h-3 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
            
            <!-- Mobile user profile link when data is ready -->
            <NuxtLink 
              v-else
              to="/profile" 
              @click="closeMobileMenu()"
              class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg relative hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
            >
              <!-- New User Badge -->
              <div v-if="isNewUser" class="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                Nuevo
              </div>
              <img 
                v-if="userProfile?.photoURL" 
                :src="userProfile.photoURL" 
                :alt="userDisplayName"
                class="w-10 h-10 rounded-full object-cover border-2 border-gray-200 aspect-square"
              />
              <div 
                v-else 
                class="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-medium aspect-square"
              >
                {{ userInitials }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">{{ userDisplayName }}</p>
                <p class="text-xs text-gray-500 truncate break-all">{{ authUser?.email }}</p>
              </div>
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </NuxtLink>
            <button
              @click="handleSignOut"
              :disabled="isLoading"
              class="w-full btn-primary bg-red-600 text-white hover:bg-red-700 text-base flex items-center justify-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

// Mobile menu state
const mobileMenuOpen = ref(false)

// User menu state
const userMenuOpen = ref(false)
const userMenuRef = ref(null)

// Authentication state
const {
  authUser,
  userProfile,
  isAuthenticated,
  isLoading,
  isNewUser,
  isProfileLoading,
  signInWithGoogle,
  signOutUser,
  userDisplayName,
  userInitials
} = useAuthEnhanced()

// Wait for profile to load before showing user data
const isUserDataReady = computed(() => {
  return isAuthenticated.value && !isProfileLoading.value && userProfile.value
})

// Notifications
const { notifyAuthSuccess, notifyAuthError, notifyLogout } = useNotifications()

// Close mobile menu
const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

// Close user menu when clicking outside
const closeUserMenu = (event) => {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target)) {
    userMenuOpen.value = false
  }
}

// Handle Google Sign-in
const handleSignIn = async () => {
  try {
    const result = await signInWithGoogle()
    if (result.success) {
      notifyAuthSuccess(`¡Bienvenido, ${userDisplayName.value}!`)
      // Optionally close mobile menu if open
      if (mobileMenuOpen.value) {
        closeMobileMenu()
      }
    } else {
      notifyAuthError(result.error || 'Error al iniciar sesión')
    }
  } catch (error) {
  }
}

// Handle Sign-out
const handleSignOut = async () => {
  try {
    const result = await signOutUser()
    if (result.success) {
      notifyLogout()
      userMenuOpen.value = false
      // Optionally close mobile menu if open
      if (mobileMenuOpen.value) {
        closeMobileMenu()
      }
      // Redirect to main page without hash after logout
      navigateTo('/')
    } else {
      notifyAuthError(result.error || 'Error al cerrar sesión')
    }
  } catch (error) {
  }
}

// Navigation sections
const sections = [
  { id: 'countdown', name: 'Cuenta Regresiva', requiresAuth: false },
  { id: 'photos', name: 'Fotos', requiresAuth: true },
  { id: 'fun-facts', name: 'Curiosidades', requiresAuth: true },
  { id: 'related-news', name: 'Noticias Relacionadas', requiresAuth: true },
  { id: 'spotify-playlists', name: 'Playlists', requiresAuth: true },
]

// Computed property for visible sections based on authentication
const visibleSections = computed(() => {
  return sections.filter(section => !section.requiresAuth || isAuthenticated.value)
})

// Smart navigation - always navigate to home with hash to ensure URL is updated
const scrollToSection = (sectionId) => {
  // Always navigate to home with hash to ensure URL is updated consistently
  navigateTo(`/#${sectionId}`)
}

// Scroll to top when logo is clicked
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

// Watch for authentication state changes
watch(isAuthenticated, (authenticated, wasAuthenticated) => {
  if (wasAuthenticated && !authenticated) {
    // User logged out - redirect to main page without hash
    const route = useRoute()
    if (route.path === '/' && route.hash) {
      // If on home page with hash, remove hash
      navigateTo('/')
    }
  }
})

// Watch for new users to redirect to setup
watch([isAuthenticated, isNewUser], ([authenticated, newUser]) => {
  if (authenticated && newUser) {
    navigateTo('/profile/setup')
  }
})

// Watch for route changes to handle hash scrolling
watch(() => useRoute().hash, () => {
  handleHashScroll()
})

// Handle scroll to hash on page load or navigation
const handleHashScroll = () => {
  const route = useRoute()
  if (route.hash && route.path === '/') {
    const sectionId = route.hash.substring(1) // Remove the '#'
    setTimeout(() => {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        })
      }
    }, 500) // Delay to ensure content is loaded
  }
}

// Lifecycle hooks
onMounted(() => {
  document.addEventListener('click', closeUserMenu)
  handleHashScroll()
})

onUnmounted(() => {
  document.removeEventListener('click', closeUserMenu)
})
</script>

<style scoped>
/* Animations for dropdown */
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

/* Smooth transitions */
.transition-all {
  transition: all 0.2s ease-in-out;
}

.transition-colors {
  transition: color 0.2s ease-in-out, background-color 0.2s ease-in-out;
}

.transition-transform {
  transition: transform 0.2s ease-in-out;
}

/* Hover states */
.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-primary:active {
  transform: translateY(0);
}

/* User menu dropdown animation */
.user-menu-enter-active,
.user-menu-leave-active {
  transition: all 0.2s ease;
}

.user-menu-enter-from,
.user-menu-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>