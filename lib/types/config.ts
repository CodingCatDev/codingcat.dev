/**
 * Supabase config table types.
 * Each interface maps to a singleton row in the corresponding Supabase table.
 */

export interface PipelineConfig {
	id: number;
	gemini_model: string;
	elevenlabs_voice_id: string;
	youtube_upload_visibility: string;
	youtube_channel_id: string;
	enable_notebooklm_research: boolean;
	quality_threshold: number;
	stuck_timeout_minutes: number;
	max_ideas_per_run: number;
	updated_at: string;
}

export interface RemotionConfig {
	id: number;
	aws_region: string;
	function_name: string;
	serve_url: string;
	max_render_timeout_sec: number;
	memory_mb: number;
	disk_mb: number;
	updated_at: string;
}

export interface ContentConfig {
	id: number;
	rss_feeds: { name: string; url: string }[];
	trend_sources_enabled: Record<string, boolean>;
	system_instruction: string;
	target_video_duration_sec: number;
	scene_count_min: number;
	scene_count_max: number;
	updated_at: string;
}

export interface SponsorConfig {
	id: number;
	cooldown_days: number;
	rate_card_tiers: { name: string; description: string; price: number }[];
	outreach_email_template: string;
	max_outreach_per_run: number;
	updated_at: string;
}

export interface DistributionConfig {
	id: number;
	notification_emails: string[];
	youtube_description_template: string;
	youtube_default_tags: string[];
	resend_from_email: string;
	updated_at: string;
}

export interface GcsConfig {
	id: number;
	bucket_name: string;
	project_id: string;
	updated_at: string;
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
