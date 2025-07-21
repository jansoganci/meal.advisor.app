-- Additional database functions and utilities for MealAdvisor

-- Function to calculate BMI
CREATE OR REPLACE FUNCTION public.calculate_bmi(height_cm INTEGER, weight_kg DECIMAL)
RETURNS DECIMAL AS $$
BEGIN
  IF height_cm IS NULL OR weight_kg IS NULL OR height_cm <= 0 OR weight_kg <= 0 THEN
    RETURN NULL;
  END IF;
  
  RETURN ROUND((weight_kg / POWER(height_cm / 100.0, 2))::DECIMAL, 2);
END;
$$ LANGUAGE plpgsql;

-- Function to calculate BMR (Basal Metabolic Rate) using Harris-Benedict equation
CREATE OR REPLACE FUNCTION public.calculate_bmr(
  age INTEGER,
  gender TEXT,
  height_cm INTEGER,
  weight_kg DECIMAL
)
RETURNS INTEGER AS $$
BEGIN
  IF age IS NULL OR gender IS NULL OR height_cm IS NULL OR weight_kg IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- Harris-Benedict equation
  IF gender = 'male' THEN
    RETURN ROUND(88.362 + (13.397 * weight_kg) + (4.799 * height_cm) - (5.677 * age));
  ELSIF gender = 'female' THEN
    RETURN ROUND(447.593 + (9.247 * weight_kg) + (3.098 * height_cm) - (4.330 * age));
  ELSE
    -- For other genders, use average of male and female calculations
    RETURN ROUND(
      (88.362 + (13.397 * weight_kg) + (4.799 * height_cm) - (5.677 * age) +
       447.593 + (9.247 * weight_kg) + (3.098 * height_cm) - (4.330 * age)) / 2
    );
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate daily calorie needs based on activity level
CREATE OR REPLACE FUNCTION public.calculate_daily_calories(
  age INTEGER,
  gender TEXT,
  height_cm INTEGER,
  weight_kg DECIMAL,
  activity_level TEXT
)
RETURNS INTEGER AS $$
DECLARE
  bmr INTEGER;
  activity_multiplier DECIMAL;
BEGIN
  -- Calculate BMR first
  bmr := public.calculate_bmr(age, gender, height_cm, weight_kg);
  
  IF bmr IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- Apply activity multiplier
  CASE activity_level
    WHEN 'sedentary' THEN activity_multiplier := 1.2;
    WHEN 'lightly_active' THEN activity_multiplier := 1.375;
    WHEN 'moderately_active' THEN activity_multiplier := 1.55;
    WHEN 'very_active' THEN activity_multiplier := 1.725;
    WHEN 'extremely_active' THEN activity_multiplier := 1.9;
    ELSE activity_multiplier := 1.375; -- Default to lightly active
  END CASE;
  
  RETURN ROUND(bmr * activity_multiplier);
END;
$$ LANGUAGE plpgsql;

-- Function to calculate macro targets based on goals
CREATE OR REPLACE FUNCTION public.calculate_macro_targets(
  daily_calories INTEGER,
  primary_goal TEXT
)
RETURNS TABLE(
  protein_g INTEGER,
  carbs_g INTEGER,
  fat_g INTEGER
) AS $$
DECLARE
  protein_percent DECIMAL;
  carbs_percent DECIMAL;
  fat_percent DECIMAL;
BEGIN
  -- Set macro percentages based on goal
  CASE primary_goal
    WHEN 'lose_weight' THEN
      protein_percent := 0.30;
      carbs_percent := 0.40;
      fat_percent := 0.30;
    WHEN 'gain_weight' THEN
      protein_percent := 0.25;
      carbs_percent := 0.50;
      fat_percent := 0.25;
    WHEN 'build_muscle' THEN
      protein_percent := 0.35;
      carbs_percent := 0.40;
      fat_percent := 0.25;
    WHEN 'improve_health' THEN
      protein_percent := 0.20;
      carbs_percent := 0.50;
      fat_percent := 0.30;
    ELSE -- maintain_weight
      protein_percent := 0.25;
      carbs_percent := 0.45;
      fat_percent := 0.30;
  END CASE;
  
  RETURN QUERY SELECT
    ROUND((daily_calories * protein_percent) / 4)::INTEGER, -- 4 calories per gram of protein
    ROUND((daily_calories * carbs_percent) / 4)::INTEGER,   -- 4 calories per gram of carbs
    ROUND((daily_calories * fat_percent) / 9)::INTEGER;     -- 9 calories per gram of fat
END;
$$ LANGUAGE plpgsql;

-- Function to update user nutrition targets
CREATE OR REPLACE FUNCTION public.update_user_nutrition_targets(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
  user_record RECORD;
  daily_calories INTEGER;
  macro_targets RECORD;
BEGIN
  -- Get user data
  SELECT age, gender, height_cm, weight_kg, activity_level, primary_goal
  INTO user_record
  FROM public.users
  WHERE id = p_user_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found';
  END IF;
  
  -- Calculate daily calories
  daily_calories := public.calculate_daily_calories(
    user_record.age,
    user_record.gender,
    user_record.height_cm,
    user_record.weight_kg,
    user_record.activity_level
  );
  
  -- Calculate macro targets
  SELECT * INTO macro_targets
  FROM public.calculate_macro_targets(daily_calories, user_record.primary_goal);
  
  -- Update user record
  UPDATE public.users
  SET
    daily_calories = daily_calories,
    daily_protein_g = macro_targets.protein_g,
    daily_carbs_g = macro_targets.carbs_g,
    daily_fat_g = macro_targets.fat_g
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- Function to generate meal plan from recipes
CREATE OR REPLACE FUNCTION public.generate_meal_plan_from_recipes(
  p_user_id UUID,
  p_plan_title TEXT,
  p_start_date DATE,
  p_end_date DATE,
  p_recipe_ids UUID[]
)
RETURNS UUID AS $$
DECLARE
  plan_id UUID;
  day_date DATE;
  day_id UUID;
  recipe_id UUID;
  recipe_data RECORD;
  meal_types TEXT[] := ARRAY['breakfast', 'lunch', 'dinner'];
  meal_type TEXT;
  recipe_index INTEGER := 1;
BEGIN
  -- Create meal plan
  INSERT INTO public.meal_plans (
    user_id,
    title,
    start_date,
    end_date,
    plan_type
  ) VALUES (
    p_user_id,
    p_plan_title,
    p_start_date,
    p_end_date,
    CASE WHEN p_end_date - p_start_date <= 7 THEN 'weekly' ELSE 'monthly' END
  ) RETURNING id INTO plan_id;
  
  -- Create days and meals
  day_date := p_start_date;
  WHILE day_date <= p_end_date LOOP
    -- Create meal plan day
    INSERT INTO public.meal_plan_days (
      meal_plan_id,
      day_date,
      day_name,
      day_order
    ) VALUES (
      plan_id,
      day_date,
      TO_CHAR(day_date, 'Day'),
      EXTRACT(DOW FROM day_date)
    ) RETURNING id INTO day_id;
    
    -- Add meals for this day
    FOREACH meal_type IN ARRAY meal_types LOOP
      IF recipe_index <= array_length(p_recipe_ids, 1) THEN
        recipe_id := p_recipe_ids[recipe_index];
        
        -- Get recipe data
        SELECT title, calories, protein_g, carbs_g, fat_g, fiber_g, sugar_g, sodium_mg
        INTO recipe_data
        FROM public.recipes
        WHERE id = recipe_id;
        
        -- Create meal
        INSERT INTO public.meal_plan_meals (
          meal_plan_day_id,
          meal_type,
          meal_order,
          recipe_id,
          calories,
          protein_g,
          carbs_g,
          fat_g,
          fiber_g,
          sugar_g,
          sodium_mg
        ) VALUES (
          day_id,
          meal_type,
          CASE meal_type
            WHEN 'breakfast' THEN 1
            WHEN 'lunch' THEN 2
            WHEN 'dinner' THEN 3
          END,
          recipe_id,
          recipe_data.calories,
          recipe_data.protein_g,
          recipe_data.carbs_g,
          recipe_data.fat_g,
          recipe_data.fiber_g,
          recipe_data.sugar_g,
          recipe_data.sodium_mg
        );
        
        recipe_index := recipe_index + 1;
      END IF;
    END LOOP;
    
    day_date := day_date + INTERVAL '1 day';
  END LOOP;
  
  RETURN plan_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get recipe recommendations based on user preferences
CREATE OR REPLACE FUNCTION public.get_recipe_recommendations(
  p_user_id UUID,
  p_meal_type TEXT DEFAULT NULL,
  p_cuisine_type TEXT DEFAULT NULL,
  p_max_time_minutes INTEGER DEFAULT NULL,
  p_limit INTEGER DEFAULT 10
)
RETURNS TABLE(
  recipe_id UUID,
  title TEXT,
  cuisine_type TEXT,
  total_time_minutes INTEGER,
  calories INTEGER,
  average_rating DECIMAL,
  preference_score INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    r.id,
    r.title,
    r.cuisine_type,
    r.total_time_minutes,
    r.calories,
    r.average_rating,
    (
      -- Calculate preference score based on user preferences
      CASE 
        WHEN r.cuisine_type IS NOT NULL THEN
          public.get_cuisine_preference_score(p_user_id, r.cuisine_type)
        ELSE 3
      END +
      -- Boost score for highly rated recipes
      CASE 
        WHEN r.average_rating >= 4.5 THEN 2
        WHEN r.average_rating >= 4.0 THEN 1
        ELSE 0
      END +
      -- Boost score for recipes with suitable cooking time
      CASE 
        WHEN p_max_time_minutes IS NULL OR r.total_time_minutes <= p_max_time_minutes THEN 1
        ELSE 0
      END
    ) as preference_score
  FROM public.recipes r
  LEFT JOIN public.users u ON u.id = p_user_id
  WHERE
    (r.is_public = TRUE OR r.user_id = p_user_id) AND
    (p_meal_type IS NULL OR p_meal_type = ANY(r.meal_type)) AND
    (p_cuisine_type IS NULL OR r.cuisine_type = p_cuisine_type) AND
    (p_max_time_minutes IS NULL OR r.total_time_minutes <= p_max_time_minutes) AND
    -- Exclude recipes with allergens
    (u.allergies IS NULL OR NOT EXISTS (
      SELECT 1 FROM unnest(u.allergies) as allergy
      WHERE allergy = ANY(r.allergen_info)
    ))
  ORDER BY preference_score DESC, r.average_rating DESC, r.save_count DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Function to create shopping list from meal plan
CREATE OR REPLACE FUNCTION public.create_shopping_list_from_meal_plan(
  p_user_id UUID,
  p_meal_plan_id UUID,
  p_list_title TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  shopping_list_id UUID;
  meal_plan_title TEXT;
  ingredient_item RECORD;
BEGIN
  -- Get meal plan title
  SELECT title INTO meal_plan_title
  FROM public.meal_plans
  WHERE id = p_meal_plan_id AND user_id = p_user_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Meal plan not found or access denied';
  END IF;
  
  -- Create shopping list
  INSERT INTO public.shopping_lists (
    user_id,
    title,
    meal_plan_id
  ) VALUES (
    p_user_id,
    COALESCE(p_list_title, 'Shopping List for ' || meal_plan_title),
    p_meal_plan_id
  ) RETURNING id INTO shopping_list_id;
  
  -- Aggregate ingredients from all recipes in the meal plan
  FOR ingredient_item IN
    SELECT
      (ingredient->>'name')::TEXT as ingredient_name,
      SUM((ingredient->>'amount')::DECIMAL) as total_amount,
      (ingredient->>'unit')::TEXT as unit,
      r.id as recipe_id
    FROM public.meal_plan_meals ppm
    JOIN public.meal_plan_days ppd ON ppd.id = ppm.meal_plan_day_id
    JOIN public.recipes r ON r.id = ppm.recipe_id
    CROSS JOIN LATERAL jsonb_array_elements(r.ingredients) as ingredient
    WHERE ppd.meal_plan_id = p_meal_plan_id
    GROUP BY ingredient_name, unit, r.id
  LOOP
    INSERT INTO public.shopping_list_items (
      shopping_list_id,
      name,
      quantity,
      unit,
      recipe_id
    ) VALUES (
      shopping_list_id,
      ingredient_item.ingredient_name,
      ingredient_item.total_amount,
      ingredient_item.unit,
      ingredient_item.recipe_id
    );
  END LOOP;
  
  RETURN shopping_list_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get user nutrition summary for a date range
CREATE OR REPLACE FUNCTION public.get_user_nutrition_summary(
  p_user_id UUID,
  p_start_date DATE,
  p_end_date DATE
)
RETURNS TABLE(
  date_consumed DATE,
  total_calories BIGINT,
  total_protein NUMERIC,
  total_carbs NUMERIC,
  total_fat NUMERIC,
  meal_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    umh.meal_date,
    SUM(umh.calories_consumed)::BIGINT,
    SUM(umh.protein_consumed_g),
    SUM(umh.carbs_consumed_g),
    SUM(umh.fat_consumed_g),
    COUNT(*)::BIGINT
  FROM public.user_meal_history umh
  WHERE
    umh.user_id = p_user_id AND
    umh.meal_date >= p_start_date AND
    umh.meal_date <= p_end_date
  GROUP BY umh.meal_date
  ORDER BY umh.meal_date;
END;
$$ LANGUAGE plpgsql;

-- Function to clean up old data (for maintenance)
CREATE OR REPLACE FUNCTION public.cleanup_old_data()
RETURNS VOID AS $$
BEGIN
  -- Delete meal history older than 1 year
  DELETE FROM public.user_meal_history
  WHERE created_at < NOW() - INTERVAL '1 year';
  
  -- Delete completed meal plans older than 6 months
  DELETE FROM public.meal_plans
  WHERE status = 'completed' AND updated_at < NOW() - INTERVAL '6 months';
  
  -- Delete empty shopping lists older than 1 month
  DELETE FROM public.shopping_lists sl
  WHERE 
    sl.created_at < NOW() - INTERVAL '1 month' AND
    NOT EXISTS (
      SELECT 1 FROM public.shopping_list_items sli
      WHERE sli.shopping_list_id = sl.id
    );
END;
$$ LANGUAGE plpgsql;

-- Comments
COMMENT ON FUNCTION public.calculate_bmi IS 'Calculate BMI from height and weight';
COMMENT ON FUNCTION public.calculate_bmr IS 'Calculate Basal Metabolic Rate using Harris-Benedict equation';
COMMENT ON FUNCTION public.calculate_daily_calories IS 'Calculate daily calorie needs based on BMR and activity level';
COMMENT ON FUNCTION public.calculate_macro_targets IS 'Calculate macro targets based on calories and goals';
COMMENT ON FUNCTION public.update_user_nutrition_targets IS 'Update user nutrition targets based on current profile';
COMMENT ON FUNCTION public.get_recipe_recommendations IS 'Get personalized recipe recommendations for user';
COMMENT ON FUNCTION public.create_shopping_list_from_meal_plan IS 'Generate shopping list from meal plan recipes';
COMMENT ON FUNCTION public.get_user_nutrition_summary IS 'Get nutrition summary for user over date range';
COMMENT ON FUNCTION public.cleanup_old_data IS 'Clean up old data for maintenance';