"use client";

import { useEffect, useState, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, FileVideo, Handshake, Clock, Loader2 } from "lucide-react";
import { POLL_INTERVAL_MS, type ActivityItem } from "@/lib/types/dashboard";

const typeConfig: Record<
	string,
	{ icon: typeof Lightbulb; label: string; color: string }
> = {
	contentIdea: {
		icon: Lightbulb,
		label: "Idea",
		color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
	},
	automatedVideo: {
		icon: FileVideo,
		label: "Video",
		color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
	},
	sponsorLead: {
		icon: Handshake,
		label: "Sponsor",
		color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
	},
};

function formatTimeAgo(dateString: string) {
	const seconds = Math.floor(
		(Date.now() - new Date(dateString).getTime()) / 1000,
	);
	if (seconds < 60) return "just now";
	if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
	if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
	return `${Math.floor(seconds / 86400)}d ago`;
}

export function RecentActivity() {
	const [items, setItems] = useState<ActivityItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const fetchActivity = useCallback(async () => {
		try {
			const res = await fetch("/api/dashboard/activity");
			if (res.ok) {
				const data = await res.json();
				setItems(data);
			}
		} catch (error) {
			console.error("Failed to fetch activity:", error);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchActivity();
		const interval = setInterval(fetchActivity, POLL_INTERVAL_MS);
		return () => clearInterval(interval);
	}, [fetchActivity]);

	return (
		<div className="rounded-lg border p-6">
			<h2 className="text-lg font-semibold">Recent Activity</h2>
			{isLoading ? (
				<div className="mt-4 flex items-center justify-center py-8">
					<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
				</div>
			) : items.length === 0 ? (
				<p className="mt-4 text-sm text-muted-foreground">
					No activity yet \u2014 content will appear here as the pipeline runs.
				</p>
			) : (
				<div className="mt-4 space-y-3">
					{items.map((item) => {
						const config = typeConfig[item._type] ?? typeConfig.contentIdea;
						const Icon = config.icon;
						const name = item.title || item.companyName || "Untitled";
						return (
							<div key={item._id} className="flex items-center gap-3">
								<Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
								<div className="min-w-0 flex-1">
									<p className="truncate text-sm font-medium">{name}</p>
									<div className="flex items-center gap-2">
										<Badge variant="outline" className={`text-xs ${config.color}`}>
											{config.label}
										</Badge>
										{item.status && (
											<span className="text-xs text-muted-foreground">{item.status}</span>
										)}
									</div>
								</div>
								<div className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
									<Clock className="h-3 w-3" />
									{formatTimeAgo(item._updatedAt)}
								</div>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}
