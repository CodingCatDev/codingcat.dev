import {defineField, defineType} from 'sanity'
import {HiOutlineUserGroup} from 'react-icons/hi'

export default defineType({
  name: 'sponsorPool',
  title: 'Sponsor Pool',
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
      title: 'Website',
      type: 'url',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
    }),
    defineField({
      name: 'source',
      title: 'Source',
      type: 'string',
      options: {
        list: [
          {title: 'Curated', value: 'curated'},
          {title: 'Enriched', value: 'enriched'},
        ],
      },
    }),
    defineField({
      name: 'relevanceScore',
      title: 'Relevance Score',
      type: 'number',
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
      subtitle: 'category',
    },
  },
})
