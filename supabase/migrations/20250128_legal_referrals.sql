-- Legal Referral System - High-Value Attorney Partnerships
-- Revenue generation through family law, divorce, and custody attorney referrals

-- Extend therapy_referrals table to include legal referrals
ALTER TABLE therapy_referrals 
ADD COLUMN IF NOT EXISTS referral_type TEXT DEFAULT 'therapy' CHECK (referral_type IN ('therapy', 'legal'));

-- Update existing records to be therapy type
UPDATE therapy_referrals SET referral_type = 'therapy' WHERE referral_type IS NULL;

-- Legal referral platforms and specialties
CREATE TABLE IF NOT EXISTS legal_referral_platforms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform_name TEXT NOT NULL UNIQUE,
  base_url TEXT NOT NULL,
  commission_rate DECIMAL(5,2) NOT NULL, -- e.g., 250.00 for $250 per referral
  specialties TEXT[] DEFAULT ARRAY['family_law', 'divorce', 'custody'],
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert legal referral platforms
INSERT INTO legal_referral_platforms (platform_name, base_url, commission_rate, specialties) VALUES
('avvo', 'https://www.avvo.com/find-a-lawyer/referral/', 200.00, ARRAY['family_law', 'divorce', 'custody', 'domestic_violence']),
('lawyers_com', 'https://www.lawyers.com/find-a-lawyer/referral/', 250.00, ARRAY['family_law', 'divorce', 'custody']),
('findlaw', 'https://lawyers.findlaw.com/referral/', 300.00, ARRAY['family_law', 'divorce', 'custody', 'child_support']),
('justia', 'https://www.justia.com/lawyers/referral/', 150.00, ARRAY['family_law', 'divorce', 'custody']),
('martindale_hubbell', 'https://www.martindale.com/find-a-lawyer/referral/', 400.00, ARRAY['family_law', 'divorce', 'custody']),
('nolo', 'https://www.nolo.com/lawyers/referral/', 180.00, ARRAY['family_law', 'divorce', 'custody']);

-- User legal needs tracking
CREATE TABLE IF NOT EXISTS user_legal_needs (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  legal_situation TEXT[] DEFAULT ARRAY[]::TEXT[], -- 'divorce', 'custody', 'domestic_violence', 'restraining_order', 'child_support'
  urgency_level TEXT CHECK (urgency_level IN ('low', 'medium', 'high', 'emergency')) DEFAULT 'medium',
  has_children BOOLEAN DEFAULT FALSE,
  married_status TEXT CHECK (married_status IN ('married', 'separated', 'divorced', 'single')) DEFAULT 'married',
  location_state TEXT, -- For state-specific legal referrals
  budget_range TEXT CHECK (budget_range IN ('under_1000', '1000_5000', '5000_10000', '10000_plus', 'payment_plan')),
  evidence_collected BOOLEAN DEFAULT FALSE, -- Whether they've used our documentation features
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Legal referral analytics
CREATE TABLE IF NOT EXISTS legal_referral_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  referral_source TEXT NOT NULL, -- 'safety_plan', 'evidence_export', 'manipulation_detected', etc.
  platform TEXT NOT NULL,
  legal_specialty TEXT NOT NULL, -- 'divorce', 'custody', 'domestic_violence'
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
  UNIQUE(date, referral_source, platform, legal_specialty)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS legal_referral_analytics_date_idx ON legal_referral_analytics(date DESC);
CREATE INDEX IF NOT EXISTS legal_referral_analytics_specialty_idx ON legal_referral_analytics(legal_specialty);
CREATE INDEX IF NOT EXISTS user_legal_needs_situation_idx ON user_legal_needs USING GIN(legal_situation);

-- RLS Policies
ALTER TABLE legal_referral_platforms ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_legal_needs ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_referral_analytics ENABLE ROW LEVEL SECURITY;

-- Legal platforms are readable by all authenticated users
CREATE POLICY "legal_platforms_read_all" ON legal_referral_platforms
FOR SELECT USING (auth.role() = 'authenticated');

-- Users can manage their own legal needs
CREATE POLICY "users_own_legal_needs" ON user_legal_needs
FOR ALL USING (auth.uid() = user_id);

-- Legal analytics are read-only for authenticated users
CREATE POLICY "legal_analytics_read_only" ON legal_referral_analytics
FOR SELECT USING (auth.role() = 'authenticated');

-- Function to update legal referral analytics
CREATE OR REPLACE FUNCTION update_legal_referral_analytics()
RETURNS TRIGGER AS $$
BEGIN
  -- Only process legal referrals
  IF NEW.referral_type != 'legal' THEN
    RETURN NEW;
  END IF;

  -- Update analytics when legal referral is clicked
  IF TG_OP = 'INSERT' THEN
    INSERT INTO legal_referral_analytics (date, referral_source, platform, legal_specialty, clicks)
    VALUES (CURRENT_DATE, NEW.referral_source, NEW.platform, 'family_law', 1)
    ON CONFLICT (date, referral_source, platform, legal_specialty)
    DO UPDATE SET clicks = legal_referral_analytics.clicks + 1;
  END IF;
  
  -- Update conversions when legal referral converts
  IF TG_OP = 'UPDATE' AND OLD.converted = FALSE AND NEW.converted = TRUE THEN
    UPDATE legal_referral_analytics 
    SET 
      conversions = conversions + 1,
      revenue = revenue + COALESCE(NEW.commission_amount, 0)
    WHERE 
      date = CURRENT_DATE 
      AND referral_source = NEW.referral_source 
      AND platform = NEW.platform
      AND legal_specialty = 'family_law';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for legal referral analytics
CREATE TRIGGER legal_referral_analytics_trigger
  AFTER INSERT OR UPDATE ON therapy_referrals
  FOR EACH ROW 
  WHEN (NEW.referral_type = 'legal')
  EXECUTE FUNCTION update_legal_referral_analytics();

-- Function to get optimal legal platform for user
CREATE OR REPLACE FUNCTION get_optimal_legal_platform(
  p_user_id UUID,
  p_source TEXT,
  p_legal_specialty TEXT DEFAULT 'family_law'
) RETURNS TEXT AS $$
DECLARE
  user_needs user_legal_needs%ROWTYPE;
  optimal_platform TEXT;
BEGIN
  -- Get user legal needs
  SELECT * INTO user_needs 
  FROM user_legal_needs 
  WHERE user_id = p_user_id;
  
  -- Determine optimal platform based on source and needs
  CASE p_source
    WHEN 'evidence_export' THEN
      optimal_platform := 'martindale_hubbell'; -- Premium platform for evidence-based cases
    WHEN 'custody_documentation' THEN
      optimal_platform := 'findlaw'; -- Strong custody focus
    WHEN 'divorce_planning' THEN
      optimal_platform := 'lawyers_com'; -- Comprehensive divorce services
    WHEN 'safety_plan' THEN
      optimal_platform := 'avvo'; -- Good for domestic violence cases
    ELSE
      -- Use analytics to determine best performing platform
      SELECT platform INTO optimal_platform
      FROM legal_referral_analytics
      WHERE referral_source = p_source
        AND legal_specialty = p_legal_specialty
        AND date >= CURRENT_DATE - INTERVAL '30 days'
      ORDER BY (conversion_rate * revenue_per_click) DESC
      LIMIT 1;
      
      -- Default fallback
      optimal_platform := COALESCE(optimal_platform, 'avvo');
  END CASE;
  
  RETURN optimal_platform;
END;
$$ LANGUAGE plpgsql;

-- Insert default legal needs for existing users who have safety plans or evidence
INSERT INTO user_legal_needs (user_id, legal_situation, evidence_collected)
SELECT DISTINCT 
  sp.user_id,
  CASE 
    WHEN sp.emergency_contacts IS NOT NULL AND jsonb_array_length(sp.emergency_contacts) > 0 
    THEN ARRAY['domestic_violence', 'safety_planning']::TEXT[]
    ELSE ARRAY['general_consultation']::TEXT[]
  END,
  TRUE -- They have evidence if they have safety plans
FROM safety_plans sp
WHERE sp.user_id NOT IN (SELECT user_id FROM user_legal_needs)
ON CONFLICT (user_id) DO NOTHING;