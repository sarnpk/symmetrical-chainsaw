-- Ensure a unique index exists for record_feature_usage ON CONFLICT clause
-- Some environments may be missing the UNIQUE constraint originally defined.

CREATE UNIQUE INDEX IF NOT EXISTS idx_usage_tracking_unique_period
ON usage_tracking(user_id, feature_name, usage_type, billing_period_start);
