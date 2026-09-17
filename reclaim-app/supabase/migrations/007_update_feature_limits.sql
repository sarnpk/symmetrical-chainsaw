-- Update feature_limits to match pricing page daily limits
-- Daily limits are multiplied by 30 for monthly equivalents

-- Foundation tier
INSERT INTO feature_limits (subscription_tier, feature_name, limit_type, limit_value)
VALUES
  ('foundation', 'ai_interactions', 'monthly_count', 150),
  ('foundation', 'pattern_analysis', 'monthly_count', 30),
  ('foundation', 'journal_entries', 'monthly_count', 90),
  ('foundation', 'mind_reset_sessions', 'monthly_count', 30),
  ('foundation', 'boundary_builder', 'monthly_count', 5),
  ('foundation', 'grey_rock_messages', 'monthly_count', 60),
  ('foundation', 'community_posts', 'monthly_count', -1),
  ('foundation', 'wellness', 'monthly_count', 60),
  ('foundation', 'transcription_minutes', 'monthly_count', 0),
  ('foundation', 'storage', 'storage_mb', 100),
  ('foundation', 'biff_assistant', 'monthly_count', 60),
  ('foundation', 'crisis_reframing', 'monthly_count', 90),
  ('foundation', 'narcissist_detector', 'monthly_count', 30),
  ('foundation', 'manipulation_decoder', 'monthly_count', 30),
  ('foundation', 'gaslighting_tracker', 'monthly_count', 60),
  ('foundation', 'healing_sessions', 'monthly_count', 30),
  ('foundation', 'copstrategies', 'monthly_count', 0),
  ('foundation', 'relationship_health_check', 'monthly_count', 4),
  ('foundation', 'narcissist_simulator', 'monthly_count', 0),
  ('foundation', 'journal_entries_daily', 'daily_count', 3),
  ('foundation', 'ai_interactions_daily', 'daily_count', 5),
  ('foundation', 'pattern_analysis_daily', 'daily_count', 1)
ON CONFLICT (subscription_tier, feature_name, limit_type) DO UPDATE SET limit_value = EXCLUDED.limit_value;

-- Recovery tier
INSERT INTO feature_limits (subscription_tier, feature_name, limit_type, limit_value)
VALUES
  ('recovery', 'ai_interactions', 'monthly_count', 750),
  ('recovery', 'pattern_analysis', 'monthly_count', 300),
  ('recovery', 'journal_entries', 'monthly_count', 450),
  ('recovery', 'mind_reset_sessions', 'monthly_count', 300),
  ('recovery', 'boundary_builder', 'monthly_count', 25),
  ('recovery', 'grey_rock_messages', 'monthly_count', 300),
  ('recovery', 'community_posts', 'monthly_count', -1),
  ('recovery', 'wellness', 'monthly_count', 300),
  ('recovery', 'transcription_minutes', 'monthly_count', 60),
  ('recovery', 'storage', 'storage_mb', 1024),
  ('recovery', 'biff_assistant', 'monthly_count', 300),
  ('recovery', 'crisis_reframing', 'monthly_count', 450),
  ('recovery', 'narcissist_detector', 'monthly_count', 150),
  ('recovery', 'manipulation_decoder', 'monthly_count', 150),
  ('recovery', 'gaslighting_tracker', 'monthly_count', 300),
  ('recovery', 'healing_sessions', 'monthly_count', 150),
  ('recovery', 'copstrategies', 'monthly_count', 15),
  ('recovery', 'relationship_health_check', 'monthly_count', 90),
  ('recovery', 'narcissist_simulator', 'monthly_count', 90),
  ('recovery', 'journal_entries_daily', 'daily_count', 15),
  ('recovery', 'ai_interactions_daily', 'daily_count', 25),
  ('recovery', 'pattern_analysis_daily', 'daily_count', 10)
ON CONFLICT (subscription_tier, feature_name, limit_type) DO UPDATE SET limit_value = EXCLUDED.limit_value;

-- Empowerment tier
INSERT INTO feature_limits (subscription_tier, feature_name, limit_type, limit_value)
VALUES
  ('empowerment', 'ai_interactions', 'monthly_count', 1500),
  ('empowerment', 'pattern_analysis', 'monthly_count', -1),
  ('empowerment', 'journal_entries', 'monthly_count', -1),
  ('empowerment', 'mind_reset_sessions', 'monthly_count', -1),
  ('empowerment', 'boundary_builder', 'monthly_count', -1),
  ('empowerment', 'grey_rock_messages', 'monthly_count', 1500),
  ('empowerment', 'community_posts', 'monthly_count', -1),
  ('empowerment', 'wellness', 'monthly_count', -1),
  ('empowerment', 'transcription_minutes', 'monthly_count', 300),
  ('empowerment', 'storage', 'storage_mb', 5120),
  ('empowerment', 'biff_assistant', 'monthly_count', 1500),
  ('empowerment', 'crisis_reframing', 'monthly_count', 1500),
  ('empowerment', 'narcissist_detector', 'monthly_count', 900),
  ('empowerment', 'manipulation_decoder', 'monthly_count', 900),
  ('empowerment', 'gaslighting_tracker', 'monthly_count', 1500),
  ('empowerment', 'healing_sessions', 'monthly_count', -1),
  ('empowerment', 'copstrategies', 'monthly_count', -1),
  ('empowerment', 'relationship_health_check', 'monthly_count', -1),
  ('empowerment', 'narcissist_simulator', 'monthly_count', 300),
  ('empowerment', 'journal_entries_daily', 'daily_count', -1),
  ('empowerment', 'ai_interactions_daily', 'daily_count', 50),
  ('empowerment', 'pattern_analysis_daily', 'daily_count', -1)
ON CONFLICT (subscription_tier, feature_name, limit_type) DO UPDATE SET limit_value = EXCLUDED.limit_value;
