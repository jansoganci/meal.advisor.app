/**
 * MealAdvisor AI Weekly Service - Edge Function
 * Weekly meal plan generation with quota management
 */

import { createClient } from '@supabase/supabase-js'
import { callDeepSeekWeeklyPlan } from './deepseek.ts'
import { AIServiceRequest, EdgeFunctionResponse, WeeklyPlanPreferences } from './types.ts'

console.log('[AI Weekly Service] Edge Function v1.0 - Ready')

Deno.serve(async (req: Request) => {
  const requestId = `weekly-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  const startTime = Date.now()

  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  }

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // Only handle POST requests
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({
      error: 'Method not allowed',
      requestId,
      timestamp: new Date().toISOString()
    }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    })
  }

  try {
    // 1. AUTHENTICATION
    const authHeader = req.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Unauthorized - No valid session')
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: { headers: { Authorization: authHeader } },
        auth: { persistSession: false }
      }
    )

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      throw new Error('Unauthorized - Invalid session')
    }

    // 2. QUOTA CHECK FOR WEEKLY PLANS
    const { data: quotaData, error: quotaError } = await supabase.rpc('check_weekly_quota', {
      p_user_id: user.id
    })

    if (quotaError || !quotaData?.quota_available) {
      throw new Error('Weekly plan limit reached. Please upgrade to premium or try again later.')
    }

    // 3. FETCH USER PROFILE DATA
    const { data: profile } = await supabase
      .from('users')
      .select('daily_calories, daily_protein_g, dietary_preferences, allergies, cuisine_preferences')
      .eq('id', user.id)
      .single()

    // 4. PARSE REQUEST AND MERGE WITH PROFILE
    const requestBody = await req.json()
    const preferences: WeeklyPlanPreferences = {
      ...requestBody.preferences,
      userId: user.id,
      profileCalories: profile?.daily_calories,
      profileProtein: profile?.daily_protein_g,
      dietaryRestrictions: profile?.dietary_preferences || [],
      allergies: profile?.allergies || []
    }

    const aiServiceRequest: AIServiceRequest = {
      requestType: 'weeklyplan',
      preferences,
      userId: user.id,
      sessionId: requestBody.sessionId || requestId,
      timestamp: new Date().toISOString()
    }

    // 5. BUILD PROMPTS
    const { systemPrompt, userPrompt } = buildWeeklyPlanPrompts(preferences)

    // 6. CALL AI PROVIDER
    console.log(`[AI Weekly Service] ${requestId}: Calling DeepSeek for user ${user.id}`)
    const aiResponse = await callDeepSeekWeeklyPlan(systemPrompt, userPrompt)

    // 7. PARSE AND VALIDATE RESPONSE
    console.log(`[AI Weekly Service] ${requestId}: Raw AI response length: ${aiResponse.length} characters`)
    
    let parsedResponse
    try {
      parsedResponse = JSON.parse(aiResponse)
    } catch (parseError) {
      console.log(`[AI Weekly Service] ${requestId}: Direct JSON parsing failed, attempting extraction...`)
      
      try {
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          parsedResponse = JSON.parse(jsonMatch[0])
        } else {
          throw new Error('No JSON object found in response')
        }
      } catch (extractError) {
        console.error(`[AI Weekly Service] ${requestId}: JSON extraction failed:`, extractError)
        throw new Error(`AI generated invalid JSON format. Response: "${aiResponse.substring(0, 200)}..."`)
      }
    }

    // 8. VALIDATE WEEKLY PLAN STRUCTURE
    if (!parsedResponse.overview || !Array.isArray(parsedResponse.days) || parsedResponse.days.length !== 7) {
      console.error(`[AI Weekly Service] ${requestId}: Invalid weekly plan structure:`, {
        hasOverview: !!parsedResponse.overview,
        hasDays: Array.isArray(parsedResponse.days),
        daysLength: parsedResponse.days?.length
      })
      throw new Error('Invalid weekly plan structure - must contain overview and 7 days')
    }

    // 9. SAVE WEEKLY PLAN TO DATABASE
    try {
      const { error: saveError } = await supabase
        .from('weekly_plans')
        .insert({
          user_id: user.id,
          plan_data: parsedResponse,
          preferences: preferences,
          created_at: new Date().toISOString()
        })

      if (saveError) {
        console.error(`[AI Weekly Service] ${requestId}: Failed to save plan:`, saveError)
        // Continue anyway - don't fail the request if saving fails
      }
    } catch (saveError) {
      console.error(`[AI Weekly Service] ${requestId}: Error saving plan:`, saveError)
      // Continue anyway
    }

    // 10. INCREMENT WEEKLY QUOTA
    try {
      await supabase.rpc('increment_weekly_quota', { p_user_id: user.id })
    } catch {
      // Ignore quota increment errors (non-blocking)
    }

    // 11. SUCCESS RESPONSE
    const responseTime = Date.now() - startTime
    console.log(`[AI Weekly Service] ${requestId}: Success in ${responseTime}ms`)

    const finalResponse: EdgeFunctionResponse = {
      success: true,
      data: parsedResponse,
      requestId
    }

    return new Response(JSON.stringify(finalResponse), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    })

  } catch (error: any) {
    const responseTime = Date.now() - startTime
    console.error(`[AI Weekly Service] ${requestId}: Error in ${responseTime}ms:`, error.message)

    return new Response(JSON.stringify({
      error: error.message || 'Internal server error',
      requestId,
      timestamp: new Date().toISOString()
    }), {
      status: error.message.includes('limit reached') ? 429 : 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    })
  }
})

// =============================================================================
// WEEKLY PLAN PROMPT BUILDING
// =============================================================================

function buildWeeklyPlanPrompts(preferences: WeeklyPlanPreferences) {
  const systemPrompt = buildWeeklySystemPrompt()
  const userPrompt = buildWeeklyUserPrompt(preferences)
  return { systemPrompt, userPrompt }
}

function buildWeeklySystemPrompt(): string {
  return `You are a professional nutritionist and meal planning expert with expertise in USDA dietary guidelines.

Your task: Generate a complete 7-day meal plan as valid JSON only.

Guidelines:
- Create balanced, varied meals across the week
- Follow USDA dietary guidelines for nutrition
- Ensure each day meets caloric and protein targets
- Provide variety in cuisines and cooking methods
- Consider meal prep efficiency where possible
- Include accurate nutritional information

CRITICAL: You MUST respond with ONLY valid JSON. No explanations, no text before or after the JSON.

Required JSON structure:
{
  "overview": {
    "avgCalories": 1850,
    "avgProtein": 125,
    "estimatedCost": 85
  },
  "days": [
    {
      "dayName": "Monday",
      "meals": [
        {
          "name": "Oatmeal Bowl",
          "calories": 320,
          "type": "breakfast",
          "nutrition": {
            "protein": 12,
            "carbs": 45,
            "fat": 8
          }
        }
      ],
      "totalCalories": 1850,
      "totalProtein": 125
    }
  ],
  "tips": ["Prep vegetables on Sunday for the week"],
  "notes": ["All meals can be scaled for different portion sizes"]
}

Days must be: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday
Meal types: breakfast, lunch, dinner, snack
Return ONLY the JSON object.`
}

function buildWeeklyUserPrompt(preferences: WeeklyPlanPreferences): string {
  const calories = preferences.calories || preferences.profileCalories || 1800
  const protein = preferences.protein || preferences.profileProtein || 60
  
  return `Generate a 7-day meal plan with these requirements:

Goal: ${preferences.goal}
Meals to include: ${preferences.meals.join(', ')}
Cuisine preferences: ${preferences.cuisines.length > 0 ? preferences.cuisines.join(', ') : 'Any'}
Plan focus: ${preferences.planFocus}
Daily calories target: ${calories}
Daily protein target: ${protein}g
${preferences.dietaryRestrictions?.length ? `Dietary restrictions: ${preferences.dietaryRestrictions.join(', ')}` : ''}
${preferences.allergies?.length ? `Allergies to avoid: ${preferences.allergies.join(', ')}` : ''}

Create varied, balanced meals for each day. Ensure nutritional targets are met.
Return ONLY the JSON object with the complete 7-day plan.`
} 