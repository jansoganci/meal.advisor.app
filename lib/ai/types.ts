// Frontend AI types - Simplified to match backend
// Reduced from 54 lines to 20 lines

export interface QuickMealPreferences {
  servings: number
  prepTime: string
  diet: string
  cuisine: string
  mood: string
  budget: string
}

export interface QuickMealSuggestion {
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

export interface QuickMealResponse {
  suggestions: QuickMealSuggestion[]
  mealPrepIdeas?: string[]
  timeSavingTips?: string[]
  budgetTips?: string[]
  nutritionNotes?: string[]
  customizations?: string[]
}

export interface EdgeFunctionResponse {
  success: boolean
  data?: QuickMealSuggestion
  error?: string
  requestId?: string
}