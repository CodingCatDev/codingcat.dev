import { defineField, defineType } from "sanity";

export default defineType({
  name: "remotionConfig",
  title: "Remotion Config",
  type: "document",
  icon: () => "🎬",
  fields: [
    defineField({
      name: "awsRegion",
      title: "AWS Region",
      type: "string",
      initialValue: "us-east-1",
    }),
    defineField({
      name: "functionName",
      title: "Function Name",
      type: "string",
      initialValue: "",
    }),
    defineField({
      name: "serveUrl",
      title: "Serve URL",
      type: "string",
      initialValue: "",
    }),
    defineField({
      name: "maxRenderTimeoutSec",
      title: "Max Render Timeout (sec)",
      type: "number",
      initialValue: 240,
    }),
    defineField({
      name: "memoryMb",
      title: "Memory (MB)",
      type: "number",
      initialValue: 2048,
    }),
    defineField({
      name: "diskMb",
      title: "Disk (MB)",
      type: "number",
      initialValue: 2048,
    }),
  ],
  preview: {
    prepare() {
      return { title: "Remotion Config" };
    },
  },
});
