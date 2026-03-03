import { dashboardQuery } from "@/lib/sanity/dashboard";
import { VideosTable } from "./videos-table";

interface AutomatedVideo {
	_id: string;
	_createdAt: string;
	title: string;
	status:
		| "draft"
		| "script_ready"
		| "audio_gen"
		| "video_gen"
		| "flagged"
		| "uploading"
		| "published";
	flaggedReason?: string;
	scriptQualityScore?: number;
	scheduledPublishAt?: string;
	youtubeId?: string;
}

const VIDEOS_QUERY = `*[_type == "automatedVideo"] | order(_createdAt desc) {
	_id,
	_createdAt,
	title,
	status,
	flaggedReason,
	scriptQualityScore,
	scheduledPublishAt,
	youtubeId
}`;

export default async function VideosPage() {
	let videos: AutomatedVideo[] = [];

	try {
		videos = await dashboardQuery<AutomatedVideo[]>(VIDEOS_QUERY);
	} catch (error) {
		console.error("Failed to fetch videos:", error);
	}

	return (
		<div className="flex flex-col gap-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">
					Automated Videos
				</h1>
				<p className="text-muted-foreground">
					Monitor the video pipeline — from script generation to publishing.
				</p>
			</div>

			<VideosTable videos={videos} />
		</div>
	);
}
