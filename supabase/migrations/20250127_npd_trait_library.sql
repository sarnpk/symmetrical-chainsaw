-- NPD Trait Library
-- Educational resource for identifying manipulation tactics

CREATE TABLE IF NOT EXISTS npd_traits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT CHECK (category IN ('covert', 'overt', 'both')),
  description TEXT NOT NULL,
  examples TEXT[],
  response_strategies TEXT[],
  severity TEXT CHECK (severity IN ('mild', 'moderate', 'severe')),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_trait_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  trait_id UUID NOT NULL REFERENCES npd_traits(id) ON DELETE CASCADE,
  personal_note TEXT,
  frequency TEXT CHECK (frequency IN ('rare', 'occasional', 'frequent', 'constant')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_user_trait_notes_user ON user_trait_notes(user_id);
CREATE INDEX idx_user_trait_notes_trait ON user_trait_notes(trait_id);

ALTER TABLE npd_traits ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_trait_notes ENABLE ROW LEVEL SECURITY;

-- NPD traits are public (read-only)
CREATE POLICY "Anyone can view NPD traits" ON npd_traits FOR SELECT USING (true);

-- Users can manage their own notes
CREATE POLICY "Users can view own trait notes" ON user_trait_notes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own trait notes" ON user_trait_notes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own trait notes" ON user_trait_notes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own trait notes" ON user_trait_notes FOR DELETE USING (auth.uid() = user_id);

-- Seed 10 core NPD traits
INSERT INTO npd_traits (name, category, description, examples, response_strategies, severity) VALUES
(
  'Gaslighting',
  'both',
  'Making you question your own reality, memory, or perceptions. They deny things they said or did, even when you have proof.',
  ARRAY[
    'Denying conversations that happened',
    'Insisting you''re "too sensitive" or "imagining things"',
    'Claiming you said things you never said',
    'Rewriting history to make themselves look better'
  ],
  ARRAY[
    'Document everything in writing',
    'Trust your memory and records',
    'Use Grey Rock - don''t engage in debates about reality',
    'Keep evidence (texts, emails, recordings where legal)'
  ],
  'severe'
),
(
  'Victim-Playing',
  'covert',
  'Always positioning themselves as the victim or martyr, even when they''re the aggressor. They use sympathy to manipulate.',
  ARRAY[
    'Claiming you''re "attacking" them when you set boundaries',
    'Telling others how much they sacrifice for you',
    'Using illness or hardship to avoid accountability',
    'Playing the "poor me" card to gain sympathy'
  ],
  ARRAY[
    'Don''t defend yourself - it feeds the narrative',
    'State facts without emotion',
    'Refuse to engage with guilt trips',
    'Document their actual behavior'
  ],
  'moderate'
),
(
  'Triangulation',
  'both',
  'Bringing a third person into conflicts to validate their position, create jealousy, or isolate you.',
  ARRAY[
    'Comparing you unfavorably to others',
    'Using children to relay messages or spy',
    'Recruiting "flying monkeys" to attack you',
    'Pitting people against each other'
  ],
  ARRAY[
    'Communicate directly, not through third parties',
    'Don''t compete for validation',
    'Set boundaries with flying monkeys',
    'Focus on your relationship with your children, not their narrative'
  ],
  'severe'
),
(
  'Love-Bombing',
  'both',
  'Excessive attention, affection, or gifts early in a relationship or after conflict to manipulate and control.',
  ARRAY[
    'Over-the-top romantic gestures',
    'Constant texting/calling in early stages',
    'Expensive gifts to "make up" for abuse',
    'Intense declarations of love too soon'
  ],
  ARRAY[
    'Recognize it as manipulation, not genuine affection',
    'Don''t let gifts erase abusive behavior',
    'Maintain boundaries despite the charm offensive',
    'Remember: actions over time matter, not grand gestures'
  ],
  'moderate'
),
(
  'Hoovering',
  'both',
  'Attempts to "suck you back in" after a breakup or period of no contact, often with promises of change.',
  ARRAY[
    'Sudden apologies and promises to change',
    'Showing up unexpectedly',
    'Using children or emergencies to make contact',
    'Love-bombing after you''ve pulled away'
  ],
  ARRAY[
    'Maintain no contact or grey rock',
    'Don''t believe promises without sustained changed behavior',
    'Block or limit communication channels',
    'Remember past patterns, not current words'
  ],
  'severe'
),
(
  'Silent Treatment',
  'both',
  'Withholding communication, affection, or acknowledgment as punishment or control.',
  ARRAY[
    'Ignoring you for days after a disagreement',
    'Refusing to respond to important questions',
    'Giving one-word answers',
    'Acting like you don''t exist'
  ],
  ARRAY[
    'Don''t chase or beg for communication',
    'Use the silence for your own peace',
    'Communicate important info in writing',
    'Don''t reward the behavior with emotional reactions'
  ],
  'moderate'
),
(
  'Projection',
  'both',
  'Accusing you of the exact behaviors, thoughts, or feelings they themselves have.',
  ARRAY[
    'Accusing you of cheating when they''re unfaithful',
    'Calling you selfish when they''re self-centered',
    'Claiming you''re manipulative',
    'Saying you''re the one with the problem'
  ],
  ARRAY[
    'Don''t defend yourself - it''s not about you',
    'Recognize it as their confession',
    'Grey Rock - don''t engage',
    'Document the accusations for pattern recognition'
  ],
  'moderate'
),
(
  'Flying Monkeys',
  'both',
  'Recruiting others (friends, family, children) to do their bidding, spy on you, or attack you.',
  ARRAY[
    'Getting mutual friends to "check on you"',
    'Using children to relay messages or gather information',
    'Turning family members against you',
    'Having others confront you on their behalf'
  ],
  ARRAY[
    'Set boundaries with flying monkeys',
    'Don''t share personal information',
    'Communicate directly with the narcissist only when necessary',
    'Protect children from being used as messengers'
  ],
  'severe'
),
(
  'Boundary Violations',
  'both',
  'Repeatedly ignoring or crossing your stated boundaries, then blaming you for having them.',
  ARRAY[
    'Showing up unannounced after you asked them not to',
    'Contacting you through blocked channels',
    'Ignoring custody agreements',
    'Claiming your boundaries are "unreasonable"'
  ],
  ARRAY[
    'State boundaries clearly in writing',
    'Enforce consequences consistently',
    'Don''t explain or justify your boundaries',
    'Document violations for legal purposes'
  ],
  'severe'
),
(
  'Covert Criticism',
  'covert',
  'Disguising insults, put-downs, or criticism as concern, jokes, or compliments.',
  ARRAY[
    '"I''m just worried about your weight" (body shaming)',
    '"You''re so brave to wear that" (insult disguised as compliment)',
    '"I''m just trying to help" (when giving unsolicited criticism)',
    'Backhanded compliments'
  ],
  ARRAY[
    'Trust your gut - if it feels like criticism, it is',
    'Don''t explain yourself or seek their approval',
    'Grey Rock - minimal response',
    'Recognize the pattern, don''t internalize the criticism'
  ],
  'mild'
);
