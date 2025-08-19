import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

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

async function geminiChat(prompt: string, model?: string): Promise<string> {
  const apiKey = process.env.GOOGLE_AI_API_KEY || ''
  if (!apiKey) throw new Error('Missing GOOGLE_AI_API_KEY')
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model || DEFAULT_PAID_TIER_MODEL}:generateContent?key=${apiKey}`
  const resp = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.6, maxOutputTokens: 1024 },
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      ],
    }),
  })
  if (!resp.ok) throw new Error(`Gemini API error: ${resp.status} ${resp.statusText}`)
  const json = await resp.json()
  return json?.candidates?.[0]?.content?.parts?.[0]?.text || ''
}

// best-effort cache (per runtime instance)
const memoryCache = new Map<string, { result: any; ts: number }>()
const CACHE_TTL_MS = 10 * 60 * 1000

function hashText(input: string): string {
  let h = 0x811c9dc5
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return (h >>> 0).toString(16)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({})) as { text?: string; limit?: number; locale?: string }
    const { text, limit = 3, locale = 'en' } = body

    if (!text || typeof text !== 'string' || text.trim().length < 10) {
      return NextResponse.json({ error: 'Provide a valid description text (min 10 chars)' }, { status: 400 })
    }

    // Auth
    const authHeader = req.headers.get('authorization') || ''
    if (!authHeader) return NextResponse.json({ error: 'Authorization header required' }, { status: 401 })
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

    // Subscription tier
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier')
      .eq('id', user.id)
      .single()
    const subscriptionTier = (profile as any)?.subscription_tier || 'foundation'

    // Only for recovery or empowerment
    if (!(subscriptionTier === 'recovery' || subscriptionTier === 'empowerment')) {
      return NextResponse.json({
        error: 'AI Assist is available on Recovery and Empowerment plans',
        upgrade_required: 'recovery',
      }, { status: 403 })
    }

    // Quota check
    const monthlyLimit = (AI_LIMITS as any)[subscriptionTier]
    let currentUsage = 0
    if (monthlyLimit !== -1) {
      const { data: limitCheck, error: limitError } = await checkFeatureLimit(
        user.id,
        'ai_interactions',
        'monthly_count'
      )
      if (limitError) return NextResponse.json({ error: 'Failed to check usage limits' }, { status: 500 })
      currentUsage = (limitCheck as any)?.current_usage || 0
      if (limitCheck && currentUsage >= monthlyLimit) {
        return NextResponse.json({
          error: 'Monthly AI interaction limit reached',
          limit: monthlyLimit,
          current_usage: currentUsage,
          upgrade_required: subscriptionTier === 'recovery' ? 'empowerment' : 'empowerment'
        }, { status: 429 })
      }
    }

    // Cache
    const key = `${user.id}:${hashText(text)}:${limit}:${subscriptionTier}`
    const cached = memoryCache.get(key)
    if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
      return NextResponse.json({ success: true, ...cached.result, cached: true })
    }

    // Model
    const model = (subscriptionTier === 'recovery' || subscriptionTier === 'empowerment')
      ? DEFAULT_PAID_TIER_MODEL
      : DEFAULT_FREE_TIER_MODEL

    // Allowed keys (keep in sync with client options)
    const abuseTypes = [
      'gaslighting','love_bombing','silent_treatment','triangulation','projection','hoovering','smear_campaign','financial_abuse','emotional_manipulation','isolation','misscommitment'
    ]
    const behaviorCategoryOptions = [
      'verbal_abuse','emotional_manipulation','gaslighting','isolation','financial_control','physical_intimidation','surveillance','threats','love_bombing','silent_treatment','blame_shifting','projection'
    ]

    const prompt = `You assist a trauma-informed journaling app for survivors. Do not diagnose or label people. Infer likely behavior categories from the text conservatively and only from the allowed lists.

Return STRICT JSON only, no markdown, in this schema:
{
  "title_suggestions": [{"text": string, "confidence": number, "rationale": string}],
  "abuse_types": [{"key": string, "confidence": number, "evidence": string[]}],
  "behavior_categories": [{"key": string, "confidence": number, "evidence": string[]}],
  "warnings": string[]
}

Constraints:
- Titles: ${Math.min(Math.max(Number.isFinite(limit) ? limit : 3, 1), 5)} options, <= 60 chars, neutral, compassionate, no names.
- abuse_types keys must be from: ${abuseTypes.join(', ')}
- behavior_categories keys must be from: ${behaviorCategoryOptions.join(', ')}
- confidence is 0-1. Include short evidence quotes when possible.
- If text is too short/ambiguous, add a warning like "LOW_CONTEXT".

User text:\n"""
${text}
"""`

    const raw = await geminiChat(prompt, model)

    let parsed: any = null
    try {
      parsed = JSON.parse(raw)
    } catch {
      const m = raw.match(/\{[\s\S]*\}/)
      if (m) {
        try { parsed = JSON.parse(m[0]) } catch {}
      }
    }

    if (!parsed || typeof parsed !== 'object') {
      parsed = {
        title_suggestions: [{ text: 'Journal Entry', confidence: 0.3, rationale: 'Fallback default' }],
        abuse_types: [],
        behavior_categories: [],
        warnings: ['PARSING_FALLBACK']
      }
    }

    // Sanitize output
    const sanitizeKey = (k: any) => typeof k === 'string' ? k.trim() : ''
    const clamp = (n: any) => Math.max(0, Math.min(1, Number(n) || 0))

    parsed.title_suggestions = Array.isArray(parsed.title_suggestions) ? parsed.title_suggestions
      .map((t: any) => ({
        text: String(t?.text || 'Journal Entry').slice(0, 80),
        confidence: clamp(t?.confidence),
        rationale: String(t?.rationale || '')
      }))
      .slice(0, Math.min(Math.max(limit, 1), 5)) : [{ text: 'Journal Entry', confidence: 0.3, rationale: '' }]

    parsed.abuse_types = Array.isArray(parsed.abuse_types) ? parsed.abuse_types
      .map((i: any) => ({
        key: sanitizeKey(i?.key),
        confidence: clamp(i?.confidence),
        evidence: Array.isArray(i?.evidence) ? i.evidence.slice(0, 3).map((e: any) => String(e).slice(0, 140)) : []
      }))
      .filter((i: any) => abuseTypes.includes(i.key))
      .slice(0, 5) : []

    parsed.behavior_categories = Array.isArray(parsed.behavior_categories) ? parsed.behavior_categories
      .map((i: any) => ({
        key: sanitizeKey(i?.key),
        confidence: clamp(i?.confidence),
        evidence: Array.isArray(i?.evidence) ? i.evidence.slice(0, 3).map((e: any) => String(e).slice(0, 140)) : []
      }))
      .filter((i: any) => behaviorCategoryOptions.includes(i.key))
      .slice(0, 5) : []

    parsed.warnings = Array.isArray(parsed.warnings) ? parsed.warnings.map((w: any) => String(w)).slice(0, 5) : []

    await recordFeatureUsage(user.id, 'ai_interactions', 'monthly_count', 1, {
      feature: 'suggest_metadata',
      text_length: text.length,
      model,
      locale
    })

    const result = {
      success: true,
      model,
      title_suggestions: parsed.title_suggestions,
      abuse_types: parsed.abuse_types,
      behavior_categories: parsed.behavior_categories,
      warnings: parsed.warnings,
    }

    memoryCache.set(key, { result, ts: Date.now() })
    return NextResponse.json(result)
  } catch (error) {
    console.error('App Route suggest-metadata error:', error)
    return NextResponse.json({ error: 'Failed to generate metadata suggestions' }, { status: 500 })
  }
}

// Quick health check: visit /api/ai/suggest-metadata in the browser
export async function GET() {
  return NextResponse.json({ ok: true, route: 'ai/suggest-metadata' }, { status: 200 })
}

export const dynamic = 'force-dynamic'
