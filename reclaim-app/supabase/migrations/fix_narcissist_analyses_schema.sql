-- Fix narcissist_analyses table schema to make fields optional and fix foreign key

-- Drop existing table if it has issues
DROP TABLE IF EXISTS narcissist_analyses CASCADE;

-- Recreate with correct schema
CREATE TABLE narcissist_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  input_text TEXT NOT NULL,
  input_type VARCHAR(50) NOT NULL DEFAULT 'message',
  
  -- Classification
  primary_type VARCHAR(50) NOT NULL DEFAULT 'Unknown',
  primary_confidence DECIMAL(5,2) NOT NULL DEFAULT 0,
  
  -- Traits (optional fields with defaults)
  traits_detected JSONB DEFAULT '{}'::jsonb,
  manipulation_tactics TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Analysis (optional fields with defaults)
  severity_score INT DEFAULT 5 CHECK (severity_score >= 1 AND severity_score <= 10),
  key_phrases JSONB DEFAULT '[]'::jsonb,
  recommended_strategies TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_narcissist_analyses_user_id ON narcissist_analyses(user_id);
CREATE INDEX idx_narcissist_analyses_created_at ON narcissist_analyses(created_at DESC);
CREATE INDEX idx_narcissist_analyses_input_type ON narcissist_analyses(input_type);

-- Enable RLS
ALTER TABLE narcissist_analyses ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own analyses"
  ON narcissist_analyses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own analyses"
  ON narcissist_analyses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own analyses"
  ON narcissist_analyses FOR DELETE
  USING (auth.uid() = user_id);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_narcissist_analyses_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_narcissist_analyses_updated_at
  BEFORE UPDATE ON narcissist_analyses
  FOR EACH ROW
  EXECUTE FUNCTION update_narcissist_analyses_updated_at();
