-- Blog System for SEO and Content Marketing
-- Creates blog posts, categories, tags, and social media integration

-- =====================================================
-- 1. BLOG CATEGORIES
-- =====================================================

CREATE TABLE blog_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  color TEXT DEFAULT '#6366f1',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO blog_categories (name, slug, description, color, sort_order) VALUES
('Recovery Tips', 'recovery-tips', 'Practical advice for healing and recovery', '#10b981', 1),
('Mental Health', 'mental-health', 'Mental health awareness and support', '#3b82f6', 2),
('Narcissistic Abuse', 'narcissistic-abuse', 'Understanding and healing from narcissistic abuse', '#ef4444', 3),
('Self-Care', 'self-care', 'Self-care strategies and wellness tips', '#f59e0b', 4),
('Success Stories', 'success-stories', 'Inspiring recovery journeys', '#8b5cf6', 5),
('App Updates', 'app-updates', 'Latest features and improvements', '#06b6d4', 6);

-- =====================================================
-- 2. BLOG TAGS
-- =====================================================

CREATE TABLE blog_tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO blog_tags (name, slug) VALUES
('healing', 'healing'),
('boundaries', 'boundaries'),
('no-contact', 'no-contact'),
('gaslighting', 'gaslighting'),
('trauma', 'trauma'),
('therapy', 'therapy'),
('mindfulness', 'mindfulness'),
('self-worth', 'self-worth'),
('red-flags', 'red-flags'),
('recovery-journey', 'recovery-journey');

-- =====================================================
-- 3. BLOG POSTS
-- =====================================================

CREATE TABLE blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  featured_image TEXT,
  category_id UUID REFERENCES blog_categories(id),
  author_name TEXT NOT NULL DEFAULT 'Reclaim Team',
  author_bio TEXT,
  author_avatar TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  is_featured BOOLEAN DEFAULT false,
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT,
  reading_time INTEGER, -- in minutes
  view_count INTEGER DEFAULT 0,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. BLOG POST TAGS (Many-to-Many)
-- =====================================================

CREATE TABLE blog_post_tags (
  post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES blog_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- =====================================================
-- 5. SOCIAL MEDIA LINKS
-- =====================================================

CREATE TABLE social_media_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO social_media_links (platform, url, icon, sort_order) VALUES
('YouTube', 'https://youtube.com/@reclaimapp', 'youtube', 1),
('Instagram', 'https://instagram.com/reclaimapp', 'instagram', 2),
('Twitter', 'https://twitter.com/reclaimapp', 'twitter', 3),
('Facebook', 'https://facebook.com/reclaimapp', 'facebook', 4),
('TikTok', 'https://tiktok.com/@reclaimapp', 'music', 5);

-- =====================================================
-- 6. SAMPLE BLOG POSTS
-- =====================================================

INSERT INTO blog_posts (
  title, slug, excerpt, content, category_id, status, is_featured, 
  meta_title, meta_description, reading_time, published_at
) VALUES
(
  '5 Signs You''re Healing from Narcissistic Abuse',
  '5-signs-healing-narcissistic-abuse',
  'Recognizing the signs of healing is crucial for your recovery journey. Here are 5 key indicators that show you''re making progress.',
  '# 5 Signs You''re Healing from Narcissistic Abuse

Recovery from narcissistic abuse is a journey, not a destination. Here are five key signs that indicate you''re making real progress:

## 1. You''re Setting Boundaries
You''ve started saying "no" without feeling guilty. You recognize your limits and communicate them clearly.

## 2. You Trust Your Instincts Again
That inner voice that was silenced is speaking up again. You''re learning to trust your gut feelings.

## 3. You''re Rediscovering Your Identity
You''re remembering who you were before the abuse and exploring new aspects of yourself.

## 4. You Feel Emotions Without Shame
You''re allowing yourself to feel angry, sad, or hurt without immediately dismissing these emotions.

## 5. You''re Building Healthy Relationships
You''re attracting people who respect your boundaries and support your growth.

Remember, healing isn''t linear. Be patient with yourself as you continue this important journey.',
  (SELECT id FROM blog_categories WHERE slug = 'narcissistic-abuse'),
  'published',
  true,
  '5 Signs You''re Healing from Narcissistic Abuse | Reclaim Recovery',
  'Discover the key indicators that show you''re making progress in your recovery from narcissistic abuse. Learn to recognize healing signs.',
  4,
  NOW() - INTERVAL '2 days'
),
(
  'The Grey Rock Method: Your Shield Against Manipulation',
  'grey-rock-method-shield-manipulation',
  'Learn how the Grey Rock method can protect you from narcissistic manipulation and help you maintain your sanity in toxic relationships.',
  '# The Grey Rock Method: Your Shield Against Manipulation

The Grey Rock method is a powerful technique for dealing with narcissistic individuals when you can''t go no-contact.

## What is Grey Rock?
Grey Rock involves becoming as uninteresting as possible - like a grey rock - to avoid triggering narcissistic behavior.

## How to Use Grey Rock
- Keep responses short and factual
- Avoid sharing personal information
- Don''t react emotionally to provocations
- Be boring and predictable

## When to Use Grey Rock
- Co-parenting situations
- Workplace interactions
- Family gatherings
- Legal proceedings

## Practice Makes Perfect
Use our Grey Rock simulator in the Reclaim app to practice your responses in a safe environment.',
  (SELECT id FROM blog_categories WHERE slug = 'recovery-tips'),
  'published',
  false,
  'Grey Rock Method: Protect Yourself from Narcissistic Manipulation',
  'Master the Grey Rock technique to shield yourself from manipulation. Learn when and how to use this powerful protection strategy.',
  3,
  NOW() - INTERVAL '5 days'
);

-- =====================================================
-- 7. INDEXES AND CONSTRAINTS
-- =====================================================

CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_published ON blog_posts(published_at DESC) WHERE status = 'published';
CREATE INDEX idx_blog_posts_category ON blog_posts(category_id);
CREATE INDEX idx_blog_posts_featured ON blog_posts(is_featured) WHERE is_featured = true;
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);

-- =====================================================
-- 8. ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_media_links ENABLE ROW LEVEL SECURITY;

-- Public read access for published content
CREATE POLICY "Public read access to active categories" ON blog_categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public read access to tags" ON blog_tags
  FOR SELECT USING (true);

CREATE POLICY "Public read access to published posts" ON blog_posts
  FOR SELECT USING (status = 'published');

CREATE POLICY "Public read access to post tags" ON blog_post_tags
  FOR SELECT USING (true);

CREATE POLICY "Public read access to active social links" ON social_media_links
  FOR SELECT USING (is_active = true);

-- =====================================================
-- 9. FUNCTIONS
-- =====================================================

-- Function to increment view count
CREATE OR REPLACE FUNCTION increment_post_views(post_slug TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE blog_posts 
  SET view_count = view_count + 1 
  WHERE slug = post_slug AND status = 'published';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get related posts
CREATE OR REPLACE FUNCTION get_related_posts(post_id UUID, limit_count INTEGER DEFAULT 3)
RETURNS TABLE (
  id UUID,
  title TEXT,
  slug TEXT,
  excerpt TEXT,
  featured_image TEXT,
  published_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT 
    bp.id,
    bp.title,
    bp.slug,
    bp.excerpt,
    bp.featured_image,
    bp.published_at
  FROM blog_posts bp
  JOIN blog_post_tags bpt1 ON bp.id = bpt1.post_id
  JOIN blog_post_tags bpt2 ON bpt1.tag_id = bpt2.tag_id
  WHERE bpt2.post_id = get_related_posts.post_id
    AND bp.id != get_related_posts.post_id
    AND bp.status = 'published'
  ORDER BY bp.published_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;