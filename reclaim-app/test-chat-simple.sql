-- Simple Chat Test - Just check if conversations exist
-- Run in Supabase SQL Editor

-- Check if your user exists and has chat enabled
SELECT 
  'User Check' as test,
  id, 
  email, 
  chat_enabled 
FROM public.profiles 
WHERE id = 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3';

-- Check conversations for your user
SELECT 
  'Conversations' as test,
  c.id as conversation_id,
  c.created_at,
  p.user_id as participant_id
FROM public.community_conversations c
JOIN public.community_conversation_participants p ON p.conversation_id = c.id
WHERE p.user_id = 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3';

-- Check messages in those conversations
SELECT 
  'Messages' as test,
  m.id,
  m.conversation_id,
  m.sender_id,
  m.content,
  m.created_at
FROM public.community_messages m
WHERE m.conversation_id IN (
  SELECT conversation_id 
  FROM public.community_conversation_participants 
  WHERE user_id = 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3'
)
ORDER BY m.created_at DESC
LIMIT 10;

-- Test the API call manually
SELECT 
  'API Test - What /api/community/conversations should return' as test,
  json_agg(
    json_build_object(
      'conversation_id', p.conversation_id,
      'last_read_at', p.last_read_at
    )
  ) as result
FROM public.community_conversation_participants p
WHERE p.user_id = 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3';
