export interface EngineConfig {
  _id: string;
  _type: 'engineConfig';
  _updatedAt: string;

  // Pipeline control
  autoPublish: boolean;
  qualityThreshold: number;
  reviewTimeoutDays: number;
  reviewNotification: 'email' | 'slack' | 'webhook';
  maxIdeasPerRun: number;

  // Content cadence
  longFormPerWeek: number;
  shortsPerDay: number;
  blogsPerWeek: number;
  newsletterFrequency: 'weekly' | 'biweekly' | 'monthly';
  publishDays: string[];
  contentCategories: string[];

  // Trend discovery
  trendSources: string[];
  topicFocus: string[];
  rssFeeds: { name: string; url: string }[];
  trendSourcesEnabled: Record<string, boolean>;
  dedupWindowDays: number;

  // AI & Generation
  geminiModel: string;
  infographicModel: string;
  infographicPromptPrefix: string;
  systemInstruction: string;
  deepResearchAgent: string;
  deepResearchPromptTemplate: string;
  enableDeepResearch: boolean;
  enableHorizontalInfographics: boolean;
  thumbnailEnabled: boolean;
  infographicInstructions: string[];
  targetVideoDurationSec: number;
  sceneCountMin: number;
  sceneCountMax: number;

  // Audio
  elevenLabsVoiceId: string;

  // Distribution
  youtubeEnabled: boolean;
  twitterEnabled: boolean;
  linkedinEnabled: boolean;
  tiktokEnabled: boolean;
  instagramEnabled: boolean;
  blueskyEnabled: boolean;
  newsletterEnabled: boolean;
  youtubeUploadVisibility: string;
  youtubeChannelId: string;
  youtubeDescriptionTemplate: string;
  youtubeDefaultTags: string[];
  notificationEmails: string[];
  resendFromEmail: string;

  // Sponsor
  cooldownDays: number;
  rateCardTiers: { name: string; description: string; price: number }[];
  outreachEmailTemplate: string;
  maxOutreachPerRun: number;

  // Brand
  brandPrimary: string;
  brandBackground: string;
  brandText: string;

  // Legacy
  awsRegion?: string;
  remotionFunctionName?: string;
  remotionServeUrl?: string;
  gcsBucketName?: string;
  gcsProjectId?: string;
}
