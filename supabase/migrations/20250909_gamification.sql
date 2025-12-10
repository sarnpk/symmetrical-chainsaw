-- Gamification system for community engagement

-- User stats and levels
CREATE TABLE IF NOT EXISTS community_user_stats (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  level INTEGER DEFAULT 1,
  points INTEGER DEFAULT 0,
  posts_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  likes_given INTEGER DEFAULT 0,
  likes_received INTEGER DEFAULT 0,
  messages_sent INTEGER DEFAULT 0,
  days_active INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_active_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Badges/Achievements
CREATE TABLE IF NOT EXISTS community_badges (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL, -- emoji or icon name
  category TEXT NOT NULL, -- 'engagement', 'support', 'milestone', 'special'
  points_required INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User badges (earned achievements)
CREATE TABLE IF NOT EXISTS community_user_badges (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  badge_id TEXT REFERENCES community_badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, badge_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_stats_level ON community_user_stats(level DESC);
CREATE INDEX IF NOT EXISTS idx_user_stats_points ON community_user_stats(points DESC);
CREATE INDEX IF NOT EXISTS idx_user_badges_user ON community_user_badges(user_id);

-- RLS Policies
ALTER TABLE community_user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_user_badges ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS user_stats_read_all ON community_user_stats;
DROP POLICY IF EXISTS user_stats_update_own ON community_user_stats;
DROP POLICY IF EXISTS badges_read_all ON community_badges;
DROP POLICY IF EXISTS user_badges_read_all ON community_user_badges;

-- Anyone can view stats (for leaderboard)
CREATE POLICY user_stats_read_all ON community_user_stats
FOR SELECT USING (true);

-- Users can update their own stats
CREATE POLICY user_stats_update_own ON community_user_stats
FOR ALL USING (auth.uid() = user_id);

-- Anyone can view available badges
CREATE POLICY badges_read_all ON community_badges
FOR SELECT USING (true);

-- Anyone can view earned badges
CREATE POLICY user_badges_read_all ON community_user_badges
FOR SELECT USING (true);

-- Insert default badges
INSERT INTO community_badges (id, name, description, icon, category, points_required) VALUES
  ('first_post', 'First Steps', 'Created your first post', '🌱', 'milestone', 0),
  ('first_comment', 'Voice Heard', 'Left your first comment', '💬', 'milestone', 0),
  ('week_streak', '7-Day Warrior', 'Active for 7 days in a row', '🔥', 'engagement', 50),
  ('month_streak', '30-Day Champion', 'Active for 30 days in a row', '⭐', 'engagement', 200),
  ('supportive_friend', 'Supportive Friend', 'Gave 25 likes to others', '❤️', 'support', 25),
  ('story_sharer', 'Story Sharer', 'Shared 10 posts', '📖', 'engagement', 100),
  ('active_listener', 'Active Listener', 'Left 50 comments', '👂', 'support', 150),
  ('community_pillar', 'Community Pillar', 'Reached level 5', '🏆', 'milestone', 500),
  ('night_owl', 'Night Owl', 'Active in Late Night Support room', '🦉', 'special', 0),
  ('healing_guide', 'Healing Guide', 'Helped 10 people (received 50 likes)', '✨', 'support', 250)
ON CONFLICT (id) DO NOTHING;

-- Function to update user stats
CREATE OR REPLACE FUNCTION update_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Initialize stats if not exists
  INSERT INTO community_user_stats (user_id)
  VALUES (NEW.user_id)
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Update based on action type
  IF TG_TABLE_NAME = 'community_posts' THEN
    UPDATE community_user_stats
    SET posts_count = posts_count + 1,
        points = points + 10,
        updated_at = NOW()
    WHERE user_id = NEW.author_id;
  ELSIF TG_TABLE_NAME = 'community_comments' THEN
    UPDATE community_user_stats
    SET comments_count = comments_count + 1,
        points = points + 5,
        updated_at = NOW()
    WHERE user_id = NEW.author_id;
  ELSIF TG_TABLE_NAME = 'community_likes' THEN
    UPDATE community_user_stats
    SET likes_given = likes_given + 1,
        points = points + 1,
        updated_at = NOW()
    WHERE user_id = NEW.user_id;
  ELSIF TG_TABLE_NAME = 'community_room_messages' THEN
    UPDATE community_user_stats
    SET messages_sent = messages_sent + 1,
        points = points + 2,
        updated_at = NOW()
    WHERE user_id = NEW.user_id;
  END IF;
  
  -- Update level based on points
  UPDATE community_user_stats
  SET level = CASE
    WHEN points >= 1000 THEN 10
    WHEN points >= 500 THEN 5
    WHEN points >= 250 THEN 4
    WHEN points >= 100 THEN 3
    WHEN points >= 50 THEN 2
    ELSE 1
  END
  WHERE user_id = COALESCE(NEW.author_id, NEW.user_id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for auto-updating stats
DROP TRIGGER IF EXISTS trigger_update_stats_posts ON community_posts;
CREATE TRIGGER trigger_update_stats_posts
AFTER INSERT ON community_posts
FOR EACH ROW EXECUTE FUNCTION update_user_stats();

DROP TRIGGER IF EXISTS trigger_update_stats_comments ON community_comments;
CREATE TRIGGER trigger_update_stats_comments
AFTER INSERT ON community_comments
FOR EACH ROW EXECUTE FUNCTION update_user_stats();

DROP TRIGGER IF EXISTS trigger_update_stats_likes ON community_likes;
CREATE TRIGGER trigger_update_stats_likes
AFTER INSERT ON community_likes
FOR EACH ROW EXECUTE FUNCTION update_user_stats();

DROP TRIGGER IF EXISTS trigger_update_stats_messages ON community_room_messages;
CREATE TRIGGER trigger_update_stats_messages
AFTER INSERT ON community_room_messages
FOR EACH ROW EXECUTE FUNCTION update_user_stats();
