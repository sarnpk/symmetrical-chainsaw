-- Fix badge trigger to handle room messages correctly

CREATE OR REPLACE FUNCTION check_and_award_badges()
RETURNS TRIGGER AS $$
BEGIN
  -- NEW is the updated row from community_user_stats table
  -- It already has all the stats we need

  -- Award badges based on milestones (NEW = updated stats row)
  IF NEW.posts_count = 1 THEN
    INSERT INTO community_user_badges (user_id, badge_id) VALUES (NEW.user_id, 'first_post') ON CONFLICT DO NOTHING;
  END IF;

  IF NEW.comments_count = 1 THEN
    INSERT INTO community_user_badges (user_id, badge_id) VALUES (NEW.user_id, 'first_comment') ON CONFLICT DO NOTHING;
  END IF;

  IF NEW.posts_count >= 10 THEN
    INSERT INTO community_user_badges (user_id, badge_id) VALUES (NEW.user_id, 'story_sharer') ON CONFLICT DO NOTHING;
  END IF;

  IF NEW.comments_count >= 50 THEN
    INSERT INTO community_user_badges (user_id, badge_id) VALUES (NEW.user_id, 'active_listener') ON CONFLICT DO NOTHING;
  END IF;

  IF NEW.likes_given >= 25 THEN
    INSERT INTO community_user_badges (user_id, badge_id) VALUES (NEW.user_id, 'supportive_friend') ON CONFLICT DO NOTHING;
  END IF;

  IF NEW.likes_received >= 50 THEN
    INSERT INTO community_user_badges (user_id, badge_id) VALUES (NEW.user_id, 'healing_guide') ON CONFLICT DO NOTHING;
  END IF;

  IF NEW.level >= 5 THEN
    INSERT INTO community_user_badges (user_id, badge_id) VALUES (NEW.user_id, 'community_pillar') ON CONFLICT DO NOTHING;
  END IF;

  IF NEW.current_streak >= 7 THEN
    INSERT INTO community_user_badges (user_id, badge_id) VALUES (NEW.user_id, 'week_streak') ON CONFLICT DO NOTHING;
  END IF;

  IF NEW.current_streak >= 30 THEN
    INSERT INTO community_user_badges (user_id, badge_id) VALUES (NEW.user_id, 'month_streak') ON CONFLICT DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
