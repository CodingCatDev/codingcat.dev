import { defineType } from "sanity";
import { FaCodepen } from "react-icons/fa6";
import preview from "../../components/CodePenPreview";

export default defineType({
  name: "codepen",
  type: "object",
  title: "CodePen Embed",
  icon: FaCodepen,
  components: {
    preview,
  },
  preview: {
    select: {
      url: "url",
    },
  },
  fields: [
    {
      name: "url",
      type: "url",
      title: "CodePen URL",
    },
  ],
  initialValue: {
    url: "https://codepen.io/codercatdev/pen/eYVjxjK",
  },
});
