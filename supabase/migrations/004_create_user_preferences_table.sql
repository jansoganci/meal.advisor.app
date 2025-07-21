-- Create user_preferences table for detailed user preferences
-- This table stores more granular preferences and settings beyond basic profile

CREATE TABLE IF NOT EXISTS public.user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  
  -- Meal Planning Preferences
  preferred_meal_times JSONB DEFAULT '{
    "breakfast": "08:00",
    "lunch": "12:00", 
    "dinner": "18:00",
    "snack": "15:00"
  }',
  
  -- Cooking Preferences
  max_cooking_time_minutes INTEGER DEFAULT 60 CHECK (max_cooking_time_minutes >= 5),
  preferred_cooking_methods TEXT[], -- baking, grilling, steaming, etc.
  available_equipment TEXT[], -- oven, stovetop, microwave, etc.
  cooking_skill_level TEXT DEFAULT 'beginner' CHECK (cooking_skill_level IN ('beginner', 'intermediate', 'advanced')),
  
  -- Dietary Restrictions & Preferences
  strict_dietary_restrictions TEXT[], -- Must be enforced
  preference_dietary_tags TEXT[], -- Preferred but not required
  ingredient_substitutions JSONB DEFAULT '{}', -- {original: substitute}
  
  -- Shopping & Budget Preferences
  preferred_stores TEXT[], -- Store names or types
  budget_per_meal DECIMAL(10,2) CHECK (budget_per_meal >= 0),
  preferred_brands TEXT[],
  avoid_brands TEXT[],
  
  -- Portion & Serving Preferences
  portion_size_multiplier DECIMAL(3,2) DEFAULT 1.0 CHECK (portion_size_multiplier > 0),
  leftover_preference TEXT DEFAULT 'moderate' CHECK (leftover_preference IN ('avoid', 'minimal', 'moderate', 'prefer')),
  
  -- Nutrition Focus
  nutrition_priority TEXT DEFAULT 'balanced' CHECK (nutrition_priority IN ('balanced', 'high_protein', 'low_carb', 'low_fat', 'high_fiber')),
  macro_distribution JSONB DEFAULT '{
    "protein_percent": 25,
    "carbs_percent": 45,
    "fat_percent": 30
  }',
  
  -- AI & Personalization Preferences
  ai_suggestion_frequency TEXT DEFAULT 'daily' CHECK (ai_suggestion_frequency IN ('never', 'weekly', 'daily', 'every_meal')),
  personalization_level TEXT DEFAULT 'medium' CHECK (personalization_level IN ('minimal', 'medium', 'high')),
  surprise_factor DECIMAL(3,2) DEFAULT 0.3 CHECK (surprise_factor >= 0 AND surprise_factor <= 1),
  
  -- Notification Preferences
  meal_reminders BOOLEAN DEFAULT TRUE,
  shopping_reminders BOOLEAN DEFAULT TRUE,
  recipe_suggestions BOOLEAN DEFAULT TRUE,
  weekly_plan_reminders BOOLEAN DEFAULT TRUE,
  
  -- Privacy & Sharing Preferences
  profile_visibility TEXT DEFAULT 'private' CHECK (profile_visibility IN ('private', 'friends', 'public')),
  share_meal_plans BOOLEAN DEFAULT FALSE,
  share_recipes BOOLEAN DEFAULT FALSE,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(user_id)
);

-- Create user_food_preferences table for detailed food preferences
CREATE TABLE IF NOT EXISTS public.user_food_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  
  -- Food Item
  food_name TEXT NOT NULL,
  food_category TEXT, -- protein, vegetable, grain, etc.
  
  -- Preference Level
  preference_level TEXT NOT NULL CHECK (preference_level IN ('love', 'like', 'neutral', 'dislike', 'hate', 'allergic')),
  
  -- Context
  context_notes TEXT, -- "only when cooked", "not for breakfast", etc.
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(user_id, food_name)
);

-- Create user_cuisine_preferences table for cuisine preferences
CREATE TABLE IF NOT EXISTS public.user_cuisine_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  
  -- Cuisine Details
  cuisine_name TEXT NOT NULL,
  preference_level TEXT NOT NULL CHECK (preference_level IN ('love', 'like', 'neutral', 'dislike', 'hate')),
  familiarity_level TEXT DEFAULT 'familiar' CHECK (familiarity_level IN ('unfamiliar', 'familiar', 'expert')),
  
  -- Frequency Preferences
  frequency_preference TEXT DEFAULT 'occasionally' CHECK (frequency_preference IN ('never', 'rarely', 'occasionally', 'often', 'always')),
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(user_id, cuisine_name)
);

-- Create user_nutrition_goals table for detailed nutrition tracking
CREATE TABLE IF NOT EXISTS public.user_nutrition_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  
  -- Goal Period
  goal_type TEXT NOT NULL CHECK (goal_type IN ('daily', 'weekly', 'monthly')),
  start_date DATE NOT NULL,
  end_date DATE,
  
  -- Macronutrient Goals
  calories_goal INTEGER CHECK (calories_goal >= 500 AND calories_goal <= 5000),
  protein_goal_g INTEGER CHECK (protein_goal_g >= 10 AND protein_goal_g <= 400),
  carbs_goal_g INTEGER CHECK (carbs_goal_g >= 20 AND carbs_goal_g <= 800),
  fat_goal_g INTEGER CHECK (fat_goal_g >= 10 AND fat_goal_g <= 300),
  
  -- Micronutrient Goals
  fiber_goal_g INTEGER CHECK (fiber_goal_g >= 5 AND fiber_goal_g <= 100),
  sodium_goal_mg INTEGER CHECK (sodium_goal_mg >= 500 AND sodium_goal_mg <= 5000),
  sugar_goal_g INTEGER CHECK (sugar_goal_g >= 0 AND sugar_goal_g <= 200),
  
  -- Goal Status
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_date_range CHECK (end_date IS NULL OR end_date >= start_date)
);

-- Create user_meal_history table for learning preferences
CREATE TABLE IF NOT EXISTS public.user_meal_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  
  -- Meal Details
  meal_date DATE NOT NULL,
  meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  
  -- Recipe Reference
  recipe_id UUID REFERENCES public.recipes(id) ON DELETE SET NULL,
  meal_plan_id UUID REFERENCES public.meal_plans(id) ON DELETE SET NULL,
  
  -- Custom Meal (if not from recipe)
  custom_meal_name TEXT,
  custom_meal_description TEXT,
  
  -- User Experience
  satisfaction_rating INTEGER CHECK (satisfaction_rating >= 1 AND satisfaction_rating <= 5),
  difficulty_rating INTEGER CHECK (difficulty_rating >= 1 AND difficulty_rating <= 5),
  would_eat_again BOOLEAN,
  
  -- Nutritional Information
  calories_consumed INTEGER,
  protein_consumed_g DECIMAL(5,2),
  carbs_consumed_g DECIMAL(5,2),
  fat_consumed_g DECIMAL(5,2),
  
  -- Context
  occasion TEXT, -- regular, special, social, etc.
  location TEXT, -- home, restaurant, work, etc.
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_meal_reference CHECK (
    (recipe_id IS NOT NULL AND custom_meal_name IS NULL) OR
    (recipe_id IS NULL AND custom_meal_name IS NOT NULL)
  )
);

-- Create updated_at triggers
CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_food_preferences_updated_at
  BEFORE UPDATE ON public.user_food_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_cuisine_preferences_updated_at
  BEFORE UPDATE ON public.user_cuisine_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_nutrition_goals_updated_at
  BEFORE UPDATE ON public.user_nutrition_goals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS user_preferences_user_id_idx ON public.user_preferences(user_id);
CREATE INDEX IF NOT EXISTS user_food_preferences_user_id_idx ON public.user_food_preferences(user_id);
CREATE INDEX IF NOT EXISTS user_food_preferences_food_name_idx ON public.user_food_preferences(food_name);
CREATE INDEX IF NOT EXISTS user_food_preferences_preference_level_idx ON public.user_food_preferences(preference_level);

CREATE INDEX IF NOT EXISTS user_cuisine_preferences_user_id_idx ON public.user_cuisine_preferences(user_id);
CREATE INDEX IF NOT EXISTS user_cuisine_preferences_cuisine_name_idx ON public.user_cuisine_preferences(cuisine_name);

CREATE INDEX IF NOT EXISTS user_nutrition_goals_user_id_idx ON public.user_nutrition_goals(user_id);
CREATE INDEX IF NOT EXISTS user_nutrition_goals_goal_type_idx ON public.user_nutrition_goals(goal_type);
CREATE INDEX IF NOT EXISTS user_nutrition_goals_is_active_idx ON public.user_nutrition_goals(is_active);

CREATE INDEX IF NOT EXISTS user_meal_history_user_id_idx ON public.user_meal_history(user_id);
CREATE INDEX IF NOT EXISTS user_meal_history_meal_date_idx ON public.user_meal_history(meal_date);
CREATE INDEX IF NOT EXISTS user_meal_history_recipe_id_idx ON public.user_meal_history(recipe_id);
CREATE INDEX IF NOT EXISTS user_meal_history_satisfaction_idx ON public.user_meal_history(satisfaction_rating);

-- Row Level Security (RLS)
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_food_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_cuisine_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_nutrition_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_meal_history ENABLE ROW LEVEL SECURITY;

-- User Preferences RLS Policies
CREATE POLICY "Users can view own preferences" ON public.user_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own preferences" ON public.user_preferences
  FOR ALL USING (auth.uid() = user_id);

-- User Food Preferences RLS Policies
CREATE POLICY "Users can view own food preferences" ON public.user_food_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own food preferences" ON public.user_food_preferences
  FOR ALL USING (auth.uid() = user_id);

-- User Cuisine Preferences RLS Policies
CREATE POLICY "Users can view own cuisine preferences" ON public.user_cuisine_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own cuisine preferences" ON public.user_cuisine_preferences
  FOR ALL USING (auth.uid() = user_id);

-- User Nutrition Goals RLS Policies
CREATE POLICY "Users can view own nutrition goals" ON public.user_nutrition_goals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own nutrition goals" ON public.user_nutrition_goals
  FOR ALL USING (auth.uid() = user_id);

-- User Meal History RLS Policies
CREATE POLICY "Users can view own meal history" ON public.user_meal_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own meal history" ON public.user_meal_history
  FOR ALL USING (auth.uid() = user_id);

-- Function to create default preferences for new users
CREATE OR REPLACE FUNCTION public.create_default_preferences()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_preferences (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create default preferences when user is created
CREATE TRIGGER create_default_preferences_trigger
  AFTER INSERT ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.create_default_preferences();

-- Function to get user food preference score
CREATE OR REPLACE FUNCTION public.get_food_preference_score(p_user_id UUID, p_food_name TEXT)
RETURNS INTEGER AS $$
DECLARE
  preference_score INTEGER;
BEGIN
  SELECT 
    CASE preference_level
      WHEN 'love' THEN 5
      WHEN 'like' THEN 4
      WHEN 'neutral' THEN 3
      WHEN 'dislike' THEN 2
      WHEN 'hate' THEN 1
      WHEN 'allergic' THEN 0
      ELSE 3
    END INTO preference_score
  FROM public.user_food_preferences
  WHERE user_id = p_user_id AND food_name = p_food_name;
  
  RETURN COALESCE(preference_score, 3); -- Default to neutral if no preference found
END;
$$ LANGUAGE plpgsql;

-- Function to get user cuisine preference score
CREATE OR REPLACE FUNCTION public.get_cuisine_preference_score(p_user_id UUID, p_cuisine_name TEXT)
RETURNS INTEGER AS $$
DECLARE
  preference_score INTEGER;
BEGIN
  SELECT 
    CASE preference_level
      WHEN 'love' THEN 5
      WHEN 'like' THEN 4
      WHEN 'neutral' THEN 3
      WHEN 'dislike' THEN 2
      WHEN 'hate' THEN 1
      ELSE 3
    END INTO preference_score
  FROM public.user_cuisine_preferences
  WHERE user_id = p_user_id AND cuisine_name = p_cuisine_name;
  
  RETURN COALESCE(preference_score, 3); -- Default to neutral if no preference found
END;
$$ LANGUAGE plpgsql;

-- Comments
COMMENT ON TABLE public.user_preferences IS 'Detailed user preferences for meal planning and AI personalization';
COMMENT ON TABLE public.user_food_preferences IS 'User preferences for specific foods and ingredients';
COMMENT ON TABLE public.user_cuisine_preferences IS 'User preferences for different cuisines';
COMMENT ON TABLE public.user_nutrition_goals IS 'User-defined nutrition goals and targets';
COMMENT ON TABLE public.user_meal_history IS 'Historical record of user meals for learning preferences';
COMMENT ON COLUMN public.user_preferences.surprise_factor IS 'How much variety/surprise user wants in recommendations (0-1)';
COMMENT ON COLUMN public.user_preferences.macro_distribution IS 'Preferred macronutrient distribution as percentages';