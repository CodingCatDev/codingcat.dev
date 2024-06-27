import { PiStudentBold } from "react-icons/pi";
import { format, parseISO } from "date-fns";
import { defineField, defineType } from "sanity";

import contentType from "../partials/content";

export default defineType({
  ...contentType,
  name: "lesson",
  title: "Lesson",
  icon: PiStudentBold,
  type: "document",
  fields: [
    ...contentType.fields,
    defineField({
      name: "locked",
      title: "Locked",
      type: "boolean",
    }),
  ],
});
