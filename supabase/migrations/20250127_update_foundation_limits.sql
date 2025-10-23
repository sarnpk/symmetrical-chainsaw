-- Update Foundation tier limits to match marketing promises
-- Current marketing: 3 journal entries, 5 AI chats, 1 pattern check, 1 mind reset per day

-- Delete existing foundation limits
DELETE FROM feature_limits WHERE subscription_tier = 'foundation';

-- Insert updated Foundation tier limits (Free)
INSERT INTO feature_limits (subscription_tier, feature_name, limit_type, limit_value) VALUES
-- Daily limits converted to monthly (30 days)
('foundation', 'journal_entries', 'monthly_count', 90), -- 3 per day * 30 days
('foundation', 'ai_interactions', 'monthly_count', 150), -- 5 per day * 30 days  
('foundation', 'manipulation_decoder', 'monthly_count', 30), -- 1 per day * 30 days
('foundation', 'mind_reset_sessions', 'monthly_count', 30), -- 1 per day * 30 days
('foundation', 'reality_anchor', 'monthly_count', -1), -- Unlimited (Morning Intentions & Mental Pause)
('foundation', 'safety_plan', 'monthly_count', -1), -- Full access
('foundation', 'grey_rock', 'monthly_count', -1), -- Full access
('foundation', 'storage', 'storage_mb', 100), -- 100 MB storage
('foundation', 'audio_transcription', 'monthly_count', 0), -- Not included
('foundation', 'export_requests', 'monthly_count', 2) -- Basic export capability
ON CONFLICT (subscription_tier, feature_name, limit_type) DO UPDATE SET
limit_value = EXCLUDED.limit_value;

-- Update Recovery tier to match marketing
DELETE FROM feature_limits WHERE subscription_tier = 'recovery';
INSERT INTO feature_limits (subscription_tier, feature_name, limit_type, limit_value) VALUES
('recovery', 'journal_entries', 'monthly_count', -1), -- Plenty daily = unlimited
('recovery', 'ai_interactions', 'monthly_count', -1), -- Frequent daily = unlimited
('recovery', 'manipulation_decoder', 'monthly_count', -1), -- Multiple per day = unlimited
('recovery', 'mind_reset_sessions', 'monthly_count', -1), -- Several daily = unlimited
('recovery', 'reality_anchor', 'monthly_count', -1), -- Complete routine with streak tracking
('recovery', 'pattern_analysis', 'monthly_count', -1), -- Advanced NPD trait library
('recovery', 'safety_plan', 'monthly_count', -1), -- Full access
('recovery', 'grey_rock', 'monthly_count', -1), -- Full access
('recovery', 'storage', 'storage_mb', 10240), -- 10 GB
('recovery', 'audio_transcription', 'monthly_count', 60), -- 60 minutes monthly
('recovery', 'export_requests', 'monthly_count', 10) -- Priority support
ON CONFLICT (subscription_tier, feature_name, limit_type) DO UPDATE SET
limit_value = EXCLUDED.limit_value;

-- Update Empowered tier to match marketing  
DELETE FROM feature_limits WHERE subscription_tier = 'empowerment';
INSERT INTO feature_limits (subscription_tier, feature_name, limit_type, limit_value) VALUES
('empowerment', 'journal_entries', 'monthly_count', -1), -- Unlimited
('empowerment', 'ai_interactions', 'monthly_count', -1), -- Unlimited conversations
('empowerment', 'manipulation_decoder', 'monthly_count', -1), -- Unlimited analyses
('empowerment', 'mind_reset_sessions', 'monthly_count', -1), -- Unlimited exercises
('empowerment', 'reality_anchor', 'monthly_count', -1), -- Unlimited with advanced analytics
('empowerment', 'pattern_analysis', 'monthly_count', -1), -- Advanced behavior pattern dashboard
('empowerment', 'safety_plan', 'monthly_count', -1), -- Full access
('empowerment', 'grey_rock', 'monthly_count', -1), -- Full access
('empowerment', 'storage', 'storage_mb', 102400), -- 100 GB
('empowerment', 'audio_transcription', 'monthly_count', 300), -- 300 minutes monthly
('empowerment', 'export_requests', 'monthly_count', -1) -- Unlimited
ON CONFLICT (subscription_tier, feature_name, limit_type) DO UPDATE SET
limit_value = EXCLUDED.limit_value;

-- Add comments
COMMENT ON TABLE feature_limits IS 'Defines usage limits for each subscription tier and feature';