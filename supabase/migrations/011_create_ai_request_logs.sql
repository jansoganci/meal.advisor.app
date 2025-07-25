-- Create AI request logs table
-- Migration: 011_create_ai_request_logs.sql

-- Create the ai_request_logs table for tracking AI service usage
CREATE TABLE public.ai_request_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  request_type TEXT NOT NULL, -- 'quickmeal', 'recipe', 'mealplan'
  provider_used TEXT NOT NULL, -- 'deepseek', 'gemini'
  tokens_used INTEGER,
  cost_estimate DECIMAL(10,4),
  response_time_ms INTEGER,
  success BOOLEAN NOT NULL,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add comments for documentation
COMMENT ON TABLE public.ai_request_logs IS 'Logs all AI service requests for monitoring and analytics';
COMMENT ON COLUMN public.ai_request_logs.user_id IS 'User who made the AI request';
COMMENT ON COLUMN public.ai_request_logs.request_type IS 'Type of AI request (quickmeal, recipe, mealplan)';
COMMENT ON COLUMN public.ai_request_logs.provider_used IS 'AI provider used (deepseek, gemini)';
COMMENT ON COLUMN public.ai_request_logs.tokens_used IS 'Number of tokens consumed by the AI request';
COMMENT ON COLUMN public.ai_request_logs.cost_estimate IS 'Estimated cost of the AI request';
COMMENT ON COLUMN public.ai_request_logs.response_time_ms IS 'Response time in milliseconds';
COMMENT ON COLUMN public.ai_request_logs.success IS 'Whether the AI request was successful';
COMMENT ON COLUMN public.ai_request_logs.error_message IS 'Error message if the request failed';

-- Create indexes for efficient querying
CREATE INDEX idx_ai_request_logs_user_id ON public.ai_request_logs(user_id);
CREATE INDEX idx_ai_request_logs_created_at ON public.ai_request_logs(created_at);
CREATE INDEX idx_ai_request_logs_request_type ON public.ai_request_logs(request_type);
CREATE INDEX idx_ai_request_logs_provider_used ON public.ai_request_logs(provider_used);
CREATE INDEX idx_ai_request_logs_success ON public.ai_request_logs(success);

-- Create composite index for common queries
CREATE INDEX idx_ai_request_logs_user_created ON public.ai_request_logs(user_id, created_at);

-- Enable RLS (Row Level Security)
ALTER TABLE public.ai_request_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can view their own AI request logs
CREATE POLICY "Users can view own AI request logs" ON public.ai_request_logs
    FOR SELECT USING (auth.uid() = user_id);

-- Service role can insert logs (for Edge Function)
CREATE POLICY "Service can insert AI request logs" ON public.ai_request_logs
    FOR INSERT WITH CHECK (true);

-- Service role can update logs (for error updates)
CREATE POLICY "Service can update AI request logs" ON public.ai_request_logs
    FOR UPDATE USING (true);

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON public.ai_request_logs TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.ai_request_logs TO service_role; 