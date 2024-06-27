import { GiTeacher } from "react-icons/gi";
import { format, parseISO } from "date-fns";
import { defineField, defineType } from "sanity";

import contentType from "../partials/content";
import lessonType from "./lesson";

export default defineType({
  ...contentType,
  name: "course",
  title: "Course",
  icon: GiTeacher,
  type: "document",
  groups: [
    ...(contentType.groups || []),
    {
      name: "sections",
      title: "Sections / Lessons",
      default: true,
    },
  ],
  fields: [
    ...contentType.fields,
    defineField({
      name: "stripeProduct",
      title: "Stripe Product Id",
      type: "string",
    }),
    defineField({
      name: "sections",
      title: "Sections",
      type: "array",
      group: "sections",
      of: [
        {
          name: "section",
          title: "Section",
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
            }),
            defineField({
              name: "lesson",
              title: "Lessons",
              type: "array",
              of: [
                {
                  type: "reference",
                  to: [{ type: lessonType.name }],
                },
              ],
            }),
          ],
        },
      ],
    }),
  ],
});
