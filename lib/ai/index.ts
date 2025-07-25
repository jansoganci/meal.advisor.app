// AI Service - Main export file
// Export the new Edge AI service
export { EdgeAIService, edgeAIService } from './edge-service'

// Export types
export type {
    ActivityLevel, CuisineType,
    DietaryRestriction, DifficultyLevel, EdgeFunctionResponse, MealType, PrimaryGoal, QuickMealPreferences, QuickMealResponse, QuickMealSuggestion
} from './types'

// Legacy exports for backward compatibility (deprecated)
// These will be removed in future versions
import { edgeAIService } from './edge-service'

export const ai = {
  // Legacy method - use edgeAIService.generateQuickMealSuggestions instead
  async generateQuickMealSuggestions(preferences: any): Promise<any> {
    console.warn('ai.generateQuickMealSuggestions is deprecated. Use edgeAIService.generateQuickMealSuggestions instead.')
    return await edgeAIService.generateQuickMealSuggestions(preferences)
  }
}