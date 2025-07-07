export default defineNuxtRouteMiddleware((to, from) => {
  // Skip middleware during server-side rendering
  if (process.server) return

  const { isAuthenticated, isLoading } = useAuthEnhanced()

  // Wait for auth state to be determined
  if (isLoading.value) {
    // Show loading or return to let the component handle loading state
    return
  }

  // Redirect to home if not authenticated
  if (!isAuthenticated.value) {
    return navigateTo('/?error=auth-required')
  }
})