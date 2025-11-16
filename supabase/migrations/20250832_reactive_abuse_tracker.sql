-- Reactive Abuse Incidents Table
CREATE TABLE IF NOT EXISTS reactive_abuse_incidents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  incident_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Original Issue
  what_you_addressed TEXT NOT NULL, -- What you tried to discuss/confront
  your_approach VARCHAR(50), -- 'calm_conversation', 'expressed_feelings', 'set_boundary', 'asked_question'
  
  -- Their Reactive Response
  reaction_type VARCHAR(50) NOT NULL, -- 'darvo', 'victim_reversal', 'counter_accusation', 'deflection', 'gaslighting'
  what_they_said TEXT,
  what_they_accused_you_of TEXT,
  
  -- Impact
  made_you_feel VARCHAR(100), -- 'guilty', 'confused', 'crazy', 'like_the_abuser', 'defensive'
  did_you_apologize BOOLEAN DEFAULT false,
  original_issue_resolved BOOLEAN DEFAULT false,
  
  -- Pattern Recognition
  is_recurring_pattern BOOLEAN DEFAULT false,
  similar_topic_before BOOLEAN DEFAULT false,
  
  -- Your Response
  how_you_responded TEXT,
  maintained_boundary BOOLEAN,
  
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reactive Abuse Patterns Table
CREATE TABLE IF NOT EXISTS reactive_abuse_patterns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  pattern_date DATE DEFAULT CURRENT_DATE,
  
  total_incidents INTEGER DEFAULT 0,
  most_common_reaction VARCHAR(50),
  topics_you_cant_discuss TEXT[],
  apology_rate DECIMAL(5,2), -- How often you end up apologizing
  boundary_maintenance_rate DECIMAL(5,2),
  
  insights TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, pattern_date)
);

-- Enable RLS
ALTER TABLE reactive_abuse_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE reactive_abuse_patterns ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their own reactive abuse incidents"
ON reactive_abuse_incidents FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own reactive abuse patterns"
ON reactive_abuse_patterns FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_reactive_abuse_incidents_user_date ON reactive_abuse_incidents(user_id, incident_date DESC);
CREATE INDEX IF NOT EXISTS idx_reactive_abuse_patterns_user_date ON reactive_abuse_patterns(user_id, pattern_date DESC);
