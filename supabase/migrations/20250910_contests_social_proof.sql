-- Monthly contests and social proof system

-- Monthly contests (e.g., "Most Helpful Member")
CREATE TABLE IF NOT EXISTS community_contests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  prize TEXT NOT NULL, -- e.g., "3-Month Premium Subscription"
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  winner_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  redeem_code TEXT, -- Generated code for winner
  status TEXT DEFAULT 'active', -- 'active', 'ended', 'claimed'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contest entries (track who's participating)
CREATE TABLE IF NOT EXISTS community_contest_entries (
  contest_id UUID REFERENCES community_contests(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  score INTEGER DEFAULT 0, -- Calculated based on helpful content
  helpful_posts INTEGER DEFAULT 0,
  helpful_comments INTEGER DEFAULT 0,
  total_likes_received INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (contest_id, user_id)
);

-- Social proof events (for viral notifications)
CREATE TABLE IF NOT EXISTS community_social_proof (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL, -- 'user_joined', 'post_created', 'milestone_reached', 'badge_earned'
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  metadata JSONB, -- Extra data like post_id, badge_id, etc.
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leaderboard (top contributors)
CREATE OR REPLACE VIEW community_leaderboard AS
SELECT 
  s.user_id,
  p.email,
  s.level,
  s.points,
  s.posts_count,
  s.comments_count,
  s.likes_received,
  s.current_streak,
  ROW_NUMBER() OVER (ORDER BY s.points DESC) as rank
FROM community_user_stats s
JOIN profiles p ON p.id = s.user_id
ORDER BY s.points DESC
LIMIT 100;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_contests_status ON community_contests(status, end_date);
CREATE INDEX IF NOT EXISTS idx_contest_entries_score ON community_contest_entries(contest_id, score DESC);
CREATE INDEX IF NOT EXISTS idx_social_proof_created ON community_social_proof(created_at DESC);

-- RLS Policies
ALTER TABLE community_contests ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_contest_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_social_proof ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS contests_read_all ON community_contests;
DROP POLICY IF EXISTS contest_entries_read_all ON community_contest_entries;
DROP POLICY IF EXISTS social_proof_read_all ON community_social_proof;

-- Anyone can view active contests
CREATE POLICY contests_read_all ON community_contests
FOR SELECT USING (true);

-- Anyone can view contest entries (for leaderboard)
CREATE POLICY contest_entries_read_all ON community_contest_entries
FOR SELECT USING (true);

-- Anyone can view social proof events
CREATE POLICY social_proof_read_all ON community_social_proof
FOR SELECT USING (true);

-- Function to update contest scores
CREATE OR REPLACE FUNCTION update_contest_scores()
RETURNS TRIGGER AS $$
DECLARE
  active_contest_id UUID;
  post_author_id UUID;
BEGIN
  -- Get active contest
  SELECT id INTO active_contest_id
  FROM community_contests
  WHERE status = 'active'
    AND CURRENT_DATE BETWEEN start_date AND end_date
  LIMIT 1;

  IF active_contest_id IS NULL THEN
    RETURN NEW;
  END IF;

  -- Handle likes (increase score for post author)
  IF TG_TABLE_NAME = 'community_likes' THEN
    -- Get post author
    SELECT author_id INTO post_author_id
    FROM community_posts
    WHERE id = NEW.post_id;

    IF post_author_id IS NOT NULL THEN
      -- Update contest entry for post author
      INSERT INTO community_contest_entries (contest_id, user_id, total_likes_received, score)
      VALUES (active_contest_id, post_author_id, 1, 2)
      ON CONFLICT (contest_id, user_id)
      DO UPDATE SET
        total_likes_received = community_contest_entries.total_likes_received + 1,
        score = community_contest_entries.score + 2,
        updated_at = NOW();
    END IF;
  END IF;

  -- Handle posts
  IF TG_TABLE_NAME = 'community_posts' THEN
    INSERT INTO community_contest_entries (contest_id, user_id, helpful_posts, score)
    VALUES (active_contest_id, NEW.author_id, 1, 5)
    ON CONFLICT (contest_id, user_id)
    DO UPDATE SET
      helpful_posts = community_contest_entries.helpful_posts + 1,
      score = community_contest_entries.score + 5,
      updated_at = NOW();
  END IF;

  -- Handle comments
  IF TG_TABLE_NAME = 'community_comments' THEN
    INSERT INTO community_contest_entries (contest_id, user_id, helpful_comments, score)
    VALUES (active_contest_id, NEW.author_id, 1, 3)
    ON CONFLICT (contest_id, user_id)
    DO UPDATE SET
      helpful_comments = community_contest_entries.helpful_comments + 1,
      score = community_contest_entries.score + 3,
      updated_at = NOW();
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for contest scoring
DROP TRIGGER IF EXISTS trigger_contest_posts ON community_posts;
CREATE TRIGGER trigger_contest_posts
AFTER INSERT ON community_posts
FOR EACH ROW EXECUTE FUNCTION update_contest_scores();

DROP TRIGGER IF EXISTS trigger_contest_comments ON community_comments;
CREATE TRIGGER trigger_contest_comments
AFTER INSERT ON community_comments
FOR EACH ROW EXECUTE FUNCTION update_contest_scores();

DROP TRIGGER IF EXISTS trigger_contest_likes ON community_likes;
CREATE TRIGGER trigger_contest_likes
AFTER INSERT ON community_likes
FOR EACH ROW EXECUTE FUNCTION update_contest_scores();

-- Insert current month's contest
INSERT INTO community_contests (title, description, prize, start_date, end_date, status)
VALUES (
  'Most Helpful Member - January 2025',
  'Share helpful content, support others, and win a 3-month Premium subscription! Top contributor wins.',
  '3-Month Premium Subscription',
  DATE_TRUNC('month', CURRENT_DATE),
  DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day',
  'active'
)
ON CONFLICT DO NOTHING;

-- Add likes_received tracking to user stats
ALTER TABLE community_user_stats 
ADD COLUMN IF NOT EXISTS likes_received INTEGER DEFAULT 0;

-- Function to track likes received
CREATE OR REPLACE FUNCTION track_likes_received()
RETURNS TRIGGER AS $$
DECLARE
  post_author_id UUID;
BEGIN
  -- Get post author
  SELECT author_id INTO post_author_id
  FROM community_posts
  WHERE id = NEW.post_id;

  IF post_author_id IS NOT NULL THEN
    UPDATE community_user_stats
    SET likes_received = likes_received + 1
    WHERE user_id = post_author_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_track_likes_received ON community_likes;
CREATE TRIGGER trigger_track_likes_received
AFTER INSERT ON community_likes
FOR EACH ROW EXECUTE FUNCTION track_likes_received();
