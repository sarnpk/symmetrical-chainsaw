-- Therapy Referral System
-- Revenue generation through strategic therapy platform partnerships

-- Referral tracking table
CREATE TABLE IF NOT EXISTS therapy_referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('betterhelp', 'talkspace', 'psychology_today', 'cerebral', 'mdlive')),
  referral_source TEXT NOT NULL CHECK (referral_source IN ('safety_plan', 'manipulation_detected', 'dashboard', 'crisis', 'ai_chat')),
  referral_url TEXT NOT NULL,
  clicked_at TIMESTAMPTZ DEFAULT NOW(),
  converted BOOLEAN DEFAULT FALSE,
  conversion_date TIMESTAMPTZ,
  commission_amount DECIMAL(10,2),
  commission_status TEXT DEFAULT 'pending' CHECK (commission_status IN ('pending', 'confirmed', 'paid', 'cancelled')),
  user_agent TEXT,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User therapy preferences
CREATE TABLE IF NOT EXISTS user_therapy_preferences (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  preferred_language TEXT DEFAULT 'en',
  therapy_types TEXT[] DEFAULT ARRAY['trauma', 'cbt'], -- 'trauma', 'cbt', 'dbt', 'emdr', 'family'
  gender_preference TEXT CHECK (gender_preference IN ('male', 'female', 'non_binary', 'no_preference')),
  insurance_provider TEXT,
  budget_range TEXT CHECK (budget_range IN ('under_50', '50_100', '100_200', '200_plus')),
  availability TEXT[] DEFAULT ARRAY['weekday_morning'], -- time preferences
  severity_level TEXT CHECK (severity_level IN ('mild', 'moderate', 'severe', 'crisis')),
  previous_therapy BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Referral analytics for optimization
CREATE TABLE IF NOT EXISTS referral_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  referral_source TEXT NOT NULL,
  platform TEXT NOT NULL,
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  revenue DECIMAL(10,2) DEFAULT 0,
  conversion_rate DECIMAL(5,4) GENERATED ALWAYS AS (
    CASE WHEN clicks > 0 THEN conversions::DECIMAL / clicks::DECIMAL ELSE 0 END
  ) STORED,
  revenue_per_click DECIMAL(10,2) GENERATED ALWAYS AS (
    CASE WHEN clicks > 0 THEN revenue / clicks ELSE 0 END
  ) STORED,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(date, referral_source, platform)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS therapy_referrals_user_idx ON therapy_referrals(user_id);
CREATE INDEX IF NOT EXISTS therapy_referrals_source_idx ON therapy_referrals(referral_source);
CREATE INDEX IF NOT EXISTS therapy_referrals_platform_idx ON therapy_referrals(platform);
CREATE INDEX IF NOT EXISTS therapy_referrals_converted_idx ON therapy_referrals(converted, conversion_date);
CREATE INDEX IF NOT EXISTS referral_analytics_date_idx ON referral_analytics(date DESC);

-- RLS Policies
ALTER TABLE therapy_referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_therapy_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_analytics ENABLE ROW LEVEL SECURITY;

-- Users can only see their own referrals
CREATE POLICY "users_own_referrals" ON therapy_referrals
FOR ALL USING (auth.uid() = user_id);

-- Users can manage their own therapy preferences
CREATE POLICY "users_own_preferences" ON user_therapy_preferences
FOR ALL USING (auth.uid() = user_id);

-- Analytics are read-only for authenticated users (for transparency)
CREATE POLICY "analytics_read_only" ON referral_analytics
FOR SELECT USING (auth.role() = 'authenticated');

-- Function to update analytics
CREATE OR REPLACE FUNCTION update_referral_analytics()
RETURNS TRIGGER AS $$
BEGIN
  -- Update daily analytics when referral is clicked
  IF TG_OP = 'INSERT' THEN
    INSERT INTO referral_analytics (date, referral_source, platform, clicks)
    VALUES (CURRENT_DATE, NEW.referral_source, NEW.platform, 1)
    ON CONFLICT (date, referral_source, platform)
    DO UPDATE SET clicks = referral_analytics.clicks + 1;
  END IF;
  
  -- Update conversions when referral converts
  IF TG_OP = 'UPDATE' AND OLD.converted = FALSE AND NEW.converted = TRUE THEN
    UPDATE referral_analytics 
    SET 
      conversions = conversions + 1,
      revenue = revenue + COALESCE(NEW.commission_amount, 0)
    WHERE 
      date = CURRENT_DATE 
      AND referral_source = NEW.referral_source 
      AND platform = NEW.platform;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update analytics
CREATE TRIGGER referral_analytics_trigger
  AFTER INSERT OR UPDATE ON therapy_referrals
  FOR EACH ROW EXECUTE FUNCTION update_referral_analytics();

-- Function to get optimal platform for user
CREATE OR REPLACE FUNCTION get_optimal_therapy_platform(
  p_user_id UUID,
  p_source TEXT
) RETURNS TEXT AS $$
DECLARE
  user_prefs user_therapy_preferences%ROWTYPE;
  optimal_platform TEXT;
BEGIN
  -- Get user preferences
  SELECT * INTO user_prefs 
  FROM user_therapy_preferences 
  WHERE user_id = p_user_id;
  
  -- Determine optimal platform based on source and preferences
  CASE p_source
    WHEN 'crisis' THEN
      optimal_platform := 'betterhelp'; -- Best crisis support
    WHEN 'manipulation_detected' THEN
      optimal_platform := 'talkspace'; -- Trauma specialists
    WHEN 'safety_plan' THEN
      optimal_platform := 'betterhelp'; -- Trauma-informed
    ELSE
      -- Use analytics to determine best performing platform
      SELECT platform INTO optimal_platform
      FROM referral_analytics
      WHERE referral_source = p_source
        AND date >= CURRENT_DATE - INTERVAL '30 days'
      ORDER BY (conversion_rate * revenue_per_click) DESC
      LIMIT 1;
      
      -- Default fallback
      optimal_platform := COALESCE(optimal_platform, 'psychology_today');
  END CASE;
  
  RETURN optimal_platform;
END;
$$ LANGUAGE plpgsql;

-- Insert default therapy preferences for existing users
INSERT INTO user_therapy_preferences (user_id, therapy_types, severity_level)
SELECT 
  id,
  ARRAY['trauma', 'cbt'],
  'moderate'
FROM profiles
WHERE id NOT IN (SELECT user_id FROM user_therapy_preferences)
ON CONFLICT (user_id) DO NOTHING;