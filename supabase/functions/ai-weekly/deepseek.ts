/**
 * DeepSeek Provider for Weekly Meal Plans
 */

export async function callDeepSeekWeeklyPlan(systemPrompt: string, userPrompt: string): Promise<string> {
  const apiKey = Deno.env.get('DEEPSEEK_API_KEY')
  if (!apiKey) {
    throw new Error('DEEPSEEK_API_KEY not configured')
  }

  console.log('[DeepSeek WeeklyPlan] Request details:', {
    systemPromptLength: systemPrompt.length,
    userPromptLength: userPrompt.length,
    systemPromptPreview: systemPrompt.substring(0, 200) + '...',
    userPromptPreview: userPrompt.substring(0, 200) + '...'
  })

  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'User-Agent': 'MealAdvisor-WeeklyPlan/1.0'
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 4000, // Increased for weekly plan complexity
      top_p: 0.9
    })
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(`DeepSeek API error: ${response.status} ${errorData?.error?.message || response.statusText}`)
  }

  const data = await response.json()
  const content = data.choices[0].message.content
  
  console.log('[DeepSeek WeeklyPlan] Response details:', {
    contentLength: content.length,
    contentPreview: content.substring(0, 300) + (content.length > 300 ? '...' : ''),
    tokensUsed: data.usage?.total_tokens || 'unknown'
  })
  
  return content
} 