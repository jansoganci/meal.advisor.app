// AI Service - Main export file
export { DeepSeekProvider } from './providers/deepseek'
export { GeminiProvider } from './providers/gemini'
export { aiService, AIService } from './service'

// Export types
export type {
  ActivityLevel, AIError, AIProvider, AIProviderName, AIRequest,
  AIResponse, AIServiceConfig, CacheEntry, CuisineType,
  DietaryRestriction, DifficultyLevel, MealPlanRequest,
  MealPlanResponse, MealType, PrimaryGoal, PromptTemplate, RecipeRequest,
  RecipeResponse, RequestType, SpiceLevel, UsageRecord
} from './types'

// Export configuration
export { AI_CONFIG, AI_ERROR_CODES, COST_RATES, PROMPT_TEMPLATES } from './config'

// Import aiService and types
import { aiService } from './service'

// Convenience functions for common AI operations
export const ai = {
  // Generate a recipe
  async generateRecipe(request: {
    userId: string
    mealType: string
    cuisineType?: string
    dietaryRestrictions?: string[]
    allergies?: string[]
    maxCookingTime?: number
    difficulty?: string
    servings?: number
    customPrompt?: string
  }) {
    return await aiService.generateRecipe(request)
  },

  // Generate a meal plan
  async generateMealPlan(request: {
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
  }) {
    return await aiService.generateMealPlan(request)
  },

  // Get quick meal suggestions
  async getQuickMeals(
    userId: string,
    availableIngredients: string[],
    timeAvailable: number,
    mealType: string,
    dietaryRestrictions: string[] = []
  ) {
    return await aiService.getQuickMealSuggestions(
      userId,
      availableIngredients,
      timeAvailable,
      mealType,
      dietaryRestrictions
    )
  },

  // Suggest ingredient substitutions
  async suggestSubstitutions(
    userId: string,
    originalIngredient: string,
    recipeContext: string,
    dietaryRestrictions: string[] = [],
    allergies: string[] = []
  ) {
    return await aiService.suggestSubstitutions(
      userId,
      originalIngredient,
      recipeContext,
      dietaryRestrictions,
      allergies
    )
  },

  // Check AI service health
  async healthCheck() {
    return await aiService.healthCheck()
  },

  // Get service statistics
  getStats() {
    return aiService.getStats()
  },

  // Direct AI request (for custom use cases)
  async request(prompt: string, options: {
    userId?: string
    model?: string
    temperature?: number
    maxTokens?: number
  } = {}) {
    return await aiService.generateResponse({
      prompt,
      ...(options.userId !== undefined && { userId: options.userId }),
      ...(options.model !== undefined && { model: options.model }),
      ...(options.temperature !== undefined && { temperature: options.temperature }),
      ...(options.maxTokens !== undefined && { maxTokens: options.maxTokens })
    })
  }
}

// Export default
export default ai