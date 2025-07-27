# Extracted Prompt Logic - PRESERVE THIS
## Critical logic extracted from prompt-builder.ts that must be embedded in simplified main handler

## System Prompt Structure (PRESERVE EXACTLY)
```typescript
function buildSystemPrompt(): string {
  const baseSystemPrompt = `You are a professional nutritionist and dietitian with expertise in USDA dietary guidelines and nutritional science. Your role is to provide evidence-based meal recommendations that prioritize health, nutrition balance, and safety.

For every meal recommendation:
1. Reference USDA dietary guidelines when applicable
2. Provide accurate macronutrient information (calories, protein, carbs, fat)
3. Include complete ingredient lists with specific quantities
4. Provide step-by-step cooking instructions
5. Specify preparation time and estimated cost
6. Consider dietary restrictions and preferences carefully
7. Ensure recommendations are nutritionally balanced
8. Include serving size information

Always respond with a single meal recommendation in the specified JSON format. Focus on practical, achievable recipes that promote good nutrition and are appropriate for the user's stated preferences and dietary requirements.`

  const outputInstructions = `CRITICAL: Return your response in valid JSON format using this exact structure:

{
  "name": "Exact recipe name",
  "description": "Brief appetizing description (2-3 sentences)",
  "ingredients": [
    {
      "item": "ingredient name",
      "amount": "quantity with unit",
      "category": "protein|vegetable|grain|dairy|spice|other"
    }
  ],
  "instructions": [
    "Step 1: Detailed cooking instruction",
    "Step 2: Next instruction with timing",
    "Continue with all steps..."
  ],
  "nutrition": {
    "calories": 450,
    "protein": 28,
    "carbs": 42,
    "fat": 16,
    "fiber": 8,
    "sugar": 12,
    "sodium": 680
  },
  "timing": {
    "prepTime": "10 minutes",
    "cookTime": "15 minutes",
    "totalTime": "25 minutes"
  },
  "difficulty": "easy|medium|hard",
  "servings": 4,
  "cost": {
    "perServing": "$$",
    "total": "$$$$",
    "breakdown": "Brief cost explanation"
  },
  "tips": [
    "Helpful cooking tip 1",
    "Storage or leftover tip 2"
  ],
  "substitutions": [
    {
      "original": "ingredient name",
      "alternatives": ["alternative 1", "alternative 2"],
      "reason": "dietary/availability reason"
    }
  ],
  "tags": ["quick", "healthy", "vegetarian", "etc"]
}`

  return `${baseSystemPrompt}

**RESPONSE FORMAT REQUIREMENTS:**
${outputInstructions}

**IMPORTANT GUIDELINES:**
- Always provide exactly ONE meal/recipe suggestion
- Include complete nutritional information based on USDA data
- Ensure all measurements are precise and realistic
- Include practical cooking tips and alternatives
- Consider dietary restrictions and allergies carefully
- Provide accurate time estimates for preparation and cooking
- Include cost-effective ingredient suggestions when possible

**OUTPUT QUALITY STANDARDS:**
- Use clear, actionable language in instructions
- Provide realistic serving sizes and portions
- Include helpful cooking techniques and tips
- Suggest ingredient substitutions for accessibility
- Ensure nutritional information is accurate and complete`
}
```

## User Prompt Structure (PRESERVE LOGIC)
```typescript
function buildUserPrompt(preferences: QuickMealPreferences): string {
  return `Create a quick meal suggestion based on these specific requirements:

**MEAL REQUIREMENTS:**
- Servings: ${preferences.servings} people
- Maximum prep time: ${preferences.prepTime} minutes
- Dietary preference: ${formatDiet(preferences.diet)}
- Cuisine type: ${formatCuisine(preferences.cuisine)}
- Current mood/craving: ${formatMood(preferences.mood)}
- Budget level: ${formatBudget(preferences.budget)}

**ADDITIONAL PREFERENCES:**
${buildAdditionalPreferences(preferences)}

**COOKING CONTEXT:**
- Available cooking time: ${preferences.prepTime} minutes
- Skill level preference: ${getSkillLevelFromTime(preferences.prepTime)}
- Equipment available: ${buildEquipmentString(preferences)}

Please create ONE complete meal suggestion that perfectly matches these requirements.`
}
```

## Helper Functions (PRESERVE)
```typescript
function formatDiet(diet: string): string {
  const dietMap: Record<string, string> = {
    'any': 'no specific dietary restrictions',
    'vegetarian': 'vegetarian (no meat, poultry, or fish)',
    'vegan': 'vegan (no animal products)',
    'pescatarian': 'pescatarian (fish and seafood allowed, no meat or poultry)',
    'keto': 'ketogenic (very low carb, high fat)',
    'paleo': 'paleo (no grains, legumes, or processed foods)',
    'gluten-free': 'gluten-free (no wheat, barley, rye)',
    'dairy-free': 'dairy-free (no milk products)'
  }
  return dietMap[diet] || diet
}

function formatCuisine(cuisine: string): string {
  const cuisineMap: Record<string, string> = {
    'any': 'any cuisine style',
    'italian': 'Italian cuisine',
    'mexican': 'Mexican cuisine',
    'asian': 'Asian cuisine (Chinese, Japanese, Thai, etc.)',
    'indian': 'Indian cuisine',
    'mediterranean': 'Mediterranean cuisine',
    'american': 'American cuisine',
    'french': 'French cuisine'
  }
  return cuisineMap[cuisine] || cuisine
}

function formatMood(mood: string): string {
  const moodMap: Record<string, string> = {
    'any': 'no specific mood preference',
    'comfort': 'comfort food (hearty, satisfying)',
    'light': 'light and fresh (healthy, not heavy)',
    'spicy': 'spicy and bold flavors',
    'sweet': 'sweet or dessert-like',
    'savory': 'savory and umami-rich',
    'exotic': 'exotic and adventurous flavors'
  }
  return moodMap[mood] || mood
}

function formatBudget(budget: string): string {
  const budgetMap: Record<string, string> = {
    '$': 'very budget-friendly',
    '$$': 'moderate budget',
    '$$$': 'higher budget (premium ingredients welcome)',
    '$$$$': 'luxury budget (finest ingredients)'
  }
  return budgetMap[budget] || budget
}

function buildAdditionalPreferences(preferences: QuickMealPreferences): string {
  const additionalPrefs: string[] = []
  const prepTimeNum = parseInt(preferences.prepTime)
  
  if (preferences.diet !== 'any') {
    additionalPrefs.push(`- Must be ${preferences.diet} compliant`)
  }
  
  if (preferences.cuisine !== 'any') {
    additionalPrefs.push(`- Authentic ${preferences.cuisine} flavors preferred`)
  }
  
  if (preferences.mood !== 'any') {
    additionalPrefs.push(`- Matches "${preferences.mood}" mood/craving`)
  }
  
  if (preferences.budget !== '$$') {
    const budgetText = getBudgetDescription(preferences.budget)
    additionalPrefs.push(`- ${budgetText} ingredients preferred`)
  }
  
  if (prepTimeNum <= 15) {
    additionalPrefs.push('- Quick and simple preparation essential')
  } else if (prepTimeNum <= 30) {
    additionalPrefs.push('- Moderate preparation time acceptable')
  }
  
  return additionalPrefs.length > 0 ? additionalPrefs.join('\n') : '- No specific additional preferences'
}

function buildEquipmentString(preferences: QuickMealPreferences): string {
  const prepTimeNum = parseInt(preferences.prepTime)
  
  if (prepTimeNum <= 15) {
    return 'Basic kitchen tools (minimal equipment preferred)'
  } else if (prepTimeNum <= 30) {
    return 'Standard kitchen equipment (stovetop, basic tools)'
  } else {
    return 'Full kitchen equipment available'
  }
}

function getSkillLevelFromTime(prepTime: string): string {
  const time = parseInt(prepTime)
  if (time <= 15) return 'beginner'
  if (time <= 30) return 'intermediate'
  return 'advanced'
}

function getBudgetDescription(budget: string): string {
  const descriptions: Record<string, string> = {
    '$': 'Budget-friendly and economical',
    '$$': 'Reasonably priced',
    '$$$': 'Premium quality',
    '$$$$': 'Luxury and gourmet'
  }
  return descriptions[budget] || 'Moderate budget'
}
```

## DeepSeek API Call Logic (PRESERVE)
```typescript
async function callDeepSeek(systemPrompt: string, userPrompt: string): Promise<string> {
  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${Deno.env.get('DEEPSEEK_API_KEY')}`,
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
  return data.choices[0].message.content
}
```

## Integration Pattern for Simplified Handler
```typescript
// In new simplified index.ts
function buildPrompts(preferences: QuickMealPreferences) {
  const systemPrompt = buildSystemPrompt() // From above
  const userPrompt = buildUserPrompt(preferences) // From above
  return { systemPrompt, userPrompt }
}

// Usage in main handler
const { systemPrompt, userPrompt } = buildPrompts(aiServiceRequest.preferences)
const aiResponse = await callDeepSeek(systemPrompt, userPrompt)
```

**CRITICAL**: This logic must be embedded exactly as-is in the simplified main handler to preserve the system/user prompt separation architecture. 