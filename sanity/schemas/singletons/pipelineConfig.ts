import { defineField, defineType } from "sanity";

export default defineType({
  name: "pipelineConfig",
  title: "Pipeline Config",
  type: "document",
  icon: () => "🔧",
  fields: [
    defineField({
      name: "geminiModel",
      title: "Gemini Model",
      type: "string",
      initialValue: "gemini-2.0-flash",
    }),
    defineField({
      name: "elevenLabsVoiceId",
      title: "ElevenLabs Voice ID",
      type: "string",
      initialValue: "pNInz6obpgDQGcFmaJgB",
    }),
    defineField({
      name: "youtubeUploadVisibility",
      title: "YouTube Upload Visibility",
      type: "string",
      initialValue: "private",
      options: {
        list: ["private", "unlisted", "public"],
      },
    }),
    defineField({
      name: "youtubeChannelId",
      title: "YouTube Channel ID",
      type: "string",
      initialValue: "",
    }),
    defineField({
      name: "enableNotebookLmResearch",
      title: "Enable NotebookLM Research",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "qualityThreshold",
      title: "Quality Threshold",
      type: "number",
      initialValue: 50,
      validation: (rule) => rule.min(0).max(100),
    }),
    defineField({
      name: "stuckTimeoutMinutes",
      title: "Stuck Timeout Minutes",
      type: "number",
      initialValue: 30,
      validation: (rule) => rule.min(5).max(120),
    }),
    defineField({
      name: "maxIdeasPerRun",
      title: "Max Ideas Per Run",
      type: "number",
      initialValue: 1,
      validation: (rule) => rule.min(1).max(10),
    }),
  ],
  preview: {
    prepare() {
      return { title: "Pipeline Config" };
    },
  },
});
