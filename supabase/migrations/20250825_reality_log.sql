-- Reality Log Table
-- Simple, focused tool for documenting facts about NPD interactions
-- Separate from journal to keep it lightweight and easy to use

CREATE TABLE reality_log_entries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Basic info
  date DATE NOT NULL,
  time TIME,
  
  -- The core fields (matching the research example)
  event TEXT NOT NULL,                    -- "Discussed childcare schedule"
  fact TEXT NOT NULL,                     -- "Request was met with immediate victimhood ('I do everything')"
  outcome TEXT NOT NULL,                  -- "I had to handle it alone"
  
  -- NPD trait identification
  npd_trait VARCHAR(100),                 -- "Playing the victim to avoid responsibility"
  npd_trait_category VARCHAR(50),         -- 'covert', 'overt', 'both'
  
  -- Pattern tracking
  is_consistent_with_pattern BOOLEAN DEFAULT false,
  pattern_description TEXT,               -- "She always does this when I set boundaries"
  
  -- Emotional impact
  emotional_impact_before INT CHECK (emotional_impact_before >= 1 AND emotional_impact_before <= 10),
  emotional_impact_after INT CHECK (emotional_impact_after >= 1 AND emotional_impact_after <= 10),
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_reality_log_user_id ON reality_log_entries(user_id);
CREATE INDEX idx_reality_log_date ON reality_log_entries(date);
CREATE INDEX idx_reality_log_npd_trait ON reality_log_entries(npd_trait);
CREATE INDEX idx_reality_log_user_date ON reality_log_entries(user_id, date DESC);

-- Enable Row Level Security
ALTER TABLE reality_log_entries ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only see their own entries
CREATE POLICY "Users can view own reality log entries"
  ON reality_log_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reality log entries"
  ON reality_log_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reality log entries"
  ON reality_log_entries FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reality log entries"
  ON reality_log_entries FOR DELETE
  USING (auth.uid() = user_id);

-- NPD Traits Reference Table
CREATE TABLE npd_traits_reference (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  category VARCHAR(50) NOT NULL,  -- 'covert', 'overt', 'both'
  example TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed NPD traits
INSERT INTO npd_traits_reference (name, description, category, example) VALUES
('Playing the victim', 'Avoiding responsibility by claiming victimhood', 'covert', 'When asked to help, says "I do everything" and acts hurt'),
('Gaslighting', 'Denying things happened or making you doubt your memory', 'both', 'Denies saying hurtful things despite evidence'),
('Triangulation', 'Involving a third party to make you jealous or feel excluded', 'both', 'Comparing you unfavorably to an ex or friend'),
('Love-bombing', 'Excessive attention and affection followed by withdrawal', 'overt', 'Showering with gifts then suddenly cold and distant'),
('Hoovering', 'Pulling you back in after a breakup or distance', 'covert', 'Reaching out with "I miss you" after months of silence'),
('Flying monkeys', 'Using others to attack or spy on you', 'covert', 'Getting mutual friends to take their side'),
('Covert criticism', 'Disguising insults as concern or jokes', 'covert', '"I''m just worried about your weight" or "You''re so sensitive"'),
('Boundary violations', 'Ignoring your stated limits and rules', 'both', 'Showing up unannounced after you said not to'),
('Projection', 'Accusing you of what they''re doing', 'both', 'Calling you manipulative while manipulating you'),
('Silent treatment', 'Withdrawing communication as punishment', 'both', 'Not responding to messages for days after disagreement'),
('Smear campaign', 'Spreading lies about you to damage your reputation', 'overt', 'Telling everyone you''re unstable or abusive'),
('Emotional manipulation', 'Using emotions to control your behavior', 'both', 'Threatening self-harm if you leave'),
('Withholding affection', 'Using love/attention as a reward/punishment', 'covert', 'Only being nice when you comply with their wishes'),
('Blame-shifting', 'Making you responsible for their behavior', 'both', '"You made me do this" or "It''s your fault I''m angry"'),
('Devaluation', 'Suddenly criticizing and belittling after idealization', 'overt', 'Going from "You''re perfect" to "You''re worthless"');
