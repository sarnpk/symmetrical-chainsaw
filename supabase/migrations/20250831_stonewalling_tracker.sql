-- Stonewalling Incidents Table
CREATE TABLE IF NOT EXISTS stonewalling_incidents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  incident_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Incident Details
  shutdown_type VARCHAR(50) NOT NULL, -- 'silent_treatment', 'physical_withdrawal', 'topic_avoidance', 'emotional_unavailability'
  duration_minutes INTEGER,
  trigger_context TEXT NOT NULL,
  location VARCHAR(100),
  
  -- Emotional Impact
  emotional_state_before INTEGER CHECK (emotional_state_before >= 1 AND emotional_state_before <= 10),
  emotional_state_after INTEGER CHECK (emotional_state_after >= 1 AND emotional_state_after <= 10),
  impact_level INTEGER CHECK (impact_level >= 1 AND impact_level <= 10),
  
  -- What You Needed
  what_you_needed TEXT,
  what_actually_happened TEXT,
  
  -- Response & Outcome
  your_response VARCHAR(100), -- 'gave_space', 'asked_questions', 'left_situation', 'waited_it_out', 'other'
  attempted_reconnection BOOLEAN DEFAULT false,
  reconnection_successful BOOLEAN,
  
  -- Pattern Recognition
  is_recurring_pattern BOOLEAN DEFAULT false,
  similar_past_incidents INTEGER DEFAULT 0,
  
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stonewalling Patterns Aggregate Table
CREATE TABLE IF NOT EXISTS stonewalling_patterns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  pattern_date DATE DEFAULT CURRENT_DATE,
  
  -- Frequency Metrics
  total_incidents INTEGER DEFAULT 0,
  avg_duration_minutes INTEGER,
  most_common_trigger TEXT,
  most_common_shutdown_type VARCHAR(50),
  
  -- Impact Metrics
  avg_emotional_impact DECIMAL(3,1),
  escalation_trend VARCHAR(20), -- 'improving', 'stable', 'worsening'
  
  -- Response Effectiveness
  most_effective_response VARCHAR(100),
  reconnection_success_rate DECIMAL(5,2),
  
  insights TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, pattern_date)
);

-- Stonewalling Response Strategies Table
CREATE TABLE IF NOT EXISTS stonewalling_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  incident_id UUID REFERENCES stonewalling_incidents(id) ON DELETE CASCADE,
  
  response_type VARCHAR(100) NOT NULL,
  what_you_tried TEXT NOT NULL,
  outcome VARCHAR(20) CHECK (outcome IN ('worked', 'partially_worked', 'didnt_work')),
  self_care_actions TEXT[],
  would_try_again BOOLEAN,
  
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE stonewalling_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE stonewalling_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE stonewalling_responses ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their own stonewalling incidents"
ON stonewalling_incidents FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own stonewalling patterns"
ON stonewalling_patterns FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own stonewalling responses"
ON stonewalling_responses FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_stonewalling_incidents_user_date ON stonewalling_incidents(user_id, incident_date DESC);
CREATE INDEX IF NOT EXISTS idx_stonewalling_patterns_user_date ON stonewalling_patterns(user_id, pattern_date DESC);
CREATE INDEX IF NOT EXISTS idx_stonewalling_responses_incident ON stonewalling_responses(incident_id, created_at DESC);
