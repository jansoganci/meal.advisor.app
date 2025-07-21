-- Additional Row Level Security (RLS) policies and security enhancements
-- This file contains comprehensive RLS policies for all tables

-- Grant necessary permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;

-- Grant table permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;

-- Grant sequence permissions
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;

-- Grant execute permissions on functions
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon;

-- Create security functions
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if user has admin role (can be extended later)
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE id = user_id
    AND (
      email IN ('admin@mealadvisor.com', 'support@mealadvisor.com')
      -- Add more admin emails as needed
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.can_access_recipe(recipe_id UUID, user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.recipes r
    WHERE r.id = recipe_id
    AND (
      r.is_public = TRUE OR
      r.is_curated = TRUE OR
      r.user_id = user_id OR
      public.is_admin(user_id)
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.can_access_meal_plan(meal_plan_id UUID, user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.meal_plans mp
    WHERE mp.id = meal_plan_id
    AND (
      mp.user_id = user_id OR
      mp.is_public = TRUE OR
      public.is_admin(user_id)
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enhanced RLS policies with better security

-- Users table - enhanced policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;

CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (
    auth.uid() = id OR
    public.is_admin(auth.uid())
  );

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (
    auth.uid() = id AND
    -- Prevent users from modifying critical fields
    (OLD.id = NEW.id) AND
    (OLD.email = NEW.email OR public.is_admin(auth.uid()))
  );

CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (
    auth.uid() = id
  );

-- Prevent users from deleting their own profile directly
CREATE POLICY "Prevent profile deletion" ON public.users
  FOR DELETE USING (
    public.is_admin(auth.uid())
  );

-- Meal Plans - enhanced policies with sharing support
DROP POLICY IF EXISTS "Users can view own meal plans" ON public.meal_plans;
DROP POLICY IF EXISTS "Users can create own meal plans" ON public.meal_plans;
DROP POLICY IF EXISTS "Users can update own meal plans" ON public.meal_plans;
DROP POLICY IF EXISTS "Users can delete own meal plans" ON public.meal_plans;

CREATE POLICY "Users can view accessible meal plans" ON public.meal_plans
  FOR SELECT USING (
    auth.uid() = user_id OR
    is_public = TRUE OR
    public.is_admin(auth.uid()) OR
    -- Allow access via sharing code (implement sharing logic)
    (sharing_code IS NOT NULL AND sharing_code != '')
  );

CREATE POLICY "Users can create own meal plans" ON public.meal_plans
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
  );

CREATE POLICY "Users can update own meal plans" ON public.meal_plans
  FOR UPDATE USING (
    auth.uid() = user_id OR
    public.is_admin(auth.uid())
  );

CREATE POLICY "Users can delete own meal plans" ON public.meal_plans
  FOR DELETE USING (
    auth.uid() = user_id OR
    public.is_admin(auth.uid())
  );

-- Recipes - enhanced policies with public access
DROP POLICY IF EXISTS "Anyone can view public recipes" ON public.recipes;
DROP POLICY IF EXISTS "Users can view own recipes" ON public.recipes;
DROP POLICY IF EXISTS "Users can create recipes" ON public.recipes;
DROP POLICY IF EXISTS "Users can update own recipes" ON public.recipes;
DROP POLICY IF EXISTS "Users can delete own recipes" ON public.recipes;

CREATE POLICY "View accessible recipes" ON public.recipes
  FOR SELECT USING (
    is_public = TRUE OR
    is_curated = TRUE OR
    auth.uid() = user_id OR
    public.is_admin(auth.uid())
  );

CREATE POLICY "Users can create recipes" ON public.recipes
  FOR INSERT WITH CHECK (
    auth.uid() = user_id OR
    public.is_admin(auth.uid())
  );

CREATE POLICY "Users can update own recipes" ON public.recipes
  FOR UPDATE USING (
    (auth.uid() = user_id AND user_id IS NOT NULL) OR
    public.is_admin(auth.uid())
  );

CREATE POLICY "Users can delete own recipes" ON public.recipes
  FOR DELETE USING (
    (auth.uid() = user_id AND user_id IS NOT NULL) OR
    public.is_admin(auth.uid())
  );

-- Recipe Ratings - enhanced policies
DROP POLICY IF EXISTS "Users can view recipe ratings" ON public.recipe_ratings;
DROP POLICY IF EXISTS "Users can create own ratings" ON public.recipe_ratings;
DROP POLICY IF EXISTS "Users can update own ratings" ON public.recipe_ratings;
DROP POLICY IF EXISTS "Users can delete own ratings" ON public.recipe_ratings;

CREATE POLICY "View recipe ratings" ON public.recipe_ratings
  FOR SELECT USING (
    -- Users can see ratings for recipes they have access to
    public.can_access_recipe(recipe_id, auth.uid())
  );

CREATE POLICY "Users can create own ratings" ON public.recipe_ratings
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    public.can_access_recipe(recipe_id, auth.uid())
  );

CREATE POLICY "Users can update own ratings" ON public.recipe_ratings
  FOR UPDATE USING (
    auth.uid() = user_id
  );

CREATE POLICY "Users can delete own ratings" ON public.recipe_ratings
  FOR DELETE USING (
    auth.uid() = user_id OR
    public.is_admin(auth.uid())
  );

-- Shopping Lists - enhanced policies
DROP POLICY IF EXISTS "Users can view own shopping lists" ON public.shopping_lists;
DROP POLICY IF EXISTS "Users can manage own shopping lists" ON public.shopping_lists;

CREATE POLICY "Users can view own shopping lists" ON public.shopping_lists
  FOR SELECT USING (
    auth.uid() = user_id OR
    public.is_admin(auth.uid())
  );

CREATE POLICY "Users can create shopping lists" ON public.shopping_lists
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
  );

CREATE POLICY "Users can update own shopping lists" ON public.shopping_lists
  FOR UPDATE USING (
    auth.uid() = user_id OR
    public.is_admin(auth.uid())
  );

CREATE POLICY "Users can delete own shopping lists" ON public.shopping_lists
  FOR DELETE USING (
    auth.uid() = user_id OR
    public.is_admin(auth.uid())
  );

-- User Preferences - enhanced policies
DROP POLICY IF EXISTS "Users can view own preferences" ON public.user_preferences;
DROP POLICY IF EXISTS "Users can manage own preferences" ON public.user_preferences;

CREATE POLICY "Users can view own preferences" ON public.user_preferences
  FOR SELECT USING (
    auth.uid() = user_id OR
    public.is_admin(auth.uid())
  );

CREATE POLICY "Users can create own preferences" ON public.user_preferences
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
  );

CREATE POLICY "Users can update own preferences" ON public.user_preferences
  FOR UPDATE USING (
    auth.uid() = user_id OR
    public.is_admin(auth.uid())
  );

CREATE POLICY "Users can delete own preferences" ON public.user_preferences
  FOR DELETE USING (
    auth.uid() = user_id OR
    public.is_admin(auth.uid())
  );

-- Create audit log table for security monitoring
CREATE TABLE IF NOT EXISTS public.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for audit log
CREATE INDEX IF NOT EXISTS audit_log_user_id_idx ON public.audit_log(user_id);
CREATE INDEX IF NOT EXISTS audit_log_action_idx ON public.audit_log(action);
CREATE INDEX IF NOT EXISTS audit_log_table_name_idx ON public.audit_log(table_name);
CREATE INDEX IF NOT EXISTS audit_log_created_at_idx ON public.audit_log(created_at);

-- RLS for audit log
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view audit log" ON public.audit_log
  FOR SELECT USING (
    public.is_admin(auth.uid())
  );

CREATE POLICY "System can insert audit log" ON public.audit_log
  FOR INSERT WITH CHECK (TRUE);

-- Function to log user actions
CREATE OR REPLACE FUNCTION public.log_user_action(
  p_user_id UUID,
  p_action TEXT,
  p_table_name TEXT,
  p_record_id UUID,
  p_old_values JSONB DEFAULT NULL,
  p_new_values JSONB DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.audit_log (
    user_id,
    action,
    table_name,
    record_id,
    old_values,
    new_values
  ) VALUES (
    p_user_id,
    p_action,
    p_table_name,
    p_record_id,
    p_old_values,
    p_new_values
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to validate user input
CREATE OR REPLACE FUNCTION public.validate_user_input(
  input_text TEXT,
  max_length INTEGER DEFAULT 1000,
  allow_html BOOLEAN DEFAULT FALSE
)
RETURNS TEXT AS $$
DECLARE
  cleaned_text TEXT;
BEGIN
  IF input_text IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- Trim whitespace
  cleaned_text := TRIM(input_text);
  
  -- Check length
  IF LENGTH(cleaned_text) > max_length THEN
    RAISE EXCEPTION 'Input text exceeds maximum length of %', max_length;
  END IF;
  
  -- Remove HTML tags if not allowed
  IF NOT allow_html THEN
    cleaned_text := REGEXP_REPLACE(cleaned_text, '<[^>]+>', '', 'g');
  END IF;
  
  -- Remove potential SQL injection patterns
  cleaned_text := REGEXP_REPLACE(cleaned_text, '(--|;|/\*|\*/|xp_|sp_)', '', 'gi');
  
  RETURN cleaned_text;
END;
$$ LANGUAGE plpgsql;

-- Create function to check rate limiting
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Index for efficient lookups
  UNIQUE(user_id, action_type, window_start)
);

CREATE INDEX IF NOT EXISTS rate_limits_user_action_idx ON public.rate_limits(user_id, action_type);
CREATE INDEX IF NOT EXISTS rate_limits_window_start_idx ON public.rate_limits(window_start);

-- RLS for rate limits
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own rate limits" ON public.rate_limits
  FOR SELECT USING (
    auth.uid() = user_id OR
    public.is_admin(auth.uid())
  );

CREATE POLICY "System can manage rate limits" ON public.rate_limits
  FOR ALL USING (TRUE);

-- Function to check and update rate limits
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_user_id UUID,
  p_action_type TEXT,
  p_limit INTEGER,
  p_window_minutes INTEGER DEFAULT 60
)
RETURNS BOOLEAN AS $$
DECLARE
  current_count INTEGER;
  window_start TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Calculate window start time
  window_start := DATE_TRUNC('hour', NOW()) + 
                  (EXTRACT(MINUTE FROM NOW())::INTEGER / p_window_minutes) * 
                  (p_window_minutes::TEXT || ' minutes')::INTERVAL;
  
  -- Get current count for this window
  SELECT count INTO current_count
  FROM public.rate_limits
  WHERE 
    user_id = p_user_id AND
    action_type = p_action_type AND
    window_start = window_start;
  
  -- If no record exists, create one
  IF current_count IS NULL THEN
    INSERT INTO public.rate_limits (user_id, action_type, window_start, count)
    VALUES (p_user_id, p_action_type, window_start, 1);
    RETURN TRUE;
  END IF;
  
  -- Check if under limit
  IF current_count < p_limit THEN
    -- Increment count
    UPDATE public.rate_limits
    SET count = count + 1
    WHERE 
      user_id = p_user_id AND
      action_type = p_action_type AND
      window_start = window_start;
    RETURN TRUE;
  END IF;
  
  -- Over limit
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean up old rate limit records
CREATE OR REPLACE FUNCTION public.cleanup_rate_limits()
RETURNS VOID AS $$
BEGIN
  DELETE FROM public.rate_limits
  WHERE window_start < NOW() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql;

-- Comments
COMMENT ON FUNCTION public.is_admin IS 'Check if user has admin privileges';
COMMENT ON FUNCTION public.can_access_recipe IS 'Check if user can access a specific recipe';
COMMENT ON FUNCTION public.can_access_meal_plan IS 'Check if user can access a specific meal plan';
COMMENT ON FUNCTION public.log_user_action IS 'Log user actions for audit trail';
COMMENT ON FUNCTION public.validate_user_input IS 'Validate and sanitize user input';
COMMENT ON FUNCTION public.check_rate_limit IS 'Check and enforce rate limits for user actions';
COMMENT ON FUNCTION public.cleanup_rate_limits IS 'Clean up old rate limit records';
COMMENT ON TABLE public.audit_log IS 'Audit log for security monitoring';
COMMENT ON TABLE public.rate_limits IS 'Rate limiting for user actions';