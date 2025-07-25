// TODO: Type definitions for AI service requests and responses
// These types will be used for type-safe communication between frontend and Edge Function

const isDev = Deno.env.get('ENV') === 'development'

if (isDev) {
  console.log('[DEV-LOG] Loading AI service type definitions...')
}

export interface AIRequest {
  // TODO: Define request structure for AI service calls
  // Will include user preferences, request type, and other parameters
}

export interface AIResponse {
  // TODO: Define response structure for AI service calls
  // Will include AI-generated content, metadata, and error information
}

export interface QuickMealRequest {
  // TODO: Define QuickMeal-specific request structure
  // Will include user preferences, dietary restrictions, and meal requirements
}

export interface QuickMealResponse {
  // TODO: Define QuickMeal-specific response structure
  // Will include meal suggestions, nutrition info, and preparation instructions
}

export interface AIProvider {
  // TODO: Define interface for AI provider implementations
  // Will include methods for making API calls to different AI services
}

export interface QuotaInfo {
  // TODO: Define quota information structure
  // Will include quota limits, current usage, and availability status
}

if (isDev) {
  console.log('[DEV-LOG] AI service type definitions loaded:')
  console.log('[DEV-LOG] - AIRequest interface defined')
  console.log('[DEV-LOG] - AIResponse interface defined')
  console.log('[DEV-LOG] - QuickMealRequest interface defined')
  console.log('[DEV-LOG] - QuickMealResponse interface defined')
  console.log('[DEV-LOG] - AIProvider interface defined')
  console.log('[DEV-LOG] - QuotaInfo interface defined')
} 