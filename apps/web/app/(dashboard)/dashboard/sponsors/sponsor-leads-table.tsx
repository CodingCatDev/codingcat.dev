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
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Handshake } from "lucide-react";
import { updateLeadStatus } from "./actions";

interface SponsorLead {
	_id: string;
	_createdAt: string;
	companyName: string;
	contactName: string;
	contactEmail: string;
	source: "inbound" | "outbound";
	status: "new" | "contacted" | "replied" | "negotiating" | "booked" | "paid";
	intent?: string;
	rateCard?: string;
	bookedSlot?: { title: string };
	lastEmailAt?: string;
	notes?: string;
}

const statusConfig: Record<string, { label: string; className: string }> = {
	new: {
		label: "New",
		className:
			"bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-300",
	},
	contacted: {
		label: "Contacted",
		className:
			"bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300",
	},
	replied: {
		label: "Replied",
		className:
			"bg-orange-100 text-orange-800 hover:bg-orange-100 dark:bg-orange-900 dark:text-orange-300",
	},
	negotiating: {
		label: "Negotiating",
		className:
			"bg-purple-100 text-purple-800 hover:bg-purple-100 dark:bg-purple-900 dark:text-purple-300",
	},
	booked: {
		label: "Booked",
		className:
			"bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-300",
	},
	paid: {
		label: "Paid",
		className:
			"bg-emerald-100 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-900 dark:text-emerald-300",
	},
};

const sourceConfig: Record<string, { label: string; className: string }> = {
	inbound: {
		label: "Inbound",
		className:
			"bg-teal-100 text-teal-800 hover:bg-teal-100 dark:bg-teal-900 dark:text-teal-300",
	},
	outbound: {
		label: "Outbound",
		className:
			"bg-indigo-100 text-indigo-800 hover:bg-indigo-100 dark:bg-indigo-900 dark:text-indigo-300",
	},
};

const statusOptions = [
	"new",
	"contacted",
	"replied",
	"negotiating",
	"booked",
	"paid",
] as const;

function StatusBadge({ status }: { status: string }) {
	const config = statusConfig[status] ?? { label: status, className: "" };
	return (
		<Badge variant="outline" className={config.className}>
			{config.label}
		</Badge>
	);
}

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

export function SponsorLeadsTable({ leads }: { leads: SponsorLead[] }) {
	if (leads.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
				<Handshake className="h-12 w-12 text-muted-foreground/50" />
				<h3 className="mt-4 text-lg font-semibold">No sponsor leads yet</h3>
				<p className="mt-2 text-sm text-muted-foreground">
					Sponsor leads will appear here once deals start coming in through
					inbound or outbound channels.
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
						<TableHead>Source</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>Booked Slot</TableHead>
						<TableHead>Last Email</TableHead>
						<TableHead className="text-right">Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{leads.map((lead) => (
						<TableRow key={lead._id}>
							<TableCell className="font-medium">
								{lead.companyName || "Unknown"}
							</TableCell>
							<TableCell>
								<div className="flex flex-col">
									<span className="text-sm">{lead.contactName || "\u2014"}</span>
									{lead.contactEmail && (
										<span className="text-xs text-muted-foreground">
											{lead.contactEmail}
										</span>
									)}
								</div>
							</TableCell>
							<TableCell>
								<SourceBadge source={lead.source} />
							</TableCell>
							<TableCell>
								<StatusBadge status={lead.status} />
							</TableCell>
							<TableCell className="text-muted-foreground">
								{lead.bookedSlot?.title || "\u2014"}
							</TableCell>
							<TableCell className="text-muted-foreground">
								{lead.lastEmailAt ? formatDate(lead.lastEmailAt) : "\u2014"}
							</TableCell>
							<TableCell className="text-right">
								<Select
									defaultValue={lead.status}
									onValueChange={(value) => updateLeadStatus(lead._id, value)}
								>
									<SelectTrigger className="w-[140px]">
										<SelectValue placeholder="Change status" />
									</SelectTrigger>
									<SelectContent>
										{statusOptions.map((s) => (
											<SelectItem key={s} value={s}>
												{statusConfig[s].label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
