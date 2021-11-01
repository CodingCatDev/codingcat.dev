export default {
  name: 'author',
  title: 'Authors',
  type: 'document',
  fields: [
    {
      name: 'displayName',
      title: 'Display Name',
      type: 'string',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
    },
    {
      name: 'basicInfo',
      title: 'Info',
      type: 'object',
      fields: [
        {
          name: 'about',
          title: 'About',
          type: 'string',
        },
        {
          name: 'location',
          title: 'Location',
          type: 'string',
        },
        {
          name: 'website',
          title: 'Personal Website',
          type: 'url',
        },
      ],
    },
    {
      name: 'photoURL',
      title: 'Personal Photo',
      type: 'cloudinary.asset',
    },
  ],
  preview: {
    select: {
      title: 'displayName',
      media: 'photoURL.thumbnail_url',
    },
  },
};
