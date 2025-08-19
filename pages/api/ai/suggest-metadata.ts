// Next.js API route for AI metadata suggestions (title + behavior types)
import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'
import { geminiAI, DEFAULT_FREE_TIER_MODEL, DEFAULT_PAID_TIER_MODEL } from '../../../lib/gemini-ai'
import { AI_LIMITS } from '../../../lib/usage-limits'
import { checkFeatureLimit, recordFeatureUsage } from '../../../lib/supabase'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// best-effort cache
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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const { text, limit = 3, locale = 'en' } = req.body as { text?: string; limit?: number; locale?: string }

    if (!text || typeof text !== 'string' || text.trim().length < 10) {
      return res.status(400).json({ error: 'Provide a valid description text (min 10 chars)' })
    }

    // Auth
    const authHeader = req.headers.authorization
    if (!authHeader) return res.status(401).json({ error: 'Authorization header required' })
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) return res.status(401).json({ error: 'Invalid token' })

    // Subscription tier
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier')
      .eq('id', user.id)
      .single()
    const subscriptionTier = profile?.subscription_tier || 'foundation'

    // Only for recovery or empowerment
    if (!(subscriptionTier === 'recovery' || subscriptionTier === 'empowerment')) {
      return res.status(403).json({
        error: 'AI Assist is available on Recovery and Empowerment plans',
        upgrade_required: 'recovery'
      })
    }

    // Quota check
    const monthlyLimit = AI_LIMITS[subscriptionTier as keyof typeof AI_LIMITS]
    let currentUsage = 0
    if (monthlyLimit !== -1) {
      const { data: limitCheck, error: limitError } = await checkFeatureLimit(
        user.id,
        'ai_interactions',
        'monthly_count'
      )
      if (limitError) return res.status(500).json({ error: 'Failed to check usage limits' })
      currentUsage = limitCheck?.current_usage || 0
      if (limitCheck && currentUsage >= monthlyLimit) {
        return res.status(429).json({
          error: 'Monthly AI interaction limit reached',
          limit: monthlyLimit,
          current_usage: currentUsage,
          upgrade_required: subscriptionTier === 'recovery' ? 'empowerment' : 'empowerment'
        })
      }
    }

    // Cache
    const key = `${user.id}:${hashText(text)}:${limit}:${subscriptionTier}`
    const cached = memoryCache.get(key)
    if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
      return res.status(200).json({ success: true, ...cached.result, cached: true })
    }

    // Model
    const model = subscriptionTier === 'recovery' || subscriptionTier === 'empowerment'
      ? DEFAULT_PAID_TIER_MODEL
      : DEFAULT_FREE_TIER_MODEL

    // Allowed keys (server-side copy kept in sync with client options)
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

User text:\n"""\n${text}\n"""`

    const raw = await geminiAI.chat(prompt, [], 'general', model)

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

    // Record usage
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
    return res.status(200).json(result)
  } catch (error) {
    console.error('Suggest-metadata API error:', error)
    return res.status(500).json({ error: 'Failed to generate metadata suggestions' })
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '2mb',
    },
  },
}
