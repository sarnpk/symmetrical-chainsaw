-- Fix Empowerment Tier Limits
-- Change from unlimited (-1) to high but reasonable limits

-- Update Empowerment tier with high limits instead of unlimited
UPDATE feature_limits SET limit_value = 100 WHERE subscription_tier = 'empowerment' AND feature_name = 'journal_entries' AND limit_type = 'monthly_count';
UPDATE feature_limits SET limit_value = 100 WHERE subscription_tier = 'empowerment' AND feature_name = 'reality_anchor' AND limit_type = 'monthly_count';
UPDATE feature_limits SET limit_value = 50 WHERE subscription_tier = 'empowerment' AND feature_name = 'toxic_memories' AND limit_type = 'monthly_count';
UPDATE feature_limits SET limit_value = 50 WHERE subscription_tier = 'empowerment' AND feature_name = 'letting_go' AND limit_type = 'monthly_count';
UPDATE feature_limits SET limit_value = 50 WHERE subscription_tier = 'empowerment' AND feature_name = 'patterns' AND limit_type = 'monthly_count';

-- Protection features
UPDATE feature_limits SET limit_value = 100 WHERE subscription_tier = 'empowerment' AND feature_name = 'grey_rock_templates' AND limit_type = 'monthly_count';
UPDATE feature_limits SET limit_value = 100 WHERE subscription_tier = 'empowerment' AND feature_name = 'grey_rock_practice' AND limit_type = 'monthly_count';
UPDATE feature_limits SET limit_value = 100 WHERE subscription_tier = 'empowerment' AND feature_name = 'biff_assistant' AND limit_type = 'monthly_count';
UPDATE feature_limits SET limit_value = 50 WHERE subscription_tier = 'empowerment' AND feature_name = 'stonewalling' AND limit_type = 'monthly_count';
UPDATE feature_limits SET limit_value = 50 WHERE subscription_tier = 'empowerment' AND feature_name = 'reactive_abuse' AND limit_type = 'monthly_count';

-- Wellness features
UPDATE feature_limits SET limit_value = 100 WHERE subscription_tier = 'empowerment' AND feature_name = 'wellness' AND limit_type = 'monthly_count';
UPDATE feature_limits SET limit_value = 100 WHERE subscription_tier = 'empowerment' AND feature_name = 'crisis_reframe' AND limit_type = 'monthly_count';
UPDATE feature_limits SET limit_value = 50 WHERE subscription_tier = 'empowerment' AND feature_name = 'healing' AND limit_type = 'monthly_count';
UPDATE feature_limits SET limit_value = 100 WHERE subscription_tier = 'empowerment' AND feature_name = 'mind_reset' AND limit_type = 'monthly_count';
UPDATE feature_limits SET limit_value = 50 WHERE subscription_tier = 'empowerment' AND feature_name = 'belief_reframe' AND limit_type = 'monthly_count';
UPDATE feature_limits SET limit_value = 200 WHERE subscription_tier = 'empowerment' AND feature_name = 'affirmations' AND limit_type = 'monthly_count';
UPDATE feature_limits SET limit_value = 100 WHERE subscription_tier = 'empowerment' AND feature_name = 'positive_moments' AND limit_type = 'monthly_count';
UPDATE feature_limits SET limit_value = 100 WHERE subscription_tier = 'empowerment' AND feature_name = 'no_contact_anchor' AND limit_type = 'monthly_count';
UPDATE feature_limits SET limit_value = 50 WHERE subscription_tier = 'empowerment' AND feature_name = 'acceptance' AND limit_type = 'monthly_count';
UPDATE feature_limits SET limit_value = 50 WHERE subscription_tier = 'empowerment' AND feature_name = 'role_reframing' AND limit_type = 'monthly_count';

-- Analysis features (AI-heavy, keep reasonable)
UPDATE feature_limits SET limit_value = 50 WHERE subscription_tier = 'empowerment' AND feature_name = 'narcissist_detector' AND limit_type = 'monthly_count';
UPDATE feature_limits SET limit_value = 50 WHERE subscription_tier = 'empowerment' AND feature_name = 'narcissist_simulator' AND limit_type = 'monthly_count';
UPDATE feature_limits SET limit_value = 50 WHERE subscription_tier = 'empowerment' AND feature_name = 'manipulation_decoder' AND limit_type = 'monthly_count';
UPDATE feature_limits SET limit_value = 30 WHERE subscription_tier = 'empowerment' AND feature_name = 'relationship_health' AND limit_type = 'monthly_count';
UPDATE feature_limits SET limit_value = 100 WHERE subscription_tier = 'empowerment' AND feature_name = 'npd_traits' AND limit_type = 'monthly_count';
UPDATE feature_limits SET limit_value = 100 WHERE subscription_tier = 'empowerment' AND feature_name = 'gaslighting_tracker' AND limit_type = 'monthly_count';
UPDATE feature_limits SET limit_value = 30 WHERE subscription_tier = 'empowerment' AND feature_name = 'empathy_audit' AND limit_type = 'monthly_count';

-- Support features (AI coach is most expensive)
UPDATE feature_limits SET limit_value = 500 WHERE subscription_tier = 'empowerment' AND feature_name = 'ai_coach' AND limit_type = 'monthly_count';
UPDATE feature_limits SET limit_value = 100 WHERE subscription_tier = 'empowerment' AND feature_name = 'community' AND limit_type = 'monthly_count';

-- Technical limits (keep reasonable for storage/bandwidth)
-- storage_mb stays at 102400 (100 GB)
UPDATE feature_limits SET limit_value = 600 WHERE subscription_tier = 'empowerment' AND feature_name = 'transcription_minutes' AND limit_type = 'monthly_count';
UPDATE feature_limits SET limit_value = 50 WHERE subscription_tier = 'empowerment' AND feature_name = 'export_requests' AND limit_type = 'monthly_count';

-- Add ai_interactions limit for empowerment (used by general AI chat)
INSERT INTO feature_limits (subscription_tier, feature_name, limit_type, limit_value) 
VALUES ('empowerment', 'ai_interactions', 'monthly_count', 500)
ON CONFLICT (subscription_tier, feature_name, limit_type) 
DO UPDATE SET limit_value = 500;
