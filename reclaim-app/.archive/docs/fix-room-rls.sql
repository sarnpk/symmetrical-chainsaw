-- Fix infinite recursion by completely disabling RLS on participants

-- Drop ALL policies on both tables
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public' AND tablename IN ('community_room_participants', 'community_room_messages'))
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON ' || quote_ident(r.tablename);
    END LOOP;
END $$;

-- Completely disable RLS on participants (no policies = no recursion)
ALTER TABLE community_room_participants DISABLE ROW LEVEL SECURITY;

-- Keep RLS on messages
ALTER TABLE community_room_messages ENABLE ROW LEVEL SECURITY;

-- Message policies (can now safely query participants without RLS)
CREATE POLICY messages_read_participant ON community_room_messages
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM community_room_participants p
    WHERE p.room_id = community_room_messages.room_id
    AND p.user_id = auth.uid()
  )
);

CREATE POLICY messages_insert_participant ON community_room_messages
FOR INSERT WITH CHECK (
  auth.uid() = user_id AND
  EXISTS (
    SELECT 1 FROM community_room_participants p
    WHERE p.room_id = community_room_messages.room_id
    AND p.user_id = auth.uid()
  )
);

CREATE POLICY messages_delete_own ON community_room_messages
FOR DELETE USING (auth.uid() = user_id);
