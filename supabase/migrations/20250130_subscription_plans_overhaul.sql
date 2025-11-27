-- Subscription Plans Overhaul Migration
-- Creates proper subscription plans table with pricing and comprehensive feature gating

-- =====================================================
-- 1. CREATE SUBSCRIPTION PLANS TABLE
-- =====================================================

CREATE TABLE subscription_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_name TEXT NOT NULL UNIQUE,
  plan_tier subscription_tier NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  description TEXT NOT NULL,
  price_monthly DECIMAL(10,2) NOT NULL,
  price_yearly DECIMAL(10,2), -- Optional yearly pricing
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert subscription plans
INSERT INTO subscription_plans (plan_name, plan_tier, display_name, description, price_monthly, price_yearly, sort_order) VALUES
('foundation', 'foundation', 'Foundation (Free)', 'Basic access for getting started', 0.00, 0.00, 1),
('recovery', 'recovery', 'Recovery', 'AI-powered recovery tools', 15.00, 150.00, 2),
('empowerment', 'empowerment', 'Empowered', 'Complete recovery suite', 24.99, 249.90, 3);

-- =====================================================
-- 2. COMPREHENSIVE FEATURE DEFINITIONS
-- =====================================================

-- Clear existing feature limits and rebuild with comprehensive coverage
DELETE FROM feature_limits;

-- Core Features with proper limits
INSERT INTO feature_limits (subscription_tier, feature_name, limit_type, limit_value) VALUES
-- FOUNDATION TIER (FREE)
-- Main Dashboard - Full Access
('foundation', 'dashboard', 'monthly_count', -1),

-- Essentials - Limited Access
('foundation', 'journal_entries', 'monthly_count', 3), -- 3 entries per day
('foundation', 'reality_anchor', 'monthly_count', 5), -- 5 reality logs per day
('foundation', 'toxic_memories', 'monthly_count', 1), -- 1 per day
('foundation', 'letting_go', 'monthly_count', 1), -- 1 per day
('foundation', 'patterns', 'monthly_count', 1), -- 1 pattern check per day

-- Protection - Limited Access
('foundation', 'grey_rock_templates', 'monthly_count', 3), -- 3 templates per day
('foundation', 'grey_rock_practice', 'monthly_count', 2), -- 2 practice sessions per day
('foundation', 'biff_assistant', 'monthly_count', 2), -- 2 BIFF messages per day
('foundation', 'stonewalling', 'monthly_count', 1), -- 1 per day
('foundation', 'reactive_abuse', 'monthly_count', 1), -- 1 per day

-- Wellness - Limited Access
('foundation', 'wellness', 'monthly_count', 2), -- 2 wellness checks per day
('foundation', 'crisis_reframe', 'monthly_count', 3), -- 3 crisis reframes per day
('foundation', 'healing', 'monthly_count', 1), -- 1 healing session per day
('foundation', 'mind_reset', 'monthly_count', 1), -- 1 mind reset per day
('foundation', 'belief_reframe', 'monthly_count', 1), -- 1 per day
('foundation', 'affirmations', 'monthly_count', 5), -- 5 affirmations per day
('foundation', 'positive_moments', 'monthly_count', 2), -- 2 per day
('foundation', 'no_contact_anchor', 'monthly_count', 2), -- 2 per day
('foundation', 'acceptance', 'monthly_count', 1), -- 1 per day
('foundation', 'role_reframing', 'monthly_count', 1), -- 1 per day

-- Analysis - Very Limited Access
('foundation', 'narcissist_detector', 'monthly_count', 1), -- 1 detection per day
('foundation', 'narcissist_simulator', 'monthly_count', 0), -- No access
('foundation', 'manipulation_decoder', 'monthly_count', 1), -- 1 per day
('foundation', 'relationship_health', 'monthly_count', 1), -- 1 assessment per week
('foundation', 'npd_traits', 'monthly_count', 2), -- 2 trait checks per day
('foundation', 'gaslighting_tracker', 'monthly_count', 2), -- 2 per day
('foundation', 'empathy_audit', 'monthly_count', 0), -- No access

-- Support - Limited Access
('foundation', 'ai_coach', 'monthly_count', 5), -- 5 AI chats per day
('foundation', 'safety_plan', 'monthly_count', -1), -- Full access (safety critical)
('foundation', 'community', 'monthly_count', 3), -- 3 posts per day
('foundation', 'feedback', 'monthly_count', -1), -- Full access

-- Technical Limits
('foundation', 'storage', 'storage_mb', 100), -- 100 MB storage
('foundation', 'transcription_minutes', 'monthly_count', 0), -- No transcription
('foundation', 'export_requests', 'monthly_count', 1), -- 1 export per month

-- RECOVERY TIER ($15/month)
-- Main Dashboard - Full Access
('recovery', 'dashboard', 'monthly_count', -1),

-- Essentials - Good Access
('recovery', 'journal_entries', 'monthly_count', 15), -- 15 entries per day
('recovery', 'reality_anchor', 'monthly_count', 20), -- 20 reality logs per day
('recovery', 'toxic_memories', 'monthly_count', 5), -- 5 per day
('recovery', 'letting_go', 'monthly_count', 5), -- 5 per day
('recovery', 'patterns', 'monthly_count', 10), -- 10 pattern checks per day

-- Protection - Good Access
('recovery', 'grey_rock_templates', 'monthly_count', 15), -- 15 templates per day
('recovery', 'grey_rock_practice', 'monthly_count', 10), -- 10 practice sessions per day
('recovery', 'biff_assistant', 'monthly_count', 10), -- 10 BIFF messages per day
('recovery', 'stonewalling', 'monthly_count', 5), -- 5 per day
('recovery', 'reactive_abuse', 'monthly_count', 5), -- 5 per day

-- Wellness - Good Access
('recovery', 'wellness', 'monthly_count', 10), -- 10 wellness checks per day
('recovery', 'crisis_reframe', 'monthly_count', 15), -- 15 crisis reframes per day
('recovery', 'healing', 'monthly_count', 5), -- 5 healing sessions per day
('recovery', 'mind_reset', 'monthly_count', 10), -- 10 mind resets per day
('recovery', 'belief_reframe', 'monthly_count', 5), -- 5 per day
('recovery', 'affirmations', 'monthly_count', 20), -- 20 affirmations per day
('recovery', 'positive_moments', 'monthly_count', 10), -- 10 per day
('recovery', 'no_contact_anchor', 'monthly_count', 10), -- 10 per day
('recovery', 'acceptance', 'monthly_count', 5), -- 5 per day
('recovery', 'role_reframing', 'monthly_count', 5), -- 5 per day

-- Analysis - Good Access
('recovery', 'narcissist_detector', 'monthly_count', 5), -- 5 detections per day
('recovery', 'narcissist_simulator', 'monthly_count', 3), -- 3 simulations per day
('recovery', 'manipulation_decoder', 'monthly_count', 5), -- 5 per day
('recovery', 'relationship_health', 'monthly_count', 3), -- 3 assessments per day
('recovery', 'npd_traits', 'monthly_count', 10), -- 10 trait checks per day
('recovery', 'gaslighting_tracker', 'monthly_count', 10), -- 10 per day
('recovery', 'empathy_audit', 'monthly_count', 3), -- 3 per day

-- Support - Good Access
('recovery', 'ai_coach', 'monthly_count', 25), -- 25 AI chats per day
('recovery', 'safety_plan', 'monthly_count', -1), -- Full access
('recovery', 'community', 'monthly_count', 10), -- 10 posts per day
('recovery', 'feedback', 'monthly_count', -1), -- Full access

-- Technical Limits
('recovery', 'storage', 'storage_mb', 10240), -- 10 GB storage
('recovery', 'transcription_minutes', 'monthly_count', 60), -- 60 minutes per month
('recovery', 'export_requests', 'monthly_count', 5), -- 5 exports per month

-- EMPOWERMENT TIER ($24.99/month)
-- All features unlimited or very high limits
('empowerment', 'dashboard', 'monthly_count', -1),

-- Essentials - Unlimited/High Access
('empowerment', 'journal_entries', 'monthly_count', -1), -- Unlimited
('empowerment', 'reality_anchor', 'monthly_count', -1), -- Unlimited
('empowerment', 'toxic_memories', 'monthly_count', -1), -- Unlimited
('empowerment', 'letting_go', 'monthly_count', -1), -- Unlimited
('empowerment', 'patterns', 'monthly_count', -1), -- Unlimited

-- Protection - Unlimited Access
('empowerment', 'grey_rock_templates', 'monthly_count', -1), -- Unlimited
('empowerment', 'grey_rock_practice', 'monthly_count', -1), -- Unlimited
('empowerment', 'biff_assistant', 'monthly_count', -1), -- Unlimited
('empowerment', 'stonewalling', 'monthly_count', -1), -- Unlimited
('empowerment', 'reactive_abuse', 'monthly_count', -1), -- Unlimited

-- Wellness - Unlimited Access
('empowerment', 'wellness', 'monthly_count', -1), -- Unlimited
('empowerment', 'crisis_reframe', 'monthly_count', -1), -- Unlimited
('empowerment', 'healing', 'monthly_count', -1), -- Unlimited
('empowerment', 'mind_reset', 'monthly_count', -1), -- Unlimited
('empowerment', 'belief_reframe', 'monthly_count', -1), -- Unlimited
('empowerment', 'affirmations', 'monthly_count', -1), -- Unlimited
('empowerment', 'positive_moments', 'monthly_count', -1), -- Unlimited
('empowerment', 'no_contact_anchor', 'monthly_count', -1), -- Unlimited
('empowerment', 'acceptance', 'monthly_count', -1), -- Unlimited
('empowerment', 'role_reframing', 'monthly_count', -1), -- Unlimited

-- Analysis - Unlimited Access
('empowerment', 'narcissist_detector', 'monthly_count', -1), -- Unlimited
('empowerment', 'narcissist_simulator', 'monthly_count', -1), -- Unlimited
('empowerment', 'manipulation_decoder', 'monthly_count', -1), -- Unlimited
('empowerment', 'relationship_health', 'monthly_count', -1), -- Unlimited
('empowerment', 'npd_traits', 'monthly_count', -1), -- Unlimited
('empowerment', 'gaslighting_tracker', 'monthly_count', -1), -- Unlimited
('empowerment', 'empathy_audit', 'monthly_count', -1), -- Unlimited

-- Support - Unlimited Access
('empowerment', 'ai_coach', 'monthly_count', -1), -- Unlimited
('empowerment', 'safety_plan', 'monthly_count', -1), -- Full access
('empowerment', 'community', 'monthly_count', -1), -- Unlimited
('empowerment', 'feedback', 'monthly_count', -1), -- Full access

-- Technical Limits
('empowerment', 'storage', 'storage_mb', 102400), -- 100 GB storage
('empowerment', 'transcription_minutes', 'monthly_count', 300), -- 300 minutes per month
('empowerment', 'export_requests', 'monthly_count', -1); -- Unlimited exports

-- =====================================================
-- 3. CREATE INDEXES
-- =====================================================

CREATE INDEX idx_subscription_plans_tier ON subscription_plans(plan_tier);
CREATE INDEX idx_subscription_plans_active ON subscription_plans(is_active);
CREATE INDEX idx_feature_limits_lookup ON feature_limits(subscription_tier, feature_name, limit_type);

-- =====================================================
-- 4. ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read subscription plans
CREATE POLICY "Allow authenticated users to read subscription plans" ON subscription_plans
  FOR SELECT USING (auth.role() = 'authenticated');

-- =====================================================
-- 5. HELPER FUNCTIONS
-- =====================================================

-- Function to get subscription plan details
CREATE OR REPLACE FUNCTION get_subscription_plan(p_tier subscription_tier)
RETURNS TABLE (
  plan_name TEXT,
  display_name TEXT,
  description TEXT,
  price_monthly DECIMAL,
  price_yearly DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sp.plan_name,
    sp.display_name,
    sp.description,
    sp.price_monthly,
    sp.price_yearly
  FROM subscription_plans sp
  WHERE sp.plan_tier = p_tier AND sp.is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check feature access with daily limits
CREATE OR REPLACE FUNCTION check_daily_feature_limit(
  p_user_id UUID,
  p_feature_name TEXT
) RETURNS BOOLEAN AS $$
DECLARE
  user_tier subscription_tier;
  daily_limit INTEGER;
  current_usage INTEGER;
  today_start TIMESTAMP WITH TIME ZONE;
  today_end TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Get user's subscription tier
  SELECT subscription_tier INTO user_tier
  FROM profiles WHERE id = p_user_id;

  -- Get daily limit for this feature
  SELECT limit_value INTO daily_limit
  FROM feature_limits
  WHERE subscription_tier = user_tier
    AND feature_name = p_feature_name
    AND limit_type = 'monthly_count';

  -- If no limit found or unlimited (-1), allow
  IF daily_limit IS NULL OR daily_limit = -1 THEN
    RETURN TRUE;
  END IF;

  -- If limit is 0, deny access
  IF daily_limit = 0 THEN
    RETURN FALSE;
  END IF;

  -- Calculate today's period
  today_start := DATE_TRUNC('day', NOW());
  today_end := today_start + INTERVAL '1 day';

  -- Get current usage for today
  SELECT COALESCE(SUM(usage_count), 0) INTO current_usage
  FROM usage_tracking
  WHERE user_id = p_user_id
    AND feature_name = p_feature_name
    AND created_at >= today_start
    AND created_at < today_end;

  -- Check if under daily limit
  RETURN current_usage < daily_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;