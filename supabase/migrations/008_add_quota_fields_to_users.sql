-- Add quota and premium fields to users table
-- Migration: 008_add_quota_fields_to_users.sql

-- Add new columns to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS daily_ai_calls INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_ai_call_date DATE DEFAULT CURRENT_DATE,
ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT FALSE;

-- Add comments for documentation
COMMENT ON COLUMN public.users.daily_ai_calls IS 'Number of AI calls made today';
COMMENT ON COLUMN public.users.last_ai_call_date IS 'Date of last AI call (for daily reset)';
COMMENT ON COLUMN public.users.is_premium IS 'Whether user has premium subscription';

-- Create index for efficient quota checking
CREATE INDEX IF NOT EXISTS idx_users_quota_check ON public.users(id, last_ai_call_date, daily_ai_calls);

-- Update RLS policies to include new columns
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Grant necessary permissions
GRANT SELECT, UPDATE ON public.users TO authenticated; 