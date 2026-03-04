import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { dashboardQuery, dashboardClient } from "@/lib/sanity/dashboard";

export const dynamic = "force-dynamic";

export async function GET() {
	// Auth check (skip if Supabase not configured)
	const hasSupabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
	if (hasSupabase) {
		const supabase = await createClient();
		const { data: { user } } = await supabase.auth.getUser();
		if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const settings = await dashboardQuery(
			`*[_type == "dashboardSettings"][0] {
				videosPerWeek,
				publishDays,
				contentCategories,
				rateCardTiers[] { name, description, price }
			}`
		);
		return NextResponse.json(settings ?? {
			videosPerWeek: 3,
			publishDays: ["Mon", "Wed", "Fri"],
			contentCategories: ["JavaScript", "TypeScript", "React", "Next.js", "Angular", "Svelte", "Node.js", "CSS", "DevOps", "AI / ML", "Web Performance", "Tooling"],
			rateCardTiers: [
				{ name: "Pre-roll Mention", description: "15-second sponsor mention", price: 200 },
				{ name: "Mid-roll Segment", description: "60-second dedicated segment", price: 500 },
				{ name: "Dedicated Video", description: "Full sponsored video", price: 1500 },
			],
		});
	} catch (error) {
		console.error("Failed to fetch settings:", error);
		return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
	}
}

export async function PUT(request: Request) {
	const hasSupabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
	if (hasSupabase) {
		const supabase = await createClient();
		const { data: { user } } = await supabase.auth.getUser();
		if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	if (!dashboardClient) {
		return NextResponse.json({ error: "Sanity client not available" }, { status: 503 });
	}

	try {
		const body = await request.json();

		// Find or create the settings document
		const existing = await dashboardQuery(`*[_type == "dashboardSettings"][0]{ _id }`);

		if (existing?._id) {
			await dashboardClient.patch(existing._id).set(body).commit();
		} else {
			await dashboardClient.create({
				_type: "dashboardSettings",
				...body,
			});
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Failed to update settings:", error);
		return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
	}
}
