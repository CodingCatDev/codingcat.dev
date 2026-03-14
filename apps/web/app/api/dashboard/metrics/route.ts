import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { dashboardQuery } from "@/lib/sanity/dashboard";
import type { DashboardMetrics } from "@/lib/types/dashboard";

export const dynamic = "force-dynamic";

export async function GET() {
	const hasSupabase =
		(process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL) &&
		(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY);

	if (!hasSupabase) {
		return NextResponse.json({ error: "Auth not configured" }, { status: 503 });
	}

	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const counts = await dashboardQuery<Record<string, number>>(`{
			"videosPublished": count(*[_type == "automatedVideo" && status == "published"]),
			"flaggedVideos": count(*[_type == "automatedVideo" && status == "flagged"]),
			"newIdeas": count(*[_type == "contentIdea" && status == "new"]),
			"sponsorPipeline": count(*[_type == "sponsorLead" && status != "paid"])
		}`);

		const metrics: DashboardMetrics = {
			videosPublished: counts?.videosPublished ?? 0,
			flaggedForReview: (counts?.flaggedVideos ?? 0) + (counts?.newIdeas ?? 0),
			sponsorPipeline: counts?.sponsorPipeline ?? 0,
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
