/**
 * Simple DeepSeek Provider - 30 lines vs 477 lines
 */

export async function callDeepSeek(systemPrompt: string, userPrompt: string): Promise<string> {
  const apiKey = Deno.env.get('DEEPSEEK_API_KEY')
  if (!apiKey) {
    throw new Error('DEEPSEEK_API_KEY not configured')
  }

  console.log('[DeepSeek] Request details:', {
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
      'User-Agent': 'MealAdvisor/1.0'
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 2000,
      top_p: 0.9
    })
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(`DeepSeek API error: ${response.status} ${errorData?.error?.message || response.statusText}`)
  }

  const data = await response.json()
  const content = data.choices[0].message.content
  
  console.log('[DeepSeek] Response details:', {
    contentLength: content.length,
    contentPreview: content.substring(0, 300) + (content.length > 300 ? '...' : ''),
    tokensUsed: data.usage?.total_tokens || 'unknown'
  })
  
  return content
} 