import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { dashboardQuery } from "@/lib/sanity/dashboard";
import type { ActivityItem } from "@/lib/types/dashboard";

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
		const items = await dashboardQuery<ActivityItem[]>(`
			*[_type in ["contentIdea", "automatedVideo", "sponsorLead"]] | order(_updatedAt desc) [0..9] {
				_id,
				_type,
				_updatedAt,
				title,
				companyName,
				status
			}
		`);

		return NextResponse.json(items ?? []);
	} catch (error) {
		console.error("Failed to fetch activity:", error);
		return NextResponse.json([], { status: 500 });
	}
}
