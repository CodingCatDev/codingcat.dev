import { NextResponse } from 'next/server'

/**
 * Stripe webhook handler for sponsor invoices.
 *
 * STUBBED — needs STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET
 *
 * Will handle:
 * - invoice.paid → update sponsorLead status to 'paid', assign to next video
 * - invoice.payment_failed → update sponsorLead stripePaymentStatus to 'failed'
 *
 * TODO: Wire up Stripe webhook verification and event handling
 */
export async function POST(request: Request) {
  try {
    const body = await request.text()

    // TODO: Verify Stripe webhook signature
    // const sig = request.headers.get('stripe-signature')
    // const event = stripe.webhooks.constructEvent(body, sig!, process.env.STRIPE_WEBHOOK_SECRET!)

    console.log('[SPONSOR] Stripe webhook received (stubbed):', {
      contentLength: body.length,
      timestamp: new Date().toISOString(),
    })

    // TODO: Handle events
    // switch (event.type) {
    //   case 'invoice.paid': {
    //     const invoice = event.data.object
    //     // Find sponsorLead by stripeInvoiceId
    //     // Update status to 'paid'
    //     // Update stripePaymentStatus to 'paid'
    //     // Assign to next available video
    //     break
    //   }
    //   case 'invoice.payment_failed': {
    //     const invoice = event.data.object
    //     // Find sponsorLead by stripeInvoiceId
    //     // Update stripePaymentStatus to 'failed'
    //     break
    //   }
    // }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('[SPONSOR] Stripe webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
