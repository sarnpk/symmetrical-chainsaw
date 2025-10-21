-- Grey Rock Communication Templates

CREATE TABLE IF NOT EXISTS grey_rock_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  situation TEXT NOT NULL,
  template_text TEXT NOT NULL,
  variations TEXT[],
  when_to_use TEXT,
  tone TEXT CHECK (tone IN ('neutral', 'brief', 'formal', 'redirect')),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_template_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  template_id UUID REFERENCES grey_rock_templates(id) ON DELETE SET NULL,
  custom_text TEXT,
  context TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_user_template_usage_user ON user_template_usage(user_id);

ALTER TABLE grey_rock_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_template_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view templates" ON grey_rock_templates FOR SELECT USING (true);
CREATE POLICY "Users manage own template usage" ON user_template_usage FOR ALL USING (auth.uid() = user_id);

-- Seed templates
INSERT INTO grey_rock_templates (category, situation, template_text, variations, when_to_use, tone) VALUES
('Scheduling', 'Pickup/dropoff time change request', 'Noted. I''ll check my schedule and let you know.', ARRAY['I''ll look into that.', 'I''ll get back to you on that.', 'Received.'], 'When they request schedule changes', 'neutral'),
('Scheduling', 'Last-minute schedule change', 'That doesn''t work for me. The original schedule stands.', ARRAY['I can''t accommodate that.', 'The agreed schedule remains.'], 'When they try to change plans last minute', 'brief'),
('Personal Questions', 'Dating/relationship questions', 'That''s not something I discuss.', ARRAY['That''s private.', 'I don''t share personal information.', 'Not relevant.'], 'When they probe your personal life', 'brief'),
('Personal Questions', 'Financial questions', 'My finances are not your concern.', ARRAY['That''s not relevant to co-parenting.', 'That''s private.'], 'When they ask about your money', 'brief'),
('Criticism', 'Parenting criticism', 'I''ll consider that.', ARRAY['Noted.', 'I''ll think about it.', 'Thanks for your input.'], 'When they criticize your parenting', 'neutral'),
('Criticism', 'Personal attacks', 'Okay.', ARRAY['I see.', 'Understood.'], 'When they insult or attack you personally', 'brief'),
('Emotional Manipulation', 'Guilt trips about kids', 'The kids are adjusting fine.', ARRAY['They''re doing well.', 'They''re adapting.'], 'When they claim kids are suffering', 'neutral'),
('Emotional Manipulation', 'Blame for relationship ending', 'We''ve both moved on.', ARRAY['That''s in the past.', 'We''re focused on co-parenting now.'], 'When they blame you for the breakup', 'redirect'),
('Boundaries', 'Excessive texting/calling', 'I''ll respond to co-parenting matters during business hours.', ARRAY['I check messages once daily.', 'I respond to urgent matters only.'], 'When they contact you constantly', 'formal'),
('Boundaries', 'Showing up unannounced', 'Please contact me before coming over.', ARRAY['Unannounced visits don''t work for me.', 'I need advance notice.'], 'When they show up without warning', 'formal'),
('Conflict', 'Trying to start an argument', 'I don''t want to argue. Let''s focus on the kids.', ARRAY['This isn''t productive.', 'Let''s stay on topic.'], 'When they try to bait you into fighting', 'redirect'),
('Conflict', 'Accusations', 'I disagree.', ARRAY['That''s not accurate.', 'I see it differently.'], 'When they make false accusations', 'brief'),
('Kids', 'Asking kids to relay messages', 'Please communicate directly with me, not through the children.', ARRAY['The kids shouldn''t be messengers.', 'Contact me directly.'], 'When they use kids as messengers', 'formal'),
('Kids', 'Undermining your rules', 'We have different households with different rules.', ARRAY['My house, my rules.', 'Each household has its own structure.'], 'When they criticize your household rules', 'neutral'),
('Legal/Custody', 'Threatening legal action', 'If you have legal concerns, contact your attorney.', ARRAY['Speak to your lawyer about that.', 'That''s a matter for the attorneys.'], 'When they threaten to take you to court', 'formal'),
('Legal/Custody', 'Custody agreement violations', 'The custody agreement is clear. I expect you to follow it.', ARRAY['Please adhere to the agreement.', 'The court order stands.'], 'When they violate custody terms', 'formal'),
('Deflection', 'Changing the subject', 'Let''s stay focused on [original topic].', ARRAY['Back to the matter at hand.', 'We were discussing [topic].'], 'When they try to derail the conversation', 'redirect'),
('Deflection', 'Bringing up the past', 'That''s not relevant to the current situation.', ARRAY['We''re discussing [current issue].', 'Let''s focus on now.'], 'When they bring up old issues', 'redirect'),
('Emergency', 'Fake emergencies', 'If it''s a true emergency, call 911.', ARRAY['Contact emergency services if needed.', 'That doesn''t sound like an emergency.'], 'When they claim fake emergencies for attention', 'brief'),
('Emergency', 'Medical decisions', 'I''ll consult with the doctor and decide.', ARRAY['I''ll handle the medical matter.', 'I''ll speak to their pediatrician.'], 'When they question medical decisions', 'neutral');
