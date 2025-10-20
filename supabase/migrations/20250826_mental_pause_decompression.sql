-- Mental Pause & Decompression Ritual Tables

-- Mental Pause Sessions (pre-interaction)
CREATE TABLE IF NOT EXISTS mental_pause_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  interaction_type VARCHAR(50) NOT NULL, -- 'pickup', 'dropoff', 'phone_call', 'text_exchange', 'other'
  mood_before INT CHECK (mood_before >= 1 AND mood_before <= 10),
  breathing_completed BOOLEAN DEFAULT FALSE,
  visualization_completed BOOLEAN DEFAULT FALSE,
  mantra_used TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mental_pause_user_date ON mental_pause_sessions(user_id, created_at);

-- Decompression Ritual Sessions (post-interaction)
CREATE TABLE IF NOT EXISTS decompression_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  interaction_type VARCHAR(50) NOT NULL,
  mood_before INT CHECK (mood_before >= 1 AND mood_before <= 10),
  mood_after INT CHECK (mood_after >= 1 AND mood_after <= 10),
  ritual_type VARCHAR(50) NOT NULL, -- 'walk', 'exercise', 'meditation', 'music', 'journaling', 'other'
  duration_minutes INT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_decompression_user_date ON decompression_sessions(user_id, created_at);

-- RLS Policies
ALTER TABLE mental_pause_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE decompression_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own mental pause sessions" ON mental_pause_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own mental pause sessions" ON mental_pause_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own mental pause sessions" ON mental_pause_sessions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own mental pause sessions" ON mental_pause_sessions
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own decompression sessions" ON decompression_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own decompression sessions" ON decompression_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own decompression sessions" ON decompression_sessions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own decompression sessions" ON decompression_sessions
  FOR DELETE USING (auth.uid() = user_id);