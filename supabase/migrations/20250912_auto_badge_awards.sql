-- Auto-award badges when users hit milestones

-- Function to check and award badges
CREATE OR REPLACE FUNCTION check_and_award_badges()
RETURNS TRIGGER AS $$
DECLARE
  user_stats RECORD;
BEGIN
  -- Get user's current stats
  SELECT * INTO user_stats
  FROM community_user_stats
  WHERE user_id = COALESCE(NEW.author_id, NEW.user_id);

  IF user_stats IS NULL THEN
    RETURN NEW;
  END IF;

  -- Award "First Steps" badge (first post)
  IF user_stats.posts_count = 1 THEN
    INSERT INTO community_user_badges (user_id, badge_id)
    VALUES (user_stats.user_id, 'first_post')
    ON CONFLICT DO NOTHING;
  END IF;

  -- Award "First Comment" badge
  IF user_stats.comments_count = 1 THEN
    INSERT INTO community_user_badges (user_id, badge_id)
    VALUES (user_stats.user_id, 'first_comment')
    ON CONFLICT DO NOTHING;
  END IF;

  -- Award "Story Sharer" badge (10 posts)
  IF user_stats.posts_count >= 10 THEN
    INSERT INTO community_user_badges (user_id, badge_id)
    VALUES (user_stats.user_id, 'story_sharer')
    ON CONFLICT DO NOTHING;
  END IF;

  -- Award "Active Listener" badge (50 comments)
  IF user_stats.comments_count >= 50 THEN
    INSERT INTO community_user_badges (user_id, badge_id)
    VALUES (user_stats.user_id, 'active_listener')
    ON CONFLICT DO NOTHING;
  END IF;

  -- Award "Supportive Friend" badge (25 likes given)
  IF user_stats.likes_given >= 25 THEN
    INSERT INTO community_user_badges (user_id, badge_id)
    VALUES (user_stats.user_id, 'supportive_friend')
    ON CONFLICT DO NOTHING;
  END IF;

  -- Award "Healing Guide" badge (50 likes received)
  IF user_stats.likes_received >= 50 THEN
    INSERT INTO community_user_badges (user_id, badge_id)
    VALUES (user_stats.user_id, 'healing_guide')
    ON CONFLICT DO NOTHING;
  END IF;

  -- Award "Community Pillar" badge (level 5)
  IF user_stats.level >= 5 THEN
    INSERT INTO community_user_badges (user_id, badge_id)
    VALUES (user_stats.user_id, 'community_pillar')
    ON CONFLICT DO NOTHING;
  END IF;

  -- Award "7-Day Warrior" badge (7 day streak)
  IF user_stats.current_streak >= 7 THEN
    INSERT INTO community_user_badges (user_id, badge_id)
    VALUES (user_stats.user_id, 'week_streak')
    ON CONFLICT DO NOTHING;
  END IF;

  -- Award "30-Day Champion" badge (30 day streak)
  IF user_stats.current_streak >= 30 THEN
    INSERT INTO community_user_badges (user_id, badge_id)
    VALUES (user_stats.user_id, 'month_streak')
    ON CONFLICT DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to check badges after stats update
DROP TRIGGER IF EXISTS trigger_check_badges ON community_user_stats;
CREATE TRIGGER trigger_check_badges
AFTER UPDATE ON community_user_stats
FOR EACH ROW EXECUTE FUNCTION check_and_award_badges();

-- RLS policy for auto-awarding badges
DROP POLICY IF EXISTS user_badges_insert_auto ON community_user_badges;
CREATE POLICY user_badges_insert_auto ON community_user_badges
FOR INSERT WITH CHECK (true);
