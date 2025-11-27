-- Tier-Exclusive Feature Access Migration
-- Replaces usage limits with tier-exclusive feature access

-- Clear existing feature limits
DELETE FROM feature_limits;

-- FOUNDATION TIER (FREE) - Basic Features Only
INSERT INTO feature_limits (subscription_tier, feature_name, limit_type, limit_value) VALUES
-- Core Features Available
('foundation', 'dashboard', 'monthly_count', -1),
('foundation', 'journal_entries', 'monthly_count', 3), -- 3 entries per day
('foundation', 'reality_anchor', 'monthly_count', 5), -- 5 reality logs per day
('foundation', 'ai_coach', 'monthly_count', 5), -- 5 AI chats per day
('foundation', 'safety_plan', 'monthly_count', -1), -- Full access (safety critical)
('foundation', 'affirmations', 'monthly_count', 5), -- 5 affirmations per day
('foundation', 'community', 'monthly_count', 3), -- 3 posts per day
('foundation', 'feedback', 'monthly_count', -1), -- Full access

-- Basic Analysis
('foundation', 'narcissist_detector', 'monthly_count', 1), -- 1 detection per day
('foundation', 'gaslighting_tracker', 'monthly_count', 2), -- 2 per day

-- Technical Limits
('foundation', 'storage', 'storage_mb', 100), -- 100 MB storage
('foundation', 'transcription_minutes', 'monthly_count', 0), -- No transcription
('foundation', 'export_requests', 'monthly_count', 1), -- 1 export per month

-- RECOVERY TIER ($15/month) - Adds Recovery & Protection Features
('recovery', 'dashboard', 'monthly_count', -1),

-- Foundation Features (Increased Limits)
('recovery', 'journal_entries', 'monthly_count', 15), -- 15 entries per day
('recovery', 'reality_anchor', 'monthly_count', 20), -- 20 reality logs per day
('recovery', 'ai_coach', 'monthly_count', 25), -- 25 AI chats per day
('recovery', 'safety_plan', 'monthly_count', -1), -- Full access
('recovery', 'affirmations', 'monthly_count', 20), -- 20 affirmations per day
('recovery', 'community', 'monthly_count', 10), -- 10 posts per day
('recovery', 'feedback', 'monthly_count', -1), -- Full access
('recovery', 'narcissist_detector', 'monthly_count', 5), -- 5 detections per day
('recovery', 'gaslighting_tracker', 'monthly_count', 10), -- 10 per day

-- NEW RECOVERY-EXCLUSIVE FEATURES
('recovery', 'toxic_memories', 'monthly_count', 5), -- Recovery+ only
('recovery', 'letting_go', 'monthly_count', 5), -- Recovery+ only
('recovery', 'patterns', 'monthly_count', 10), -- Recovery+ only
('recovery', 'grey_rock_templates', 'monthly_count', 15), -- Recovery+ only
('recovery', 'grey_rock_practice', 'monthly_count', 10), -- Recovery+ only
('recovery', 'biff_assistant', 'monthly_count', 10), -- Recovery+ only
('recovery', 'wellness', 'monthly_count', 10), -- Recovery+ only
('recovery', 'crisis_reframe', 'monthly_count', 15), -- Recovery+ only
('recovery', 'mind_reset', 'monthly_count', 10), -- Recovery+ only
('recovery', 'positive_moments', 'monthly_count', 10), -- Recovery+ only
('recovery', 'manipulation_decoder', 'monthly_count', 5), -- Recovery+ only
('recovery', 'relationship_health', 'monthly_count', 3), -- Recovery+ only
('recovery', 'npd_traits', 'monthly_count', 10), -- Recovery+ only

-- Technical Limits
('recovery', 'storage', 'storage_mb', 10240), -- 10 GB storage
('recovery', 'transcription_minutes', 'monthly_count', 60), -- 60 minutes per month
('recovery', 'export_requests', 'monthly_count', 5), -- 5 exports per month

-- EMPOWERMENT TIER ($24.99/month) - Adds Advanced Analysis & Unlimited Access
('empowerment', 'dashboard', 'monthly_count', -1),

-- All Recovery Features (Unlimited)
('empowerment', 'journal_entries', 'monthly_count', -1), -- Unlimited
('empowerment', 'reality_anchor', 'monthly_count', -1), -- Unlimited
('empowerment', 'ai_coach', 'monthly_count', -1), -- Unlimited
('empowerment', 'safety_plan', 'monthly_count', -1), -- Full access
('empowerment', 'affirmations', 'monthly_count', -1), -- Unlimited
('empowerment', 'community', 'monthly_count', -1), -- Unlimited
('empowerment', 'feedback', 'monthly_count', -1), -- Full access
('empowerment', 'narcissist_detector', 'monthly_count', -1), -- Unlimited
('empowerment', 'gaslighting_tracker', 'monthly_count', -1), -- Unlimited
('empowerment', 'toxic_memories', 'monthly_count', -1), -- Unlimited
('empowerment', 'letting_go', 'monthly_count', -1), -- Unlimited
('empowerment', 'patterns', 'monthly_count', -1), -- Unlimited
('empowerment', 'grey_rock_templates', 'monthly_count', -1), -- Unlimited
('empowerment', 'grey_rock_practice', 'monthly_count', -1), -- Unlimited
('empowerment', 'biff_assistant', 'monthly_count', -1), -- Unlimited
('empowerment', 'wellness', 'monthly_count', -1), -- Unlimited
('empowerment', 'crisis_reframe', 'monthly_count', -1), -- Unlimited
('empowerment', 'mind_reset', 'monthly_count', -1), -- Unlimited
('empowerment', 'positive_moments', 'monthly_count', -1), -- Unlimited
('empowerment', 'manipulation_decoder', 'monthly_count', -1), -- Unlimited
('empowerment', 'relationship_health', 'monthly_count', -1), -- Unlimited
('empowerment', 'npd_traits', 'monthly_count', -1), -- Unlimited

-- EMPOWERMENT-EXCLUSIVE FEATURES
('empowerment', 'stonewalling', 'monthly_count', -1), -- Empowerment only
('empowerment', 'reactive_abuse', 'monthly_count', -1), -- Empowerment only
('empowerment', 'healing', 'monthly_count', -1), -- Empowerment only
('empowerment', 'belief_reframe', 'monthly_count', -1), -- Empowerment only
('empowerment', 'no_contact_anchor', 'monthly_count', -1), -- Empowerment only
('empowerment', 'acceptance', 'monthly_count', -1), -- Empowerment only
('empowerment', 'role_reframing', 'monthly_count', -1), -- Empowerment only
('empowerment', 'narcissist_simulator', 'monthly_count', -1), -- Empowerment only
('empowerment', 'empathy_audit', 'monthly_count', -1), -- Empowerment only

-- Technical Limits
('empowerment', 'storage', 'storage_mb', 102400), -- 100 GB storage
('empowerment', 'transcription_minutes', 'monthly_count', 300), -- 300 minutes per month
('empowerment', 'export_requests', 'monthly_count', -1); -- Unlimited exports