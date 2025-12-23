-- Fix blog RLS policies for admin access
-- Run this in Supabase SQL Editor

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Public read access to published posts" ON blog_posts;
DROP POLICY IF EXISTS "Public read access to active categories" ON blog_categories;
DROP POLICY IF EXISTS "Public read access to tags" ON blog_tags;
DROP POLICY IF EXISTS "Public read access to post tags" ON blog_post_tags;

-- Create new policies with admin access
CREATE POLICY "Anyone can read published posts" ON blog_posts
  FOR SELECT USING (status = 'published');

CREATE POLICY "Admins can manage all posts" ON blog_posts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Anyone can read categories" ON blog_categories
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage categories" ON blog_categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Anyone can read tags" ON blog_tags
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage tags" ON blog_tags
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Anyone can read post tags" ON blog_post_tags
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage post tags" ON blog_post_tags
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );
