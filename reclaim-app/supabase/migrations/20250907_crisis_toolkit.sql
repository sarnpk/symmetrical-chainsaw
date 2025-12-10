-- Crisis Toolkit Feature
-- Quick-access mental health intervention system

CREATE TABLE IF NOT EXISTS crisis_toolkit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  
  condition_type TEXT NOT NULL, -- 'anxiety', 'depression', 'ptsd', 'social_anxiety', 'ocd'
  skills_used TEXT[] DEFAULT '{}',
  helpful_rating INTEGER CHECK (helpful_rating >= 1 AND helpful_rating <= 5),
  notes TEXT,
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_favorite_interventions (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  condition_type TEXT NOT NULL,
  skill_name TEXT NOT NULL,
  times_used INTEGER DEFAULT 0,
  avg_rating DECIMAL(3,2),
  
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_id, condition_type, skill_name)
);

-- Indexes
CREATE INDEX idx_crisis_toolkit_logs_user ON crisis_toolkit_logs(user_id);
CREATE INDEX idx_crisis_toolkit_logs_condition ON crisis_toolkit_logs(condition_type);
CREATE INDEX idx_crisis_toolkit_logs_created ON crisis_toolkit_logs(created_at DESC);

-- RLS Policies
ALTER TABLE crisis_toolkit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorite_interventions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own toolkit logs"
  ON crisis_toolkit_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own toolkit logs"
  ON crisis_toolkit_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own favorite interventions"
  ON user_favorite_interventions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own favorite interventions"
  ON user_favorite_interventions FOR ALL
  USING (auth.uid() = user_id);
