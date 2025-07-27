// QuickMeal Input Validation and Sanitization

export interface ValidationError {
  field: string;
  message: string;
}

export interface QuickMealValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  sanitizedData?: any;
}

// Valid values for each preference field
export const VALID_SERVINGS = [1, 2, 4];
export const VALID_PREP_TIMES = ['<30', '30-45', '45-60', '60+'];
export const VALID_DIETS = ['None', 'Vegetarian', 'Vegan', 'Keto', 'Paleo', 'Mediterranean', 'Low-Carb', 'Gluten-Free', 'Dairy-Free', 'Nut-Free', 'Low-Fat', 'Low-Sodium'];
export const VALID_CUISINES = ['Any', 'Italian', 'Mexican', 'Asian', 'Mediterranean', 'American', 'Indian', 'French', 'Thai', 'Greek', 'Chinese', 'Japanese', 'Korean'];
export const VALID_MOODS = ['Quick', 'Comfort', 'Healthy', 'Indulgent', 'Light', 'Spicy', 'Sweet', 'Savory'];
export const VALID_BUDGETS = ['$', '$$', '$$$', 'Any'];

// Sanitization functions
export const sanitizeString = (value: string): string => {
  if (typeof value !== 'string') return '';
  return value.trim().replace(/\s+/g, ' '); // Remove excess whitespace
};

export const sanitizeNumber = (value: any): number | null => {
  const num = Number(value);
  return isNaN(num) ? null : num;
};

export const sanitizeArray = (value: any): string[] => {
  if (!Array.isArray(value)) return [];
  return value
    .filter(item => typeof item === 'string')
    .map(item => sanitizeString(item))
    .filter(item => item.length > 0);
};

// Validation functions
export const validateServings = (value: any): ValidationError | null => {
  const num = sanitizeNumber(value);
  if (num === null) {
    return { field: 'servings', message: 'Please select a valid number of servings.' };
  }
  if (!VALID_SERVINGS.includes(num)) {
    return { field: 'servings', message: 'Please select 1, 2, or 4 servings.' };
  }
  return null;
};

export const validatePrepTime = (value: any): ValidationError | null => {
  const sanitized = sanitizeString(value);
  if (!sanitized) {
    return { field: 'prepTime', message: 'Please select a preparation time.' };
  }
  if (!VALID_PREP_TIMES.includes(sanitized)) {
    return { field: 'prepTime', message: 'Please select a valid preparation time.' };
  }
  return null;
};

export const validateDiet = (value: any): ValidationError | null => {
  const sanitized = sanitizeString(value);
  if (!sanitized) {
    return { field: 'diet', message: 'Please select a dietary preference.' };
  }
  if (!VALID_DIETS.includes(sanitized)) {
    return { field: 'diet', message: 'Please select a valid dietary preference.' };
  }
  return null;
};

export const validateCuisine = (value: any): ValidationError | null => {
  const sanitized = sanitizeString(value);
  if (!sanitized) {
    return { field: 'cuisine', message: 'Please select a cuisine preference.' };
  }
  if (!VALID_CUISINES.includes(sanitized)) {
    return { field: 'cuisine', message: 'Please select a valid cuisine preference.' };
  }
  return null;
};

export const validateMood = (value: any): ValidationError | null => {
  const sanitized = sanitizeString(value);
  if (!sanitized) {
    return { field: 'mood', message: 'Please select a mood preference.' };
  }
  if (!VALID_MOODS.includes(sanitized)) {
    return { field: 'mood', message: 'Please select a valid mood preference.' };
  }
  return null;
};

export const validateBudget = (value: any): ValidationError | null => {
  const sanitized = sanitizeString(value);
  if (!sanitized) {
    return { field: 'budget', message: 'Please select a budget preference.' };
  }
  if (!VALID_BUDGETS.includes(sanitized)) {
    return { field: 'budget', message: 'Please select a valid budget preference.' };
  }
  return null;
};

// Main validation function for QuickMeal preferences
export const validateQuickMealPreferences = (preferences: any): QuickMealValidationResult => {
  const errors: ValidationError[] = [];
  
  // Validate each field
  const servingsError = validateServings(preferences.servings);
  if (servingsError) errors.push(servingsError);
  
  const prepTimeError = validatePrepTime(preferences.prepTime);
  if (prepTimeError) errors.push(prepTimeError);
  
  const dietError = validateDiet(preferences.diet);
  if (dietError) errors.push(dietError);
  
  const cuisineError = validateCuisine(preferences.cuisine);
  if (cuisineError) errors.push(cuisineError);
  
  const moodError = validateMood(preferences.mood);
  if (moodError) errors.push(moodError);
  
  const budgetError = validateBudget(preferences.budget);
  if (budgetError) errors.push(budgetError);
  
  // If validation passes, return sanitized data
  if (errors.length === 0) {
    const sanitizedData = {
      servings: sanitizeNumber(preferences.servings),
      prepTime: sanitizeString(preferences.prepTime),
      diet: sanitizeString(preferences.diet),
      cuisine: sanitizeString(preferences.cuisine),
      mood: sanitizeString(preferences.mood),
      budget: sanitizeString(preferences.budget)
    };
    
    return {
      isValid: true,
      errors: [],
      sanitizedData
    };
  }
  
  return {
    isValid: false,
    errors
  };
};

// Validate AI response data
export const validateQuickMealResponse = (response: any): QuickMealValidationResult => {
  const errors: ValidationError[] = [];
  
  // Check if response has required structure
  if (!response || typeof response !== 'object') {
    errors.push({ field: 'response', message: 'Invalid response format received.' });
    return { isValid: false, errors };
  }
  
  // Check if suggestions array exists and is valid
  if (!Array.isArray(response.suggestions)) {
    errors.push({ field: 'suggestions', message: 'No meal suggestions received.' });
    return { isValid: false, errors };
  }
  
  if (response.suggestions.length === 0) {
    errors.push({ field: 'suggestions', message: 'No meal suggestions available.' });
    return { isValid: false, errors };
  }
  
  // Validate each suggestion
  for (let i = 0; i < response.suggestions.length; i++) {
    const suggestion = response.suggestions[i];
    const suggestionErrors = validateQuickMealSuggestion(suggestion, i);
    errors.push(...suggestionErrors);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Validate individual meal suggestion
export const validateQuickMealSuggestion = (suggestion: any, index: number): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  // Required fields for each suggestion
  const requiredFields = ['title', 'description', 'totalTime', 'calories', 'estimatedCost', 'difficulty', 'nutrition', 'ingredients', 'quickInstructions'];
  
  for (const field of requiredFields) {
    if (!suggestion[field]) {
      errors.push({ 
        field: `suggestion_${index}_${field}`, 
        message: `Meal ${index + 1} is missing required information: ${field}.` 
      });
    }
  }
  
  // Validate nutrition object
  if (suggestion.nutrition) {
    const nutritionFields = ['protein', 'carbs', 'fat'];
    for (const field of nutritionFields) {
      if (typeof suggestion.nutrition[field] !== 'number' || suggestion.nutrition[field] < 0) {
        errors.push({ 
          field: `suggestion_${index}_nutrition_${field}`, 
          message: `Meal ${index + 1} has invalid nutrition data.` 
        });
      }
    }
  }
  
  // Validate arrays
  if (!Array.isArray(suggestion.ingredients)) {
    errors.push({ 
      field: `suggestion_${index}_ingredients`, 
      message: `Meal ${index + 1} has invalid ingredients list.` 
    });
  }
  
  if (!Array.isArray(suggestion.quickInstructions)) {
    errors.push({ 
      field: `suggestion_${index}_instructions`, 
      message: `Meal ${index + 1} has invalid instructions.` 
    });
  }
  
  return errors;
};

// Sanitize user profile data
export const sanitizeUserProfile = (profile: any) => {
  return {
    allergies: sanitizeArray(profile.allergies || []),
    dietaryRestrictions: sanitizeArray(profile.dietaryRestrictions || []),
    cuisinePreferences: sanitizeArray(profile.cuisinePreferences || []),
    dislikedFoods: sanitizeArray(profile.dislikedFoods || []),
    activityLevel: sanitizeString(profile.activityLevel || 'moderately-active'),
    primaryGoal: sanitizeString(profile.primaryGoal || 'maintain-weight')
  };
};

// Sanitize QuickMeal request
export const sanitizeQuickMealRequest = (request: any) => {
  return {
    userId: sanitizeString(request.userId),
    preferences: request.preferences ? {
      servings: sanitizeNumber(request.preferences.servings),
      maxPrepTime: sanitizeString(request.preferences.maxPrepTime),
      diet: sanitizeString(request.preferences.diet),
      cuisine: sanitizeString(request.preferences.cuisine),
      mood: sanitizeString(request.preferences.mood),
      budget: sanitizeString(request.preferences.budget)
    } : {},
    userProfile: sanitizeUserProfile(request.userProfile || {}),
    availableIngredients: sanitizeArray(request.availableIngredients || []),
    customRequests: sanitizeArray(request.customRequests || [])
  };
};

// Profile and Onboarding Validation Services
export class SanitizationService {
  static sanitizeOnboardingData(data: any) {
    return {
      activity_level: sanitizeString(data.activity_level),
      age: sanitizeNumber(data.age),
      allergies: sanitizeArray(data.allergies),
      chronic_illnesses: sanitizeArray(data.chronic_illnesses),
      gender: sanitizeString(data.gender),
      height_cm: sanitizeNumber(data.height_cm),
      language: sanitizeString(data.language),
      primary_goal: sanitizeString(data.primary_goal),
      weight_kg: sanitizeNumber(data.weight_kg)
    };
  }

  static sanitizeProfileUpdate(updates: any) {
    const sanitized: any = {};
    
    if (updates.activity_level) sanitized.activity_level = sanitizeString(updates.activity_level);
    if (updates.age) sanitized.age = sanitizeNumber(updates.age);
    if (updates.allergies) sanitized.allergies = sanitizeArray(updates.allergies);
    if (updates.chronic_illnesses) sanitized.chronic_illnesses = sanitizeArray(updates.chronic_illnesses);
    if (updates.gender) sanitized.gender = sanitizeString(updates.gender);
    if (updates.height_cm) sanitized.height_cm = sanitizeNumber(updates.height_cm);
    if (updates.language) sanitized.language = sanitizeString(updates.language);
    if (updates.primary_goal) sanitized.primary_goal = sanitizeString(updates.primary_goal);
    if (updates.weight_kg) sanitized.weight_kg = sanitizeNumber(updates.weight_kg);
    
    return sanitized;
  }
}

export class ValidationService {
  static validateOnboardingData(data: any) {
    const errors: string[] = [];
    
    // Basic validation
    if (!data.activity_level) errors.push('Activity level is required');
    if (!data.age || data.age < 13 || data.age > 120) errors.push('Valid age is required (13-120)');
    if (!data.gender) errors.push('Gender is required');
    if (!data.height_cm || data.height_cm < 100 || data.height_cm > 250) errors.push('Valid height is required (100-250cm)');
    if (!data.language) errors.push('Language is required');
    if (!data.primary_goal) errors.push('Primary goal is required');
    if (!data.weight_kg || data.weight_kg < 30 || data.weight_kg > 300) errors.push('Valid weight is required (30-300kg)');
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}