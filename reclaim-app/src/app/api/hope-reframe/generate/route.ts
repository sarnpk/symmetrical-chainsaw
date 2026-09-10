import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { geminiAI, DEFAULT_PAID_TIER_MODEL } from '@/lib/gemini-ai'
import { trackUsage } from '@/lib/usage-tracking'

const HOPE_REFRAME_SYSTEM_PROMPT = `You are a compassionate, hope-focused PTSD and trauma expert. Your goal is to gently reframe the user's distressing thought into a realistic, grounded message of hope and resilience. Always:
- Acknowledge the pain first
- Frame the hardship as temporary and normal in life
- Highlight human/children's resilience
- Reinforce unbreakable bonds and love
- End with strong, believable hope for healing and reunion
- Use warm, empathetic language. Never minimize suffering. Keep response 150-250 words.`

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      }
    )
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { input } = body

    if (!input || typeof input !== 'string' || input.trim().length === 0) {
      return NextResponse.json({ error: 'Input is required' }, { status: 400 })
    }

    // Check usage limits (non-blocking â€” if tracking fails, allow the request)
    let canUse = { allowed: true as boolean, upgrade_required: undefined as string | undefined }
    try {
      const result = await trackUsage(user.id, 'hope_reframe')
      canUse = result
    } catch (trackingError) {
      console.error('Usage tracking error (allowing request):', trackingError)
    }
    if (!canUse.allowed) {
      return NextResponse.json(
        { 
          error: 'Monthly limit reached',
          upgrade_required: canUse.upgrade_required
        },
        { status: 429 }
      )
    }

    const userPrompt = `The user is experiencing this distressing thought or situation:\n\n"${input}"\n\nProvide a compassionate, hope-focused reframe following the guidelines. After the main reframe, add a section labeled "MANTRA:" with a short 1-2 sentence mantra version they can remember.`

    const fullPrompt = `${HOPE_REFRAME_SYSTEM_PROMPT}\n\n${userPrompt}`

    const aiResponse = await geminiAI.chat(
      fullPrompt,
      [],
      'general',
      DEFAULT_PAID_TIER_MODEL
    )

    const { reframe, mantra } = parseResponse(aiResponse)

    return NextResponse.json({
      reframe,
      mantra,
      created_at: new Date().toISOString()
    })

  } catch (error) {
    console.error('Hope reframe generation error:', error)
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      { error: 'I\'m here with you. Let\'s try again in a moment.', detail: message },
      { status: 500 }
    )
  }
}

function parseResponse(response: string): { reframe: string; mantra: string } {
  const mantraMatch = response.match(/MANTRA:\s*(.+?)(?:\n\n|$)/is)
  
  let reframe = response
  let mantra = ''

  if (mantraMatch) {
    mantra = mantraMatch[1].trim()
    reframe = response.replace(/MANTRA:\s*.+?(?:\n\n|$)/is, '').trim()
  } else {
    const sentences = response.split(/(?<=[.!?])\s+/)
    if (sentences.length >= 2) {
      mantra = sentences.slice(-2).join(' ')
    } else {
      mantra = 'You are stronger than you know. Hope is real.'
    }
  }

  return { reframe, mantra }
}
