-- Update feature limits to monthly basis and add admin functionality

-- Clear existing and set monthly limits
DELETE FROM feature_limits;

INSERT INTO feature_limits (subscription_tier, feature_name, limit_type, limit_value) VALUES
-- FOUNDATION TIER (FREE) - Monthly Limits
('foundation', 'dashboard', 'monthly_count', -1),
('foundation', 'journal_entries', 'monthly_count', 90), -- ~3 per day
('foundation', 'reality_anchor', 'monthly_count', 150), -- ~5 per day
('foundation', 'ai_coach', 'monthly_count', 150), -- ~5 per day
('foundation', 'ai_interactions', 'monthly_count', 150), -- AI Coach interactions
('foundation', 'safety_plan', 'monthly_count', -1),
('foundation', 'affirmations', 'monthly_count', 150), -- ~5 per day
('foundation', 'community', 'monthly_count', 90), -- ~3 per day
('foundation', 'feedback', 'monthly_count', -1),
('foundation', 'narcissist_detector', 'monthly_count', 30), -- ~1 per day
('foundation', 'gaslighting_tracker', 'monthly_count', 60), -- ~2 per day
('foundation', 'storage', 'storage_mb', 100),
('foundation', 'transcription_minutes', 'monthly_count', 0),
('foundation', 'export_requests', 'monthly_count', 1),

-- RECOVERY TIER ($15/month) - Monthly Limits
('recovery', 'dashboard', 'monthly_count', -1),
('recovery', 'journal_entries', 'monthly_count', 450), -- ~15 per day
('recovery', 'reality_anchor', 'monthly_count', 600), -- ~20 per day
('recovery', 'ai_coach', 'monthly_count', 750), -- ~25 per day
('recovery', 'ai_interactions', 'monthly_count', 750), -- AI Coach interactions
('recovery', 'safety_plan', 'monthly_count', -1),
('recovery', 'affirmations', 'monthly_count', 600), -- ~20 per day
('recovery', 'community', 'monthly_count', 300), -- ~10 per day
('recovery', 'feedback', 'monthly_count', -1),
('recovery', 'narcissist_detector', 'monthly_count', 150), -- ~5 per day
('recovery', 'gaslighting_tracker', 'monthly_count', 300), -- ~10 per day
-- Recovery-exclusive features
('recovery', 'toxic_memories', 'monthly_count', 150),
('recovery', 'letting_go', 'monthly_count', 150),
('recovery', 'patterns', 'monthly_count', 300),
('recovery', 'pattern_analysis', 'monthly_count', 300),
('recovery', 'grey_rock_templates', 'monthly_count', 450),
('recovery', 'grey_rock_practice', 'monthly_count', 300),
('recovery', 'biff_assistant', 'monthly_count', 300),
('recovery', 'wellness', 'monthly_count', 300),
('recovery', 'crisis_reframe', 'monthly_count', 450),
('recovery', 'mind_reset', 'monthly_count', 300),
('recovery', 'positive_moments', 'monthly_count', 300),
('recovery', 'manipulation_decoder', 'monthly_count', 150),
('recovery', 'relationship_health', 'monthly_count', 90),
('recovery', 'npd_traits', 'monthly_count', 300),
('recovery', 'storage', 'storage_mb', 10240),
('recovery', 'transcription_minutes', 'monthly_count', 60),
('recovery', 'export_requests', 'monthly_count', 5),

-- EMPOWERMENT TIER ($24.99/month) - Unlimited/High Limits
('empowerment', 'dashboard', 'monthly_count', -1),
('empowerment', 'journal_entries', 'monthly_count', -1),
('empowerment', 'reality_anchor', 'monthly_count', -1),
('empowerment', 'ai_coach', 'monthly_count', -1),
('empowerment', 'ai_interactions', 'monthly_count', -1),
('empowerment', 'safety_plan', 'monthly_count', -1),
('empowerment', 'affirmations', 'monthly_count', -1),
('empowerment', 'community', 'monthly_count', -1),
('empowerment', 'feedback', 'monthly_count', -1),
('empowerment', 'narcissist_detector', 'monthly_count', -1),
('empowerment', 'gaslighting_tracker', 'monthly_count', -1),
('empowerment', 'toxic_memories', 'monthly_count', -1),
('empowerment', 'letting_go', 'monthly_count', -1),
('empowerment', 'patterns', 'monthly_count', -1),
('empowerment', 'pattern_analysis', 'monthly_count', -1),
('empowerment', 'grey_rock_templates', 'monthly_count', -1),
('empowerment', 'grey_rock_practice', 'monthly_count', -1),
('empowerment', 'biff_assistant', 'monthly_count', -1),
('empowerment', 'wellness', 'monthly_count', -1),
('empowerment', 'crisis_reframe', 'monthly_count', -1),
('empowerment', 'mind_reset', 'monthly_count', -1),
('empowerment', 'positive_moments', 'monthly_count', -1),
('empowerment', 'manipulation_decoder', 'monthly_count', -1),
('empowerment', 'relationship_health', 'monthly_count', -1),
('empowerment', 'npd_traits', 'monthly_count', -1),
-- Empowerment-exclusive features
('empowerment', 'stonewalling', 'monthly_count', -1),
('empowerment', 'reactive_abuse', 'monthly_count', -1),
('empowerment', 'healing', 'monthly_count', -1),
('empowerment', 'belief_reframe', 'monthly_count', -1),
('empowerment', 'no_contact_anchor', 'monthly_count', -1),
('empowerment', 'acceptance', 'monthly_count', -1),
('empowerment', 'role_reframing', 'monthly_count', -1),
('empowerment', 'narcissist_simulator', 'monthly_count', -1),
('empowerment', 'empathy_audit', 'monthly_count', -1),
('empowerment', 'storage', 'storage_mb', 102400),
('empowerment', 'transcription_minutes', 'monthly_count', 300),
('empowerment', 'export_requests', 'monthly_count', -1);

-- Create admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin')),
  permissions JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  is_active BOOLEAN DEFAULT true
);

-- Enable RLS for admin users
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Admin access policy
CREATE POLICY "Super admins can manage admin users" ON admin_users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users au 
      WHERE au.user_id = auth.uid() 
      AND au.role = 'super_admin' 
      AND au.is_active = true
    )
  );

-- Insert initial super admin (replace with actual admin email)
-- INSERT INTO admin_users (user_id, email, role) 
-- SELECT id, email, 'super_admin' 
-- FROM auth.users 
-- WHERE email = 'admin@reclaim.app';