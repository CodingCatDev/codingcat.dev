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
      title: 'Main Video',
      type: 'cloudinary.asset',
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'tag' } }],
    },
    {
      name: 'type',
      title: 'Type',
      type: 'string',
      validation: (Rule) => Rule.required(),
      initialValue: 'post',
      options: {
        list: [
          'post',
          'tutorial',
          'podcast',
          'course',
          'lesson',
          'page',
          'group',
          'forum',
        ],
      },
    },
    {
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'content',
      title: 'Content',
      type: 'markdown',
      validation: (Rule) => Rule.required(),
    },
  ],

  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
    },
    prepare(selection) {
      const { author } = selection;
      return Object.assign({}, selection, {
        subtitle: author && `by ${author}`,
      });
    },
  },
};
