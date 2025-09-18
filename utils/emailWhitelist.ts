// Email whitelist configuration (kept for backward compatibility)
// Note: App now allows any authenticated user to sign up
export const ALLOWED_EMAILS = [
  // Legacy whitelist - no longer enforced
]

// Function to check if an email is whitelisted (now returns true for any valid email)
export const isEmailWhitelisted = (email: string): boolean => {
  if (!email) return false

  // Allow any valid email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.trim())
}

// Function to get a friendly error message
export const getWhitelistErrorMessage = (): string => {
  return 'Error de autenticación. Por favor, verifica tu dirección de email e intenta nuevamente.'
}

// Function to check domain (for future use if needed)
export const isEmailDomainWhitelisted = (email: string, allowedDomains: string[]): boolean => {
  if (!email) return false
  
  const domain = email.toLowerCase().split('@')[1]
  return allowedDomains.includes(domain)
}

// Environment-based configuration (for future flexibility)
// Note: Now returns empty array since whitelist is no longer enforced
export const getWhitelistFromEnv = (): string[] => {
  // Open registration - no whitelist needed
  return []
}