-- Acceptance & Educational Modules

-- User progress through acceptance content
CREATE TABLE IF NOT EXISTS acceptance_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  module_type TEXT CHECK (module_type IN ('mask_visualization', 'grief_processing', 'acceptance_affirmations', 'expectation_vs_reality', 'trigger_identification')),
  completed BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Role reframing boundaries and responsibilities
CREATE TABLE IF NOT EXISTS role_boundaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  responsibility_area TEXT NOT NULL,
  my_responsibility BOOLEAN NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Empathy audit tracking
CREATE TABLE IF NOT EXISTS empathy_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  empathy_target TEXT CHECK (empathy_target IN ('ex_partner', 'children', 'self', 'others')),
  percentage INTEGER CHECK (percentage >= 0 AND percentage <= 100),
  reflection TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Manipulation decoder analysis
CREATE TABLE IF NOT EXISTS manipulation_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  message_text TEXT NOT NULL,
  identified_tactics UUID[] DEFAULT '{}',
  emotional_impact TEXT CHECK (emotional_impact IN ('none', 'mild', 'moderate', 'severe')),
  is_my_fault BOOLEAN,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_acceptance_progress_user ON acceptance_progress(user_id);
CREATE INDEX idx_role_boundaries_user ON role_boundaries(user_id);
CREATE INDEX idx_empathy_audit_user ON empathy_audit(user_id);
CREATE INDEX idx_manipulation_analysis_user ON manipulation_analysis(user_id);

ALTER TABLE acceptance_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_boundaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE empathy_audit ENABLE ROW LEVEL SECURITY;
ALTER TABLE manipulation_analysis ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users manage own acceptance progress" ON acceptance_progress FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own role boundaries" ON role_boundaries FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own empathy audit" ON empathy_audit FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own manipulation analysis" ON manipulation_analysis FOR ALL USING (auth.uid() = user_id);
