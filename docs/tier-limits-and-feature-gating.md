# Tier Limits & Feature Gating Guide

GUID: 8f0a3c9e-6e3b-4c2b-8c5d-6f1a0f6ee1e4
Last updated: 2025-08-21

This document explains how monthly quotas and feature on/off per subscription tier are configured and enforced. Source of truth is Supabase `feature_limits`.

## What changed (code)
- API reads limits from Supabase instead of hardcoded maps.
  - `reclaim-app/src/app/api/ai/chat/route.ts`: uses `feature_limits('ai_interactions','monthly_count')` and `check_feature_limit()` / `record_feature_usage()`.
  - `pages/api/storage/check-cap.ts`: uses `feature_limits('storage','storage_mb')`.
  - `reclaim-app/src/app/api/usage/transcription/route.ts`: uses `feature_limits('transcription_minutes','minutes')`.

No redeploy needed when changing limits in Supabase.

## Where limits live (DB)
Table: `feature_limits`
- Columns: `subscription_tier`, `feature_name`, `limit_type`, `limit_value`.
- Semantics:
  - `limit_value = -1` → unlimited
  - `limit_value = 0` → effectively OFF for that tier (Option A gating)

Table: `usage_tracking`
- API records usage with `record_feature_usage()`.
- `check_feature_limit(user, feature, limit_type)` returns TRUE/FALSE for current monthly period.

## Supported features and limit types
- ai_interactions → `monthly_count`
- storage → `storage_mb` (MB units)
- transcription_minutes → `minutes`
- pattern_analysis → `monthly_count`
- journal_entries → `monthly_count`
- mind_reset_sessions → `monthly_count`
- boundaries → `monthly_count`
- boundary_interactions → `monthly_count`
- grey_rock_messages → `monthly_count`
- community_posts → `monthly_count`

Add rows for any new feature using the same pattern.

## Enable/Disable a feature per tier (Option A)
Set `limit_value = 0` for the tier you want OFF. Example:

```sql
-- Grey Rock: OFF for foundation, ON for recovery/empowerment
INSERT INTO feature_limits (subscription_tier, feature_name, limit_type, limit_value) VALUES
('foundation',  'grey_rock_messages', 'monthly_count', 0),
('recovery',    'grey_rock_messages', 'monthly_count', 100),
('empowerment', 'grey_rock_messages', 'monthly_count', 500)
ON CONFLICT (subscription_tier, feature_name, limit_type) DO UPDATE
SET limit_value = EXCLUDED.limit_value, updated_at = NOW();
```

UI should hide or show upgrade prompts when `limit_value <= 0`.

## Update monthly quotas
Change `limit_value` for the desired `feature_name` and `limit_type`.

```sql
-- AI Coach monthly interactions
INSERT INTO feature_limits (subscription_tier, feature_name, limit_type, limit_value) VALUES
('foundation',  'ai_interactions', 'monthly_count', 10),
('recovery',    'ai_interactions', 'monthly_count', 100),
('empowerment', 'ai_interactions', 'monthly_count', 500) -- or -1 for unlimited
ON CONFLICT (subscription_tier, feature_name, limit_type) DO UPDATE
SET limit_value = EXCLUDED.limit_value, updated_at = NOW();
```

```sql
-- Storage caps (MB)
INSERT INTO feature_limits (subscription_tier, feature_name, limit_type, limit_value) VALUES
('foundation',  'storage', 'storage_mb', 100),
('recovery',    'storage', 'storage_mb', 500),
('empowerment', 'storage', 'storage_mb', 1000)
ON CONFLICT (subscription_tier, feature_name, limit_type) DO UPDATE
SET limit_value = EXCLUDED.limit_value, updated_at = NOW();
```

```sql
-- Transcription minutes (requires 'minutes' limit_type; see migration notes)
INSERT INTO feature_limits (subscription_tier, feature_name, limit_type, limit_value) VALUES
('foundation',  'transcription_minutes', 'minutes', 10),
('recovery',    'transcription_minutes', 'minutes', 300),
('empowerment', 'transcription_minutes', 'minutes', 600)
ON CONFLICT (subscription_tier, feature_name, limit_type) DO UPDATE
SET limit_value = EXCLUDED.limit_value, updated_at = NOW();
```

## Migration notes (already applied if you followed the SQL block)
- `feature_limits.limit_type` extended to include `'minutes'`.
- `usage_tracking.usage_type` extended to include `'monthly_count'` and `'minutes'`.

## How enforcement works in APIs
- Check:
  - `check_feature_limit(user_id, feature_name, limit_type)` → if FALSE, return 403/429 with upgrade hint.
- Record:
  - On success, `record_feature_usage(user_id, feature_name, limit_type, 1, metadata)`.

## Troubleshooting
- If a limit isn’t taking effect:
  - Ensure a row exists in `feature_limits` for the (tier, feature_name, limit_type).
  - For OFF state, confirm `limit_value = 0` (not NULL).
  - Check that API is calling `check_feature_limit` with the exact `feature_name` and `limit_type` used in `feature_limits`.
  - Verify current period usage in `usage_tracking` for the user.

## Quick reference (updated files)
- `reclaim-app/src/app/api/ai/chat/route.ts`
- `pages/api/storage/check-cap.ts`
- `reclaim-app/src/app/api/usage/transcription/route.ts`

## Rollback
If needed, you can revert a feature to unlimited by setting `limit_value = -1` for that (tier, feature, type).

## Frontend integration
- __Usage overview endpoint__: Call `GET /api/usage/limits` to fetch all relevant limits and current usage in one request.
  - File: `reclaim-app/src/app/api/usage/limits/route.ts`
  - Response shape:
    - `subscription_tier`: `'foundation' | 'recovery' | 'empowerment'`
    - `ai_interactions`: `{ current, limit, remaining }`
    - `audio_transcription`: `{ current, limit: -1, duration_minutes, minutes_limit, minutes_remaining }`
    - `pattern_analysis`: `{ current, limit, remaining }`
- __Feature gating in UI__:
  - If a feature’s configured `limit_value` is `0` for the user’s tier, hide primary entry points and show an upgrade prompt.
  - For quotas (`> 0`), display remaining usage and disable actions when remaining is `0`.
- __Optimistic UX__:
  - You can pre‑check limits via `GET /api/usage/limits` to guide the UI, but always rely on server enforcement for the final check.

## Helper functions (client/server usage)
- `checkFeatureLimit(userId, featureName, limitType?)` → returns `{ data, error }` where `data` is allowed (boolean) from RPC `check_feature_limit`.
- `recordFeatureUsage(userId, featureName, usageType?, usageCount?, metadata?)` → `{ data, error }` via RPC `record_feature_usage`.
- Location: `lib/supabase.ts`.
- Example (server route `ai/chat` already uses this):
  - Check before execution; record on success with `usageType = 'monthly_count'` and `usageCount = 1`.

## API examples (cURL)
- __AI usage info ping__ (special message hook in `ai/chat`):
  ```bash
  curl -X POST \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"message":"__GET_USAGE_INFO__"}' \
    https://<your-host>/api/ai/chat
  ```
- __Transcription remaining minutes__:
  ```bash
  curl -X GET -H "Authorization: Bearer $TOKEN" \
    https://<your-host>/api/usage/transcription
  ```
- __Storage cap check__ before upload:
  ```bash
  curl -X POST \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"incoming_bytes": 5242880}' \
    https://<your-host>/api/storage/check-cap
  ```

## Adding a new feature to gate
1. __Choose identifiers__:
   - `feature_name`: short snake_case identifier, e.g., `community_posts`.
   - `limit_type`: one of existing types or add new (see migration notes). Prefer reusing `monthly_count`.
2. __Insert limits__ per tier into `feature_limits`.
3. __Enforce in API__:
   - Read limit from `feature_limits` for the user’s tier.
   - If `limit_value === 0`, return `403/429` with upgrade hint.
   - Else, call `checkFeatureLimit()`; if disallowed, return `429`.
   - On success, call `recordFeatureUsage()` with appropriate `usageType` and `usageCount`.
4. __Expose to UI__ via `GET /api/usage/limits` or a feature‑specific endpoint.

## Testing checklist
- __Happy path__: Within quota returns 200 and records usage.
- __Exhausted quota__: Returns 429 with `limit` and `upgrade_required` fields where applicable.
- __Tier OFF__: With `limit_value = 0`, feature endpoints immediately return 403/429.
- __Unlimited__: With `limit_value = -1`, endpoints skip the `checkFeatureLimit` gate but may still return usage info.
- __Period boundaries__: On the 1st of the month UTC, counters reset.
- __Auth missing__: Returns 401.

## FAQ
- __Do I need to redeploy after changing limits?__ No. Values are read from DB at request time.
- __How do I hard-disable a feature for a tier?__ Set `limit_value = 0` for that (tier, feature, type).
- __How do I compute “remaining”?__ `remaining = limit_value - current_usage` (or `-1` for unlimited). See implementations in `ai/chat` and `usage/limits` routes.
- __Where are RPCs defined?__ Supabase functions `check_feature_limit` and `record_feature_usage` (see `supabase/migrations/` for definitions and updates).

## Operational tips
- Keep tier strings consistent (`foundation`, `recovery`, `empowerment`).
- Prefer minutes for audio transcription limits (`limit_type = 'minutes'`).
- For new features, default foundation to `0` or a small number to force explicit pricing decisions.
