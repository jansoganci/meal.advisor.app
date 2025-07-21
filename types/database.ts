export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          age: number | null
          gender: string | null
          height_cm: number | null
          weight_kg: number | null
          allergies: string[] | null
          chronic_illnesses: string[] | null
          activity_level: string | null
          primary_goal: string | null
          dietary_preferences: string[] | null
          cuisine_preferences: string[] | null
          disliked_foods: string[] | null
          daily_calories: number | null
          daily_protein_g: number | null
          daily_carbs_g: number | null
          daily_fat_g: number | null
          preferred_language: string | null
          timezone: string | null
          notifications_enabled: boolean | null
          onboarding_completed: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          age?: number | null
          gender?: string | null
          height_cm?: number | null
          weight_kg?: number | null
          allergies?: string[] | null
          chronic_illnesses?: string[] | null
          activity_level?: string | null
          primary_goal?: string | null
          dietary_preferences?: string[] | null
          cuisine_preferences?: string[] | null
          disliked_foods?: string[] | null
          daily_calories?: number | null
          daily_protein_g?: number | null
          daily_carbs_g?: number | null
          daily_fat_g?: number | null
          preferred_language?: string | null
          timezone?: string | null
          notifications_enabled?: boolean | null
          onboarding_completed?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          age?: number | null
          gender?: string | null
          height_cm?: number | null
          weight_kg?: number | null
          allergies?: string[] | null
          chronic_illnesses?: string[] | null
          activity_level?: string | null
          primary_goal?: string | null
          dietary_preferences?: string[] | null
          cuisine_preferences?: string[] | null
          disliked_foods?: string[] | null
          daily_calories?: number | null
          daily_protein_g?: number | null
          daily_carbs_g?: number | null
          daily_fat_g?: number | null
          preferred_language?: string | null
          timezone?: string | null
          notifications_enabled?: boolean | null
          onboarding_completed?: boolean | null
          created_at?: string
          updated_at?: string
        }
      }
      recipes: {
        Row: {
          id: string
          user_id: string | null
          title: string
          description: string | null
          cuisine_type: string | null
          meal_type: string[] | null
          difficulty_level: string | null
          prep_time_minutes: number | null
          cook_time_minutes: number | null
          total_time_minutes: number | null
          servings: number
          calories: number | null
          protein_g: number | null
          carbs_g: number | null
          fat_g: number | null
          fiber_g: number | null
          sugar_g: number | null
          sodium_mg: number | null
          ingredients: any // JSONB
          instructions: any // JSONB
          equipment: string[] | null
          dietary_tags: string[] | null
          allergen_info: string[] | null
          spice_level: string | null
          image_url: string | null
          video_url: string | null
          ai_generated: boolean | null
          ai_model_used: string | null
          generation_prompt: string | null
          generation_cost: number | null
          is_public: boolean | null
          is_curated: boolean | null
          is_verified: boolean | null
          save_count: number | null
          average_rating: number | null
          rating_count: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          title: string
          description?: string | null
          cuisine_type?: string | null
          meal_type?: string[] | null
          difficulty_level?: string | null
          prep_time_minutes?: number | null
          cook_time_minutes?: number | null
          servings: number
          calories?: number | null
          protein_g?: number | null
          carbs_g?: number | null
          fat_g?: number | null
          fiber_g?: number | null
          sugar_g?: number | null
          sodium_mg?: number | null
          ingredients: any // JSONB
          instructions: any // JSONB
          equipment?: string[] | null
          dietary_tags?: string[] | null
          allergen_info?: string[] | null
          spice_level?: string | null
          image_url?: string | null
          video_url?: string | null
          ai_generated?: boolean | null
          ai_model_used?: string | null
          generation_prompt?: string | null
          generation_cost?: number | null
          is_public?: boolean | null
          is_curated?: boolean | null
          is_verified?: boolean | null
          save_count?: number | null
          average_rating?: number | null
          rating_count?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          title?: string
          description?: string | null
          cuisine_type?: string | null
          meal_type?: string[] | null
          difficulty_level?: string | null
          prep_time_minutes?: number | null
          cook_time_minutes?: number | null
          servings?: number
          calories?: number | null
          protein_g?: number | null
          carbs_g?: number | null
          fat_g?: number | null
          fiber_g?: number | null
          sugar_g?: number | null
          sodium_mg?: number | null
          ingredients?: any // JSONB
          instructions?: any // JSONB
          equipment?: string[] | null
          dietary_tags?: string[] | null
          allergen_info?: string[] | null
          spice_level?: string | null
          image_url?: string | null
          video_url?: string | null
          ai_generated?: boolean | null
          ai_model_used?: string | null
          generation_prompt?: string | null
          generation_cost?: number | null
          is_public?: boolean | null
          is_curated?: boolean | null
          is_verified?: boolean | null
          save_count?: number | null
          average_rating?: number | null
          rating_count?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      meal_plans: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          plan_type: string
          start_date: string
          end_date: string
          meals_per_day: number | null
          target_calories: number | null
          target_protein_g: number | null
          target_carbs_g: number | null
          target_fat_g: number | null
          dietary_restrictions: string[] | null
          preferred_cuisines: string[] | null
          avoid_ingredients: string[] | null
          cooking_time_preference: string | null
          difficulty_preference: string | null
          status: string | null
          is_favorite: boolean | null
          ai_generated: boolean | null
          ai_model_used: string | null
          generation_prompt: string | null
          generation_cost: number | null
          is_public: boolean | null
          sharing_code: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          plan_type: string
          start_date: string
          end_date: string
          meals_per_day?: number | null
          target_calories?: number | null
          target_protein_g?: number | null
          target_carbs_g?: number | null
          target_fat_g?: number | null
          dietary_restrictions?: string[] | null
          preferred_cuisines?: string[] | null
          avoid_ingredients?: string[] | null
          cooking_time_preference?: string | null
          difficulty_preference?: string | null
          status?: string | null
          is_favorite?: boolean | null
          ai_generated?: boolean | null
          ai_model_used?: string | null
          generation_prompt?: string | null
          generation_cost?: number | null
          is_public?: boolean | null
          sharing_code?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          plan_type?: string
          start_date?: string
          end_date?: string
          meals_per_day?: number | null
          target_calories?: number | null
          target_protein_g?: number | null
          target_carbs_g?: number | null
          target_fat_g?: number | null
          dietary_restrictions?: string[] | null
          preferred_cuisines?: string[] | null
          avoid_ingredients?: string[] | null
          cooking_time_preference?: string | null
          difficulty_preference?: string | null
          status?: string | null
          is_favorite?: boolean | null
          ai_generated?: boolean | null
          ai_model_used?: string | null
          generation_prompt?: string | null
          generation_cost?: number | null
          is_public?: boolean | null
          sharing_code?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      meal_plan_days: {
        Row: {
          id: string
          meal_plan_id: string
          day_date: string
          day_name: string
          day_order: number
          target_calories: number | null
          target_protein_g: number | null
          target_carbs_g: number | null
          target_fat_g: number | null
          is_completed: boolean | null
          completion_date: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          meal_plan_id: string
          day_date: string
          day_name: string
          day_order: number
          target_calories?: number | null
          target_protein_g?: number | null
          target_carbs_g?: number | null
          target_fat_g?: number | null
          is_completed?: boolean | null
          completion_date?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          meal_plan_id?: string
          day_date?: string
          day_name?: string
          day_order?: number
          target_calories?: number | null
          target_protein_g?: number | null
          target_carbs_g?: number | null
          target_fat_g?: number | null
          is_completed?: boolean | null
          completion_date?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      meal_plan_meals: {
        Row: {
          id: string
          meal_plan_day_id: string
          meal_type: string
          meal_order: number
          recipe_id: string | null
          custom_meal_name: string | null
          custom_meal_description: string | null
          custom_meal_instructions: string | null
          calories: number | null
          protein_g: number | null
          carbs_g: number | null
          fat_g: number | null
          fiber_g: number | null
          sugar_g: number | null
          sodium_mg: number | null
          is_completed: boolean | null
          completion_date: string | null
          user_rating: number | null
          user_notes: string | null
          original_recipe_id: string | null
          substitution_reason: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          meal_plan_day_id: string
          meal_type: string
          meal_order: number
          recipe_id?: string | null
          custom_meal_name?: string | null
          custom_meal_description?: string | null
          custom_meal_instructions?: string | null
          calories?: number | null
          protein_g?: number | null
          carbs_g?: number | null
          fat_g?: number | null
          fiber_g?: number | null
          sugar_g?: number | null
          sodium_mg?: number | null
          is_completed?: boolean | null
          completion_date?: string | null
          user_rating?: number | null
          user_notes?: string | null
          original_recipe_id?: string | null
          substitution_reason?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          meal_plan_day_id?: string
          meal_type?: string
          meal_order?: number
          recipe_id?: string | null
          custom_meal_name?: string | null
          custom_meal_description?: string | null
          custom_meal_instructions?: string | null
          calories?: number | null
          protein_g?: number | null
          carbs_g?: number | null
          fat_g?: number | null
          fiber_g?: number | null
          sugar_g?: number | null
          sodium_mg?: number | null
          is_completed?: boolean | null
          completion_date?: string | null
          user_rating?: number | null
          user_notes?: string | null
          original_recipe_id?: string | null
          substitution_reason?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      shopping_lists: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          meal_plan_id: string | null
          recipe_ids: string[] | null
          is_completed: boolean | null
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          meal_plan_id?: string | null
          recipe_ids?: string[] | null
          is_completed?: boolean | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          meal_plan_id?: string | null
          recipe_ids?: string[] | null
          is_completed?: boolean | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      shopping_list_items: {
        Row: {
          id: string
          shopping_list_id: string
          name: string
          quantity: number | null
          unit: string | null
          category: string | null
          notes: string | null
          is_purchased: boolean | null
          purchased_at: string | null
          recipe_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          shopping_list_id: string
          name: string
          quantity?: number | null
          unit?: string | null
          category?: string | null
          notes?: string | null
          is_purchased?: boolean | null
          purchased_at?: string | null
          recipe_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          shopping_list_id?: string
          name?: string
          quantity?: number | null
          unit?: string | null
          category?: string | null
          notes?: string | null
          is_purchased?: boolean | null
          purchased_at?: string | null
          recipe_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_preferences: {
        Row: {
          id: string
          user_id: string
          preferred_meal_times: any | null // JSONB
          max_cooking_time_minutes: number | null
          preferred_cooking_methods: string[] | null
          available_equipment: string[] | null
          cooking_skill_level: string | null
          strict_dietary_restrictions: string[] | null
          preference_dietary_tags: string[] | null
          ingredient_substitutions: any | null // JSONB
          preferred_stores: string[] | null
          budget_per_meal: number | null
          preferred_brands: string[] | null
          avoid_brands: string[] | null
          portion_size_multiplier: number | null
          leftover_preference: string | null
          nutrition_priority: string | null
          macro_distribution: any | null // JSONB
          ai_suggestion_frequency: string | null
          personalization_level: string | null
          surprise_factor: number | null
          meal_reminders: boolean | null
          shopping_reminders: boolean | null
          recipe_suggestions: boolean | null
          weekly_plan_reminders: boolean | null
          profile_visibility: string | null
          share_meal_plans: boolean | null
          share_recipes: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          preferred_meal_times?: any | null // JSONB
          max_cooking_time_minutes?: number | null
          preferred_cooking_methods?: string[] | null
          available_equipment?: string[] | null
          cooking_skill_level?: string | null
          strict_dietary_restrictions?: string[] | null
          preference_dietary_tags?: string[] | null
          ingredient_substitutions?: any | null // JSONB
          preferred_stores?: string[] | null
          budget_per_meal?: number | null
          preferred_brands?: string[] | null
          avoid_brands?: string[] | null
          portion_size_multiplier?: number | null
          leftover_preference?: string | null
          nutrition_priority?: string | null
          macro_distribution?: any | null // JSONB
          ai_suggestion_frequency?: string | null
          personalization_level?: string | null
          surprise_factor?: number | null
          meal_reminders?: boolean | null
          shopping_reminders?: boolean | null
          recipe_suggestions?: boolean | null
          weekly_plan_reminders?: boolean | null
          profile_visibility?: string | null
          share_meal_plans?: boolean | null
          share_recipes?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          preferred_meal_times?: any | null // JSONB
          max_cooking_time_minutes?: number | null
          preferred_cooking_methods?: string[] | null
          available_equipment?: string[] | null
          cooking_skill_level?: string | null
          strict_dietary_restrictions?: string[] | null
          preference_dietary_tags?: string[] | null
          ingredient_substitutions?: any | null // JSONB
          preferred_stores?: string[] | null
          budget_per_meal?: number | null
          preferred_brands?: string[] | null
          avoid_brands?: string[] | null
          portion_size_multiplier?: number | null
          leftover_preference?: string | null
          nutrition_priority?: string | null
          macro_distribution?: any | null // JSONB
          ai_suggestion_frequency?: string | null
          personalization_level?: string | null
          surprise_factor?: number | null
          meal_reminders?: boolean | null
          shopping_reminders?: boolean | null
          recipe_suggestions?: boolean | null
          weekly_plan_reminders?: boolean | null
          profile_visibility?: string | null
          share_meal_plans?: boolean | null
          share_recipes?: boolean | null
          created_at?: string
          updated_at?: string
        }
      }
      user_food_preferences: {
        Row: {
          id: string
          user_id: string
          food_name: string
          food_category: string | null
          preference_level: string
          context_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          food_name: string
          food_category?: string | null
          preference_level: string
          context_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          food_name?: string
          food_category?: string | null
          preference_level?: string
          context_notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_cuisine_preferences: {
        Row: {
          id: string
          user_id: string
          cuisine_name: string
          preference_level: string
          familiarity_level: string | null
          frequency_preference: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          cuisine_name: string
          preference_level: string
          familiarity_level?: string | null
          frequency_preference?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          cuisine_name?: string
          preference_level?: string
          familiarity_level?: string | null
          frequency_preference?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      recipe_ratings: {
        Row: {
          id: string
          recipe_id: string
          user_id: string
          rating: number
          review: string | null
          difficulty_rating: number | null
          actual_prep_time_minutes: number | null
          actual_cook_time_minutes: number | null
          would_make_again: boolean | null
          modifications_made: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          recipe_id: string
          user_id: string
          rating: number
          review?: string | null
          difficulty_rating?: number | null
          actual_prep_time_minutes?: number | null
          actual_cook_time_minutes?: number | null
          would_make_again?: boolean | null
          modifications_made?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          recipe_id?: string
          user_id?: string
          rating?: number
          review?: string | null
          difficulty_rating?: number | null
          actual_prep_time_minutes?: number | null
          actual_cook_time_minutes?: number | null
          would_make_again?: boolean | null
          modifications_made?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      recipe_favorites: {
        Row: {
          id: string
          recipe_id: string
          user_id: string
          added_at: string
          notes: string | null
        }
        Insert: {
          id?: string
          recipe_id: string
          user_id: string
          added_at?: string
          notes?: string | null
        }
        Update: {
          id?: string
          recipe_id?: string
          user_id?: string
          added_at?: string
          notes?: string | null
        }
      }
      recipe_tags: {
        Row: {
          id: string
          recipe_id: string
          tag_name: string
          tag_category: string | null
          created_at: string
        }
        Insert: {
          id?: string
          recipe_id: string
          tag_name: string
          tag_category?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          recipe_id?: string
          tag_name?: string
          tag_category?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}