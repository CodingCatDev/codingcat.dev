import { defineType } from "sanity";
import { FiCodesandbox } from "react-icons/fi";
import preview from "../../components/CodeSandboxPreview";

export default defineType({
  name: "codesandbox",
  type: "object",
  title: "CodeSandbox Embed",
  icon: FiCodesandbox,
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
      title: "CodeSandbox URL",
    },
  ],
  initialValue: {
    url: "https://codesandbox.io/p/sandbox/html-for-a-10-year-old-basics-hello-world-vhigc",
  },
});
