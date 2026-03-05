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
                defineField({
                  name: 'sceneType',
                  title: 'Scene Type',
                  type: 'string',
                  options: {
                    list: [
                      {title: 'Narration', value: 'narration'},
                      {title: 'Code', value: 'code'},
                      {title: 'List', value: 'list'},
                      {title: 'Comparison', value: 'comparison'},
                      {title: 'Mockup', value: 'mockup'},
                    ],
                  },
                  initialValue: 'narration',
                }),
                defineField({
                  name: 'code',
                  title: 'Code',
                  type: 'object',
                  hidden: ({parent}) => parent?.sceneType !== 'code',
                  fields: [
                    defineField({
                      name: 'snippet',
                      title: 'Code Snippet',
                      type: 'text',
                    }),
                    defineField({
                      name: 'language',
                      title: 'Language',
                      type: 'string',
                      options: {
                        list: [
                          {title: 'TypeScript', value: 'typescript'},
                          {title: 'JavaScript', value: 'javascript'},
                          {title: 'JSX', value: 'jsx'},
                          {title: 'TSX', value: 'tsx'},
                          {title: 'CSS', value: 'css'},
                          {title: 'HTML', value: 'html'},
                          {title: 'JSON', value: 'json'},
                          {title: 'Bash', value: 'bash'},
                        ],
                      },
                    }),
                    defineField({
                      name: 'highlightLines',
                      title: 'Highlight Lines',
                      type: 'array',
                      of: [{type: 'number'}],
                    }),
                  ],
                }),
                defineField({
                  name: 'list',
                  title: 'List',
                  type: 'object',
                  hidden: ({parent}) => parent?.sceneType !== 'list',
                  fields: [
                    defineField({
                      name: 'items',
                      title: 'Items',
                      type: 'array',
                      of: [{type: 'string'}],
                      validation: (Rule) => Rule.min(1),
                    }),
                    defineField({
                      name: 'icon',
                      title: 'Icon',
                      type: 'string',
                      description: 'Optional emoji icon, e.g. 🚀',
                    }),
                  ],
                }),
                defineField({
                  name: 'comparison',
                  title: 'Comparison',
                  type: 'object',
                  hidden: ({parent}) => parent?.sceneType !== 'comparison',
                  fields: [
                    defineField({
                      name: 'leftLabel',
                      title: 'Left Label',
                      type: 'string',
                    }),
                    defineField({
                      name: 'rightLabel',
                      title: 'Right Label',
                      type: 'string',
                    }),
                    defineField({
                      name: 'rows',
                      title: 'Rows',
                      type: 'array',
                      of: [{
                        type: 'object',
                        fields: [
                          defineField({name: 'left', title: 'Left', type: 'string'}),
                          defineField({name: 'right', title: 'Right', type: 'string'}),
                        ],
                      }],
                    }),
                  ],
                }),
                defineField({
                  name: 'mockup',
                  title: 'Mockup',
                  type: 'object',
                  hidden: ({parent}) => parent?.sceneType !== 'mockup',
                  fields: [
                    defineField({
                      name: 'deviceType',
                      title: 'Device Type',
                      type: 'string',
                      options: {
                        list: [
                          {title: 'Browser', value: 'browser'},
                          {title: 'Phone', value: 'phone'},
                          {title: 'Terminal', value: 'terminal'},
                        ],
                      },
                    }),
                    defineField({
                      name: 'screenContent',
                      title: 'Screen Content',
                      type: 'text',
                      description: 'Description of what appears on screen',
                    }),
                  ],
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
          {title: '1.5 - Researching', value: 'researching'},
          {title: '1.6 - Research Complete', value: 'research_complete'},
          {title: '1.7 - Infographics Generating', value: 'infographics_generating'},
          {title: '1.8 - Enriching', value: 'enriching'},
          {title: '2 - Script Ready', value: 'script_ready'},
          {title: '3 - Audio Generation', value: 'audio_gen'},
          {title: '4 - Rendering', value: 'rendering'},
          {title: '5 - Video Generation', value: 'video_gen'},
          {title: '6 - Uploading', value: 'uploading'},
          {title: '7 - Published', value: 'published'},
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
      name: 'infographics',
      title: 'Infographics',
      type: 'array',
      description: 'Research infographics from NotebookLM — reusable for blog posts and video b-roll',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
              description: 'Describe the infographic for accessibility',
            }),
            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'string',
              description: 'Optional caption for display',
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'renderData',
      title: 'Render Data',
      type: 'object',
      description: 'Remotion Lambda render tracking data (auto-populated)',
      fields: [
        defineField({ name: 'mainRenderId', title: 'Main Render ID', type: 'string' }),
        defineField({ name: 'shortRenderId', title: 'Short Render ID', type: 'string' }),
        defineField({ name: 'bucketName', title: 'Bucket Name', type: 'string' }),
        defineField({ name: 'startedAt', title: 'Started At', type: 'datetime' }),
      ],
      hidden: true, // internal tracking, not for manual editing
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
      name: 'researchNotebookId',
      title: 'NotebookLM Notebook ID',
      type: 'string',
      description: 'UUID of the NotebookLM notebook used for research',
      hidden: true,
    }),
    defineField({
      name: 'researchTaskId',
      title: 'Research Task ID',
      type: 'string',
      description: 'UUID of the NotebookLM deep research task',
      hidden: true,
    }),
    defineField({
      name: 'researchInteractionId',
      title: 'Research Interaction ID',
      type: 'string',
      description: 'Gemini Deep Research interaction ID for polling via the Interactions API',
      hidden: true,
    }),
    defineField({
      name: 'researchData',
      title: 'Research Data',
      type: 'text',
      description: 'JSON-serialized research payload from NotebookLM',
      hidden: true,
    }),
    defineField({
      name: 'infographicArtifactIds',
      title: 'Infographic Artifact IDs',
      type: 'array',
      of: [{type: 'string'}],
      description: 'NotebookLM artifact IDs for generated infographics',
      hidden: true,
    }),
    defineField({
      name: 'trendScore',
      title: 'Trend Score',
      type: 'number',
      description: 'Score from trend discovery (0-100)',
    }),
    defineField({
      name: 'trendSources',
      title: 'Trend Sources',
      type: 'string',
      description: 'Comma-separated list of trend signal sources',
    }),
    defineField({
      name: 'flaggedReason',
      title: 'Flagged Reason',
      type: 'text',
    }),
    defineField({
      name: 'distributionLog',
      title: 'Distribution Log',
      type: 'array',
      description: 'Tracks distribution step results for retry and debugging',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'step', title: 'Step', type: 'string' }),
            defineField({ name: 'status', title: 'Status', type: 'string', options: { list: ['success', 'failed', 'skipped'] } }),
            defineField({ name: 'error', title: 'Error', type: 'text' }),
            defineField({ name: 'timestamp', title: 'Timestamp', type: 'datetime' }),
            defineField({ name: 'result', title: 'Result', type: 'string', description: 'e.g. YouTube video ID, tweet ID' }),
          ],
        },
      ],
      hidden: true,
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
