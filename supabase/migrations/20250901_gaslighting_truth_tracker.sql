-- Gaslighting Statements Table (Their Claims)
CREATE TABLE IF NOT EXISTS gaslighting_statements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  statement_date TIMESTAMP WITH TIME ZONE NOT NULL,
  
  -- What They Said
  their_claim TEXT NOT NULL,
  topic VARCHAR(100) NOT NULL, -- 'finances', 'parenting', 'relationship', 'past_events', 'your_behavior', 'their_behavior'
  context TEXT,
  
  -- Your Truth
  actual_truth TEXT NOT NULL,
  your_memory TEXT,
  
  -- Evidence
  has_evidence BOOLEAN DEFAULT false,
  evidence_type VARCHAR(50), -- 'text_message', 'email', 'photo', 'video', 'witness', 'document'
  evidence_notes TEXT,
  
  -- Severity
  gaslighting_severity INTEGER CHECK (gaslighting_severity >= 1 AND gaslighting_severity <= 10),
  impact_on_you INTEGER CHECK (impact_on_you >= 1 AND impact_on_you <= 10),
  
  -- Pattern Recognition
  is_contradiction BOOLEAN DEFAULT false,
  contradicts_statement_id UUID REFERENCES gaslighting_statements(id),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contradiction Pairs (AI-Detected)
CREATE TABLE IF NOT EXISTS statement_contradictions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  statement_1_id UUID REFERENCES gaslighting_statements(id) ON DELETE CASCADE NOT NULL,
  statement_2_id UUID REFERENCES gaslighting_statements(id) ON DELETE CASCADE NOT NULL,
  
  contradiction_type VARCHAR(50) NOT NULL, -- 'direct_opposite', 'timeline_conflict', 'fact_denial', 'blame_shift'
  ai_confidence_score DECIMAL(3,2), -- 0.00 to 1.00
  
  explanation TEXT,
  time_between_statements INTEGER, -- days
  
  detected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(statement_1_id, statement_2_id)
);

-- Truth Timeline Events
CREATE TABLE IF NOT EXISTS truth_timeline (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  event_title VARCHAR(255) NOT NULL,
  
  -- Original Truth
  what_actually_happened TEXT NOT NULL,
  
  -- Their Revisions Over Time
  their_version_1 TEXT,
  their_version_1_date TIMESTAMP WITH TIME ZONE,
  
  their_version_2 TEXT,
  their_version_2_date TIMESTAMP WITH TIME ZONE,
  
  their_version_3 TEXT,
  their_version_3_date TIMESTAMP WITH TIME ZONE,
  
  -- Evidence
  evidence_links TEXT[],
  witness_accounts TEXT[],
  
  -- Analysis
  total_revisions INTEGER DEFAULT 0,
  confabulation_score INTEGER CHECK (confabulation_score >= 1 AND confabulation_score <= 10),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Confabulation Patterns (AI Analysis)
CREATE TABLE IF NOT EXISTS confabulation_patterns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  analysis_date DATE DEFAULT CURRENT_DATE,
  
  -- Metrics
  total_statements INTEGER DEFAULT 0,
  total_contradictions INTEGER DEFAULT 0,
  contradiction_rate DECIMAL(5,2),
  
  -- Most Gaslit Topics
  most_gaslit_topic VARCHAR(100),
  topic_breakdown JSONB,
  
  -- Severity
  avg_gaslighting_severity DECIMAL(3,1),
  avg_impact DECIMAL(3,1),
  
  -- AI Insights
  ai_insights TEXT,
  escalation_warning BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, analysis_date)
);

-- Enable RLS
ALTER TABLE gaslighting_statements ENABLE ROW LEVEL SECURITY;
ALTER TABLE statement_contradictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE truth_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE confabulation_patterns ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their own gaslighting statements"
ON gaslighting_statements FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own contradictions"
ON statement_contradictions FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own truth timeline"
ON truth_timeline FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own confabulation patterns"
ON confabulation_patterns FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_gaslighting_statements_user_date ON gaslighting_statements(user_id, statement_date DESC);
CREATE INDEX IF NOT EXISTS idx_gaslighting_statements_topic ON gaslighting_statements(user_id, topic);
CREATE INDEX IF NOT EXISTS idx_contradictions_user ON statement_contradictions(user_id, detected_at DESC);
CREATE INDEX IF NOT EXISTS idx_truth_timeline_user_date ON truth_timeline(user_id, event_date DESC);
CREATE INDEX IF NOT EXISTS idx_confabulation_patterns_user ON confabulation_patterns(user_id, analysis_date DESC);
