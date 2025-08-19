import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Create a server client using service role (required for usage RPC + bypassing RLS when needed)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Local constants and helpers to avoid cross-package imports
const AI_LIMITS = {
  foundation: 10,
  recovery: 100,
  empowerment: -1,
} as const

const DEFAULT_FREE_TIER_MODEL = 'gemini-2.5-flash-lite'
const DEFAULT_PAID_TIER_MODEL = 'gemini-1.5-flash'

// FNV-1a hash for simple caching keys
function hashText(input: string): string {
  let h = 0x811c9dc5
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return (h >>> 0).toString(16)
}

async function geminiChat(prompt: string, model?: string): Promise<string> {
  const apiKey = process.env.GOOGLE_AI_API_KEY || ''
  if (!apiKey) throw new Error('Missing GOOGLE_AI_API_KEY')
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model || DEFAULT_PAID_TIER_MODEL}:generateContent?key=${apiKey}`
  const resp = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.5, maxOutputTokens: 512 },
    }),
  })
  if (!resp.ok) throw new Error(`Gemini API error: ${resp.status} ${resp.statusText}`)
  const json = await resp.json()
  return json?.candidates?.[0]?.content?.parts?.[0]?.text || ''
}

async function checkFeatureLimit(userId: string, featureName: string, limitType: string) {
  const { data, error } = await supabase.rpc('check_feature_limit', {
    p_user_id: userId,
    p_feature_name: featureName,
    p_limit_type: limitType,
  })
  return { data, error }
}

async function recordFeatureUsage(
  userId: string,
  featureName: string,
  usageType: string,
  usageCount: number,
  metadata: Record<string, any>
) {
  const { data, error } = await supabase.rpc('record_feature_usage', {
    p_user_id: userId,
    p_feature_name: featureName,
    p_usage_type: usageType,
    p_usage_count: usageCount,
    p_metadata: metadata,
  })
  return { data, error }
}

// Best-effort in-memory cache
const memoryCache = new Map<string, { suggestions: string[]; ts: number }>()
const CACHE_TTL_MS = 10 * 60 * 1000

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({})) as { text?: string; n?: number }
    const { text, n = 5 } = body

    if (!text || typeof text !== 'string' || text.trim().length < 8) {
      return NextResponse.json({ error: 'Provide a valid description text (min 8 chars)' }, { status: 400 })
    }

    // Auth
    const authHeader = request.headers.get('authorization') || ''
    if (!authHeader) {
      return NextResponse.json({ error: 'Authorization header required' }, { status: 401 })
    }
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Subscription
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier')
      .eq('id', user.id)
      .single()
    const subscriptionTier = (profile as any)?.subscription_tier || 'foundation'

    // Quota
    const monthlyLimit = (AI_LIMITS as any)[subscriptionTier]
    let currentUsage = 0
    if (monthlyLimit !== -1) {
      const { data: limitCheck, error: limitError } = await checkFeatureLimit(
        user.id,
        'ai_interactions',
        'monthly_count'
      )
      if (limitError) {
        return NextResponse.json({ error: 'Failed to check usage limits' }, { status: 500 })
      }
      currentUsage = (limitCheck as any)?.current_usage || 0
      if (limitCheck && currentUsage >= monthlyLimit) {
        return NextResponse.json({
          error: 'Monthly AI interaction limit reached',
          limit: monthlyLimit,
          current_usage: currentUsage,
          upgrade_required: subscriptionTier === 'foundation' ? 'recovery' : 'empowerment'
        }, { status: 429 })
      }
    }

    // Cache
    const key = `${user.id}:${hashText(text)}:${n}`
    const cached = memoryCache.get(key)
    if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
      return NextResponse.json({ success: true, suggestions: cached.suggestions, cached: true })
    }

    // Model selection
    const model = subscriptionTier === 'foundation' ? DEFAULT_FREE_TIER_MODEL : DEFAULT_PAID_TIER_MODEL

    const prompt = `Role: Trauma-informed journaling assistant with expertise in recognizing manipulation patterns (e.g., gaslighting, blame-shifting, DARVO, intermittent reinforcement, silent treatment, triangulation). Do NOT diagnose or label people; avoid clinical claims. Focus on the user's lived experience.

Task: Suggest ${Math.min(Math.max(Number.isFinite(n) ? n : 5, 3), 7)} concise, specific, and compassionate incident titles that reflect the core pattern or theme present in the text.

Style constraints:
- 4–10 words each, neutral and non-blaming.
- Prefer clear pattern words when appropriate (e.g., "Gaslighting", "Blame Shifting", "DARVO Response", "Invalidation", "Stonewalling", "Love Bombing").
- Avoid names or sensitive identifiers. No diagnosis or labels about a person.
- No emojis, no quotes, no markdown.

Return ONLY a compact JSON array of strings. Nothing else.

Journal text:
"""
${text}
"""

Examples of good titles (for inspiration; do not copy):
- "Gaslighting After Confrontation"
- "DARVO Following Boundary Request"
- "Blame Shifting Over Past Issue"
- "Invalidation During Vulnerability"
- "Silent Treatment After Disagreement"

If context is too thin, return a safe generic like ["Journal Entry"]. Ensure strictly valid JSON.`

    const raw = await geminiChat(prompt, model)

    let suggestions: string[] = []
    try {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        suggestions = parsed.filter((s) => typeof s === 'string').slice(0, Math.min(Math.max(n, 3), 7))
      }
    } catch {
      const m = raw.match(/\[(.|\n|\r)*\]/)
      if (m) {
        try {
          const parsed = JSON.parse(m[0])
          if (Array.isArray(parsed)) {
            suggestions = parsed.filter((s) => typeof s === 'string').slice(0, Math.min(Math.max(n, 3), 7))
          }
        } catch {}
      }
    }

    if (!suggestions.length) suggestions = ['Journal Entry']

    await recordFeatureUsage(user.id, 'ai_interactions', 'monthly_count', 1, {
      feature: 'suggest_title',
      text_length: text.length,
      model
    })

    memoryCache.set(key, { suggestions, ts: Date.now() })

    return NextResponse.json({ success: true, suggestions })
  } catch (error) {
    console.error('Suggest-title (app route) error:', error)
    return NextResponse.json({ error: 'Failed to generate title suggestions' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, route: 'ai/suggest-title' })
}
