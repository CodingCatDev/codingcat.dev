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
      description: "Your YouTube channel ID — used for analytics and upload targeting",
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
      name: "enableDeepResearch",
      title: "Enable Deep Research",
      type: "boolean",
      description: "When enabled, the ingest cron uses Gemini Deep Research API for comprehensive topic research before script generation. Replaces NotebookLM research.",
      initialValue: false,
    }),
    defineField({
      name: "deepResearchAgent",
      title: "Deep Research Agent",
      type: "string",
      description: "The Gemini Deep Research agent model ID. This is the agent used for autonomous web research via the Interactions API",
      initialValue: "deep-research-pro-preview-12-2025",
    }),
    defineField({
      name: "deepResearchPromptTemplate",
      title: "Deep Research Prompt Template",
      type: "text",
      description: "Template for Deep Research queries. Use {topic} as placeholder for the trend topic. Sent to the Deep Research agent for autonomous web research",
      initialValue: "Research comprehensively: \"{topic}\"\n\nFocus areas:\n- What is it and why does it matter?\n- How does it work technically?\n- Key features and capabilities\n- Comparison with alternatives\n- Getting started guide\n- Common pitfalls and best practices\n\nTarget audience: Web developers learning new tech.\nTone: Educational, accessible, engaging.",
    }),
    defineField({
      name: "enableHorizontalInfographics",
      title: "Enable Horizontal Infographics",
      type: "boolean",
      description: "Generate 16:9 horizontal infographics in addition to 9:16 vertical. Doubles Imagen API calls and generation time. Disable for vertical-only (Shorts/Reels)",
      initialValue: false,
    }),
    defineField({
      name: "infographicModel",
      title: "Infographic Model",
      type: "string",
      description: "Model used for generating brand-consistent infographics from research data. Imagen 4 Fast ($0.02/image) supports seed-based reproducibility",
      initialValue: "imagen-4.0-fast-generate-001",
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
