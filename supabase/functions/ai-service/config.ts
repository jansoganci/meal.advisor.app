// Configuration for AI service Edge Function
// All API keys are loaded server-side and never exposed to the frontend

export const AI_CONFIG = {
  providers: {
    deepseek: {
      name: 'DeepSeek',
      apiKey: Deno.env.get('DEEPSEEK_API_KEY') || '',
      baseUrl: 'https://api.deepseek.com/v1',
      model: 'deepseek-chat',
      maxTokens: 4000,
      temperature: 0.7,
      topP: 0.9
    },
    gemini: {
      name: 'Gemini',
      apiKey: Deno.env.get('GEMINI_API_KEY') || '',
      baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
      model: 'gemini-pro',
      maxTokens: 4000,
      temperature: 0.7,
      topP: 0.9
    }
  },
  defaultProvider: 'deepseek',
  fallbackProvider: 'gemini',
  timeouts: {
    requestTimeout: 30000, // 30 seconds
    retryDelay: 1000 // 1 second
  },
  rateLimits: {
    requestsPerMinute: 10,
    requestsPerHour: 100,
    requestsPerDay: 500
  }
}; 