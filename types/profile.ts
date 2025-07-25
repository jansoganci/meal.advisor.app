export interface UserProfile {
  id: string
  
  // Basic Information
  age: number
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say'
  
  // Physical Measurements
  height_cm: number
  weight_kg: number
  
  // Health Information
  allergies: string[]
  chronic_illnesses: string[]
  
  // Goals & Activity
  activity_level: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active'
  primary_goal: 'lose_weight' | 'maintain_weight' | 'gain_weight' | 'build_muscle' | 'improve_health'
  
  // Preferences
  dietary_preferences: string[]
  cuisine_preferences: string[]
  
  // App Settings
  preferred_language: string
  notifications_enabled: boolean
  onboarding_completed: boolean
  
  // Calculated Fields
  daily_calories?: number
  daily_protein_g?: number
  daily_carbs_g?: number
  daily_fat_g?: number
  
  // Timestamps
  created_at: string
  updated_at: string
}

export interface OnboardingStep1 {
  age: number
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say'
}

export interface OnboardingStep2 {
  height_cm: number
  weight_kg: number
}

export interface OnboardingStep3 {
  allergies: string[]
  chronic_illnesses: string[]
}

export interface OnboardingStep4 {
  activity_level: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active'
  primary_goal: 'lose_weight' | 'maintain_weight' | 'gain_weight' | 'build_muscle' | 'improve_health'
}

export interface OnboardingData extends OnboardingStep1, OnboardingStep2, OnboardingStep3, OnboardingStep4 {
  preferred_language?: string
  dietary_preferences?: string[]
  cuisine_preferences?: string[]
}

export interface ProfileContextType {
  profile: UserProfile | null
  loading: boolean
  error: string | null
  createProfile: (data: OnboardingData) => Promise<boolean>
  updateProfile: (data: Partial<UserProfile>) => Promise<boolean>
  refreshProfile: () => Promise<boolean>
  clearError: () => void
}