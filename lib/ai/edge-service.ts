import { supabase } from '../supabase'

// Types for QuickMeal requests and responses
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

interface EdgeFunctionResponse {
  success: boolean
  data: any
  metadata?: {
    provider: string
    responseTime: number
    tokensUsed: number
  }
  error?: string
}

export class EdgeAIService {
  private maxRetries = 3
  private retryDelay = 1000 // 1 second

  /**
   * Generate QuickMeal suggestions using the Supabase Edge Function
   * Handles quota checking, error handling, and retry logic
   */
  async generateQuickMealSuggestions(preferences: QuickMealPreferences): Promise<QuickMealResponse> {
    // Build the prompt based on user preferences
    const prompt = this.buildQuickMealPrompt(preferences)

    // Prepare the request payload
    const requestPayload = {
      prompt,
      requestType: 'quickmeal',
      preferences
    }

    // Try the request with retry logic
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const response = await this.callEdgeFunction(requestPayload)
        
        // Parse and validate the response
        const parsedResponse = this.parseQuickMealResponse(response)
        
        return parsedResponse

      } catch (error: any) {
        console.error(`Edge Function call attempt ${attempt} failed:`, error)

        // Handle specific error types
        if (error.message?.includes('quota') || error.message?.includes('limit')) {
          throw new Error('Daily limit reached. Please try again tomorrow or upgrade to premium for unlimited access.')
        }

        if (error.message?.includes('unauthorized') || error.message?.includes('401')) {
          throw new Error('Please sign in to use QuickMeal.')
        }

        if (error.message?.includes('unavailable') || error.message?.includes('503')) {
          if (attempt < this.maxRetries) {
            // Wait before retry
            await this.delay(this.retryDelay * attempt)
            continue
          }
          throw new Error('AI service temporarily unavailable. Please try again later.')
        }

        // For other errors, throw immediately
        throw new Error('Unable to generate suggestions. Please try again.')
      }
    }

    throw new Error('Unable to generate suggestions after multiple attempts.')
  }

  /**
   * Call the Supabase Edge Function
   */
  private async callEdgeFunction(payload: any): Promise<EdgeFunctionResponse> {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      throw new Error('No valid session found')
    }

    const response = await fetch(`${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/ai-service`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
    }

    return await response.json()
  }

  /**
   * Build the prompt for QuickMeal suggestions
   */
  private buildQuickMealPrompt(preferences: QuickMealPreferences): string {
    return `Generate a quick meal suggestion based on these preferences:
- Servings: ${preferences.servings}
- Prep time: ${preferences.prepTime} minutes
- Diet: ${preferences.diet}
- Cuisine: ${preferences.cuisine}
- Mood: ${preferences.mood}
- Budget: ${preferences.budget}

Please provide a JSON response with the following structure:
{
  "suggestions": [
    {
      "name": "Meal name",
      "ingredients": ["ingredient1", "ingredient2"],
      "instructions": ["step1", "step2"],
      "prepTime": "X minutes",
      "difficulty": "easy/medium/hard",
      "nutritionInfo": {
        "calories": 300,
        "protein": 20,
        "carbs": 30,
        "fat": 10
      }
    }
  ],
  "mealPrepIdeas": ["idea1", "idea2"],
  "timeSavingTips": ["tip1", "tip2"],
  "budgetTips": ["tip1", "tip2"],
  "nutritionNotes": "Nutrition information",
  "customizations": ["customization1", "customization2"]
}`
  }

  /**
   * Parse and validate the QuickMeal response
   */
  private parseQuickMealResponse(edgeResponse: EdgeFunctionResponse): QuickMealResponse {
    if (!edgeResponse.success || !edgeResponse.data) {
      throw new Error('Invalid response from AI service')
    }

    // Extract the AI response content
    const aiContent = edgeResponse.data.choices?.[0]?.message?.content
    if (!aiContent) {
      throw new Error('No content received from AI service')
    }

    try {
      // Try to parse as JSON
      const parsedContent = JSON.parse(aiContent)
      
      // Validate the response structure
      if (!parsedContent.suggestions || !Array.isArray(parsedContent.suggestions)) {
        throw new Error('Invalid response format: missing suggestions array')
      }

      // Validate each suggestion
      for (const suggestion of parsedContent.suggestions) {
        if (!suggestion.name || !suggestion.ingredients || !suggestion.instructions) {
          throw new Error('Invalid suggestion format: missing required fields')
        }
      }

      return parsedContent as QuickMealResponse

    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError)
      throw new Error('Invalid response format from AI service')
    }
  }

  /**
   * Utility function to delay execution
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

// Export a singleton instance
export const edgeAIService = new EdgeAIService() 