-- Crisis Reframe Feature
-- Stores AI-generated crisis interventions for panic situations

CREATE TABLE IF NOT EXISTS crisis_reframes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- Crisis details
  crisis_type TEXT NOT NULL, -- 'discard', 'rage', 'silent_treatment', 'hoovering', 'devaluation', 'gaslighting', 'cycle_repeat', 'other'
  context_data JSONB NOT NULL DEFAULT '{}', -- User's answers to context questions
  
  -- AI-generated reframe
  ai_reframe JSONB NOT NULL, -- Full structured reframe with all sections
  
  -- User interaction
  revisited_count INTEGER DEFAULT 0,
  last_revisited_at TIMESTAMP,
  helpful_rating INTEGER CHECK (helpful_rating >= 1 AND helpful_rating <= 5),
  notes TEXT,
  
  -- Control tracking
  control_checklist JSONB DEFAULT '{}', -- Which commitments user made
  survived_duration INTEGER DEFAULT 0, -- Minutes survived without reacting
  prevented_contact BOOLEAN DEFAULT false, -- Did they avoid texting?
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_crisis_reframes_user ON crisis_reframes(user_id);
CREATE INDEX idx_crisis_reframes_type ON crisis_reframes(crisis_type);
CREATE INDEX idx_crisis_reframes_created ON crisis_reframes(created_at DESC);

-- RLS Policies
ALTER TABLE crisis_reframes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own crisis reframes"
  ON crisis_reframes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own crisis reframes"
  ON crisis_reframes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own crisis reframes"
  ON crisis_reframes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own crisis reframes"
  ON crisis_reframes FOR DELETE
  USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_crisis_reframes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER crisis_reframes_updated_at
  BEFORE UPDATE ON crisis_reframes
  FOR EACH ROW
  EXECUTE FUNCTION update_crisis_reframes_updated_at();
