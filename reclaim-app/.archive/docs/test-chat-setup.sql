-- Test Chat Setup for User: a580b1b2-d87c-4ba9-8e6d-31e74580d6c3
-- Run this in Supabase SQL Editor

-- Create 3 test users
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'testuser1@example.com', crypt('password123', gen_salt('bf')), now(), now(), now()),
  ('22222222-2222-2222-2222-222222222222', 'testuser2@example.com', crypt('password123', gen_salt('bf')), now(), now(), now()),
  ('33333333-3333-3333-3333-333333333333', 'testuser3@example.com', crypt('password123', gen_salt('bf')), now(), now(), now())
ON CONFLICT (id) DO NOTHING;

-- Create profiles for test users
INSERT INTO public.profiles (id, email, chat_enabled, created_at, updated_at)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'testuser1@example.com', true, now(), now()),
  ('22222222-2222-2222-2222-222222222222', 'testuser2@example.com', true, now(), now()),
  ('33333333-3333-3333-3333-333333333333', 'testuser3@example.com', true, now(), now())
ON CONFLICT (id) DO UPDATE SET chat_enabled = true;

-- Ensure main user has chat enabled
UPDATE public.profiles 
SET chat_enabled = true 
WHERE id = 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3';

-- Create test posts for mutual interaction
INSERT INTO public.community_posts (id, author_id, title, content, is_anonymous, category, created_at)
VALUES 
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'My first post', 'Hello community!', false, 'general', now() - interval '2 days'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'Test User 1 Post', 'Hi everyone!', false, 'recovery', now() - interval '1 day'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '22222222-2222-2222-2222-222222222222', 'Test User 2 Post', 'Sharing my story', false, 'healing', now() - interval '1 day'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', '33333333-3333-3333-3333-333333333333', 'Test User 3 Post', 'Looking for support', false, 'strategies', now() - interval '1 day')
ON CONFLICT (id) DO NOTHING;

-- Create mutual likes (main user likes test users' posts)
INSERT INTO public.community_likes (post_id, user_id, created_at)
VALUES 
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', now() - interval '1 day'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', now() - interval '1 day'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', now() - interval '1 day')
ON CONFLICT (post_id, user_id) DO NOTHING;

-- Create mutual likes (test users like main user's post)
INSERT INTO public.community_likes (post_id, user_id, created_at)
VALUES 
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', now() - interval '1 day'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', now() - interval '1 day'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333', now() - interval '1 day')
ON CONFLICT (post_id, user_id) DO NOTHING;

-- Create conversations
INSERT INTO public.community_conversations (id, created_at, updated_at)
VALUES 
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', now() - interval '2 hours', now()),
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', now() - interval '1 hour', now()),
  ('99999999-9999-9999-9999-999999999999', now() - interval '30 minutes', now())
ON CONFLICT (id) DO NOTHING;

-- Add participants to conversations
INSERT INTO public.community_conversation_participants (conversation_id, user_id, joined_at, last_read_at)
VALUES 
  -- Conversation 1: Main user + Test User 1
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', now() - interval '2 hours', now() - interval '10 minutes'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '11111111-1111-1111-1111-111111111111', now() - interval '2 hours', now() - interval '5 minutes'),
  
  -- Conversation 2: Main user + Test User 2
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', now() - interval '1 hour', now() - interval '15 minutes'),
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', '22222222-2222-2222-2222-222222222222', now() - interval '1 hour', now() - interval '3 minutes'),
  
  -- Conversation 3: Main user + Test User 3
  ('99999999-9999-9999-9999-999999999999', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', now() - interval '30 minutes', now() - interval '2 minutes'),
  ('99999999-9999-9999-9999-999999999999', '33333333-3333-3333-3333-333333333333', now() - interval '30 minutes', now() - interval '1 minute')
ON CONFLICT (conversation_id, user_id) DO NOTHING;

-- Add messages to conversations
INSERT INTO public.community_messages (id, conversation_id, sender_id, content, created_at)
VALUES 
  -- Conversation 1 messages
  ('10000000-0000-0000-0000-000000000001', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '11111111-1111-1111-1111-111111111111', 'Hi! I saw your post and wanted to reach out.', now() - interval '2 hours'),
  ('10000000-0000-0000-0000-000000000002', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'Thank you! How are you doing?', now() - interval '1 hour 50 minutes'),
  ('10000000-0000-0000-0000-000000000003', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '11111111-1111-1111-1111-111111111111', 'I''m doing better each day. Your story really resonated with me.', now() - interval '1 hour 45 minutes'),
  ('10000000-0000-0000-0000-000000000004', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'That means a lot. We''re all in this together!', now() - interval '1 hour 40 minutes'),
  ('10000000-0000-0000-0000-000000000005', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '11111111-1111-1111-1111-111111111111', 'Absolutely! Feel free to message anytime.', now() - interval '1 hour 30 minutes'),
  
  -- Conversation 2 messages
  ('20000000-0000-0000-0000-000000000001', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'Hey! I loved your post about healing.', now() - interval '1 hour'),
  ('20000000-0000-0000-0000-000000000002', 'ffffffff-ffff-ffff-ffff-ffffffffffff', '22222222-2222-2222-2222-222222222222', 'Thank you so much! It''s been a journey.', now() - interval '55 minutes'),
  ('20000000-0000-0000-0000-000000000003', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'I can relate. Some days are harder than others.', now() - interval '50 minutes'),
  ('20000000-0000-0000-0000-000000000004', 'ffffffff-ffff-ffff-ffff-ffffffffffff', '22222222-2222-2222-2222-222222222222', 'Exactly! But we keep moving forward.', now() - interval '45 minutes'),
  ('20000000-0000-0000-0000-000000000005', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'That''s the spirit! 💪', now() - interval '40 minutes'),
  ('20000000-0000-0000-0000-000000000006', 'ffffffff-ffff-ffff-ffff-ffffffffffff', '22222222-2222-2222-2222-222222222222', 'Have you tried the grey rock method?', now() - interval '20 minutes'),
  ('20000000-0000-0000-0000-000000000007', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'Yes! It''s been really helpful for me.', now() - interval '15 minutes'),
  
  -- Conversation 3 messages
  ('30000000-0000-0000-0000-000000000001', '99999999-9999-9999-9999-999999999999', '33333333-3333-3333-3333-333333333333', 'Hi there! Just wanted to say your post helped me today.', now() - interval '30 minutes'),
  ('30000000-0000-0000-0000-000000000002', '99999999-9999-9999-9999-999999999999', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'I''m so glad! That''s why I share my story.', now() - interval '25 minutes'),
  ('30000000-0000-0000-0000-000000000003', '99999999-9999-9999-9999-999999999999', '33333333-3333-3333-3333-333333333333', 'It really makes a difference knowing others understand.', now() - interval '20 minutes'),
  ('30000000-0000-0000-0000-000000000004', '99999999-9999-9999-9999-999999999999', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'Absolutely. You''re not alone in this.', now() - interval '15 minutes'),
  ('30000000-0000-0000-0000-000000000005', '99999999-9999-9999-9999-999999999999', '33333333-3333-3333-3333-333333333333', 'Thank you. That means more than you know.', now() - interval '10 minutes'),
  ('30000000-0000-0000-0000-000000000006', '99999999-9999-9999-9999-999999999999', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'Anytime! Feel free to reach out whenever you need support.', now() - interval '5 minutes'),
  ('30000000-0000-0000-0000-000000000007', '99999999-9999-9999-9999-999999999999', '33333333-3333-3333-3333-333333333333', 'I will. Thank you so much! 🙏', now() - interval '2 minutes')
ON CONFLICT (id) DO NOTHING;

-- Verify setup
SELECT 
  'Setup Complete!' as status,
  (SELECT COUNT(*) FROM public.community_conversations WHERE id IN ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'ffffffff-ffff-ffff-ffff-ffffffffffff', '99999999-9999-9999-9999-999999999999')) as conversations_created,
  (SELECT COUNT(*) FROM public.community_messages WHERE conversation_id IN ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'ffffffff-ffff-ffff-ffff-ffffffffffff', '99999999-9999-9999-9999-999999999999')) as messages_created;
