export default defineNuxtRouteMiddleware((to, from) => {
  // Skip middleware during server-side rendering
  if (process.server) return

  const { isAuthenticated, isLoading, hasRole } = useAuthEnhanced()

  // If still loading, we need to wait for auth state to be determined
  if (isLoading.value) {
    // Return a promise that resolves when auth state is ready
    return new Promise((resolve) => {
      const unwatch = watch(isLoading, (loading) => {
        if (!loading) {
          unwatch()
          if (!isAuthenticated.value) {
            resolve(navigateTo('/auth'))
          } else if (!hasRole('admin')) {
            resolve(navigateTo('/?error=insufficient-permissions'))
          } else {
            resolve()
          }
        }
      })
    })
  }

  // Check if user is authenticated
  if (!isAuthenticated.value) {
    return navigateTo('/auth')
  }

  // Check if user has admin role
  if (!hasRole('admin')) {
    return navigateTo('/?error=insufficient-permissions')
  }
})