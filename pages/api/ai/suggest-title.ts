// Next.js API route for AI "Suggest title"
import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'
import { geminiAI, DEFAULT_FREE_TIER_MODEL, DEFAULT_PAID_TIER_MODEL } from '../../../lib/gemini-ai'
import { AI_LIMITS } from '../../../lib/usage-limits'
import { checkFeatureLimit, recordFeatureUsage } from '../../../lib/supabase'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Best-effort in-memory cache (serverless lifecycle dependent)
// Key: `${userId}:${hash}` -> { suggestions: string[], ts: number }
const memoryCache = new Map<string, { suggestions: string[]; ts: number }>()
const CACHE_TTL_MS = 10 * 60 * 1000 // 10 minutes

function hashText(input: string): string {
  // Simple deterministic hash (FNV-1a 32-bit)
  let h = 0x811c9dc5
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return (h >>> 0).toString(16)
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { text, n = 5 } = req.body as { text?: string; n?: number }

    if (!text || typeof text !== 'string' || text.trim().length < 8) {
      return res.status(400).json({ error: 'Provide a valid description text (min 8 chars)' })
    }

    // Auth
    const authHeader = req.headers.authorization
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization header required' })
    }
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid token' })
    }

    // Get subscription tier
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier')
      .eq('id', user.id)
      .single()

    const subscriptionTier = profile?.subscription_tier || 'foundation'

    // Enforce quota using existing ai_interactions monthly counter
    const monthlyLimit = AI_LIMITS[subscriptionTier as keyof typeof AI_LIMITS]
    let currentUsage = 0

    if (monthlyLimit !== -1) {
      const { data: limitCheck, error: limitError } = await checkFeatureLimit(
        user.id,
        'ai_interactions',
        'monthly_count'
      )
      if (limitError) {
        console.error('Error checking feature limit:', limitError)
        return res.status(500).json({ error: 'Failed to check usage limits' })
      }
      currentUsage = limitCheck?.current_usage || 0
      if (limitCheck && currentUsage >= monthlyLimit) {
        return res.status(429).json({
          error: 'Monthly AI interaction limit reached',
          limit: monthlyLimit,
          current_usage: currentUsage,
          upgrade_required: subscriptionTier === 'foundation' ? 'recovery' : 'empowerment'
        })
      }
    }

    // Best-effort cache lookup
    const key = `${user.id}:${hashText(text)}`
    const cached = memoryCache.get(key)
    if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
      return res.status(200).json({
        success: true,
        suggestions: cached.suggestions,
        cached: true,
        usage_info: {
          subscription_tier: subscriptionTier,
          monthly_limit: monthlyLimit,
          remaining: monthlyLimit === -1 ? -1 : Math.max(0, monthlyLimit - currentUsage)
        }
      })
    }

    // Select model
    const model = subscriptionTier === 'foundation' ? DEFAULT_FREE_TIER_MODEL : DEFAULT_PAID_TIER_MODEL

    // Prompt Gemini to output JSON array of titles only
    const prompt = `You are helping a trauma-informed journaling app suggest a concise, neutral, and non-blaming title for a personal incident log. 
- Generate ${Math.min(Math.max(Number.isFinite(n) ? n : 5, 3), 7)} clear, short titles (4-9 words each).
- Do not include sensitive details or names.
- Avoid judgmental language. Keep compassionate, factual, and neutral.
- Output ONLY a compact JSON array of strings. No prose, no markdown, no labels.

Journal context:
"""
${text}
"""`
`
Return JSON like ["Title 1", "Title 2", ...]`
`
If you cannot produce good titles, return ["Journal Entry"].`
`
Ensure strictly valid JSON.`

    const raw = await geminiAI.chat(prompt, [], 'general', model)

    let suggestions: string[] = []
    try {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        suggestions = parsed.filter((s) => typeof s === 'string').slice(0, Math.min(Math.max(n, 3), 7))
      }
    } catch {
      // Fallback: try to sanitize simple list formats
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

    if (!suggestions.length) {
      suggestions = ['Journal Entry']
    }

    // Record usage (counts as 1 ai_interaction)
    await recordFeatureUsage(user.id, 'ai_interactions', 'monthly_count', 1, {
      feature: 'suggest_title',
      text_length: text.length,
      model
    })

    // Store in best-effort cache
    memoryCache.set(key, { suggestions, ts: Date.now() })

    return res.status(200).json({
      success: true,
      suggestions,
      cached: false,
      usage_info: {
        subscription_tier: subscriptionTier,
        monthly_limit: monthlyLimit,
        remaining: monthlyLimit === -1 ? -1 : Math.max(0, monthlyLimit - currentUsage - 1)
      }
    })
  } catch (error) {
    console.error('Suggest-title API error:', error)
    return res.status(500).json({
      error: 'Failed to generate title suggestions',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '2mb',
    },
  },
}
