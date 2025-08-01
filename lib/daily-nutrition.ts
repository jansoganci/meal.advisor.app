import type { Database } from '../types/database'
import { supabase } from './supabase'

type DatabaseDailyNutritionResult = Database['public']['Functions']['get_daily_nutrition']['Returns'][0]

export interface DailyNutrition {
  date: string
  caloriesGoal: number
  proteinGoal: number
  carbsGoal: number
  fatGoal: number
  caloriesConsumed: number
  proteinConsumed: number
  carbsConsumed: number
  fatConsumed: number
  caloriesLeft: number
  proteinLeft: number
  carbsLeft: number
  fatLeft: number
}

export interface DailyNutritionResult {
  success: boolean
  error?: string
  data?: DailyNutrition
}

export class DailyNutritionService {
  /**
   * Get user's daily nutrition for a specific date
   * @param userId - User ID
   * @param date - Date to get nutrition for (defaults to today in user's timezone)
   */
  static async getDailyNutrition(
    userId: string,
    date?: string
  ): Promise<DailyNutritionResult> {
    try {
      // Use provided date or get today's date
      const targetDate = date || new Date().toISOString().split('T')[0]

      console.log('🍽️ Getting daily nutrition for user:', userId, 'date:', targetDate)

      const { data, error } = await supabase.rpc('get_daily_nutrition', {
        p_user_id: userId,
        p_date: targetDate
      })

      if (error) {
        console.error('❌ Database error getting daily nutrition:', error)
        return {
          success: false,
          error: `Database error: ${error.message}`
        }
      }

      if (!data || data.length === 0) {
        console.log('⚠️ No nutrition data found for user:', userId)
        return {
          success: false,
          error: 'No nutrition data found'
        }
      }

      const nutritionData: DatabaseDailyNutritionResult = data[0]
      
      // Calculate "left" values (goals - consumed)
      const caloriesLeft = (nutritionData.calories_goal || 0) - (nutritionData.calories_consumed || 0)
      const proteinLeft = (nutritionData.protein_goal || 0) - (nutritionData.protein_consumed || 0)
      const carbsLeft = (nutritionData.carbs_goal || 0) - (nutritionData.carbs_consumed || 0)
      const fatLeft = (nutritionData.fat_goal || 0) - (nutritionData.fat_consumed || 0)

      const dailyNutrition: DailyNutrition = {
        date: targetDate,
        caloriesGoal: nutritionData.calories_goal || 0,
        proteinGoal: nutritionData.protein_goal || 0,
        carbsGoal: nutritionData.carbs_goal || 0,
        fatGoal: nutritionData.fat_goal || 0,
        caloriesConsumed: nutritionData.calories_consumed || 0,
        proteinConsumed: nutritionData.protein_consumed || 0,
        carbsConsumed: nutritionData.carbs_consumed || 0,
        fatConsumed: nutritionData.fat_consumed || 0,
        caloriesLeft: Math.max(0, caloriesLeft), // Never show negative
        proteinLeft: Math.max(0, proteinLeft),
        carbsLeft: Math.max(0, carbsLeft),
        fatLeft: Math.max(0, fatLeft)
      }

      console.log('✅ Daily nutrition calculated:', {
        calories: `${dailyNutrition.caloriesConsumed}/${dailyNutrition.caloriesGoal} (${dailyNutrition.caloriesLeft} left)`,
        protein: `${dailyNutrition.proteinConsumed}g/${dailyNutrition.proteinGoal}g (${dailyNutrition.proteinLeft}g left)`,
        carbs: `${dailyNutrition.carbsConsumed}g/${dailyNutrition.carbsGoal}g (${dailyNutrition.carbsLeft}g left)`,
        fat: `${dailyNutrition.fatConsumed}g/${dailyNutrition.fatGoal}g (${dailyNutrition.fatLeft}g left)`
      })

      return {
        success: true,
        data: dailyNutrition
      }
    } catch (err) {
      console.error('❌ Unexpected error in getDailyNutrition:', err)
      return {
        success: false,
        error: 'Failed to get daily nutrition'
      }
    }
  }

  /**
   * Check if we need to reset daily nutrition (new day)
   * This is handled automatically by the database function using CURRENT_DATE
   */
  static async shouldResetDailyNutrition(userId: string): Promise<boolean> {
    try {
      // Get user's timezone from profile
      const { data: userProfile, error } = await supabase
        .from('users')
        .select('timezone')
        .eq('id', userId)
        .single()

      if (error || !userProfile) {
        console.log('⚠️ No user profile found, using UTC for daily reset check')
        return false // Let database handle with UTC
      }

      // For now, let the database function handle the date logic
      // In the future, we could add timezone-aware logic here
      return false
    } catch (err) {
      console.error('❌ Error checking daily reset:', err)
      return false
    }
  }

  /**
   * Get default nutrition values for new users or fallback
   */
  static getDefaultNutrition(): DailyNutrition {
    return {
      date: new Date().toISOString().split('T')[0],
      caloriesGoal: 2000,
      proteinGoal: 150,
      carbsGoal: 250,
      fatGoal: 67,
      caloriesConsumed: 0,
      proteinConsumed: 0,
      carbsConsumed: 0,
      fatConsumed: 0,
      caloriesLeft: 2000,
      proteinLeft: 150,
      carbsLeft: 250,
      fatLeft: 67
    }
  }
} 