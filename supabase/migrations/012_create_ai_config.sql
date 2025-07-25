-- Create AI configuration table
-- Migration: 012_create_ai_config.sql

-- Create the ai_config table for storing Edge Function configuration
CREATE TABLE public.ai_config (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add comments for documentation
COMMENT ON TABLE public.ai_config IS 'Configuration settings for AI service Edge Function';
COMMENT ON COLUMN public.ai_config.key IS 'Configuration key (e.g., rate_limits, provider_settings)';
COMMENT ON COLUMN public.ai_config.value IS 'JSON configuration value';
COMMENT ON COLUMN public.ai_config.updated_at IS 'Last update timestamp';

-- Create index for efficient querying
CREATE INDEX idx_ai_config_key ON public.ai_config(key);

-- Enable RLS (Row Level Security)
ALTER TABLE public.ai_config ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Service role can read all config (for Edge Function)
CREATE POLICY "Service can read AI config" ON public.ai_config
    FOR SELECT USING (true);

-- Service role can update config (for Edge Function)
CREATE POLICY "Service can update AI config" ON public.ai_config
    FOR UPDATE USING (true);

-- Service role can insert config (for Edge Function)
CREATE POLICY "Service can insert AI config" ON public.ai_config
    FOR INSERT WITH CHECK (true);

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON public.ai_config TO service_role;

-- Insert default configuration
INSERT INTO public.ai_config (key, value) VALUES
  ('rate_limits', '{"requests_per_minute": 10, "requests_per_hour": 100, "requests_per_day": 500}'),
  ('provider_settings', '{"default_provider": "deepseek", "fallback_provider": "gemini", "timeout_ms": 30000}'),
  ('quota_settings', '{"free_user_limit": 3, "premium_user_limit": 999999, "reset_time": "00:00"}'),
  ('cost_limits', '{"max_cost_per_request": 0.50, "max_cost_per_user": 10.00, "max_cost_per_day": 100.00}'),
  ('validation_settings', '{"max_content_length": 10000, "enable_safety_checks": true, "blocked_patterns": ["harmful", "dangerous", "unsafe"]}');

-- Create function to update config with timestamp
CREATE OR REPLACE FUNCTION public.update_ai_config(p_key TEXT, p_value JSONB)
RETURNS JSON AS $$
BEGIN
  INSERT INTO public.ai_config (key, value, updated_at)
  VALUES (p_key, p_value, NOW())
  ON CONFLICT (key) 
  DO UPDATE SET 
    value = p_value,
    updated_at = NOW();
    
  RETURN json_build_object('success', true, 'key', p_key);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get config value
CREATE OR REPLACE FUNCTION public.get_ai_config(p_key TEXT)
RETURNS JSONB AS $$
DECLARE
  config_value JSONB;
BEGIN
  SELECT value INTO config_value
  FROM public.ai_config
  WHERE key = p_key;
  
  RETURN config_value;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.update_ai_config(TEXT, JSONB) TO service_role;
GRANT EXECUTE ON FUNCTION public.get_ai_config(TEXT) TO service_role; 