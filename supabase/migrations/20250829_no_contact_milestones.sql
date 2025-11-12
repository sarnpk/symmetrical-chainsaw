-- No Contact Milestones
CREATE TABLE no_contact_milestones (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  milestone_days INTEGER NOT NULL,
  achieved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, milestone_days)
);

CREATE INDEX idx_no_contact_milestones_user_id ON no_contact_milestones(user_id, achieved_at DESC);

ALTER TABLE no_contact_milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own milestones" ON no_contact_milestones
  FOR ALL USING (auth.uid() = user_id);
