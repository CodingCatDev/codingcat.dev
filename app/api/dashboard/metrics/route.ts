import { NextResponse } from "next/server";
import { dashboardQuery } from "@/lib/sanity/dashboard";

export const dynamic = "force-dynamic";

export async function GET() {
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

		return NextResponse.json({
			videosPublished: videosPublished ?? 0,
			flaggedForReview: (flaggedVideos ?? 0) + (newIdeas ?? 0),
			sponsorPipeline: sponsorPipeline ?? 0,
			revenue: null,
		});
	} catch (error) {
		console.error("Failed to fetch dashboard metrics:", error);
		return NextResponse.json(
			{ videosPublished: 0, flaggedForReview: 0, sponsorPipeline: 0, revenue: null },
			{ status: 500 },
		);
	}
}
