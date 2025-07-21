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
  gender: 'male' | 'female' | 'other'
}

export interface OnboardingStep2Data {
  height: number // cm
  weight: number // kg
}

export interface OnboardingStep3Data {
  allergies: string[]
  chronic_illnesses: string[]
}

export interface OnboardingStep4Data {
  activity_level: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active'
  fitness_goal: 'lose_weight' | 'gain_weight' | 'maintain' | 'build_muscle'
}

export const ALLERGY_OPTIONS = [
  'peanuts',
  'dairy',
  'eggs',
  'gluten',
  'shellfish',
  'fish',
  'tree_nuts',
  'other'
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
  { value: 'very_active', label: 'Very Active', description: 'Hard exercise 6-7 days/week' }
] as const

export const FITNESS_GOALS = [
  { value: 'lose_weight', label: 'Lose Weight', emoji: '🏃‍♀️' },
  { value: 'gain_weight', label: 'Gain Weight', emoji: '💪' },
  { value: 'maintain', label: 'Maintain', emoji: '⚖️' },
  { value: 'build_muscle', label: 'Build Muscle', emoji: '🏋️' }
] as const