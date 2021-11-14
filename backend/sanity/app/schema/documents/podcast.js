import postType from './postType';

export default {
  name: 'podcast',
  title: 'Podcasts',
  ...postType,
  fields: [
    ...[
      {
        name: 'season',
        title: 'Season',
        type: 'number',
        validation: (Rule) => Rule.required(),
      },
      {
        name: 'episode',
        title: 'Episode',
        type: 'number',
        validation: (Rule) => Rule.required(),
      },
      {
        name: 'recordingDate',
        title: 'Recording Date',
        type: 'datetime',
        validation: (Rule) => Rule.required(),
      },
    ],
    ...postType.fields,
  ],
};
