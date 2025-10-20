-- Reality Anchor MVP Migration
-- Affirmations, Morning Intention, Reality Log

-- 1. AFFIRMATIONS TABLE
CREATE TABLE IF NOT EXISTS affirmations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category VARCHAR(50) NOT NULL,
  text TEXT NOT NULL,
  is_default BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_affirmations_category ON affirmations(category);

-- 2. MORNING INTENTIONS TABLE
CREATE TABLE IF NOT EXISTS morning_intentions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  affirmation_id UUID REFERENCES affirmations(id),
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, date)
);

CREATE INDEX IF NOT EXISTS idx_morning_intentions_user_date ON morning_intentions(user_id, date);

-- 3. ROUTINE STREAKS TABLE
CREATE TABLE IF NOT EXISTS routine_streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  routine_type VARCHAR(50) NOT NULL,
  current_streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  last_completed_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, routine_type)
);

-- 4. REALITY LOG TABLE
CREATE TABLE IF NOT EXISTS reality_log_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  event TEXT NOT NULL,
  fact TEXT NOT NULL,
  npd_trait VARCHAR(100),
  is_consistent BOOLEAN,
  pattern_note TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reality_log_user_date ON reality_log_entries(user_id, date);

-- SEED DEFAULT AFFIRMATIONS
INSERT INTO affirmations (category, text, is_default) VALUES
('morning', 'My only goal today is my peace and my children''s well-being', true),
('morning', 'I release the need to manage her emotions or expect normalcy', true),
('morning', 'Her actions are a reflection of her disorder, not my worth', true),
('morning', 'I am a project manager for a difficult co-parenting project', true),
('morning', 'Today I choose clarity over confusion', true),
('morning', 'I am building emotional detachment for my children''s sake', true),
('boundary', 'My boundaries are not negotiable', true),
('boundary', 'I can say no without guilt', true),
('boundary', 'Her reaction to my boundary is not my responsibility', true),
('boundary', 'I am protecting my peace, not being selfish', true),
('self-compassion', 'I have survived immense trauma and I am still here', true),
('self-compassion', 'I deserve kindness, especially from myself', true),
('self-compassion', 'My healing is not linear, and that''s okay', true),
('self-compassion', 'I am worthy of love and respect', true)
ON CONFLICT DO NOTHING;

-- RLS POLICIES
ALTER TABLE affirmations ENABLE ROW LEVEL SECURITY;
ALTER TABLE morning_intentions ENABLE ROW LEVEL SECURITY;
ALTER TABLE routine_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE reality_log_entries ENABLE ROW LEVEL SECURITY;

-- Affirmations - Public read
CREATE POLICY "Affirmations are public" ON affirmations
  FOR SELECT USING (true);

-- Morning Intentions - Users can only see their own
CREATE POLICY "Users can view own morning intentions" ON morning_intentions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own morning intentions" ON morning_intentions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own morning intentions" ON morning_intentions
  FOR UPDATE USING (auth.uid() = user_id);

-- Routine Streaks - Users can only see their own
CREATE POLICY "Users can view own streaks" ON routine_streaks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own streaks" ON routine_streaks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own streaks" ON routine_streaks
  FOR UPDATE USING (auth.uid() = user_id);

-- Reality Log - Users can only see their own
CREATE POLICY "Users can view own reality log" ON reality_log_entries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reality log" ON reality_log_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reality log" ON reality_log_entries
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reality log" ON reality_log_entries
  FOR DELETE USING (auth.uid() = user_id);
