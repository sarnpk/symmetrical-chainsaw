-- Test if RLS policies are working

-- Check current policies
SELECT schemaname, tablename, policyname, cmd
FROM pg_policies 
WHERE tablename IN ('community_room_participants', 'community_room_messages')
ORDER BY tablename, cmd;

-- Check if RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('community_room_participants', 'community_room_messages');

-- Test query as if you're a user (replace with your user ID)
SET LOCAL ROLE authenticated;
SET LOCAL request.jwt.claims.sub TO 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3';

-- Try to read participants (should work)
SELECT COUNT(*) as participant_count
FROM community_room_participants;

-- Try to read messages (should work if you're a participant)
SELECT COUNT(*) as message_count
FROM community_room_messages;

RESET ROLE;
