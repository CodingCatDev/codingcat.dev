import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { dashboardQuery, dashboardClient } from "@/lib/sanity/dashboard";

export const dynamic = "force-dynamic";

const SETTINGS_DOC_ID = "dashboardSettings";

const DEFAULT_SETTINGS = {
	videosPerWeek: 3,
	publishDays: ["Mon", "Wed", "Fri"],
	contentCategories: [
		"JavaScript", "TypeScript", "React", "Next.js", "Angular",
		"Svelte", "Node.js", "CSS", "DevOps", "AI / ML",
		"Web Performance", "Tooling",
	],
	rateCardTiers: [
		{ name: "Pre-roll Mention", description: "15-second sponsor mention", price: 200 },
		{ name: "Mid-roll Segment", description: "60-second dedicated segment", price: 500 },
		{ name: "Dedicated Video", description: "Full sponsored video", price: 1500 },
	],
};

async function requireAuth() {
	const hasSupabase =
		(process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL) &&
		(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY);

	if (!hasSupabase) {
		return { error: NextResponse.json({ error: "Auth not configured" }, { status: 503 }) };
	}

	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
	}

	return { user };
}

const VALID_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function validateSettings(body: unknown): { valid: boolean; data?: Record<string, unknown>; error?: string } {
	if (!body || typeof body !== "object") {
		return { valid: false, error: "Invalid request body" };
	}

	const input = body as Record<string, unknown>;
	const sanitized: Record<string, unknown> = {};

	if ("videosPerWeek" in input) {
		const v = Number(input.videosPerWeek);
		if (!Number.isInteger(v) || v < 1 || v > 14) {
			return { valid: false, error: "videosPerWeek must be an integer between 1 and 14" };
		}
		sanitized.videosPerWeek = v;
	}

	if ("publishDays" in input) {
		if (!Array.isArray(input.publishDays) || !input.publishDays.every((d: unknown) => typeof d === "string" && VALID_DAYS.includes(d as string))) {
			return { valid: false, error: "publishDays must be an array of valid day abbreviations" };
		}
		sanitized.publishDays = input.publishDays;
	}

	if ("contentCategories" in input) {
		if (!Array.isArray(input.contentCategories) || !input.contentCategories.every((c: unknown) => typeof c === "string" && (c as string).length <= 50)) {
			return { valid: false, error: "contentCategories must be an array of strings (max 50 chars each)" };
		}
		sanitized.contentCategories = input.contentCategories;
	}

	if ("rateCardTiers" in input) {
		if (!Array.isArray(input.rateCardTiers)) {
			return { valid: false, error: "rateCardTiers must be an array" };
		}
		for (const tier of input.rateCardTiers as Record<string, unknown>[]) {
			if (typeof tier.name !== "string" || typeof tier.description !== "string" || typeof tier.price !== "number") {
				return { valid: false, error: "Each rate card tier must have name (string), description (string), and price (number)" };
			}
		}
		sanitized.rateCardTiers = (input.rateCardTiers as Record<string, unknown>[]).map((t) => ({
			_type: "object",
			_key: crypto.randomUUID().slice(0, 8),
			name: t.name,
			description: t.description,
			price: t.price,
		}));
	}

	if (Object.keys(sanitized).length === 0) {
		return { valid: false, error: "No valid fields provided" };
	}

	return { valid: true, data: sanitized };
}

export async function GET() {
	const auth = await requireAuth();
	if (auth.error) return auth.error;

	try {
		const settings = await dashboardQuery(
			`*[_type == "dashboardSettings"][0] {
				videosPerWeek,
				publishDays,
				contentCategories,
				rateCardTiers[] { name, description, price }
			}`
		);
		return NextResponse.json(settings ?? DEFAULT_SETTINGS);
	} catch (error) {
		console.error("Failed to fetch settings:", error);
		return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
	}
}

export async function PUT(request: Request) {
	const auth = await requireAuth();
	if (auth.error) return auth.error;

	if (!dashboardClient) {
		return NextResponse.json({ error: "Sanity client not available" }, { status: 503 });
	}

	try {
		const body = await request.json();
		const validation = validateSettings(body);

		if (!validation.valid) {
			return NextResponse.json({ error: validation.error }, { status: 400 });
		}

		// Use createIfNotExists with deterministic ID to prevent race conditions
		await dashboardClient.createIfNotExists({
			_id: SETTINGS_DOC_ID,
			_type: "dashboardSettings",
			...DEFAULT_SETTINGS,
		});

		await dashboardClient.patch(SETTINGS_DOC_ID).set(validation.data!).commit();

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Failed to update settings:", error);
		return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
	}
}
