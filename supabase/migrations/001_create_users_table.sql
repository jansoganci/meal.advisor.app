-- Create users table with profile information
-- This extends the default auth.users table with additional profile data

CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  
  -- Basic Information
  age INTEGER CHECK (age >= 13 AND age <= 120),
  gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  
  -- Physical Measurements
  height_cm INTEGER CHECK (height_cm >= 100 AND height_cm <= 250),
  weight_kg DECIMAL(5,2) CHECK (weight_kg >= 30 AND weight_kg <= 300),
  
  -- Health Information
  allergies TEXT[], -- Array of allergy strings
  chronic_illnesses TEXT[], -- Array of chronic illness strings
  
  -- Goals & Activity
  activity_level TEXT CHECK (activity_level IN ('sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extremely_active')),
  primary_goal TEXT CHECK (primary_goal IN ('lose_weight', 'maintain_weight', 'gain_weight', 'build_muscle', 'improve_health')),
  
  -- Preferences
  dietary_preferences TEXT[], -- Array of dietary preferences (vegan, vegetarian, keto, etc.)
  cuisine_preferences TEXT[], -- Array of preferred cuisines
  disliked_foods TEXT[], -- Array of foods to avoid
  
  -- Nutrition Goals (daily targets)
  daily_calories INTEGER CHECK (daily_calories >= 1000 AND daily_calories <= 4000),
  daily_protein_g INTEGER CHECK (daily_protein_g >= 20 AND daily_protein_g <= 300),
  daily_carbs_g INTEGER CHECK (daily_carbs_g >= 50 AND daily_carbs_g <= 600),
  daily_fat_g INTEGER CHECK (daily_fat_g >= 20 AND daily_fat_g <= 200),
  
  -- Settings
  preferred_language TEXT DEFAULT 'en',
  timezone TEXT DEFAULT 'UTC',
  notifications_enabled BOOLEAN DEFAULT TRUE,
  
  -- Metadata
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS users_email_idx ON public.users(email);
CREATE INDEX IF NOT EXISTS users_created_at_idx ON public.users(created_at);
CREATE INDEX IF NOT EXISTS users_activity_level_idx ON public.users(activity_level);
CREATE INDEX IF NOT EXISTS users_primary_goal_idx ON public.users(primary_goal);

-- Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Users can only see and modify their own profile
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile when auth user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Comments
COMMENT ON TABLE public.users IS 'Extended user profiles with health and preference data';
COMMENT ON COLUMN public.users.allergies IS 'Array of user allergies and food intolerances';
COMMENT ON COLUMN public.users.dietary_preferences IS 'Array of dietary preferences (vegan, vegetarian, keto, etc.)';
COMMENT ON COLUMN public.users.daily_calories IS 'Daily calorie target based on user goals and metrics';