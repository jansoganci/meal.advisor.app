import type { AIRequest, AIResponse, AIError } from '../types'
import { AI_CONFIG, COST_RATES } from '../config'
import { AIServiceError, NetworkError } from '../../errors'

export class DeepSeekProvider {
  private apiKey: string
  private baseUrl: string
  private model: string

  constructor() {
    this.apiKey = AI_CONFIG.providers.deepseek.apiKey
    this.baseUrl = AI_CONFIG.providers.deepseek.baseUrl
    this.model = AI_CONFIG.providers.deepseek.model

    if (!this.apiKey) {
      throw new AIServiceError('DeepSeek API key is not configured')
    }
  }

  async generateResponse(request: AIRequest): Promise<AIResponse> {
    const startTime = Date.now()
    
    try {
      const response = await this.makeRequest(request)
      const endTime = Date.now()

      return {
        content: response.choices[0].message.content,
        model: this.model,
        provider: 'deepseek',
        usage: {
          promptTokens: response.usage.prompt_tokens,
          completionTokens: response.usage.completion_tokens,
          totalTokens: response.usage.total_tokens
        },
        cost: this.calculateCost(response.usage),
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
      model: request.model || this.model,
      messages: [
        {
          role: 'user',
          content: request.prompt
        }
      ],
      temperature: request.temperature || AI_CONFIG.providers.deepseek.temperature,
      max_tokens: request.maxTokens || AI_CONFIG.providers.deepseek.maxTokens,
      top_p: AI_CONFIG.providers.deepseek.topP,
      stream: false
    }

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify(requestBody),
      signal: AbortSignal.timeout(AI_CONFIG.timeouts.requestTimeout)
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`DeepSeek API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`)
    }

    return await response.json()
  }

  private calculateCost(usage: any): number {
    const inputCost = usage.prompt_tokens * COST_RATES.deepseek.inputTokens
    const outputCost = usage.completion_tokens * COST_RATES.deepseek.outputTokens
    return Number((inputCost + outputCost).toFixed(6))
  }

  private handleError(error: any, responseTime: number): AIError {
    console.error('DeepSeek API error:', error)

    // Handle timeout errors
    if (error.name === 'TimeoutError' || error.message?.includes('timeout')) {
      return {
        message: 'Request timed out',
        code: 'TIMEOUT',
        provider: 'deepseek',
        statusCode: 408,
        retryable: true
      }
    }

    // Handle network errors
    if (error.name === 'NetworkError' || !navigator.onLine) {
      return {
        message: 'Network connection failed',
        code: 'NETWORK_ERROR',
        provider: 'deepseek',
        statusCode: 502,
        retryable: true
      }
    }

    // Handle API errors
    if (error.message?.includes('401') || error.message?.includes('invalid_api_key')) {
      return {
        message: 'Invalid API key',
        code: 'INVALID_API_KEY',
        provider: 'deepseek',
        statusCode: 401,
        retryable: false
      }
    }

    if (error.message?.includes('429') || error.message?.includes('rate_limit')) {
      return {
        message: 'Rate limit exceeded',
        code: 'RATE_LIMIT_EXCEEDED',
        provider: 'deepseek',
        statusCode: 429,
        retryable: true
      }
    }

    if (error.message?.includes('quota') || error.message?.includes('insufficient')) {
      return {
        message: 'Quota exceeded',
        code: 'QUOTA_EXCEEDED',
        provider: 'deepseek',
        statusCode: 429,
        retryable: false
      }
    }

    if (error.message?.includes('400') || error.message?.includes('invalid_request')) {
      return {
        message: 'Invalid request',
        code: 'INVALID_REQUEST',
        provider: 'deepseek',
        statusCode: 400,
        retryable: false
      }
    }

    if (error.message?.includes('500') || error.message?.includes('internal_error')) {
      return {
        message: 'Service temporarily unavailable',
        code: 'SERVICE_UNAVAILABLE',
        provider: 'deepseek',
        statusCode: 500,
        retryable: true
      }
    }

    // Default error handling
    return {
      message: error.message || 'Unknown error occurred',
      code: 'UNKNOWN_ERROR',
      provider: 'deepseek',
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
      return response.choices?.[0]?.message?.content !== undefined
    } catch (error) {
      console.error('DeepSeek health check failed:', error)
      return false
    }
  }

  // Get model info
  getModelInfo(): any {
    return {
      name: 'DeepSeek',
      model: this.model,
      maxTokens: AI_CONFIG.providers.deepseek.maxTokens,
      costPerToken: {
        input: COST_RATES.deepseek.inputTokens,
        output: COST_RATES.deepseek.outputTokens
      }
    }
  }

  // Validate request
  validateRequest(request: AIRequest): { isValid: boolean; error?: string } {
    if (!request.prompt) {
      return { isValid: false, error: 'Prompt is required' }
    }

    if (request.prompt.length > 50000) {
      return { isValid: false, error: 'Prompt is too long (max 50,000 characters)' }
    }

    if (request.maxTokens && (request.maxTokens < 1 || request.maxTokens > 4000)) {
      return { isValid: false, error: 'Max tokens must be between 1 and 4000' }
    }

    if (request.temperature && (request.temperature < 0 || request.temperature > 2)) {
      return { isValid: false, error: 'Temperature must be between 0 and 2' }
    }

    return { isValid: true }
  }

  // Estimate cost
  estimateCost(prompt: string, maxTokens: number = 1000): number {
    // Rough estimation: 1 token ≈ 4 characters
    const estimatedInputTokens = Math.ceil(prompt.length / 4)
    const estimatedOutputTokens = maxTokens

    const inputCost = estimatedInputTokens * COST_RATES.deepseek.inputTokens
    const outputCost = estimatedOutputTokens * COST_RATES.deepseek.outputTokens

    return Number((inputCost + outputCost).toFixed(6))
  }
}