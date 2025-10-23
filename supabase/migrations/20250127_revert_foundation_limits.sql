-- Revert Foundation limits and set proper freemium limits that encourage upgrades

-- Delete the overly generous limits
DELETE FROM feature_limits WHERE subscription_tier = 'foundation';

-- Set restrictive Foundation tier limits (Free) - designed to encourage upgrades
INSERT INTO feature_limits (subscription_tier, feature_name, limit_type, limit_value) VALUES
-- Very limited to encourage upgrades
('foundation', 'journal_entries', 'monthly_count', 10), -- Only 10 entries per month total
('foundation', 'ai_interactions', 'monthly_count', 15), -- Only 15 AI chats per month total  
('foundation', 'manipulation_decoder', 'monthly_count', 3), -- Only 3 analyses per month
('foundation', 'mind_reset_sessions', 'monthly_count', 5), -- Only 5 sessions per month
('foundation', 'reality_anchor', 'monthly_count', 0), -- Not included - Recovery tier feature
('foundation', 'reality_log', 'monthly_count', 0), -- Not included - Recovery tier feature
('foundation', 'safety_plan', 'monthly_count', -1), -- Keep unlimited (safety first)
('foundation', 'grey_rock', 'monthly_count', -1), -- Keep unlimited (safety first)
('foundation', 'storage', 'storage_mb', 50), -- Reduced to 50 MB
('foundation', 'audio_transcription', 'monthly_count', 0), -- Not included
('foundation', 'export_requests', 'monthly_count', 1) -- Only 1 export per month
ON CONFLICT (subscription_tier, feature_name, limit_type) DO UPDATE SET
limit_value = EXCLUDED.limit_value;

-- Keep Recovery and Empowered tiers generous to show value
-- Recovery tier ($15/month)
DELETE FROM feature_limits WHERE subscription_tier = 'recovery';
INSERT INTO feature_limits (subscription_tier, feature_name, limit_type, limit_value) VALUES
('recovery', 'journal_entries', 'monthly_count', 200), -- Good daily usage
('recovery', 'ai_interactions', 'monthly_count', 300), -- Frequent conversations
('recovery', 'manipulation_decoder', 'monthly_count', 50), -- Multiple daily
('recovery', 'mind_reset_sessions', 'monthly_count', 100), -- Several daily
('recovery', 'reality_anchor', 'monthly_count', -1), -- Unlimited with tracking
('recovery', 'reality_log', 'monthly_count', -1), -- Unlimited documentation
('recovery', 'pattern_analysis', 'monthly_count', 20), -- Advanced features
('recovery', 'safety_plan', 'monthly_count', -1), -- Full access
('recovery', 'grey_rock', 'monthly_count', -1), -- Full access
('recovery', 'storage', 'storage_mb', 10240), -- 10 GB
('recovery', 'audio_transcription', 'monthly_count', 60), -- 60 minutes
('recovery', 'export_requests', 'monthly_count', 10) -- Multiple exports
ON CONFLICT (subscription_tier, feature_name, limit_type) DO UPDATE SET
limit_value = EXCLUDED.limit_value;

-- Empowered tier ($24.99/month) - truly unlimited
DELETE FROM feature_limits WHERE subscription_tier = 'empowerment';
INSERT INTO feature_limits (subscription_tier, feature_name, limit_type, limit_value) VALUES
('empowerment', 'journal_entries', 'monthly_count', -1), -- Unlimited
('empowerment', 'ai_interactions', 'monthly_count', -1), -- Unlimited
('empowerment', 'manipulation_decoder', 'monthly_count', -1), -- Unlimited
('empowerment', 'mind_reset_sessions', 'monthly_count', -1), -- Unlimited
('empowerment', 'reality_anchor', 'monthly_count', -1), -- Unlimited with analytics
('empowerment', 'reality_log', 'monthly_count', -1), -- Unlimited with analytics
('empowerment', 'pattern_analysis', 'monthly_count', -1), -- Advanced dashboard
('empowerment', 'safety_plan', 'monthly_count', -1), -- Full access
('empowerment', 'grey_rock', 'monthly_count', -1), -- Full access
('empowerment', 'storage', 'storage_mb', 102400), -- 100 GB
('empowerment', 'audio_transcription', 'monthly_count', 300), -- 300 minutes
('empowerment', 'export_requests', 'monthly_count', -1) -- Unlimited
ON CONFLICT (subscription_tier, feature_name, limit_type) DO UPDATE SET
limit_value = EXCLUDED.limit_value;