import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { dashboardQuery } from "@/lib/sanity/dashboard";

export const dynamic = "force-dynamic";

export async function GET() {
	const hasSupabase =
		process.env.NEXT_PUBLIC_SUPABASE_URL &&
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

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
		// Single consolidated GROQ query for all pipeline stages
		const counts = await dashboardQuery<Record<string, number>>(`{
			"draft": count(*[_type == "automatedVideo" && status == "draft"]),
			"scriptReady": count(*[_type == "automatedVideo" && status == "script_ready"]),
			"audioGen": count(*[_type == "automatedVideo" && status == "audio_gen"]),
			"rendering": count(*[_type == "automatedVideo" && status == "rendering"]),
			"videoGen": count(*[_type == "automatedVideo" && status == "video_gen"]),
			"flagged": count(*[_type == "automatedVideo" && status == "flagged"]),
			"uploading": count(*[_type == "automatedVideo" && status == "uploading"]),
			"published": count(*[_type == "automatedVideo" && status == "published"])
		}`);

		const total = Object.values(counts ?? {}).reduce((sum, n) => sum + (n ?? 0), 0);

		return NextResponse.json({
			...counts,
			total,
		});
	} catch (error) {
		console.error("Failed to fetch pipeline status:", error);
		return NextResponse.json({ error: "Failed" }, { status: 500 });
	}
}
