-- Fix all blog issues
-- Run this in Supabase SQL Editor

-- 1. Delete duplicate posts if they exist
DELETE FROM blog_posts WHERE slug IN ('free-narcissist-test-identify-behavior', 'free-relationship-health-check-toxic');

-- 2. Check if is_admin column exists, if not add it
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='is_admin') THEN
    ALTER TABLE profiles ADD COLUMN is_admin BOOLEAN DEFAULT false;
  END IF;
END $$;

-- 3. Drop existing restrictive policies
DROP POLICY IF EXISTS "Public read access to published posts" ON blog_posts;
DROP POLICY IF EXISTS "Admins can manage all posts" ON blog_posts;
DROP POLICY IF EXISTS "Public read access to active categories" ON blog_categories;
DROP POLICY IF EXISTS "Admins can manage categories" ON blog_categories;
DROP POLICY IF EXISTS "Public read access to tags" ON blog_tags;
DROP POLICY IF EXISTS "Admins can manage tags" ON blog_tags;
DROP POLICY IF EXISTS "Public read access to post tags" ON blog_post_tags;
DROP POLICY IF EXISTS "Admins can manage post tags" ON blog_post_tags;

-- 4. Create simple policies (admin check will be done in API)
CREATE POLICY "Anyone can read published posts" ON blog_posts
  FOR SELECT USING (status = 'published' OR auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can manage posts" ON blog_posts
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Anyone can read categories" ON blog_categories
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage categories" ON blog_categories
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Anyone can read tags" ON blog_tags
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage tags" ON blog_tags
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Anyone can read post tags" ON blog_post_tags
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage post tags" ON blog_post_tags
  FOR ALL USING (auth.uid() IS NOT NULL);

-- 5. Now insert the new blog posts
INSERT INTO blog_posts (
  title, slug, excerpt, content, category_id, status, is_featured, 
  meta_title, meta_description, reading_time, published_at
) VALUES
(
  'Free Narcissist Test: Identify Narcissistic Behavior in 60 Seconds',
  'free-narcissist-test-identify-behavior',
  'Wondering if someone in your life is a narcissist? Our AI-powered free test analyzes behavior patterns and identifies narcissist types instantly. No signup required.',
  'Take our free narcissist test to identify 6 types of narcissists and 12 manipulation tactics. Get instant results with AI-powered analysis. No signup required - completely anonymous and free forever.',
  (SELECT id FROM blog_categories WHERE slug = 'narcissistic-abuse'),
  'published',
  false,
  'Free Narcissist Test - AI Identifies Narcissistic Behavior in 60 Seconds',
  'Free AI-powered narcissist test identifies 6 types of narcissists and 12 manipulation tactics instantly. No signup required. Get clarity on toxic relationships now.',
  6,
  NOW()
),
(
  'Free Relationship Health Check: Is Your Relationship Toxic?',
  'free-relationship-health-check-toxic',
  'Not sure if your relationship is healthy? Take our free 5-minute assessment to identify red flags, manipulation patterns, and get personalized recovery recommendations.',
  'Take our free relationship health check to get your relationship score (0-100) and identify toxic patterns. 5-minute assessment reveals red flags and provides personalized recovery plan.',
  (SELECT id FROM blog_categories WHERE slug = 'mental-health'),
  'published',
  false,
  'Free Relationship Health Check - Is Your Relationship Toxic? | 5-Min Assessment',
  'Free relationship health assessment identifies toxic patterns, red flags, and narcissistic abuse. Get your relationship score and personalized recovery plan in 5 minutes.',
  7,
  NOW()
);
