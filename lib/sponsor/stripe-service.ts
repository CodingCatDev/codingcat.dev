/**
 * Stripe service for sponsor invoicing.
 * 
 * STUBBED — needs STRIPE_SECRET_KEY
 * TODO: Wire up Stripe when API key is available
 */

export interface SponsorLeadForInvoice {
  _id: string
  company: string
  contactName: string
  contactEmail: string
}

export interface InvoiceResult {
  invoiceId: string
  invoiceUrl: string
}

/**
 * Create a Stripe invoice for a sponsor deal.
 * Currently stubbed — logs and returns mock data.
 */
export async function createSponsorInvoice(
  lead: SponsorLeadForInvoice,
  amount: number,
  description: string
): Promise<InvoiceResult> {
  // TODO: Wire up Stripe when STRIPE_SECRET_KEY is available
  // import Stripe from 'stripe'
  // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
  //
  // // Create or find customer
  // const customer = await stripe.customers.create({
  //   email: lead.contactEmail,
  //   name: lead.contactName,
  //   metadata: { company: lead.company, sanityLeadId: lead._id },
  // })
  //
  // // Create invoice
  // const invoice = await stripe.invoices.create({
  //   customer: customer.id,
  //   collection_method: 'send_invoice',
  //   days_until_due: 30,
  // })
  //
  // // Add line item
  // await stripe.invoiceItems.create({
  //   customer: customer.id,
  //   invoice: invoice.id,
  //   amount,
  //   currency: 'usd',
  //   description,
  // })
  //
  // // Finalize and send
  // const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id!)
  // await stripe.invoices.sendInvoice(invoice.id!)

  console.log('[SPONSOR] Invoice creation (stubbed):', {
    leadId: lead._id,
    company: lead.company,
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
