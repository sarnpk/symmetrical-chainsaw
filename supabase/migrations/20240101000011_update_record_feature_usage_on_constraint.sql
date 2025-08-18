-- Recreate record_feature_usage to use explicit constraint name in ON CONFLICT
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

  -- Insert or update usage record using explicit unique constraint
  INSERT INTO usage_tracking (
    user_id, feature_name, usage_type, usage_count, usage_metadata,
    billing_period_start, billing_period_end
  ) VALUES (
    p_user_id, p_feature_name, p_usage_type, p_usage_count, p_metadata,
    current_period_start, current_period_end
  )
  ON CONFLICT ON CONSTRAINT usage_tracking_unique_period
  DO UPDATE SET
    usage_count = usage_tracking.usage_count + p_usage_count,
    usage_metadata = p_metadata;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
