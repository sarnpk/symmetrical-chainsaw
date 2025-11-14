-- Add enhanced tracking to acceptance_progress table
ALTER TABLE acceptance_progress 
ADD COLUMN IF NOT EXISTS difficulty_rating INTEGER CHECK (difficulty_rating >= 1 AND difficulty_rating <= 10),
ADD COLUMN IF NOT EXISTS emotional_state VARCHAR(50),
ADD COLUMN IF NOT EXISTS breakthrough_moments TEXT,
ADD COLUMN IF NOT EXISTS resistance_areas TEXT,
ADD COLUMN IF NOT EXISTS revisit_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_revisited TIMESTAMP WITH TIME ZONE;

-- Add daily acceptance journal table
CREATE TABLE IF NOT EXISTS acceptance_journal (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  entry_date DATE DEFAULT CURRENT_DATE,
  acceptance_level INTEGER CHECK (acceptance_level >= 1 AND acceptance_level <= 10),
  daily_struggle TEXT,
  hope_triggers TEXT[],
  reality_anchors TEXT[],
  emotional_state VARCHAR(50),
  breakthrough_moment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, entry_date)
);

-- Add acceptance milestones table
CREATE TABLE IF NOT EXISTS acceptance_milestones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  milestone_type VARCHAR(50) NOT NULL,
  achieved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  description TEXT,
  emotional_impact TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE acceptance_journal ENABLE ROW LEVEL SECURITY;
ALTER TABLE acceptance_milestones ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can manage their own acceptance journal"
ON acceptance_journal FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own acceptance milestones"
ON acceptance_milestones FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_acceptance_journal_user_date ON acceptance_journal(user_id, entry_date);
CREATE INDEX IF NOT EXISTS idx_acceptance_milestones_user_type ON acceptance_milestones(user_id, milestone_type);