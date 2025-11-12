-- No Contact Anchor Feature
-- Helps users stay strong during withdrawal from narcissistic relationships
-- Reuses safety_plans.emergency_contacts for safe contacts

-- No Contact Settings (one row per user)
CREATE TABLE no_contact_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  no_contact_start_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Withdrawal Tracker (urge logs)
CREATE TABLE withdrawal_tracker (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  urge_intensity INTEGER CHECK (urge_intensity BETWEEN 1 AND 10),
  withdrawal_symptoms TEXT[],
  trigger_description TEXT,
  how_resisted TEXT,
  logged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_no_contact_settings_user_id ON no_contact_settings(user_id);
CREATE INDEX idx_withdrawal_tracker_user_id ON withdrawal_tracker(user_id, logged_at DESC);

-- Row Level Security
ALTER TABLE no_contact_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawal_tracker ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their own no contact settings" ON no_contact_settings
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own withdrawal tracker entries" ON withdrawal_tracker
  FOR ALL USING (auth.uid() = user_id);
