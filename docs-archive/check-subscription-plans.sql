-- Check if subscription_plans table exists and has data
SELECT * FROM subscription_plans ORDER BY sort_order;

-- If empty, insert the plans
INSERT INTO subscription_plans (
  plan_tier,
  plan_name,
  display_name, 
  description, 
  price_monthly, 
  price_yearly, 
  is_active, 
  sort_order
) VALUES
  ('foundation', 'Foundation', 'Foundation (Free)', 'Basic access for getting started', 0.00, 0.00, true, 1),
  ('recovery', 'Recovery', 'Recovery', 'AI-powered recovery tools', 15.00, 150.00, true, 2),
  ('empowerment', 'Empowered', 'Empowered', 'Complete recovery suite', 24.99, 250.00, true, 3)
ON CONFLICT (plan_tier) 
DO UPDATE SET
  plan_name = EXCLUDED.plan_name,
  display_name = EXCLUDED.display_name,
  description = EXCLUDED.description,
  price_monthly = EXCLUDED.price_monthly,
  price_yearly = EXCLUDED.price_yearly,
  is_active = EXCLUDED.is_active,
  sort_order = EXCLUDED.sort_order;

-- Verify the data
SELECT plan_tier, display_name, price_monthly, price_yearly, is_active 
FROM subscription_plans 
ORDER BY sort_order;
