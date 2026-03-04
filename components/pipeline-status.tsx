"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const POLL_INTERVAL_MS = 30_000;

interface PipelineData {
	draft: number;
	scriptReady: number;
	audioGen: number;
	videoGen: number;
	flagged: number;
	uploading: number;
	published: number;
	total: number;
}

const STAGES: {
	key: keyof Omit<PipelineData, "total">;
	label: string;
	color: string;
	bg: string;
	ring: string;
}[] = [
	{ key: "draft", label: "Draft", color: "text-gray-700 dark:text-gray-300", bg: "bg-gray-200 dark:bg-gray-700", ring: "ring-gray-300 dark:ring-gray-600" },
	{ key: "scriptReady", label: "Script", color: "text-yellow-700 dark:text-yellow-300", bg: "bg-yellow-200 dark:bg-yellow-800", ring: "ring-yellow-300 dark:ring-yellow-600" },
	{ key: "audioGen", label: "Audio", color: "text-orange-700 dark:text-orange-300", bg: "bg-orange-200 dark:bg-orange-800", ring: "ring-orange-300 dark:ring-orange-600" },
	{ key: "videoGen", label: "Video", color: "text-blue-700 dark:text-blue-300", bg: "bg-blue-200 dark:bg-blue-800", ring: "ring-blue-300 dark:ring-blue-600" },
	{ key: "flagged", label: "Flagged", color: "text-red-700 dark:text-red-300", bg: "bg-red-200 dark:bg-red-800", ring: "ring-red-300 dark:ring-red-600" },
	{ key: "uploading", label: "Upload", color: "text-purple-700 dark:text-purple-300", bg: "bg-purple-200 dark:bg-purple-800", ring: "ring-purple-300 dark:ring-purple-600" },
	{ key: "published", label: "Published", color: "text-green-700 dark:text-green-300", bg: "bg-green-200 dark:bg-green-800", ring: "ring-green-300 dark:ring-green-600" },
];

export function PipelineStatus() {
	const [data, setData] = useState<PipelineData | null>(null);
	const [loading, setLoading] = useState(true);

	const fetchPipeline = useCallback(async () => {
		try {
			const res = await fetch("/api/dashboard/pipeline");
			if (res.ok) {
				setData(await res.json());
			}
		} catch {
			// Silently fail — will retry on next poll
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchPipeline();
		const interval = setInterval(fetchPipeline, POLL_INTERVAL_MS);
		return () => clearInterval(interval);
	}, [fetchPipeline]);

	if (loading) {
		return (
			<div className="flex items-center justify-center py-8">
				<Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
			</div>
		);
	}

	if (!data) {
		return (
			<p className="py-4 text-center text-sm text-muted-foreground">
				Unable to load pipeline data.
			</p>
		);
	}

	return (
		<div className="space-y-4">
			{/* Stage indicators */}
			<div className="flex items-end gap-1.5">
				{STAGES.map((stage) => {
					const count = data[stage.key];
					const maxCount = Math.max(...STAGES.map((s) => data[s.key]), 1);
					const heightPct = Math.max((count / maxCount) * 100, 8);

					return (
						<div
							key={stage.key}
							className="flex flex-1 flex-col items-center gap-1"
						>
							{/* Count */}
							<span className={`text-xs font-semibold ${stage.color}`}>
								{count}
							</span>
							{/* Bar */}
							<div className="relative w-full" style={{ height: "48px" }}>
								<div
									className={`absolute bottom-0 w-full rounded-sm ${stage.bg} ring-1 ${stage.ring} transition-all duration-500`}
									style={{ height: `${heightPct}%`, minHeight: "4px" }}
								/>
							</div>
							{/* Label */}
							<span className="text-[10px] leading-tight text-muted-foreground">
								{stage.label}
							</span>
						</div>
					);
				})}
			</div>

			{/* Connector arrows */}
			<div className="flex items-center gap-1.5 px-2">
				{STAGES.map((stage, i) => (
					<div key={stage.key} className="flex flex-1 items-center">
						<div className={`h-0.5 flex-1 ${stage.bg}`} />
						{i < STAGES.length - 1 && (
							<span className="text-[10px] text-muted-foreground">→</span>
						)}
					</div>
				))}
			</div>

			{/* Total */}
			<div className="flex items-center justify-between border-t pt-3">
				<span className="text-xs text-muted-foreground">Total in pipeline</span>
				<span className="text-sm font-semibold">{data.total}</span>
			</div>
		</div>
	);
}
