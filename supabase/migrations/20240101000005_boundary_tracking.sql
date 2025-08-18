-- Boundary Tracking Enhancement Migration
-- Adds essential Phase 1 tracking capabilities for boundary management

-- Boundary interactions table for logging violations, successes, and reviews
CREATE TABLE boundary_interactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  boundary_id UUID REFERENCES boundaries(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  interaction_type TEXT NOT NULL CHECK (interaction_type IN ('violation', 'success', 'review', 'modification')),
  severity TEXT CHECK (severity IN ('low', 'medium', 'high')),
  description TEXT,
  context TEXT, -- Additional context about the situation
  emotional_impact INTEGER CHECK (emotional_impact >= 1 AND emotional_impact <= 5), -- 1=minimal, 5=severe
  location TEXT, -- Where the interaction occurred
  triggers TEXT[], -- What triggered the boundary test
  outcome TEXT, -- How the situation was resolved
  lessons_learned TEXT, -- What was learned from this interaction
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Boundary analytics summary table for aggregated metrics
CREATE TABLE boundary_analytics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  boundary_id UUID REFERENCES boundaries(id) ON DELETE CASCADE,
  period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  period_type TEXT NOT NULL CHECK (period_type IN ('daily', 'weekly', 'monthly')),
  
  -- Interaction counts
  total_interactions INTEGER DEFAULT 0,
  violations_count INTEGER DEFAULT 0,
  successes_count INTEGER DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  modifications_count INTEGER DEFAULT 0,
  
  -- Success metrics
  success_rate DECIMAL(5,2), -- Percentage of successful boundary maintenance
  average_emotional_impact DECIMAL(3,2), -- Average emotional impact score
  
  -- Trend indicators
  trend_direction TEXT CHECK (trend_direction IN ('improving', 'stable', 'declining')),
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure unique analytics per boundary per period
  UNIQUE(boundary_id, period_start, period_end, period_type)
);

-- Boundary review schedule table for tracking review frequency
CREATE TABLE boundary_reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  boundary_id UUID REFERENCES boundaries(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  review_type TEXT NOT NULL CHECK (review_type IN ('scheduled', 'triggered', 'manual')),
  review_status TEXT DEFAULT 'pending' CHECK (review_status IN ('pending', 'completed', 'skipped')),
  
  -- Review content
  effectiveness_rating INTEGER CHECK (effectiveness_rating >= 1 AND effectiveness_rating <= 5),
  needs_modification BOOLEAN DEFAULT false,
  modification_notes TEXT,
  challenges_faced TEXT,
  support_needed TEXT,
  
  -- Scheduling
  scheduled_date TIMESTAMP WITH TIME ZONE,
  completed_date TIMESTAMP WITH TIME ZONE,
  next_review_date TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE boundary_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE boundary_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE boundary_reviews ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX idx_boundary_interactions_boundary_id ON boundary_interactions(boundary_id);
CREATE INDEX idx_boundary_interactions_user_id ON boundary_interactions(user_id);
CREATE INDEX idx_boundary_interactions_type ON boundary_interactions(interaction_type);
CREATE INDEX idx_boundary_interactions_created_at ON boundary_interactions(created_at);

CREATE INDEX idx_boundary_analytics_user_id ON boundary_analytics(user_id);
CREATE INDEX idx_boundary_analytics_boundary_id ON boundary_analytics(boundary_id);
CREATE INDEX idx_boundary_analytics_period ON boundary_analytics(period_start, period_end);

CREATE INDEX idx_boundary_reviews_boundary_id ON boundary_reviews(boundary_id);
CREATE INDEX idx_boundary_reviews_user_id ON boundary_reviews(user_id);
CREATE INDEX idx_boundary_reviews_status ON boundary_reviews(review_status);
CREATE INDEX idx_boundary_reviews_scheduled_date ON boundary_reviews(scheduled_date);

-- Function to automatically update boundary last_reviewed timestamp
CREATE OR REPLACE FUNCTION update_boundary_last_reviewed()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE boundaries 
  SET last_reviewed = NOW(), updated_at = NOW()
  WHERE id = NEW.boundary_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update last_reviewed when a review is completed
CREATE TRIGGER trigger_update_boundary_last_reviewed
  AFTER INSERT ON boundary_reviews
  FOR EACH ROW
  WHEN (NEW.review_status = 'completed')
  EXECUTE FUNCTION update_boundary_last_reviewed();

-- Function to calculate success rate for analytics
CREATE OR REPLACE FUNCTION calculate_boundary_success_rate(
  p_boundary_id UUID,
  p_start_date TIMESTAMP WITH TIME ZONE,
  p_end_date TIMESTAMP WITH TIME ZONE
) RETURNS DECIMAL(5,2) AS $$
DECLARE
  total_interactions INTEGER;
  success_interactions INTEGER;
  success_rate DECIMAL(5,2);
BEGIN
  -- Count total interactions (excluding reviews and modifications)
  SELECT COUNT(*) INTO total_interactions
  FROM boundary_interactions
  WHERE boundary_id = p_boundary_id
    AND created_at BETWEEN p_start_date AND p_end_date
    AND interaction_type IN ('violation', 'success');
  
  -- Count successful interactions
  SELECT COUNT(*) INTO success_interactions
  FROM boundary_interactions
  WHERE boundary_id = p_boundary_id
    AND created_at BETWEEN p_start_date AND p_end_date
    AND interaction_type = 'success';
  
  -- Calculate success rate
  IF total_interactions > 0 THEN
    success_rate := (success_interactions::DECIMAL / total_interactions::DECIMAL) * 100;
  ELSE
    success_rate := NULL;
  END IF;
  
  RETURN success_rate;
END;
$$ LANGUAGE plpgsql;
