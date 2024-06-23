import { FaExternalLinkSquareAlt } from "react-icons/fa";
import { defineType } from "sanity";

export default defineType({
  name: "link",
  type: "object",
  title: "External link",
  icon: FaExternalLinkSquareAlt,
  fields: [
    {
      name: "href",
      type: "url",
      title: "URL",
      validation: (Rule) =>
        Rule.uri({
          scheme: ["http", "https", "mailto"],
        }),
    },
    {
      title: "Open in new tab",
      name: "blank",
      description: "Read https://css-tricks.com/use-target_blank/",
      type: "boolean",
    },
  ],
  initialValue: {
    blank: true,
  },
});
