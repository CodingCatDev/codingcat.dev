import { PiCurrencyDollarSimpleFill } from "react-icons/pi";
import { format, parseISO } from "date-fns";
import { defineField, defineType } from "sanity";

import baseType from "../partials/base";

export default defineType({
  name: "sponsor",
  title: "Sponsor",
  icon: PiCurrencyDollarSimpleFill,
  type: "document",
  fields: [
    ...baseType.fields,
    defineField({
      title: "Link",
      name: "url",
      type: "url",
      validation: (Rule) => Rule.required(),
    }),
  ],
});
