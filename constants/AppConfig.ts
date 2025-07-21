// App configuration constants loaded from environment variables
// All constants should be configurable via .env file

export const APP_CONFIG = {
  // App Information
  name: process.env.EXPO_PUBLIC_APP_NAME || 'MealAdvisor',
  version: process.env.EXPO_PUBLIC_APP_VERSION || '1.0.0',
  environment: process.env.EXPO_PUBLIC_APP_ENV || 'development',

  // User Limits (enforced in backend)
  FREE_USER_DAILY_QUICKMEAL_LIMIT: parseInt(process.env.EXPO_PUBLIC_FREE_USER_DAILY_QUICKMEAL_LIMIT || '10'),
  FREE_USER_WEEKLY_PLAN_LIMIT: parseInt(process.env.EXPO_PUBLIC_FREE_USER_WEEKLY_PLAN_LIMIT || '1'),
  PREMIUM_USER_DAILY_LIMIT: parseInt(process.env.EXPO_PUBLIC_PREMIUM_USER_DAILY_LIMIT || '500'),
  
  // Content Limits
  MAX_RECIPES_PER_PLAN: parseInt(process.env.EXPO_PUBLIC_MAX_RECIPES_PER_PLAN || '7'),
  MAX_INGREDIENTS_PER_RECIPE: parseInt(process.env.EXPO_PUBLIC_MAX_INGREDIENTS_PER_RECIPE || '20'),
  
  // Media Configuration
  IMAGE_MAX_SIZE: parseInt(process.env.EXPO_PUBLIC_IMAGE_MAX_SIZE || '5242880'), // 5MB
  SUPPORTED_IMAGE_FORMATS: (process.env.EXPO_PUBLIC_SUPPORTED_IMAGE_FORMATS || 'jpg,jpeg,png,webp').split(','),
  
  // Session Configuration
  SESSION_MAX_AGE: parseInt(process.env.EXPO_PUBLIC_SESSION_MAX_AGE || '604800000'), // 7 days
  SESSION_REFRESH_THRESHOLD: parseInt(process.env.EXPO_PUBLIC_SESSION_REFRESH_THRESHOLD || '86400000'), // 24 hours
  
  // Feature Flags
  ENABLE_DEBUG_MODE: process.env.EXPO_PUBLIC_ENABLE_DEBUG_MODE === 'true',
  ENABLE_ANALYTICS: process.env.EXPO_PUBLIC_ENABLE_ANALYTICS === 'true',
  ENABLE_CRASH_REPORTING: process.env.EXPO_PUBLIC_ENABLE_CRASH_REPORTING === 'true',
} as const

// Supported Languages (i18n)
export const SUPPORTED_LANGUAGES = [
  'en', // English
  'ja', // Japanese
  'ko', // Korean
  'zh', // Chinese
  'th', // Thai
  'ms', // Malay
  'vi', // Vietnamese
  'id', // Indonesian
  'es', // Spanish
  'de', // German
  'nl', // Dutch
  'lt', // Lithuanian
  'et', // Estonian
  'ar'  // Arabic
] as const

// Validation functions
export const validateConfig = () => {
  const errors: string[] = []

  // Validate required environment variables
  const requiredVars = [
    'EXPO_PUBLIC_SUPABASE_URL',
    'EXPO_PUBLIC_SUPABASE_ANON_KEY',
    'EXPO_PUBLIC_DEEPSEEK_API_KEY'
  ]

  requiredVars.forEach(varName => {
    if (!process.env[varName]) {
      errors.push(`${varName} is required but not set`)
    }
  })

  // Validate numeric values
  if (APP_CONFIG.FREE_USER_DAILY_QUICKMEAL_LIMIT <= 0) {
    errors.push('FREE_USER_DAILY_QUICKMEAL_LIMIT must be greater than 0')
  }

  if (APP_CONFIG.IMAGE_MAX_SIZE <= 0) {
    errors.push('IMAGE_MAX_SIZE must be greater than 0')
  }

  // Validate URL format for Supabase
  if (process.env.EXPO_PUBLIC_SUPABASE_URL) {
    try {
      new URL(process.env.EXPO_PUBLIC_SUPABASE_URL)
    } catch {
      errors.push('EXPO_PUBLIC_SUPABASE_URL must be a valid URL')
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

// Helper functions
export const isProduction = () => APP_CONFIG.environment === 'production'
export const isDevelopment = () => APP_CONFIG.environment === 'development'
export const isDebugMode = () => APP_CONFIG.ENABLE_DEBUG_MODE && isDevelopment()

// Export default config for easy access
export default APP_CONFIG 