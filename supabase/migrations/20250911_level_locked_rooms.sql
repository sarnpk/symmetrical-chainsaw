-- Add level requirements to chat rooms

-- Add level_required column
ALTER TABLE community_chat_rooms 
ADD COLUMN IF NOT EXISTS level_required INTEGER DEFAULT 1;

-- Update existing rooms with level requirements
UPDATE community_chat_rooms SET level_required = 1 WHERE name = 'Late Night Support';
UPDATE community_chat_rooms SET level_required = 1 WHERE name = 'Just Venting';
UPDATE community_chat_rooms SET level_required = 2 WHERE name = 'Healing Journey';
UPDATE community_chat_rooms SET level_required = 2 WHERE name = 'Anxiety Relief';
UPDATE community_chat_rooms SET level_required = 3 WHERE name = 'Parent Warriors';
UPDATE community_chat_rooms SET level_required = 3 WHERE name = 'PTSD Support';

-- Add exclusive high-level rooms
INSERT INTO community_chat_rooms (name, description, category, max_participants, level_required, is_active) VALUES
  ('VIP Lounge', 'Exclusive space for Level 5+ members - share advanced strategies', 'special', 10, 5, true),
  ('Mentors Circle', 'Level 7+ members helping newcomers - give back to the community', 'support', 8, 7, true),
  ('Champions Hall', 'Elite Level 10 members only - celebrate your journey', 'milestone', 5, 10, true)
ON CONFLICT DO NOTHING;
