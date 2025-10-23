-- Affirmation Personalization Implementation
-- Add personalization fields and parent-focused content

-- =====================================================
-- 1. ENHANCE PROFILES TABLE
-- =====================================================
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS has_children BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS children_ages INTEGER[];
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS custody_arrangement TEXT;

-- =====================================================
-- 2. ENHANCE AFFIRMATIONS TABLE
-- =====================================================
ALTER TABLE affirmations ADD COLUMN IF NOT EXISTS is_parent_focused BOOLEAN DEFAULT false;
ALTER TABLE affirmations ADD COLUMN IF NOT EXISTS target_audience TEXT[];

-- =====================================================
-- 3. USER AFFIRMATION PREFERENCES
-- =====================================================
CREATE TABLE IF NOT EXISTS affirmation_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  has_children BOOLEAN DEFAULT false,
  children_count INTEGER DEFAULT 0,
  custody_situation TEXT CHECK (custody_situation IN ('full', 'shared', 'limited', 'supervised', 'none')),
  preferred_focus TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id)
);

-- =====================================================
-- 4. ADD PARENT-FOCUSED AFFIRMATIONS
-- =====================================================

-- Update existing parent-focused affirmations
UPDATE affirmations SET is_parent_focused = true, target_audience = ARRAY['parents', 'co-parenting']
WHERE text IN (
  'My only goal today is my peace and my children''s well-being',
  'I am building emotional detachment for my children''s sake',
  'I am a project manager for a difficult co-parenting project'
);

-- Morning Intentions (Parent-Focused)
INSERT INTO affirmations (category, text, is_default, is_parent_focused, target_audience) VALUES
('morning', 'My children need me stable and grounded today', true, true, ARRAY['parents']),
('morning', 'I model healthy boundaries for my children by protecting my peace', true, true, ARRAY['parents']),
('morning', 'Today I choose what''s best for my children''s emotional safety', true, true, ARRAY['parents']),
('morning', 'I am the calm, consistent parent my children deserve', true, true, ARRAY['parents']),
('morning', 'My healing journey is a gift I give to my children', true, true, ARRAY['parents']),
('morning', 'My children''s emotional safety is my top priority today', true, true, ARRAY['parents']),
('morning', 'My stability gives my children the security they need', true, true, ARRAY['parents']),
('morning', 'I choose responses that my children can be proud of', true, true, ARRAY['parents']),
('morning', 'My children need me healthy more than they need me to keep peace', true, true, ARRAY['parents']),
('morning', 'I am teaching my children that love doesn''t hurt', true, true, ARRAY['parents']),

-- Boundary Affirmations (Parent-Focused)
('boundary', 'Setting boundaries with her protects my children from chaos', true, true, ARRAY['parents']),
('boundary', 'My children learn healthy relationships by watching me enforce boundaries', true, true, ARRAY['parents']),
('boundary', 'I can co-parent professionally without compromising my values', true, true, ARRAY['co-parenting']),
('boundary', 'My children''s stability is worth more than keeping the peace', true, true, ARRAY['parents']),
('boundary', 'I protect my children by not engaging in her drama', true, true, ARRAY['parents']),
('boundary', 'I model healthy relationships for my children by setting boundaries', true, true, ARRAY['parents']),
('boundary', 'I protect my children by not engaging in toxic arguments', true, true, ARRAY['parents']),
('boundary', 'My children see my strength when I enforce boundaries', true, true, ARRAY['parents']),

-- Self-Compassion (Parent-Focused)
('self-compassion', 'I am doing the best I can for my children in an impossible situation', true, true, ARRAY['parents']),
('self-compassion', 'My children see my strength, not my struggles', true, true, ARRAY['parents']),
('self-compassion', 'I forgive myself for the chaos my children have witnessed', true, true, ARRAY['parents']),
('self-compassion', 'I am breaking generational cycles for my children', true, true, ARRAY['parents']),
('self-compassion', 'My children are proud of my courage to leave/set boundaries', true, true, ARRAY['parents']),
('self-compassion', 'My children learn self-worth by watching me value myself', true, true, ARRAY['parents']),
('self-compassion', 'I am breaking the cycle of dysfunction for my children', true, true, ARRAY['parents']),

-- Strength (Parent-Focused)
('strength', 'I am my children''s safe harbor in the storm', true, true, ARRAY['parents']),
('strength', 'My children''s future depends on my strength today', true, true, ARRAY['parents']),
('strength', 'I am raising resilient children by modeling resilience', true, true, ARRAY['parents']),
('strength', 'My children will thank me for protecting them from toxicity', true, true, ARRAY['parents']),
('strength', 'I choose my children''s wellbeing over her approval', true, true, ARRAY['parents']),
('strength', 'I co-parent with dignity for my children''s sake', true, true, ARRAY['co-parenting']),
('strength', 'My children''s future relationships depend on what I model today', true, true, ARRAY['parents']),

-- Clarity (Parent-Focused)
('clarity', 'I see clearly what my children need from me', true, true, ARRAY['parents']),
('clarity', 'I trust my parental instincts over her manipulation', true, true, ARRAY['parents']),
('clarity', 'My children''s reactions tell me the truth about the situation', true, true, ARRAY['parents']),
('clarity', 'I can distinguish between her needs and my children''s needs', true, true, ARRAY['parents']),
('clarity', 'I see through her tactics to protect my children', true, true, ARRAY['parents']),

-- Peace (Parent-Focused)
('peace', 'My inner peace creates a safe space for my children', true, true, ARRAY['parents']),
('peace', 'I choose calm responses for my children''s emotional safety', true, true, ARRAY['parents']),
('peace', 'My children feel secure when I am centered and peaceful', true, true, ARRAY['parents']),
('peace', 'I create peaceful moments with my children despite the chaos', true, true, ARRAY['parents']),
('peace', 'My peace is my children''s sanctuary', true, true, ARRAY['parents']),
('peace', 'I protect my children''s childhood by managing my own triggers', true, true, ARRAY['parents']),
('peace', 'My children deserve a parent who chooses peace over chaos', true, true, ARRAY['parents'])

ON CONFLICT DO NOTHING;

-- =====================================================
-- 5. INDEXES AND POLICIES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_affirmations_parent_focused ON affirmations(is_parent_focused);
CREATE INDEX IF NOT EXISTS idx_affirmations_target_audience ON affirmations USING GIN(target_audience);
CREATE INDEX IF NOT EXISTS idx_affirmation_preferences_user ON affirmation_preferences(user_id);

ALTER TABLE affirmation_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own affirmation preferences" ON affirmation_preferences 
FOR ALL USING (auth.uid() = user_id);