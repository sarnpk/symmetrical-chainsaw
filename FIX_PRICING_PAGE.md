# Fix Pricing Page - Missing Table

## Problem
The pricing page shows $0 because the `subscription_plans` table doesn't exist in Supabase.

## Solution

### Option 1: Run SQL in Supabase Dashboard (RECOMMENDED)

1. Go to your Supabase project: https://supabase.com/dashboard
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy and paste the contents of `supabase/create_subscription_plans_table.sql`
5. Click "Run" button
6. Refresh your pricing page

### Option 2: Quick Fix - Use the SQL Below

Run this in Supabase SQL Editor:

```sql
-- Create subscription_plans table
CREATE TABLE IF NOT EXISTS public.subscription_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_tier subscription_tier NOT NULL UNIQUE,
  display_name text NOT NULL,
  description text NOT NULL,
  price_monthly numeric(10,2) NOT NULL DEFAULT 0,
  price_yearly numeric(10,2) NOT NULL DEFAULT 0,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Insert default subscription plans
INSERT INTO public.subscription_plans (plan_tier, display_name, description, price_monthly, price_yearly, sort_order) VALUES
('foundation', 'Foundation (Free)', 'Basic access to get started', 0.00, 0.00, 1),
('recovery', 'Recovery', 'AI-powered recovery tools', 15.00, 150.00, 2),
('empowerment', 'Empowered', 'Complete recovery suite', 24.99, 249.90, 3)
ON CONFLICT (plan_tier) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  description = EXCLUDED.description,
  price_monthly = EXCLUDED.price_monthly,
  price_yearly = EXCLUDED.price_yearly,
  sort_order = EXCLUDED.sort_order,
  updated_at = now();

-- Add RLS policies
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Subscription plans are viewable by everyone"
  ON public.subscription_plans FOR SELECT
  USING (is_active = true);

-- Grant permissions
GRANT SELECT ON public.subscription_plans TO anon, authenticated;
```

## Verify It Works

1. After running the SQL, go to: http://localhost:3000/pricing
2. You should now see:
   - Foundation: $0
   - Recovery: $15.00/month or $150/year
   - Empowered: $24.99/month or $249.90/year

## Update Prices Later

To change prices, run SQL in Supabase:

```sql
UPDATE public.subscription_plans 
SET price_monthly = 19.99, price_yearly = 199.90
WHERE plan_tier = 'recovery';
```

## Done!
Your pricing page will now fetch and display correct prices from the database.
