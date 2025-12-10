-- Anonymous Group Chat Rooms for trauma victims
-- Safe, moderated spaces for emotional expression

-- Chat rooms (predefined topics)
CREATE TABLE IF NOT EXISTS community_chat_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL, -- 'support', 'healing', 'parenting', 'venting', 'anxiety', 'ptsd'
  max_participants INTEGER DEFAULT 20,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Room messages (auto-delete after 24h via cron job)
CREATE TABLE IF NOT EXISTS community_room_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES community_chat_rooms(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '24 hours')
);

-- Room participants (track who's in which room)
CREATE TABLE IF NOT EXISTS community_room_participants (
  room_id UUID REFERENCES community_chat_rooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (room_id, user_id)
);

-- Message reports (for moderation)
CREATE TABLE IF NOT EXISTS community_room_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID REFERENCES community_room_messages(id) ON DELETE CASCADE NOT NULL,
  reported_by UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  reason TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_room_messages_room ON community_room_messages(room_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_room_messages_expires ON community_room_messages(expires_at);
CREATE INDEX IF NOT EXISTS idx_room_participants_user ON community_room_participants(user_id);

-- RLS Policies
ALTER TABLE community_chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_room_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_room_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_room_reports ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS rooms_read_all ON community_chat_rooms;
DROP POLICY IF EXISTS messages_read_participant ON community_room_messages;
DROP POLICY IF EXISTS messages_insert_participant ON community_room_messages;
DROP POLICY IF EXISTS messages_delete_own ON community_room_messages;
DROP POLICY IF EXISTS participants_read_all ON community_room_participants;
DROP POLICY IF EXISTS participants_insert_self ON community_room_participants;
DROP POLICY IF EXISTS participants_delete_self ON community_room_participants;
DROP POLICY IF EXISTS reports_insert_auth ON community_room_reports;

-- Anyone can view active rooms
CREATE POLICY rooms_read_all ON community_chat_rooms
FOR SELECT USING (is_active = true);

-- Users can view messages in rooms they've joined
CREATE POLICY messages_read_participant ON community_room_messages
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM community_room_participants p
    WHERE p.room_id = community_room_messages.room_id
    AND p.user_id = auth.uid()
  )
);

-- Users can send messages to rooms they've joined
CREATE POLICY messages_insert_participant ON community_room_messages
FOR INSERT WITH CHECK (
  auth.uid() = user_id AND
  EXISTS (
    SELECT 1 FROM community_room_participants p
    WHERE p.room_id = community_room_messages.room_id
    AND p.user_id = auth.uid()
  )
);

-- Users can delete their own messages
CREATE POLICY messages_delete_own ON community_room_messages
FOR DELETE USING (auth.uid() = user_id);

-- Users can view all participants (needed to see room counts)
CREATE POLICY participants_read_all ON community_room_participants
FOR SELECT USING (true);

-- Users can insert themselves as participants
CREATE POLICY participants_insert_self ON community_room_participants
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can delete themselves from rooms
CREATE POLICY participants_delete_self ON community_room_participants
FOR DELETE USING (auth.uid() = user_id);

-- Users can report messages
CREATE POLICY reports_insert_auth ON community_room_reports
FOR INSERT WITH CHECK (auth.uid() = reported_by);

-- Insert default rooms
INSERT INTO community_chat_rooms (name, description, category, max_participants) VALUES
  ('Late Night Support', 'For those struggling with insomnia, anxiety, or need someone to talk to late at night', 'support', 15),
  ('Healing Journey', 'Share your recovery stories, progress, and celebrate wins together', 'healing', 20),
  ('Parent Warriors', 'Support for co-parenting with narcissistic exes', 'parenting', 15),
  ('Just Venting', 'Express your feelings freely - no advice, just listening', 'venting', 20),
  ('Anxiety Relief', 'Coping strategies and support for anxiety and panic', 'anxiety', 15),
  ('PTSD Support', 'Safe space for those dealing with trauma and PTSD symptoms', 'ptsd', 15)
ON CONFLICT DO NOTHING;
