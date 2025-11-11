-- =====================================================
-- POSITIVE MOMENTS JOURNAL
-- Quick capture of positive experiences for counter-evidence
-- =====================================================

CREATE TABLE IF NOT EXISTS positive_moments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  moment_text TEXT NOT NULL,
  moment_date DATE DEFAULT CURRENT_DATE,
  
  tags TEXT[], -- 'achievement', 'kindness_received', 'self_care', 'connection', 'strength'
  mood_rating INTEGER CHECK (mood_rating BETWEEN 1 AND 10),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_positive_moments_user_date ON positive_moments(user_id, moment_date DESC);

ALTER TABLE positive_moments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own positive moments" ON positive_moments
  FOR ALL USING (auth.uid() = user_id);
