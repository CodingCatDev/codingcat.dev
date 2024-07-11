import { defineType } from "sanity";
import { FaHtml5 } from "react-icons/fa6";
import preview from "../../components/HTMLPreview";

export default defineType({
  name: "htmlBlock",
  type: "object",
  icon: FaHtml5,
  components: {
    preview,
  },
  preview: {
    select: {
      html: "html",
    },
  },
  fields: [
    {
      name: "html",
      type: "text",
      title: "Raw HTML",
    },
  ],
  initialValue: {
    html: "<div>Hello World</div>",
  },
});
