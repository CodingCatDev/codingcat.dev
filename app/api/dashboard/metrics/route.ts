import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { dashboardQuery } from "@/lib/sanity/dashboard";
import type { DashboardMetrics } from "@/lib/types/dashboard";

export const dynamic = "force-dynamic";

export async function GET() {
	const hasSupabase =
		process.env.NEXT_PUBLIC_SUPABASE_URL &&
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

	if (hasSupabase) {
		const supabase = await createClient();
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
	}

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

		const metrics: DashboardMetrics = {
			videosPublished: videosPublished ?? 0,
			flaggedForReview: (flaggedVideos ?? 0) + (newIdeas ?? 0),
			sponsorPipeline: sponsorPipeline ?? 0,
			revenue: null,
		};

		return NextResponse.json(metrics);
	} catch (error) {
		console.error("Failed to fetch dashboard metrics:", error);
		return NextResponse.json(
			{ videosPublished: 0, flaggedForReview: 0, sponsorPipeline: 0, revenue: null },
			{ status: 500 },
		);
	}
}
