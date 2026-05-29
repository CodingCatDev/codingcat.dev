/**
 * Stripe service for sponsor invoicing.
 *
 * Uses lazy initialization to avoid build-time crashes on Vercel.
 * Falls back to mock data if STRIPE_SECRET_KEY is not set (dev environments).
 */

import Stripe from 'stripe'

export interface SponsorLeadForInvoice {
  _id: string
  companyName: string
  contactName: string
  contactEmail: string
}

export interface InvoiceResult {
  invoiceId: string
  invoiceUrl: string
}

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

/**
 * Create a Stripe invoice for a sponsor deal.
 * If STRIPE_SECRET_KEY is not set, logs and returns mock data (for dev environments).
 */
export async function createSponsorInvoice(
  lead: SponsorLeadForInvoice,
  amount: number,
  description: string
): Promise<InvoiceResult> {
  // Fallback for dev environments without Stripe key
  if (!process.env.STRIPE_SECRET_KEY) {
    console.log('[SPONSOR] STRIPE_SECRET_KEY not set — returning mock invoice:', {
      leadId: lead._id,
      company: lead.companyName,
      amount,
      description,
      timestamp: new Date().toISOString(),
    })

    const mockId = `inv_stub_${Date.now()}`
    return {
      invoiceId: mockId,
      invoiceUrl: `https://invoice.stripe.com/i/${mockId}`,
    }
  }

  const stripe = getStripeClient()

  // Create or find customer by email
  const existingCustomers = await stripe.customers.list({
    email: lead.contactEmail,
    limit: 1,
  })

  let customer: Stripe.Customer
  if (existingCustomers.data.length > 0) {
    customer = existingCustomers.data[0]
    console.log('[SPONSOR] Found existing Stripe customer:', customer.id)
  } else {
    customer = await stripe.customers.create({
      email: lead.contactEmail,
      name: lead.contactName,
      metadata: {
        companyName: lead.companyName,
        sanityLeadId: lead._id,
      },
    })
    console.log('[SPONSOR] Created new Stripe customer:', customer.id)
  }

  // Create invoice with 30-day terms
  const invoice = await stripe.invoices.create({
    customer: customer.id,
    collection_method: 'send_invoice',
    days_until_due: 30,
    metadata: {
      sanityLeadId: lead._id,
      companyName: lead.companyName,
    },
  })

  // Add line item with amount and description
  await stripe.invoiceItems.create({
    customer: customer.id,
    invoice: invoice.id,
    amount, // amount in cents
    currency: 'usd',
    description,
  })

  // Finalize and send invoice
  const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id!)
  await stripe.invoices.sendInvoice(invoice.id!)

  console.log('[SPONSOR] Invoice created and sent:', {
    invoiceId: finalizedInvoice.id,
    invoiceUrl: finalizedInvoice.hosted_invoice_url,
    leadId: lead._id,
    company: lead.companyName,
    amount,
  })

  return {
    invoiceId: finalizedInvoice.id,
    invoiceUrl: finalizedInvoice.hosted_invoice_url || `https://invoice.stripe.com/i/${finalizedInvoice.id}`,
  }
}
