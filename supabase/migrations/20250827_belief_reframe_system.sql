-- =====================================================
-- BELIEF REFRAME SYSTEM
-- CBT-based false belief tracking and reality testing
-- =====================================================

-- Core beliefs table
CREATE TABLE IF NOT EXISTS false_beliefs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  belief_text TEXT NOT NULL,
  belief_category TEXT CHECK (belief_category IN ('self_worth', 'dependency', 'reality_doubt', 'responsibility', 'capability')),
  is_preset BOOLEAN DEFAULT false,
  
  current_strength INTEGER CHECK (current_strength BETWEEN 1 AND 10) NOT NULL,
  initial_strength INTEGER CHECK (initial_strength BETWEEN 1 AND 10) NOT NULL,
  
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'resolved')),
  
  origin_journal_entry_id UUID REFERENCES journal_entries(id),
  origin_memory_text TEXT,
  origin_memory_audio_url TEXT,
  origin_memory_image_url TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Counter-evidence collection
CREATE TABLE IF NOT EXISTS counter_evidence (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  belief_id UUID REFERENCES false_beliefs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  evidence_text TEXT NOT NULL,
  evidence_source TEXT CHECK (evidence_source IN ('journal', 'manual', 'ai_suggested')) DEFAULT 'manual',
  evidence_strength INTEGER CHECK (evidence_strength BETWEEN 1 AND 5) DEFAULT 3,
  
  related_journal_entry_id UUID REFERENCES journal_entries(id),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Belief strength history
CREATE TABLE IF NOT EXISTS belief_strength_log (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  belief_id UUID REFERENCES false_beliefs(id) ON DELETE CASCADE,
  
  strength INTEGER CHECK (strength BETWEEN 1 AND 10) NOT NULL,
  notes TEXT,
  
  logged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reality testing sessions
CREATE TABLE IF NOT EXISTS reality_testing_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  belief_id UUID REFERENCES false_beliefs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  evidence_for TEXT,
  evidence_against TEXT,
  alternative_explanation TEXT,
  source_analysis TEXT,
  
  strength_before INTEGER CHECK (strength_before BETWEEN 1 AND 10),
  strength_after INTEGER CHECK (strength_after BETWEEN 1 AND 10),
  
  insights TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily affirmations
CREATE TABLE IF NOT EXISTS belief_affirmations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  belief_id UUID REFERENCES false_beliefs(id),
  
  affirmation_text TEXT NOT NULL,
  is_ai_generated BOOLEAN DEFAULT false,
  
  times_viewed INTEGER DEFAULT 0,
  user_rating INTEGER CHECK (user_rating BETWEEN 1 AND 5),
  feels_believable BOOLEAN,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_viewed_at TIMESTAMP WITH TIME ZONE
);

-- Indexes
CREATE INDEX idx_false_beliefs_user_status ON false_beliefs(user_id, status);
CREATE INDEX idx_counter_evidence_belief ON counter_evidence(belief_id);
CREATE INDEX idx_belief_strength_log_belief ON belief_strength_log(belief_id, logged_at DESC);
CREATE INDEX idx_reality_testing_belief ON reality_testing_sessions(belief_id);
CREATE INDEX idx_affirmations_user_belief ON belief_affirmations(user_id, belief_id);

-- RLS Policies
ALTER TABLE false_beliefs ENABLE ROW LEVEL SECURITY;
ALTER TABLE counter_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE belief_strength_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE reality_testing_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE belief_affirmations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own beliefs" ON false_beliefs
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own evidence" ON counter_evidence
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own strength logs" ON belief_strength_log
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM false_beliefs WHERE false_beliefs.id = belief_strength_log.belief_id AND false_beliefs.user_id = auth.uid())
  );

CREATE POLICY "System can insert strength logs" ON belief_strength_log
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can manage their own reality testing" ON reality_testing_sessions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own affirmations" ON belief_affirmations
  FOR ALL USING (auth.uid() = user_id);

-- Function to auto-log strength changes
CREATE OR REPLACE FUNCTION log_belief_strength_change()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'UPDATE' AND OLD.current_strength != NEW.current_strength) OR TG_OP = 'INSERT' THEN
    INSERT INTO belief_strength_log (belief_id, strength, notes)
    VALUES (NEW.id, NEW.current_strength, 'Strength updated');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_log_belief_strength
AFTER INSERT OR UPDATE ON false_beliefs
FOR EACH ROW
EXECUTE FUNCTION log_belief_strength_change();
