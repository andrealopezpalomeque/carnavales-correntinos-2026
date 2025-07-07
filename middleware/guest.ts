export default defineNuxtRouteMiddleware((to, from) => {
  // Skip middleware during server-side rendering
  if (process.server) return

  const { isAuthenticated, isLoading } = useAuthEnhanced()

  // Wait for auth state to be determined
  if (isLoading.value) {
    return
  }

  // Redirect authenticated users to home
  if (isAuthenticated.value) {
    return navigateTo('/')
  }
})