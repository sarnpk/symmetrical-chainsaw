-- Add two lead magnet blog articles
-- Run this directly in Supabase SQL Editor

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
