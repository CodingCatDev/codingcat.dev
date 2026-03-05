import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { invalidateConfig } from "@/lib/config";
import type { ConfigTable } from "@/lib/types/config";

export const dynamic = "force-dynamic";

const VALID_TABLES: ConfigTable[] = [
	"pipeline_config",
	"remotion_config",
	"content_config",
	"sponsor_config",
	"distribution_config",
	"gcs_config",
];

export async function POST(request: Request) {
	// Fail-closed auth
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
		const body = await request.json().catch(() => ({}));
		const { table } = body as { table?: string };

		// Validate table name if provided
		if (table && !VALID_TABLES.includes(table as ConfigTable)) {
			return NextResponse.json(
				{ error: `Invalid table: ${table}. Valid tables: ${VALID_TABLES.join(", ")}` },
				{ status: 400 },
			);
		}

		invalidateConfig(table as ConfigTable | undefined);

		return NextResponse.json({
			success: true,
			invalidated: table ?? "all",
		});
	} catch (error) {
		console.error("Failed to invalidate config:", error);
		return NextResponse.json(
			{ error: "Failed to invalidate config" },
			{ status: 500 },
		);
	}
}
