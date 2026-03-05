import { defineField, defineType } from "sanity";

export default defineType({
  name: "distributionConfig",
  title: "Distribution Config",
  type: "document",
  icon: () => "📡",
  fields: [
    defineField({
      name: "notificationEmails",
      title: "Notification Emails",
      type: "array",
      of: [{ type: "string" }],
      initialValue: ["alex@codingcat.dev"],
    }),
    defineField({
      name: "youtubeDescriptionTemplate",
      title: "YouTube Description Template",
      type: "text",
      initialValue: "{{title}}\n\n{{summary}}\n\n🔗 Learn more at https://codingcat.dev\n\n#webdev #coding #programming",
    }),
    defineField({
      name: "youtubeDefaultTags",
      title: "YouTube Default Tags",
      type: "array",
      of: [{ type: "string" }],
      initialValue: ["web development", "coding", "programming", "tutorial", "codingcat"],
    }),
    defineField({
      name: "resendFromEmail",
      title: "Resend From Email",
      type: "string",
      initialValue: "content@codingcat.dev",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Distribution Config" };
    },
  },
});
