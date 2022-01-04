import React from 'react';
export default {
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'excerpt',
      title: 'Excerpt',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      validation: (Rule) => Rule.required(),
      options: {
        source: 'title',
        maxLength: 96,
      },
    },
    {
      name: 'authors',
      title: 'Authors',
      type: 'array',
      validation: (Rule) => Rule.required(),
      of: [{ type: 'reference', to: { type: 'author' } }],
    },
    {
      name: 'sponsors',
      title: 'Sponsors',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'sponsor' } }],
    },
    {
      name: 'coverPhoto',
      title: 'Cover Photo',
      type: 'cloudinary.asset',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'coverVideo',
      title: 'YouTube Video',
      type: 'object',
      fields: [
        {
          name: 'type',
          title: 'Type',
          type: 'string',
          options: {
            list: ['video'],
          },
        },
        {
          name: 'url',
          title: 'Url',
          type: 'string',
        },
      ],
    },
    {
      name: 'cloudinaryVideo',
      title: 'Cloudinary Cover Video',
      type: 'cloudinary.asset',
    },
    {
      name: 'publishedAt',
      title: 'Go Live Date',
      type: 'datetime',
    },
    {
      name: 'content',
      title: 'Content',
      type: 'markdown',
      validation: (Rule) => Rule.required(),
    },
    {
      title: 'Frameworks',
      name: 'frameworks',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'framework' }],
        },
      ],
    },
    {
      title: 'Languages',
      name: 'languages',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'language' }],
        },
      ],
    },
  ],
  orderings: [
    {
      title: 'Publish Date, Latest',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
    {
      title: 'Publish Date, Oldest',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      slug: 'slug.current',
      src: 'coverPhoto.thumbnail_url',
      secureSrc: 'coverPhoto.secure_url',
    },
    prepare(selection) {
      const { slug, src, title, secureSrc } = selection;
      return Object.assign({}, selection, {
        subtitle: slug,
        media: <img src={src || secureSrc} alt={`${title}`} />,
      });
    },
  },
};
