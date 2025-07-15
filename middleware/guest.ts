export default defineNuxtRouteMiddleware((to, from) => {
  // Skip middleware during server-side rendering
  if (process.server) return

  const { isAuthenticated, isLoading } = useAuthEnhanced()

  // If still loading, we need to wait for auth state to be determined
  if (isLoading.value) {
    // Return a promise that resolves when auth state is ready
    return new Promise((resolve) => {
      const unwatch = watch(isLoading, (loading) => {
        if (!loading) {
          unwatch()
          if (isAuthenticated.value) {
            resolve(navigateTo('/'))
          } else {
            resolve()
          }
        }
      })
    })
  }

  // Redirect authenticated users to home
  if (isAuthenticated.value) {
    return navigateTo('/')
  }
})