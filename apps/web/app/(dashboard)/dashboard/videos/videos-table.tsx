"use client";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { AlertTriangle, FileVideo } from "lucide-react";
import { regenerateScript, retryRender, publishAnyway } from "./actions";

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

const statusConfig: Record<string, { label: string; className: string }> = {
	draft: {
		label: "Draft",
		className:
			"bg-gray-100 text-gray-800 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300",
	},
	script_ready: {
		label: "Script Ready",
		className:
			"bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300",
	},
	audio_gen: {
		label: "Audio Gen",
		className:
			"bg-orange-100 text-orange-800 hover:bg-orange-100 dark:bg-orange-900 dark:text-orange-300",
	},
	video_gen: {
		label: "Video Gen",
		className:
			"bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-300",
	},
	flagged: {
		label: "Flagged",
		className:
			"bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900 dark:text-red-300",
	},
	uploading: {
		label: "Uploading",
		className:
			"bg-purple-100 text-purple-800 hover:bg-purple-100 dark:bg-purple-900 dark:text-purple-300",
	},
	published: {
		label: "Published",
		className:
			"bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-300",
	},
};

function StatusBadge({ status }: { status: string }) {
	const config = statusConfig[status] ?? { label: status, className: "" };
	return (
		<Badge variant="outline" className={config.className}>
			{config.label}
		</Badge>
	);
}

function formatDate(dateString: string) {
	return new Date(dateString).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
}

export function VideosTable({ videos }: { videos: AutomatedVideo[] }) {
	if (videos.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
				<FileVideo className="h-12 w-12 text-muted-foreground/50" />
				<h3 className="mt-4 text-lg font-semibold">No videos yet</h3>
				<p className="mt-2 text-sm text-muted-foreground">
					Automated videos will appear here once the pipeline starts
					processing content ideas.
				</p>
			</div>
		);
	}

	return (
		<TooltipProvider>
			<div className="rounded-lg border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Title</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Flagged</TableHead>
							<TableHead>Score</TableHead>
							<TableHead>Created</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{videos.map((video) => (
							<TableRow key={video._id}>
								<TableCell className="font-medium">
									{video.title || "Untitled"}
								</TableCell>
								<TableCell>
									<StatusBadge status={video.status} />
								</TableCell>
								<TableCell>
									{video.status === "flagged" ? (
										<Tooltip>
											<TooltipTrigger asChild>
												<span className="inline-flex cursor-help">
													<AlertTriangle className="h-4 w-4 text-amber-500" />
												</span>
											</TooltipTrigger>
											<TooltipContent>
												<p>{video.flaggedReason || "Flagged for review"}</p>
											</TooltipContent>
										</Tooltip>
									) : (
										<span className="text-muted-foreground">\u2014</span>
									)}
								</TableCell>
								<TableCell className="text-muted-foreground">
									{video.scriptQualityScore ?? "\u2014"}
								</TableCell>
								<TableCell className="text-muted-foreground">
									{formatDate(video._createdAt)}
								</TableCell>
								<TableCell className="text-right">
									<div className="flex justify-end gap-2">
										{(video.status === "flagged" || video.status === "draft") && (
											<form action={regenerateScript.bind(null, video._id)}>
												<Button size="sm" variant="outline">
													Regenerate Script
												</Button>
											</form>
										)}
										{video.status === "flagged" && (
											<form action={retryRender.bind(null, video._id)}>
												<Button size="sm" variant="outline">
													Retry Render
												</Button>
											</form>
										)}
										{video.status === "flagged" && (
											<form action={publishAnyway.bind(null, video._id)}>
												<Button
													size="sm"
													variant="outline"
													className="text-purple-600 hover:text-purple-700"
												>
													Publish Anyway
												</Button>
											</form>
										)}
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</TooltipProvider>
	);
}
