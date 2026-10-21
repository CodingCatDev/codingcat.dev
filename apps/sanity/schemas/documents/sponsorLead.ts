import {defineField, defineType} from 'sanity'
import {HiOutlineCurrencyDollar} from 'react-icons/hi'

export default defineType({
  name: 'sponsorLead',
  title: 'Sponsor Lead',
  type: 'document',
  icon: HiOutlineCurrencyDollar,
  fields: [
    defineField({
      name: 'companyName',
      title: 'Company Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'contactName',
      title: 'Contact Name',
      type: 'string',
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'website',
      title: 'Company Website',
      type: 'url',
    }),
    defineField({
      name: 'portalToken',
      title: 'Deal Room Portal Token',
      type: 'string',
      description: 'Unique token used for codingcat.dev/portal/[token]',
    }),
    defineField({
      name: 'source',
      title: 'Source',
      type: 'string',
      options: {
        list: [
          {title: 'Inbound Website', value: 'inbound'},
          {title: 'Gmail Thread', value: 'gmail'},
          {title: 'Outbound Scraper', value: 'outbound'},
          {title: 'Fast-Track Booking', value: 'booking'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'New', value: 'new'},
          {title: 'Contacted', value: 'contacted'},
          {title: 'Replied', value: 'replied'},
          {title: 'Negotiating', value: 'negotiating'},
          {title: 'Deposit Sent', value: 'deposit_sent'},
          {title: 'Deposit Paid (50%)', value: 'deposit_paid'},
          {title: 'Booked / In Production', value: 'booked'},
          {title: 'Balance Sent', value: 'balance_sent'},
          {title: 'Paid in Full (100%)', value: 'paid'},
        ],
      },
      initialValue: 'new',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'rateCard',
      title: 'Package / Rate Card Tier',
      type: 'string',
      options: {
        list: [
          {title: 'Full-Stack Launch Bundle ($3,500)', value: 'full-stack-launch'},
          {title: 'Sponsored Podcast & Multi-Channel Showcase ($2,000)', value: 'podcast-showcase'},
          {title: 'Ecosystem Integration / Mid-Roll + Social Pack ($950)', value: 'ecosystem-integration'},
          {title: 'Dedicated YouTube Video ($2,500)', value: 'dedicated-video'},
          {title: 'Integrated Mid-Roll Ad ($1,800)', value: 'mid-roll-ad'},
          {title: 'Custom Video Series (Custom)', value: 'custom-series'},
        ],
      },
    }),
    defineField({
      name: 'totalAmountCents',
      title: 'Total Package Amount (Cents)',
      type: 'number',
      description: 'Total contract value in USD cents (e.g. 350000 = $3,500.00)',
    }),
    defineField({
      name: 'depositAmountCents',
      title: '50% Upfront Deposit Amount (Cents)',
      type: 'number',
      description: '50% deposit required to lock calendar & production slot',
    }),
    defineField({
      name: 'balanceAmountCents',
      title: '50% Final Balance Amount (Cents)',
      type: 'number',
      description: '50% remaining balance due upon publication',
    }),
    defineField({
      name: 'depositPaidAt',
      title: '50% Deposit Paid At',
      type: 'datetime',
    }),
    defineField({
      name: 'balancePaidAt',
      title: '50% Balance Paid At',
      type: 'datetime',
    }),
    defineField({
      name: 'stripeDepositCheckoutUrl',
      title: 'Stripe 50% Deposit Checkout URL',
      type: 'url',
    }),
    defineField({
      name: 'stripeDepositInvoiceId',
      title: 'Stripe 50% Deposit Invoice ID (Net-15/30)',
      type: 'string',
    }),
    defineField({
      name: 'stripeDepositInvoiceUrl',
      title: 'Stripe 50% Deposit Hosted Invoice URL',
      type: 'url',
    }),
    defineField({
      name: 'stripeBalanceCheckoutUrl',
      title: 'Stripe 50% Balance Checkout URL',
      type: 'url',
    }),
    defineField({
      name: 'stripeBalanceInvoiceId',
      title: 'Stripe 50% Balance Invoice ID (Net-15/30)',
      type: 'string',
    }),
    defineField({
      name: 'stripeBalanceInvoiceUrl',
      title: 'Stripe 50% Balance Hosted Invoice URL',
      type: 'url',
    }),
    defineField({
      name: 'stripeInvoiceId',
      title: 'Legacy Stripe Invoice ID',
      type: 'string',
    }),
    defineField({
      name: 'intent',
      title: 'Campaign Goals & Intent',
      type: 'text',
    }),
    defineField({
      name: 'deliverables',
      title: 'Campaign Deliverables & Live ROI Tracking',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({name: 'title', title: 'Deliverable Title', type: 'string'}),
            defineField({
              name: 'channel',
              title: 'Channel',
              type: 'string',
              options: {
                list: [
                  {title: 'YouTube Long-Form', value: 'youtube'},
                  {title: 'YouTube Short', value: 'youtube-short'},
                  {title: 'CodingCat.dev Canonical Blog + AEO', value: 'blog'},
                  {title: 'Dev.to & Hashnode Syndication', value: 'syndication'},
                  {title: 'X (@CodingCatDev + @codercatdev)', value: 'x'},
                  {title: 'LinkedIn', value: 'linkedin'},
                  {title: 'Bluesky / Threads / Mastodon / TikTok / IG', value: 'shorts-network'},
                ],
              },
            }),
            defineField({
              name: 'status',
              title: 'Status',
              type: 'string',
              options: {
                list: [
                  {title: 'Pending Deposit', value: 'pending'},
                  {title: 'In Production', value: 'in-progress'},
                  {title: 'Scheduled in Postiz', value: 'scheduled'},
                  {title: 'Published', value: 'published'},
                ],
              },
              initialValue: 'pending',
            }),
            defineField({name: 'url', title: 'Live URL', type: 'url'}),
            defineField({name: 'views', title: 'Verified Views / Impressions', type: 'number'}),
            defineField({name: 'publishedAt', title: 'Published At', type: 'datetime'}),
          ],
        },
      ],
    }),
    defineField({
      name: 'bookedSlot',
      title: 'Booked Slot',
      type: 'reference',
      to: [{type: 'automatedVideo'}],
    }),
    defineField({
      name: 'sponsorDocId',
      title: 'Linked Sponsor',
      type: 'reference',
      to: [{type: 'sponsor'}],
      description: 'Public sponsor document created when lead converts to paid',
      readOnly: true,
    }),
    defineField({
      name: 'threadId',
      title: 'Gmail Thread ID',
      type: 'string',
    }),
    defineField({
      name: 'lastEmailAt',
      title: 'Last Email At',
      type: 'datetime',
    }),
    defineField({
      name: 'notes',
      title: 'Notes',
      type: 'text',
    }),
  ],
  preview: {
    select: {
      title: 'companyName',
      status: 'status',
      rateCard: 'rateCard',
      source: 'source',
    },
    prepare({title, status, rateCard, source}) {
      return {
        title,
        subtitle: [status, rateCard, source].filter(Boolean).join(' \u00b7 '),
      }
    },
  },
})
