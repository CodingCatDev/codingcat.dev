import { Suspense } from "react";
import { connection } from "next/server";
import { dashboardQuery } from "@/lib/sanity/dashboard";
import { VideosTable } from "./videos-table";
import { PageRefreshButton } from "@/components/page-refresh-button";

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

export default function VideosPage() {
	return (
		<div className="flex flex-col gap-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">
						Automated Videos
					</h1>
					<p className="text-muted-foreground">
						Monitor the video pipeline — from script generation to
						publishing.
					</p>
				</div>
				<PageRefreshButton />
			</div>

			<Suspense
				fallback={
					<p className="text-sm text-muted-foreground">Loading videos...</p>
				}
			>
				<VideosContent />
			</Suspense>
		</div>
	);
}

async function VideosContent() {
	await connection();

	let videos: AutomatedVideo[] = [];

	try {
		videos = await dashboardQuery<AutomatedVideo[]>(VIDEOS_QUERY);
	} catch (error) {
		console.error("Failed to fetch videos:", error);
	}

	return <VideosTable videos={videos} />;
}
