-- =============================================
-- MEALADVISOR DATABASE SCHEMA
-- =============================================

-- Enable Row Level Security
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- =============================================
-- USER PROFILES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Step 1: Basic Information
  age integer NOT NULL,
  gender text NOT NULL CHECK (gender IN ('male', 'female', 'other')),
  
  -- Step 2: Physical Measurements
  height integer NOT NULL, -- cm
  weight decimal NOT NULL, -- kg
  
  -- Step 3: Health Information
  allergies text[] DEFAULT '{}' NOT NULL,
  chronic_illnesses text[] DEFAULT '{}' NOT NULL,
  
  -- Step 4: Goals & Activity
  activity_level text NOT NULL CHECK (activity_level IN ('sedentary', 'lightly_active', 'moderately_active', 'very_active')),
  fitness_goal text NOT NULL CHECK (fitness_goal IN ('lose_weight', 'gain_weight', 'maintain', 'build_muscle')),
  
  -- App Settings
  language text NOT NULL DEFAULT 'en',
  is_premium boolean NOT NULL DEFAULT false,
  
  -- Calculated Fields
  bmi decimal GENERATED ALWAYS AS (weight / ((height/100.0) * (height/100.0))) STORED,
  daily_calorie_goal integer,
  daily_protein_goal integer,
  
  -- Timestamps
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(id);
CREATE INDEX IF NOT EXISTS idx_profiles_premium ON public.profiles(is_premium);
CREATE INDEX IF NOT EXISTS idx_profiles_language ON public.profiles(language);

-- =============================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can only access their own profile
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can delete their own profile" ON public.profiles
  FOR DELETE USING (auth.uid() = id);

-- =============================================
-- UPDATED_AT TRIGGER
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER handle_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- =============================================
-- PROFILE CALCULATION FUNCTION
-- =============================================
CREATE OR REPLACE FUNCTION public.calculate_nutrition_goals(
  p_age integer,
  p_gender text,
  p_height integer,
  p_weight decimal,
  p_activity_level text,
  p_fitness_goal text
) RETURNS TABLE(daily_calories integer, daily_protein integer) AS $$
DECLARE
  bmr decimal;
  activity_multiplier decimal;
  goal_multiplier decimal;
  protein_per_kg decimal;
BEGIN
  -- Calculate BMR (Harris-Benedict equation)
  IF p_gender = 'male' THEN
    bmr := 88.362 + (13.397 * p_weight) + (4.799 * p_height) - (5.677 * p_age);
  ELSE
    bmr := 447.593 + (9.247 * p_weight) + (3.098 * p_height) - (4.330 * p_age);
  END IF;
  
  -- Activity level multiplier
  activity_multiplier := CASE p_activity_level
    WHEN 'sedentary' THEN 1.2
    WHEN 'lightly_active' THEN 1.375
    WHEN 'moderately_active' THEN 1.55
    WHEN 'very_active' THEN 1.725
    ELSE 1.2
  END;
  
  -- Fitness goal adjustment
  goal_multiplier := CASE p_fitness_goal
    WHEN 'lose_weight' THEN 0.85
    WHEN 'gain_weight' THEN 1.15
    WHEN 'build_muscle' THEN 1.1
    ELSE 1.0
  END;
  
  -- Protein calculation
  protein_per_kg := CASE 
    WHEN p_activity_level = 'sedentary' THEN 0.8
    WHEN p_activity_level = 'lightly_active' THEN 1.0
    WHEN p_activity_level = 'moderately_active' THEN 1.2
    WHEN p_activity_level = 'very_active' THEN 1.4
    ELSE 0.8
  END;
  
  -- Adjust protein for fitness goal
  IF p_fitness_goal = 'build_muscle' THEN
    protein_per_kg := protein_per_kg + 0.4;
  ELSIF p_fitness_goal = 'lose_weight' THEN
    protein_per_kg := protein_per_kg + 0.2;
  END IF;
  
  daily_calories := ROUND(bmr * activity_multiplier * goal_multiplier);
  daily_protein := ROUND(p_weight * protein_per_kg);
  
  RETURN NEXT;
END;
$$ LANGUAGE plpgsql;