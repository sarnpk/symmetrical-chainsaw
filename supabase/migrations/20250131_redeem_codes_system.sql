-- Redeemable Codes System for Trial Upgrades
-- Allows users to redeem codes for temporary tier upgrades

-- =====================================================
-- 1. REDEEM CODES TABLE
-- =====================================================

CREATE TABLE redeem_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  code_type TEXT NOT NULL CHECK (code_type IN ('trial', 'discount', 'upgrade')),
  target_tier subscription_tier NOT NULL,
  trial_duration_days INTEGER NOT NULL DEFAULT 7,
  max_uses INTEGER DEFAULT 1, -- -1 for unlimited
  current_uses INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  campaign_name TEXT, -- For tracking (e.g., "YouTube Launch", "Instagram Promo")
  description TEXT,
  created_by UUID,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. CODE REDEMPTIONS TABLE
-- =====================================================

CREATE TABLE code_redemptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code_id UUID REFERENCES redeem_codes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  redeemed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  trial_starts_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  trial_ends_at TIMESTAMP WITH TIME ZONE NOT NULL,
  original_tier subscription_tier NOT NULL,
  upgraded_tier subscription_tier NOT NULL,
  is_active BOOLEAN DEFAULT true,
  ip_address INET,
  user_agent TEXT
);

-- =====================================================
-- 3. SAMPLE REDEEM CODES
-- =====================================================

INSERT INTO redeem_codes (
  code, code_type, target_tier, trial_duration_days, max_uses, 
  campaign_name, description, expires_at
) VALUES
-- YouTube Campaign Codes
('YOUTUBE7DAY', 'trial', 'recovery', 7, 100, 'YouTube Launch', '7-day Recovery trial for YouTube subscribers', NOW() + INTERVAL '30 days'),
('YOUTUBE14DAY', 'trial', 'empowerment', 14, 50, 'YouTube Launch', '14-day Empowerment trial for YouTube subscribers', NOW() + INTERVAL '30 days'),
('HEALING2024', 'trial', 'recovery', 10, 200, 'New Year Campaign', '10-day Recovery trial for new year healing', NOW() + INTERVAL '60 days'),

-- Social Media Codes
('INSTAGRAM7', 'trial', 'recovery', 7, 150, 'Instagram Promo', '7-day Recovery trial for Instagram followers', NOW() + INTERVAL '45 days'),
('TIKTOK3DAY', 'trial', 'recovery', 3, 500, 'TikTok Viral', '3-day Recovery trial for TikTok users', NOW() + INTERVAL '14 days'),
('FACEBOOK14', 'trial', 'empowerment', 14, 75, 'Facebook Community', '14-day Empowerment trial for Facebook group', NOW() + INTERVAL '30 days'),

-- Influencer Codes
('RECOVERY30', 'trial', 'empowerment', 30, 25, 'Influencer Partnership', '30-day Empowerment trial for influencer audience', NOW() + INTERVAL '90 days'),
('SURVIVOR7', 'trial', 'recovery', 7, -1, 'Survivor Support', 'Unlimited 7-day Recovery trials for survivors', NOW() + INTERVAL '365 days'),

-- Special Event Codes
('LAUNCH2024', 'trial', 'empowerment', 21, 100, 'App Launch Event', '21-day Empowerment trial for launch celebration', NOW() + INTERVAL '7 days'),
('MENTALHEALTH', 'trial', 'recovery', 14, 300, 'Mental Health Awareness', '14-day Recovery trial for mental health month', NOW() + INTERVAL '30 days');

-- =====================================================
-- 4. INDEXES AND CONSTRAINTS
-- =====================================================

CREATE INDEX idx_redeem_codes_code ON redeem_codes(code);
CREATE INDEX idx_redeem_codes_active ON redeem_codes(is_active) WHERE is_active = true;
CREATE INDEX idx_redeem_codes_campaign ON redeem_codes(campaign_name);
CREATE INDEX idx_code_redemptions_user ON code_redemptions(user_id);
CREATE INDEX idx_code_redemptions_active ON code_redemptions(is_active) WHERE is_active = true;
CREATE INDEX idx_code_redemptions_trial_end ON code_redemptions(trial_ends_at);

-- =====================================================
-- 5. ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE redeem_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE code_redemptions ENABLE ROW LEVEL SECURITY;

-- Admin access for redeem codes (simplified)
CREATE POLICY "Admin full access to redeem codes" ON redeem_codes
  FOR ALL USING (true);

-- Users can only see their own redemptions
CREATE POLICY "Users can view own redemptions" ON code_redemptions
  FOR SELECT USING (user_id = auth.uid());

-- =====================================================
-- 6. FUNCTIONS
-- =====================================================

-- Function to redeem a code
CREATE OR REPLACE FUNCTION redeem_trial_code(
  p_code TEXT,
  p_user_id UUID,
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
  v_code_record redeem_codes%ROWTYPE;
  v_user_tier subscription_tier;
  v_trial_end TIMESTAMP WITH TIME ZONE;
  v_redemption_id UUID;
  v_existing_redemption UUID;
BEGIN
  -- Check if code exists and is valid
  SELECT * INTO v_code_record
  FROM redeem_codes
  WHERE code = p_code 
    AND is_active = true
    AND (expires_at IS NULL OR expires_at > NOW())
    AND (max_uses = -1 OR current_uses < max_uses);

  IF NOT FOUND THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Invalid or expired code'
    );
  END IF;

  -- Get user's current tier
  SELECT subscription_tier INTO v_user_tier
  FROM profiles
  WHERE id = p_user_id;

  -- Check if user already has an active trial
  SELECT id INTO v_existing_redemption
  FROM code_redemptions
  WHERE user_id = p_user_id 
    AND is_active = true
    AND trial_ends_at > NOW();

  IF FOUND THEN
    RETURN json_build_object(
      'success', false,
      'error', 'You already have an active trial'
    );
  END IF;

  -- Check if user is trying to downgrade
  IF (v_user_tier = 'empowerment' AND v_code_record.target_tier != 'empowerment') OR
     (v_user_tier = 'recovery' AND v_code_record.target_tier = 'foundation') THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Cannot downgrade with trial code'
    );
  END IF;

  -- Calculate trial end date
  v_trial_end := NOW() + (v_code_record.trial_duration_days || ' days')::INTERVAL;

  -- Create redemption record
  INSERT INTO code_redemptions (
    code_id, user_id, trial_ends_at, original_tier, upgraded_tier,
    ip_address, user_agent
  ) VALUES (
    v_code_record.id, p_user_id, v_trial_end, v_user_tier, v_code_record.target_tier,
    p_ip_address, p_user_agent
  ) RETURNING id INTO v_redemption_id;

  -- Update user's subscription tier
  UPDATE profiles
  SET subscription_tier = v_code_record.target_tier,
      updated_at = NOW()
  WHERE id = p_user_id;

  -- Increment code usage
  UPDATE redeem_codes
  SET current_uses = current_uses + 1,
      updated_at = NOW()
  WHERE id = v_code_record.id;

  RETURN json_build_object(
    'success', true,
    'message', 'Code redeemed successfully!',
    'trial_tier', v_code_record.target_tier,
    'trial_days', v_code_record.trial_duration_days,
    'trial_ends_at', v_trial_end,
    'redemption_id', v_redemption_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check and expire trials
CREATE OR REPLACE FUNCTION expire_trial_codes()
RETURNS INTEGER AS $$
DECLARE
  v_expired_count INTEGER := 0;
  v_redemption RECORD;
BEGIN
  -- Find expired trials
  FOR v_redemption IN
    SELECT cr.id, cr.user_id, cr.original_tier
    FROM code_redemptions cr
    WHERE cr.is_active = true
      AND cr.trial_ends_at <= NOW()
  LOOP
    -- Revert user to original tier
    UPDATE profiles
    SET subscription_tier = v_redemption.original_tier,
        updated_at = NOW()
    WHERE id = v_redemption.user_id;

    -- Mark redemption as inactive
    UPDATE code_redemptions
    SET is_active = false
    WHERE id = v_redemption.id;

    v_expired_count := v_expired_count + 1;
  END LOOP;

  RETURN v_expired_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to validate code without redeeming
CREATE OR REPLACE FUNCTION validate_redeem_code(p_code TEXT, p_user_id UUID)
RETURNS JSON AS $$
DECLARE
  v_code_record redeem_codes%ROWTYPE;
  v_user_tier subscription_tier;
  v_existing_redemption UUID;
BEGIN
  -- Check if code exists and is valid
  SELECT * INTO v_code_record
  FROM redeem_codes
  WHERE code = p_code 
    AND is_active = true
    AND (expires_at IS NULL OR expires_at > NOW())
    AND (max_uses = -1 OR current_uses < max_uses);

  IF NOT FOUND THEN
    RETURN json_build_object(
      'valid', false,
      'error', 'Invalid or expired code'
    );
  END IF;

  -- Get user's current tier
  SELECT subscription_tier INTO v_user_tier
  FROM profiles
  WHERE id = p_user_id;

  -- Check if user already has an active trial
  SELECT id INTO v_existing_redemption
  FROM code_redemptions
  WHERE user_id = p_user_id 
    AND is_active = true
    AND trial_ends_at > NOW();

  IF FOUND THEN
    RETURN json_build_object(
      'valid', false,
      'error', 'You already have an active trial'
    );
  END IF;

  -- Check if user is trying to downgrade
  IF (v_user_tier = 'empowerment' AND v_code_record.target_tier != 'empowerment') OR
     (v_user_tier = 'recovery' AND v_code_record.target_tier = 'foundation') THEN
    RETURN json_build_object(
      'valid', false,
      'error', 'Cannot downgrade with trial code'
    );
  END IF;

  RETURN json_build_object(
    'valid', true,
    'code_type', v_code_record.code_type,
    'target_tier', v_code_record.target_tier,
    'trial_duration_days', v_code_record.trial_duration_days,
    'description', v_code_record.description,
    'remaining_uses', CASE 
      WHEN v_code_record.max_uses = -1 THEN -1
      ELSE v_code_record.max_uses - v_code_record.current_uses
    END
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;