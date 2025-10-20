
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'table',
  title: 'Table',
  type: 'object',
  fields: [
    defineField({
      name: 'rows',
      title: 'Rows',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'row',
          fields: [
            {
              type: 'array',
              name: 'cells',
              of: [{ type: 'string' }],
            },
          ],
        },
      ],
    }),
  ],
})
