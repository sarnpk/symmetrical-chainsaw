# Grey Rock Scenarios: CSV Import Guide

Use this guide to bulk import or update Grey Rock scenarios in Supabase.

## Table
- Table: `public.grey_rock_scenarios`
- Columns:
  - `title` (text, required)
  - `description` (text, required)
  - `trigger` (text, required)
  - `good_response` (text, required)
  - `bad_response` (text, required)
  - `explanation` (text, required)
  - `difficulty` (easy | medium | hard)
  - `pack` (Basics | Boundaries | High-Conflict)
  - `min_tier` (foundation | recovery | empowerment)
  - `is_active` (boolean, default true)

## CSV Template
See `supabase/seed/grey_rock_scenarios.csv`.

- UTF-8 encoding
- Quotes for fields that include commas or apostrophes
- Keep header row intact

## Import Steps (Supabase Dashboard)
1. Go to Database → Tables → `grey_rock_scenarios`
2. Click Insert data → Upload CSV
3. Choose `supabase/seed/grey_rock_scenarios.csv`
4. Map columns automatically; verify the preview
5. Import

Alternatively, use SQL:
```sql
-- Example single insert
insert into public.grey_rock_scenarios (
  title, description, trigger, good_response, bad_response, explanation,
  difficulty, pack, min_tier, is_active
) values (
  'Work Performance Criticism',
  'Your ex criticizes your work performance in front of your children',
  '"You''re so incompetent at your job, no wonder the kids don''t respect you."',
  '"Okay." (then redirect conversation to the children)',
  '"That''s not true! I work very hard and my boss appreciates me!"',
  'The good response avoids taking the bait and doesn''t provide emotional fuel. The bad response shows you''re affected and gives them ammunition.',
  'medium','Basics','foundation', true
);
```

## Tips
- Use `is_active = false` to stage drafts.
- Keep packs balanced (e.g., Basics ~20, Boundaries ~20, High-Conflict ~10 for a total of 50).
- You can safely edit content without redeploying the app.
