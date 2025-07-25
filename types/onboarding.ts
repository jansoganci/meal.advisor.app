export interface OnboardingContextType {
  step1Data: OnboardingStep1Data | null
  step2Data: OnboardingStep2Data | null
  step3Data: OnboardingStep3Data | null
  step4Data: OnboardingStep4Data | null
  currentStep: number
  setStep1Data: (data: OnboardingStep1Data) => void
  setStep2Data: (data: OnboardingStep2Data) => void
  setStep3Data: (data: OnboardingStep3Data) => void
  setStep4Data: (data: OnboardingStep4Data) => void
  setCurrentStep: (step: number) => void
  resetOnboarding: () => void
  isComplete: boolean
}

export interface OnboardingStep1Data {
  age: number
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say'
}

export interface OnboardingStep2Data {
  height_cm: number
  weight_kg: number
}

export interface OnboardingStep3Data {
  allergies: string[]
  chronic_illnesses: string[]
}

export interface OnboardingStep4Data {
  activity_level: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active'
  primary_goal: 'lose_weight' | 'gain_weight' | 'maintain_weight' | 'build_muscle' | 'improve_health'
}

export const ALLERGY_OPTIONS = [
  'peanuts',
  'dairy',
  'eggs',
  'gluten',
  'shellfish',
  'fish',
  'tree_nuts',
  'none'
] as const

export const CHRONIC_ILLNESS_OPTIONS = [
  'diabetes',
  'heart_disease',
  'high_blood_pressure',
  'none'
] as const

export const ACTIVITY_LEVELS = [
  { value: 'sedentary', label: 'Sedentary', description: 'Little to no exercise' },
  { value: 'lightly_active', label: 'Lightly Active', description: 'Light exercise 1-3 days/week' },
  { value: 'moderately_active', label: 'Moderately Active', description: 'Moderate exercise 3-5 days/week' },
  { value: 'very_active', label: 'Very Active', description: 'Hard exercise 6-7 days/week' },
  { value: 'extremely_active', label: 'Extremely Active', description: 'Very hard exercise, physical job' }
] as const

export const FITNESS_GOALS = [
  { value: 'lose_weight', label: 'Lose Weight', emoji: '🏃‍♀️' },
  { value: 'gain_weight', label: 'Gain Weight', emoji: '💪' },
  { value: 'maintain_weight', label: 'Maintain Weight', emoji: '⚖️' },
  { value: 'build_muscle', label: 'Build Muscle', emoji: '🏋️' },
  { value: 'improve_health', label: 'Improve Health', emoji: '❤️' }
] as const

export const DIETARY_PREFERENCES_OPTIONS = [
  'vegetarian',
  'vegan',
  'pescatarian',
  'keto',
  'paleo',
  'mediterranean',
  'low_carb',
  'low_fat',
  'gluten_free',
  'dairy_free',
  'none'
] as const

export const CUISINE_PREFERENCES_OPTIONS = [
  'italian',
  'mexican',
  'turkish',
  'chinese',
  'japanese',
  'thai',
  'indian',
  'mediterranean',
  'american',
  'french',
  'greek',
  'korean',
  'vietnamese',
  'middle_eastern',
] as const