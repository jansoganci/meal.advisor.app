import type { QuickMealSuggestion } from '@/lib/ai/types'
import type { Recipe } from '@/lib/database'
import { recipeUtils } from '@/lib/recipe-utils'
import { supabase } from './supabase'

// Extended type for favorites with recipe data
export interface FavoriteRecipe extends Recipe {
  favorite_id: string
  added_at: string
  notes: string | null
}

// Favorites service following established database patterns
export const favoritesService = {
  // Get user's favorites with optional search
  async getUserFavorites(userId: string, searchQuery?: string): Promise<FavoriteRecipe[]> {
    console.log('🔍 Fetching favorites for user:', userId);
    
    try {
      let query = supabase
        .from('recipe_favorites')
        .select(`
          id,
          added_at,
          notes,
          recipes!inner (
            id,
            user_id,
            title,
            description,
            cuisine_type,
            meal_type,
            difficulty_level,
            prep_time_minutes,
            cook_time_minutes,
            total_time_minutes,
            servings,
            calories,
            protein_g,
            carbs_g,
            fat_g,
            fiber_g,
            sugar_g,
            sodium_mg,
            ingredients,
            instructions,
            equipment,
            dietary_tags,
            allergen_info,
            spice_level,
            image_url,
            video_url,
            ai_generated,
            ai_model_used,
            generation_prompt,
            generation_cost,
            is_public,
            is_curated,
            is_verified,
            save_count,
            average_rating,
            rating_count,
            created_at,
            updated_at
          )
        `)
        .eq('user_id', userId)
        .order('added_at', { ascending: false })

      // Add search filter if provided
      if (searchQuery && searchQuery.trim()) {
        query = query.ilike('recipes.title', `%${searchQuery.trim()}%`)
      }

      const { data, error } = await query

      console.log('📊 Query result:', { data, error, dataLength: data?.length });

      if (error) {
        console.error('❌ Error fetching user favorites:', error)
        return []
      }

      if (!data || data.length === 0) {
        console.log('📭 No favorites found for user');
        return []
      }

      // Transform the joined data to match FavoriteRecipe interface
      const transformedData = data.map((item: any) => {
        console.log('🔄 Transforming item:', item);
        return {
          ...(item.recipes as Recipe),
          favorite_id: item.id,
          added_at: item.added_at,
          notes: item.notes
        } as FavoriteRecipe;
      });

      console.log('✅ Transformed favorites:', transformedData.length, 'items');
      return transformedData;

    } catch (err) {
      console.error('💥 Unexpected error fetching favorites:', err);
      return [];
    }
  },

  // Add recipe to favorites (with duplicate prevention via unique constraint)
  async addToFavorites(userId: string, recipeData: QuickMealSuggestion): Promise<{ success: boolean; recipeId?: string; error?: string }> {
    try {
      // First, create or get the recipe
      const recipeResult = await this.createOrGetRecipe(userId, recipeData)
      if (!recipeResult.success) {
        return { success: false, error: recipeResult.error || 'Failed to create recipe' }
      }

      // Then add to favorites (duplicate constraint will prevent duplicates)
      const { data, error } = await supabase
        .from('recipe_favorites')
        .insert({
          user_id: userId,
          recipe_id: recipeResult.recipeId!,
        })
        .select()
        .single()

      if (error) {
        // Check if it's a duplicate error
        if (error.code === '23505') { // Unique constraint violation
          return { success: false, error: 'Recipe is already in your favorites' }
        }
        console.error('Error adding to favorites:', error)
        return { success: false, error: 'Failed to add to favorites' }
      }

      return { success: true, recipeId: recipeResult.recipeId! }
    } catch (err) {
      console.error('Unexpected error adding to favorites:', err)
      return { success: false, error: 'An unexpected error occurred' }
    }
  },

  // Remove recipe from favorites
  async removeFromFavorites(userId: string, recipeId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('recipe_favorites')
        .delete()
        .eq('user_id', userId)
        .eq('recipe_id', recipeId)

      if (error) {
        console.error('Error removing from favorites:', error)
        return { success: false, error: 'Failed to remove from favorites' }
      }

      return { success: true }
    } catch (err) {
      console.error('Unexpected error removing from favorites:', err)
      return { success: false, error: 'An unexpected error occurred' }
    }
  },

  // Check if recipe is favorited by user
  async isFavorited(userId: string, recipeId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('recipe_favorites')
        .select('id')
        .eq('user_id', userId)
        .eq('recipe_id', recipeId)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error checking favorite status:', error)
        return false
      }

      return !!data
    } catch (err) {
      console.error('Unexpected error checking favorite status:', err)
      return false
    }
  },

  // Get total favorites count for user
  async getFavoritesCount(userId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('recipe_favorites')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)

      if (error) {
        console.error('Error getting favorites count:', error)
        return 0
      }

      return count || 0
    } catch (err) {
      console.error('Unexpected error getting favorites count:', err)
      return 0
    }
  },

  // Helper: Create or get existing recipe from QuickMealSuggestion
  async createOrGetRecipe(userId: string, suggestion: QuickMealSuggestion): Promise<{ success: boolean; recipeId?: string; error?: string }> {
    try {
      console.log('🍽️ Creating/getting recipe for user:', userId, 'title:', suggestion.title);
      
      // Check if recipe already exists using fingerprint
      const fingerprint = recipeUtils.generateRecipeFingerprint(suggestion)
      console.log('🔍 Checking for existing recipe with fingerprint:', fingerprint);
      
      const { data: existingRecipe, error: searchError } = await supabase
        .from('recipes')
        .select('id')
        .eq('user_id', userId)
        .eq('title', suggestion.title)
        .eq('description', suggestion.description)
        .single()

      if (existingRecipe) {
        console.log('✅ Found existing recipe:', existingRecipe.id);
        return { success: true, recipeId: existingRecipe.id }
      }

      console.log('🆕 Creating new recipe...');

      // Create new recipe using recipe utils
      const recipeData = recipeUtils.convertSuggestionToRecipe(suggestion, userId)
      console.log('📝 Recipe data to insert:', recipeData);
      
      // Validate recipe data
      const validation = recipeUtils.validateRecipeData(recipeData)
      if (!validation.isValid) {
        console.error('❌ Recipe validation failed:', validation.errors)
        return { success: false, error: 'Invalid recipe data: ' + validation.errors.join(', ') }
      }

      const { data, error } = await supabase
        .from('recipes')
        .insert(recipeData)
        .select('id')
        .single()

      if (error) {
        console.error('❌ Error creating recipe:', error)
        return { success: false, error: 'Failed to create recipe' }
      }

      console.log('✅ Recipe created successfully:', data.id);
      return { success: true, recipeId: data.id }
    } catch (err) {
      console.error('💥 Unexpected error creating recipe:', err)
      return { success: false, error: 'An unexpected error occurred' }
    }
  }
} 