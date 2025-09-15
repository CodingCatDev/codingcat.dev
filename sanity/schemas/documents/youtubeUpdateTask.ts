// /sanity/schemas/documents/youtubeUpdateTask.ts
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'youtubeUpdateTask',
  title: 'YouTube Update Task',
  type: 'document',
  fields: [
    defineField({
      name: 'targetDoc',
      title: 'Target Document',
      type: 'reference',
      to: [{type: 'post'}, {type: 'podcast'}],
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'Pending', value: 'pending'},
          {title: 'In Progress', value: 'inProgress'},
          {title: 'Completed', value: 'completed'},
          {title: 'Error', value: 'error'},
        ],
        layout: 'dropdown',
      },
      initialValue: 'pending',
    }),
    defineField({
      name: 'lastChecked',
      title: 'Last Checked',
      type: 'datetime',
    }),
    defineField({
      name: 'errorMessage',
      title: 'Error Message',
      type: 'text',
      hidden: ({parent}) => parent?.status !== 'error',
    }),
  ],
  preview: {
    select: {
      title: 'targetDoc.title',
      status: 'status',
      lastChecked: 'lastChecked',
    },
    prepare({title, status, lastChecked}) {
      return {
        title: title ? `Update: ${title}` : 'YouTube Update Task',
        subtitle: `${status || 'pending'}${lastChecked ? ' | ' + new Date(lastChecked).toLocaleString() : ''}`,
      }
    },
  },
})
