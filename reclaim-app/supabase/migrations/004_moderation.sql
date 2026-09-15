-- Moderation: reports and blocks
-- Run this in Supabase SQL Editor

-- 1. Reports table
CREATE TABLE IF NOT EXISTS community_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  target_post_id UUID REFERENCES community_posts(id) ON DELETE SET NULL,
  target_comment_id UUID REFERENCES community_comments(id) ON DELETE SET NULL,
  target_message_id UUID,
  reason TEXT NOT NULL CHECK (reason IN ('spam', 'harassment', 'hate_speech', 'self_harm', 'inappropriate', 'other')),
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  reviewed_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_reports_status ON community_reports(status) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_reports_reporter ON community_reports(reporter_id);

ALTER TABLE community_reports ENABLE ROW LEVEL SECURITY;

-- Users can insert reports
CREATE POLICY "Users insert reports" ON community_reports
  FOR INSERT WITH CHECK (auth.uid() = reporter_id);

-- Users can read their own reports
CREATE POLICY "Users read own reports" ON community_reports
  FOR SELECT USING (auth.uid() = reporter_id);

-- Admins can read all reports (via service role or check a role)
CREATE POLICY "Service role reads all reports" ON community_reports
  FOR SELECT USING (true);

CREATE POLICY "Service role updates reports" ON community_reports
  FOR UPDATE USING (true);

-- 2. Blocks table
CREATE TABLE IF NOT EXISTS community_blocks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  blocker_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  blocked_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(blocker_id, blocked_id)
);

CREATE INDEX IF NOT EXISTS idx_blocks_blocker ON community_blocks(blocker_id);
CREATE INDEX IF NOT EXISTS idx_blocks_blocked ON community_blocks(blocked_id);

ALTER TABLE community_blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own blocks" ON community_blocks
  FOR ALL USING (auth.uid() = blocker_id);

CREATE POLICY "Service role reads all blocks" ON community_blocks
  FOR SELECT USING (true);

-- 3. Banned users table
CREATE TABLE IF NOT EXISTS community_bans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reason TEXT,
  banned_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  UNIQUE(user_id)
);

ALTER TABLE community_bans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role manages bans" ON community_bans
  FOR ALL USING (true);

-- 4. Function to check if a user is banned
CREATE OR REPLACE FUNCTION is_user_banned(check_user_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM community_bans
    WHERE user_id = check_user_id
      AND (expires_at IS NULL OR expires_at > NOW())
  );
$$ LANGUAGE sql;
