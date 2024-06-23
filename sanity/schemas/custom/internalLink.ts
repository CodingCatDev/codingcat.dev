import { FaLink } from "react-icons/fa";
import { defineType } from "sanity";

export default defineType({
  name: "internalLink",
  type: "object",
  title: "Internal link",
  icon: FaLink,
  fields: [
    {
      name: "reference",
      type: "reference",
      title: "Reference",
      to: [
        { type: "post" },
        { type: "podcast" },
        { type: "course" },
        { type: "page" },
        // other types you may want to link to
      ],
    },
  ],
});
