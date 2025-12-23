-- Check and fix blog posts
-- Run in Supabase SQL Editor

-- 1. See all posts and their status
SELECT id, title, slug, status, published_at, created_at FROM blog_posts ORDER BY created_at DESC;

-- 2. Update all posts to published status
UPDATE blog_posts SET status = 'published', published_at = COALESCE(published_at, NOW()) WHERE status != 'published';

-- 3. Verify all are published now
SELECT id, title, slug, status, published_at FROM blog_posts ORDER BY created_at DESC;
