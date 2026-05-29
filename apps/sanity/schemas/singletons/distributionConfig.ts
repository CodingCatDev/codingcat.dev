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
      description: "Email addresses that receive notifications when a new video is published",
      of: [{ type: "string" }],
      initialValue: ["alex@codingcat.dev"],
    }),
    defineField({
      name: "youtubeDescriptionTemplate",
      title: "YouTube Description Template",
      type: "text",
      description: "Template for YouTube video descriptions. Use {{title}} and {{summary}} placeholders",
      initialValue: "{{title}}\n\n{{summary}}\n\n🔗 Learn more at https://codingcat.dev\n\n#webdev #coding #programming",
    }),
    defineField({
      name: "youtubeDefaultTags",
      title: "YouTube Default Tags",
      type: "array",
      description: "Default tags applied to all uploaded YouTube videos. Topic-specific tags are added by AI",
      of: [{ type: "string" }],
      initialValue: ["web development", "coding", "programming", "tutorial", "codingcat"],
    }),
    defineField({
      name: "resendFromEmail",
      title: "Resend From Email",
      type: "string",
      description: "Sender email address for notification emails via Resend",
      initialValue: "content@codingcat.dev",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Distribution Config" };
    },
  },
});
