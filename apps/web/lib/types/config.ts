/**
 * Sanity config singleton types.
 * Each interface maps to a singleton document in Sanity.
 */

export interface PipelineConfig {
  _id: string;
  _type: "pipelineConfig";
  geminiModel: string;
  elevenLabsVoiceId: string;
  youtubeUploadVisibility: string;
  youtubeChannelId: string;
  enableNotebookLmResearch: boolean;
  enableDeepResearch: boolean;
  deepResearchAgent: string;
  deepResearchPromptTemplate: string;
  infographicModel: string;
  enableHorizontalInfographics?: boolean;
  qualityThreshold: number;
  stuckTimeoutMinutes: number;
  maxIdeasPerRun: number;
  _updatedAt: string;
}

export interface RemotionConfig {
  _id: string;
  _type: "remotionConfig";
  awsRegion: string;
  functionName: string;
  serveUrl: string;
  maxRenderTimeoutSec: number;
  memoryMb: number;
  diskMb: number;
  _updatedAt: string;
}

export interface ContentConfig {
  _id: string;
  _type: "contentConfig";
  rssFeeds: { name: string; url: string }[];
  trendSourcesEnabled: Record<string, boolean>;
  systemInstruction: string;
  targetVideoDurationSec: number;
  sceneCountMin: number;
  sceneCountMax: number;
  dedupWindowDays: number;
  infographicInstructions: string[];
  _updatedAt: string;
}

export interface SponsorConfig {
  _id: string;
  _type: "sponsorConfig";
  cooldownDays: number;
  rateCardTiers: { name: string; description: string; price: number }[];
  outreachEmailTemplate: string;
  maxOutreachPerRun: number;
  _updatedAt: string;
}

export interface DistributionConfig {
  _id: string;
  _type: "distributionConfig";
  notificationEmails: string[];
  youtubeDescriptionTemplate: string;
  youtubeDefaultTags: string[];
  resendFromEmail: string;
  _updatedAt: string;
}

export interface GcsConfig {
  _id: string;
  _type: "gcsConfig";
  bucketName: string;
  projectId: string;
  _updatedAt: string;
}

export type ConfigTable =
  | "pipeline_config"
  | "remotion_config"
  | "content_config"
  | "sponsor_config"
  | "distribution_config"
  | "gcs_config";

export type ConfigTypeMap = {
  pipeline_config: PipelineConfig;
  remotion_config: RemotionConfig;
  content_config: ContentConfig;
  sponsor_config: SponsorConfig;
  distribution_config: DistributionConfig;
  gcs_config: GcsConfig;
};
