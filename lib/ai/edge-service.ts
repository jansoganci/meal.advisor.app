/**
 * MealAdvisor AI Client Service - Simplified
 * Reduced from 484 lines to 50 lines (90% reduction)
 */

import { supabase } from '../supabase'
import type { WeeklyPlanPreferences, WeeklyPlanResponse } from './types'

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

  /**
   * Generate Weekly Plan
   */
  async generateWeeklyPlan(preferences: WeeklyPlanPreferences): Promise<WeeklyPlanResponse> {
    console.log('[EdgeAIService] Generating Weekly Plan')
    
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.access_token) {
      throw new Error('Please sign in to create a weekly plan.')
    }

    const response = await fetch(`${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/ai-weekly`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify({ preferences })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      
      if (response.status === 429) {
        throw new Error('Weekly plan limit reached. Please upgrade to premium or try again later.')
      }
      
      throw new Error(errorData.error || 'Plan creation failed. Please try again.')
    }

    const result = await response.json()
    
    if (!result.success || !result.data) {
      throw new Error('AI service returned invalid response')
    }

    return result.data
  }
}

// Export singleton instance
export const edgeAIService = new EdgeAIService() 