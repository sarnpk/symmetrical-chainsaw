-- Temporarily disable badge trigger to fix posting

DROP TRIGGER IF EXISTS trigger_check_badges ON community_user_stats;

-- You can manually award badges later or we'll fix the trigger properly
