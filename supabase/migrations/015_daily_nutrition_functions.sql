-- Migration: Add daily nutrition calculation function
-- This function calculates user's daily nutrition goals vs consumed

-- Get user's daily nutrition summary
CREATE OR REPLACE FUNCTION public.get_daily_nutrition(
  p_user_id UUID,
  p_date DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE(
  calories_goal INTEGER,
  protein_goal INTEGER,
  carbs_goal INTEGER,
  fat_goal INTEGER,
  calories_consumed BIGINT,
  protein_consumed NUMERIC,
  carbs_consumed NUMERIC,
  fat_consumed NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    u.daily_calories,
    u.daily_protein_g,
    u.daily_carbs_g,
    u.daily_fat_g,
    COALESCE(SUM(umh.calories_consumed), 0)::BIGINT,
    COALESCE(SUM(umh.protein_consumed_g), 0),
    COALESCE(SUM(umh.carbs_consumed_g), 0),
    COALESCE(SUM(umh.fat_consumed_g), 0)
  FROM public.users u
  LEFT JOIN public.user_meal_history umh ON 
    umh.user_id = u.id AND 
    umh.meal_date = p_date
  WHERE u.id = p_user_id
  GROUP BY u.daily_calories, u.daily_protein_g, u.daily_carbs_g, u.daily_fat_g;
END;
$$ LANGUAGE plpgsql;

-- Add comments for documentation
COMMENT ON FUNCTION public.get_daily_nutrition IS 'Get user daily nutrition goals and consumed values for a specific date';
COMMENT ON COLUMN public.users.daily_calories IS 'Daily calorie target from user profile';
COMMENT ON COLUMN public.users.daily_protein_g IS 'Daily protein target in grams from user profile';
COMMENT ON COLUMN public.users.daily_carbs_g IS 'Daily carbs target in grams from user profile';
COMMENT ON COLUMN public.users.daily_fat_g IS 'Daily fat target in grams from user profile'; 