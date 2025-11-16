-- BIFF Communication Assistant Tables

-- Store BIFF response templates
CREATE TABLE IF NOT EXISTS biff_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category VARCHAR(50) NOT NULL, -- 'pickup', 'schedule_change', 'accusation', 'expense', 'holiday'
  template_text TEXT NOT NULL,
  usage_count INTEGER DEFAULT 0,
  is_custom BOOLEAN DEFAULT false,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Track communication exchanges
CREATE TABLE IF NOT EXISTS coparent_communications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  direction VARCHAR(10) NOT NULL CHECK (direction IN ('incoming', 'outgoing')),
  message_text TEXT NOT NULL,
  response_text TEXT,
  category VARCHAR(50),
  biff_score INTEGER CHECK (biff_score >= 1 AND biff_score <= 10), -- How well it follows BIFF
  jade_detected BOOLEAN DEFAULT false,
  emotional_trigger_level INTEGER CHECK (emotional_trigger_level >= 1 AND emotional_trigger_level <= 10),
  cooling_off_used BOOLEAN DEFAULT false,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Track communication patterns and red flags
CREATE TABLE IF NOT EXISTS communication_insights (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  insight_date DATE DEFAULT CURRENT_DATE,
  total_messages INTEGER DEFAULT 0,
  biff_compliance_rate DECIMAL(5,2), -- Percentage of BIFF-compliant responses
  common_triggers TEXT[],
  escalation_patterns TEXT,
  improvement_areas TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, insight_date)
);

-- Enable RLS
ALTER TABLE biff_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE coparent_communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE communication_insights ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view all default templates and their own custom templates"
ON biff_templates FOR SELECT
TO authenticated
USING (is_custom = false OR auth.uid() = user_id);

CREATE POLICY "Users can create their own custom templates"
ON biff_templates FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id AND is_custom = true);

CREATE POLICY "Users can manage their own communications"
ON coparent_communications FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own communication insights"
ON communication_insights FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_biff_templates_category ON biff_templates(category, is_custom);
CREATE INDEX IF NOT EXISTS idx_coparent_comms_user_date ON coparent_communications(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_communication_insights_user_date ON communication_insights(user_id, insight_date DESC);

-- Seed default BIFF templates
INSERT INTO biff_templates (category, template_text, is_custom) VALUES
('pickup', 'Hi [Name], the exchange is at [TIME] at [LOCATION]. Please let me know if you''ll be more than 15 min late.', false),
('schedule_change', 'Hi [Name], I''m unavailable that day. Let''s stick to the current plan. Thanks.', false),
('accusation', 'Hi [Name], I''ll focus on the kids'' schedule. Pickup is [TIME] at [LOCATION].', false),
('late_pickup', 'Hi [Name], per the parenting plan, pickup is at [TIME]. I''ll have the kids ready.', false),
('holiday', 'Hi [Name], per the parenting plan, [HOLIDAY] is your/my time this year. Pickup at [TIME].', false),
('expense', 'Hi [Name], per our agreement, [EXPENSE] is covered as outlined. Receipt attached.', false);
