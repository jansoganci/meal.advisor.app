import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { AI_CONFIG } from './config.ts'

console.log('[DEBUG] AI SERVICE EDGE FUNC TRIGGERED')

Deno.serve(async (req: Request) => {
  const isDev = Deno.env.get('ENV') === 'development'
  
  if (isDev) {
    console.log('[DEV-LOG] AI Service Request Started')
  }

  // Only handle POST requests
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  try {
    // 1. Authenticate the request
    const authHeader = req.headers.get('Authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      if (isDev) console.log('[DEV-LOG] Authentication failed: No valid auth header')
      return new Response(JSON.stringify({ error: 'Unauthorized - No valid session' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // 2. Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || ''
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // 3. Get user from token
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      if (isDev) console.log('[DEV-LOG] Authentication failed: Invalid session')
      return new Response(JSON.stringify({ error: 'Unauthorized - Invalid session' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // 4. Check quota (simplified)
    const { data: quotaData, error: quotaError } = await supabase.rpc('check_quota', {
      p_user_id: user.id
    })

    if (quotaError) {
      if (isDev) console.log('[DEV-LOG] Quota check failed:', quotaError)
      return new Response(JSON.stringify({ error: 'Failed to check quota' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    if (!quotaData?.quota_available) {
      if (isDev) console.log('[DEV-LOG] Quota exceeded for user:', user.id)
      return new Response(JSON.stringify({ 
        error: 'Daily quota exceeded. Please try again tomorrow or upgrade to premium for unlimited access.',
        quotaInfo: quotaData
      }), {
        status: 429,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // 5. Parse request body
    const requestBody = await req.json()
    const { prompt, requestType = 'quickmeal', preferences } = requestBody

    if (!prompt) {
      if (isDev) console.log('[DEV-LOG] Missing required prompt parameter')
      return new Response(JSON.stringify({ error: 'Missing required prompt parameter' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // 6. Call AI API with timeout
    if (isDev) console.log('[DEV-LOG] Calling DeepSeek API...')
    
    let aiResponse: any
    let providerUsed = 'deepseek'
    
    try {
      aiResponse = await callDeepSeekAPI(prompt, preferences)
      if (isDev) console.log('[DEV-LOG] DeepSeek API call successful')
    } catch (deepseekError) {
      if (isDev) console.log('[DEV-LOG] DeepSeek API failed, switching to Gemini...')
      
      // Fallback to Gemini
      providerUsed = 'gemini'
      try {
        aiResponse = await callGeminiAPI(prompt, preferences)
        if (isDev) console.log('[DEV-LOG] Gemini API call successful')
      } catch (geminiError) {
        if (isDev) console.log('[DEV-LOG] All AI providers failed')
        return new Response(JSON.stringify({ 
          error: 'AI service temporarily unavailable. Please try again later.' 
        }), {
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        })
      }
    }

    // 7. Increment quota (non-blocking)
    supabase.rpc('increment_quota', { p_user_id: user.id }).catch(() => {
      // Ignore quota increment errors
    })

    // 8. Return response
    const finalResponse = {
      success: true,
      data: aiResponse,
      metadata: {
        provider: providerUsed,
        tokensUsed: aiResponse.usage?.total_tokens || 0
      }
    }

    if (isDev) {
      console.log('[DEV-LOG] Returning successful response')
    }

    return new Response(JSON.stringify(finalResponse), {
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    if (isDev) {
      console.log('[DEV-LOG] Edge Function error:', error)
    }
    return new Response(JSON.stringify({ 
      error: 'Internal server error' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
})

async function callDeepSeekAPI(prompt: string, preferences?: any): Promise<any> {
  const isDev = Deno.env.get('ENV') === 'development'
  
  const requestBody = {
    model: AI_CONFIG.providers.deepseek.model,
    messages: [{ role: 'user', content: prompt }],
    temperature: AI_CONFIG.providers.deepseek.temperature,
    max_tokens: AI_CONFIG.providers.deepseek.maxTokens,
    top_p: AI_CONFIG.providers.deepseek.topP
  }

  if (isDev) {
    console.log('[DEV-LOG] DeepSeek request body:', requestBody)
  }

  const response = await fetch(`${AI_CONFIG.providers.deepseek.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${AI_CONFIG.providers.deepseek.apiKey}`
    },
    body: JSON.stringify(requestBody),
    signal: AbortSignal.timeout(AI_CONFIG.timeouts.requestTimeout)
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    const errorMessage = `DeepSeek API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`
    if (isDev) console.log('[DEV-LOG] DeepSeek API error:', errorMessage)
    throw new Error(errorMessage)
  }

  const responseData = await response.json()
  
  if (isDev) {
    console.log('[DEV-LOG] DeepSeek response received')
  }

  return responseData
}

async function callGeminiAPI(prompt: string, preferences?: any): Promise<any> {
  const isDev = Deno.env.get('ENV') === 'development'
  
  if (isDev) {
    console.log('[DEV-LOG] Gemini API call attempted but not implemented yet')
  }
  
  // TODO: Implement Gemini API call
  throw new Error('Gemini API not implemented yet')
} 