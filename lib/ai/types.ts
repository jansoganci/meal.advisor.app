// AI service types and interfaces

export interface AIProvider {
  name: string
  model: string
  apiKey: string
  baseUrl?: string
  maxTokens?: number
  temperature?: number
  topP?: number
}

export interface AIRequest {
  prompt: string
  model?: string
  temperature?: number
  maxTokens?: number
  userId?: string
  requestId?: string
  context?: any
}

export interface AIResponse {
  content: string
  model: string
  provider: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
  cost?: number
  requestId?: string
  timestamp: string
}

export interface AIError {
  message: string
  code: string
  provider: string
  statusCode?: number
  retryable?: boolean
}

// Meal planning specific types
export interface MealPlanRequest {
  userId: string
  preferences: {
    dietaryRestrictions: string[]
    cuisinePreferences: string[]
    allergies: string[]
    dislikedFoods: string[]
    activityLevel: string
    primaryGoal: string
    dailyCalories: number
    macroTargets: {
      protein: number
      carbs: number
      fat: number
    }
  }
  planDetails: {
    startDate: string
    endDate: string
    mealsPerDay: number
    cookingTimePreference: string
    difficultyPreference: string
    budgetPreference?: string
  }
  customRequests?: string[]
}

export interface RecipeRequest {
  userId: string
  mealType: string
  cuisineType?: string
  dietaryRestrictions?: string[]
  allergies?: string[]
  maxCookingTime?: number
  difficulty?: string
  servings?: number
  ingredients?: string[]
  customPrompt?: string
}

export interface RecipeResponse {
  title: string
  description: string
  cuisineType: string
  mealType: string[]
  difficultyLevel: string
  prepTimeMinutes: number
  cookTimeMinutes: number
  servings: number
  calories: number
  nutrition: {
    protein: number
    carbs: number
    fat: number
    fiber: number
    sugar: number
    sodium: number
  }
  ingredients: Array<{
    name: string
    amount: number
    unit: string
    notes?: string
  }>
  instructions: Array<{
    step: number
    instruction: string
    durationMinutes?: number
  }>
  equipment: string[]
  dietaryTags: string[]
  allergenInfo: string[]
  spiceLevel: string
  tips?: string[]
  variations?: string[]
}

export interface MealPlanResponse {
  title: string
  description: string
  planType: string
  totalCalories: number
  averageDailyCalories: number
  macroBreakdown: {
    protein: number
    carbs: number
    fat: number
  }
  days: Array<{
    date: string
    dayName: string
    meals: Array<{
      mealType: string
      recipe: RecipeResponse
      alternativeRecipes?: RecipeResponse[]
    }>
    dailyTotals: {
      calories: number
      protein: number
      carbs: number
      fat: number
    }
  }>
  shoppingList: Array<{
    name: string
    quantity: number
    unit: string
    category: string
  }>
  notes: string[]
  estimatedCost?: number
}

// AI service configuration
export interface AIServiceConfig {
  providers: {
    deepseek: AIProvider
    gemini: AIProvider
  }
  defaultProvider: string
  fallbackProvider: string
  rateLimits: {
    requestsPerMinute: number
    requestsPerHour: number
    requestsPerDay: number
  }
  costLimits: {
    maxCostPerRequest: number
    maxCostPerUser: number
    maxCostPerDay: number
  }
  timeouts: {
    requestTimeout: number
    retryDelay: number
    maxRetries: number
  }
  caching: {
    enabled: boolean
    ttl: number
    maxSize: number
  }
}

// Prompt templates
export interface PromptTemplate {
  id: string
  name: string
  description: string
  template: string
  variables: string[]
  category: 'recipe' | 'meal-plan' | 'nutrition' | 'substitution'
  version: string
}

// AI service statistics
export interface AIServiceStats {
  totalRequests: number
  successfulRequests: number
  failedRequests: number
  averageResponseTime: number
  totalCost: number
  requestsByProvider: Record<string, number>
  errorsByType: Record<string, number>
  topPrompts: Array<{
    template: string
    count: number
    averageResponseTime: number
  }>
}

// Cache entry
export interface CacheEntry {
  key: string
  value: AIResponse
  timestamp: number
  ttl: number
  hits: number
  userId?: string
}

// Usage tracking
export interface UsageRecord {
  userId: string
  provider: string
  model: string
  promptTokens: number
  completionTokens: number
  totalTokens: number
  cost: number
  timestamp: string
  requestType: string
  success: boolean
}

// Rate limiting
export interface RateLimitInfo {
  userId: string
  provider: string
  windowStart: number
  requestCount: number
  tokensUsed: number
  costAccumulated: number
}

// Fallback content
export interface FallbackContent {
  id: string
  type: 'recipe' | 'meal-plan' | 'tip' | 'substitution'
  title: string
  content: any
  tags: string[]
  conditions: {
    dietary?: string[]
    cuisine?: string[]
    mealType?: string[]
    difficulty?: string[]
  }
  priority: number
  lastUsed?: string
  usageCount: number
}

// Export utility types
export type AIProviderName = 'deepseek' | 'gemini'
export type RequestType = 'recipe' | 'meal-plan' | 'nutrition' | 'substitution' | 'general'
export type DifficultyLevel = 'easy' | 'medium' | 'hard'
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack'
export type CuisineType = 'american' | 'italian' | 'mexican' | 'chinese' | 'indian' | 'thai' | 'mediterranean' | 'french' | 'japanese' | 'korean'
export type DietaryRestriction = 'vegetarian' | 'vegan' | 'gluten-free' | 'dairy-free' | 'nut-free' | 'keto' | 'paleo' | 'low-carb' | 'low-fat' | 'low-sodium'
export type SpiceLevel = 'mild' | 'medium' | 'hot' | 'very-hot'
export type ActivityLevel = 'sedentary' | 'lightly-active' | 'moderately-active' | 'very-active' | 'extremely-active'
export type PrimaryGoal = 'lose-weight' | 'maintain-weight' | 'gain-weight' | 'build-muscle' | 'improve-health'