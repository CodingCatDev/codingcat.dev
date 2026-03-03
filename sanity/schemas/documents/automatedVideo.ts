import {defineField, defineType} from 'sanity'
import {HiOutlineVideoCamera} from 'react-icons/hi'

export default defineType({
  name: 'automatedVideo',
  title: 'Automated Video',
  type: 'document',
  icon: HiOutlineVideoCamera,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'contentIdea',
      title: 'Content Idea',
      type: 'reference',
      to: [{type: 'contentIdea'}],
    }),
    defineField({
      name: 'script',
      title: 'Script',
      type: 'object',
      fields: [
        defineField({
          name: 'hook',
          title: 'Hook',
          type: 'text',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'scenes',
          title: 'Scenes',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                defineField({
                  name: 'sceneNumber',
                  title: 'Scene Number',
                  type: 'number',
                }),
                defineField({
                  name: 'narration',
                  title: 'Narration',
                  type: 'text',
                  validation: (Rule) => Rule.required(),
                }),
                defineField({
                  name: 'visualDescription',
                  title: 'Visual Description',
                  type: 'text',
                }),
                defineField({
                  name: 'bRollKeywords',
                  title: 'B-Roll Keywords',
                  type: 'array',
                  of: [{type: 'string'}],
                }),
                defineField({
                  name: 'durationEstimate',
                  title: 'Duration Estimate',
                  type: 'number',
                }),
              ],
            },
          ],
        }),
        defineField({
          name: 'cta',
          title: 'Call to Action',
          type: 'text',
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'scriptQualityScore',
      title: 'Script Quality Score',
      type: 'number',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'Draft', value: 'draft'},
          {title: 'Script Ready', value: 'script_ready'},
          {title: 'Audio Generation', value: 'audio_gen'},
          {title: 'Video Generation', value: 'video_gen'},
          {title: 'Flagged', value: 'flagged'},
          {title: 'Uploading', value: 'uploading'},
          {title: 'Published', value: 'published'},
        ],
      },
      initialValue: 'draft',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'audioUrl',
      title: 'Audio URL',
      type: 'url',
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video URL',
      type: 'url',
    }),
    defineField({
      name: 'shortUrl',
      title: 'Short URL',
      type: 'url',
    }),
    defineField({
      name: 'youtubeId',
      title: 'YouTube ID',
      type: 'string',
    }),
    defineField({
      name: 'youtubeShortId',
      title: 'YouTube Short ID',
      type: 'string',
    }),
    defineField({
      name: 'scheduledPublishAt',
      title: 'Scheduled Publish At',
      type: 'datetime',
    }),
    defineField({
      name: 'sponsorSlot',
      title: 'Sponsor Slot',
      type: 'reference',
      to: [{type: 'sponsorLead'}],
    }),
    defineField({
      name: 'flaggedReason',
      title: 'Flagged Reason',
      type: 'text',
    }),
  ],
  orderings: [
    {
      title: 'Status',
      name: 'statusAsc',
      by: [{field: 'status', direction: 'asc'}],
    },
    {
      title: 'Scheduled Publish Date',
      name: 'scheduledPublishAtDesc',
      by: [{field: 'scheduledPublishAt', direction: 'desc'}],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'status',
    },
  },
})
