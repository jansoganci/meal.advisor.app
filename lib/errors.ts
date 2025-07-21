// Error handling utilities for MealAdvisor

// Custom error classes
export class MealAdvisorError extends Error {
  public code: string
  public statusCode: number
  public isOperational: boolean

  constructor(message: string, code: string = 'GENERAL_ERROR', statusCode: number = 500) {
    super(message)
    this.name = 'MealAdvisorError'
    this.code = code
    this.statusCode = statusCode
    this.isOperational = true
    
    Error.captureStackTrace(this, this.constructor)
  }
}

export class ValidationError extends MealAdvisorError {
  constructor(message: string, field?: string) {
    super(message, 'VALIDATION_ERROR', 400)
    this.name = 'ValidationError'
    if (field) {
      this.message = `${field}: ${message}`
    }
  }
}

export class AuthenticationError extends MealAdvisorError {
  constructor(message: string = 'Authentication failed') {
    super(message, 'AUTH_ERROR', 401)
    this.name = 'AuthenticationError'
  }
}

export class AuthorizationError extends MealAdvisorError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 'AUTHORIZATION_ERROR', 403)
    this.name = 'AuthorizationError'
  }
}

export class NotFoundError extends MealAdvisorError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 'NOT_FOUND', 404)
    this.name = 'NotFoundError'
  }
}

export class RateLimitError extends MealAdvisorError {
  constructor(message: string = 'Rate limit exceeded') {
    super(message, 'RATE_LIMIT_ERROR', 429)
    this.name = 'RateLimitError'
  }
}

export class DatabaseError extends MealAdvisorError {
  constructor(message: string = 'Database operation failed') {
    super(message, 'DATABASE_ERROR', 500)
    this.name = 'DatabaseError'
  }
}

export class AIServiceError extends MealAdvisorError {
  constructor(message: string = 'AI service unavailable') {
    super(message, 'AI_SERVICE_ERROR', 503)
    this.name = 'AIServiceError'
  }
}

export class NetworkError extends MealAdvisorError {
  constructor(message: string = 'Network request failed') {
    super(message, 'NETWORK_ERROR', 502)
    this.name = 'NetworkError'
  }
}

// Error handling utilities
export const errorHandler = {
  // Handle and format errors for display
  formatError(error: any): { message: string; code: string; statusCode: number } {
    if (error instanceof MealAdvisorError) {
      return {
        message: error.message,
        code: error.code,
        statusCode: error.statusCode
      }
    }
    
    // Handle Supabase errors
    if (error?.message?.includes('duplicate key value')) {
      return {
        message: 'This item already exists',
        code: 'DUPLICATE_ERROR',
        statusCode: 409
      }
    }
    
    if (error?.message?.includes('violates foreign key constraint')) {
      return {
        message: 'Referenced item not found',
        code: 'REFERENCE_ERROR',
        statusCode: 400
      }
    }
    
    if (error?.message?.includes('violates check constraint')) {
      return {
        message: 'Invalid data provided',
        code: 'VALIDATION_ERROR',
        statusCode: 400
      }
    }
    
    // Handle network errors
    if (error?.name === 'NetworkError' || error?.code === 'NETWORK_ERROR') {
      return {
        message: 'Network connection failed. Please check your internet connection.',
        code: 'NETWORK_ERROR',
        statusCode: 502
      }
    }
    
    // Handle timeout errors
    if (error?.name === 'TimeoutError' || error?.message?.includes('timeout')) {
      return {
        message: 'Request timed out. Please try again.',
        code: 'TIMEOUT_ERROR',
        statusCode: 408
      }
    }
    
    // Default error handling
    return {
      message: 'An unexpected error occurred. Please try again.',
      code: 'UNKNOWN_ERROR',
      statusCode: 500
    }
  },

  // Log errors securely
  logError(error: any, context?: string): void {
    const errorInfo = {
      message: error?.message || 'Unknown error',
      stack: error?.stack,
      code: error?.code,
      statusCode: error?.statusCode,
      context,
      timestamp: new Date().toISOString(),
      userId: error?.userId || 'unknown'
    }
    
    // Filter sensitive information
    const sensitiveFields = ['password', 'token', 'api_key', 'secret']
    const filteredStack = errorInfo.stack?.replace(
      new RegExp(`(${sensitiveFields.join('|')})=[^\\s]+`, 'gi'),
      '$1=***'
    )
    
    if (process.env.NODE_ENV === 'production') {
      // Send to error tracking service (Sentry, LogRocket, etc.)
      console.error('Production Error:', {
        ...errorInfo,
        stack: filteredStack
      })
    } else {
      console.error('Development Error:', {
        ...errorInfo,
        stack: filteredStack
      })
    }
  },

  // Create user-friendly error messages
  createUserMessage(error: any): string {
    const formatted = errorHandler.formatError(error)
    
    // Map error codes to user-friendly messages
    const userMessages: Record<string, string> = {
      'VALIDATION_ERROR': 'Please check your input and try again.',
      'AUTH_ERROR': 'Please sign in to continue.',
      'AUTHORIZATION_ERROR': 'You don\'t have permission to perform this action.',
      'NOT_FOUND': 'The requested item could not be found.',
      'RATE_LIMIT_ERROR': 'Too many requests. Please wait a moment and try again.',
      'DATABASE_ERROR': 'A system error occurred. Please try again.',
      'AI_SERVICE_ERROR': 'AI service is temporarily unavailable. Please try again later.',
      'NETWORK_ERROR': 'Network connection failed. Please check your internet connection.',
      'DUPLICATE_ERROR': 'This item already exists.',
      'REFERENCE_ERROR': 'Invalid reference. Please check your data.',
      'TIMEOUT_ERROR': 'Request timed out. Please try again.',
      'UNKNOWN_ERROR': 'An unexpected error occurred. Please try again.'
    }
    
    return userMessages[formatted.code] || formatted.message
  },

  // Retry logic for transient errors
  async withRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: any
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation()
      } catch (error) {
        lastError = error
        
        // Don't retry on authentication or validation errors
        if (error instanceof AuthenticationError || 
            error instanceof AuthorizationError ||
            error instanceof ValidationError) {
          throw error
        }
        
        // Don't retry on final attempt
        if (attempt === maxRetries) {
          break
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay * attempt))
      }
    }
    
    throw lastError
  }
}

// Error boundary helpers for React components
export const createErrorBoundary = (fallbackComponent: React.ComponentType<{ error: any }>) => {
  return class ErrorBoundary extends React.Component<
    { children: React.ReactNode },
    { hasError: boolean; error: any }
  > {
    constructor(props: { children: React.ReactNode }) {
      super(props)
      this.state = { hasError: false, error: null }
    }
    
    static getDerivedStateFromError(error: any) {
      return { hasError: true, error }
    }
    
    componentDidCatch(error: any, errorInfo: any) {
      errorHandler.logError(error, JSON.stringify(errorInfo))
    }
    
    render() {
      if (this.state.hasError) {
        return React.createElement(fallbackComponent, { error: this.state.error })
      }
      
      return this.props.children
    }
  }
}

// Async error handler for React components
export const handleAsyncError = (error: any, context?: string) => {
  errorHandler.logError(error, context)
  
  // You can also show a toast notification here
  // toast.error(errorHandler.createUserMessage(error))
}

// Common error scenarios
export const commonErrors = {
  // Authentication errors
  invalidCredentials: () => new AuthenticationError('Invalid email or password'),
  sessionExpired: () => new AuthenticationError('Your session has expired. Please sign in again.'),
  emailNotVerified: () => new AuthenticationError('Please verify your email address'),
  
  // Authorization errors
  accessDenied: () => new AuthorizationError('Access denied'),
  ownershipRequired: () => new AuthorizationError('You can only modify your own items'),
  
  // Validation errors
  requiredField: (field: string) => new ValidationError(`${field} is required`),
  invalidFormat: (field: string) => new ValidationError(`${field} has invalid format`),
  outOfRange: (field: string, min: number, max: number) => 
    new ValidationError(`${field} must be between ${min} and ${max}`),
  
  // Resource errors
  userNotFound: () => new NotFoundError('User'),
  recipeNotFound: () => new NotFoundError('Recipe'),
  mealPlanNotFound: () => new NotFoundError('Meal plan'),
  
  // Rate limiting
  tooManyRequests: () => new RateLimitError('Too many requests. Please wait a moment.'),
  
  // AI service errors
  aiServiceUnavailable: () => new AIServiceError('AI service is temporarily unavailable'),
  aiQuotaExceeded: () => new AIServiceError('AI quota exceeded. Please try again later.'),
  
  // Network errors
  connectionFailed: () => new NetworkError('Connection failed. Please check your internet connection.'),
  requestTimeout: () => new NetworkError('Request timed out. Please try again.')
}

// Export error types for type checking
export type ErrorType = 
  | ValidationError
  | AuthenticationError
  | AuthorizationError
  | NotFoundError
  | RateLimitError
  | DatabaseError
  | AIServiceError
  | NetworkError
  | MealAdvisorError

// Import React for error boundary
import React from 'react'