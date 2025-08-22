-- Grey Rock Scenarios table, indexes, and RLS
-- Created: 2025-08-22

-- Table
create table public.grey_rock_scenarios (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  trigger text not null,
  good_response text not null,
  bad_response text not null,
  explanation text not null,
  difficulty text not null check (difficulty in ('easy','medium','hard')),
  pack text not null check (pack in ('Basics','Boundaries','High-Conflict')),
  min_tier text not null check (min_tier in ('foundation','recovery','empowerment')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Indexes
create index idx_gr_scenarios_active on public.grey_rock_scenarios (is_active) where is_active = true;
create index idx_gr_scenarios_pack on public.grey_rock_scenarios (pack);
create index idx_gr_scenarios_difficulty on public.grey_rock_scenarios (difficulty);
create index idx_gr_scenarios_tier on public.grey_rock_scenarios (min_tier);

-- RLS
alter table public.grey_rock_scenarios enable row level security;

-- Allow authenticated users to read active scenarios
create policy gr_scenarios_select on public.grey_rock_scenarios
  for select using (auth.role() = 'authenticated' and is_active = true);

-- Only service role (or future admin role) can insert/update/delete; omit explicit policies
-- so default deny stands for non-service users.

-- Trigger to auto-update updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_updated_at_on_gr_scenarios on public.grey_rock_scenarios;
create trigger set_updated_at_on_gr_scenarios
before update on public.grey_rock_scenarios
for each row execute function public.set_updated_at();

-- Seed 50 scenarios (Basics 20, Boundaries 20, High-Conflict 10)
insert into public.grey_rock_scenarios (title, description, trigger, good_response, bad_response, explanation, difficulty, pack, min_tier)
values
  -- Basics (1-20)
  ('Work Performance Criticism', 'Your ex criticizes your work performance in front of your children', '"You''re so incompetent at your job, no wonder the kids don''t respect you."', '"Okay." (then redirect conversation to the children)', '"That''s not true! I work very hard and my boss appreciates me!"', 'The good response avoids taking the bait and doesn''t provide emotional fuel. The bad response shows you''re affected and gives them ammunition.', 'medium', 'Basics', 'foundation'),
  ('Relationship Status Probing', 'They ask invasive questions about your dating life', '"So who are you seeing now? I bet they don''t know how crazy you really are."', '"That''s not something I discuss."', '"I''m not crazy! And my personal life is none of your business!"', 'Keep responses brief and don''t defend yourself. Defending gives them the reaction they want.', 'easy', 'Basics', 'foundation'),
  ('Late Pickup Comment', 'They criticize you for arriving a few minutes late', '"Late again. Classic you."', '"Pickup is complete."', '"I''m only five minutes late because of traffic!"', 'A short acknowledgment avoids debate and ends the moment.', 'easy', 'Basics', 'foundation'),
  ('Appearance Jab', 'They make a dig about your clothes or hair', '"That outfit is… bold for your age."', '"Noted."', '"What''s that supposed to mean? I look fine."', 'Do not seek validation; neutral acknowledgment provides no fuel.', 'easy', 'Basics', 'foundation'),
  ('Social Media Bait', 'They pressure you about posts', '"Nice post fishing for attention again."', '"I don''t discuss socials here."', '"I wasn''t fishing! People liked it because—"', 'Avoid defending or explaining; set a boundary and stop.', 'medium', 'Basics', 'foundation'),
  ('Schedule Nitpick', 'They nitpick your shared calendar entry', '"Your plan notes are confusing."', '"I''ll keep it concise."', '"They''re not confusing—your notes are worse."', 'Keep it short; do not compare or defend.', 'easy', 'Basics', 'foundation'),
  ('Text Wall', 'They send a long accusatory text', '"So many points. I''ll respond about logistics only."', '"I''ll respond about logistics only."', '"You''re wrong about everything, and here''s why—"', 'Limit to logistics; don''t address every accusation.', 'medium', 'Basics', 'foundation'),
  ('Friend Gossip', 'They claim friends agree with them', '"Everyone knows you''re difficult."', '"I don''t engage with gossip."', '"Who? Name one person who said that!"', 'Don''t chase rumors; end the line of conversation.', 'easy', 'Basics', 'foundation'),
  ('Holiday Pressure', 'They push for last-minute plan changes', '"We''re changing the schedule."', '"I''ll follow the current plan."', '"You always do this at the last minute!"', 'Reaffirm the plan without arguing intent.', 'medium', 'Basics', 'foundation'),
  ('Phone Call Demand', 'They demand you pick up immediately', '"Answer now or else."', '"I''ll respond in writing."', '"You can''t talk to me like that!"', 'Choose the safe medium; keep it neutral.', 'easy', 'Basics', 'foundation'),
  ('Old Story Rehash', 'They bring up past mistakes', '"Remember when you messed that up?"', '"Not discussing the past."', '"That''s not how it happened!"', 'Avoid relitigation; refuse the bait.', 'easy', 'Basics', 'foundation'),
  ('Name-Calling', 'They use mild insults', '"You''re so sensitive."', '"I''m focusing on logistics."', '"I''m not sensitive—you''re mean!"', 'Refocus without defense.', 'easy', 'Basics', 'foundation'),
  ('Boundary Probe', 'They test a small boundary', '"Just this once, break the rule."', '"No."', '"Fine, but only this time."', 'A brief no prevents negotiation traps.', 'easy', 'Basics', 'foundation'),
  ('Triangulation Try', 'They say the kids prefer their house', '"Kids like my place more."', '"I won''t compare homes."', '"They do not—you''re lying."', 'Decline comparison; don''t defend.', 'medium', 'Basics', 'foundation'),
  ('Money Dig', 'They say you''re cheap', '"You''re stingy as ever."', '"Not discussing that."', '"I''m not stingy—I pay for—"', 'No defense; end the topic.', 'easy', 'Basics', 'foundation'),
  ('Petty Accusation', 'They accuse you of forgetting small things', '"You forgot the lunch again."', '"I''ll check."', '"No I didn''t—here''s proof."', 'Check, don''t litigate.', 'easy', 'Basics', 'foundation'),
  ('Tone Policing', 'They judge your tone to provoke you', '"Watch your tone."', '"I''ll stick to the plan."', '"My tone is fine—yours isn''t."', 'Avoid tone debates; return to logistics.', 'medium', 'Basics', 'foundation'),
  ('Minor Threat', 'They imply consequences', '"You''ll regret this."', '"Noted."', '"Are you threatening me?"', 'Acknowledge without escalation.', 'medium', 'Basics', 'foundation'),
  ('Public Jab', 'They make a snide comment at pickup', '"Nice parenting."', '"We''re leaving now."', '"Don''t embarrass me in front of them!"', 'Keep it moving; no debate in public.', 'easy', 'Basics', 'foundation'),
  ('Guilt Nudge', 'They suggest you''re selfish', '"You only think of yourself."', '"I''m not discussing that."', '"That''s not true—I always…"', 'End guilt appeals quickly.', 'easy', 'Basics', 'foundation'),
  -- Boundaries (21-40)
  ('Parenting Criticism', 'They criticize your parenting decisions', '"You''re too soft on the kids. That''s why they don''t listen to you."', '"I''ll consider that."', '"I''m not too soft! You''re the one who spoils them!"', 'Avoid defending your parenting style. A non-committal response doesn''t give them fuel for argument.', 'medium', 'Boundaries', 'recovery'),
  ('Financial Accusations', 'They accuse you of misusing money or being financially irresponsible', '"You''re wasting money on stupid things while our kids need new clothes!"', '"I''ll look into that."', '"I bought one coffee! You spent hundreds on your hobbies!"', 'Don''t justify spending or counter-attack. Neutral acknowledgment ends it.', 'hard', 'Boundaries', 'recovery'),
  ('Boundary Re-Negotiate', 'They push to renegotiate custody outside court order', '"Let''s change days off the record."', '"I follow the order."', '"The order is unfair—be flexible."', 'Refer to the order; don''t argue fairness.', 'medium', 'Boundaries', 'recovery'),
  ('Info Fishing', 'They fish for your address or employer info', '"Where exactly do you work now?"', '"Not sharing that."', '"Why won''t you tell me? What are you hiding?"', 'Protect personal info; keep it brief.', 'medium', 'Boundaries', 'recovery'),
  ('Drop-In Request', 'They suggest unannounced visits', '"I''ll swing by later."', '"No drop-ins."', '"Don''t be dramatic—it''s quick."', 'State the rule; no justification.', 'easy', 'Boundaries', 'recovery'),
  ('Budget Control', 'They try to dictate your spending', '"You''re not allowed to buy that."', '"I''ll handle my budget."', '"You don''t tell me what to do!"', 'Reassert autonomy without emotion.', 'medium', 'Boundaries', 'recovery'),
  ('Personal Attack with Ask', 'Insult followed by a request', '"You''re incompetent—anyway, can you sign this?"', '"Send the document."', '"Don''t call me that—why should I help?"', 'Ignore insult; address the task only.', 'medium', 'Boundaries', 'recovery'),
  ('Kid Messenger', 'They ask kids to pass adult messages', '"Tell your mom to…"', '"Use me for messages, not the kids."', '"Don''t involve them!"', 'State the boundary; no lecture.', 'medium', 'Boundaries', 'recovery'),
  ('Gas Pumping', 'They push you to admit fault', '"Just say you were wrong."', '"Not discussing blame."', '"I wasn''t wrong—you were!"', 'Don''t enter blame games.', 'easy', 'Boundaries', 'recovery'),
  ('Private Photos', 'They demand access to photos', '"Send me your camera roll."', '"I''ll share kid photos via our app."', '"You can''t control me."', 'Define safe channel; repeat it.', 'medium', 'Boundaries', 'recovery'),
  ('Logistics Scope Creep', 'They veer into personal topics during logistics', '"Also, why did you…"', '"Sticking to logistics only."', '"It''s related—listen."', 'Hold scope; end side topics.', 'easy', 'Boundaries', 'recovery'),
  ('Public Scene Threat', 'They threaten a scene at school', '"I''ll tell everyone what you did."', '"School is not for disputes."', '"Go ahead and try!"', 'Decline escalation; keep to policy.', 'hard', 'Boundaries', 'recovery'),
  ('Legal Bluff', 'They bluff about their lawyer', '"My lawyer says you''re done."', '"Communicate through counsel."', '"You don''t even have a lawyer!"', 'Redirect to counsel; don''t debate.', 'medium', 'Boundaries', 'recovery'),
  ('Surprise Switch', 'They propose last-minute swap', '"Switch tonight."', '"I''m following the plan."', '"You never help when I need you!"', 'Reaffirm plan; avoid justification.', 'easy', 'Boundaries', 'recovery'),
  ('Evidence Demand', 'They demand proof for routine matters', '"Prove you fed them."', '"That''s not necessary."', '"Here are receipts and timestamps—"', 'Don''t over-prove everyday items.', 'medium', 'Boundaries', 'recovery'),
  ('Well-Actually', 'They correct trivial details to derail you', '"Actually, it was 3:07, not 3:05."', '"Not relevant."', '"Details matter—stop nitpicking!"', 'Refuse derailment; keep focus.', 'easy', 'Boundaries', 'recovery'),
  ('Gift Strings', 'They attach strings to gifts', '"I bought that, so you owe me."', '"Gifts don''t require favors."', '"You can''t control me with gifts!"', 'State principle briefly; stop.', 'medium', 'Boundaries', 'recovery'),
  ('Proxy Pressure', 'They send others to pressure you', '"Your friend said help me out."', '"Contact me directly."', '"Don''t drag my friends in!"', 'Remove proxies; keep it direct.', 'medium', 'Boundaries', 'recovery'),
  ('Boundary Mock', 'They mock your boundaries', '"Your rules are ridiculous."', '"Noted."', '"They''re reasonable—you''re the problem!"', 'No defense; stay brief.', 'easy', 'Boundaries', 'recovery'),
  -- High-Conflict (41-50)
  ('Emotional Manipulation', 'They try to make you feel guilty about the relationship ending', '"The kids are so sad about us not being together. You''ve ruined their family."', '"That must be difficult for them."', '"I didn''t ruin anything! You did this to yourself!"', 'Acknowledge without taking responsibility. Don''t defend your decision or blame them back.', 'hard', 'High-Conflict', 'empowerment'),
  ('Smear Threat', 'They threaten to smear you online', '"I''ll post everything about you."', '"I won''t engage online."', '"Try it and see what happens!"', 'Refuse engagement; don''t threaten back.', 'hard', 'High-Conflict', 'empowerment'),
  ('False Report Hint', 'They hint at reporting you falsely', '"Maybe I should report you."', '"I''ll stick to facts."', '"That''s a false accusation!"', 'Avoid panic; keep to facts and process.', 'hard', 'High-Conflict', 'empowerment'),
  ('Parental Alienation Claim', 'They claim you turned kids against them', '"You made them hate me."', '"I support their relationship with both parents."', '"No, you did that yourself!"', 'Avoid blame loops; state your stance briefly.', 'hard', 'High-Conflict', 'empowerment'),
  ('Financial Threat', 'They threaten financial ruin', '"I''ll drain you in court."', '"Communicate via counsel."', '"You won''t win!"', 'Decline conflict bait; route to counsel.', 'hard', 'High-Conflict', 'empowerment'),
  ('Stalking Implication', 'They hint at monitoring you', '"I know where you were."', '"Not discussing personal life."', '"Stop stalking me!"', 'Don''t reveal info; stay neutral and brief.', 'hard', 'High-Conflict', 'empowerment'),
  ('Malicious Compliance', 'They insist on literalism to frustrate', '"You didn''t say exactly 7:00."', '"Pickup at 7:00 as planned."', '"You always twist my words!"', 'Restate plan plainly; no emotion.', 'medium', 'High-Conflict', 'empowerment'),
  ('Third-Party Threat', 'They threaten to involve authorities without cause', '"I''ll call CPS on you."', '"I''ll cooperate with authorities."', '"That''s abusive—don''t you dare!"', 'Don''t escalate; state cooperation and stop.', 'hard', 'High-Conflict', 'empowerment'),
  ('Ultimatum', 'They give extreme take-it-or-leave-it options', '"Do this or you''ll never see them."', '"I won''t respond to ultimatums."', '"You can''t keep them from me!"', 'Name the tactic; decline to engage.', 'hard', 'High-Conflict', 'empowerment'),
  ('Rage Texting', 'They send rapid aggressive messages', '"Answer now!!!"', '"I''ll respond later."', '"Stop harassing me!"', 'Delay and de-escalate; don''t match intensity.', 'medium', 'High-Conflict', 'empowerment');
