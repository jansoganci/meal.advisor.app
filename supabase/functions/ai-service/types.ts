/**
 * MealAdvisor AI Service - Essential Types Only
 * Simplified from 590 lines to 30 lines for MVP
 */

// =============================================================================
// CORE REQUEST/RESPONSE TYPES
// =============================================================================

export interface QuickMealPreferences {
  servings: number
  prepTime: string
  diet: string
  cuisine: string
  mood: string
  budget: string
}

export interface AIServiceRequest {
  requestType: 'quickmeal'
  preferences: QuickMealPreferences
  userId?: string
  sessionId?: string
  timestamp?: string
}

export interface AIGeneratedContent {
  title: string
  description: string
  ingredients: string[]
  quickInstructions: string[]
  totalTime: string
  difficulty: string
  calories: number
  estimatedCost: string
  nutrition: {
    protein: number
    carbs: number
    fat: number
  }
  tags: string[]
  substitutions?: string[]
  tips?: string[]
}

export interface EdgeFunctionResponse {
  success: boolean
  data?: AIGeneratedContent
  error?: string
  requestId?: string
} 