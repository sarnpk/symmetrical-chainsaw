-- Add GDPR compliance features
-- Soft delete functionality and data retention tracking

-- Add soft delete columns to main tables
ALTER TABLE profiles ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;
ALTER TABLE journal_entries ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;
ALTER TABLE ai_conversations ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;
ALTER TABLE ai_messages ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;
ALTER TABLE mind_reset_sessions ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;
ALTER TABLE affirmations ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;
ALTER TABLE morning_intentions ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;
ALTER TABLE reality_log_entries ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;
ALTER TABLE mental_pause_sessions ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;
ALTER TABLE decompression_sessions ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Create data retention tracking table
CREATE TABLE data_retention_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    request_type VARCHAR(50) NOT NULL, -- 'deletion', 'export', 'restriction'
    status VARCHAR(20) NOT NULL DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create GDPR consent tracking table
CREATE TABLE gdpr_consents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    consent_type VARCHAR(50) NOT NULL, -- 'data_processing', 'marketing', 'analytics'
    consented BOOLEAN NOT NULL DEFAULT false,
    consent_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add data export functionality
CREATE TABLE data_exports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    export_type VARCHAR(20) NOT NULL DEFAULT 'full', -- 'full', 'partial'
    status VARCHAR(20) NOT NULL DEFAULT 'pending', -- 'pending', 'processing', 'ready', 'expired'
    file_path TEXT,
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies for new tables
ALTER TABLE data_retention_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE gdpr_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_exports ENABLE ROW LEVEL SECURITY;

-- RLS policies for data_retention_requests
CREATE POLICY "Users can view their own retention requests" ON data_retention_requests
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own retention requests" ON data_retention_requests
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS policies for gdpr_consents
CREATE POLICY "Users can view their own consents" ON gdpr_consents
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own consents" ON gdpr_consents
    FOR ALL USING (auth.uid() = user_id);

-- RLS policies for data_exports
CREATE POLICY "Users can view their own exports" ON data_exports
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own exports" ON data_exports
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_profiles_deleted_at ON profiles(deleted_at);
CREATE INDEX idx_journal_entries_deleted_at ON journal_entries(deleted_at);
CREATE INDEX idx_data_retention_requests_user_id ON data_retention_requests(user_id);
CREATE INDEX idx_gdpr_consents_user_id ON gdpr_consents(user_id);
CREATE INDEX idx_data_exports_user_id ON data_exports(user_id);
CREATE INDEX idx_data_exports_expires_at ON data_exports(expires_at);

-- Function to soft delete user and all related data
CREATE OR REPLACE FUNCTION soft_delete_user(target_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    -- Soft delete profile
    UPDATE profiles SET deleted_at = NOW() WHERE id = target_user_id;
    
    -- Soft delete all user data
    UPDATE journal_entries SET deleted_at = NOW() WHERE user_id = target_user_id;
    UPDATE ai_conversations SET deleted_at = NOW() WHERE user_id = target_user_id;
    UPDATE ai_messages SET deleted_at = NOW() WHERE user_id = target_user_id;
    UPDATE mind_reset_sessions SET deleted_at = NOW() WHERE user_id = target_user_id;
    UPDATE affirmations SET deleted_at = NOW() WHERE user_id = target_user_id;
    UPDATE morning_intentions SET deleted_at = NOW() WHERE user_id = target_user_id;
    UPDATE reality_log_entries SET deleted_at = NOW() WHERE user_id = target_user_id;
    UPDATE mental_pause_sessions SET deleted_at = NOW() WHERE user_id = target_user_id;
    UPDATE decompression_sessions SET deleted_at = NOW() WHERE user_id = target_user_id;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to permanently delete soft-deleted data older than 30 days
CREATE OR REPLACE FUNCTION cleanup_deleted_data()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER := 0;
BEGIN
    -- Delete data older than 30 days
    DELETE FROM journal_entries WHERE deleted_at < NOW() - INTERVAL '30 days';
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    DELETE FROM ai_conversations WHERE deleted_at < NOW() - INTERVAL '30 days';
    DELETE FROM ai_messages WHERE deleted_at < NOW() - INTERVAL '30 days';
    DELETE FROM mind_reset_sessions WHERE deleted_at < NOW() - INTERVAL '30 days';
    DELETE FROM affirmations WHERE deleted_at < NOW() - INTERVAL '30 days';
    DELETE FROM morning_intentions WHERE deleted_at < NOW() - INTERVAL '30 days';
    DELETE FROM reality_log_entries WHERE deleted_at < NOW() - INTERVAL '30 days';
    DELETE FROM mental_pause_sessions WHERE deleted_at < NOW() - INTERVAL '30 days';
    DELETE FROM decompression_sessions WHERE deleted_at < NOW() - INTERVAL '30 days';
    
    -- Finally delete profiles (this will cascade to remaining data)
    DELETE FROM profiles WHERE deleted_at < NOW() - INTERVAL '30 days';
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add comments
COMMENT ON TABLE data_retention_requests IS 'Tracks GDPR data retention and deletion requests';
COMMENT ON TABLE gdpr_consents IS 'Tracks user consent for various data processing activities';
COMMENT ON TABLE data_exports IS 'Tracks user data export requests and file availability';
COMMENT ON FUNCTION soft_delete_user IS 'Soft deletes a user and all their data for GDPR compliance';
COMMENT ON FUNCTION cleanup_deleted_data IS 'Permanently removes soft-deleted data older than 30 days';