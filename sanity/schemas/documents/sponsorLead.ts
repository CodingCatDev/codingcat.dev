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
      name: 'source',
      title: 'Source',
      type: 'string',
      options: {
        list: [
          {title: 'Inbound', value: 'inbound'},
          {title: 'Outbound', value: 'outbound'},
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
          {title: 'Booked', value: 'booked'},
          {title: 'Paid', value: 'paid'},
        ],
      },
      initialValue: 'new',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'intent',
      title: 'Intent',
      type: 'text',
    }),
    defineField({
      name: 'rateCard',
      title: 'Rate Card',
      type: 'string',
    }),
    defineField({
      name: 'stripeInvoiceId',
      title: 'Stripe Invoice ID',
      type: 'string',
    }),
    defineField({
      name: 'bookedSlot',
      title: 'Booked Slot',
      type: 'reference',
      to: [{type: 'automatedVideo'}],
    }),
    defineField({
      name: 'threadId',
      title: 'Thread ID',
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
      source: 'source',
    },
    prepare({title, status, source}) {
      return {
        title,
        subtitle: [status, source].filter(Boolean).join(' \u00b7 '),
      }
    },
  },
})
