-- Add missing RLS policy for weekly_plans table
-- This allows the ai-weekly edge function to save generated plans

-- Ensure RLS is enabled
ALTER TABLE public.weekly_plans ENABLE ROW LEVEL SECURITY;

-- Add policy for service role to insert records
CREATE POLICY "Service role can create weekly plans" ON public.weekly_plans
  FOR INSERT WITH CHECK (TRUE);

-- Grant necessary permissions to service_role
GRANT SELECT, INSERT ON public.weekly_plans TO service_role;

-- Comments
COMMENT ON POLICY "Service role can create weekly plans" ON public.weekly_plans 
IS 'Allows edge functions to save AI-generated weekly plans to database'; 