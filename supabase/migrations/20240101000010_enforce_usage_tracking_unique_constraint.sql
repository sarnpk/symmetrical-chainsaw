-- Ensure a UNIQUE constraint exists for the ON CONFLICT target used in record_feature_usage
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint c
    JOIN pg_class t ON c.conrelid = t.oid
    WHERE t.relname = 'usage_tracking'
      AND c.conname = 'usage_tracking_unique_period'
  ) THEN
    ALTER TABLE usage_tracking
      ADD CONSTRAINT usage_tracking_unique_period
      UNIQUE (user_id, feature_name, usage_type, billing_period_start);
  END IF;
END $$;
