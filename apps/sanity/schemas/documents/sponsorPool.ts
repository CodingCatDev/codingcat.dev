import {defineField, defineType} from 'sanity'
import {HiOutlineUserGroup} from 'react-icons/hi'

export default defineType({
  name: 'sponsorPool',
  title: 'Sponsor Pool (Outbound Prospects)',
  type: 'document',
  icon: HiOutlineUserGroup,
  fields: [
    defineField({
      name: 'companyName',
      title: 'Company Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'contactName',
      title: 'Contact Name / Role',
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
      title: 'Website',
      type: 'url',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
    }),
    defineField({
      name: 'fundingRound',
      title: 'Funding / Launch Signal',
      type: 'string',
      description: 'e.g. Seed $6M, Series A $18M, YC W26, HN Launch',
    }),
    defineField({
      name: 'source',
      title: 'Source',
      type: 'string',
      options: {
        list: [
          {title: 'Y Combinator AI / DevTools', value: 'yc'},
          {title: 'Hacker News Launch / Who Is Hiring', value: 'hackernews'},
          {title: 'LinkedIn / Funding Announcement', value: 'linkedin'},
          {title: 'Curated', value: 'curated'},
          {title: 'Enriched', value: 'enriched'},
        ],
      },
    }),
    defineField({
      name: 'relevanceScore',
      title: 'Relevance Score (0-100)',
      type: 'number',
    }),
    defineField({
      name: 'videoConcepts',
      title: 'Tailored CodingCat.dev Video Concepts (2 per Startup)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({name: 'title', title: 'Proposed Video Title', type: 'string'}),
            defineField({name: 'hook', title: '60s Short / Opening Hook', type: 'text'}),
            defineField({name: 'angle', title: 'Production Architecture Angle', type: 'text'}),
            defineField({
              name: 'targetPackage',
              title: 'Recommended Bundle',
              type: 'string',
              initialValue: 'Full-Stack Launch Bundle ($3,500)',
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'outreachDraftSubject',
      title: 'Generated Outreach Subject',
      type: 'string',
    }),
    defineField({
      name: 'outreachDraftBody',
      title: 'Generated Outreach Body',
      type: 'text',
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
      name: 'notes',
      title: 'Notes',
      type: 'text',
    }),
  ],
  preview: {
    select: {
      title: 'companyName',
      category: 'category',
      funding: 'fundingRound',
    },
    prepare({title, category, funding}) {
      return {
        title,
        subtitle: [funding, category].filter(Boolean).join(' \u00b7 '),
      }
    },
  },
})
