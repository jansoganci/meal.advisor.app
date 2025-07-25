// Frontend AI types for Edge Function communication

// QuickMeal specific types for frontend
export interface QuickMealPreferences {
  servings: number
  prepTime: string
  diet: string
  cuisine: string
  mood: string
  budget: string
}

export interface QuickMealSuggestion {
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

export interface QuickMealResponse {
  suggestions: QuickMealSuggestion[]
  mealPrepIdeas?: string[]
  timeSavingTips?: string[]
  budgetTips?: string[]
  nutritionNotes?: string[]
  customizations?: string[]
}

// Edge Function response types
export interface EdgeFunctionResponse {
  success: boolean
  data: any
  metadata?: {
    provider: string
    responseTime: number
    tokensUsed: number
  }
  error?: string
}

// Type definitions for different meal types
export type DifficultyLevel = 'easy' | 'medium' | 'hard'
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack'
export type CuisineType = 'american' | 'italian' | 'mexican' | 'chinese' | 'indian' | 'thai' | 'mediterranean' | 'french' | 'japanese' | 'korean'
export type DietaryRestriction = 'vegetarian' | 'vegan' | 'gluten-free' | 'dairy-free' | 'nut-free' | 'keto' | 'paleo' | 'low-carb' | 'low-fat' | 'low-sodium'
export type ActivityLevel = 'sedentary' | 'lightly-active' | 'moderately-active' | 'very-active' | 'extremely-active'
export type PrimaryGoal = 'lose-weight' | 'maintain-weight' | 'gain-weight' | 'build-muscle' | 'improve-health'