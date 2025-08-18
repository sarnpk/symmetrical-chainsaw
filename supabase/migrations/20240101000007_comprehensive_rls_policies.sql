-- Comprehensive RLS Policies for New Tables
-- Security policies for all tables added in the comprehensive schema completion

-- =====================================================
-- PATTERN ANALYSIS POLICIES
-- =====================================================

CREATE POLICY "Users can view own pattern analysis" ON pattern_analysis
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own pattern analysis" ON pattern_analysis
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pattern analysis" ON pattern_analysis
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own pattern analysis" ON pattern_analysis
  FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- USER INSIGHTS POLICIES
-- =====================================================

CREATE POLICY "Users can view own insights" ON user_insights
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own insights" ON user_insights
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own insights" ON user_insights
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own insights" ON user_insights
  FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- EXPORT REQUESTS POLICIES
-- =====================================================

CREATE POLICY "Users can view own export requests" ON export_requests
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own export requests" ON export_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own export requests" ON export_requests
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own export requests" ON export_requests
  FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- USAGE TRACKING POLICIES
-- =====================================================

CREATE POLICY "Users can view own usage tracking" ON usage_tracking
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert usage tracking" ON usage_tracking
  FOR INSERT WITH CHECK (true); -- Allow system to track usage

CREATE POLICY "System can update usage tracking" ON usage_tracking
  FOR UPDATE USING (true); -- Allow system to update usage

-- Users cannot delete usage tracking (audit trail)

-- =====================================================
-- FEATURE LIMITS POLICIES
-- =====================================================

-- Feature limits are read-only for users, managed by system
CREATE POLICY "Anyone can view feature limits" ON feature_limits
  FOR SELECT USING (true);

-- Only system/admin can modify feature limits
-- (No INSERT/UPDATE/DELETE policies for regular users)

-- =====================================================
-- MIND RESET SESSIONS POLICIES
-- =====================================================

CREATE POLICY "Users can view own mind reset sessions" ON mind_reset_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own mind reset sessions" ON mind_reset_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own mind reset sessions" ON mind_reset_sessions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own mind reset sessions" ON mind_reset_sessions
  FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- ENHANCED POLICIES FOR EXISTING TABLES
-- =====================================================

-- Add policies for trauma-informed enhancement tables if they exist
DO $$
BEGIN
  -- Check if mood_check_ins table exists and add policy
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'mood_check_ins') THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies
      WHERE tablename = 'mood_check_ins'
      AND policyname = 'Users can manage own mood check-ins'
    ) THEN
      CREATE POLICY "Users can manage own mood check-ins" ON mood_check_ins
        FOR ALL USING (auth.uid() = user_id);
    END IF;
  END IF;

  -- Check if coping_strategies table exists and add policy
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'coping_strategies') THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies
      WHERE tablename = 'coping_strategies'
      AND policyname = 'Users can manage own coping strategies'
    ) THEN
      CREATE POLICY "Users can manage own coping strategies" ON coping_strategies
        FOR ALL USING (auth.uid() = user_id);
    END IF;
  END IF;

  -- Check if healing_resources table exists and add policy
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'healing_resources') THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies
      WHERE tablename = 'healing_resources'
      AND policyname = 'Users can manage own healing resources'
    ) THEN
      CREATE POLICY "Users can manage own healing resources" ON healing_resources
        FOR ALL USING (auth.uid() = user_id);
    END IF;
  END IF;
END $$;

-- =====================================================
-- FUNCTION SECURITY
-- =====================================================

-- Grant execute permissions on utility functions to authenticated users
GRANT EXECUTE ON FUNCTION check_feature_limit(UUID, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION record_feature_usage(UUID, TEXT, TEXT, INTEGER, JSONB) TO authenticated;

-- =====================================================
-- ADDITIONAL SECURITY CONSTRAINTS
-- =====================================================

-- Ensure users can only access their own data through additional constraints
ALTER TABLE pattern_analysis ADD CONSTRAINT pattern_analysis_user_check 
  CHECK (user_id = auth.uid()) NOT VALID;

ALTER TABLE user_insights ADD CONSTRAINT user_insights_user_check 
  CHECK (user_id = auth.uid()) NOT VALID;

ALTER TABLE export_requests ADD CONSTRAINT export_requests_user_check 
  CHECK (user_id = auth.uid()) NOT VALID;

ALTER TABLE usage_tracking ADD CONSTRAINT usage_tracking_user_check 
  CHECK (user_id = auth.uid()) NOT VALID;

ALTER TABLE mind_reset_sessions ADD CONSTRAINT mind_reset_sessions_user_check 
  CHECK (user_id = auth.uid()) NOT VALID;

-- =====================================================
-- COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON TABLE pattern_analysis IS 'Stores AI-generated pattern analysis results for user journal entries';
COMMENT ON TABLE user_insights IS 'Personalized insights and recommendations generated for users';
COMMENT ON TABLE export_requests IS 'Tracks user requests for data exports and report generation';
COMMENT ON TABLE usage_tracking IS 'Monitors feature usage for subscription tier enforcement';
COMMENT ON TABLE feature_limits IS 'Defines usage limits for different subscription tiers';
COMMENT ON TABLE mind_reset_sessions IS 'Tracks mind reset tool usage and effectiveness';

COMMENT ON FUNCTION check_feature_limit(UUID, TEXT, TEXT) IS 'Checks if user has reached their subscription tier limit for a feature';
COMMENT ON FUNCTION record_feature_usage(UUID, TEXT, TEXT, INTEGER, JSONB) IS 'Records feature usage for subscription tier tracking';

-- =====================================================
-- TRIGGERS FOR AUTOMATIC USAGE TRACKING
-- =====================================================

-- Automatically track journal entry creation
CREATE OR REPLACE FUNCTION track_journal_entry_usage()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM record_feature_usage(NEW.user_id, 'journal_entries', 'monthly_count', 1);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_track_journal_entry_usage
  AFTER INSERT ON journal_entries
  FOR EACH ROW
  EXECUTE FUNCTION track_journal_entry_usage();

-- Automatically track evidence file uploads
CREATE OR REPLACE FUNCTION track_evidence_file_usage()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM record_feature_usage(NEW.user_id, 'evidence_files', 'monthly_count', 1);
  
  -- Also track storage usage
  IF NEW.file_size IS NOT NULL THEN
    PERFORM record_feature_usage(
      NEW.user_id, 
      'storage', 
      'storage_mb', 
      CEIL(NEW.file_size / 1048576.0)::INTEGER -- Convert bytes to MB
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_track_evidence_file_usage
  AFTER INSERT ON evidence_files
  FOR EACH ROW
  EXECUTE FUNCTION track_evidence_file_usage();

-- Automatically track AI interactions
CREATE OR REPLACE FUNCTION track_ai_interaction_usage()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM record_feature_usage(NEW.user_id, 'ai_interactions', 'monthly_count', 1);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_track_ai_interaction_usage
  AFTER INSERT ON ai_messages
  FOR EACH ROW
  EXECUTE FUNCTION track_ai_interaction_usage();

-- Automatically track export requests
CREATE OR REPLACE FUNCTION track_export_request_usage()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM record_feature_usage(NEW.user_id, 'export_requests', 'monthly_count', 1);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_track_export_request_usage
  AFTER INSERT ON export_requests
  FOR EACH ROW
  EXECUTE FUNCTION track_export_request_usage();

-- Automatically track pattern analysis requests
CREATE OR REPLACE FUNCTION track_pattern_analysis_usage()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM record_feature_usage(NEW.user_id, 'pattern_analysis', 'monthly_count', 1);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_track_pattern_analysis_usage
  AFTER INSERT ON pattern_analysis
  FOR EACH ROW
  EXECUTE FUNCTION track_pattern_analysis_usage();
