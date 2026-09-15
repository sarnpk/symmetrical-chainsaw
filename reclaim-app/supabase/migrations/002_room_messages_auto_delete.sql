-- Auto-delete room messages older than 24 hours
-- Run this in Supabase SQL Editor

-- 1. Enable pg_cron extension (required)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- 2. Function to delete old room messages
CREATE OR REPLACE FUNCTION delete_old_room_messages()
RETURNS void AS $$
  DELETE FROM community_room_messages
  WHERE created_at < NOW() - INTERVAL '24 hours';
$$ LANGUAGE sql;

-- 3. Schedule it to run every hour
SELECT cron.schedule(
  'delete-old-room-messages',
  '0 * * * *',
  $$SELECT delete_old_room_messages()$$
);
