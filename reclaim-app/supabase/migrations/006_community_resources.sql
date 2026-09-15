-- Community resources table for admin-managed content
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS community_resources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  link TEXT,
  category TEXT NOT NULL DEFAULT 'general' CHECK (category IN ('crisis', 'reading', 'tools', 'external', 'general')),
  icon TEXT DEFAULT 'link',
  color TEXT DEFAULT 'gray',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_community_resources_category ON community_resources(category);
CREATE INDEX IF NOT EXISTS idx_community_resources_active ON community_resources(is_active) WHERE is_active = TRUE;

ALTER TABLE community_resources ENABLE ROW LEVEL SECURITY;

-- Anyone can read active resources
CREATE POLICY "Public read active resources" ON community_resources
  FOR SELECT USING (is_active = TRUE);

-- Admins can manage (service role)
CREATE POLICY "Service role manages resources" ON community_resources
  FOR ALL USING (true);

-- Seed default resources
INSERT INTO community_resources (title, description, link, category, icon, color, sort_order) VALUES
  ('Crisis Toolkit', 'Grounding exercises, coping tools, and safety plans for difficult moments.', '/crisis-toolkit', 'crisis', 'shield', 'red', 1),
  ('National Suicide Prevention Lifeline', '988 (call or text)', NULL, 'crisis', 'phone', 'red', 2),
  ('Crisis Text Line', 'Text HOME to 741741', NULL, 'crisis', 'message', 'red', 3),
  ('National Domestic Violence Hotline', '1-800-799-7233', NULL, 'crisis', 'phone', 'red', 4),
  ('Why Does He Do That?', 'by Lundy Bancroft', NULL, 'reading', 'book', 'blue', 5),
  ('The Verbally Abusive Relationship', 'by Patricia Evans', NULL, 'reading', 'book', 'blue', 6),
  ('Whole Again', 'by Jackson MacKenzie', NULL, 'reading', 'book', 'blue', 7),
  ('Psychopath Free', 'by Jackson MacKenzie', NULL, 'reading', 'book', 'blue', 8),
  ('Set Boundaries, Find Peace', 'by Nedra Glover Tawwab', NULL, 'reading', 'book', 'blue', 9),
  ('No Contact Anchor', 'Track your no-contact journey', '/no-contact-anchor', 'tools', 'anchor', 'green', 10),
  ('Reality Check Journal', 'Document gaslighting and reality', '/gaslighting-reality-check', 'tools', 'check', 'green', 11),
  ('Mind Reset Exercises', 'Rewire toxic thought patterns', '/mind-reset', 'tools', 'brain', 'green', 12),
  ('Crisis Reframe AI', 'AI-powered crisis support', '/crisis-reframe', 'tools', 'sparkles', 'green', 13)
ON CONFLICT DO NOTHING;
