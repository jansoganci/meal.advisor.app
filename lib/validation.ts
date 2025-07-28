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

// Weekly Plan validation constants
export const VALID_GOALS = ['Lose Weight', 'Gain Muscle', 'Maintain', 'Build Strength'];
export const VALID_MEALS = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];
export const VALID_WEEKLY_CUISINES = ['Mediterranean', 'Asian', 'Italian', 'Mexican'];
export const VALID_PLAN_FOCUS = ['Quick & Easy', 'Try New Recipes', 'Healthy Focus', 'Comfort Foods'];

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
  
  // Validate arrays
  if (suggestion.ingredients && !Array.isArray(suggestion.ingredients)) {
    errors.push({ 
      field: `suggestion_${index}_ingredients`, 
      message: `Meal ${index + 1} ingredients must be a list.` 
    });
  }
  
  if (suggestion.quickInstructions && !Array.isArray(suggestion.quickInstructions)) {
    errors.push({ 
      field: `suggestion_${index}_instructions`, 
      message: `Meal ${index + 1} instructions must be a list.` 
    });
  }
  
  // Validate nutrition object
  if (suggestion.nutrition && typeof suggestion.nutrition !== 'object') {
    errors.push({ 
      field: `suggestion_${index}_nutrition`, 
      message: `Meal ${index + 1} nutrition information must be an object.` 
    });
  }
  
  // Validate calories
  if (suggestion.calories && (typeof suggestion.calories !== 'number' || suggestion.calories <= 0)) {
    errors.push({ 
      field: `suggestion_${index}_calories`, 
      message: `Meal ${index + 1} must have a valid calorie count.` 
    });
  }
  
  return errors;
};

// Output validation helper
export const validateOutputFormat = (data: any, expectedFields: string[]): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  if (!data || typeof data !== 'object') {
    errors.push({ field: 'data', message: 'Invalid data format received.' });
    return errors;
  }
  
  for (const field of expectedFields) {
    if (!data[field]) {
      errors.push({ field, message: `Missing required field: ${field}.` });
    }
  }
  
  return errors;
};

// General input sanitization
export const sanitizeAndValidateInput = (input: any, maxLength: number = 1000): string => {
  if (typeof input !== 'string') {
    return '';
  }
  
  return input
    .trim()
    .slice(0, maxLength)
    .replace(/[<>]/g, '') // Remove potential HTML/script tags
    .replace(/\s+/g, ' '); // Normalize whitespace
};

// Error message formatter
export const formatValidationErrors = (errors: ValidationError[]): string => {
  if (errors.length === 0) return '';
  if (errors.length === 1) return errors[0].message;
  return `Multiple errors: ${errors.map(e => e.message).join(', ')}`;
};

// Validation class for other components to extend
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

// =============================================================================
// WEEKLY PLAN VALIDATION
// =============================================================================

export interface WeeklyPlanValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  sanitizedData?: any;
}

// Weekly Plan validation functions
export const validateWeeklyGoal = (value: any): ValidationError | null => {
  const sanitized = sanitizeString(value);
  if (!sanitized) {
    return { field: 'goal', message: 'Please select a fitness goal.' };
  }
  if (!VALID_GOALS.includes(sanitized)) {
    return { field: 'goal', message: 'Please select a valid fitness goal.' };
  }
  return null;
};

export const validateWeeklyMeals = (value: any): ValidationError | null => {
  const sanitized = sanitizeArray(value);
  if (sanitized.length === 0) {
    return { field: 'meals', message: 'Please select at least one meal type.' };
  }
  for (const meal of sanitized) {
    if (!VALID_MEALS.includes(meal)) {
      return { field: 'meals', message: `Invalid meal type: ${meal}` };
    }
  }
  return null;
};

export const validateWeeklyCuisines = (value: any): ValidationError | null => {
  const sanitized = sanitizeArray(value);
  // Cuisines are optional, so empty array is valid
  for (const cuisine of sanitized) {
    if (!VALID_WEEKLY_CUISINES.includes(cuisine)) {
      return { field: 'cuisines', message: `Invalid cuisine type: ${cuisine}` };
    }
  }
  return null;
};

export const validatePlanFocus = (value: any): ValidationError | null => {
  const sanitized = sanitizeString(value);
  if (!sanitized) {
    return { field: 'planFocus', message: 'Please select a plan focus.' };
  }
  if (!VALID_PLAN_FOCUS.includes(sanitized)) {
    return { field: 'planFocus', message: 'Please select a valid plan focus.' };
  }
  return null;
};

export const validateCalories = (value: any): ValidationError | null => {
  if (value === undefined || value === null) {
    return null; // Optional field
  }
  const num = sanitizeNumber(value);
  if (num === null) {
    return { field: 'calories', message: 'Please enter a valid calorie amount.' };
  }
  if (num < 1000 || num > 4000) {
    return { field: 'calories', message: 'Calories must be between 1000 and 4000.' };
  }
  return null;
};

export const validateProtein = (value: any): ValidationError | null => {
  if (value === undefined || value === null) {
    return null; // Optional field
  }
  const num = sanitizeNumber(value);
  if (num === null) {
    return { field: 'protein', message: 'Please enter a valid protein amount.' };
  }
  if (num < 20 || num > 300) {
    return { field: 'protein', message: 'Protein must be between 20 and 300 grams.' };
  }
  return null;
};

// Main validation function for WeeklyPlan preferences
export const validateWeeklyPlanPreferences = (preferences: any): WeeklyPlanValidationResult => {
  const errors: ValidationError[] = [];
  
  // Validate required fields
  const goalError = validateWeeklyGoal(preferences.goal);
  if (goalError) errors.push(goalError);
  
  const mealsError = validateWeeklyMeals(preferences.meals);
  if (mealsError) errors.push(mealsError);
  
  const cuisinesError = validateWeeklyCuisines(preferences.cuisines);
  if (cuisinesError) errors.push(cuisinesError);
  
  const planFocusError = validatePlanFocus(preferences.planFocus);
  if (planFocusError) errors.push(planFocusError);
  
  // Validate optional fields
  const caloriesError = validateCalories(preferences.calories);
  if (caloriesError) errors.push(caloriesError);
  
  const proteinError = validateProtein(preferences.protein);
  if (proteinError) errors.push(proteinError);
  
  // If validation passes, return sanitized data
  if (errors.length === 0) {
    const sanitizedData = {
      goal: sanitizeString(preferences.goal),
      meals: sanitizeArray(preferences.meals),
      cuisines: sanitizeArray(preferences.cuisines),
      planFocus: sanitizeString(preferences.planFocus),
      ...(preferences.calories !== undefined && { calories: sanitizeNumber(preferences.calories) }),
      ...(preferences.protein !== undefined && { protein: sanitizeNumber(preferences.protein) })
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

// Validate WeeklyPlan AI response
export const validateWeeklyPlanResponse = (response: any): WeeklyPlanValidationResult => {
  const errors: ValidationError[] = [];
  
  // Check if response has required structure
  if (!response || typeof response !== 'object') {
    errors.push({ field: 'response', message: 'Invalid response format received.' });
    return { isValid: false, errors };
  }
  
  // Check if overview exists
  if (!response.overview || typeof response.overview !== 'object') {
    errors.push({ field: 'overview', message: 'Weekly plan overview is missing.' });
  }
  
  // Check if days array exists and has 7 days
  if (!Array.isArray(response.days)) {
    errors.push({ field: 'days', message: 'Weekly plan days are missing.' });
  } else if (response.days.length !== 7) {
    errors.push({ field: 'days', message: 'Weekly plan must contain exactly 7 days.' });
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};