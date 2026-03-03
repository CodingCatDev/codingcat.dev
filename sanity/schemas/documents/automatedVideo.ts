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
      title: 'Pipeline Status',
      type: 'string',
      description: 'Current stage in the automated video production pipeline',
      options: {
        list: [
          {title: '1 - Draft', value: 'draft'},
          {title: '2 - Script Ready', value: 'script_ready'},
          {title: '3 - Audio Generation', value: 'audio_gen'},
          {title: '4 - Video Rendering', value: 'video_gen'},
          {title: '5 - Uploading', value: 'uploading'},
          {title: '6 - Published', value: 'published'},
          {title: 'Flagged', value: 'flagged'},
        ],
      },
      initialValue: 'draft',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'audioFile',
      title: 'Audio File',
      type: 'file',
      description: 'ElevenLabs TTS audio (MP3) — generated in step 3',
      options: {
        accept: 'audio/*',
      },
    }),
    defineField({
      name: 'audioUrl',
      title: 'Audio URL',
      type: 'url',
      description: 'Direct URL to the audio file (auto-populated from audio asset)',
    }),
    defineField({
      name: 'videoFile',
      title: 'Video File (16:9)',
      type: 'file',
      description: 'Rendered main video (MP4) — generated in step 4',
      options: {
        accept: 'video/*',
      },
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video URL',
      type: 'url',
      description: 'Direct URL to the main video (auto-populated from video asset)',
    }),
    defineField({
      name: 'shortFile',
      title: 'Short Video File (9:16)',
      type: 'file',
      description: 'Rendered short video (MP4) — generated in step 4',
      options: {
        accept: 'video/*',
      },
    }),
    defineField({
      name: 'shortUrl',
      title: 'Short URL',
      type: 'url',
      description: 'Direct URL to the short video (auto-populated from video asset)',
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
