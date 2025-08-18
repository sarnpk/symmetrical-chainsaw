-- Comprehensive Schema Completion Migration
-- Addresses all gaps between requirements and current implementation

-- =====================================================
-- 1. ENHANCE PROFILES TABLE
-- =====================================================

-- Add missing profile fields to match TypeScript interface
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS first_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS date_of_birth DATE;

-- Add privacy and security settings
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS privacy_settings JSONB DEFAULT '{
  "data_sharing": false,
  "analytics": true,
  "marketing_emails": false,
  "push_notifications": true
}';

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS security_settings JSONB DEFAULT '{
  "two_factor_enabled": false,
  "login_alerts": true,
  "data_encryption": true
}';

-- =====================================================
-- 2. MAJOR JOURNAL ENTRIES SCHEMA UPDATE
-- =====================================================

-- Add missing fields to match TypeScript interface and requirements
ALTER TABLE journal_entries ADD COLUMN IF NOT EXISTS content TEXT;
ALTER TABLE journal_entries ADD COLUMN IF NOT EXISTS incident_time TIME;
ALTER TABLE journal_entries ADD COLUMN IF NOT EXISTS mood_rating INTEGER CHECK (mood_rating >= 1 AND mood_rating <= 10);
ALTER TABLE journal_entries ADD COLUMN IF NOT EXISTS behavior_categories TEXT[];
ALTER TABLE journal_entries ADD COLUMN IF NOT EXISTS pattern_flags TEXT[];
ALTER TABLE journal_entries ADD COLUMN IF NOT EXISTS emotional_impact TEXT[];
ALTER TABLE journal_entries ADD COLUMN IF NOT EXISTS evidence_type TEXT[];
ALTER TABLE journal_entries ADD COLUMN IF NOT EXISTS evidence_notes TEXT;
ALTER TABLE journal_entries ADD COLUMN IF NOT EXISTS is_evidence BOOLEAN DEFAULT false;
ALTER TABLE journal_entries ADD COLUMN IF NOT EXISTS is_draft BOOLEAN DEFAULT false;

-- AI analysis results storage
ALTER TABLE journal_entries ADD COLUMN IF NOT EXISTS ai_analysis JSONB DEFAULT '{}';

-- Convert safety_rating from ENUM to INTEGER for consistency
ALTER TABLE journal_entries ALTER COLUMN safety_rating TYPE INTEGER USING (safety_rating::TEXT)::INTEGER;
ALTER TABLE journal_entries ADD CONSTRAINT check_safety_rating CHECK (safety_rating >= 1 AND safety_rating <= 5);

-- =====================================================
-- 3. ENHANCE AI CONVERSATIONS
-- =====================================================

-- Add context type for different AI modes
ALTER TABLE ai_conversations ADD COLUMN IF NOT EXISTS context_type TEXT DEFAULT 'general' 
  CHECK (context_type IN ('general', 'crisis', 'pattern-analysis', 'mind-reset', 'grey-rock'));

-- Add metadata for AI conversations
ALTER TABLE ai_messages ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

-- =====================================================
-- 4. PATTERN ANALYSIS & INSIGHTS TABLES
-- =====================================================

-- Store AI-generated pattern analysis results
CREATE TABLE IF NOT EXISTS pattern_analysis (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  analysis_type TEXT NOT NULL CHECK (analysis_type IN ('abuse_patterns', 'time_patterns', 'emotional_trends', 'escalation_indicators')),
  analysis_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  analysis_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  
  -- Analysis results
  patterns_identified JSONB DEFAULT '[]',
  insights JSONB DEFAULT '{}',
  recommendations JSONB DEFAULT '[]',
  risk_assessment JSONB DEFAULT '{}',
  
  -- Metadata
  confidence_score DECIMAL(3,2), -- 0.00 to 1.00
  data_points_analyzed INTEGER,
  ai_model_version TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User insights and recommendations tracking
CREATE TABLE IF NOT EXISTS user_insights (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  insight_type TEXT NOT NULL CHECK (insight_type IN ('pattern', 'recommendation', 'warning', 'progress', 'achievement')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  
  -- Insight data
  related_entries UUID[], -- Array of journal entry IDs
  related_patterns UUID[], -- Array of pattern analysis IDs
  action_items JSONB DEFAULT '[]',
  
  -- User interaction
  is_read BOOLEAN DEFAULT false,
  is_dismissed BOOLEAN DEFAULT false,
  user_feedback TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- =====================================================
-- 5. EXPORT & REPORTING SYSTEM
-- =====================================================

-- Track export requests and generated reports
CREATE TABLE IF NOT EXISTS export_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  export_type TEXT NOT NULL CHECK (export_type IN ('journal_pdf', 'evidence_package', 'pattern_report', 'legal_summary', 'therapeutic_report')),
  
  -- Export parameters
  date_range_start TIMESTAMP WITH TIME ZONE,
  date_range_end TIMESTAMP WITH TIME ZONE,
  include_evidence BOOLEAN DEFAULT true,
  include_patterns BOOLEAN DEFAULT true,
  export_format TEXT DEFAULT 'pdf' CHECK (export_format IN ('pdf', 'docx', 'json', 'csv')),
  
  -- Processing status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  file_path TEXT, -- Storage path for generated file
  file_size BIGINT,
  download_count INTEGER DEFAULT 0,
  
  -- Metadata
  processing_started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days')
);

-- =====================================================
-- 6. SUBSCRIPTION & USAGE TRACKING
-- =====================================================

-- Track feature usage for subscription tiers
CREATE TABLE IF NOT EXISTS usage_tracking (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  feature_name TEXT NOT NULL,
  usage_type TEXT NOT NULL CHECK (usage_type IN ('api_call', 'storage_mb', 'export_request', 'ai_interaction')),
  
  -- Usage data
  usage_count INTEGER DEFAULT 1,
  usage_metadata JSONB DEFAULT '{}',
  
  -- Billing period tracking
  billing_period_start DATE NOT NULL,
  billing_period_end DATE NOT NULL,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Ensure unique usage record per user/feature/type/period
  UNIQUE(user_id, feature_name, usage_type, billing_period_start)
);

-- Feature access control based on subscription tiers
CREATE TABLE IF NOT EXISTS feature_limits (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  subscription_tier subscription_tier NOT NULL,
  feature_name TEXT NOT NULL,
  limit_type TEXT NOT NULL CHECK (limit_type IN ('monthly_count', 'storage_mb', 'concurrent_sessions')),
  limit_value INTEGER NOT NULL,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(subscription_tier, feature_name, limit_type)
);

-- =====================================================
-- 7. ENHANCED EVIDENCE FILES
-- =====================================================

-- Add missing metadata fields
ALTER TABLE evidence_files ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';
ALTER TABLE evidence_files ADD COLUMN IF NOT EXISTS processing_status TEXT DEFAULT 'pending' 
  CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed'));

-- Update file_type to be more specific
ALTER TABLE evidence_files ALTER COLUMN file_type TYPE TEXT;
ALTER TABLE evidence_files ADD CONSTRAINT check_file_type 
  CHECK (file_type IN ('image/jpeg', 'image/png', 'image/heic', 'audio/mpeg', 'audio/wav', 'audio/m4a', 'application/pdf', 'text/plain'));

-- =====================================================
-- 8. MIND RESET & COPING TOOLS INTEGRATION
-- =====================================================

-- Track mind reset sessions and effectiveness
CREATE TABLE IF NOT EXISTS mind_reset_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  session_type TEXT NOT NULL CHECK (session_type IN ('thought_reframe', 'breathing_exercise', 'grounding_technique', 'affirmation')),
  
  -- Session data
  original_thought TEXT,
  reframed_thought TEXT,
  techniques_used TEXT[],
  duration_minutes INTEGER,
  
  -- Effectiveness tracking
  mood_before INTEGER CHECK (mood_before >= 1 AND mood_before <= 10),
  mood_after INTEGER CHECK (mood_after >= 1 AND mood_after <= 10),
  effectiveness_rating INTEGER CHECK (effectiveness_rating >= 1 AND effectiveness_rating <= 5),
  notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 9. TRAUMA-INFORMED ENHANCEMENT TABLES
-- =====================================================

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

-- =====================================================
-- 10. SAFETY PLAN ENHANCEMENTS
-- =====================================================

-- Add structured fields for better safety plan management
ALTER TABLE safety_plans ADD COLUMN IF NOT EXISTS important_documents TEXT[];
ALTER TABLE safety_plans ADD COLUMN IF NOT EXISTS financial_resources JSONB DEFAULT '{}';
ALTER TABLE safety_plans ADD COLUMN IF NOT EXISTS escape_plan JSONB DEFAULT '{}';
ALTER TABLE safety_plans ADD COLUMN IF NOT EXISTS professional_support JSONB DEFAULT '{}';
ALTER TABLE safety_plans ADD COLUMN IF NOT EXISTS last_reviewed TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE safety_plans ADD COLUMN IF NOT EXISTS review_frequency_days INTEGER DEFAULT 30;

-- Add protected information fields for secure vault functionality
ALTER TABLE safety_plans ADD COLUMN IF NOT EXISTS protected_info_password_hash TEXT;
ALTER TABLE safety_plans ADD COLUMN IF NOT EXISTS protected_information TEXT;

-- =====================================================
-- 11. ENABLE ROW LEVEL SECURITY FOR NEW TABLES
-- =====================================================

ALTER TABLE pattern_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE export_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE mind_reset_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_check_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE coping_strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE healing_resources ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 12. CREATE INDEXES FOR PERFORMANCE
-- =====================================================

-- Pattern analysis indexes
CREATE INDEX IF NOT EXISTS idx_pattern_analysis_user_id ON pattern_analysis(user_id);
CREATE INDEX IF NOT EXISTS idx_pattern_analysis_type ON pattern_analysis(analysis_type);
CREATE INDEX IF NOT EXISTS idx_pattern_analysis_period ON pattern_analysis(analysis_period_start, analysis_period_end);

-- User insights indexes
CREATE INDEX IF NOT EXISTS idx_user_insights_user_id ON user_insights(user_id);
CREATE INDEX IF NOT EXISTS idx_user_insights_type ON user_insights(insight_type);
CREATE INDEX IF NOT EXISTS idx_user_insights_priority ON user_insights(priority);
CREATE INDEX IF NOT EXISTS idx_user_insights_unread ON user_insights(user_id, is_read) WHERE is_read = false;

-- Export requests indexes
CREATE INDEX IF NOT EXISTS idx_export_requests_user_id ON export_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_export_requests_status ON export_requests(status);
CREATE INDEX IF NOT EXISTS idx_export_requests_created_at ON export_requests(created_at);

-- Usage tracking indexes
CREATE INDEX IF NOT EXISTS idx_usage_tracking_user_id ON usage_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_feature ON usage_tracking(feature_name);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_period ON usage_tracking(billing_period_start, billing_period_end);

-- Mind reset sessions indexes
CREATE INDEX IF NOT EXISTS idx_mind_reset_sessions_user_id ON mind_reset_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_mind_reset_sessions_type ON mind_reset_sessions(session_type);
CREATE INDEX IF NOT EXISTS idx_mind_reset_sessions_created_at ON mind_reset_sessions(created_at);

-- Enhanced journal entries indexes
CREATE INDEX IF NOT EXISTS idx_journal_entries_is_draft ON journal_entries(user_id, is_draft);
CREATE INDEX IF NOT EXISTS idx_journal_entries_is_evidence ON journal_entries(user_id, is_evidence);
CREATE INDEX IF NOT EXISTS idx_journal_entries_mood_rating ON journal_entries(mood_rating);

-- Add indexes for trauma-informed tables
CREATE INDEX IF NOT EXISTS idx_mood_check_ins_user_id ON mood_check_ins(user_id);
CREATE INDEX IF NOT EXISTS idx_mood_check_ins_created_at ON mood_check_ins(created_at);
CREATE INDEX IF NOT EXISTS idx_coping_strategies_user_id ON coping_strategies(user_id);
CREATE INDEX IF NOT EXISTS idx_healing_resources_user_id ON healing_resources(user_id);

-- =====================================================
-- 13. INSERT DEFAULT FEATURE LIMITS
-- =====================================================

-- Foundation tier limits (Free)
INSERT INTO feature_limits (subscription_tier, feature_name, limit_type, limit_value) VALUES
('foundation', 'journal_entries', 'monthly_count', 50),
('foundation', 'evidence_files', 'monthly_count', 20),
('foundation', 'ai_interactions', 'monthly_count', 10),
('foundation', 'storage', 'storage_mb', 100),
('foundation', 'export_requests', 'monthly_count', 2)
ON CONFLICT (subscription_tier, feature_name, limit_type) DO NOTHING;

-- Recovery tier limits ($19.99/month)
INSERT INTO feature_limits (subscription_tier, feature_name, limit_type, limit_value) VALUES
('recovery', 'journal_entries', 'monthly_count', 200),
('recovery', 'evidence_files', 'monthly_count', 100),
('recovery', 'ai_interactions', 'monthly_count', 100),
('recovery', 'storage', 'storage_mb', 1000),
('recovery', 'export_requests', 'monthly_count', 10),
('recovery', 'pattern_analysis', 'monthly_count', 20)
ON CONFLICT (subscription_tier, feature_name, limit_type) DO NOTHING;

-- Empowerment tier limits ($39.99/month)
INSERT INTO feature_limits (subscription_tier, feature_name, limit_type, limit_value) VALUES
('empowerment', 'journal_entries', 'monthly_count', -1), -- Unlimited
('empowerment', 'evidence_files', 'monthly_count', -1), -- Unlimited
('empowerment', 'ai_interactions', 'monthly_count', -1), -- Unlimited
('empowerment', 'storage', 'storage_mb', 10000),
('empowerment', 'export_requests', 'monthly_count', -1), -- Unlimited
('empowerment', 'pattern_analysis', 'monthly_count', -1) -- Unlimited
ON CONFLICT (subscription_tier, feature_name, limit_type) DO NOTHING;

-- =====================================================
-- 14. UTILITY FUNCTIONS
-- =====================================================

-- Function to check if user has reached feature limit
CREATE OR REPLACE FUNCTION check_feature_limit(
  p_user_id UUID,
  p_feature_name TEXT,
  p_limit_type TEXT DEFAULT 'monthly_count'
) RETURNS BOOLEAN AS $$
DECLARE
  user_tier subscription_tier;
  feature_limit INTEGER;
  current_usage INTEGER;
  current_period_start DATE;
  current_period_end DATE;
BEGIN
  -- Get user's subscription tier
  SELECT subscription_tier INTO user_tier
  FROM profiles WHERE id = p_user_id;

  -- Get feature limit for this tier
  SELECT limit_value INTO feature_limit
  FROM feature_limits
  WHERE subscription_tier = user_tier
    AND feature_name = p_feature_name
    AND limit_type = p_limit_type;

  -- If no limit found or unlimited (-1), allow
  IF feature_limit IS NULL OR feature_limit = -1 THEN
    RETURN TRUE;
  END IF;

  -- Calculate current billing period
  current_period_start := DATE_TRUNC('month', CURRENT_DATE);
  current_period_end := current_period_start + INTERVAL '1 month' - INTERVAL '1 day';

  -- Get current usage for this period
  SELECT COALESCE(SUM(usage_count), 0) INTO current_usage
  FROM usage_tracking
  WHERE user_id = p_user_id
    AND feature_name = p_feature_name
    AND usage_type = p_limit_type
    AND billing_period_start = current_period_start;

  -- Check if under limit
  RETURN current_usage < feature_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to record feature usage
CREATE OR REPLACE FUNCTION record_feature_usage(
  p_user_id UUID,
  p_feature_name TEXT,
  p_usage_type TEXT DEFAULT 'monthly_count',
  p_usage_count INTEGER DEFAULT 1,
  p_metadata JSONB DEFAULT '{}'
) RETURNS VOID AS $$
DECLARE
  current_period_start DATE;
  current_period_end DATE;
BEGIN
  -- Calculate current billing period
  current_period_start := DATE_TRUNC('month', CURRENT_DATE);
  current_period_end := current_period_start + INTERVAL '1 month' - INTERVAL '1 day';

  -- Insert or update usage record
  INSERT INTO usage_tracking (
    user_id, feature_name, usage_type, usage_count, usage_metadata,
    billing_period_start, billing_period_end
  ) VALUES (
    p_user_id, p_feature_name, p_usage_type, p_usage_count, p_metadata,
    current_period_start, current_period_end
  )
  ON CONFLICT (user_id, feature_name, usage_type, billing_period_start)
  DO UPDATE SET
    usage_count = usage_tracking.usage_count + p_usage_count,
    usage_metadata = p_metadata;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
