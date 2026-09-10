import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    const { email, stage, stageName, confidence, tool, severity } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
    }

    // Store in newsletter_subscriptions table
    const { error: dbError } = await supabase
      .from('newsletter_subscriptions')
      .upsert({
        email,
        source: tool || 'lead-magnet',
        metadata: {
          stage,
          stageName,
          confidence,
          severity,
          tool,
          captured_at: new Date().toISOString()
        }
      }, {
        onConflict: 'email'
      })

    if (dbError) {
      console.error('Database error:', dbError)
    }

    // Send email based on tool type
    await sendLeadMagnetEmail(email, tool, { stage, stageName, confidence, severity })

    console.log('Lead Magnet Capture:', {
      email,
      tool,
      stage,
      stageName,
      confidence,
      severity,
      timestamp: new Date().toISOString()
    })

    return NextResponse.json({ 
      success: true,
      message: 'Guide sent! Check your email.'
    })

  } catch (error) {
    console.error('Lead capture error:', error)
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
  }
}

async function sendLeadMagnetEmail(email: string, tool: string, data: any) {
  const emailContent = getEmailContent(tool, data)
  
  console.log('EMAIL TO SEND:', {
    to: email,
    subject: emailContent.subject,
    content: emailContent.body,
    attachments: emailContent.attachments
  })
  
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    
    await resend.emails.send({
      from: 'Reclaim Support <noreply@reclaimyourlife.app>',
      to: email,
      subject: emailContent.subject,
      html: emailContent.body
    })
    
    console.log('âœ… Email sent successfully to:', email)
  } catch (error) {
    console.error('âŒ Failed to send email:', error)
    // Don't throw error - we still want to save the lead even if email fails
  }
}

function getEmailContent(tool: string, data: any) {
  const baseStyle = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
      <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
  `
  const footerStyle = `
      </div>
      <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px;">
        <p>You're receiving this because you requested a guide from Reclaim.</p>
        <p>Visit <a href="https://reclaimyourlife.app" style="color: #3b82f6;">reclaimyourlife.app</a> for more resources.</p>
      </div>
    </div>
  `

  switch (tool) {
    case 'gaslighting-reality-check':
      return {
        subject: 'ðŸŽ Your Free Reality Anchor Kit is Here!',
        body: baseStyle + `
          <h2 style="color: #1f2937; margin-bottom: 20px;">Your Reality Anchor Kit</h2>
          <p style="color: #374151; line-height: 1.6;">Hi there!</p>
          <p style="color: #374151; line-height: 1.6;">Thank you for taking the Gaslighting Reality Check. Your results showed <strong>${data.severity || 'concerning'}</strong> patterns that deserve attention.</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 6px; margin: 20px 0;">
            <h3 style="color: #1f2937; margin-top: 0;">Your Reality Anchor Kit includes:</h3>
            <ul style="color: #374151; line-height: 1.8;">
              <li>âœ“ 15 gaslighting phrases to watch for</li>
              <li>âœ“ Reality validation checklist</li>
              <li>âœ“ Memory documentation template</li>
              <li>âœ“ Trusted person conversation guide</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://reclaimyourlife.app/docs/reality-anchor-kit.pdf" 
               style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              ðŸ“¥ Download Your Reality Anchor Kit
            </a>
          </div>
          
          <div style="background-color: #fef3c7; padding: 15px; border-radius: 6px; border-left: 4px solid #f59e0b;">
            <p style="margin: 0; color: #92400e; font-weight: 500;">ðŸ’› Remember: You're not crazy. Your feelings are valid.</p>
          </div>
        ` + footerStyle
      }
    
    default:
      const stageName = data.stageName || 'Survival'
      return {
        subject: `ðŸŽ Your Free "${stageName}" Guide is Ready`,
        body: baseStyle + `
          <h2 style="color: #1f2937; margin-bottom: 20px;">Your ${stageName} Guide</h2>
          <p style="color: #374151; line-height: 1.6;">Based on your assessment results, you're experiencing the <strong>${stageName.toLowerCase()}</strong> stage.</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 6px; margin: 20px 0;">
            <p style="color: #374151; margin: 0;">Your personalized guide includes:</p>
            <ul style="color: #374151; line-height: 1.8; margin-top: 10px;">
              <li>âœ“ Stage-specific action plans</li>
              <li>âœ“ Warning signs to watch for</li>
              <li>âœ“ Coping strategies and resources</li>
              <li>âœ“ Next steps for your healing journey</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://reclaimyourlife.app/docs/${data.stage || 'survival'}-guide.pdf" 
               style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              ðŸ“¥ Download Your ${stageName} Guide
            </a>
          </div>
          
          <div style="background-color: #ecfdf5; padding: 15px; border-radius: 6px; border-left: 4px solid #10b981;">
            <p style="margin: 0; color: #047857; font-weight: 500;">ðŸ’š You're taking important steps toward healing and reclaiming your life.</p>
          </div>
        ` + footerStyle
      }
  }
}