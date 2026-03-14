import { defineField, defineType } from 'sanity';
import { HiOutlinePhotograph } from 'react-icons/hi';

export default defineType({
  name: 'mediaAsset',
  title: 'Media Asset',
  type: 'document',
  icon: HiOutlinePhotograph,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'source',
      title: 'Source',
      type: 'string',
      description: 'How this image was acquired',
      validation: (rule) => rule.required(),
      options: {
        list: [
          { title: 'Simple Icons', value: 'simpleicons' },
          { title: 'Brandfetch', value: 'brandfetch' },
          { title: 'Serper', value: 'serper' },
          { title: 'Screenshot', value: 'screenshot' },
          { title: 'Gemini', value: 'gemini' },
          { title: 'Pexels', value: 'pexels' },
          { title: 'Manual', value: 'manual' },
        ],
      },
    }),
    defineField({
      name: 'attribution',
      title: 'Attribution',
      type: 'string',
      description: 'Credit/attribution for the image source',
    }),
    defineField({
      name: 'license',
      title: 'License',
      type: 'string',
      description: 'License type for this image',
      initialValue: 'unknown',
      options: {
        list: [
          { title: 'CC0 (Public Domain)', value: 'cc0' },
          { title: 'CC BY', value: 'cc-by' },
          { title: 'CC BY-SA', value: 'cc-by-sa' },
          { title: 'Fair Use', value: 'fair-use' },
          { title: 'Proprietary', value: 'proprietary' },
          { title: 'Unknown', value: 'unknown' },
        ],
      },
    }),
    defineField({
      name: 'brandOverlayApplied',
      title: 'Brand Overlay Applied',
      type: 'boolean',
      description: 'Whether the CodingCat.dev brand overlay has been applied to this image',
      initialValue: false,
    }),
    defineField({
      name: 'originalUrl',
      title: 'Original URL',
      type: 'url',
      description: 'Original source URL',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      description: 'Tags for searchability',
      of: [{ type: 'string' }],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'source',
      media: 'image',
    },
  },
});
