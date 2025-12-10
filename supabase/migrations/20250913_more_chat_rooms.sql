-- Add more themed chat rooms for trauma recovery

INSERT INTO community_chat_rooms (name, description, category, max_participants, level_required, is_active) VALUES
  -- Level 1 rooms (beginner-friendly)
  ('New Here', 'Safe space for newcomers to introduce themselves and ask questions', 'support', 20, 1, true),
  ('Daily Check-In', 'Share how you''re feeling today - no judgment, just support', 'support', 25, 1, true),
  
  -- Level 2 rooms (active members)
  ('No Contact Support', 'Strategies and support for maintaining no contact', 'strategies', 15, 2, true),
  ('Self-Care Corner', 'Share self-care tips, routines, and celebrate small wins', 'healing', 18, 2, true),
  ('Boundary Builders', 'Learn and practice setting healthy boundaries', 'strategies', 15, 2, true),
  
  -- Level 3 rooms (trusted members)
  ('Divorce & Legal', 'Navigate divorce, custody, and legal matters with narcissists', 'parenting', 12, 3, true),
  ('Workplace Narcissism', 'Dealing with narcissistic bosses, coworkers, and toxic work environments', 'strategies', 15, 3, true),
  ('Family Estrangement', 'Support for those who''ve gone no contact with family', 'healing', 12, 3, true),
  
  -- Level 4 rooms (experienced members)
  ('Dating After Abuse', 'Rebuilding trust and dating after narcissistic relationships', 'healing', 12, 4, true),
  ('Financial Recovery', 'Rebuilding finances after financial abuse', 'strategies', 10, 4, true),
  
  -- Weekend/Time-specific rooms
  ('Weekend Warriors', 'Weekend support when things feel harder', 'support', 20, 1, true),
  ('Morning Motivation', 'Start your day with positivity and encouragement', 'support', 15, 1, true)
ON CONFLICT DO NOTHING;
