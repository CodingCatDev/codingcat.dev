import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { dashboardQuery } from "@/lib/sanity/dashboard";

export const dynamic = "force-dynamic";

export async function GET() {
	const hasSupabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
	if (hasSupabase) {
		const supabase = await createClient();
		const { data: { user } } = await supabase.auth.getUser();
		if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const [draft, scriptReady, audioGen, videoGen, flagged, uploading, published] = await Promise.all([
			dashboardQuery<number>(`count(*[_type == "automatedVideo" && status == "draft"])`),
			dashboardQuery<number>(`count(*[_type == "automatedVideo" && status == "script_ready"])`),
			dashboardQuery<number>(`count(*[_type == "automatedVideo" && status == "audio_gen"])`),
			dashboardQuery<number>(`count(*[_type == "automatedVideo" && status == "video_gen"])`),
			dashboardQuery<number>(`count(*[_type == "automatedVideo" && status == "flagged"])`),
			dashboardQuery<number>(`count(*[_type == "automatedVideo" && status == "uploading"])`),
			dashboardQuery<number>(`count(*[_type == "automatedVideo" && status == "published"])`),
		]);

		return NextResponse.json({
			draft: draft ?? 0,
			scriptReady: scriptReady ?? 0,
			audioGen: audioGen ?? 0,
			videoGen: videoGen ?? 0,
			flagged: flagged ?? 0,
			uploading: uploading ?? 0,
			published: published ?? 0,
			total: (draft ?? 0) + (scriptReady ?? 0) + (audioGen ?? 0) + (videoGen ?? 0) + (flagged ?? 0) + (uploading ?? 0) + (published ?? 0),
		});
	} catch (error) {
		console.error("Failed to fetch pipeline status:", error);
		return NextResponse.json({ error: "Failed" }, { status: 500 });
	}
}
