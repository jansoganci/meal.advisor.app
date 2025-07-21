import type { AIServiceConfig, PromptTemplate } from './types'

// AI service configuration
export const AI_CONFIG: AIServiceConfig = {
  providers: {
    deepseek: {
      name: 'DeepSeek',
      model: process.env.EXPO_PUBLIC_DEEPSEEK_MODEL || 'deepseek-chat',
      apiKey: process.env.EXPO_PUBLIC_DEEPSEEK_API_KEY || '',
      baseUrl: process.env.EXPO_PUBLIC_DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1',
      maxTokens: parseInt(process.env.EXPO_PUBLIC_DEEPSEEK_MAX_TOKENS || '4000'),
      temperature: parseFloat(process.env.EXPO_PUBLIC_DEEPSEEK_TEMPERATURE || '0.7'),
      topP: parseFloat(process.env.EXPO_PUBLIC_DEEPSEEK_TOP_P || '0.9')
    },
    gemini: {
      name: 'Gemini',
      model: process.env.EXPO_PUBLIC_GEMINI_MODEL || 'gemini-pro',
      apiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY || '',
      baseUrl: process.env.EXPO_PUBLIC_GEMINI_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta',
      maxTokens: parseInt(process.env.EXPO_PUBLIC_GEMINI_MAX_TOKENS || '4000'),
      temperature: parseFloat(process.env.EXPO_PUBLIC_GEMINI_TEMPERATURE || '0.7'),
      topP: parseFloat(process.env.EXPO_PUBLIC_GEMINI_TOP_P || '0.9')
    }
  },
  defaultProvider: process.env.EXPO_PUBLIC_AI_DEFAULT_PROVIDER || 'deepseek',
  fallbackProvider: process.env.EXPO_PUBLIC_AI_FALLBACK_PROVIDER || 'gemini',
  rateLimits: {
    requestsPerMinute: parseInt(process.env.EXPO_PUBLIC_AI_REQUESTS_PER_MINUTE || '10'),
    requestsPerHour: parseInt(process.env.EXPO_PUBLIC_AI_REQUESTS_PER_HOUR || '100'),
    requestsPerDay: parseInt(process.env.EXPO_PUBLIC_AI_REQUESTS_PER_DAY || '500')
  },
  costLimits: {
    maxCostPerRequest: parseFloat(process.env.EXPO_PUBLIC_AI_MAX_COST_PER_REQUEST || '0.50'),
    maxCostPerUser: parseFloat(process.env.EXPO_PUBLIC_AI_MAX_COST_PER_USER || '10.00'),
    maxCostPerDay: parseFloat(process.env.EXPO_PUBLIC_AI_MAX_COST_PER_DAY || '100.00')
  },
  timeouts: {
    requestTimeout: parseInt(process.env.EXPO_PUBLIC_AI_REQUEST_TIMEOUT || '30000'),
    retryDelay: parseInt(process.env.EXPO_PUBLIC_AI_RETRY_DELAY || '2000'),
    maxRetries: parseInt(process.env.EXPO_PUBLIC_AI_MAX_RETRIES || '3')
  },
  caching: {
    enabled: process.env.EXPO_PUBLIC_AI_CACHE_ENABLED === 'true',
    ttl: parseInt(process.env.EXPO_PUBLIC_AI_CACHE_TTL || '3600000'),
    maxSize: parseInt(process.env.EXPO_PUBLIC_AI_CACHE_MAX_SIZE || '1000')
  }
}

// Prompt templates for different use cases
export const PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    id: 'recipe-generation',
    name: 'Recipe Generation',
    description: 'Generate a detailed recipe based on user preferences',
    template: `Create a detailed recipe with the following requirements:

Meal Type: {mealType}
Cuisine: {cuisineType}
Servings: {servings}
Max Cooking Time: {maxCookingTime} minutes
Difficulty: {difficulty}
Dietary Restrictions: {dietaryRestrictions}
Allergies to Avoid: {allergies}

{customPrompt}

Please provide a complete recipe in the following JSON format:
{
  "title": "Recipe Name",
  "description": "Brief description",
  "cuisineType": "cuisine type",
  "mealType": ["meal type"],
  "difficultyLevel": "easy/medium/hard",
  "prepTimeMinutes": number,
  "cookTimeMinutes": number,
  "servings": number,
  "calories": number,
  "nutrition": {
    "protein": number,
    "carbs": number,
    "fat": number,
    "fiber": number,
    "sugar": number,
    "sodium": number
  },
  "ingredients": [
    {
      "name": "ingredient name",
      "amount": number,
      "unit": "unit",
      "notes": "optional notes"
    }
  ],
  "instructions": [
    {
      "step": number,
      "instruction": "detailed instruction",
      "durationMinutes": number
    }
  ],
  "equipment": ["equipment list"],
  "dietaryTags": ["dietary tags"],
  "allergenInfo": ["allergen info"],
  "spiceLevel": "mild/medium/hot/very-hot",
  "tips": ["helpful tips"],
  "variations": ["possible variations"]
}

Make sure all nutrition values are realistic and the recipe is practical to make.`,
    variables: ['mealType', 'cuisineType', 'servings', 'maxCookingTime', 'difficulty', 'dietaryRestrictions', 'allergies', 'customPrompt'],
    category: 'recipe',
    version: '1.0'
  },
  {
    id: 'meal-plan-generation',
    name: 'Meal Plan Generation',
    description: 'Generate a comprehensive meal plan',
    template: `Create a detailed meal plan with the following requirements:

User Profile:
- Activity Level: {activityLevel}
- Primary Goal: {primaryGoal}
- Daily Calories: {dailyCalories}
- Macro Targets: {macroTargets}

Plan Details:
- Start Date: {startDate}
- End Date: {endDate}
- Meals Per Day: {mealsPerDay}
- Cooking Time Preference: {cookingTimePreference}
- Difficulty Preference: {difficultyPreference}

Dietary Preferences:
- Dietary Restrictions: {dietaryRestrictions}
- Cuisine Preferences: {cuisinePreferences}
- Allergies: {allergies}
- Disliked Foods: {dislikedFoods}

Custom Requests: {customRequests}

Please provide a complete meal plan in the following JSON format:
{
  "title": "Meal Plan Name",
  "description": "Brief description",
  "planType": "weekly/monthly",
  "totalCalories": number,
  "averageDailyCalories": number,
  "macroBreakdown": {
    "protein": number,
    "carbs": number,
    "fat": number
  },
  "days": [
    {
      "date": "YYYY-MM-DD",
      "dayName": "Monday",
      "meals": [
        {
          "mealType": "breakfast/lunch/dinner/snack",
          "recipe": {recipe object},
          "alternativeRecipes": [optional alternatives]
        }
      ],
      "dailyTotals": {
        "calories": number,
        "protein": number,
        "carbs": number,
        "fat": number
      }
    }
  ],
  "shoppingList": [
    {
      "name": "ingredient name",
      "quantity": number,
      "unit": "unit",
      "category": "produce/dairy/meat/etc"
    }
  ],
  "notes": ["helpful notes"],
  "estimatedCost": number
}

Ensure all recipes are balanced, nutritious, and align with the user's goals and preferences.`,
    variables: ['activityLevel', 'primaryGoal', 'dailyCalories', 'macroTargets', 'startDate', 'endDate', 'mealsPerDay', 'cookingTimePreference', 'difficultyPreference', 'dietaryRestrictions', 'cuisinePreferences', 'allergies', 'dislikedFoods', 'customRequests'],
    category: 'meal-plan',
    version: '1.0'
  },
  {
    id: 'nutrition-analysis',
    name: 'Nutrition Analysis',
    description: 'Analyze nutrition content of a meal or recipe',
    template: `Analyze the nutrition content of the following meal/recipe:

Recipe/Meal: {recipeContent}
Serving Size: {servingSize}

Please provide a detailed nutrition analysis in the following JSON format:
{
  "calories": number,
  "macronutrients": {
    "protein": {"grams": number, "calories": number, "percentage": number},
    "carbohydrates": {"grams": number, "calories": number, "percentage": number},
    "fat": {"grams": number, "calories": number, "percentage": number}
  },
  "micronutrients": {
    "fiber": number,
    "sugar": number,
    "sodium": number,
    "cholesterol": number,
    "vitaminA": number,
    "vitaminC": number,
    "calcium": number,
    "iron": number
  },
  "healthScore": number,
  "dietaryTags": ["healthy", "balanced", etc.],
  "healthBenefits": ["benefit 1", "benefit 2"],
  "recommendations": ["recommendation 1", "recommendation 2"]
}

Provide accurate nutritional information and helpful health insights.`,
    variables: ['recipeContent', 'servingSize'],
    category: 'nutrition',
    version: '1.0'
  },
  {
    id: 'ingredient-substitution',
    name: 'Ingredient Substitution',
    description: 'Suggest ingredient substitutions',
    template: `Suggest substitutions for the following ingredient:

Original Ingredient: {originalIngredient}
Recipe Context: {recipeContext}
Dietary Restrictions: {dietaryRestrictions}
Allergies: {allergies}
Reason for Substitution: {reason}

Please provide substitution suggestions in the following JSON format:
{
  "originalIngredient": "ingredient name",
  "substitutions": [
    {
      "substitute": "substitute name",
      "ratio": "substitution ratio",
      "notes": "any special notes",
      "impact": "flavor/texture impact",
      "availability": "common/uncommon",
      "cost": "cheaper/similar/more expensive"
    }
  ],
  "bestSubstitute": "recommended substitute",
  "tips": ["helpful tips"],
  "warnings": ["any warnings or considerations"]
}

Provide practical and accessible substitution options.`,
    variables: ['originalIngredient', 'recipeContext', 'dietaryRestrictions', 'allergies', 'reason'],
    category: 'substitution',
    version: '1.0'
  },
  {
    id: 'quick-meal-suggestion',
    name: 'Quick Meal Suggestion',
    description: 'Suggest quick meal ideas',
    template: `Suggest quick meal ideas with the following criteria:

Available Ingredients: {availableIngredients}
Time Available: {timeAvailable} minutes
Meal Type: {mealType}
Dietary Restrictions: {dietaryRestrictions}
Cooking Equipment: {cookingEquipment}
Skill Level: {skillLevel}

Please provide quick meal suggestions in the following JSON format:
{
  "suggestions": [
    {
      "title": "Meal Name",
      "description": "Brief description",
      "totalTime": number,
      "difficulty": "easy/medium/hard",
      "ingredients": ["ingredient list"],
      "quickInstructions": ["step 1", "step 2", "step 3"],
      "calories": number,
      "tags": ["quick", "healthy", etc.]
    }
  ],
  "tips": ["time-saving tips"],
  "mealPrepIdeas": ["prep suggestions"]
}

Focus on practical, quick, and satisfying meal options.`,
    variables: ['availableIngredients', 'timeAvailable', 'mealType', 'dietaryRestrictions', 'cookingEquipment', 'skillLevel'],
    category: 'recipe',
    version: '1.0'
  }
]

// Cost calculation constants
export const COST_RATES = {
  deepseek: {
    inputTokens: parseFloat(process.env.EXPO_PUBLIC_DEEPSEEK_INPUT_TOKEN_COST || '0.0000014'),
    outputTokens: parseFloat(process.env.EXPO_PUBLIC_DEEPSEEK_OUTPUT_TOKEN_COST || '0.0000028')
  },
  gemini: {
    inputTokens: parseFloat(process.env.EXPO_PUBLIC_GEMINI_INPUT_TOKEN_COST || '0.0000010'),
    outputTokens: parseFloat(process.env.EXPO_PUBLIC_GEMINI_OUTPUT_TOKEN_COST || '0.0000020')
  }
}

// Error codes and messages
export const AI_ERROR_CODES = {
  INVALID_API_KEY: 'Invalid API key',
  RATE_LIMIT_EXCEEDED: 'Rate limit exceeded',
  QUOTA_EXCEEDED: 'Quota exceeded',
  TIMEOUT: 'Request timeout',
  INVALID_REQUEST: 'Invalid request',
  SERVICE_UNAVAILABLE: 'Service unavailable',
  PARSING_ERROR: 'Response parsing error',
  VALIDATION_ERROR: 'Response validation error',
  COST_LIMIT_EXCEEDED: 'Cost limit exceeded',
  NETWORK_ERROR: 'Network error'
}

// Default fallback responses
export const FALLBACK_RESPONSES = {
  recipe: {
    title: 'Simple Pasta with Garlic',
    description: 'A quick and easy pasta dish',
    cuisineType: 'italian',
    mealType: ['lunch', 'dinner'],
    difficultyLevel: 'easy',
    prepTimeMinutes: 5,
    cookTimeMinutes: 15,
    servings: 2,
    calories: 400,
    nutrition: {
      protein: 12,
      carbs: 60,
      fat: 15,
      fiber: 3,
      sugar: 3,
      sodium: 400
    },
    ingredients: [
      { name: 'Pasta', amount: 200, unit: 'grams', notes: 'Any type' },
      { name: 'Garlic', amount: 2, unit: 'cloves', notes: 'Minced' },
      { name: 'Olive oil', amount: 2, unit: 'tablespoons', notes: 'Extra virgin' }
    ],
    instructions: [
      { step: 1, instruction: 'Cook pasta according to package directions', durationMinutes: 10 },
      { step: 2, instruction: 'Heat olive oil and sauté garlic', durationMinutes: 2 },
      { step: 3, instruction: 'Toss pasta with garlic oil', durationMinutes: 1 }
    ],
    equipment: ['pot', 'pan', 'colander'],
    dietaryTags: ['vegetarian'],
    allergenInfo: ['gluten'],
    spiceLevel: 'mild',
    tips: ['Don\'t burn the garlic'],
    variations: ['Add vegetables', 'Use different pasta shapes']
  },
  mealPlan: {
    title: 'Basic Weekly Meal Plan',
    description: 'A simple and balanced weekly meal plan',
    planType: 'weekly',
    totalCalories: 14000,
    averageDailyCalories: 2000,
    macroBreakdown: {
      protein: 25,
      carbs: 45,
      fat: 30
    },
    days: [],
    shoppingList: [],
    notes: ['This is a fallback meal plan. Please try again for a personalized plan.'],
    estimatedCost: 50
  }
}

// Validation schemas
export const VALIDATION_SCHEMAS = {
  recipe: {
    required: ['title', 'instructions', 'ingredients', 'servings'],
    properties: {
      title: { type: 'string', minLength: 3, maxLength: 200 },
      servings: { type: 'number', minimum: 1, maximum: 20 },
      calories: { type: 'number', minimum: 0, maximum: 5000 },
      ingredients: {
        type: 'array',
        minItems: 1,
        maxItems: 50,
        items: {
          type: 'object',
          required: ['name', 'amount', 'unit'],
          properties: {
            name: { type: 'string', minLength: 1, maxLength: 100 },
            amount: { type: 'number', minimum: 0 },
            unit: { type: 'string', minLength: 1, maxLength: 20 }
          }
        }
      },
      instructions: {
        type: 'array',
        minItems: 1,
        maxItems: 30,
        items: {
          type: 'object',
          required: ['step', 'instruction'],
          properties: {
            step: { type: 'number', minimum: 1 },
            instruction: { type: 'string', minLength: 10, maxLength: 500 }
          }
        }
      }
    }
  },
  mealPlan: {
    required: ['title', 'days', 'planType'],
    properties: {
      title: { type: 'string', minLength: 3, maxLength: 100 },
      planType: { type: 'string', enum: ['weekly', 'monthly'] },
      days: {
        type: 'array',
        minItems: 1,
        maxItems: 31,
        items: {
          type: 'object',
          required: ['date', 'dayName', 'meals'],
          properties: {
            date: { type: 'string', pattern: '^\\d{4}-\\d{2}-\\d{2}$' },
            dayName: { type: 'string' },
            meals: {
              type: 'array',
              minItems: 1,
              maxItems: 6
            }
          }
        }
      }
    }
  }
}