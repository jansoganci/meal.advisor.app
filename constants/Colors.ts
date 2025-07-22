// Color constants for MealAdvisor app
// These colors are designed to work with NativeWind and match iOS design principles

// Base color palette
const ColorPalette = {
  // Primary colors (Emerald)
  primary: {
    50: '#ECFDF5',
    100: '#D1FAE5',
    200: '#A7F3D0',
    300: '#6EE7B7',
    400: '#34D399',
    500: '#10B981',
    600: '#059669', // Main primary color
    700: '#047857',
    800: '#065F46',
    900: '#064E3B'
  },

  // Secondary colors (Gray)
  secondary: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827'
  },

  // Success colors (Green)
  success: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    200: '#BBF7D0',
    300: '#86EFAC',
    400: '#4ADE80',
    500: '#22C55E',
    600: '#16A34A',
    700: '#15803D',
    800: '#166534',
    900: '#14532D'
  },

  // Error colors (Red)
  error: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D'
  },

  // Warning colors (Yellow)
  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F'
  },

  // Info colors (Blue)
  info: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A'
  },

  // Neutral colors (for text and backgrounds)
  neutral: {
    white: '#FFFFFF',
    black: '#000000',
    transparent: 'transparent'
  },

  // Food and nutrition related colors
  nutrition: {
    protein: '#DC2626', // Red
    carbs: '#F59E0B', // Yellow
    fat: '#3B82F6', // Blue
    fiber: '#059669', // Green
    calories: '#7C3AED', // Purple
    sodium: '#EF4444', // Red
    sugar: '#F97316' // Orange
  },

  // Dietary restriction colors
  dietary: {
    vegetarian: '#22C55E',
    vegan: '#16A34A',
    glutenFree: '#F59E0B',
    dairyFree: '#3B82F6',
    nutFree: '#DC2626',
    keto: '#7C3AED',
    paleo: '#EA580C',
    lowCarb: '#059669',
    lowFat: '#0EA5E9',
    lowSodium: '#6366F1'
  },

  // Cuisine colors
  cuisine: {
    italian: '#DC2626',
    mexican: '#16A34A',
    chinese: '#DC2626',
    indian: '#F59E0B',
    thai: '#059669',
    japanese: '#DC2626',
    french: '#3B82F6',
    mediterranean: '#059669',
    american: '#3B82F6',
    korean: '#DC2626'
  },

  // Meal type colors
  mealType: {
    breakfast: '#F59E0B',
    lunch: '#059669',
    dinner: '#DC2626',
    snack: '#3B82F6',
    dessert: '#7C3AED',
    beverage: '#06B6D4'
  },

  // Difficulty colors
  difficulty: {
    easy: '#22C55E',
    medium: '#F59E0B',
    hard: '#DC2626'
  },

  // Spice level colors
  spice: {
    mild: '#22C55E',
    medium: '#F59E0B',
    hot: '#EF4444',
    veryHot: '#DC2626'
  }
}

// Theme-specific color configurations
export const Colors = {
  light: {
    text: ColorPalette.secondary[900],
    background: ColorPalette.neutral.white,
    tint: ColorPalette.primary[600],
    icon: ColorPalette.secondary[500],
    tabIconDefault: ColorPalette.secondary[400],
    tabIconSelected: ColorPalette.primary[600],
    
    // Semantic colors
    primary: ColorPalette.primary[600],
    secondary: ColorPalette.secondary[500],
    success: ColorPalette.success[600],
    error: ColorPalette.error[600],
    warning: ColorPalette.warning[600],
    info: ColorPalette.info[600],
    
    // Background variations
    backgroundSecondary: ColorPalette.secondary[50],
    backgroundTertiary: ColorPalette.secondary[100],
    
    // Text variations
    textSecondary: ColorPalette.secondary[600],
    textTertiary: ColorPalette.secondary[400],
    textDisabled: ColorPalette.secondary[300],
    textInverse: ColorPalette.neutral.white,
    
    // Border colors
    border: ColorPalette.secondary[200],
    borderSecondary: ColorPalette.secondary[300],
    borderFocus: ColorPalette.primary[600],
    
    // Shadow colors
    shadow: 'rgba(0, 0, 0, 0.1)',
    shadowMedium: 'rgba(0, 0, 0, 0.15)',
    shadowDark: 'rgba(0, 0, 0, 0.25)',
    
    // Component-specific colors
    cardBackground: ColorPalette.neutral.white,
    modalBackground: 'rgba(0, 0, 0, 0.5)',
    inputBackground: ColorPalette.neutral.white,
    inputBorder: ColorPalette.secondary[300],
    buttonPrimary: ColorPalette.primary[600],
    buttonSecondary: ColorPalette.secondary[100],
    
    // Status colors
    online: ColorPalette.success[500],
    offline: ColorPalette.secondary[400],
    
    // Nutrition & food colors
    ...ColorPalette.nutrition,
    ...ColorPalette.dietary,
    ...ColorPalette.cuisine,
    ...ColorPalette.mealType,
    ...ColorPalette.difficulty,
    ...ColorPalette.spice
  },
  dark: {
    text: ColorPalette.neutral.white,
    background: ColorPalette.secondary[900],
    tint: ColorPalette.primary[400],
    icon: ColorPalette.secondary[300],
    tabIconDefault: ColorPalette.secondary[500],
    tabIconSelected: ColorPalette.primary[400],
    
    // Semantic colors
    primary: ColorPalette.primary[400],
    secondary: ColorPalette.secondary[400],
    success: ColorPalette.success[400],
    error: ColorPalette.error[400],
    warning: ColorPalette.warning[400],
    info: ColorPalette.info[400],
    
    // Background variations
    backgroundSecondary: ColorPalette.secondary[800],
    backgroundTertiary: ColorPalette.secondary[700],
    
    // Text variations
    textSecondary: ColorPalette.secondary[300],
    textTertiary: ColorPalette.secondary[400],
    textDisabled: ColorPalette.secondary[600],
    textInverse: ColorPalette.secondary[900],
    
    // Border colors
    border: ColorPalette.secondary[700],
    borderSecondary: ColorPalette.secondary[600],
    borderFocus: ColorPalette.primary[400],
    
    // Shadow colors
    shadow: 'rgba(0, 0, 0, 0.3)',
    shadowMedium: 'rgba(0, 0, 0, 0.4)',
    shadowDark: 'rgba(0, 0, 0, 0.5)',
    
    // Component-specific colors
    cardBackground: ColorPalette.secondary[800],
    modalBackground: 'rgba(0, 0, 0, 0.7)',
    inputBackground: ColorPalette.secondary[800],
    inputBorder: ColorPalette.secondary[600],
    buttonPrimary: ColorPalette.primary[500],
    buttonSecondary: ColorPalette.secondary[700],
    
    // Status colors
    online: ColorPalette.success[400],
    offline: ColorPalette.secondary[500],
    
    // Nutrition & food colors
    ...ColorPalette.nutrition,
    ...ColorPalette.dietary,
    ...ColorPalette.cuisine,
    ...ColorPalette.mealType,
    ...ColorPalette.difficulty,
    ...ColorPalette.spice
  }
} as const

// Color utilities
export const colorUtils = {
  // Get color with opacity
  withOpacity: (color: string, opacity: number): string => {
    return `${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`
  },

  // Get contrasting text color
  getContrastingTextColor: (backgroundColor: string): string => {
    // Simple contrast calculation - in production, use a proper color contrast library
    const darkColors = [
      ColorPalette.primary[600],
      ColorPalette.primary[700],
      ColorPalette.primary[800],
      ColorPalette.primary[900],
      ColorPalette.secondary[700],
      ColorPalette.secondary[800],
      ColorPalette.secondary[900],
      ColorPalette.error[600],
      ColorPalette.error[700],
      ColorPalette.error[800],
      ColorPalette.error[900]
    ]
    
    return darkColors.includes(backgroundColor) ? ColorPalette.neutral.white : Colors.light.text
  },

  // Get nutrition color
  getNutritionColor: (type: 'protein' | 'carbs' | 'fat' | 'fiber' | 'calories' | 'sodium' | 'sugar'): string => {
    return ColorPalette.nutrition[type]
  },

  // Get dietary color
  getDietaryColor: (type: string): string => {
    const normalizedType = type.toLowerCase().replace(/[^a-z]/g, '') as keyof typeof ColorPalette.dietary
    return ColorPalette.dietary[normalizedType] || ColorPalette.primary[600]
  },

  // Get cuisine color
  getCuisineColor: (type: string): string => {
    const normalizedType = type.toLowerCase().replace(/[^a-z]/g, '') as keyof typeof ColorPalette.cuisine
    return ColorPalette.cuisine[normalizedType] || ColorPalette.primary[600]
  },

  // Get meal type color
  getMealTypeColor: (type: string): string => {
    const normalizedType = type.toLowerCase().replace(/[^a-z]/g, '') as keyof typeof ColorPalette.mealType
    return ColorPalette.mealType[normalizedType] || ColorPalette.primary[600]
  },

  // Get difficulty color
  getDifficultyColor: (level: string): string => {
    const normalizedLevel = level.toLowerCase() as keyof typeof ColorPalette.difficulty
    return ColorPalette.difficulty[normalizedLevel] || ColorPalette.primary[600]
  },

  // Get spice level color
  getSpiceColor: (level: string): string => {
    const normalizedLevel = level.toLowerCase().replace(/[^a-z]/g, '') as keyof typeof ColorPalette.spice
    return ColorPalette.spice[normalizedLevel] || ColorPalette.primary[600]
  }
}

// Export color palette for advanced usage
export { ColorPalette }

// Export default colors for easy access
export default Colors
