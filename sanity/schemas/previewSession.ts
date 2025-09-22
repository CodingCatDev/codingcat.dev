import {defineType} from 'sanity';

export default defineType({
  name: 'previewSession',
  type: 'document',
  title: 'Preview Session',
  fields: [
    {
      name: 'token',
      type: 'string',
      title: 'Token',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'documentId',
      type: 'string',
      title: 'Document ID',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'expiresAt',
      type: 'datetime',
      title: 'Expires At',
    },
  ],
});
