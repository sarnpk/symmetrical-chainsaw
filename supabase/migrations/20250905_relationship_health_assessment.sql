-- Relationship Health Assessment System
-- Replaces BIFF Success widget with more generic relationship evaluation tool

-- Create relationship assessments table
CREATE TABLE IF NOT EXISTS relationship_assessments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    overall_score INTEGER NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
    category_scores JSONB NOT NULL,
    risk_level TEXT NOT NULL CHECK (risk_level IN ('low', 'moderate', 'high')),
    answers JSONB NOT NULL,
    recommendations JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_relationship_assessments_user_id ON relationship_assessments(user_id);
CREATE INDEX idx_relationship_assessments_created_at ON relationship_assessments(created_at);
CREATE INDEX idx_relationship_assessments_risk_level ON relationship_assessments(risk_level);

-- Enable RLS
ALTER TABLE relationship_assessments ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own assessments"
    ON relationship_assessments FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own assessments"
    ON relationship_assessments FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own assessments"
    ON relationship_assessments FOR UPDATE
    USING (auth.uid() = user_id);

-- Create function to get latest relationship health score
CREATE OR REPLACE FUNCTION get_latest_relationship_health(user_uuid UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    latest_score INTEGER;
BEGIN
    SELECT overall_score INTO latest_score
    FROM relationship_assessments
    WHERE user_id = user_uuid
    ORDER BY created_at DESC
    LIMIT 1;
    
    RETURN COALESCE(latest_score, 50); -- Default neutral score
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION get_latest_relationship_health(UUID) TO authenticated;

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_relationship_assessments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_relationship_assessments_updated_at
    BEFORE UPDATE ON relationship_assessments
    FOR EACH ROW
    EXECUTE FUNCTION update_relationship_assessments_updated_at();

-- Create assessment categories table
CREATE TABLE IF NOT EXISTS assessment_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    weight DECIMAL DEFAULT 1.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for assessment categories
ALTER TABLE assessment_categories ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read assessment categories
CREATE POLICY "Assessment categories are readable by all authenticated users"
    ON assessment_categories FOR SELECT
    TO authenticated
    USING (true);

-- Insert sample assessment categories
INSERT INTO assessment_categories (name, description, weight) VALUES
    ('communication', 'How well partners communicate and listen to each other', 1.0),
    ('respect', 'Mutual respect and appreciation in the relationship', 1.2),
    ('safety', 'Physical and emotional safety within the relationship', 2.0),
    ('support', 'Emotional and practical support between partners', 1.0),
    ('boundaries', 'Healthy boundaries and personal autonomy', 1.5)
ON CONFLICT (name) DO NOTHING;