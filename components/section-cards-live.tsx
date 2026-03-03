"use client";

import { useEffect, useState, useCallback } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { FileVideo, Flag, Handshake, DollarSign, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { POLL_INTERVAL_MS, type DashboardMetrics } from "@/lib/types/dashboard";

export function SectionCardsLive({
	initialMetrics,
}: {
	initialMetrics?: DashboardMetrics;
}) {
	const [metrics, setMetrics] = useState<DashboardMetrics>(
		initialMetrics ?? {
			videosPublished: 0,
			flaggedForReview: 0,
			sponsorPipeline: 0,
			revenue: null,
		},
	);
	const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [secondsAgo, setSecondsAgo] = useState(0);

	const fetchMetrics = useCallback(async () => {
		try {
			setIsRefreshing(true);
			const res = await fetch("/api/dashboard/metrics");
			if (res.ok) {
				const data = await res.json();
				setMetrics(data);
				setLastUpdated(new Date());
				setSecondsAgo(0);
			}
		} catch (error) {
			console.error("Failed to refresh metrics:", error);
		} finally {
			setIsRefreshing(false);
		}
	}, []);

	useEffect(() => {
		fetchMetrics();
		const interval = setInterval(fetchMetrics, POLL_INTERVAL_MS);
		return () => clearInterval(interval);
	}, [fetchMetrics]);

	useEffect(() => {
		const tick = setInterval(() => {
			setSecondsAgo(Math.floor((Date.now() - lastUpdated.getTime()) / 1000));
		}, 1000);
		return () => clearInterval(tick);
	}, [lastUpdated]);

	const timeAgo =
		secondsAgo < 5
			? "just now"
			: secondsAgo < 60
				? `${secondsAgo}s ago`
				: `${Math.floor(secondsAgo / 60)}m ago`;

	const cards = [
		{
			title: "Videos Published",
			value: String(metrics.videosPublished),
			description: "Total automated videos published",
			icon: FileVideo,
		},
		{
			title: "Flagged for Review",
			value: String(metrics.flaggedForReview),
			description: "Content needing attention",
			icon: Flag,
		},
		{
			title: "Sponsor Pipeline",
			value: String(metrics.sponsorPipeline),
			description: "Active sponsor leads",
			icon: Handshake,
		},
		{
			title: "Revenue",
			value: metrics.revenue != null ? `$${metrics.revenue}` : "\u2014",
			description: "Monthly sponsor revenue",
			icon: DollarSign,
		},
	];

	return (
		<div className="flex flex-col gap-2">
			<div className="flex items-center justify-between">
				<p className="text-xs text-muted-foreground">Updated {timeAgo}</p>
				<Button
					variant="ghost"
					size="sm"
					className="h-6 gap-1 px-2 text-xs text-muted-foreground"
					onClick={fetchMetrics}
					disabled={isRefreshing}
				>
					<RefreshCw
						className={`h-3 w-3 ${isRefreshing ? "animate-spin" : ""}`}
					/>
					Refresh
				</Button>
			</div>
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{cards.map((card) => (
					<Card key={card.title}>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								{card.title}
							</CardTitle>
							<card.icon className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{card.value}</div>
							<CardDescription>{card.description}</CardDescription>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
