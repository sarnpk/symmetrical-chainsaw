import { Resend } from 'resend'

const FROM = 'Reclaim Support <noreply@reclaimyourlife.app>'

/**
 * Send a transactional email via Resend. Never throws — failures are logged
 * and swallowed so notification delivery never breaks the calling flow.
 */
export async function sendEmail(to: string, subject: string, html: string) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY missing; skipping email to', to)
    return false
  }
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({ from: FROM, to, subject, html })
    return true
  } catch (error) {
    console.error('Failed to send email:', error)
    return false
  }
}

/**
 * Simple branded email body used by notification routes.
 */
export function notificationEmailHtml(opts: {
  title: string
  body: string
  link?: string
  cta?: string
}) {
  const { title, body, link, cta } = opts
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
      <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h1 style="font-size: 22px; margin: 0 0 12px; color: #111827;">${title}</h1>
        <p style="font-size: 16px; line-height: 1.6; color: #374151; margin: 0 0 20px;">${body}</p>
        ${
          link && cta
            ? `<a href="${link}" style="display: inline-block; background-color: #4f46e5; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-size: 15px; font-weight: 600;">${cta}</a>`
            : ''
        }
      </div>
      <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 13px;">
        <p>You received this because you have a Reclaim account. You can manage reminders in Settings.</p>
      </div>
    </div>
  `
}