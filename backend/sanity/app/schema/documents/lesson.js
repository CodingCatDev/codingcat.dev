import postType from './postType';

export default {
  name: 'lesson',
  title: 'Lessons',
  ...postType,
  fields: [
    ...postType.fields,
    ...[
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
            initialValue: 'free',
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
