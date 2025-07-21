import { database } from './database'

// Input validation and sanitization
export const security = {
  // Rate limiting
  async checkRateLimit(
    userId: string,
    action: string,
    limit: number = 10,
    windowMinutes: number = 60
  ): Promise<boolean> {
    try {
      return await database.utils.checkRateLimit(userId, action, limit, windowMinutes)
    } catch (error) {
      console.error('Rate limit check failed:', error)
      return false
    }
  },

  // Input validation
  validateInput: {
    email(email: string): boolean {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    },

    password(password: string): { isValid: boolean; message?: string } {
      if (password.length < 8) {
        return { isValid: false, message: 'Password must be at least 8 characters long' }
      }
      
      if (!/(?=.*[a-z])/.test(password)) {
        return { isValid: false, message: 'Password must contain at least one lowercase letter' }
      }
      
      if (!/(?=.*[A-Z])/.test(password)) {
        return { isValid: false, message: 'Password must contain at least one uppercase letter' }
      }
      
      if (!/(?=.*\d)/.test(password)) {
        return { isValid: false, message: 'Password must contain at least one number' }
      }
      
      return { isValid: true }
    },

    text(text: string, maxLength: number = 1000): string {
      if (!text) return ''
      
      // Remove HTML tags
      text = text.replace(/<[^>]*>/g, '')
      
      // Remove potential XSS patterns
      text = text.replace(/javascript:/gi, '')
      text = text.replace(/on\w+=/gi, '')
      
      // Trim and limit length
      text = text.trim().substring(0, maxLength)
      
      return text
    },

    number(value: any, min?: number, max?: number): number | null {
      const num = Number(value)
      
      if (isNaN(num)) return null
      
      if (min !== undefined && num < min) return null
      if (max !== undefined && num > max) return null
      
      return num
    },

    array(value: any, maxLength: number = 50): string[] {
      if (!Array.isArray(value)) return []
      
      return value
        .filter(item => typeof item === 'string' && item.trim().length > 0)
        .map(item => security.validateInput.text(item, 100))
        .slice(0, maxLength)
    },

    recipeIngredient(ingredient: any): any {
      if (!ingredient || typeof ingredient !== 'object') return null
      
      const validated = {
        name: security.validateInput.text(ingredient.name, 100),
        amount: security.validateInput.number(ingredient.amount, 0, 1000),
        unit: security.validateInput.text(ingredient.unit, 20),
        notes: security.validateInput.text(ingredient.notes, 200)
      }
      
      if (!validated.name || validated.amount === null) return null
      
      return validated
    },

    recipeInstruction(instruction: any): any {
      if (!instruction || typeof instruction !== 'object') return null
      
      const validated = {
        step: security.validateInput.number(instruction.step, 1, 100),
        instruction: security.validateInput.text(instruction.instruction, 500),
        duration_minutes: security.validateInput.number(instruction.duration_minutes, 0, 300)
      }
      
      if (validated.step === null || !validated.instruction) return null
      
      return validated
    }
  },

  // Content filtering
  contentFilter: {
    // Check for inappropriate content
    isContentAppropriate(text: string): boolean {
      if (!text) return true
      
      const inappropriatePatterns = [
        /\b(fuck|shit|damn|hell|ass|bitch)\b/gi,
        /\b(nazi|hitler|genocide)\b/gi,
        /\b(drug|cocaine|heroin|marijuana)\b/gi,
        // Add more patterns as needed
      ]
      
      return !inappropriatePatterns.some(pattern => pattern.test(text))
    },

    // Check for spam patterns
    isSpam(text: string): boolean {
      if (!text) return false
      
      const spamPatterns = [
        /\b(click here|visit now|buy now|act now)\b/gi,
        /\b(free|winner|prize|lottery)\b/gi,
        /\b(viagra|cialis|prescription)\b/gi,
        // Repeated characters
        /(.)\1{5,}/g,
        // Too many URLs
        /(https?:\/\/[^\s]+)/g
      ]
      
      if (spamPatterns.some(pattern => pattern.test(text))) return true
      
      // Check URL count
      const urlMatches = text.match(/(https?:\/\/[^\s]+)/g)
      if (urlMatches && urlMatches.length > 2) return true
      
      return false
    },

    // Clean text content
    cleanText(text: string): string {
      if (!text) return ''
      
      // Remove excessive whitespace
      text = text.replace(/\s+/g, ' ')
      
      // Remove potentially dangerous characters
      text = text.replace(/[<>]/g, '')
      
      // Remove excessive punctuation
      text = text.replace(/[!?]{3,}/g, '!!!')
      
      return text.trim()
    }
  },

  // User permissions
  permissions: {
    canAccessRecipe(recipe: any, userId: string): boolean {
      if (!recipe) return false
      
      // Public and curated recipes are accessible to all
      if (recipe.is_public || recipe.is_curated) return true
      
      // User can access their own recipes
      if (recipe.user_id === userId) return true
      
      return false
    },

    canModifyRecipe(recipe: any, userId: string): boolean {
      if (!recipe) return false
      
      // Only recipe owner can modify (unless admin)
      return recipe.user_id === userId
    },

    canAccessMealPlan(mealPlan: any, userId: string): boolean {
      if (!mealPlan) return false
      
      // User can access their own meal plans
      if (mealPlan.user_id === userId) return true
      
      // Public meal plans are accessible
      if (mealPlan.is_public) return true
      
      return false
    },

    canModifyMealPlan(mealPlan: any, userId: string): boolean {
      if (!mealPlan) return false
      
      // Only meal plan owner can modify
      return mealPlan.user_id === userId
    }
  },

  // API security
  api: {
    // Validate API key format
    validateApiKey(apiKey: string): boolean {
      if (!apiKey) return false
      
      // Check basic format (adjust based on your API key format)
      return /^[A-Za-z0-9_-]{20,}$/.test(apiKey)
    },

    // Sanitize API request data
    sanitizeRequest(data: any): any {
      if (!data || typeof data !== 'object') return {}
      
      const sanitized: any = {}
      
      for (const [key, value] of Object.entries(data)) {
        if (typeof value === 'string') {
          sanitized[key] = security.validateInput.text(value)
        } else if (typeof value === 'number') {
          sanitized[key] = security.validateInput.number(value)
        } else if (Array.isArray(value)) {
          sanitized[key] = security.validateInput.array(value)
        } else if (typeof value === 'boolean') {
          sanitized[key] = Boolean(value)
        } else if (value && typeof value === 'object') {
          sanitized[key] = security.api.sanitizeRequest(value)
        }
      }
      
      return sanitized
    },

    // Generate secure random strings
    generateSecureString(length: number = 32): string {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      let result = ''
      
      for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      
      return result
    }
  },

  // Error handling
  error: {
    // Create safe error message for users
    createSafeErrorMessage(error: any): string {
      // Don't expose internal errors to users
      if (error?.message?.includes('database') || error?.message?.includes('supabase')) {
        return 'A system error occurred. Please try again.'
      }
      
      // Return generic message for unknown errors
      if (!error?.message) {
        return 'An unexpected error occurred. Please try again.'
      }
      
      // Return user-friendly message
      return error.message
    },

    // Log error securely
    logError(error: any, context?: string): void {
      const errorInfo = {
        message: error?.message || 'Unknown error',
        stack: error?.stack,
        context,
        timestamp: new Date().toISOString()
      }
      
      // In production, send to error tracking service
      if (process.env.NODE_ENV === 'production') {
        // Send to Sentry, LogRocket, etc.
        console.error('Error logged:', errorInfo)
      } else {
        console.error('Error:', errorInfo)
      }
    }
  },

  // Data encryption (for sensitive data)
  encryption: {
    // Simple base64 encoding for non-sensitive data
    encode(text: string): string {
      try {
        return btoa(text)
      } catch (error) {
        console.error('Encoding error:', error)
        return text
      }
    },

    decode(encodedText: string): string {
      try {
        return atob(encodedText)
      } catch (error) {
        console.error('Decoding error:', error)
        return encodedText
      }
    }
  }
}

// Common validation rules
export const validationRules = {
  user: {
    age: { min: 13, max: 120 },
    height: { min: 100, max: 250 }, // cm
    weight: { min: 30, max: 300 }, // kg
    nameLength: { min: 1, max: 100 },
    allergiesMax: 20,
    cuisinePreferencesMax: 10
  },
  recipe: {
    titleLength: { min: 3, max: 200 },
    descriptionLength: { min: 10, max: 1000 },
    servings: { min: 1, max: 20 },
    prepTime: { min: 0, max: 300 }, // minutes
    cookTime: { min: 0, max: 480 }, // minutes
    ingredientsMax: 50,
    instructionsMax: 30,
    equipmentMax: 20
  },
  mealPlan: {
    titleLength: { min: 3, max: 100 },
    descriptionLength: { min: 10, max: 500 },
    mealsPerDay: { min: 1, max: 6 },
    planDuration: { min: 1, max: 31 } // days
  },
  shoppingList: {
    titleLength: { min: 1, max: 100 },
    itemsMax: 200,
    itemNameLength: { min: 1, max: 100 }
  }
}

// Security constants
export const SECURITY_CONFIG = {
  RATE_LIMITS: {
    LOGIN: { limit: 5, window: 15 }, // 5 attempts per 15 minutes
    RECIPE_CREATION: { limit: parseInt(process.env.EXPO_PUBLIC_FREE_USER_DAILY_QUICKMEAL_LIMIT || '10'), window: 60 },
    MEAL_PLAN_CREATION: { limit: parseInt(process.env.EXPO_PUBLIC_FREE_USER_WEEKLY_PLAN_LIMIT || '1'), window: 60 },
    API_CALLS: { limit: 100, window: 60 }, // 100 API calls per hour
    FAVORITES: { limit: 50, window: 60 } // 50 favorites per hour
  },
  PASSWORD_REQUIREMENTS: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: false
  },
  SESSION: {
    maxAge: parseInt(process.env.EXPO_PUBLIC_SESSION_MAX_AGE || '604800000'), // 7 days
    refreshThreshold: parseInt(process.env.EXPO_PUBLIC_SESSION_REFRESH_THRESHOLD || '86400000') // 24 hours
  }
}