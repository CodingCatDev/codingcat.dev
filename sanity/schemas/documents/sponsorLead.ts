import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'sponsorLead',
  title: 'Sponsor Lead',
  type: 'document',
  fields: [
    defineField({
      name: 'company',
      title: 'Company',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'contactName',
      title: 'Contact Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: 'source',
      title: 'Source',
      type: 'string',
      options: {
        list: [
          { title: 'Inbound', value: 'inbound' },
          { title: 'Outbound', value: 'outbound' },
        ],
      },
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      initialValue: 'new',
      options: {
        list: [
          { title: 'New', value: 'new' },
          { title: 'Contacted', value: 'contacted' },
          { title: 'Negotiating', value: 'negotiating' },
          { title: 'Agreed', value: 'agreed' },
          { title: 'Invoiced', value: 'invoiced' },
          { title: 'Paid', value: 'paid' },
          { title: 'Assigned', value: 'assigned' },
          { title: 'Declined', value: 'declined' },
        ],
      },
    }),
    defineField({
      name: 'intent',
      title: 'Intent',
      type: 'text',
      description: 'Gemini-extracted intent from inbound messages',
    }),
    defineField({
      name: 'selectedTiers',
      title: 'Selected Tiers',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Dedicated Video', value: 'dedicated-video' },
          { title: 'Integrated Mid-Roll Ad', value: 'mid-roll-ad' },
          { title: 'Quick Shout-Out', value: 'shout-out' },
          { title: 'Blog Post / Newsletter', value: 'blog-newsletter' },
          { title: 'Video Series', value: 'video-series' },
        ],
      },
    }),
    defineField({
      name: 'dealValue',
      title: 'Deal Value (cents)',
      type: 'number',
      description: 'Agreed amount in cents',
    }),
    defineField({
      name: 'stripeInvoiceId',
      title: 'Stripe Invoice ID',
      type: 'string',
    }),
    defineField({
      name: 'stripePaymentStatus',
      title: 'Stripe Payment Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending', value: 'pending' },
          { title: 'Paid', value: 'paid' },
          { title: 'Failed', value: 'failed' },
          { title: 'Refunded', value: 'refunded' },
        ],
      },
    }),
    // TODO: Replace with reference to 'automatedVideo' once that schema is built by @content
    defineField({
      name: 'assignedVideo',
      title: 'Assigned Video',
      type: 'string',
      description: 'TODO: Change to reference type once automatedVideo schema exists',
    }),
    defineField({
      name: 'threadHistory',
      title: 'Thread History',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'date',
              title: 'Date',
              type: 'datetime',
            }),
            defineField({
              name: 'direction',
              title: 'Direction',
              type: 'string',
              options: {
                list: [
                  { title: 'Inbound', value: 'inbound' },
                  { title: 'Outbound', value: 'outbound' },
                ],
              },
            }),
            defineField({
              name: 'subject',
              title: 'Subject',
              type: 'string',
            }),
            defineField({
              name: 'body',
              title: 'Body',
              type: 'text',
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'lastContactedAt',
      title: 'Last Contacted At',
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
      title: 'company',
      contactName: 'contactName',
      status: 'status',
    },
    prepare({ title, contactName, status }) {
      return {
        title: title || 'Untitled Lead',
        subtitle: [contactName, status].filter(Boolean).join(' · '),
      }
    },
  },
})
