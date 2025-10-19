
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'sponsorshipRequest',
  title: 'Sponsorship Request',
  type: 'document',
  fields: [
    defineField({
      name: 'fullName',
      title: 'Full Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email Address',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'companyName',
      title: 'Company Name',
      type: 'string',
    }),
    defineField({
      name: 'sponsorshipTier',
      title: 'Sponsorship Tier',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: 'Dedicated Video', value: 'dedicated-video'},
          {title: 'Integrated Mid-Roll Ad', value: 'mid-roll-ad'},
          {title: 'Quick Shout-Out', value: 'shout-out'},
          {title: 'Blog Post / Newsletter', value: 'blog-newsletter'},
          {title: 'Video Series', value: 'video-series'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'message',
      title: 'Message',
      type: 'text',
    }),
  ],
  preview: {
    select: {
      title: 'companyName',
      subtitle: 'fullName',
    },
  },
})
