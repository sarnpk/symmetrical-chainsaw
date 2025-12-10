-- Check if all required tables exist
SELECT 
  table_name,
  CASE WHEN table_name IS NOT NULL THEN '✓ EXISTS' ELSE '✗ MISSING' END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN (
    'profiles',
    'community_posts',
    'community_comments', 
    'community_likes',
    'community_conversations',
    'community_conversation_participants',
    'community_messages',
    'community_blocks'
  )
ORDER BY table_name;

-- Count rows in each table
SELECT 'profiles' as table_name, COUNT(*) as row_count FROM public.profiles
UNION ALL
SELECT 'community_posts', COUNT(*) FROM public.community_posts
UNION ALL
SELECT 'community_comments', COUNT(*) FROM public.community_comments
UNION ALL
SELECT 'community_likes', COUNT(*) FROM public.community_likes
UNION ALL
SELECT 'community_conversations', COUNT(*) FROM public.community_conversations
UNION ALL
SELECT 'community_conversation_participants', COUNT(*) FROM public.community_conversation_participants
UNION ALL
SELECT 'community_messages', COUNT(*) FROM public.community_messages
UNION ALL
SELECT 'community_blocks', COUNT(*) FROM public.community_blocks;
