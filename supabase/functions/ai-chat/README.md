# AI Chat Edge Function (Deprecated)

Status: Deprecated for the web app. The web UI now uses the Next.js App Router endpoints under `reclaim-app/src/app/api/ai/*`.

## Why deprecated
- The Next.js API integrates directly with the web session, cookies, and UI thread persistence.
- It centralizes auth, usage caps, rolling history, and context handling in one place.
- Avoids CORS and duplication across two backends.

## Current web API (single source of truth)
- POST /api/ai/chat
- GET  /api/ai/threads
- GET  /api/ai/thread-messages

Code: `reclaim-app/src/app/api/ai/*`

## When to use this Edge Function
Use this only if you need a public, cross‑platform API (e.g., mobile app or partner integrations). If so, ensure:
- Auth: Pass a valid Supabase JWT as `Authorization: Bearer <token>`
- Env vars are configured in the Supabase project:
  - `SUPABASE_URL`
  - `SUPABASE_ANON_KEY`
  - `GEMINI_API_KEY` (or rename to match your provider)
- CORS is configured appropriately.

## Example request (if re‑enabled)
```bash
curl -X POST \
  -H "Authorization: Bearer <supabase_jwt>" \
  -H "Content-Type: application/json" \
  https://<project-ref>.functions.supabase.co/ai-chat \
  -d '{
        "message": "Hello",
        "conversationId": "<uuid>",
        "context": "general"
      }'
```

## Notes
- Keep the function source for reference. Do not call it from the web app.
- If you later adopt this as the backend for mobile clients, consider consolidating the prompt, limits, and history logic with the Next.js implementation to avoid drift.
