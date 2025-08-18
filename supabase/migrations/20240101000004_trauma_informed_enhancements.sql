-- Optional enhancements to support trauma-informed UI features
-- These are suggestions to enhance the user experience but are not required

-- Add user preferences for trauma-informed features
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS ui_preferences JSONB DEFAULT '{}';

-- Add support for content warnings and trigger management
ALTER TABLE journal_entries ADD COLUMN IF NOT EXISTS content_warnings TEXT[];
ALTER TABLE journal_entries ADD COLUMN IF NOT EXISTS trigger_level INTEGER CHECK (trigger_level >= 1 AND trigger_level <= 5);

-- Add support for emotional check-ins and mood tracking
CREATE TABLE IF NOT EXISTS mood_check_ins (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  mood_rating INTEGER CHECK (mood_rating >= 1 AND mood_rating <= 10),
  energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 10),
  anxiety_level INTEGER CHECK (anxiety_level >= 1 AND anxiety_level <= 10),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add support for coping strategies and self-care tracking
CREATE TABLE IF NOT EXISTS coping_strategies (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  strategy_name TEXT NOT NULL,
  description TEXT,
  effectiveness_rating INTEGER CHECK (effectiveness_rating >= 1 AND effectiveness_rating <= 5),
  category TEXT, -- 'breathing', 'grounding', 'physical', 'creative', etc.
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add support for positive affirmations and healing resources
CREATE TABLE IF NOT EXISTS healing_resources (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  resource_type TEXT NOT NULL, -- 'affirmation', 'quote', 'exercise', 'article'
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for new tables
ALTER TABLE mood_check_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE coping_strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE healing_resources ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for new tables
CREATE POLICY "Users can manage own mood check-ins" ON mood_check_ins
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own coping strategies" ON coping_strategies
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own healing resources" ON healing_resources
  FOR ALL USING (auth.uid() = user_id);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_mood_check_ins_user_id ON mood_check_ins(user_id);
CREATE INDEX IF NOT EXISTS idx_mood_check_ins_created_at ON mood_check_ins(created_at);
CREATE INDEX IF NOT EXISTS idx_coping_strategies_user_id ON coping_strategies(user_id);
CREATE INDEX IF NOT EXISTS idx_healing_resources_user_id ON healing_resources(user_id);

-- Add helpful comments
COMMENT ON TABLE mood_check_ins IS 'Daily mood and emotional state tracking for recovery progress';
COMMENT ON TABLE coping_strategies IS 'User-defined coping mechanisms and their effectiveness';
COMMENT ON TABLE healing_resources IS 'Personalized collection of healing resources and affirmations';
