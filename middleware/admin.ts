export default defineNuxtRouteMiddleware((to, from) => {
  // Skip middleware during server-side rendering
  if (process.server) return

  const { isAuthenticated, isLoading, hasRole } = useAuthEnhanced()

  // Wait for auth state to be determined
  if (isLoading.value) {
    return
  }

  // Check if user is authenticated
  if (!isAuthenticated.value) {
    return navigateTo('/?error=auth-required')
  }

  // Check if user has admin role
  if (!hasRole('admin')) {
    return navigateTo('/?error=insufficient-permissions')
  }
})