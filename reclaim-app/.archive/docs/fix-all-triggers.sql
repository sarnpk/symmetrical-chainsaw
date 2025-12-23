-- Fix ALL triggers to handle different table structures

-- Drop all existing triggers
DROP TRIGGER IF EXISTS trigger_update_stats_posts ON community_posts;
DROP TRIGGER IF EXISTS trigger_update_stats_comments ON community_comments;
DROP TRIGGER IF EXISTS trigger_update_stats_likes ON community_likes;
DROP TRIGGER IF EXISTS trigger_update_stats_messages ON community_room_messages;
DROP TRIGGER IF EXISTS trigger_check_badges ON community_user_stats;

-- Recreate update_user_stats function with proper column handling
CREATE OR REPLACE FUNCTION update_user_stats()
RETURNS TRIGGER AS $$
DECLARE
  target_user_id UUID;
BEGIN
  -- Determine user_id based on table and available columns
  IF TG_TABLE_NAME = 'community_posts' THEN
    target_user_id := NEW.author_id;
    -- Initialize stats if not exists
    INSERT INTO community_user_stats (user_id) VALUES (target_user_id) ON CONFLICT (user_id) DO NOTHING;
    UPDATE community_user_stats SET posts_count = posts_count + 1, points = points + 10, updated_at = NOW() WHERE user_id = target_user_id;
    
  ELSIF TG_TABLE_NAME = 'community_comments' THEN
    target_user_id := NEW.author_id;
    INSERT INTO community_user_stats (user_id) VALUES (target_user_id) ON CONFLICT (user_id) DO NOTHING;
    UPDATE community_user_stats SET comments_count = comments_count + 1, points = points + 5, updated_at = NOW() WHERE user_id = target_user_id;
    
  ELSIF TG_TABLE_NAME = 'community_likes' THEN
    target_user_id := NEW.user_id;
    INSERT INTO community_user_stats (user_id) VALUES (target_user_id) ON CONFLICT (user_id) DO NOTHING;
    UPDATE community_user_stats SET likes_given = likes_given + 1, points = points + 1, updated_at = NOW() WHERE user_id = target_user_id;
    
  ELSIF TG_TABLE_NAME = 'community_room_messages' THEN
    target_user_id := NEW.user_id;
    INSERT INTO community_user_stats (user_id) VALUES (target_user_id) ON CONFLICT (user_id) DO NOTHING;
    UPDATE community_user_stats SET messages_sent = messages_sent + 1, points = points + 2, updated_at = NOW() WHERE user_id = target_user_id;
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
  WHERE user_id = target_user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate triggers
CREATE TRIGGER trigger_update_stats_posts
AFTER INSERT ON community_posts
FOR EACH ROW EXECUTE FUNCTION update_user_stats();

CREATE TRIGGER trigger_update_stats_comments
AFTER INSERT ON community_comments
FOR EACH ROW EXECUTE FUNCTION update_user_stats();

CREATE TRIGGER trigger_update_stats_likes
AFTER INSERT ON community_likes
FOR EACH ROW EXECUTE FUNCTION update_user_stats();

CREATE TRIGGER trigger_update_stats_messages
AFTER INSERT ON community_room_messages
FOR EACH ROW EXECUTE FUNCTION update_user_stats();
