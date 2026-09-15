-- Pinned messages + updated auto-delete durations
-- Run this in Supabase SQL Editor

-- 1. Pinned messages table (copies of messages users want to keep)
CREATE TABLE IF NOT EXISTS pinned_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  room_id UUID,
  conversation_id UUID,
  original_message_id UUID,
  content TEXT NOT NULL,
  author_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  pinned_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pinned_messages_user ON pinned_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_pinned_messages_room ON pinned_messages(room_id) WHERE room_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_pinned_messages_conv ON pinned_messages(conversation_id) WHERE conversation_id IS NOT NULL;

ALTER TABLE pinned_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own pins" ON pinned_messages
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users insert own pins" ON pinned_messages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users delete own pins" ON pinned_messages
  FOR DELETE USING (auth.uid() = user_id);

-- 2. Update auto-delete function to 72h for group chat
CREATE OR REPLACE FUNCTION delete_old_room_messages()
RETURNS void AS $$
  DELETE FROM community_room_messages
  WHERE created_at < NOW() - INTERVAL '72 hours'
    AND id NOT IN (SELECT original_message_id FROM pinned_messages WHERE original_message_id IS NOT NULL);
$$ LANGUAGE sql;

-- 3. Auto-delete function for DMs (7 days)
CREATE OR REPLACE FUNCTION delete_old_dm_messages()
RETURNS void AS $$
  DELETE FROM community_messages
  WHERE created_at < NOW() - INTERVAL '7 days'
    AND id NOT IN (SELECT original_message_id FROM pinned_messages WHERE original_message_id IS NOT NULL);
$$ LANGUAGE sql;
