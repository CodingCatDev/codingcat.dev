import { Resend } from 'resend'

const FROM_EMAIL = 'Alex Patterson <alex@codingcat.dev>'

/** Lazy Resend client — only created when actually needed (avoids build-time crash) */
let _resend: Resend | null = null
function getResendClient(): Resend {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY)
  }
  return _resend
}

/**
 * Send a sponsor-related email via Resend.
 * Falls back to console logging if RESEND_API_KEY is not set.
 */
export async function sendSponsorEmail(
  to: string,
  subject: string,
  body: string
): Promise<{ success: boolean; messageId?: string }> {
  if (!process.env.RESEND_API_KEY) {
    console.warn('[SPONSOR] RESEND_API_KEY not set — logging email instead')
    console.log('[SPONSOR] Email:', { to, subject, body: body.slice(0, 200) + '...' })
    return { success: true }
  }

  try {
    const resend = getResendClient()
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject,
      text: body,
    })

    if (error) {
      console.error('[SPONSOR] Resend error:', error)
      return { success: false }
    }

    console.log('[SPONSOR] Email sent via Resend:', { to, subject, messageId: data?.id })
    return { success: true, messageId: data?.id }
  } catch (error) {
    console.error('[SPONSOR] Failed to send email:', error)
    return { success: false }
  }
}
