-- Feature gating strategy for Grey Rock, Boundary Builder, and Coping Strategies
-- Insert comprehensive feature limits for all tiers

-- Grey Rock Practice Limits
INSERT INTO feature_limits (subscription_tier, feature_name, limit_type, limit_value) VALUES
('foundation', 'grey_rock_practice', 'monthly_count', 10),
('recovery', 'grey_rock_practice', 'monthly_count', 50),
('empowerment', 'grey_rock_practice', 'monthly_count', -1),

-- Grey Rock Template Access (scenario count limits)
('foundation', 'grey_rock_scenarios', 'total_access', 5),
('recovery', 'grey_rock_scenarios', 'total_access', 15),
('empowerment', 'grey_rock_scenarios', 'total_access', -1),

-- Boundary Builder Limits
('foundation', 'boundary_creation', 'monthly_count', 5),
('foundation', 'boundary_templates', 'total_access', 0),
('recovery', 'boundary_creation', 'monthly_count', 25),
('recovery', 'boundary_templates', 'total_access', -1),
('empowerment', 'boundary_creation', 'monthly_count', -1),
('empowerment', 'boundary_templates', 'total_access', -1),

-- Coping Strategies Limits  
('foundation', 'coping_strategies', 'total_access', 0),
('foundation', 'coping_templates', 'total_access', 0),
('foundation', 'ai_coping_suggestions', 'monthly_count', 0),
('recovery', 'coping_strategies', 'monthly_count', 15),
('recovery', 'coping_templates', 'total_access', 10),
('recovery', 'ai_coping_suggestions', 'monthly_count', 5),
('empowerment', 'coping_strategies', 'monthly_count', -1),
('empowerment', 'coping_templates', 'total_access', -1),
('empowerment', 'ai_coping_suggestions', 'monthly_count', 15)

ON CONFLICT (subscription_tier, feature_name, limit_type) DO UPDATE SET
limit_value = EXCLUDED.limit_value;