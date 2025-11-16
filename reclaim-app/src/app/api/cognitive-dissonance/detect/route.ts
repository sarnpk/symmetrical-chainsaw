import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Get recent entries from different sources
    const [beliefs, gaslighting, journal, realityLog] = await Promise.all([
      supabase.from('belief_reframes').select('id, belief_text, created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(20),
      supabase.from('gaslighting_statements').select('id, their_claim, actual_truth, created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(20),
      supabase.from('journal_entries').select('id, content, created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(20),
      supabase.from('reality_logs').select('id, what_happened, created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(20)
    ])

    const entries = [
      ...(beliefs.data || []).map(b => ({ type: 'belief', id: b.id, text: b.belief_text, date: b.created_at })),
      ...(gaslighting.data || []).map(g => ({ type: 'gaslighting', id: g.id, text: `Claim: ${g.their_claim} | Truth: ${g.actual_truth}`, date: g.created_at })),
      ...(journal.data || []).map(j => ({ type: 'journal', id: j.id, text: j.content, date: j.created_at })),
      ...(realityLog.data || []).map(r => ({ type: 'reality_log', id: r.id, text: r.what_happened, date: r.created_at }))
    ]

    if (entries.length < 2) {
      return NextResponse.json({ alerts: [], message: 'Not enough entries to detect conflicts' })
    }

    // Use AI to detect conflicts
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
    const prompt = `Analyze these journal entries for cognitive dissonance - conflicting beliefs or contradictory statements about the same topic.

Entries:
${entries.map((e, i) => `${i + 1}. [${e.type}] ${e.text.substring(0, 200)}`).join('\n')}

Find pairs of entries that show cognitive dissonance (e.g., "I'm worthless" vs "I deserve respect", or contradictory memories of same event).

Return JSON array of conflicts:
[{
  "entry1_index": 0,
  "entry2_index": 3,
  "conflict_summary": "Brief description of the conflict",
  "severity": "low|medium|high"
}]

Only return the JSON array, no other text.`

    const result = await model.generateContent(prompt)
    const text = result.response.text()
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    
    if (!jsonMatch) {
      return NextResponse.json({ alerts: [] })
    }

    const conflicts = JSON.parse(jsonMatch[0])
    const alerts = []

    for (const conflict of conflicts) {
      const e1 = entries[conflict.entry1_index]
      const e2 = entries[conflict.entry2_index]
      
      if (!e1 || !e2) continue

      const { data: existing } = await supabase
        .from('cognitive_dissonance_alerts')
        .select('id')
        .eq('source_1_id', e1.id)
        .eq('source_2_id', e2.id)
        .single()

      if (existing) continue

      const { data: alert } = await supabase
        .from('cognitive_dissonance_alerts')
        .insert({
          user_id: user.id,
          alert_type: 'belief_conflict',
          severity: conflict.severity || 'medium',
          source_1_type: e1.type,
          source_1_id: e1.id,
          source_1_text: e1.text.substring(0, 500),
          source_1_date: e1.date,
          source_2_type: e2.type,
          source_2_id: e2.id,
          source_2_text: e2.text.substring(0, 500),
          source_2_date: e2.date,
          conflict_summary: conflict.conflict_summary,
          ai_analysis: text
        })
        .select()
        .single()

      if (alert) alerts.push(alert)
    }

    return NextResponse.json({ alerts, detected: alerts.length })
  } catch (error: any) {
    console.error('CD detection error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
