-- Check RLS policies for community tables
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename IN ('community_posts', 'community_comments', 'community_likes')
ORDER BY tablename, cmd;
