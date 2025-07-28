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

// Weekly Plan Types
export interface WeeklyPlanPreferences {
  goal: string
  meals: string[]
  cuisines: string[]
  planFocus: string
  calories?: number
  protein?: number
  // User profile data (merged on backend)
  userId?: string
  profileCalories?: number
  profileProtein?: number
  dietaryRestrictions?: string[]
  allergies?: string[]
}

export interface MealItem {
  name: string
  calories: number
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  description?: string
  ingredients?: string[]
  cookTime?: string
  difficulty?: string
  nutrition?: {
    protein: number
    carbs: number
    fat: number
  }
}

export interface DayMealPlan {
  dayName: string
  meals: MealItem[]
  totalCalories: number
  totalProtein: number
}

export interface WeeklyPlanResponse {
  overview: {
    avgCalories: number
    avgProtein: number
    estimatedCost: number
  }
  days: DayMealPlan[]
  tips?: string[]
  notes?: string[]
}

export interface WeeklyPlanEdgeFunctionResponse {
  success: boolean
  data?: WeeklyPlanResponse
  error?: string
  requestId?: string
}