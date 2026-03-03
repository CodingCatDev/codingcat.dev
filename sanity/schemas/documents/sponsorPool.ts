import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'sponsorPool',
  title: 'Sponsor Pool',
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
      name: 'website',
      title: 'Website',
      type: 'url',
    }),
    defineField({
      name: 'industry',
      title: 'Industry',
      type: 'string',
    }),
    defineField({
      name: 'relevanceScore',
      title: 'Relevance Score',
      type: 'number',
      description: 'Score from 1-10 indicating relevance to CodingCat.dev audience',
      validation: (rule) => rule.min(1).max(10),
    }),
    defineField({
      name: 'lastContactedAt',
      title: 'Last Contacted At',
      type: 'datetime',
    }),
    defineField({
      name: 'optedOut',
      title: 'Opted Out',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'optOutToken',
      title: 'Opt-Out Token',
      type: 'string',
      description: 'Auto-generated UUID for opt-out links',
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
      industry: 'industry',
    },
    prepare({ title, contactName, industry }) {
      return {
        title: title || 'Untitled Sponsor',
        subtitle: [contactName, industry].filter(Boolean).join(' · '),
      }
    },
  },
})
