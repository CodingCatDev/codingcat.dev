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
import { Users } from "lucide-react";

interface SponsorPool {
	_id: string;
	companyName: string;
	contactName: string;
	contactEmail: string;
	website?: string;
	category?: string;
	source: "curated" | "enriched";
	relevanceScore?: number;
	lastContactedAt?: string;
}

const sourceConfig: Record<string, { label: string; className: string }> = {
	curated: {
		label: "Curated",
		className:
			"bg-teal-100 text-teal-800 hover:bg-teal-100 dark:bg-teal-900 dark:text-teal-300",
	},
	enriched: {
		label: "Enriched",
		className:
			"bg-indigo-100 text-indigo-800 hover:bg-indigo-100 dark:bg-indigo-900 dark:text-indigo-300",
	},
};

function SourceBadge({ source }: { source: string }) {
	const config = sourceConfig[source] ?? { label: source, className: "" };
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

export function SponsorPoolTable({ sponsors }: { sponsors: SponsorPool[] }) {
	if (sponsors.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
				<Users className="h-12 w-12 text-muted-foreground/50" />
				<h3 className="mt-4 text-lg font-semibold">No sponsors in pool</h3>
				<p className="mt-2 text-sm text-muted-foreground">
					Potential sponsors will appear here once the pool is populated through
					curation or enrichment.
				</p>
			</div>
		);
	}

	return (
		<div className="rounded-lg border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Company</TableHead>
						<TableHead>Contact</TableHead>
						<TableHead>Category</TableHead>
						<TableHead>Source</TableHead>
						<TableHead>Score</TableHead>
						<TableHead>Last Contacted</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{sponsors.map((sponsor) => (
						<TableRow key={sponsor._id}>
							<TableCell className="font-medium">
								<div className="flex flex-col">
									<span>{sponsor.companyName || "Unknown"}</span>
									{sponsor.website && (
										<a
											href={sponsor.website}
											target="_blank"
											rel="noopener noreferrer"
											className="text-xs text-muted-foreground hover:text-foreground"
										>
											{sponsor.website}
										</a>
									)}
								</div>
							</TableCell>
							<TableCell>
								<div className="flex flex-col">
									<span className="text-sm">{sponsor.contactName || "\u2014"}</span>
									{sponsor.contactEmail && (
										<span className="text-xs text-muted-foreground">
											{sponsor.contactEmail}
										</span>
									)}
								</div>
							</TableCell>
							<TableCell className="text-muted-foreground">
								{sponsor.category || "\u2014"}
							</TableCell>
							<TableCell>
								<SourceBadge source={sponsor.source} />
							</TableCell>
							<TableCell className="text-muted-foreground">
								{sponsor.relevanceScore ?? "\u2014"}
							</TableCell>
							<TableCell className="text-muted-foreground">
								{sponsor.lastContactedAt
									? formatDate(sponsor.lastContactedAt)
									: "\u2014"}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
