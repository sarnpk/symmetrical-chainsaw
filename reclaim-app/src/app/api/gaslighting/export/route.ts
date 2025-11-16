import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(req: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { get(name: string) { return cookieStore.get(name)?.value } } }
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: statements } = await supabase
      .from('gaslighting_statements')
      .select('*')
      .eq('user_id', user.id)
      .order('statement_date', { ascending: true })

    if (!statements || statements.length === 0) {
      return NextResponse.json({ error: 'No data' }, { status: 404 })
    }

    const topicCounts = statements.reduce((acc, s) => {
      acc[s.topic] = (acc[s.topic] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>Gaslighting Truth Journal Report</title>
<style>
body{font-family:Arial,sans-serif;max-width:900px;margin:40px auto;padding:20px}
h1{color:#dc2626;border-bottom:3px solid #dc2626;padding-bottom:10px}
.summary{background:#f3f4f6;padding:20px;border-radius:8px;margin:20px 0}
.stat{display:inline-block;margin:10px 20px 10px 0}
.stat-label{font-size:12px;color:#6b7280}
.stat-value{font-size:24px;font-weight:bold;color:#dc2626}
.statement{border:1px solid #e5e7eb;padding:20px;margin:20px 0;border-radius:8px}
.claim{background:#fef2f2;padding:15px;border-radius:8px;margin:10px 0}
.truth{background:#f0fdf4;padding:15px;border-radius:8px;margin:10px 0}
.warning{background:#fef2f2;border-left:4px solid #dc2626;padding:15px;margin:20px 0}
</style></head><body>
<h1>Gaslighting Truth Journal Report</h1>
<p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>

<div class="summary">
<h2>Summary</h2>
<div class="stat"><div class="stat-label">Total Statements</div><div class="stat-value">${statements.length}</div></div>
<div class="stat"><div class="stat-label">Avg Severity</div><div class="stat-value">${(statements.reduce((sum, s) => sum + s.gaslighting_severity, 0) / statements.length).toFixed(1)}/10</div></div>
<div class="stat"><div class="stat-label">With Evidence</div><div class="stat-value">${statements.filter(s => s.has_evidence).length}</div></div>
</div>

${statements.length > 5 ? '<div class="warning"><strong>⚠️ Pattern Alert:</strong> Multiple documented gaslighting incidents detected.</div>' : ''}

<h2>Documented Statements</h2>
${statements.map(s => `
<div class="statement">
<div style="display:flex;justify-content:space-between;margin-bottom:10px">
<span><strong>${new Date(s.statement_date).toLocaleDateString()}</strong> - ${s.topic}</span>
<span style="color:#dc2626">Severity: ${s.gaslighting_severity}/10</span>
</div>
<div class="claim"><strong>THEIR CLAIM:</strong><br>"${s.their_claim}"</div>
<div class="truth"><strong>ACTUAL TRUTH:</strong><br>${s.actual_truth}</div>
${s.has_evidence ? `<p style="color:#059669"><strong>✓ Evidence:</strong> ${s.evidence_type}</p>` : ''}
</div>
`).join('')}

<div style="margin-top:40px;padding-top:20px;border-top:1px solid #e5e7eb;color:#6b7280;font-size:12px">
<p><strong>About:</strong> This report documents gaslighting patterns for therapeutic or legal use.</p>
</div>
</body></html>`

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `attachment; filename="gaslighting-report-${new Date().toISOString().split('T')[0]}.html"`
      }
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
