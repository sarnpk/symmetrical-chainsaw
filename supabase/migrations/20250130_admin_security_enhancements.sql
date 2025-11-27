-- Add security columns to admin_users table
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS last_login_ip TEXT;
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS failed_attempts INTEGER DEFAULT 0;
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS locked_until TIMESTAMP WITH TIME ZONE;

-- Create security logs table
CREATE TABLE IF NOT EXISTS security_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for security logs
CREATE INDEX IF NOT EXISTS idx_security_logs_event_type ON security_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_security_logs_created_at ON security_logs(created_at);

-- Enable RLS on security_logs
ALTER TABLE security_logs ENABLE ROW LEVEL SECURITY;

-- Only service role can access security logs
CREATE POLICY "Service role can manage security logs" ON security_logs
  FOR ALL USING (auth.role() = 'service_role');

-- Function to reset failed attempts after successful login
CREATE OR REPLACE FUNCTION reset_admin_failed_attempts()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.last_login_at IS NOT NULL AND NEW.last_login_at != OLD.last_login_at THEN
    NEW.failed_attempts = 0;
    NEW.locked_until = NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-reset failed attempts
DROP TRIGGER IF EXISTS reset_failed_attempts_trigger ON admin_users;
CREATE TRIGGER reset_failed_attempts_trigger
  BEFORE UPDATE ON admin_users
  FOR EACH ROW
  EXECUTE FUNCTION reset_admin_failed_attempts();