-- Empathy Audit Distribution Table
CREATE TABLE IF NOT EXISTS empathy_distribution (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  empathy_target VARCHAR(50) NOT NULL, -- 'ex_partner', 'children', 'self', 'others'
  percentage INTEGER CHECK (percentage >= 0 AND percentage <= 100),
  reflection TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Empathy Audit Situations Table
CREATE TABLE IF NOT EXISTS empathy_situations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  situation_type VARCHAR(100) NOT NULL, -- 'sick', 'bad_day', 'loss', 'stressed', 'good_news', 'custom'
  situation_description TEXT NOT NULL,
  
  -- Their Response Questions
  asked_how_feeling BOOLEAN,
  listened_without_interrupting BOOLEAN,
  validated_emotions BOOLEAN,
  offered_comfort BOOLEAN,
  made_it_about_themselves BOOLEAN,
  minimized_experience BOOLEAN,
  blamed_for_feelings BOOLEAN,
  got_angry BOOLEAN,
  
  empathy_score INTEGER, -- Calculated 0-10
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE empathy_distribution ENABLE ROW LEVEL SECURITY;
ALTER TABLE empathy_situations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their own empathy distribution"
ON empathy_distribution FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own empathy situations"
ON empathy_situations FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_empathy_distribution_user_date ON empathy_distribution(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_empathy_situations_user_date ON empathy_situations(user_id, created_at DESC);
