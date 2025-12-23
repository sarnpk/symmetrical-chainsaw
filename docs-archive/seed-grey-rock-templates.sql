-- Seed Grey Rock Templates
INSERT INTO grey_rock_templates (category, situation, template_text, variations, when_to_use, tone) VALUES
('Co-Parenting', 'Pickup/Dropoff Time', 'I''ll be there at 3pm.', ARRAY['See you at 3pm.', 'Arriving at 3pm.'], 'When confirming pickup/dropoff times', 'brief'),
('Co-Parenting', 'Schedule Change Request', 'That doesn''t work for me.', ARRAY['I''m not available then.', 'That time doesn''t work.'], 'When they request a schedule change', 'neutral'),
('Co-Parenting', 'Child Update Request', 'She''s doing fine.', ARRAY['He''s fine.', 'Everything is fine.'], 'When they ask how child is doing', 'brief'),
('Work/Professional', 'Personal Question', 'I prefer to keep work and personal separate.', ARRAY['I don''t discuss personal matters at work.'], 'When coworker asks personal questions', 'formal'),
('Work/Professional', 'After-Hours Contact', 'I''ll respond during business hours.', ARRAY['I''ll get back to you tomorrow.'], 'When contacted outside work hours', 'formal'),
('Family Events', 'Holiday Plans', 'I haven''t decided yet.', ARRAY['I''ll let you know.', 'Still figuring it out.'], 'When asked about holiday plans', 'neutral'),
('Family Events', 'Invitation Decline', 'I won''t be able to make it.', ARRAY['I can''t attend.', 'I have other plans.'], 'Declining family event invitation', 'neutral'),
('Boundaries', 'Unsolicited Advice', 'I''ll keep that in mind.', ARRAY['Thanks for sharing.', 'I''ll think about it.'], 'When receiving unwanted advice', 'neutral'),
('Boundaries', 'Prying Questions', 'I''d rather not discuss that.', ARRAY['That''s private.', 'I prefer not to say.'], 'When asked invasive questions', 'neutral'),
('Emotional Bait', 'Guilt Trip', 'I understand you feel that way.', ARRAY['I hear you.', 'Noted.'], 'When they try to guilt you', 'neutral'),
('Emotional Bait', 'Drama/Crisis', 'I hope that works out for you.', ARRAY['That sounds difficult.', 'I see.'], 'When they share drama to get reaction', 'neutral'),
('Logistics', 'Information Request', 'I''ll send that by email.', ARRAY['I''ll email you the details.'], 'When they ask for information', 'brief'),
('Logistics', 'Meeting Request', 'Email works better for me.', ARRAY['Let''s handle this via email.'], 'When they want to meet/call', 'redirect')
ON CONFLICT DO NOTHING;
