import jsPDF from 'jspdf'

export type PdfInputs = {
  analysis: {
    totalEntries: number
    abuseTypeFrequency: Record<string, number>
    timePatterns: Record<string, number>
  } | null
  risk: {
    // Support both shapes from backend/frontend
    label?: 'low' | 'moderate' | 'high'
    risk_label?: 'low' | 'moderate' | 'high'
    score?: number
    reasons?: { reason: string; weight: number }[]
    top_reasons?: { reason: string; weight: number }[]
    confidence?: 'low' | 'medium' | 'high'
    uncertainty_note?: string
    timeframe?: { start: string; end: string }
    evidence_refs?: Array<{ entry_id: string; incident_date: string; matched_signals: string[]; snippet: string }>
    model?: string
  } | null
  insights: string
  timeframeLabel: string
  generatedAt?: string
  reportId?: string
  modelVersion?: string
}

const wrapLines = (doc: jsPDF, text: string, maxWidth: number) => {
  return doc.splitTextToSize(text, maxWidth)
}

// Vertical rhythm constants
const LEADING = 20 // base line height for body text
const PARA_GAP = 10 // gap after paragraph or list block
const TITLE_GAP = 14 // gap after section titles

const drawSectionTitle = (doc: jsPDF, title: string, y: number, x: number) => {
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.setTextColor(20, 20, 20)
  doc.text(title, x, y)
  doc.setFont('helvetica', 'normal')
  return y + TITLE_GAP
}

const drawParagraph = (doc: jsPDF, text: string, y: number, x: number, maxWidth: number) => {
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  doc.setTextColor(30, 30, 30)
  const lines = wrapLines(doc, text, maxWidth)
  lines.forEach((l: string) => {
    doc.text(l, x, y)
    y += LEADING
  })
  y += PARA_GAP
  return y
}

const drawBulletList = (doc: jsPDF, items: string[], y: number, x: number, maxWidth: number) => {
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  doc.setTextColor(30, 30, 30)
  const bulletX = x + 4
  const textX = x + 12
  items.forEach((raw) => {
    const text = raw.replace(/^[-*]\s+/, '')
    const lines = wrapLines(doc, text, maxWidth - (textX - x))
    // bullet dot
    doc.setFillColor(60, 60, 60)
    const dotY = y - (LEADING / 2) + 1
    doc.circle(bulletX, dotY, 1.5, 'F')
    lines.forEach((l: string, i: number) => {
      doc.text(l, textX, y)
      y += LEADING
    })
  })
  y += PARA_GAP
  return y
}

const sanitizeMd = (s: string) => s
  .replace(/^\s*#+\s+/gm, '')
  .replace(/\*\*(.+?)\*\*/g, '$1')
  .replace(/(^|\s)[*_]([^*_]+?)[*_](?=\s|$|[.,!?:;])/g, '$1$2')

const parseMdBlocks = (md: string) => {
  const lines = (md || '').split(/\r?\n/)
  const blocks: Array<{ type: 'h' | 'p' | 'ul', content: string | string[]; level?: number }> = []
  let list: string[] | null = null
  lines.forEach((raw) => {
    const line = raw.trimEnd()
    if (/^\s*[-*]\s+/.test(line)) {
      list = list || []
      list.push(line)
      return
    }
    if (list && line.trim() === '') {
      blocks.push({ type: 'ul', content: list })
      list = null
      return
    }
    const m = line.match(/^(#{1,4})\s+(.*)$/)
    if (m) {
      if (list) { blocks.push({ type: 'ul', content: list }); list = null }
      blocks.push({ type: 'h', level: m[1].length, content: m[2] })
      return
    }
    if (line.trim() === '') {
      if (list) { blocks.push({ type: 'ul', content: list }); list = null }
      blocks.push({ type: 'p', content: '' })
      return
    }
    if (list) { blocks.push({ type: 'ul', content: list }); list = null }
    blocks.push({ type: 'p', content: line })
  })
  if (list) blocks.push({ type: 'ul', content: list })
  return blocks
}

export function exportPatternsPdf({ analysis, risk, insights, timeframeLabel, generatedAt, reportId, modelVersion }: PdfInputs) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 64 // slightly larger margins for footer breathing room
  const contentX = margin
  const maxWidth = pageWidth - margin * 2
  let y = margin
  let justStartedNewPage = false

  const ensureSpace = (needed: number = 48) => {
    if (y + needed > pageHeight - margin) {
      doc.addPage()
      y = margin
      justStartedNewPage = true
    }
  }

  // Apply a pre-title gap only if not at the top of a freshly started page
  const preTitleGap = () => {
    if (justStartedNewPage) {
      justStartedNewPage = false
      return
    }
    y += PARA_GAP
  }

  // Branding values
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const globalAny: any = (typeof window !== 'undefined') ? window : {}
  const siteUrl = (globalAny.location?.origin || process.env.NEXT_PUBLIC_SITE_URL || '').toString()
  const brandName = (process.env.NEXT_PUBLIC_BRAND_NAME || 'Reclaim').toString()

  // Header: Brand + Title on one line
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(22)
  doc.setTextColor(25, 25, 40)
  const title = `${brandName} — Pattern Analysis Report`
  doc.text(title, contentX, y)
  y += 22
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  doc.setTextColor(90, 90, 95)
  doc.text(`Timeframe: ${timeframeLabel}`, contentX, y)
  y += 14
  if (risk?.timeframe?.start && risk?.timeframe?.end) {
    doc.text(`Data window: ${new Date(risk.timeframe.start).toLocaleDateString()} – ${new Date(risk.timeframe.end).toLocaleDateString()}`, contentX, y)
    y += 14
  }
  if (generatedAt) {
    doc.text(`Generated: ${new Date(generatedAt).toLocaleString()}`, contentX, y)
    y += 18
  } else {
    y += 6
  }
  // Divider
  doc.setDrawColor(220, 224, 235)
  doc.setLineWidth(1)
  doc.line(contentX, y, contentX + maxWidth, y)
  y += 20

  // Summary card
  ensureSpace(120)
  const cardPadding = 12
  const cardHeight = 90
  doc.setFillColor(248, 249, 253)
  doc.setDrawColor(230, 234, 246)
  doc.rect(contentX, y, maxWidth, cardHeight, 'FD')
  let cy = y + cardPadding

  // Risk line with color tag (robust to label/risk_label and missing score)
  if (risk) {
    const rLabel = (risk as any).label || (risk as any).risk_label
    const rScore = typeof (risk as any).score === 'number' ? Math.round((risk as any).score) : undefined
    if (rLabel) {
      const labelText = `Risk: ${String(rLabel).toUpperCase()}${typeof rScore === 'number' ? `  (score ${rScore})` : ''}`
      const color = rLabel === 'high' ? [186, 24, 27] : rLabel === 'moderate' ? [217, 119, 6] : [21, 128, 61]
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(12)
      doc.setTextColor(color[0], color[1], color[2])
      doc.text(labelText, contentX + cardPadding, cy)
      cy += 18
    }
  }

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  doc.setTextColor(30, 30, 30)
  if (analysis) {
    doc.text(`Total incidents: ${analysis.totalEntries}`, contentX + cardPadding, cy)
    cy += LEADING
    const topCats = Object.entries(analysis.abuseTypeFrequency)
      .sort((a,b)=>b[1]-a[1]).slice(0,3).map(([k,v])=>`${k} (${v})`).join(', ')
    if (topCats) {
      const lines = wrapLines(doc, `Top categories: ${topCats}`, maxWidth - cardPadding * 2)
      lines.forEach((l: string) => { doc.text(l, contentX + cardPadding, cy); cy += LEADING })
    }
    const labelText = `Timeframe: ${timeframeLabel}`
    const lines = wrapLines(doc, labelText, maxWidth - cardPadding * 2)
    lines.forEach((l: string) => { doc.text(l, contentX + cardPadding, cy); cy += LEADING })
  }
  y += cardHeight + 24

  // AI Insights
  ensureSpace(48)
  preTitleGap()
  y = drawSectionTitle(doc, 'AI Insights', y, contentX)
  const blocks = parseMdBlocks(insights)
  blocks.forEach((b) => {
    ensureSpace(48)
    if (b.type === 'h') {
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(12)
      doc.setTextColor(35, 35, 35)
      doc.text(sanitizeMd(String(b.content)), contentX, y)
      doc.setFont('helvetica', 'normal')
      y += LEADING
      y += PARA_GAP
    } else if (b.type === 'ul') {
      y = drawBulletList(doc, b.content as string[], y, contentX, maxWidth)
    } else {
      const text = sanitizeMd(String(b.content))
      if (text.trim().length === 0) { y += PARA_GAP; return }
      y = drawParagraph(doc, text, y, contentX, maxWidth)
    }
  })
  // Extra space after insights to separate from subsequent sections
  y += PARA_GAP

  // Details
  if (analysis) {
    ensureSpace(48)
    preTitleGap()
    y = drawSectionTitle(doc, 'Details', y, contentX)
    const peaks = Object.entries(analysis.timePatterns)
      .sort((a,b)=>b[1]-a[1]).slice(0,3).map(([k,v])=>`${k}: ${v}`)
    y = drawParagraph(doc, `Peak days: ${peaks.join(', ') || 'N/A'}`, y, contentX, maxWidth)
  }

  // Risk legend & methodology
  ensureSpace(80)
  preTitleGap()
  y = drawSectionTitle(doc, 'Risk Legend & Methodology', y, contentX)
  y = drawParagraph(doc,
    'Risk is a deterministic score informed by recent severe tags, low safety ratings, and escalation in frequency. Levels: High (red), Moderate (amber), Low (green). This report summarizes patterns based on your logged entries; it is not clinical or legal advice.',
    y, contentX, maxWidth)

  // Top drivers (why the risk)
  if (risk && ((risk as any).reasons || (risk as any).top_reasons)) {
    ensureSpace(60)
    preTitleGap()
    y = drawSectionTitle(doc, 'Top Drivers', y, contentX)
    const drivers = ((risk as any).reasons || (risk as any).top_reasons) as Array<{ reason: string; weight: number }>
    const items = (drivers || []).slice(0, 5).map((r) => `• ${r.reason} (weight ${r.weight})`)
    if (items.length) {
      y = drawParagraph(doc, items.join('\n'), y, contentX, maxWidth)
    } else {
      y = drawParagraph(doc, 'N/A', y, contentX, maxWidth)
    }
  }

  // Confidence & limitations
  if (risk && ((risk as any).confidence || (risk as any).uncertainty_note)) {
    ensureSpace(60)
    preTitleGap()
    y = drawSectionTitle(doc, 'Confidence & Limitations', y, contentX)
    const conf = (risk as any).confidence ? `Confidence: ${(risk as any).confidence}. ` : ''
    const note = (risk as any).uncertainty_note ? String((risk as any).uncertainty_note) : 'Interpretation depends on the completeness of your entries.'
    y = drawParagraph(doc, `${conf}${note}`, y, contentX, maxWidth)
  }

  // Evidence appendix (limited)
  if (risk && Array.isArray((risk as any).evidence_refs) && (risk as any).evidence_refs.length) {
    // Ensure a larger block so the section title doesn't sit at page bottom
    ensureSpace(140)
    preTitleGap()
    y = drawSectionTitle(doc, 'Evidence (sample)', y, contentX)
    const refs = ((risk as any).evidence_refs as Array<any>).slice(0, 5)
    refs.forEach((e: any, idx: number) => {
      ensureSpace(60)
      const dateStr = e?.incident_date ? new Date(e.incident_date).toLocaleDateString() : '—'
      const signals = Array.isArray(e?.matched_signals) ? e.matched_signals.join(', ') : ''
      const head = `${idx + 1}. ${dateStr}${signals ? `  •  ${signals}` : ''}`
      y = drawParagraph(doc, head, y, contentX, maxWidth)
      if (e?.snippet) {
        y = drawParagraph(doc, `“${String(e.snippet).slice(0, 180)}${String(e.snippet).length > 180 ? '…' : ''}”`, y, contentX + 12, maxWidth - 12)
      }
    })
  }

  // Metadata strip
  ensureSpace(120)
  preTitleGap()
  y = drawSectionTitle(doc, 'Report Metadata', y, contentX)
  const meta: string[] = []
  if ((typeof (globalAny as any) !== 'undefined') && siteUrl) meta.push(`Site: ${siteUrl}`)
  if (typeof (risk as any)?.model === 'string') meta.push(`Model: ${(risk as any).model}`)
  // Append explicit reportId and modelVersion if provided by caller
  const metaLines: string[] = []
  if (reportId) metaLines.push(`Report ID: ${reportId}`)
  if (modelVersion) metaLines.push(`Model Version: ${modelVersion}`)
  if (meta.length) metaLines.push(meta.join('  •  '))
  if (generatedAt) metaLines.push(`Generated: ${new Date(generatedAt).toLocaleString()}`)
  y = drawParagraph(doc,
    metaLines.join('\n'),
    y, contentX, maxWidth)

  // Footer page numbers
  const pages = doc.getNumberOfPages()
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(120, 120, 120)
    const pageLabel = `Page ${i} of ${pages}`
    const pageLabelWidth = doc.getTextWidth(pageLabel)
    const year = new Date().getFullYear()
    const copyright = `© ${year} ${brandName}`
    const copyWidth = doc.getTextWidth(copyright)
    // Left: site URL (clickable)
    if (siteUrl) {
      try { (doc as any).textWithLink?.(siteUrl, margin, pageHeight - 18, { url: siteUrl }) } catch { doc.text(siteUrl, margin, pageHeight - 18) }
    }
    // Center: copyright
    doc.text(copyright, (pageWidth - copyWidth) / 2, pageHeight - 18)
    // Right: page numbers
    doc.text(pageLabel, pageWidth - margin - pageLabelWidth, pageHeight - 18)
  }

  doc.save('pattern-analysis.pdf')
}
