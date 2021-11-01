import postType from './postType';

const course = {
  name: 'course',
  title: 'Courses',
  ...postType,
};

course.fields.push({
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
  ],
});

export default course;
