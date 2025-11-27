-- Letting Go Entries Table (5-Step Method)
CREATE TABLE IF NOT EXISTS letting_go_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  entry_date DATE DEFAULT CURRENT_DATE,
  
  -- Step 1: Raw Thought Journaling (Brain Dump)
  raw_thoughts TEXT, -- Unfiltered fears, worries, obsessive thoughts
  
  -- Step 2: Thankfulness Journal
  gratitude_list TEXT[], -- What are you grateful for today?
  
  -- Step 3: Mindfulness (Present Moment)
  present_moment_focus TEXT, -- What you're doing right now, staying present
  mindfulness_practice VARCHAR(100), -- breathing, body_scan, observation, etc
  
  -- Step 4: Pattern Interrupt
  old_pattern TEXT, -- The automatic negative thought/behavior
  pattern_interrupt_action TEXT, -- What you did to break the pattern
  new_response TEXT, -- The healthier response you chose
  
  -- Step 5: Third Person Thinking
  third_person_perspective TEXT, -- Viewing situation as if advising a friend
  objective_truth TEXT, -- What's actually true vs what fear says
  
  -- Progress Tracking
  emotional_state_before INTEGER CHECK (emotional_state_before >= 1 AND emotional_state_before <= 10),
  emotional_state_after INTEGER CHECK (emotional_state_after >= 1 AND emotional_state_after <= 10),
  
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, entry_date)
);

-- Attachment Triggers Table
CREATE TABLE IF NOT EXISTS attachment_triggers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  trigger_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  trigger_description TEXT NOT NULL,
  old_pattern TEXT,
  new_response TEXT,
  coping_strategy TEXT,
  effectiveness INTEGER CHECK (effectiveness >= 1 AND effectiveness <= 10),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Detachment Milestones Table
CREATE TABLE IF NOT EXISTS detachment_milestones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  milestone_date DATE DEFAULT CURRENT_DATE,
  
  milestone_type VARCHAR(100) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Letting Go Affirmations Library
CREATE TABLE IF NOT EXISTS letting_go_affirmations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  affirmation_text TEXT NOT NULL,
  category VARCHAR(50),
  is_default BOOLEAN DEFAULT true
);

-- User Custom Affirmations
CREATE TABLE IF NOT EXISTS user_letting_go_affirmations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  affirmation_text TEXT NOT NULL,
  times_used INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE letting_go_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE attachment_triggers ENABLE ROW LEVEL SECURITY;
ALTER TABLE detachment_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_letting_go_affirmations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Users can manage their own letting go entries" ON letting_go_entries;
CREATE POLICY "Users can manage their own letting go entries"
ON letting_go_entries FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage their own attachment triggers" ON attachment_triggers;
CREATE POLICY "Users can manage their own attachment triggers"
ON attachment_triggers FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage their own milestones" ON detachment_milestones;
CREATE POLICY "Users can manage their own milestones"
ON detachment_milestones FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view default affirmations" ON letting_go_affirmations;
CREATE POLICY "Users can view default affirmations"
ON letting_go_affirmations FOR SELECT
TO authenticated
USING (is_default = true);

DROP POLICY IF EXISTS "Users can manage their own custom affirmations" ON user_letting_go_affirmations;
CREATE POLICY "Users can manage their own custom affirmations"
ON user_letting_go_affirmations FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_letting_go_entries_user_date ON letting_go_entries(user_id, entry_date DESC);
CREATE INDEX IF NOT EXISTS idx_attachment_triggers_user_date ON attachment_triggers(user_id, trigger_date DESC);
CREATE INDEX IF NOT EXISTS idx_detachment_milestones_user_date ON detachment_milestones(user_id, milestone_date DESC);

-- Seed Default Affirmations
INSERT INTO letting_go_affirmations (affirmation_text, category) VALUES
('I release what no longer serves me', 'release'),
('Their opinion of me is none of my business', 'boundaries'),
('I am worthy of real love and respect', 'self_worth'),
('I choose peace over being right', 'peace'),
('I am not responsible for their healing', 'responsibility'),
('My past does not define my future', 'future'),
('I deserve relationships that feel safe', 'safety'),
('I am enough, exactly as I am', 'self_worth'),
('I release the need for their validation', 'validation'),
('I am healing at my own pace', 'healing'),
('I choose myself today', 'self_love'),
('I am free from their control', 'freedom'),
('I trust my own perception of reality', 'reality'),
('I am building a life I love', 'future'),
('I forgive myself for not knowing sooner', 'self_compassion');
