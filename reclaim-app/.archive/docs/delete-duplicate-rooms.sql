-- Delete duplicate chat rooms, keeping only the oldest one for each name
DELETE FROM community_chat_rooms
WHERE id IN (
  SELECT id FROM (
    SELECT id, ROW_NUMBER() OVER (PARTITION BY name ORDER BY created_at) as rn
    FROM community_chat_rooms
  ) t
  WHERE rn > 1
);

-- Verify - should show 6 unique rooms
SELECT name, COUNT(*) as count
FROM community_chat_rooms
GROUP BY name
ORDER BY name;
