import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js'
import { PDFDocument, StandardFonts, rgb, PDFName, PDFArray, PDFNumber, PDFString } from 'pdf-lib'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY as string

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(req.url)
    const format = (searchParams.get('format') || 'md').toLowerCase()
    const redact = searchParams.get('redact') === 'true'
    const includeLinks = (searchParams.get('includeLinks') ?? 'true').toLowerCase() !== 'false'

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: 'Server not configured' }, { status: 500 })
    }

    
    const cookieStore = cookies()
    const supabaseAuth = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          try { cookieStore.set({ name, value, ...options }) } catch {}
        },
        remove(name: string, options: any) {
          try { cookieStore.set({ name, value: '', ...options }) } catch {}
        },
      },
    })

    const { data: userRes } = await supabaseAuth.auth.getUser()
    const user = userRes?.user
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const supabaseAdmin = createSupabaseAdmin(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // Get profile for tier gating
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('subscription_tier')
      .eq('id', user.id)
      .maybeSingle()

    const tier = (profile?.subscription_tier || 'foundation') as 'foundation' | 'recovery' | 'empowerment'
    if (format === 'pdf' && tier === 'foundation') {
      return NextResponse.json({ error: 'PDF export requires Recovery tier' }, { status: 403 })
    }

    // Validate ownership and load entry
    const { data: entry, error: entryErr } = await supabaseAdmin
      .from('journal_entries')
      .select('*')
      .eq('id', params.id)
      .maybeSingle()

    if (entryErr || !entry) return NextResponse.json({ error: 'Entry not found' }, { status: 404 })
    if (entry.user_id !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    // Load evidence metadata
    const { data: evidence } = await supabaseAdmin
      .from('evidence_files')
      .select('id,file_name,file_type,caption,uploaded_at,storage_bucket,storage_path,transcription')
      .eq('journal_entry_id', params.id)
      .order('uploaded_at', { ascending: true })

    // Build Markdown
    const lines: string[] = []
    lines.push(`# ${entry.title || 'Journal Entry'}`)
    lines.push('')
    lines.push(`Date: ${new Date(entry.incident_date || entry.created_at).toLocaleString()}`)
    if (entry.location && !redact) lines.push(`Location: ${entry.location}`)
    lines.push(`Safety: ${entry.safety_rating}/5`)
    if (typeof entry.mood_rating === 'number') lines.push(`Mood: ${entry.mood_rating}/10`)
    lines.push('')
    if (entry.description) {
      lines.push('## What happened')
      lines.push('')
      lines.push(entry.description)
      lines.push('')
    }
    if (entry.abuse_types?.length) {
      lines.push('## Behavior types')
      for (const t of entry.abuse_types) lines.push(`- ${t.replace('_', ' ')}`)
      lines.push('')
    }
    if (!redact && (entry.emotional_state_before || entry.emotional_state_after)) {
      lines.push('## Emotional impact')
      if (entry.emotional_state_before) lines.push(`- Before: ${entry.emotional_state_before}`)
      if (entry.emotional_state_after) lines.push(`- After: ${entry.emotional_state_after}`)
      lines.push('')
    }
    if (evidence?.length) {
      lines.push('## Evidence')
      for (const f of evidence) {
        const name = f.file_name || f.storage_path
        const cap = redact ? '' : (f.caption ? ` — ${f.caption}` : '')
        lines.push(`- ${name}${cap}`)
        if (!redact && f.transcription) {
          const snippet = String(f.transcription).slice(0, 600)
          lines.push(`  - Transcript: ${snippet}${f.transcription.length > 600 ? '…' : ''}`)
        }
      }
      lines.push('')
    }

    const md = lines.join('\n')

    if (format === 'md') {
      return new NextResponse(md, {
        status: 200,
        headers: {
          'Content-Type': 'text/markdown; charset=utf-8',
          'Content-Disposition': `attachment; filename="journal-${params.id}.md"`,
        },
      })
    }

    // Generate PDF
    const pdfDoc = await PDFDocument.create()
    let page = pdfDoc.addPage([595.28, 841.89]) // A4 portrait in points
    let { width, height } = page.getSize()
    const margin = 50
    let y = height - margin
    
    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
    const lineHeight = 16
    const sectionGap = 10
    const maxWidth = width - margin * 2
    const siteUrl = process.env.BRAND_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || ''

    // Helper: shorten URL for display while keeping full link as annotation
    const formatUrlDisplay = (url: string) => {
      try {
        const u = new URL(url)
        const parts = u.pathname.split('/').filter(Boolean)
        const tail = parts[parts.length - 1] || ''
        const base = `${u.hostname}/${parts.length > 1 ? '…/' : ''}${tail}`
        return base.length > 60 ? `${base.slice(0, 57)}…` : base
      } catch {
        return url.length > 60 ? `${url.slice(0, 57)}…` : url
      }
    }

    const drawTextWrapped = (text: string, options?: { fontSize?: number; bold?: boolean }) => {
      const fontSize = options?.fontSize ?? 12
      const font = options?.bold ? fontBold : fontRegular
      const words = text.split(/\s+/)
      let line = ''
      const lines: string[] = []
      for (const w of words) {
        const test = line ? line + ' ' + w : w
        const testWidth = font.widthOfTextAtSize(test, fontSize)
        if (testWidth > maxWidth && line) {
          lines.push(line)
          line = w
        } else {
          line = test
        }
      }
      if (line) lines.push(line)

      for (const l of lines) {
        if (y - lineHeight < margin) {
          // new page
          page = pdfDoc.addPage([595.28, 841.89])
          const size = page.getSize()
          width = size.width
          height = size.height
          y = height - margin
        }
        page.drawText(l, { x: margin, y: y - lineHeight, size: fontSize, font, color: rgb(0, 0, 0) })
        y -= lineHeight
      }
      y -= 4 // small gap
    }

    const drawHeading = (text: string) => {
      y -= sectionGap
      drawTextWrapped(text, { fontSize: 14, bold: true })
    }

    const ensureSpace = (needed: number) => {
      if (y - needed < margin) {
        page = pdfDoc.addPage([595.28, 841.89])
        const size = page.getSize()
        width = size.width
        height = size.height
        y = height - margin
        // Repeat header on new page
        drawBrandHeader()
      }
    }

    // Helper: format diarized transcript to readable speaker lines
    function formatTranscript(raw: string): string {
      try {
        // Attempt JSON parsing (Gladia diarization)
        const obj = JSON.parse(raw)
        const segs: any[] = obj?.segments || obj?.result?.segments || []
        if (Array.isArray(segs) && segs.length) {
          const lines: string[] = []
          for (const s of segs) {
            const start = Number(s.start ?? s.start_time ?? s.from) || 0
            const end = Number(s.end ?? s.end_time ?? s.to) || start
            const txt = String(s.text ?? s.transcript ?? '').trim()
            const isUser = Boolean(s.is_user ?? s.speaker?.is_user)
            const name = (s.speaker_name || s.speaker_label || s.speaker || (isUser ? 'You' : 'Speaker')).toString()
            if (txt) {
              const mmss = (t: number) => {
                const m = Math.floor(t / 60)
                const sec = Math.floor(t % 60)
                return `${m}:${sec.toString().padStart(2, '0')}`
              }
              lines.push(`${name} [${mmss(start)}–${mmss(end)}]: ${txt}`)
            }
          }
          if (lines.length) return lines.slice(0, 12).join('\n')
        }
      } catch {}
      try {
        // Fallback: normalize diarized text already stringified
        let text = raw.replace(/\r\n|\r/g, '\n').replace(/\t/g, ' ').replace(/ +/g, ' ')
        text = text.replace(/\s*(Speaker_\d+\s*\(([^)]+)\)\s*\[[^\]]*\]:)/g, '\n$1 ')
        text = text.replace(/Speaker_\d+\s*\(([^)]+)\)\s*\[[^\]]*\]:\s*/g, (_m, name) => `${name}: `)
        text = text.trim()
        const lines = text.split(/\n+/).map(l => l.trim()).filter(Boolean)
        return lines.slice(0, 12).join('\n')
      } catch {
        return raw
      }
    }

    // Helper: wrap text into lines for custom containers
    const wrapLines = (text: string, maxWidthPx: number, opts?: { fontSize?: number; bold?: boolean; maxLines?: number }) => {
      const fontSize = opts?.fontSize ?? 11
      const font = opts?.bold ? fontBold : fontRegular
      const maxLines = opts?.maxLines
      const words = String(text).split(/\s+/)
      let line = ''
      const lines: string[] = []
      for (const w of words) {
        const test = line ? line + ' ' + w : w
        const testWidth = font.widthOfTextAtSize(test, fontSize)
        if (testWidth > maxWidthPx && line) {
          lines.push(line)
          if (maxLines && lines.length >= maxLines) break
          line = w
        } else {
          line = test
        }
      }
      if (!maxLines || lines.length < maxLines) {
        if (line) lines.push(line)
      }
      return lines
    }

    // Helper: add clickable link annotation over a rectangle
    const addLinkAnnotation = (p: typeof page, x: number, yBaseline: number, text: string, fontSize: number, url: string) => {
      try {
        if (!url) return
        const heightApprox = fontSize + 4
        const widthPx = fontRegular.widthOfTextAtSize(text, fontSize)
        // Convert to PDF rect: [x1, y1, x2, y2] using bottom-left origin
        const rect = pdfDoc.context.obj([
          PDFNumber.of(x),
          PDFNumber.of(yBaseline - heightApprox),
          PDFNumber.of(x + widthPx),
          PDFNumber.of(yBaseline + 2),
        ])

        const linkAnnot = pdfDoc.context.obj({
          Type: PDFName.of('Annot'),
          Subtype: PDFName.of('Link'),
          Rect: rect,
          Border: pdfDoc.context.obj([0, 0, 0]),
          A: pdfDoc.context.obj({
            Type: PDFName.of('Action'),
            S: PDFName.of('URI'),
            URI: PDFString.of(url),
          }),
        })

        let annots = p.node.lookup(PDFName.of('Annots'), PDFArray)
        if (!annots) {
          annots = pdfDoc.context.obj([])
          p.node.set(PDFName.of('Annots'), annots)
        }
        annots.push(linkAnnot)
      } catch {}
    }

    // Optional logo
    let embeddedLogo: any = null
    const logoUrl = process.env.BRAND_LOGO_PNG_URL
    if (logoUrl) {
      try {
        const res = await fetch(logoUrl)
        if (res.ok) {
          const buf = await res.arrayBuffer()
          embeddedLogo = await pdfDoc.embedPng(buf)
        }
      } catch {}
    }

    // Branded header
    const drawBrandHeader = () => {
      const brandTitle = 'Reclaim Journal Export'
      const ts = new Date().toLocaleString()
      ensureSpace(48)
      let leftX = margin
      let headerTop = y
      if (embeddedLogo) {
        const targetH = 22
        const scale = targetH / embeddedLogo.height
        const drawW = embeddedLogo.width * scale
        page.drawImage(embeddedLogo, { x: margin, y: y - targetH, width: drawW, height: targetH })
        leftX = margin + drawW + 10
      }
      page.drawText(brandTitle, { x: leftX, y: headerTop - 18, size: 16, font: fontBold, color: rgb(0.15, 0.15, 0.3) })
      page.drawText(ts, { x: leftX, y: headerTop - 34, size: 10, font: fontRegular, color: rgb(0.3, 0.3, 0.3) })
      y -= 40
      // divider
      page.drawLine({ start: { x: margin, y }, end: { x: width - margin, y }, thickness: 1, color: rgb(0.85, 0.85, 0.9) })
      y -= 12
    }

    drawBrandHeader()

    // Title
    drawTextWrapped(entry.title || 'Journal Entry', { fontSize: 20, bold: true })
    y -= 8

    // Meta
    drawTextWrapped(`Date: ${new Date(entry.incident_date || entry.created_at).toLocaleString()}`)
    if (entry.location && !redact) drawTextWrapped(`Location: ${entry.location}`)
    drawTextWrapped(`Safety: ${entry.safety_rating}/5`)
    if (typeof entry.mood_rating === 'number') drawTextWrapped(`Mood: ${entry.mood_rating}/10`)

    // Description
    if (entry.description) {
      drawHeading('What happened')
      drawTextWrapped(entry.description)
    }

    // Behavior types
    if (entry.abuse_types?.length) {
      drawHeading('Behavior types')
      for (const t of entry.abuse_types) drawTextWrapped(`• ${t.replace('_', ' ')}`)
    }

    // Emotional impact
    if (!redact && (entry.emotional_state_before || entry.emotional_state_after)) {
      drawHeading('Emotional impact')
      if (entry.emotional_state_before) drawTextWrapped(`Before: ${entry.emotional_state_before}`)
      if (entry.emotional_state_after) drawTextWrapped(`After: ${entry.emotional_state_after}`)
    }

    // Evidence list
    if (evidence?.length) {
      drawHeading('Evidence')
      for (const f of evidence) {
        const name = f.file_name || f.storage_path
        const cap = redact ? '' : (f.caption ? ` — ${f.caption}` : '')
        drawTextWrapped(`• ${name}${cap}`)
        if (!redact && f.transcription) {
          const formatted = formatTranscript(String(f.transcription))
          const snippet = formatted.slice(0, 600)
          drawTextWrapped(`Transcript:`)
          drawTextWrapped(snippet + (formatted.length > 600 ? '…' : ''))
        }
      }

      // Inline images
      const imageFiles = (evidence || []).filter(f => (f.file_type || '').startsWith('image/'))
      if (imageFiles.length && !redact) {
        drawHeading('Evidence Photos')
        for (const f of imageFiles) {
          try {
            const { data: fileData } = await supabaseAdmin.storage
              .from(f.storage_bucket as string)
              .download(f.storage_path as string)
            if (!fileData) continue
            const buf = await fileData.arrayBuffer()
            const isPng = (f.file_type || '').includes('png') || (f.file_name || '').toLowerCase().endsWith('.png')
            const isJpg = (f.file_type || '').includes('jpg') || (f.file_type || '').includes('jpeg') || (f.file_name || '').toLowerCase().match(/\.jpe?g$/)
            let embedded
            if (isPng) embedded = await pdfDoc.embedPng(buf)
            else if (isJpg) embedded = await pdfDoc.embedJpg(buf)
            else continue

            const imgWidth = embedded.width
            const imgHeight = embedded.height
            const maxImgWidth = maxWidth
            const scale = Math.min(1, maxImgWidth / imgWidth)
            const drawW = imgWidth * scale
            const drawH = imgHeight * scale

            ensureSpace(drawH + 36)
            page.drawImage(embedded, { x: margin, y: y - drawH, width: drawW, height: drawH })
            y -= drawH + 6
            if (f.caption) {
              drawTextWrapped(`Caption: ${f.caption}`)
            }
            y -= 6
          } catch {}
        }
      }
    }

    // Append Audio Evidence section at the end
    if (!redact) {
      const audioFiles = (evidence || []).filter(f => (f.file_type || '').startsWith('audio/'))
      if (audioFiles.length) {
        drawHeading('Audio Evidence')
        for (const f of audioFiles) {
          const name = f.file_name || f.storage_path
          const cap = f.caption ? ` — ${f.caption}` : ''
          // Get a link for the audio
          let urlText = ''
          try {
            const signed = await supabaseAdmin.storage
              .from(f.storage_bucket as string)
              .createSignedUrl(f.storage_path as string, 3600)
            urlText = signed.data?.signedUrl || ''
            if (!urlText) {
              const pub = await supabaseAdmin.storage
                .from(f.storage_bucket as string)
                .getPublicUrl(f.storage_path as string)
              urlText = pub.data?.publicUrl || ''
            }
          } catch {}

          const formatted = f.transcription ? formatTranscript(String(f.transcription)) : ''
          const snippet = formatted
            ? formatted.slice(0, 600) + (formatted.length > 600 ? '…' : '')
            : 'No transcript available.'

          // Compute dynamic bubble height
          const bubblePadding = 10
          const bubbleWidth = width - margin * 2
          const innerX = margin + bubblePadding
          const innerMaxWidth = bubbleWidth - bubblePadding * 2
          const textLines = wrapLines(snippet, innerMaxWidth, { fontSize: 11 })
          const maxTextLines = Math.min(8, textLines.length)
          const titleBlock = 20
          const urlBlock = includeLinks && urlText ? 14 : 0
          const contentBlock = maxTextLines * lineHeight + 6
          const bubbleHeight = bubblePadding + titleBlock + (urlBlock ? (urlBlock + 2) : 0) + contentBlock + bubblePadding

          ensureSpace(bubbleHeight + 10)
          const bubbleTop = y
          // Draw bubble background and border
          page.drawRectangle({ x: margin, y: bubbleTop - bubbleHeight, width: bubbleWidth, height: bubbleHeight, color: rgb(0.96, 0.97, 1) })
          page.drawRectangle({ x: margin, y: bubbleTop - bubbleHeight, width: bubbleWidth, height: bubbleHeight, borderColor: rgb(0.82, 0.86, 0.98), borderWidth: 1, opacity: 0 })

          // Title line
          page.drawText(`• ${name}${cap}`, { x: margin + bubblePadding, y: bubbleTop - 20, size: 12, font: fontBold, color: rgb(0.12, 0.12, 0.2) })

          // URL line and clickable annotation (optional)
          let cursorY = bubbleTop - 26
          if (includeLinks && urlText) {
            const urlY = bubbleTop - 34
            const label = 'Click here to listen'
            page.drawText(label, { x: margin + bubblePadding, y: urlY, size: 10, font: fontRegular, color: rgb(0.1, 0.35, 0.8) })
            addLinkAnnotation(page, margin + bubblePadding, urlY, label, 10, urlText)
            cursorY = bubbleTop - 40
          }

          // Snippet body within bubble
          y = cursorY
          for (const l of textLines.slice(0, maxTextLines)) {
            page.drawText(l, { x: innerX, y: y - lineHeight, size: 11, font: fontRegular, color: rgb(0.2, 0.2, 0.2) })
            y -= lineHeight
          }
          // Move below bubble
          y = bubbleTop - bubbleHeight - 10
        }
      }
    }

    // Footer with site URL and page numbers
    const pagesForFooter = pdfDoc.getPages()
    const totalPages = pagesForFooter.length
    for (let i = 0; i < totalPages; i++) {
      const p = pagesForFooter[i]
      const size = p.getSize()
      const footerY = 24
      const leftText = String(siteUrl)
      const rightText = `Page ${i + 1} of ${totalPages}`
      // Left
      p.drawText(leftText, { x: margin, y: footerY, size: 10, font: fontRegular, color: rgb(0.4, 0.4, 0.4) })
      // Right aligned
      const rightWidth = fontRegular.widthOfTextAtSize(rightText, 10)
      p.drawText(rightText, { x: size.width - margin - rightWidth, y: footerY, size: 10, font: fontRegular, color: rgb(0.4, 0.4, 0.4) })
    }

    const pdfBytes = await pdfDoc.save()
    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="journal-${params.id}.pdf"`,
        'Content-Length': String(pdfBytes.length),
      },
    })
  } catch (e) {
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}
