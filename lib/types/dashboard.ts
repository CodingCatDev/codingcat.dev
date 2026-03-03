export const POLL_INTERVAL_MS = 30000;

export interface DashboardMetrics {
	videosPublished: number;
	flaggedForReview: number;
	sponsorPipeline: number;
	revenue: number | null;
}

export interface ActivityItem {
	_id: string;
	_type: string;
	_updatedAt: string;
	title?: string;
	companyName?: string;
	status?: string;
}
