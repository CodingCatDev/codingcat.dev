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
      name: 'coverPhoto',
      title: 'Main image',
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
      title: 'Main Video',
      type: 'cloudinary.asset',
    },
    {
      name: 'publishedAt',
      title: 'Published at',
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
  ],
  preview: {
    select: {
      title: 'title',
      slug: 'slug.current',
    },
    prepare(selection) {
      const { slug } = selection;
      return Object.assign({}, selection, {
        subtitle: slug,
      });
    },
  },
};
