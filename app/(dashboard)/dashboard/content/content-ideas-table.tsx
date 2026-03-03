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
import { Lightbulb, ExternalLink } from "@/components/icons";
import { approveIdea, rejectIdea } from "./actions";

interface ContentIdea {
	_id: string;
	_createdAt: string;
	title: string;
	status: "new" | "approved" | "rejected";
	sourceUrl?: string;
	summary?: string;
	topics?: string[];
	collectedAt?: string;
}

const statusConfig: Record<string, { label: string; className: string }> = {
	new: {
		label: "New",
		className:
			"bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-300",
	},
	approved: {
		label: "Approved",
		className:
			"bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-300",
	},
	rejected: {
		label: "Rejected",
		className:
			"bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900 dark:text-red-300",
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

function truncateUrl(url: string, maxLength = 30) {
	try {
		const parsed = new URL(url);
		const display = parsed.hostname + parsed.pathname;
		return display.length > maxLength
			? display.slice(0, maxLength) + "\u2026"
			: display;
	} catch {
		return url.length > maxLength ? url.slice(0, maxLength) + "\u2026" : url;
	}
}

export function ContentIdeasTable({ ideas }: { ideas: ContentIdea[] }) {
	if (ideas.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
				<Lightbulb className="h-12 w-12 text-muted-foreground/50" />
				<h3 className="mt-4 text-lg font-semibold">No content ideas yet</h3>
				<p className="mt-2 text-sm text-muted-foreground">
					Content ideas will appear here once the ideation cron starts
					running.
				</p>
			</div>
		);
	}

	return (
		<div className="rounded-lg border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Title</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>Source</TableHead>
						<TableHead>Topics</TableHead>
						<TableHead>Collected</TableHead>
						<TableHead className="text-right">Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{ideas.map((idea) => (
						<TableRow key={idea._id}>
							<TableCell className="font-medium">
								{idea.title || "Untitled"}
							</TableCell>
							<TableCell>
								<StatusBadge status={idea.status} />
							</TableCell>
							<TableCell>
								{idea.sourceUrl ? (
									<a
										href={idea.sourceUrl}
										target="_blank"
										rel="noopener noreferrer"
										className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
									>
										{truncateUrl(idea.sourceUrl)}
										<ExternalLink className="h-3 w-3" />
									</a>
								) : (
									<span className="text-muted-foreground">\u2014</span>
								)}
							</TableCell>
							<TableCell>
								{idea.topics && idea.topics.length > 0 ? (
									<div className="flex flex-wrap gap-1">
										{idea.topics.slice(0, 3).map((topic) => (
											<Badge key={topic} variant="secondary" className="text-xs">
												{topic}
											</Badge>
										))}
										{idea.topics.length > 3 && (
											<Badge variant="secondary" className="text-xs">
												+{idea.topics.length - 3}
											</Badge>
										)}
									</div>
								) : (
									<span className="text-muted-foreground">\u2014</span>
								)}
							</TableCell>
							<TableCell className="text-muted-foreground">
								{formatDate(idea.collectedAt || idea._createdAt)}
							</TableCell>
							<TableCell className="text-right">
								{idea.status === "new" && (
									<div className="flex justify-end gap-2">
										<form action={approveIdea.bind(null, idea._id)}>
											<Button
												size="sm"
												variant="outline"
												className="text-green-600 hover:text-green-700"
											>
												Approve
											</Button>
										</form>
										<form action={rejectIdea.bind(null, idea._id)}>
											<Button
												size="sm"
												variant="outline"
												className="text-red-600 hover:text-red-700"
											>
												Reject
											</Button>
										</form>
									</div>
								)}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
