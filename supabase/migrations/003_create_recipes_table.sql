-- Create recipes table for saved recipes with AI integration
-- This stores both AI-generated and user-created recipes

CREATE TABLE IF NOT EXISTS public.recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL, -- NULL for system/curated recipes
  
  -- Basic Recipe Information
  title TEXT NOT NULL,
  description TEXT,
  cuisine_type TEXT,
  meal_type TEXT[] DEFAULT '{}', -- Array: breakfast, lunch, dinner, snack
  difficulty_level TEXT CHECK (difficulty_level IN ('easy', 'medium', 'hard')),
  
  -- Timing
  prep_time_minutes INTEGER CHECK (prep_time_minutes >= 0),
  cook_time_minutes INTEGER CHECK (cook_time_minutes >= 0),
  total_time_minutes INTEGER GENERATED ALWAYS AS (prep_time_minutes + cook_time_minutes) STORED,
  servings INTEGER NOT NULL CHECK (servings >= 1 AND servings <= 20),
  
  -- Nutrition Information (per serving)
  calories INTEGER,
  protein_g DECIMAL(5,2),
  carbs_g DECIMAL(5,2),
  fat_g DECIMAL(5,2),
  fiber_g DECIMAL(5,2),
  sugar_g DECIMAL(5,2),
  sodium_mg INTEGER,
  
  -- Recipe Content
  ingredients JSONB NOT NULL, -- Array of {name, amount, unit, notes}
  instructions JSONB NOT NULL, -- Array of {step, instruction, duration_minutes}
  equipment TEXT[], -- Array of required equipment
  
  -- Dietary & Preferences
  dietary_tags TEXT[], -- vegan, vegetarian, gluten-free, keto, etc.
  allergen_info TEXT[], -- contains nuts, dairy, eggs, etc.
  spice_level TEXT CHECK (spice_level IN ('mild', 'medium', 'hot', 'very_hot')),
  
  -- Media
  image_url TEXT,
  video_url TEXT,
  
  -- AI Generation
  ai_generated BOOLEAN DEFAULT FALSE,
  ai_model_used TEXT,
  generation_prompt TEXT,
  generation_cost DECIMAL(10,4),
  
  -- Recipe Status
  is_public BOOLEAN DEFAULT FALSE,
  is_curated BOOLEAN DEFAULT FALSE, -- System curated recipes
  is_verified BOOLEAN DEFAULT FALSE, -- Verified by admin/nutritionist
  
  -- User Interaction
  save_count INTEGER DEFAULT 0,
  average_rating DECIMAL(3,2) DEFAULT 0.0 CHECK (average_rating >= 0 AND average_rating <= 5),
  rating_count INTEGER DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_title CHECK (LENGTH(title) >= 3 AND LENGTH(title) <= 200),
  CONSTRAINT valid_servings_nutrition CHECK (
    (calories IS NULL OR calories >= 0) AND
    (protein_g IS NULL OR protein_g >= 0) AND
    (carbs_g IS NULL OR carbs_g >= 0) AND
    (fat_g IS NULL OR fat_g >= 0)
  )
);

-- Create recipe_ratings table for user ratings
CREATE TABLE IF NOT EXISTS public.recipe_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  
  -- Rating Details
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  difficulty_rating INTEGER CHECK (difficulty_rating >= 1 AND difficulty_rating <= 5),
  
  -- Cooking Experience
  actual_prep_time_minutes INTEGER,
  actual_cook_time_minutes INTEGER,
  would_make_again BOOLEAN,
  
  -- Modifications
  modifications_made TEXT,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(recipe_id, user_id)
);

-- Create recipe_favorites table for user favorites
CREATE TABLE IF NOT EXISTS public.recipe_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  
  -- Favorite Details
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT,
  
  -- Constraints
  UNIQUE(recipe_id, user_id)
);

-- Create recipe_tags table for flexible tagging
CREATE TABLE IF NOT EXISTS public.recipe_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
  tag_name TEXT NOT NULL,
  tag_category TEXT, -- dietary, cuisine, difficulty, etc.
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(recipe_id, tag_name)
);

-- Create shopping_lists table
CREATE TABLE IF NOT EXISTS public.shopping_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  
  -- List Details
  title TEXT NOT NULL,
  description TEXT,
  
  -- Source Information
  meal_plan_id UUID REFERENCES public.meal_plans(id) ON DELETE SET NULL,
  recipe_ids UUID[], -- Array of recipe IDs that contributed to this list
  
  -- List Status
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_title CHECK (LENGTH(title) >= 1 AND LENGTH(title) <= 100)
);

-- Create shopping_list_items table
CREATE TABLE IF NOT EXISTS public.shopping_list_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shopping_list_id UUID NOT NULL REFERENCES public.shopping_lists(id) ON DELETE CASCADE,
  
  -- Item Details
  name TEXT NOT NULL,
  quantity DECIMAL(10,2),
  unit TEXT,
  category TEXT, -- produce, dairy, meat, etc.
  notes TEXT,
  
  -- Item Status
  is_purchased BOOLEAN DEFAULT FALSE,
  purchased_at TIMESTAMP WITH TIME ZONE,
  
  -- Source Tracking
  recipe_id UUID REFERENCES public.recipes(id) ON DELETE SET NULL,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_quantity CHECK (quantity IS NULL OR quantity > 0)
);

-- Create updated_at triggers
CREATE TRIGGER update_recipes_updated_at
  BEFORE UPDATE ON public.recipes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_recipe_ratings_updated_at
  BEFORE UPDATE ON public.recipe_ratings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_shopping_lists_updated_at
  BEFORE UPDATE ON public.shopping_lists
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_shopping_list_items_updated_at
  BEFORE UPDATE ON public.shopping_list_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS recipes_user_id_idx ON public.recipes(user_id);
CREATE INDEX IF NOT EXISTS recipes_cuisine_type_idx ON public.recipes(cuisine_type);
CREATE INDEX IF NOT EXISTS recipes_meal_type_idx ON public.recipes USING GIN(meal_type);
CREATE INDEX IF NOT EXISTS recipes_difficulty_level_idx ON public.recipes(difficulty_level);
CREATE INDEX IF NOT EXISTS recipes_total_time_idx ON public.recipes(total_time_minutes);
CREATE INDEX IF NOT EXISTS recipes_calories_idx ON public.recipes(calories);
CREATE INDEX IF NOT EXISTS recipes_dietary_tags_idx ON public.recipes USING GIN(dietary_tags);
CREATE INDEX IF NOT EXISTS recipes_is_public_idx ON public.recipes(is_public);
CREATE INDEX IF NOT EXISTS recipes_is_curated_idx ON public.recipes(is_curated);
CREATE INDEX IF NOT EXISTS recipes_average_rating_idx ON public.recipes(average_rating);
CREATE INDEX IF NOT EXISTS recipes_save_count_idx ON public.recipes(save_count);
CREATE INDEX IF NOT EXISTS recipes_created_at_idx ON public.recipes(created_at);

CREATE INDEX IF NOT EXISTS recipe_ratings_recipe_id_idx ON public.recipe_ratings(recipe_id);
CREATE INDEX IF NOT EXISTS recipe_ratings_user_id_idx ON public.recipe_ratings(user_id);
CREATE INDEX IF NOT EXISTS recipe_ratings_rating_idx ON public.recipe_ratings(rating);

CREATE INDEX IF NOT EXISTS recipe_favorites_recipe_id_idx ON public.recipe_favorites(recipe_id);
CREATE INDEX IF NOT EXISTS recipe_favorites_user_id_idx ON public.recipe_favorites(user_id);

CREATE INDEX IF NOT EXISTS recipe_tags_recipe_id_idx ON public.recipe_tags(recipe_id);
CREATE INDEX IF NOT EXISTS recipe_tags_tag_name_idx ON public.recipe_tags(tag_name);
CREATE INDEX IF NOT EXISTS recipe_tags_tag_category_idx ON public.recipe_tags(tag_category);

CREATE INDEX IF NOT EXISTS shopping_lists_user_id_idx ON public.shopping_lists(user_id);
CREATE INDEX IF NOT EXISTS shopping_lists_meal_plan_id_idx ON public.shopping_lists(meal_plan_id);

CREATE INDEX IF NOT EXISTS shopping_list_items_list_id_idx ON public.shopping_list_items(shopping_list_id);
CREATE INDEX IF NOT EXISTS shopping_list_items_category_idx ON public.shopping_list_items(category);
CREATE INDEX IF NOT EXISTS shopping_list_items_purchased_idx ON public.shopping_list_items(is_purchased);

-- Row Level Security (RLS)
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipe_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipe_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipe_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopping_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopping_list_items ENABLE ROW LEVEL SECURITY;

-- Recipes RLS Policies
CREATE POLICY "Anyone can view public recipes" ON public.recipes
  FOR SELECT USING (is_public = TRUE OR is_curated = TRUE);

CREATE POLICY "Users can view own recipes" ON public.recipes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create recipes" ON public.recipes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own recipes" ON public.recipes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own recipes" ON public.recipes
  FOR DELETE USING (auth.uid() = user_id);

-- Recipe Ratings RLS Policies
CREATE POLICY "Users can view recipe ratings" ON public.recipe_ratings
  FOR SELECT USING (TRUE); -- Public ratings for transparency

CREATE POLICY "Users can create own ratings" ON public.recipe_ratings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ratings" ON public.recipe_ratings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own ratings" ON public.recipe_ratings
  FOR DELETE USING (auth.uid() = user_id);

-- Recipe Favorites RLS Policies
CREATE POLICY "Users can view own favorites" ON public.recipe_favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own favorites" ON public.recipe_favorites
  FOR ALL USING (auth.uid() = user_id);

-- Recipe Tags RLS Policies
CREATE POLICY "Anyone can view recipe tags" ON public.recipe_tags
  FOR SELECT USING (TRUE);

CREATE POLICY "Recipe owners can manage tags" ON public.recipe_tags
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.recipes 
      WHERE recipes.id = recipe_tags.recipe_id 
      AND recipes.user_id = auth.uid()
    )
  );

-- Shopping Lists RLS Policies
CREATE POLICY "Users can view own shopping lists" ON public.shopping_lists
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own shopping lists" ON public.shopping_lists
  FOR ALL USING (auth.uid() = user_id);

-- Shopping List Items RLS Policies
CREATE POLICY "Users can view own shopping list items" ON public.shopping_list_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.shopping_lists 
      WHERE shopping_lists.id = shopping_list_items.shopping_list_id 
      AND shopping_lists.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own shopping list items" ON public.shopping_list_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.shopping_lists 
      WHERE shopping_lists.id = shopping_list_items.shopping_list_id 
      AND shopping_lists.user_id = auth.uid()
    )
  );

-- Function to update recipe rating statistics
CREATE OR REPLACE FUNCTION public.update_recipe_rating_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the recipe's average rating and count
  UPDATE public.recipes
  SET 
    average_rating = (
      SELECT COALESCE(AVG(rating), 0)
      FROM public.recipe_ratings
      WHERE recipe_id = COALESCE(NEW.recipe_id, OLD.recipe_id)
    ),
    rating_count = (
      SELECT COUNT(*)
      FROM public.recipe_ratings
      WHERE recipe_id = COALESCE(NEW.recipe_id, OLD.recipe_id)
    )
  WHERE id = COALESCE(NEW.recipe_id, OLD.recipe_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger to update recipe rating statistics
CREATE TRIGGER update_recipe_rating_stats_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.recipe_ratings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_recipe_rating_stats();

-- Function to update recipe save count
CREATE OR REPLACE FUNCTION public.update_recipe_save_count()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the recipe's save count
  UPDATE public.recipes
  SET save_count = (
    SELECT COUNT(*)
    FROM public.recipe_favorites
    WHERE recipe_id = COALESCE(NEW.recipe_id, OLD.recipe_id)
  )
  WHERE id = COALESCE(NEW.recipe_id, OLD.recipe_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger to update recipe save count
CREATE TRIGGER update_recipe_save_count_trigger
  AFTER INSERT OR DELETE ON public.recipe_favorites
  FOR EACH ROW
  EXECUTE FUNCTION public.update_recipe_save_count();

-- Comments
COMMENT ON TABLE public.recipes IS 'Recipe database with AI-generated and user-created content';
COMMENT ON TABLE public.recipe_ratings IS 'User ratings and reviews for recipes';
COMMENT ON TABLE public.recipe_favorites IS 'User favorite recipes';
COMMENT ON TABLE public.recipe_tags IS 'Flexible tagging system for recipes';
COMMENT ON TABLE public.shopping_lists IS 'User shopping lists generated from meal plans';
COMMENT ON TABLE public.shopping_list_items IS 'Individual items in shopping lists';
COMMENT ON COLUMN public.recipes.ingredients IS 'JSON array of ingredients with amounts and units';
COMMENT ON COLUMN public.recipes.instructions IS 'JSON array of cooking instructions with steps';