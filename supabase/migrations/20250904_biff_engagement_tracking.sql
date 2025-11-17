-- Add engagement tracking to BIFF communications
ALTER TABLE coparent_communications 
ADD COLUMN IF NOT EXISTS response_time_hours INTEGER,
ADD COLUMN IF NOT EXISTS avoided_engagement BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS engagement_notes TEXT;

-- Create engagement metrics table
CREATE TABLE IF NOT EXISTS biff_engagement_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  month DATE NOT NULL,
  total_communications INTEGER DEFAULT 0,
  successful_disengagements INTEGER DEFAULT 0,
  jade_avoided INTEGER DEFAULT 0,
  avg_response_time_hours DECIMAL(10,2),
  high_biff_scores INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, month)
);

-- Indexes
CREATE INDEX idx_biff_metrics_user ON biff_engagement_metrics(user_id, month DESC);

-- RLS Policies
ALTER TABLE biff_engagement_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own metrics"
  ON biff_engagement_metrics FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own metrics"
  ON biff_engagement_metrics FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own metrics"
  ON biff_engagement_metrics FOR UPDATE
  USING (auth.uid() = user_id);
