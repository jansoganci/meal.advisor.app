-- Create quota management functions
-- Migration: 009_create_quota_functions.sql

-- Function to check if user has quota available
CREATE OR REPLACE FUNCTION public.check_quota(p_user_id UUID)
RETURNS JSON AS $$
DECLARE
    user_record RECORD;
    quota_limit INTEGER;
    result JSON;
BEGIN
    -- Get user info
    SELECT daily_ai_calls, last_ai_call_date, is_premium
    INTO user_record
    FROM public.users
    WHERE id = p_user_id;
    
    IF NOT FOUND THEN
        RETURN json_build_object(
            'success', false,
            'error', 'User not found',
            'quota_available', false
        );
    END IF;
    
    -- Reset quota if it's a new day
    IF user_record.last_ai_call_date < CURRENT_DATE THEN
        UPDATE public.users 
        SET daily_ai_calls = 0, last_ai_call_date = CURRENT_DATE
        WHERE id = p_user_id;
        user_record.daily_ai_calls := 0;
    END IF;
    
    -- Set quota limit based on user tier
    IF user_record.is_premium THEN
        quota_limit := 999999; -- Unlimited for premium
    ELSE
        quota_limit := 3; -- 3 calls per day for freemium
    END IF;
    
    -- Check if quota available
    IF user_record.daily_ai_calls >= quota_limit THEN
        result := json_build_object(
            'success', true,
            'quota_available', false,
            'daily_calls', user_record.daily_ai_calls,
            'quota_limit', quota_limit,
            'is_premium', user_record.is_premium,
            'error', 'Daily quota exceeded'
        );
    ELSE
        result := json_build_object(
            'success', true,
            'quota_available', true,
            'daily_calls', user_record.daily_ai_calls,
            'quota_limit', quota_limit,
            'is_premium', user_record.is_premium,
            'remaining_calls', quota_limit - user_record.daily_ai_calls
        );
    END IF;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment quota after successful AI call
CREATE OR REPLACE FUNCTION public.increment_quota(p_user_id UUID)
RETURNS JSON AS $$
DECLARE
    new_count INTEGER;
BEGIN
    -- Reset quota if it's a new day
    UPDATE public.users 
    SET daily_ai_calls = CASE 
        WHEN last_ai_call_date < CURRENT_DATE THEN 1
        ELSE daily_ai_calls + 1
    END,
    last_ai_call_date = CURRENT_DATE
    WHERE id = p_user_id;
    
    -- Get updated count
    SELECT daily_ai_calls INTO new_count
    FROM public.users
    WHERE id = p_user_id;
    
    RETURN json_build_object(
        'success', true,
        'daily_calls', new_count,
        'last_call_date', CURRENT_DATE
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to reset quota (for testing/admin purposes)
CREATE OR REPLACE FUNCTION public.reset_quota(p_user_id UUID)
RETURNS JSON AS $$
BEGIN
    UPDATE public.users 
    SET daily_ai_calls = 0, last_ai_call_date = CURRENT_DATE
    WHERE id = p_user_id;
    
    RETURN json_build_object(
        'success', true,
        'message', 'Quota reset successfully'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.check_quota(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.increment_quota(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.reset_quota(UUID) TO authenticated; 