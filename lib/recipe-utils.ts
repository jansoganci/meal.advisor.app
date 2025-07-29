import type { QuickMealSuggestion } from '@/lib/ai/types'
import type { RecipeInsert } from '@/lib/database'

// Recipe utility functions
export const recipeUtils = {
  // Convert QuickMealSuggestion to Recipe database format
  convertSuggestionToRecipe(suggestion: QuickMealSuggestion, userId: string): RecipeInsert {
    return {
      user_id: userId,
      title: suggestion.title,
      description: suggestion.description,
      difficulty_level: this.normalizeDifficulty(suggestion.difficulty),
      prep_time_minutes: this.parseTimeToMinutes(suggestion.totalTime),
      servings: 1, // Default serving size for AI suggestions
      calories: suggestion.calories,
      protein_g: suggestion.nutrition.protein,
      carbs_g: suggestion.nutrition.carbs,
      fat_g: suggestion.nutrition.fat,
      ingredients: this.formatIngredientsForDB(suggestion.ingredients),
      instructions: this.formatInstructionsForDB(suggestion.quickInstructions),
      dietary_tags: suggestion.tags,
      ai_generated: true,
      ai_model_used: 'deepseek',
      is_public: false,
    }
  },

  // Generate unique recipe hash based on content
  generateRecipeHash(suggestion: QuickMealSuggestion): string {
    const content = `${suggestion.title}-${suggestion.description}-${suggestion.ingredients.join(',')}`
    // Simple hash for MVP (in production, use crypto.createHash)
    return Buffer.from(content).toString('base64').slice(0, 16)
  },

  // Validate recipe data before database insertion
  validateRecipeData(recipe: RecipeInsert): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    // Required fields validation
    if (!recipe.title || recipe.title.trim().length < 3) {
      errors.push('Title must be at least 3 characters long')
    }

    if (!recipe.servings || recipe.servings < 1 || recipe.servings > 20) {
      errors.push('Servings must be between 1 and 20')
    }

    if (!recipe.ingredients || !Array.isArray(recipe.ingredients) || recipe.ingredients.length === 0) {
      errors.push('At least one ingredient is required')
    }

    if (!recipe.instructions || !Array.isArray(recipe.instructions) || recipe.instructions.length === 0) {
      errors.push('At least one instruction is required')
    }

    // Nutrition validation (if provided)
    if (recipe.calories !== null && recipe.calories !== undefined && recipe.calories < 0) {
      errors.push('Calories must be non-negative')
    }

    if (recipe.protein_g !== null && recipe.protein_g !== undefined && recipe.protein_g < 0) {
      errors.push('Protein must be non-negative')
    }

    if (recipe.carbs_g !== null && recipe.carbs_g !== undefined && recipe.carbs_g < 0) {
      errors.push('Carbs must be non-negative')
    }

    if (recipe.fat_g !== null && recipe.fat_g !== undefined && recipe.fat_g < 0) {
      errors.push('Fat must be non-negative')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  },

  // Helper: Normalize difficulty level to match database enum
  normalizeDifficulty(difficulty: string): 'easy' | 'medium' | 'hard' {
    const normalized = difficulty.toLowerCase().trim()
    
    if (normalized.includes('easy') || normalized.includes('simple') || normalized.includes('quick')) {
      return 'easy'
    }
    
    if (normalized.includes('hard') || normalized.includes('difficult') || normalized.includes('advanced')) {
      return 'hard'
    }
    
    return 'medium' // Default fallback
  },

  // Helper: Parse time string to minutes
  parseTimeToMinutes(timeString: string): number {
    if (!timeString) return 30 // Default 30 minutes

    // Match patterns like "25 min", "1 hour", "1h 30m", etc.
    const hourMatch = timeString.match(/(\d+)\s*h(?:our)?s?/i)
    const minuteMatch = timeString.match(/(\d+)\s*m(?:in)?(?:ute)?s?/i)
    
    let totalMinutes = 0
    
    if (hourMatch) {
      totalMinutes += parseInt(hourMatch[1]) * 60
    }
    
    if (minuteMatch) {
      totalMinutes += parseInt(minuteMatch[1])
    }
    
    // If no time found, try to extract any number and assume minutes
    if (totalMinutes === 0) {
      const numberMatch = timeString.match(/(\d+)/)
      if (numberMatch) {
        totalMinutes = parseInt(numberMatch[1])
        // If number is very small, assume hours
        if (totalMinutes <= 5) {
          totalMinutes *= 60
        }
      }
    }
    
    return totalMinutes || 30 // Fallback to 30 minutes
  },

  // Helper: Format ingredients array for database storage
  formatIngredientsForDB(ingredients: string[]): any[] {
    return ingredients.map((ingredient, index) => ({
      step: index + 1,
      name: ingredient.trim(),
      amount: null, // AI suggestions don't have structured amounts
      unit: null,
      notes: null
    }))
  },

  // Helper: Format instructions array for database storage
  formatInstructionsForDB(instructions: string[]): any[] {
    return instructions.map((instruction, index) => ({
      step: index + 1,
      instruction: instruction.trim(),
      duration_minutes: null // AI suggestions don't have per-step timing
    }))
  },

  // Helper: Extract estimated cost from string
  parseEstimatedCost(costString: string): number | null {
    if (!costString) return null
    
    // Match patterns like "$8.50", "8.5", "$8", etc.
    const match = costString.match(/\$?(\d+(?:\.\d{2})?)/)
    return match ? parseFloat(match[1]) : null
  },

  // Helper: Check if recipe already exists for user
  generateRecipeFingerprint(suggestion: QuickMealSuggestion): string {
    // Create a more sophisticated fingerprint for duplicate detection
    const normalized = {
      title: suggestion.title.toLowerCase().trim(),
      description: suggestion.description?.toLowerCase().trim(),
      ingredients: suggestion.ingredients.map(i => i.toLowerCase().trim()).sort().join('|'),
      calories: suggestion.calories
    }
    
    return `${normalized.title}-${normalized.calories}-${normalized.ingredients.slice(0, 100)}`
  }
}

// Export individual functions for convenience
export const {
  convertSuggestionToRecipe,
  generateRecipeHash,
  validateRecipeData,
  parseTimeToMinutes,
  formatIngredientsForDB,
  formatInstructionsForDB
} = recipeUtils 