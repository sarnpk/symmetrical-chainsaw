import jsPDF from 'jspdf'

export const exportMemoriesToPDF = (memories: any[], userName: string) => {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 20
  const maxWidth = pageWidth - 2 * margin
  let yPos = 20

  // Title
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text('Toxic Memory Journal', margin, yPos)
  yPos += 10

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`Export Date: ${new Date().toLocaleDateString()}`, margin, yPos)
  yPos += 5
  doc.text(`Total Memories: ${memories.length}`, margin, yPos)
  yPos += 15

  // Watermark
  doc.setFontSize(8)
  doc.setTextColor(150, 150, 150)
  doc.text('CONFIDENTIAL - For Legal/Therapeutic Use Only', margin, yPos)
  doc.setTextColor(0, 0, 0)
  yPos += 15

  memories.forEach((memory, index) => {
    if (yPos > 250) {
      doc.addPage()
      yPos = 20
    }

    // Memory number and date
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text(`Memory #${index + 1} - ${new Date(memory.memory_date).toLocaleDateString()}`, margin, yPos)
    yPos += 8

    // Tags
    if (memory.tags?.length > 0) {
      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      doc.text(`Tags: ${memory.tags.join(', ')}`, margin, yPos)
      yPos += 6
    }

    // Description
    doc.setFontSize(10)
    const lines = doc.splitTextToSize(memory.memory_text, maxWidth)
    doc.text(lines, margin, yPos)
    yPos += lines.length * 5 + 5

    // Media links
    if (memory.audio_url || memory.video_url || memory.image_urls?.length > 0) {
      doc.setFontSize(8)
      doc.setTextColor(0, 0, 255)
      if (memory.audio_url) {
        doc.text(`Audio: ${memory.audio_url}`, margin, yPos)
        yPos += 4
      }
      if (memory.video_url) {
        doc.text(`Video: ${memory.video_url}`, margin, yPos)
        yPos += 4
      }
      if (memory.image_urls?.length > 0) {
        doc.text(`Images: ${memory.image_urls.length} file(s)`, margin, yPos)
        yPos += 4
      }
      doc.setTextColor(0, 0, 0)
      yPos += 3
    }

    // AI Analysis
    if (memory.ai_analysis) {
      doc.setFontSize(9)
      doc.setFont('helvetica', 'bold')
      doc.text('AI Analysis:', margin, yPos)
      yPos += 5
      doc.setFont('helvetica', 'normal')
      
      if (memory.ai_analysis.npd_tactics?.length > 0) {
        doc.text(`Tactics: ${memory.ai_analysis.npd_tactics.join(', ')}`, margin + 5, yPos)
        yPos += 5
      }
      
      if (memory.ai_analysis.validation) {
        const validationLines = doc.splitTextToSize(memory.ai_analysis.validation, maxWidth - 5)
        doc.text(validationLines, margin + 5, yPos)
        yPos += validationLines.length * 4 + 3
      }
    }

    yPos += 10
  })

  doc.save(`toxic-memories-${new Date().toISOString().split('T')[0]}.pdf`)
}
