-- Cognitive Dissonance Alert System
-- Detects conflicting beliefs/statements across journals

CREATE TABLE cognitive_dissonance_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  alert_type VARCHAR(50) NOT NULL, -- 'belief_conflict', 'statement_conflict', 'memory_conflict'
  severity VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high'
  
  -- Source entries that conflict
  source_1_type VARCHAR(50) NOT NULL, -- 'journal', 'belief', 'gaslighting', 'reality_log'
  source_1_id UUID NOT NULL,
  source_1_text TEXT NOT NULL,
  source_1_date TIMESTAMP NOT NULL,
  
  source_2_type VARCHAR(50) NOT NULL,
  source_2_id UUID NOT NULL,
  source_2_text TEXT NOT NULL,
  source_2_date TIMESTAMP NOT NULL,
  
  -- Conflict details
  conflict_summary TEXT NOT NULL,
  ai_analysis TEXT,
  
  -- User interaction
  is_dismissed BOOLEAN DEFAULT FALSE,
  is_resolved BOOLEAN DEFAULT FALSE,
  user_notes TEXT,
  resolved_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_cd_alerts_user ON cognitive_dissonance_alerts(user_id, created_at DESC);
CREATE INDEX idx_cd_alerts_unresolved ON cognitive_dissonance_alerts(user_id, is_resolved, is_dismissed) WHERE is_resolved = FALSE AND is_dismissed = FALSE;

-- RLS Policies
ALTER TABLE cognitive_dissonance_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own alerts"
  ON cognitive_dissonance_alerts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own alerts"
  ON cognitive_dissonance_alerts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert alerts"
  ON cognitive_dissonance_alerts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own alerts"
  ON cognitive_dissonance_alerts FOR DELETE
  USING (auth.uid() = user_id);
