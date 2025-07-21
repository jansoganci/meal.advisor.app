import { supabase } from './supabase'
import type { Database } from '@/types/database'

// Database types
export type Tables = Database['public']['Tables']
export type User = Tables['users']['Row']
export type UserInsert = Tables['users']['Insert']
export type UserUpdate = Tables['users']['Update']

export type Recipe = Tables['recipes']['Row']
export type RecipeInsert = Tables['recipes']['Insert']
export type RecipeUpdate = Tables['recipes']['Update']

export type MealPlan = Tables['meal_plans']['Row']
export type MealPlanInsert = Tables['meal_plans']['Insert']
export type MealPlanUpdate = Tables['meal_plans']['Update']

export type MealPlanDay = Tables['meal_plan_days']['Row']
export type MealPlanMeal = Tables['meal_plan_meals']['Row']

export type ShoppingList = Tables['shopping_lists']['Row']
export type ShoppingListItem = Tables['shopping_list_items']['Row']

export type UserPreferences = Tables['user_preferences']['Row']
export type UserFoodPreferences = Tables['user_food_preferences']['Row']
export type UserCuisinePreferences = Tables['user_cuisine_preferences']['Row']

export type RecipeRating = Tables['recipe_ratings']['Row']
export type RecipeFavorite = Tables['recipe_favorites']['Row']

// Database utility functions
export const database = {
  // User operations
  users: {
    async getById(id: string): Promise<User | null> {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) {
        console.error('Error fetching user:', error)
        return null
      }
      
      return data
    },

    async update(id: string, updates: UserUpdate): Promise<User | null> {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) {
        console.error('Error updating user:', error)
        return null
      }
      
      return data
    },

    async updateNutritionTargets(userId: string): Promise<void> {
      const { error } = await supabase.rpc('update_user_nutrition_targets', {
        p_user_id: userId
      })
      
      if (error) {
        console.error('Error updating nutrition targets:', error)
      }
    }
  },

  // Recipe operations
  recipes: {
    async getPublic(limit: number = 20): Promise<Recipe[]> {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .or('is_public.eq.true,is_curated.eq.true')
        .order('average_rating', { ascending: false })
        .limit(limit)
      
      if (error) {
        console.error('Error fetching public recipes:', error)
        return []
      }
      
      return data || []
    },

    async getRecommendations(
      userId: string,
      mealType?: string,
      cuisineType?: string,
      maxTimeMinutes?: number,
      limit: number = 10
    ): Promise<Recipe[]> {
      const { data, error } = await supabase.rpc('get_recipe_recommendations', {
        p_user_id: userId,
        p_meal_type: mealType,
        p_cuisine_type: cuisineType,
        p_max_time_minutes: maxTimeMinutes,
        p_limit: limit
      })
      
      if (error) {
        console.error('Error fetching recipe recommendations:', error)
        return []
      }
      
      return data || []
    },

    async getById(id: string): Promise<Recipe | null> {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) {
        console.error('Error fetching recipe:', error)
        return null
      }
      
      return data
    },

    async create(recipe: RecipeInsert): Promise<Recipe | null> {
      const { data, error } = await supabase
        .from('recipes')
        .insert(recipe)
        .select()
        .single()
      
      if (error) {
        console.error('Error creating recipe:', error)
        return null
      }
      
      return data
    },

    async getUserFavorites(userId: string): Promise<Recipe[]> {
      const { data, error } = await supabase
        .from('recipe_favorites')
        .select('recipes(*)')
        .eq('user_id', userId)
        .order('added_at', { ascending: false })
      
      if (error) {
        console.error('Error fetching user favorites:', error)
        return []
      }
      
      return data.map(item => item.recipes).filter(Boolean) as Recipe[]
    },

    async addToFavorites(userId: string, recipeId: string): Promise<boolean> {
      const { error } = await supabase
        .from('recipe_favorites')
        .insert({ user_id: userId, recipe_id: recipeId })
      
      if (error) {
        console.error('Error adding to favorites:', error)
        return false
      }
      
      return true
    },

    async removeFromFavorites(userId: string, recipeId: string): Promise<boolean> {
      const { error } = await supabase
        .from('recipe_favorites')
        .delete()
        .eq('user_id', userId)
        .eq('recipe_id', recipeId)
      
      if (error) {
        console.error('Error removing from favorites:', error)
        return false
      }
      
      return true
    }
  },

  // Meal plan operations
  mealPlans: {
    async getUserPlans(userId: string): Promise<MealPlan[]> {
      const { data, error } = await supabase
        .from('meal_plans')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error fetching meal plans:', error)
        return []
      }
      
      return data || []
    },

    async getById(id: string): Promise<MealPlan | null> {
      const { data, error } = await supabase
        .from('meal_plans')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) {
        console.error('Error fetching meal plan:', error)
        return null
      }
      
      return data
    },

    async create(mealPlan: MealPlanInsert): Promise<MealPlan | null> {
      const { data, error } = await supabase
        .from('meal_plans')
        .insert(mealPlan)
        .select()
        .single()
      
      if (error) {
        console.error('Error creating meal plan:', error)
        return null
      }
      
      return data
    },

    async getPlanDays(planId: string): Promise<MealPlanDay[]> {
      const { data, error } = await supabase
        .from('meal_plan_days')
        .select('*')
        .eq('meal_plan_id', planId)
        .order('day_order', { ascending: true })
      
      if (error) {
        console.error('Error fetching meal plan days:', error)
        return []
      }
      
      return data || []
    },

    async getDayMeals(dayId: string): Promise<MealPlanMeal[]> {
      const { data, error } = await supabase
        .from('meal_plan_meals')
        .select('*')
        .eq('meal_plan_day_id', dayId)
        .order('meal_order', { ascending: true })
      
      if (error) {
        console.error('Error fetching day meals:', error)
        return []
      }
      
      return data || []
    },

    async generateFromRecipes(
      userId: string,
      title: string,
      startDate: string,
      endDate: string,
      recipeIds: string[]
    ): Promise<string | null> {
      const { data, error } = await supabase.rpc('generate_meal_plan_from_recipes', {
        p_user_id: userId,
        p_plan_title: title,
        p_start_date: startDate,
        p_end_date: endDate,
        p_recipe_ids: recipeIds
      })
      
      if (error) {
        console.error('Error generating meal plan:', error)
        return null
      }
      
      return data
    }
  },

  // Shopping list operations
  shoppingLists: {
    async getUserLists(userId: string): Promise<ShoppingList[]> {
      const { data, error } = await supabase
        .from('shopping_lists')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error fetching shopping lists:', error)
        return []
      }
      
      return data || []
    },

    async getItems(listId: string): Promise<ShoppingListItem[]> {
      const { data, error } = await supabase
        .from('shopping_list_items')
        .select('*')
        .eq('shopping_list_id', listId)
        .order('category', { ascending: true })
      
      if (error) {
        console.error('Error fetching shopping list items:', error)
        return []
      }
      
      return data || []
    },

    async createFromMealPlan(
      userId: string,
      mealPlanId: string,
      title?: string
    ): Promise<string | null> {
      const { data, error } = await supabase.rpc('create_shopping_list_from_meal_plan', {
        p_user_id: userId,
        p_meal_plan_id: mealPlanId,
        p_list_title: title
      })
      
      if (error) {
        console.error('Error creating shopping list:', error)
        return null
      }
      
      return data
    },

    async toggleItemPurchased(itemId: string, purchased: boolean): Promise<boolean> {
      const { error } = await supabase
        .from('shopping_list_items')
        .update({ 
          is_purchased: purchased,
          purchased_at: purchased ? new Date().toISOString() : null
        })
        .eq('id', itemId)
      
      if (error) {
        console.error('Error toggling item purchased:', error)
        return false
      }
      
      return true
    }
  },

  // User preferences operations
  preferences: {
    async getUserPreferences(userId: string): Promise<UserPreferences | null> {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .single()
      
      if (error) {
        console.error('Error fetching user preferences:', error)
        return null
      }
      
      return data
    },

    async updatePreferences(userId: string, preferences: Partial<UserPreferences>): Promise<boolean> {
      const { error } = await supabase
        .from('user_preferences')
        .update(preferences)
        .eq('user_id', userId)
      
      if (error) {
        console.error('Error updating preferences:', error)
        return false
      }
      
      return true
    },

    async getFoodPreferences(userId: string): Promise<UserFoodPreferences[]> {
      const { data, error } = await supabase
        .from('user_food_preferences')
        .select('*')
        .eq('user_id', userId)
        .order('food_name', { ascending: true })
      
      if (error) {
        console.error('Error fetching food preferences:', error)
        return []
      }
      
      return data || []
    },

    async getCuisinePreferences(userId: string): Promise<UserCuisinePreferences[]> {
      const { data, error } = await supabase
        .from('user_cuisine_preferences')
        .select('*')
        .eq('user_id', userId)
        .order('cuisine_name', { ascending: true })
      
      if (error) {
        console.error('Error fetching cuisine preferences:', error)
        return []
      }
      
      return data || []
    }
  },

  // Utility functions
  utils: {
    async checkRateLimit(
      userId: string,
      actionType: string,
      limit: number,
      windowMinutes: number = 60
    ): Promise<boolean> {
      const { data, error } = await supabase.rpc('check_rate_limit', {
        p_user_id: userId,
        p_action_type: actionType,
        p_limit: limit,
        p_window_minutes: windowMinutes
      })
      
      if (error) {
        console.error('Error checking rate limit:', error)
        return false
      }
      
      return data || false
    },

    async getUserNutritionSummary(
      userId: string,
      startDate: string,
      endDate: string
    ): Promise<any[]> {
      const { data, error } = await supabase.rpc('get_user_nutrition_summary', {
        p_user_id: userId,
        p_start_date: startDate,
        p_end_date: endDate
      })
      
      if (error) {
        console.error('Error fetching nutrition summary:', error)
        return []
      }
      
      return data || []
    }
  }
}