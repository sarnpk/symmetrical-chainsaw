-- Align usage_tracking with record_feature_usage function
-- 1) Ensure usage_type allows 'monthly_count'
ALTER TABLE usage_tracking
  DROP CONSTRAINT IF EXISTS usage_tracking_usage_type_check;
ALTER TABLE usage_tracking
  ADD CONSTRAINT usage_tracking_usage_type_check
  CHECK (usage_type IN ('api_call', 'storage_mb', 'export_request', 'ai_interaction', 'monthly_count'));

-- 2) Ensure the ON CONFLICT target exists (unique composite key)
CREATE UNIQUE INDEX IF NOT EXISTS idx_usage_tracking_unique_period
ON usage_tracking(user_id, feature_name, usage_type, billing_period_start);
