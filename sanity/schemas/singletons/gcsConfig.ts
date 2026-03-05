import { defineField, defineType } from "sanity";

export default defineType({
  name: "gcsConfig",
  title: "GCS Config",
  type: "document",
  icon: () => "☁️",
  fields: [
    defineField({
      name: "bucketName",
      title: "Bucket Name",
      type: "string",
      initialValue: "codingcatdev-content-engine",
    }),
    defineField({
      name: "projectId",
      title: "Project ID",
      type: "string",
      initialValue: "codingcatdev",
    }),
  ],
  preview: {
    prepare() {
      return { title: "GCS Config" };
    },
  },
});
