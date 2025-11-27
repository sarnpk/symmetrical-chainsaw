-- Narcissist Simulator Sessions Table
CREATE TABLE IF NOT EXISTS narcissist_simulator_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Session configuration
  narcissist_type TEXT NOT NULL CHECK (narcissist_type IN ('overt', 'covert', 'malignant')),
  scenario TEXT NOT NULL CHECK (scenario IN ('custody', 'text', 'email', 'boundary')),
  
  -- Session data
  conversation_history JSONB DEFAULT '[]'::jsonb,
  
  -- Performance metrics
  total_messages INTEGER DEFAULT 0,
  techniques_used JSONB DEFAULT '{}'::jsonb,
  effectiveness_scores JSONB DEFAULT '[]'::jsonb,
  
  -- Session status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'abandoned')),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_simulator_sessions_user_id ON narcissist_simulator_sessions(user_id);
CREATE INDEX idx_simulator_sessions_status ON narcissist_simulator_sessions(status);
CREATE INDEX idx_simulator_sessions_created_at ON narcissist_simulator_sessions(created_at DESC);

-- RLS Policies
ALTER TABLE narcissist_simulator_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own simulator sessions"
  ON narcissist_simulator_sessions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own simulator sessions"
  ON narcissist_simulator_sessions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own simulator sessions"
  ON narcissist_simulator_sessions
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own simulator sessions"
  ON narcissist_simulator_sessions
  FOR DELETE
  USING (auth.uid() = user_id);

-- Updated at trigger
CREATE OR REPLACE FUNCTION update_simulator_sessions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_simulator_sessions_updated_at
  BEFORE UPDATE ON narcissist_simulator_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_simulator_sessions_updated_at();
