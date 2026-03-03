import { NextResponse } from 'next/server'
import { z } from 'zod'
import { sanityWriteClient } from '@/lib/sanity-write-client'
import { extractSponsorIntent } from '@/lib/sponsor/gemini-intent'
import { sendSponsorEmail } from '@/lib/sponsor/email-service'

const RATE_CARD = `
CodingCat.dev Sponsorship Tiers:
- Dedicated Video ($4,000) — Full dedicated video about your product
- Integrated Mid-Roll Ad ($1,800) — Mid-roll advertisement in our videos
- Quick Shout-Out ($900) — Brief mention in our videos
- Blog Post / Newsletter ($500) — Featured in our blog or newsletter
- Video Series (Custom) — Multi-video partnership series

Learn more: https://codingcat.dev/sponsorships
`.trim()

const inboundSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Valid email is required'),
  company: z.string().optional().default(''),
  message: z.string().optional().default(''),
  tiers: z.array(z.string()).optional().default([]),
})

export async function POST(request: Request) {
  // Verify webhook secret
  const webhookSecret = request.headers.get('x-webhook-secret')
  if (!webhookSecret || webhookSecret !== process.env.SPONSOR_WEBHOOK_SECRET) {
    console.error('[SPONSOR] Inbound webhook: unauthorized request')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const parsed = inboundSchema.safeParse(body)

    if (!parsed.success) {
      console.error('[SPONSOR] Inbound webhook: validation failed', parsed.error.issues)
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.issues },
        { status: 400 }
      )
    }

    const { fullName, email, company, message, tiers } = parsed.data

    // Extract intent using Gemini
    const combinedMessage = [
      company ? `Company: ${company}` : '',
      `From: ${fullName} (${email})`,
      tiers.length ? `Interested tiers: ${tiers.join(', ')}` : '',
      message,
    ]
      .filter(Boolean)
      .join('\n')

    console.log('[SPONSOR] Processing inbound inquiry from:', email)

    const intent = await extractSponsorIntent(combinedMessage)

    // Create sponsorLead in Sanity
    const leadDoc = {
      _type: 'sponsorLead',
      company: intent.company || company || 'Unknown',
      contactName: intent.contactName || fullName,
      contactEmail: email,
      source: 'inbound',
      status: 'new',
      intent: intent.intent,
      selectedTiers: tiers.length > 0 ? tiers : intent.suggestedTiers,
      threadHistory: [
        {
          _key: crypto.randomUUID(),
          date: new Date().toISOString(),
          direction: 'inbound',
          subject: `Sponsorship inquiry from ${fullName}`,
          body: message || '',
        },
      ],
      lastContactedAt: new Date().toISOString(),
    }

    const created = await sanityWriteClient.create(leadDoc)
    console.log('[SPONSOR] Created sponsor lead:', created._id)

    // Send auto-reply with rate card (stubbed)
    await sendSponsorEmail(
      email,
      `Thanks for your interest in sponsoring CodingCat.dev!`,
      `Hi ${fullName},\n\nThanks for reaching out about sponsoring CodingCat.dev! I'm excited to explore how we can work together.\n\nHere's our current rate card:\n\n${RATE_CARD}\n\nI'll review your inquiry and get back to you within 48 hours.\n\nBest,\nAlex Patterson\nCodingCat.dev`
    )

    return NextResponse.json({
      success: true,
      leadId: created._id,
      message: 'Sponsor inquiry received and processed',
    })
  } catch (error) {
    console.error('[SPONSOR] Inbound webhook error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
