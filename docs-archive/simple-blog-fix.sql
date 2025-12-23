-- Simple fix for blog visibility
-- Run in Supabase SQL Editor

-- Drop ALL existing policies
DROP POLICY IF EXISTS "Public read access to published posts" ON blog_posts;
DROP POLICY IF EXISTS "Anyone can read published posts" ON blog_posts;
DROP POLICY IF EXISTS "Admins can manage all posts" ON blog_posts;
DROP POLICY IF EXISTS "Authenticated users can manage posts" ON blog_posts;

-- Create ONE simple policy for reading
CREATE POLICY "Enable read for all" ON blog_posts
  FOR SELECT USING (true);

-- Create ONE simple policy for writing (authenticated users only)
CREATE POLICY "Enable write for authenticated" ON blog_posts
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Check what posts exist
SELECT id, title, slug, status, published_at FROM blog_posts ORDER BY created_at DESC;
