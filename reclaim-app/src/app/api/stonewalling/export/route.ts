import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(req: NextRequest) {
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

    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: incidents } = await supabase
      .from('stonewalling_incidents')
      .select('*')
      .eq('user_id', user.id)
      .order('incident_date', { ascending: true })

    if (!incidents || incidents.length === 0) {
      return NextResponse.json({ error: 'No data to export' }, { status: 404 })
    }

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Stonewalling Pattern Report</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 900px; margin: 40px auto; padding: 20px; }
    h1 { color: #7c3aed; border-bottom: 3px solid #7c3aed; padding-bottom: 10px; }
    .summary { background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .stat { display: inline-block; margin: 10px 20px 10px 0; }
    .stat-label { font-size: 12px; color: #6b7280; }
    .stat-value { font-size: 24px; font-weight: bold; color: #7c3aed; }
    .incident { border: 1px solid #e5e7eb; padding: 20px; margin: 20px 0; border-radius: 8px; }
    .incident-header { display: flex; justify-content: space-between; margin-bottom: 15px; }
    .incident-type { font-size: 18px; font-weight: bold; color: #1f2937; text-transform: capitalize; }
    .field { margin: 10px 0; }
    .field-label { font-weight: bold; color: #374151; }
    .warning { background: #fef2f2; border-left: 4px solid #dc2626; padding: 15px; margin: 20px 0; }
  </style>
</head>
<body>
  <h1>Stonewalling Pattern Documentation</h1>
  <p><strong>Report Generated:</strong> ${new Date().toLocaleString()}</p>
  
  <div class="summary">
    <h2>Summary Statistics</h2>
    <div class="stat">
      <div class="stat-label">Total Incidents</div>
      <div class="stat-value">${incidents.length}</div>
    </div>
    <div class="stat">
      <div class="stat-label">Avg Duration</div>
      <div class="stat-value">${Math.round(incidents.filter(i => i.duration_minutes).reduce((sum, i) => sum + i.duration_minutes, 0) / incidents.filter(i => i.duration_minutes).length) || 0}m</div>
    </div>
  </div>

  ${incidents.length > 5 ? '<div class="warning"><strong>⚠️ Pattern Alert:</strong> Multiple documented incidents of stonewalling behavior.</div>' : ''}

  <h2>Incident Timeline</h2>
  ${incidents.map(incident => `
    <div class="incident">
      <div class="incident-header">
        <div class="incident-type">${incident.shutdown_type.replace('_', ' ')}</div>
        <div>${new Date(incident.incident_date).toLocaleDateString()}</div>
      </div>
      <div class="field"><span class="field-label">Duration:</span> ${incident.duration_minutes || 'Unknown'} minutes</div>
      <div class="field"><span class="field-label">Trigger:</span> ${incident.trigger_context}</div>
      ${incident.impact_level ? `<div class="field"><span class="field-label">Impact:</span> ${incident.impact_level}/10</div>` : ''}
    </div>
  `).join('')}
</body>
</html>`

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `attachment; filename="stonewalling-report-${new Date().toISOString().split('T')[0]}.html"`
      }
    })
  } catch (error: any) {
    console.error('Export error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
