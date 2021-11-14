import postType from './postType';

const course = {
  name: 'course',
  title: 'Courses',
  ...postType,
  fields: [
    ...postType.fields,
    ...[
      {
        name: 'sections',
        title: 'Sections',
        type: 'array',
        of: [
          {
            type: 'object',
            fields: [
              {
                name: 'title',
                title: 'Title',
                type: 'string',
                validation: (Rule) => Rule.required(),
              },
              {
                name: 'lessons',
                title: 'Lessons',
                type: 'array',
                of: [{ type: 'reference', to: { type: 'lesson' } }],
              },
            ],
          },
        ],
      },
      {
        name: 'accessSettings',
        title: 'Access Settings',
        type: 'object',
        fields: [
          {
            name: 'accessMode',
            title: 'Access Mode',
            type: 'string',
            validation: (Rule) => Rule.required(),
            initialValue: 'closed',
            options: {
              list: ['free', 'open', 'closed'],
            },
          },
          {
            name: 'price',
            title: 'Price',
            type: 'number',
          },
          {
            name: 'productId',
            title: 'Stripe Product',
            type: 'string',
          },
        ],
      },
    ],
  ],
};

export default course;
