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
      description: "Google Cloud Storage bucket name for storing video assets, audio files, and renders",
      initialValue: "codingcatdev-content-engine",
    }),
    defineField({
      name: "projectId",
      title: "Project ID",
      type: "string",
      description: "Google Cloud project ID that owns the GCS bucket",
      initialValue: "codingcatdev",
    }),
  ],
  preview: {
    prepare() {
      return { title: "GCS Config" };
    },
  },
});
