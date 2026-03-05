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
      description: "The Google Gemini model used for script generation and content analysis (e.g., gemini-2.0-flash, gemini-2.5-pro)",
      initialValue: "gemini-2.0-flash",
    }),
    defineField({
      name: "elevenLabsVoiceId",
      title: "ElevenLabs Voice ID",
      type: "string",
      description: "ElevenLabs voice ID for text-to-speech narration. Find voice IDs at elevenlabs.io/voice-library",
      initialValue: "pNInz6obpgDQGcFmaJgB",
    }),
    defineField({
      name: "youtubeUploadVisibility",
      title: "YouTube Upload Visibility",
      type: "string",
      description: "Default visibility for uploaded YouTube videos. Use 'private' for testing, 'unlisted' for review, 'public' for production",
      initialValue: "private",
      options: {
        list: ["private", "unlisted", "public"],
      },
    }),
    defineField({
      name: "youtubeChannelId",
      title: "YouTube Channel ID",
      type: "string",
      description: "Your YouTube channel ID \u2014 used for analytics and upload targeting",
      initialValue: "",
    }),
    defineField({
      name: "enableNotebookLmResearch",
      title: "Enable NotebookLM Research",
      type: "boolean",
      description: "When enabled, the ingest cron creates a NotebookLM notebook for deep research before script generation. Requires NOTEBOOKLM_AUTH_JSON env var",
      initialValue: false,
    }),
    defineField({
      name: "qualityThreshold",
      title: "Quality Threshold",
      type: "number",
      description: "Minimum quality score (0-100) from the AI critic. Videos scoring below this are flagged for manual review instead of auto-publishing",
      initialValue: 50,
      validation: (rule) => rule.min(0).max(100),
    }),
    defineField({
      name: "stuckTimeoutMinutes",
      title: "Stuck Timeout Minutes",
      type: "number",
      description: "Minutes before a pipeline document is considered stuck and auto-flagged. Sub-statuses use proportional timeouts (infographics: 50%, enriching: 33%)",
      initialValue: 30,
      validation: (rule) => rule.min(5).max(120),
    }),
    defineField({
      name: "maxIdeasPerRun",
      title: "Max Ideas Per Run",
      type: "number",
      description: "Maximum number of content ideas to process per ingest cron run. Keep low (1-3) to stay within serverless time limits",
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
