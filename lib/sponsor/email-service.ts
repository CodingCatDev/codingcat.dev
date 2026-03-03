/**
 * Email service for sponsor communications.
 * 
 * STUBBED — needs RESEND_API_KEY
 * TODO: Wire up Resend when API key is available
 */

export interface EmailResult {
  success: boolean
  messageId?: string
}

/**
 * Send an email to a sponsor contact.
 * Currently stubbed — logs the email and returns success.
 */
export async function sendSponsorEmail(
  to: string,
  subject: string,
  body: string
): Promise<EmailResult> {
  // TODO: Wire up Resend when RESEND_API_KEY is available
  // import { Resend } from 'resend'
  // const resend = new Resend(process.env.RESEND_API_KEY)
  // const { data, error } = await resend.emails.send({
  //   from: 'Alex Patterson <alex@codingcat.dev>',
  //   to,
  //   subject,
  //   text: body,
  // })

  console.log('[SPONSOR] Email send (stubbed):', {
    to,
    subject,
    bodyLength: body.length,
    timestamp: new Date().toISOString(),
  })

  return {
    success: true,
    messageId: `stub_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
  }
}
