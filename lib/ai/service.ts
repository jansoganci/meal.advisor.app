import { AIServiceError, RateLimitError, ValidationError } from '../errors'
import { security } from '../security'
import { AI_CONFIG, FALLBACK_RESPONSES, PROMPT_TEMPLATES, VALIDATION_SCHEMAS } from './config'
import { DeepSeekProvider } from './providers/deepseek'
import { GeminiProvider } from './providers/gemini'
import type {
  AIProviderName,
  AIRequest,
  AIResponse,
  CacheEntry,
  MealPlanRequest,
  MealPlanResponse,
  RecipeRequest,
  RecipeResponse,
  UsageRecord
} from './types'

export class AIService {
  private providers: Map<AIProviderName, any>
  private cache: Map<string, CacheEntry>
  private defaultProvider: AIProviderName
  private fallbackProvider: AIProviderName

  constructor() {
    this.providers = new Map()
    this.cache = new Map()
    this.defaultProvider = AI_CONFIG.defaultProvider as AIProviderName
    this.fallbackProvider = AI_CONFIG.fallbackProvider as AIProviderName

    this.initializeProviders()
  }

  private initializeProviders(): void {
    try {
      this.providers.set('deepseek', new DeepSeekProvider())
    } catch (error) {
      console.warn('Failed to initialize DeepSeek provider:', error)
    }

    try {
      this.providers.set('gemini', new GeminiProvider())
    } catch (error) {
      console.warn('Failed to initialize Gemini provider:', error)
    }

    if (this.providers.size === 0) {
      console.warn('No AI providers initialized. Using fallback content only.')
    }
  }

  // Main request handler with retry logic
  async generateResponse(request: AIRequest): Promise<AIResponse> {
    const requestId = request.requestId || this.generateRequestId()
    const enrichedRequest = { ...request, requestId }

    // Check rate limits
    if (request.userId) {
      const rateLimitOk = await this.checkRateLimit(request.userId)
      if (!rateLimitOk) {
        throw new RateLimitError('Rate limit exceeded. Please try again later.')
      }
    }

    // Check cache first
    const cacheKey = this.generateCacheKey(enrichedRequest)
    const cachedResponse = this.getFromCache(cacheKey)
    if (cachedResponse) {
      return cachedResponse
    }

    // Try primary provider first
    let lastError: any
    const providersToTry = [this.defaultProvider, this.fallbackProvider]

    for (const providerName of providersToTry) {
      const provider = this.providers.get(providerName)
      if (!provider) continue

      try {
        const response = await this.makeRequestWithRetry(provider, enrichedRequest)
        
        // Cache successful response
        this.addToCache(cacheKey, response)
        
        // Track usage
        if (request.userId) {
          await this.trackUsage(request.userId, response)
        }

        return response
      } catch (error) {
        lastError = error
        console.warn(`Provider ${providerName} failed:`, error)
      }
    }

    // If all providers failed, return fallback content
    console.error('All AI providers failed, using fallback content')
    return this.getFallbackResponse(enrichedRequest)
  }

  private async makeRequestWithRetry(provider: any, request: AIRequest): Promise<AIResponse> {
    let lastError: any
    
    for (let attempt = 1; attempt <= AI_CONFIG.timeouts.maxRetries; attempt++) {
      try {
        // Validate request
        const validation = provider.validateRequest(request)
        if (!validation.isValid) {
          throw new ValidationError(validation.error || 'Invalid request')
        }

        // Make request
        const response = await provider.generateResponse(request)
        
        // Validate response
        this.validateResponse(response)
        
        return response
      } catch (error) {
        lastError = error
        
        // Don't retry on validation errors
        if (error instanceof ValidationError) {
          throw error
        }

        // Don't retry on final attempt
        if (attempt === AI_CONFIG.timeouts.maxRetries) {
          break
        }

        // Wait before retrying
        await this.delay(AI_CONFIG.timeouts.retryDelay * attempt)
      }
    }
    
    throw lastError
  }

  // Recipe generation
  async generateRecipe(request: RecipeRequest): Promise<RecipeResponse> {
    const template = PROMPT_TEMPLATES.find(t => t.id === 'recipe-generation')
    if (!template) {
      throw new AIServiceError('Recipe generation template not found')
    }

    const prompt = this.buildPrompt(template, {
      mealType: request.mealType,
      cuisineType: request.cuisineType || 'any',
      servings: request.servings?.toString() || '2',
      maxCookingTime: request.maxCookingTime?.toString() || '60',
      difficulty: request.difficulty || 'medium',
      dietaryRestrictions: request.dietaryRestrictions?.join(', ') || 'none',
      allergies: request.allergies?.join(', ') || 'none',
      customPrompt: request.customPrompt || ''
    })

    const aiResponse = await this.generateResponse({
      prompt,
      userId: request.userId,
      temperature: 0.7,
      maxTokens: 2000
    })

    try {
      const recipe = this.parseJSONResponse(aiResponse.content)
      this.validateRecipe(recipe)
      return recipe
    } catch (error) {
      console.error('Failed to parse recipe response:', error)
      return FALLBACK_RESPONSES.recipe as RecipeResponse
    }
  }

  // Meal plan generation
  async generateMealPlan(request: MealPlanRequest): Promise<MealPlanResponse> {
    const template = PROMPT_TEMPLATES.find(t => t.id === 'meal-plan-generation')
    if (!template) {
      throw new AIServiceError('Meal plan generation template not found')
    }

    const prompt = this.buildPrompt(template, {
      activityLevel: request.preferences.activityLevel,
      primaryGoal: request.preferences.primaryGoal,
      dailyCalories: request.preferences.dailyCalories.toString(),
      macroTargets: JSON.stringify(request.preferences.macroTargets),
      startDate: request.planDetails.startDate,
      endDate: request.planDetails.endDate,
      mealsPerDay: request.planDetails.mealsPerDay.toString(),
      cookingTimePreference: request.planDetails.cookingTimePreference,
      difficultyPreference: request.planDetails.difficultyPreference,
      dietaryRestrictions: request.preferences.dietaryRestrictions.join(', '),
      cuisinePreferences: request.preferences.cuisinePreferences.join(', '),
      allergies: request.preferences.allergies.join(', '),
      dislikedFoods: request.preferences.dislikedFoods.join(', '),
      customRequests: request.customRequests?.join(', ') || ''
    })

    const aiResponse = await this.generateResponse({
      prompt,
      userId: request.userId,
      temperature: 0.8,
      maxTokens: 4000
    })

    try {
      const mealPlan = this.parseJSONResponse(aiResponse.content)
      this.validateMealPlan(mealPlan)
      return mealPlan
    } catch (error) {
      console.error('Failed to parse meal plan response:', error)
      return FALLBACK_RESPONSES.mealPlan as MealPlanResponse
    }
  }

  // Quick meal suggestions
  async getQuickMealSuggestions(
    userId: string,
    availableIngredients: string[],
    timeAvailable: number,
    mealType: string,
    dietaryRestrictions: string[] = []
  ): Promise<any> {
    const template = PROMPT_TEMPLATES.find(t => t.id === 'quick-meal-suggestion')
    if (!template) {
      throw new AIServiceError('Quick meal template not found')
    }

    const prompt = this.buildPrompt(template, {
      availableIngredients: availableIngredients.join(', '),
      timeAvailable: timeAvailable.toString(),
      mealType,
      dietaryRestrictions: dietaryRestrictions.join(', '),
      cookingEquipment: 'basic kitchen equipment',
      skillLevel: 'beginner'
    })

    const aiResponse = await this.generateResponse({
      prompt,
      userId,
      temperature: 0.9,
      maxTokens: 1500
    })

    try {
      return this.parseJSONResponse(aiResponse.content)
    } catch (error) {
      console.error('Failed to parse quick meal response:', error)
      return {
        suggestions: [
          {
            title: 'Simple Sandwich',
            description: 'Quick and easy sandwich with available ingredients',
            totalTime: Math.min(timeAvailable, 10),
            difficulty: 'easy',
            ingredients: availableIngredients.slice(0, 5),
            quickInstructions: ['Prepare ingredients', 'Assemble sandwich', 'Serve'],
            calories: 300,
            tags: ['quick', 'easy']
          }
        ],
        tips: ['Use what you have', 'Keep it simple'],
        mealPrepIdeas: ['Prepare ingredients ahead']
      }
    }
  }

  // Ingredient substitution
  async suggestSubstitutions(
    userId: string,
    originalIngredient: string,
    recipeContext: string,
    dietaryRestrictions: string[] = [],
    allergies: string[] = []
  ): Promise<any> {
    const template = PROMPT_TEMPLATES.find(t => t.id === 'ingredient-substitution')
    if (!template) {
      throw new AIServiceError('Substitution template not found')
    }

    const prompt = this.buildPrompt(template, {
      originalIngredient,
      recipeContext,
      dietaryRestrictions: dietaryRestrictions.join(', '),
      allergies: allergies.join(', '),
      reason: 'dietary preferences'
    })

    const aiResponse = await this.generateResponse({
      prompt,
      userId,
      temperature: 0.6,
      maxTokens: 1000
    })

    try {
      return this.parseJSONResponse(aiResponse.content)
    } catch (error) {
      console.error('Failed to parse substitution response:', error)
      return {
        originalIngredient,
        substitutions: [
          {
            substitute: 'Common alternative',
            ratio: '1:1',
            notes: 'Basic substitution',
            impact: 'minimal',
            availability: 'common',
            cost: 'similar'
          }
        ],
        bestSubstitute: 'Common alternative',
        tips: ['Adjust to taste'],
        warnings: ['May affect flavor']
      }
    }
  }

  // Utility methods
  private buildPrompt(template: any, variables: Record<string, string>): string {
    let prompt = template.template
    
    for (const [key, value] of Object.entries(variables)) {
      prompt = prompt.replace(new RegExp(`{${key}}`, 'g'), value)
    }
    
    return prompt
  }

  private parseJSONResponse(content: string): any {
    // Extract JSON from response (handle cases where AI adds extra text)
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No JSON found in response')
    }
    
    return JSON.parse(jsonMatch[0])
  }

  private validateResponse(response: AIResponse): void {
    if (!response.content || response.content.trim().length === 0) {
      throw new ValidationError('Empty response content')
    }
    
    if (!response.provider || !response.model) {
      throw new ValidationError('Missing provider or model information')
    }
  }

  private validateRecipe(recipe: any): void {
    const schema = VALIDATION_SCHEMAS.recipe
    
    if (!recipe.title || recipe.title.length < 3) {
      throw new ValidationError('Recipe title is required and must be at least 3 characters')
    }
    
    if (!recipe.ingredients || !Array.isArray(recipe.ingredients) || recipe.ingredients.length === 0) {
      throw new ValidationError('Recipe must have at least one ingredient')
    }
    
    if (!recipe.instructions || !Array.isArray(recipe.instructions) || recipe.instructions.length === 0) {
      throw new ValidationError('Recipe must have at least one instruction')
    }
    
    if (!recipe.servings || recipe.servings < 1 || recipe.servings > 20) {
      throw new ValidationError('Recipe servings must be between 1 and 20')
    }
  }

  private validateMealPlan(mealPlan: any): void {
    if (!mealPlan.title || mealPlan.title.length < 3) {
      throw new ValidationError('Meal plan title is required')
    }
    
    if (!mealPlan.days || !Array.isArray(mealPlan.days) || mealPlan.days.length === 0) {
      throw new ValidationError('Meal plan must have at least one day')
    }
    
    for (const day of mealPlan.days) {
      if (!day.meals || !Array.isArray(day.meals) || day.meals.length === 0) {
        throw new ValidationError('Each day must have at least one meal')
      }
    }
  }

  private async checkRateLimit(userId: string): Promise<boolean> {
    return await security.checkRateLimit(
      userId,
      'ai_request',
      AI_CONFIG.rateLimits.requestsPerMinute,
      1
    )
  }

  private async trackUsage(userId: string, response: AIResponse): Promise<void> {
    const usage: UsageRecord = {
      userId,
      provider: response.provider,
      model: response.model,
      promptTokens: response.usage?.promptTokens || 0,
      completionTokens: response.usage?.completionTokens || 0,
      totalTokens: response.usage?.totalTokens || 0,
      cost: response.cost || 0,
      timestamp: new Date().toISOString(),
      requestType: 'general',
      success: true
    }

    // Store usage in database (implement based on your needs)
    console.log('AI Usage tracked:', usage)
  }

  private generateCacheKey(request: AIRequest): string {
    return Buffer.from(JSON.stringify({
      prompt: request.prompt,
      model: request.model,
      temperature: request.temperature,
      maxTokens: request.maxTokens
    })).toString('base64')
  }

  private getFromCache(key: string): AIResponse | null {
    const entry = this.cache.get(key)
    if (!entry) return null

    // Check if cache entry is still valid
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      return null
    }

    entry.hits++
    return entry.value
  }

  private addToCache(key: string, response: AIResponse): void {
    if (!AI_CONFIG.caching.enabled) return

    // Don't cache if at max size
    if (this.cache.size >= AI_CONFIG.caching.maxSize) {
      // Remove oldest entry
      const oldestKey = this.cache.keys().next().value
      if (oldestKey) {
        this.cache.delete(oldestKey)
      }
    }

    this.cache.set(key, {
      key,
      value: response,
      timestamp: Date.now(),
      ttl: AI_CONFIG.caching.ttl,
      hits: 1
    })
  }

  private getFallbackResponse(request: AIRequest): AIResponse {
    return {
      content: 'I apologize, but I\'m currently unable to process your request. Please try again later.',
      model: 'fallback',
      provider: 'fallback',
      usage: {
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0
      },
      cost: 0,
      requestId: request.requestId || '',
      timestamp: new Date().toISOString()
    }
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Health check for all providers
  async healthCheck(): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {}
    
    for (const [name, provider] of this.providers) {
      try {
        results[name] = await provider.healthCheck()
      } catch (error) {
        results[name] = false
      }
    }
    
    return results
  }

  // Get service statistics
  getStats(): any {
    return {
      providersCount: this.providers.size,
      cacheSize: this.cache.size,
      cacheHits: Array.from(this.cache.values()).reduce((sum, entry) => sum + entry.hits, 0),
      defaultProvider: this.defaultProvider,
      fallbackProvider: this.fallbackProvider
    }
  }
}

// Export singleton instance
export const aiService = new AIService()