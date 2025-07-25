// TODO: Response validation for AI service Edge Function
// This file will contain functions to validate AI provider responses
// and ensure they meet our quality and safety standards

const isDev = Deno.env.get('ENV') === 'development'

export function validateAIResponse(response: any): { isValid: boolean; errors?: string[] } {
  if (isDev) {
    console.log('[DEV-LOG] Starting AI response validation...')
    console.log('[DEV-LOG] - Response type:', typeof response)
    console.log('[DEV-LOG] - Response is object:', typeof response === 'object')
    console.log('[DEV-LOG] - Response keys:', response ? Object.keys(response) : 'null/undefined')
  }

  const errors: string[] = []

  // Basic structure validation
  if (!response || typeof response !== 'object') {
    const error = 'Response must be a valid object'
    errors.push(error)
    if (isDev) console.log('[DEV-LOG] Validation error:', error)
    return { isValid: false, errors }
  }

  // Check for required fields
  if (!response.choices || !Array.isArray(response.choices)) {
    const error = 'Response must contain choices array'
    errors.push(error)
    if (isDev) console.log('[DEV-LOG] Validation error:', error)
  } else {
    if (isDev) {
      console.log('[DEV-LOG] - Choices array found, length:', response.choices.length)
    }
  }

  if (response.choices && response.choices.length > 0) {
    const choice = response.choices[0]
    if (!choice.message || !choice.message.content) {
      const error = 'Response must contain valid message content'
      errors.push(error)
      if (isDev) console.log('[DEV-LOG] Validation error:', error)
    } else {
      if (isDev) {
        console.log('[DEV-LOG] - Message content found, length:', choice.message.content.length)
        console.log('[DEV-LOG] - Content preview:', choice.message.content.substring(0, 100) + '...')
      }
    }
  }

  // Check for usage information
  if (!response.usage || typeof response.usage !== 'object') {
    const error = 'Response must contain usage information'
    errors.push(error)
    if (isDev) console.log('[DEV-LOG] Validation error:', error)
  } else {
    if (isDev) {
      console.log('[DEV-LOG] - Usage info found:', response.usage)
    }
  }

  // Content safety checks
  if (response.choices && response.choices.length > 0) {
    const content = response.choices[0].message?.content || ''
    
    if (isDev) {
      console.log('[DEV-LOG] Performing content safety checks...')
      console.log('[DEV-LOG] - Content length:', content.length)
    }
    
    // Check for potentially harmful content
    const harmfulPatterns = [
      /harmful|dangerous|unsafe/i,
      /illegal|unlawful/i,
      /inappropriate|offensive/i
    ]

    for (const pattern of harmfulPatterns) {
      if (pattern.test(content)) {
        const error = 'Response contains potentially inappropriate content'
        errors.push(error)
        if (isDev) console.log('[DEV-LOG] Validation error:', error, '- Pattern matched:', pattern.source)
        break
      }
    }

    // Check content length
    if (content.length > 10000) {
      const error = 'Response content is too long'
      errors.push(error)
      if (isDev) console.log('[DEV-LOG] Validation error:', error, '- Length:', content.length)
    }
  }

  const result = { 
    isValid: errors.length === 0, 
    ...(errors.length > 0 && { errors })
  }

  if (isDev) {
    console.log('[DEV-LOG] AI response validation completed:')
    console.log('[DEV-LOG] - Is valid:', result.isValid)
    console.log('[DEV-LOG] - Error count:', errors.length)
    if (errors.length > 0) {
      console.log('[DEV-LOG] - Errors:', errors)
    }
  }

  return result
}

export function validateQuickMealResponse(response: any): { isValid: boolean; errors?: string[] } {
  if (isDev) {
    console.log('[DEV-LOG] Starting QuickMeal response validation...')
  }

  // First validate basic AI response structure
  const basicValidation = validateAIResponse(response)
  if (!basicValidation.isValid) {
    if (isDev) console.log('[DEV-LOG] QuickMeal validation failed at basic validation step')
    return basicValidation
  }

  // Extract content for QuickMeal-specific validation
  const content = response.choices?.[0]?.message?.content || ''
  
  if (isDev) {
    console.log('[DEV-LOG] QuickMeal content validation:')
    console.log('[DEV-LOG] - Content length:', content.length)
    console.log('[DEV-LOG] - Content preview:', content.substring(0, 200) + '...')
  }
  
  try {
    // Try to parse as JSON for structured responses
    const parsedContent = JSON.parse(content)
    
    if (isDev) {
      console.log('[DEV-LOG] Content parsed as JSON successfully')
      console.log('[DEV-LOG] - Parsed keys:', Object.keys(parsedContent))
    }
    
    // Validate QuickMeal-specific structure
    if (!parsedContent.suggestions || !Array.isArray(parsedContent.suggestions)) {
      const error = 'QuickMeal response must contain suggestions array'
      if (isDev) console.log('[DEV-LOG] QuickMeal validation error:', error)
      return { isValid: false, errors: [error] }
    }

    if (isDev) {
      console.log('[DEV-LOG] - Suggestions array found, length:', parsedContent.suggestions.length)
    }

    if (parsedContent.suggestions && parsedContent.suggestions.length > 0) {
      // Validate each suggestion
      for (let i = 0; i < parsedContent.suggestions.length; i++) {
        const suggestion = parsedContent.suggestions[i]
        if (!suggestion.name || !suggestion.ingredients) {
          const error = `Suggestion ${i + 1} must have name and ingredients`
          if (isDev) console.log('[DEV-LOG] QuickMeal validation error:', error)
          return { isValid: false, errors: [error] }
        }
        
        if (isDev) {
          console.log('[DEV-LOG] - Suggestion', i + 1, 'validated:', {
            hasName: !!suggestion.name,
            hasIngredients: !!suggestion.ingredients,
            nameLength: suggestion.name?.length,
            ingredientsCount: Array.isArray(suggestion.ingredients) ? suggestion.ingredients.length : 'not array'
          })
        }
      }
    }

  } catch (parseError) {
    if (isDev) {
      console.log('[DEV-LOG] Content is not JSON, validating as text response...')
      console.log('[DEV-LOG] - Parse error:', parseError)
    }
    
    // If not JSON, validate as text response
    if (!content.includes('recipe') && !content.includes('ingredient')) {
      const error = 'QuickMeal response must contain recipe or meal information'
      if (isDev) console.log('[DEV-LOG] QuickMeal validation error:', error)
      return { isValid: false, errors: [error] }
    }
    
    if (isDev) {
      console.log('[DEV-LOG] Text response validation passed')
    }
  }

  if (isDev) {
    console.log('[DEV-LOG] QuickMeal response validation completed successfully')
  }

  return { isValid: true }
}

// TODO: Add more validation functions for different AI service types 