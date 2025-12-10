-- Check conversations for user a580b1b2-d87c-4ba9-8e6d-31e74580d6c3
SELECT 
  c.id,
  c.created_at,
  array_agg(p.user_id) as participants
FROM community_conversations c
JOIN community_conversation_participants p ON p.conversation_id = c.id
WHERE c.id IN (
  SELECT conversation_id 
  FROM community_conversation_participants 
  WHERE user_id = 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3'
)
GROUP BY c.id, c.created_at
ORDER BY c.created_at DESC;

-- Check RLS policies for chat tables
SELECT tablename, policyname, cmd, qual
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename IN ('community_conversations', 'community_conversation_participants', 'community_messages')
ORDER BY tablename, cmd;
