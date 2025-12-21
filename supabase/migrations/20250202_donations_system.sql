-- Donations tracking table
CREATE TABLE IF NOT EXISTS donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  stripe_session_id TEXT,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Add donor badge to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_donor BOOLEAN DEFAULT FALSE;

-- RLS policies
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own donations"
  ON donations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can create donations"
  ON donations FOR INSERT
  WITH CHECK (true);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_donations_user_id ON donations(user_id);
CREATE INDEX IF NOT EXISTS idx_donations_stripe_session ON donations(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_profiles_is_donor ON profiles(is_donor);

-- Comments
COMMENT ON TABLE donations IS 'Tracks user donations to support the platform';
COMMENT ON COLUMN profiles.is_donor IS 'Badge for users who have donated';
