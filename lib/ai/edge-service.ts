/**
 * MealAdvisor AI Client Service - Simplified
 * Reduced from 484 lines to 50 lines (90% reduction)
 */

import { supabase } from '../supabase'

// Simple types for client
interface QuickMealPreferences {
  servings: number
  prepTime: string
  diet: string
  cuisine: string
  mood: string
  budget: string
}

interface QuickMealSuggestion {
  name: string
  ingredients: string[]
  instructions: string[]
  prepTime: string
  difficulty: string
  nutritionInfo?: {
    calories: number
    protein: number
    carbs: number
    fat: number
  }
}

interface QuickMealResponse {
  suggestions: QuickMealSuggestion[]
  mealPrepIdeas?: string[]
  timeSavingTips?: string[]
  budgetTips?: string[]
  nutritionNotes?: string[]
  customizations?: string[]
}

/**
 * Simple AI service for meal generation
 */
export class EdgeAIService {
  /**
   * Generate QuickMeal suggestions
   */
  async generateQuickMealSuggestions(preferences: QuickMealPreferences): Promise<QuickMealResponse> {
    console.log('[EdgeAIService] Generating QuickMeal suggestions')
    
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.access_token) {
      throw new Error('Please sign in to use QuickMeal.')
    }

    const response = await fetch(`${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/ai-service`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify({ preferences })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || 'Failed to generate meal suggestions')
    }

    const result = await response.json()
    
    if (!result.success || !result.data) {
      throw new Error('AI service returned invalid response')
    }

    // Convert single suggestion to array format for backward compatibility
    return {
      suggestions: [result.data],
      mealPrepIdeas: [],
      timeSavingTips: [],
      budgetTips: [],
      nutritionNotes: [],
      customizations: []
    }
  }
}

// Export singleton instance
export const edgeAIService = new EdgeAIService() 