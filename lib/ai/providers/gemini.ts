import type { AIRequest, AIResponse, AIError } from '../types'
import { AI_CONFIG, COST_RATES } from '../config'
import { AIServiceError, NetworkError } from '../../errors'

export class GeminiProvider {
  private apiKey: string
  private baseUrl: string
  private model: string

  constructor() {
    this.apiKey = AI_CONFIG.providers.gemini.apiKey
    this.baseUrl = AI_CONFIG.providers.gemini.baseUrl
    this.model = AI_CONFIG.providers.gemini.model

    if (!this.apiKey) {
      throw new AIServiceError('Gemini API key is not configured')
    }
  }

  async generateResponse(request: AIRequest): Promise<AIResponse> {
    const startTime = Date.now()
    
    try {
      const response = await this.makeRequest(request)
      const endTime = Date.now()

      return {
        content: response.candidates[0].content.parts[0].text,
        model: this.model,
        provider: 'gemini',
        usage: {
          promptTokens: response.usageMetadata?.promptTokenCount || 0,
          completionTokens: response.usageMetadata?.candidatesTokenCount || 0,
          totalTokens: response.usageMetadata?.totalTokenCount || 0
        },
        cost: this.calculateCost(response.usageMetadata),
        requestId: request.requestId,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      const endTime = Date.now()
      
      throw this.handleError(error, endTime - startTime)
    }
  }

  private async makeRequest(request: AIRequest): Promise<any> {
    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: request.prompt
            }
          ]
        }
      ],
      generationConfig: {
        temperature: request.temperature || AI_CONFIG.providers.gemini.temperature,
        maxOutputTokens: request.maxTokens || AI_CONFIG.providers.gemini.maxTokens,
        topP: AI_CONFIG.providers.gemini.topP,
        topK: 40
      },
      safetySettings: [
        {
          category: 'HARM_CATEGORY_HARASSMENT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        },
        {
          category: 'HARM_CATEGORY_HATE_SPEECH',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        },
        {
          category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        },
        {
          category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        }
      ]
    }

    const url = `${this.baseUrl}/models/${this.model}:generateContent?key=${this.apiKey}`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody),
      signal: AbortSignal.timeout(AI_CONFIG.timeouts.requestTimeout)
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`Gemini API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`)
    }

    const data = await response.json()

    // Check for safety blocks
    if (data.candidates?.[0]?.finishReason === 'SAFETY') {
      throw new Error('Content blocked by safety filters')
    }

    // Check for other finish reasons
    if (data.candidates?.[0]?.finishReason === 'RECITATION') {
      throw new Error('Content blocked due to recitation')
    }

    return data
  }

  private calculateCost(usage: any): number {
    if (!usage) return 0
    
    const inputCost = (usage.promptTokenCount || 0) * COST_RATES.gemini.inputTokens
    const outputCost = (usage.candidatesTokenCount || 0) * COST_RATES.gemini.outputTokens
    return Number((inputCost + outputCost).toFixed(6))
  }

  private handleError(error: any, responseTime: number): AIError {
    console.error('Gemini API error:', error)

    // Handle timeout errors
    if (error.name === 'TimeoutError' || error.message?.includes('timeout')) {
      return {
        message: 'Request timed out',
        code: 'TIMEOUT',
        provider: 'gemini',
        statusCode: 408,
        retryable: true
      }
    }

    // Handle network errors
    if (error.name === 'NetworkError' || !navigator.onLine) {
      return {
        message: 'Network connection failed',
        code: 'NETWORK_ERROR',
        provider: 'gemini',
        statusCode: 502,
        retryable: true
      }
    }

    // Handle safety blocks
    if (error.message?.includes('safety') || error.message?.includes('blocked')) {
      return {
        message: 'Content blocked by safety filters',
        code: 'CONTENT_BLOCKED',
        provider: 'gemini',
        statusCode: 400,
        retryable: false
      }
    }

    // Handle API errors
    if (error.message?.includes('401') || error.message?.includes('invalid_api_key')) {
      return {
        message: 'Invalid API key',
        code: 'INVALID_API_KEY',
        provider: 'gemini',
        statusCode: 401,
        retryable: false
      }
    }

    if (error.message?.includes('429') || error.message?.includes('quota')) {
      return {
        message: 'Rate limit or quota exceeded',
        code: 'RATE_LIMIT_EXCEEDED',
        provider: 'gemini',
        statusCode: 429,
        retryable: true
      }
    }

    if (error.message?.includes('400') || error.message?.includes('invalid_request')) {
      return {
        message: 'Invalid request',
        code: 'INVALID_REQUEST',
        provider: 'gemini',
        statusCode: 400,
        retryable: false
      }
    }

    if (error.message?.includes('500') || error.message?.includes('internal_error')) {
      return {
        message: 'Service temporarily unavailable',
        code: 'SERVICE_UNAVAILABLE',
        provider: 'gemini',
        statusCode: 500,
        retryable: true
      }
    }

    // Default error handling
    return {
      message: error.message || 'Unknown error occurred',
      code: 'UNKNOWN_ERROR',
      provider: 'gemini',
      statusCode: 500,
      retryable: true
    }
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.makeRequest({
        prompt: 'Health check',
        maxTokens: 10,
        temperature: 0.1
      })
      return response.candidates?.[0]?.content?.parts?.[0]?.text !== undefined
    } catch (error) {
      console.error('Gemini health check failed:', error)
      return false
    }
  }

  // Get model info
  getModelInfo(): any {
    return {
      name: 'Gemini',
      model: this.model,
      maxTokens: AI_CONFIG.providers.gemini.maxTokens,
      costPerToken: {
        input: COST_RATES.gemini.inputTokens,
        output: COST_RATES.gemini.outputTokens
      }
    }
  }

  // Validate request
  validateRequest(request: AIRequest): { isValid: boolean; error?: string } {
    if (!request.prompt) {
      return { isValid: false, error: 'Prompt is required' }
    }

    if (request.prompt.length > 30000) {
      return { isValid: false, error: 'Prompt is too long (max 30,000 characters)' }
    }

    if (request.maxTokens && (request.maxTokens < 1 || request.maxTokens > 4000)) {
      return { isValid: false, error: 'Max tokens must be between 1 and 4000' }
    }

    if (request.temperature && (request.temperature < 0 || request.temperature > 1)) {
      return { isValid: false, error: 'Temperature must be between 0 and 1' }
    }

    return { isValid: true }
  }

  // Estimate cost
  estimateCost(prompt: string, maxTokens: number = 1000): number {
    // Rough estimation: 1 token ≈ 4 characters
    const estimatedInputTokens = Math.ceil(prompt.length / 4)
    const estimatedOutputTokens = maxTokens

    const inputCost = estimatedInputTokens * COST_RATES.gemini.inputTokens
    const outputCost = estimatedOutputTokens * COST_RATES.gemini.outputTokens

    return Number((inputCost + outputCost).toFixed(6))
  }

  // Get available models
  async getAvailableModels(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/models?key=${this.apiKey}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to get models: ${response.status}`)
      }

      const data = await response.json()
      return data.models?.map((model: any) => model.name) || []
    } catch (error) {
      console.error('Failed to get available models:', error)
      return [this.model]
    }
  }
}