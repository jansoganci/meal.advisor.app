import { OnboardingData, UserProfile } from '@/types/profile'
import { supabase } from './supabase'
import { SanitizationService, ValidationService } from './validation'

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
  static async createProfile(userId: string, data: OnboardingData, userEmail?: string): Promise<ProfileResult> {
    try {
      console.log('🔍 ProfileService.createProfile called with:', {
        userId,
        userEmail,
        data,
        hasAge: !!data.age,
        hasGender: !!data.gender,
        hasHeight: !!data.height,
        hasWeight: !!data.weight,
        hasActivityLevel: !!data.activity_level,
        hasFitnessGoal: !!data.fitness_goal
      })

      // Check if user exists in database first
      const { data: existingUser, error: userCheckError } = await supabase
        .from('users')
        .select('id, email')
        .eq('id', userId)
        .single()
      
      console.log('👤 User check result:', { existingUser, userCheckError })

      // If user doesn't exist, create them first
      if (userCheckError?.code === 'PGRST116' || !existingUser) {
        console.log('🆕 User does not exist in database, creating user record first...')
        const { data: newUser, error: createUserError } = await supabase
          .from('users')
          .insert([{ 
            id: userId, 
            email: userEmail || 'unknown@email.com'
          }])
          .select()
          .single()
        
        console.log('🆕 User creation result:', { newUser, createUserError })
        
        if (createUserError) {
          console.error('❌ Failed to create user record:', createUserError)
          return { success: false, error: `Failed to create user record: ${createUserError.message}` }
        }
      }

      // Basic data validation before sanitization
      if (!data.age || !data.gender || !data.height || !data.weight || !data.activity_level || !data.fitness_goal) {
        const missing = []
        if (!data.age) missing.push('age')
        if (!data.gender) missing.push('gender') 
        if (!data.height) missing.push('height')
        if (!data.weight) missing.push('weight')
        if (!data.activity_level) missing.push('activity_level')
        if (!data.fitness_goal) missing.push('fitness_goal')
        
        console.error('❌ Missing required onboarding data:', missing)
        return { success: false, error: `Missing required data: ${missing.join(', ')}` }
      }

      // Sanitize input data
      console.log('🧹 Sanitizing onboarding data...')
      const sanitizedData = SanitizationService.sanitizeOnboardingData(data)
      console.log('🧹 Sanitized data:', sanitizedData)

      // Validate input data
      const validation = ValidationService.validateOnboardingData(sanitizedData)
      console.log('✅ Validation result:', validation)
      if (!validation.isValid) {
        console.error('❌ Validation failed:', validation.errors)
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

      // Map onboarding data to database schema
      const mapFitnessGoal = (goal: string) => {
        switch (goal) {
          case 'maintain': return 'maintain_weight'
          case 'lose_weight': return 'lose_weight'
          case 'gain_weight': return 'gain_weight'
          case 'build_muscle': return 'build_muscle'
          default: return 'maintain_weight'
        }
      }

      // Update the existing user record created by the auth trigger
      const profileData = {
        age: sanitizedData.age,
        gender: sanitizedData.gender,
        height_cm: sanitizedData.height,
        weight_kg: sanitizedData.weight,
        allergies: sanitizedData.allergies || [],
        chronic_illnesses: sanitizedData.chronic_illnesses || [],
        activity_level: sanitizedData.activity_level,
        primary_goal: mapFitnessGoal(sanitizedData.fitness_goal),
        preferred_language: sanitizedData.language || 'en',
        daily_calories: nutritionGoals.daily_calories,
        daily_protein_g: nutritionGoals.daily_protein,
        onboarding_completed: true,
        updated_at: new Date().toISOString(),
      }

      console.log('📝 Final profile data to update:', profileData)

      // Validate against database constraints
      console.log('🔍 Validating data against database constraints...')
      const constraintValidation = {
        age: sanitizedData.age >= 13 && sanitizedData.age <= 120,
        height: sanitizedData.height >= 100 && sanitizedData.height <= 250,
        weight: sanitizedData.weight >= 30 && sanitizedData.weight <= 300,
        activity_level: ['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extremely_active'].includes(sanitizedData.activity_level),
        primary_goal: ['lose_weight', 'maintain_weight', 'gain_weight', 'build_muscle', 'improve_health'].includes(mapFitnessGoal(sanitizedData.fitness_goal)),
        daily_calories: nutritionGoals.daily_calories >= 1000 && nutritionGoals.daily_calories <= 4000,
        daily_protein: nutritionGoals.daily_protein >= 20 && nutritionGoals.daily_protein <= 300
      }
      console.log('🔍 Constraint validation results:', constraintValidation)
      
      const failedConstraints = Object.entries(constraintValidation)
        .filter(([_, isValid]) => !isValid)
        .map(([field, _]) => field)
      
      if (failedConstraints.length > 0) {
        console.error('❌ Failed database constraints:', failedConstraints)
        return { success: false, error: `Data validation failed for: ${failedConstraints.join(', ')}` }
      }

      // Test Supabase connection first
      console.log('🔗 Testing Supabase connection...')
      const { data: connectionTest, error: connectionError } = await supabase
        .from('users')
        .select('id')
        .limit(1)
      
      console.log('🔗 Connection test result:', { connectionTest, connectionError })
      
      if (connectionError) {
        console.error('❌ Supabase connection failed:', connectionError)
        return { success: false, error: `Database connection failed: ${connectionError.message}` }
      }

      // Test if we can read the specific user record first
      console.log('🔍 Testing user record access...')
      const { data: userRecord, error: userReadError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()
      
      console.log('🔍 User record test result:', { 
        userRecord: userRecord ? 'Found user record' : 'No user record',
        userReadError: userReadError ? userReadError.message : 'No error',
        userId 
      })

      const { data: profile, error } = await supabase
        .from('users')
        .update(profileData)
        .eq('id', userId)
        .select()
        .single()

      if (error) {
        console.error('❌ SUPABASE ERROR in createProfile:', {
          error: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
          userId,
          profileData,
          fullError: JSON.stringify(error, null, 2)
        })
        
        // Let's also try to get the current user from Supabase to check auth
        const { data: authUser, error: authError } = await supabase.auth.getUser()
        console.error('❌ Auth check during error:', {
          authUser: authUser?.user?.id,
          authError,
          expectedUserId: userId,
          idsMatch: authUser?.user?.id === userId
        })
        
        return { success: false, error: `Database error: ${error.message} (Code: ${error.code})` }
      }

      console.log('✅ Profile created successfully:', profile)
      return { success: true, data: profile as UserProfile }
    } catch (err) {
      console.error('❌ UNEXPECTED ERROR in createProfile:', {
        error: err,
        message: err instanceof Error ? err.message : 'Unknown error',
        stack: err instanceof Error ? err.stack : 'No stack trace',
        userId,
        data
      })
      return { success: false, error: 'Failed to create profile' }
    }
  }

  // Get user profile
  static async getProfile(userId: string): Promise<ProfileResult> {
    try {
      const { data: profile, error } = await supabase
        .from('users')
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
        .from('users')
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
        .from('users')
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
        .from('users')
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
        .from('users')
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