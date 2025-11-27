-- Fix manipulation_analysis table schema to use correct foreign key

-- Drop and recreate with correct foreign key
DROP TABLE IF EXISTS manipulation_analysis CASCADE;

CREATE TABLE manipulation_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message_text TEXT NOT NULL,
  identified_tactics UUID[] DEFAULT '{}',
  emotional_impact TEXT CHECK (emotional_impact IN ('none', 'mild', 'moderate', 'severe')),
  is_my_fault BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_manipulation_analysis_user ON manipulation_analysis(user_id);
CREATE INDEX idx_manipulation_analysis_created_at ON manipulation_analysis(created_at DESC);

-- Enable RLS
ALTER TABLE manipulation_analysis ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own manipulation analyses"
  ON manipulation_analysis FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own manipulation analyses"
  ON manipulation_analysis FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own manipulation analyses"
  ON manipulation_analysis FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own manipulation analyses"
  ON manipulation_analysis FOR DELETE
  USING (auth.uid() = user_id);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_manipulation_analysis_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_manipulation_analysis_updated_at
  BEFORE UPDATE ON manipulation_analysis
  FOR EACH ROW
  EXECUTE FUNCTION update_manipulation_analysis_updated_at();
