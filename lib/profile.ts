import { supabase } from './supabase'
import { UserProfile, OnboardingData } from '@/types/profile'
import { ValidationService, SanitizationService } from './validation'

export interface ProfileResult {
  success: boolean
  error?: string
  data?: UserProfile
}

export interface NutritionGoals {
  daily_calories: number
  daily_protein: number
}

export class ProfileService {
  // Create user profile after onboarding
  static async createProfile(userId: string, data: OnboardingData): Promise<ProfileResult> {
    try {
      // Sanitize input data
      const sanitizedData = SanitizationService.sanitizeOnboardingData(data)

      // Validate input data
      const validation = ValidationService.validateOnboardingData(sanitizedData)
      if (!validation.isValid) {
        return { success: false, error: validation.errors.join(', ') }
      }

      // Calculate nutrition goals
      const nutritionGoals = await this.calculateNutritionGoals(
        sanitizedData.age,
        sanitizedData.gender,
        sanitizedData.height,
        sanitizedData.weight,
        sanitizedData.activity_level,
        sanitizedData.fitness_goal
      )

      const profileData = {
        id: userId,
        age: sanitizedData.age,
        gender: sanitizedData.gender,
        height: sanitizedData.height,
        weight: sanitizedData.weight,
        allergies: sanitizedData.allergies || [],
        chronic_illnesses: sanitizedData.chronic_illnesses || [],
        activity_level: sanitizedData.activity_level,
        fitness_goal: sanitizedData.fitness_goal,
        language: sanitizedData.language || 'en',
        is_premium: false,
        daily_calorie_goal: nutritionGoals.daily_calories,
        daily_protein_goal: nutritionGoals.daily_protein,
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .insert([profileData])
        .select()
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data: profile as UserProfile }
    } catch (err) {
      return { success: false, error: 'Failed to create profile' }
    }
  }

  // Get user profile
  static async getProfile(userId: string): Promise<ProfileResult> {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data: profile as UserProfile }
    } catch (err) {
      return { success: false, error: 'Failed to fetch profile' }
    }
  }

  // Update user profile
  static async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<ProfileResult> {
    try {
      // Sanitize input data
      const sanitizedUpdates = SanitizationService.sanitizeProfileUpdate(updates)

      // Validate input data
      const validation = ValidationService.validateProfileUpdate(sanitizedUpdates)
      if (!validation.isValid) {
        return { success: false, error: validation.errors.join(', ') }
      }

      // If physical measurements or activity/goals are updated, recalculate nutrition goals
      if (sanitizedUpdates.age || sanitizedUpdates.gender || sanitizedUpdates.height || 
          sanitizedUpdates.weight || sanitizedUpdates.activity_level || sanitizedUpdates.fitness_goal) {
        
        // Get current profile to fill in missing values
        const currentProfile = await this.getProfile(userId)
        if (!currentProfile.success || !currentProfile.data) {
          return { success: false, error: 'Profile not found' }
        }

        const profile = currentProfile.data
        const nutritionGoals = await this.calculateNutritionGoals(
          sanitizedUpdates.age ?? profile.age,
          sanitizedUpdates.gender ?? profile.gender,
          sanitizedUpdates.height ?? profile.height,
          sanitizedUpdates.weight ?? profile.weight,
          sanitizedUpdates.activity_level ?? profile.activity_level,
          sanitizedUpdates.fitness_goal ?? profile.fitness_goal
        )

        sanitizedUpdates.daily_calorie_goal = nutritionGoals.daily_calories
        sanitizedUpdates.daily_protein_goal = nutritionGoals.daily_protein
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .update({
          ...sanitizedUpdates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
        .select()
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data: profile as UserProfile }
    } catch (err) {
      return { success: false, error: 'Failed to update profile' }
    }
  }

  // Check if profile exists
  static async profileExists(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .single()

      return !error && !!data
    } catch (err) {
      return false
    }
  }

  // Calculate BMI
  static calculateBMI(height: number, weight: number): number {
    // height in cm, weight in kg
    const heightInMeters = height / 100
    return Math.round((weight / (heightInMeters * heightInMeters)) * 10) / 10
  }

  // Calculate daily calorie needs (Harris-Benedict equation)
  static calculateDailyCalories(
    age: number,
    gender: string,
    height: number,
    weight: number,
    activityLevel: string
  ): number {
    let bmr: number

    // Base Metabolic Rate calculation
    if (gender === 'male') {
      bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
    } else {
      bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age)
    }

    // Activity level multiplier
    const activityMultipliers = {
      sedentary: 1.2,
      lightly_active: 1.375,
      moderately_active: 1.55,
      very_active: 1.725,
    }

    const multiplier = activityMultipliers[activityLevel as keyof typeof activityMultipliers] || 1.2
    return Math.round(bmr * multiplier)
  }

  // Calculate daily protein needs
  static calculateDailyProtein(weight: number, activityLevel: string, fitnessGoal: string): number {
    let proteinPerKg: number

    // Base protein needs
    if (activityLevel === 'sedentary') {
      proteinPerKg = 0.8
    } else if (activityLevel === 'lightly_active') {
      proteinPerKg = 1.0
    } else if (activityLevel === 'moderately_active') {
      proteinPerKg = 1.2
    } else {
      proteinPerKg = 1.4
    }

    // Adjust for fitness goal
    if (fitnessGoal === 'build_muscle') {
      proteinPerKg += 0.4
    } else if (fitnessGoal === 'lose_weight') {
      proteinPerKg += 0.2
    }

    return Math.round(weight * proteinPerKg)
  }

  // Calculate nutrition goals using database function
  static async calculateNutritionGoals(
    age: number,
    gender: string,
    height: number,
    weight: number,
    activityLevel: string,
    fitnessGoal: string
  ): Promise<NutritionGoals> {
    try {
      const { data, error } = await supabase.rpc('calculate_nutrition_goals', {
        p_age: age,
        p_gender: gender,
        p_height: height,
        p_weight: weight,
        p_activity_level: activityLevel,
        p_fitness_goal: fitnessGoal
      })

      if (error) {
        // Fallback to client-side calculation
        const calories = this.calculateDailyCalories(age, gender, height, weight, activityLevel)
        const protein = this.calculateDailyProtein(weight, activityLevel, fitnessGoal)
        
        // Apply fitness goal adjustment to calories
        let adjustedCalories = calories
        if (fitnessGoal === 'lose_weight') {
          adjustedCalories = Math.round(calories * 0.85)
        } else if (fitnessGoal === 'gain_weight') {
          adjustedCalories = Math.round(calories * 1.15)
        } else if (fitnessGoal === 'build_muscle') {
          adjustedCalories = Math.round(calories * 1.1)
        }
        
        return {
          daily_calories: adjustedCalories,
          daily_protein: protein
        }
      }

      return {
        daily_calories: data[0].daily_calories,
        daily_protein: data[0].daily_protein
      }
    } catch (err) {
      // Fallback to client-side calculation
      const calories = this.calculateDailyCalories(age, gender, height, weight, activityLevel)
      const protein = this.calculateDailyProtein(weight, activityLevel, fitnessGoal)
      
      let adjustedCalories = calories
      if (fitnessGoal === 'lose_weight') {
        adjustedCalories = Math.round(calories * 0.85)
      } else if (fitnessGoal === 'gain_weight') {
        adjustedCalories = Math.round(calories * 1.15)
      } else if (fitnessGoal === 'build_muscle') {
        adjustedCalories = Math.round(calories * 1.1)
      }
      
      return {
        daily_calories: adjustedCalories,
        daily_protein: protein
      }
    }
  }

  // User preferences management
  static async updateUserPreferences(userId: string, preferences: Record<string, any>): Promise<ProfileResult> {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .update({
          language: preferences.language,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
        .select()
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data: profile as UserProfile }
    } catch (err) {
      return { success: false, error: 'Failed to update preferences' }
    }
  }

  // Delete user profile
  static async deleteProfile(userId: string): Promise<ProfileResult> {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId)

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (err) {
      return { success: false, error: 'Failed to delete profile' }
    }
  }
}