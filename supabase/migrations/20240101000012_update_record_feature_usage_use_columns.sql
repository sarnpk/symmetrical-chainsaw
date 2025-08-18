-- Update record_feature_usage to use column list in ON CONFLICT instead of named constraint
CREATE OR REPLACE FUNCTION record_feature_usage(
  p_user_id UUID,
  p_feature_name TEXT,
  p_usage_type TEXT DEFAULT 'monthly_count',
  p_usage_count INTEGER DEFAULT 1,
  p_metadata JSONB DEFAULT '{}'
) RETURNS VOID AS $$
DECLARE
  current_period_start DATE;
  current_period_end DATE;
BEGIN
  -- Calculate current billing period
  current_period_start := DATE_TRUNC('month', CURRENT_DATE);
  current_period_end := current_period_start + INTERVAL '1 month' - INTERVAL '1 day';

  -- Ensure a unique index is present for conflict target
  -- (Safe to run multiple times due to IF NOT EXISTS)
  CREATE UNIQUE INDEX IF NOT EXISTS idx_usage_tracking_unique_period
  ON usage_tracking(user_id, feature_name, usage_type, billing_period_start);

  -- Upsert using the column list as conflict target
  INSERT INTO usage_tracking (
    user_id, feature_name, usage_type, usage_count, usage_metadata,
    billing_period_start, billing_period_end
  ) VALUES (
    p_user_id, p_feature_name, p_usage_type, p_usage_count, p_metadata,
    current_period_start, current_period_end
  )
  ON CONFLICT (user_id, feature_name, usage_type, billing_period_start)
  DO UPDATE SET
    usage_count = usage_tracking.usage_count + EXCLUDED.usage_count,
    usage_metadata = EXCLUDED.usage_metadata;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
