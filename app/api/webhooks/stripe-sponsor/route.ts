import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { sanityWriteClient } from '@/lib/sanity-write-client'

/**
 * Stripe webhook handler for sponsor invoices.
 *
 * Handles:
 * - invoice.paid → update sponsorLead status to 'paid', assign to next video
 * - invoice.payment_failed → update sponsorLead status back to 'negotiating'
 */

/** Lazy Stripe client — only created when actually needed */
let _stripe: Stripe | null = null
function getStripeClient(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY not set')
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  }
  return _stripe
}

export async function POST(request: Request) {
  try {
    const body = await request.text()
    const sig = request.headers.get('stripe-signature')

    if (!sig) {
      console.error('[SPONSOR] Missing stripe-signature header')
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
    }

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.error('[SPONSOR] STRIPE_WEBHOOK_SECRET not set')
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
    }

    // Verify webhook signature
    const stripe = getStripeClient()
    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
    } catch (err) {
      console.error('[SPONSOR] Webhook signature verification failed:', err)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    console.log('[SPONSOR] Stripe webhook received:', {
      type: event.type,
      id: event.id,
      timestamp: new Date().toISOString(),
    })

    switch (event.type) {
      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice
        console.log('[SPONSOR] Invoice paid:', invoice.id)

        // Find the sponsorLead by stripeInvoiceId in Sanity
        const lead = await sanityWriteClient.fetch(
          `*[_type == "sponsorLead" && stripeInvoiceId == $invoiceId][0]`,
          { invoiceId: invoice.id }
        )

        if (!lead) {
          console.warn('[SPONSOR] No sponsorLead found for invoice:', invoice.id)
          break
        }

        // Update status to 'paid'
        await sanityWriteClient
          .patch(lead._id)
          .set({
            status: 'paid',
            stripePaymentStatus: 'paid',
          })
          .commit()

        console.log('[SPONSOR] Updated sponsorLead to paid:', lead._id)

        // Find next available automatedVideo (status script_ready or later, no sponsorSlot assigned)
        const availableVideo = await sanityWriteClient.fetch(
          `*[_type == "automatedVideo" && status in ["script_ready", "media_ready", "ready_to_publish"] && !defined(bookedSlot)][0]{
            _id,
            title,
            status
          }`
        )

        if (availableVideo) {
          // Assign the lead to the video via bookedSlot
          await sanityWriteClient
            .patch(availableVideo._id)
            .set({
              bookedSlot: {
                _type: 'reference',
                _ref: lead._id,
              },
            })
            .commit()

          console.log('[SPONSOR] Assigned lead to video:', {
            leadId: lead._id,
            videoId: availableVideo._id,
            videoTitle: availableVideo.title,
          })
        } else {
          console.warn('[SPONSOR] No available video found for lead:', lead._id)
        }

        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        console.log('[SPONSOR] Invoice payment failed:', invoice.id)

        // Find the sponsorLead by stripeInvoiceId in Sanity
        const lead = await sanityWriteClient.fetch(
          `*[_type == "sponsorLead" && stripeInvoiceId == $invoiceId][0]`,
          { invoiceId: invoice.id }
        )

        if (!lead) {
          console.warn('[SPONSOR] No sponsorLead found for failed invoice:', invoice.id)
          break
        }

        // Update sponsorLead status back to 'negotiating'
        await sanityWriteClient
          .patch(lead._id)
          .set({
            status: 'negotiating',
            stripePaymentStatus: 'failed',
          })
          .commit()

        console.log('[SPONSOR] Updated sponsorLead to negotiating (payment failed):', lead._id)
        break
      }

      default:
        console.log('[SPONSOR] Unhandled webhook event type:', event.type)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('[SPONSOR] Stripe webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
