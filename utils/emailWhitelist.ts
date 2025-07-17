// Email whitelist configuration
export const ALLOWED_EMAILS = [
  'andrealopezpalomeque@gmail.com',
  'msofiarriiuca@gmail.com',
  'gonzavalesani@gmail.com',
  'sebastianvalesani@gmail.com',
  'constanzaescobar15@gmail.com',
  'imanolcorimayo@gmail.com',
  'guidovalesani@gmail.com'
]

// Function to check if an email is whitelisted
export const isEmailWhitelisted = (email: string): boolean => {
  if (!email) return false
  
  const normalizedEmail = email.toLowerCase().trim()
  return ALLOWED_EMAILS.includes(normalizedEmail)
}

// Function to get a friendly error message
export const getWhitelistErrorMessage = (): string => {
  return 'Tu dirección de email no está autorizada para acceder a esta aplicación. Contacta al administrador para obtener acceso.'
}

// Function to check domain (for future use if needed)
export const isEmailDomainWhitelisted = (email: string, allowedDomains: string[]): boolean => {
  if (!email) return false
  
  const domain = email.toLowerCase().split('@')[1]
  return allowedDomains.includes(domain)
}

// Environment-based configuration (for future flexibility)
export const getWhitelistFromEnv = (): string[] => {
  if (process.server) {
    // Server-side: can access all env variables
    const envWhitelist = process.env.NUXT_ALLOWED_EMAILS
    if (envWhitelist) {
      return envWhitelist.split(',').map(email => email.trim().toLowerCase())
    }
  } else {
    // Client-side: only access public env variables
    const runtimeConfig = useRuntimeConfig()
    const envWhitelist = runtimeConfig.public.allowedEmails
    if (envWhitelist) {
      return envWhitelist.split(',').map(email => email.trim().toLowerCase())
    }
  }
  
  // Fallback to hardcoded list
  return ALLOWED_EMAILS
}