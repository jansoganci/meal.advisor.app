-- Create meal_plans table for weekly/monthly meal planning
-- This stores user-generated meal plans with AI-generated content

CREATE TABLE IF NOT EXISTS public.meal_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  
  -- Plan Details
  title TEXT NOT NULL,
  description TEXT,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('weekly', 'monthly')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  
  -- Plan Configuration
  meals_per_day INTEGER NOT NULL DEFAULT 3 CHECK (meals_per_day >= 1 AND meals_per_day <= 6),
  target_calories INTEGER CHECK (target_calories >= 1000 AND target_calories <= 4000),
  target_protein_g INTEGER CHECK (target_protein_g >= 20 AND target_protein_g <= 300),
  target_carbs_g INTEGER CHECK (target_carbs_g >= 50 AND target_carbs_g <= 600),
  target_fat_g INTEGER CHECK (target_fat_g >= 20 AND target_fat_g <= 200),
  
  -- AI Generation Settings
  dietary_restrictions TEXT[], -- Array of dietary restrictions for this plan
  preferred_cuisines TEXT[], -- Array of preferred cuisines
  avoid_ingredients TEXT[], -- Array of ingredients to avoid
  cooking_time_preference TEXT CHECK (cooking_time_preference IN ('quick', 'medium', 'long', 'any')),
  difficulty_preference TEXT CHECK (difficulty_preference IN ('easy', 'medium', 'hard', 'any')),
  
  -- Plan Status
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed', 'archived')),
  is_favorite BOOLEAN DEFAULT FALSE,
  
  -- AI Integration
  ai_generated BOOLEAN DEFAULT TRUE,
  ai_model_used TEXT, -- Which AI model was used (deepseek, gemini, etc.)
  generation_prompt TEXT, -- The prompt used to generate this plan
  generation_cost DECIMAL(10,4), -- Cost of AI generation in USD
  
  -- Sharing & Collaboration
  is_public BOOLEAN DEFAULT FALSE,
  sharing_code TEXT UNIQUE, -- Unique code for sharing plans
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_date_range CHECK (end_date >= start_date),
  CONSTRAINT valid_title CHECK (LENGTH(title) >= 3 AND LENGTH(title) <= 100)
);

-- Create meal_plan_days table for individual days within plans
CREATE TABLE IF NOT EXISTS public.meal_plan_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_plan_id UUID NOT NULL REFERENCES public.meal_plans(id) ON DELETE CASCADE,
  
  -- Day Details
  day_date DATE NOT NULL,
  day_name TEXT NOT NULL, -- Monday, Tuesday, etc.
  day_order INTEGER NOT NULL, -- 1-7 for weekly, 1-31 for monthly
  
  -- Daily Nutrition Targets
  target_calories INTEGER,
  target_protein_g INTEGER,
  target_carbs_g INTEGER,
  target_fat_g INTEGER,
  
  -- Daily Status
  is_completed BOOLEAN DEFAULT FALSE,
  completion_date TIMESTAMP WITH TIME ZONE,
  
  -- Notes
  notes TEXT,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(meal_plan_id, day_date)
);

-- Create meal_plan_meals table for individual meals within days
CREATE TABLE IF NOT EXISTS public.meal_plan_meals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_plan_day_id UUID NOT NULL REFERENCES public.meal_plan_days(id) ON DELETE CASCADE,
  
  -- Meal Details
  meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  meal_order INTEGER NOT NULL, -- Order within the day
  
  -- Recipe Reference (can be null for custom meals)
  recipe_id UUID, -- Will reference recipes table
  
  -- Custom Meal Details (for non-recipe meals)
  custom_meal_name TEXT,
  custom_meal_description TEXT,
  custom_meal_instructions TEXT,
  
  -- Nutrition Information
  calories INTEGER,
  protein_g DECIMAL(5,2),
  carbs_g DECIMAL(5,2),
  fat_g DECIMAL(5,2),
  fiber_g DECIMAL(5,2),
  sugar_g DECIMAL(5,2),
  sodium_mg INTEGER,
  
  -- Meal Status
  is_completed BOOLEAN DEFAULT FALSE,
  completion_date TIMESTAMP WITH TIME ZONE,
  user_rating INTEGER CHECK (user_rating >= 1 AND user_rating <= 5),
  user_notes TEXT,
  
  -- Substitutions
  original_recipe_id UUID, -- If this meal is a substitution
  substitution_reason TEXT,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_meal_reference CHECK (
    (recipe_id IS NOT NULL AND custom_meal_name IS NULL) OR
    (recipe_id IS NULL AND custom_meal_name IS NOT NULL)
  ),
  UNIQUE(meal_plan_day_id, meal_type, meal_order)
);

-- Create updated_at triggers
CREATE TRIGGER update_meal_plans_updated_at
  BEFORE UPDATE ON public.meal_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_meal_plan_days_updated_at
  BEFORE UPDATE ON public.meal_plan_days
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_meal_plan_meals_updated_at
  BEFORE UPDATE ON public.meal_plan_meals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS meal_plans_user_id_idx ON public.meal_plans(user_id);
CREATE INDEX IF NOT EXISTS meal_plans_status_idx ON public.meal_plans(status);
CREATE INDEX IF NOT EXISTS meal_plans_start_date_idx ON public.meal_plans(start_date);
CREATE INDEX IF NOT EXISTS meal_plans_is_favorite_idx ON public.meal_plans(is_favorite);
CREATE INDEX IF NOT EXISTS meal_plans_sharing_code_idx ON public.meal_plans(sharing_code);

CREATE INDEX IF NOT EXISTS meal_plan_days_meal_plan_id_idx ON public.meal_plan_days(meal_plan_id);
CREATE INDEX IF NOT EXISTS meal_plan_days_day_date_idx ON public.meal_plan_days(day_date);

CREATE INDEX IF NOT EXISTS meal_plan_meals_day_id_idx ON public.meal_plan_meals(meal_plan_day_id);
CREATE INDEX IF NOT EXISTS meal_plan_meals_recipe_id_idx ON public.meal_plan_meals(recipe_id);
CREATE INDEX IF NOT EXISTS meal_plan_meals_meal_type_idx ON public.meal_plan_meals(meal_type);

-- Row Level Security (RLS)
ALTER TABLE public.meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_plan_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_plan_meals ENABLE ROW LEVEL SECURITY;

-- Meal Plans RLS Policies
CREATE POLICY "Users can view own meal plans" ON public.meal_plans
  FOR SELECT USING (auth.uid() = user_id OR is_public = TRUE);

CREATE POLICY "Users can create own meal plans" ON public.meal_plans
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own meal plans" ON public.meal_plans
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own meal plans" ON public.meal_plans
  FOR DELETE USING (auth.uid() = user_id);

-- Meal Plan Days RLS Policies
CREATE POLICY "Users can view own meal plan days" ON public.meal_plan_days
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.meal_plans 
      WHERE meal_plans.id = meal_plan_days.meal_plan_id 
      AND (meal_plans.user_id = auth.uid() OR meal_plans.is_public = TRUE)
    )
  );

CREATE POLICY "Users can modify own meal plan days" ON public.meal_plan_days
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.meal_plans 
      WHERE meal_plans.id = meal_plan_days.meal_plan_id 
      AND meal_plans.user_id = auth.uid()
    )
  );

-- Meal Plan Meals RLS Policies
CREATE POLICY "Users can view own meal plan meals" ON public.meal_plan_meals
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.meal_plan_days 
      JOIN public.meal_plans ON meal_plans.id = meal_plan_days.meal_plan_id
      WHERE meal_plan_days.id = meal_plan_meals.meal_plan_day_id 
      AND (meal_plans.user_id = auth.uid() OR meal_plans.is_public = TRUE)
    )
  );

CREATE POLICY "Users can modify own meal plan meals" ON public.meal_plan_meals
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.meal_plan_days 
      JOIN public.meal_plans ON meal_plans.id = meal_plan_days.meal_plan_id
      WHERE meal_plan_days.id = meal_plan_meals.meal_plan_day_id 
      AND meal_plans.user_id = auth.uid()
    )
  );

-- Function to generate sharing code
CREATE OR REPLACE FUNCTION public.generate_sharing_code()
RETURNS TEXT AS $$
BEGIN
  RETURN UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8));
END;
$$ LANGUAGE plpgsql;

-- Function to calculate plan nutrition totals
CREATE OR REPLACE FUNCTION public.calculate_plan_nutrition(plan_id UUID)
RETURNS TABLE(
  total_calories BIGINT,
  total_protein NUMERIC,
  total_carbs NUMERIC,
  total_fat NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    SUM(ppm.calories)::BIGINT as total_calories,
    SUM(ppm.protein_g) as total_protein,
    SUM(ppm.carbs_g) as total_carbs,
    SUM(ppm.fat_g) as total_fat
  FROM public.meal_plan_meals ppm
  JOIN public.meal_plan_days ppd ON ppd.id = ppm.meal_plan_day_id
  WHERE ppd.meal_plan_id = plan_id;
END;
$$ LANGUAGE plpgsql;

-- Comments
COMMENT ON TABLE public.meal_plans IS 'User meal plans with AI-generated content and nutrition tracking';
COMMENT ON TABLE public.meal_plan_days IS 'Individual days within meal plans';
COMMENT ON TABLE public.meal_plan_meals IS 'Individual meals within meal plan days';
COMMENT ON COLUMN public.meal_plans.sharing_code IS 'Unique code for sharing meal plans with others';
COMMENT ON COLUMN public.meal_plans.generation_cost IS 'Cost of AI generation in USD for tracking expenses';