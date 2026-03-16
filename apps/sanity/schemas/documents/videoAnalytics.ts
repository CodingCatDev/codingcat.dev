import { defineField, defineType } from 'sanity';
import { HiOutlineChartBar } from 'react-icons/hi';

// One videoAnalytics document per content document (1:1 relationship).
// Sanity cannot enforce uniqueness at schema level — the CF Worker cron
// that creates these docs must check for existing docs before creating:
//   *[_type == "videoAnalytics" && contentRef._ref == $docId][0]
export default defineType({
  name: 'videoAnalytics',
  title: 'Video Analytics',
  type: 'document',
  icon: HiOutlineChartBar,
  fields: [
    defineField({
      name: 'contentRef',
      title: 'Content Reference',
      type: 'reference',
      to: [
        { type: 'post' },
        { type: 'podcast' },
        { type: 'automatedVideo' },
      ],
      description: 'The content document these analytics belong to',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'contentType',
      title: 'Content Type',
      type: 'string',
      description: 'Denormalized content type for efficient GROQ filtering without dereferencing',
      options: {
        list: [
          { title: 'Post', value: 'post' },
          { title: 'Podcast', value: 'podcast' },
          { title: 'Automated Video', value: 'automatedVideo' },
        ],
      },
      validation: (Rule) => Rule.required(),
      readOnly: true,
    }),
    defineField({
      name: 'youtubeId',
      title: 'YouTube Video ID',
      type: 'string',
      description: 'YouTube video ID (e.g., dQw4w9WgXcQ)',
      validation: (Rule) => Rule.required(),
      readOnly: true,
    }),
    defineField({
      name: 'youtubeShortId',
      title: 'YouTube Short ID',
      type: 'string',
      description: 'YouTube Short video ID (for automatedVideo with both formats)',
    }),
    defineField({
      name: 'viewCount',
      title: 'View Count',
      type: 'number',
      description: 'YouTube view count',
      initialValue: 0,
      readOnly: true,
    }),
    defineField({
      name: 'likeCount',
      title: 'Like Count',
      type: 'number',
      description: 'YouTube like count',
      initialValue: 0,
      readOnly: true,
    }),
    defineField({
      name: 'commentCount',
      title: 'Comment Count',
      type: 'number',
      description: 'YouTube comment count',
      initialValue: 0,
      readOnly: true,
    }),
    defineField({
      name: 'favoriteCount',
      title: 'Favorite Count',
      type: 'number',
      description: 'YouTube favorite count',
      initialValue: 0,
      readOnly: true,
    }),
    defineField({
      name: 'lastFetchedAt',
      title: 'Last Fetched At',
      type: 'datetime',
      description: 'When stats were last pulled from the YouTube Data API',
      readOnly: true,
    }),
  ],
  orderings: [
    {
      title: 'Views (High to Low)',
      name: 'viewCountDesc',
      by: [{ field: 'viewCount', direction: 'desc' }],
    },
    {
      title: 'Last Fetched',
      name: 'lastFetchedAtDesc',
      by: [{ field: 'lastFetchedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      contentType: 'contentType',
      youtubeId: 'youtubeId',
      viewCount: 'viewCount',
    },
    prepare({ contentType, youtubeId, viewCount }) {
      return {
        title: youtubeId || 'No YouTube ID',
        subtitle: `${contentType || 'unknown'} · ${(viewCount ?? 0).toLocaleString()} views`,
      };
    },
  },
});
