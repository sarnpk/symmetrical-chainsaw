-- Trial expiry system for redeem codes
-- Run this in Supabase SQL Editor

-- 1. Add trial date fields to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS trial_start_date TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS trial_end_date TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS pre_trial_tier TEXT DEFAULT 'foundation';

-- 2. Function to revert expired trials
CREATE OR REPLACE FUNCTION revert_expired_trials()
RETURNS void AS $$
  UPDATE profiles
  SET subscription_tier = pre_trial_tier::subscription_tier,
      trial_start_date = NULL,
      trial_end_date = NULL,
      pre_trial_tier = 'foundation',
      updated_at = NOW()
  WHERE trial_end_date IS NOT NULL
    AND trial_end_date < NOW()
    AND subscription_tier != pre_trial_tier::subscription_tier;
$$ LANGUAGE sql;

-- 3. Schedule it to run every hour via pg_cron (if available)
-- SELECT cron.schedule(
--   'revert-expired-trials',
--   '0 * * * *',
--   $$SELECT revert_expired_trials()$$
-- );
