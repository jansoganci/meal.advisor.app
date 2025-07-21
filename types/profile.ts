export interface UserProfile {
  id: string
  
  // Step 1: Basic Information
  age: number
  gender: 'male' | 'female' | 'other'
  
  // Step 2: Physical Measurements
  height: number // cm
  weight: number // kg
  
  // Step 3: Health Information
  allergies: string[]
  chronic_illnesses: string[]
  
  // Step 4: Goals & Activity
  activity_level: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active'
  fitness_goal: 'lose_weight' | 'gain_weight' | 'maintain' | 'build_muscle'
  
  // App Settings
  language: string
  is_premium: boolean
  
  // Calculated Fields
  bmi?: number
  daily_calorie_goal?: number
  daily_protein_goal?: number
  
  // Timestamps
  created_at: string
  updated_at: string
}

export interface OnboardingStep1 {
  age: number
  gender: 'male' | 'female' | 'other'
}

export interface OnboardingStep2 {
  height: number
  weight: number
}

export interface OnboardingStep3 {
  allergies: string[]
  chronic_illnesses: string[]
}

export interface OnboardingStep4 {
  activity_level: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active'
  fitness_goal: 'lose_weight' | 'gain_weight' | 'maintain' | 'build_muscle'
}

export interface OnboardingData extends OnboardingStep1, OnboardingStep2, OnboardingStep3, OnboardingStep4 {
  language?: string
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