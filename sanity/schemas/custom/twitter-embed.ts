import { defineType } from "sanity";
import { FaTwitter } from "react-icons/fa6";
import preview from "../../components/TwitterPreview";

export default defineType({
  name: "twitter",
  type: "object",
  title: "Twitter Embed",
  icon: FaTwitter,
  components: {
    preview,
  },
  preview: {
    select: {
      id: "id",
    },
  },
  fields: [
    {
      name: "id",
      type: "string",
      title: "Twitter(X) tweet id",
    },
  ],
  initialValue: {
    id: "1083592734038929408",
  },
});
