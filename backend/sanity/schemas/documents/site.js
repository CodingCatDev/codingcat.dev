export default {
  name: 'site',
  title: 'Site',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'pageLinks',
      title: 'Page Links',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [
            { type: 'course' },
            { type: 'lesson' },
            { type: 'page' },
            { type: 'podcast' },
            { type: 'post' },
            { type: 'tutorial' },
          ],
        },
      ],
    },
    {
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      of: [
        {
          name: 'link',
          type: 'object',
          fields: [
            {
              name: 'type',
              title: 'Type',
              type: 'string',
              initialValue: 'post',
              options: {
                list: [
                  'facebook',
                  'github',
                  'linkedin',
                  'medium',
                  'twitter',
                  'youtube',
                  'mastodon',
                  'twitch',
                  'instagram',
                  'dribbble',
                  'stackoverflow',
                  'gitlab',
                  'behance',
                ],
              },
            },
            {
              name: 'href',
              title: 'Link',
              type: 'url',
            },
          ],
        },
      ],
    },
  ],
};
