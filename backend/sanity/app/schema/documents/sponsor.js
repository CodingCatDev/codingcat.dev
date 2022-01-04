import React from 'react';
export default {
  name: 'author',
  title: 'Authors',
  type: 'document',
  fields: [
    {
      name: 'company',
      title: 'Company Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      validation: (Rule) => Rule.required(),
      options: {
        source: 'name',
        maxLength: 96,
      },
    },
    {
      name: 'coverPhoto',
      title: 'Cover Photo',
      type: 'cloudinary.asset',
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
      name: 'description',
      title: 'Description',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'url',
      title: 'Url',
      type: 'url',
      validation: (Rule) => Rule.required(),
    },
  ],
  preview: {
    select: {
      title: 'company',
      slug: 'slug.current',
      src: 'coverPhoto.secure_url',
    },
    prepare(selection) {
      const { slug, src, title } = selection;
      return Object.assign({}, selection, {
        subtitle: slug,
        media: <img src={src} alt={`${title}`} />,
      });
    },
  },
};
