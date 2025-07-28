/**
 * MealAdvisor AI Weekly Service - Essential Types
 * Weekly meal plan generation types for edge function
 */

// =============================================================================
// CORE REQUEST/RESPONSE TYPES
// =============================================================================

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

export interface AIServiceRequest {
  requestType: 'weeklyplan'
  preferences: WeeklyPlanPreferences
  userId?: string
  sessionId?: string
  timestamp?: string
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

export interface WeeklyPlanData {
  overview: {
    avgCalories: number
    avgProtein: number
    estimatedCost: number
  }
  days: DayMealPlan[]
  tips?: string[]
  notes?: string[]
}

export interface EdgeFunctionResponse {
  success: boolean
  data?: WeeklyPlanData
  error?: string
  requestId?: string
} 