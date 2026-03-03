import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { FileVideo, Flag, Handshake, DollarSign } from "lucide-react";
import { dashboardQuery } from "@/lib/sanity/dashboard";

async function fetchDashboardMetrics() {
	try {
		const [videosPublished, flaggedVideos, newIdeas, sponsorPipeline] =
			await Promise.all([
				dashboardQuery<number>(
					`count(*[_type == "automatedVideo" && status == "published"])`,
				),
				dashboardQuery<number>(
					`count(*[_type == "automatedVideo" && status == "flagged"])`,
				),
				dashboardQuery<number>(
					`count(*[_type == "contentIdea" && status == "new"])`,
				),
				dashboardQuery<number>(
					`count(*[_type == "sponsorLead" && status != "paid"])`,
				),
			]);

		return {
			videosPublished: String(videosPublished ?? 0),
			flaggedForReview: String((flaggedVideos ?? 0) + (newIdeas ?? 0)),
			sponsorPipeline: String(sponsorPipeline ?? 0),
			revenue: "\u2014",
		};
	} catch (error) {
		console.error("Failed to fetch dashboard metrics:", error);
		return {
			videosPublished: "\u2014",
			flaggedForReview: "\u2014",
			sponsorPipeline: "\u2014",
			revenue: "\u2014",
		};
	}
}

export async function SectionCards() {
	const metrics = await fetchDashboardMetrics();

	const cards = [
		{
			title: "Videos Published",
			value: metrics.videosPublished,
			description: "Total automated videos published",
			icon: FileVideo,
		},
		{
			title: "Flagged for Review",
			value: metrics.flaggedForReview,
			description: "Content needing attention",
			icon: Flag,
		},
		{
			title: "Sponsor Pipeline",
			value: metrics.sponsorPipeline,
			description: "Active sponsor leads",
			icon: Handshake,
		},
		{
			title: "Revenue",
			value: metrics.revenue,
			description: "Monthly sponsor revenue",
			icon: DollarSign,
		},
	];

	return (
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
	);
}
