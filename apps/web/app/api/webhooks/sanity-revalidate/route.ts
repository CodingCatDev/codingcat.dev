import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

export async function POST(request: NextRequest) {
	try {
		const { isValidSignature, body } = await parseBody<{
			_type: string;
			slug?: string;
		}>(request, process.env.SANITY_WEBHOOK_SECRET);

		if (!isValidSignature) {
			return NextResponse.json(
				{ message: "Invalid signature" },
				{ status: 401 },
			);
		}

		if (!body?._type) {
			return NextResponse.json(
				{ message: "Bad request" },
				{ status: 400 },
			);
		}

		// With defineLive + <SanityLive />, content pages get real-time updates
		// without ISR revalidation. We only keep revalidateTag("sanity") as a
		// fallback for when no active visitors are triggering live updates.
		//
		// IMPORTANT: Skip pipeline/internal document types that don't have
		// public-facing pages. These fire frequently (every cron run) and
		// were the primary cause of ISR write exhaustion.
		const SKIP_TYPES = new Set([
			"automatedVideo",
			"contentIdea",
			"sponsorLead",
			"pipeline_config",
			"content_config",
		]);

		if (SKIP_TYPES.has(body._type)) {
			return NextResponse.json({
				skipped: true,
				type: body._type,
				reason: "Internal document type — no revalidation needed",
			});
		}

		// For public content types, revalidate the sanity tag as a fallback.
		// This only affects pages that still use Next.js cache tags (e.g., sitemap).
		// Next.js 16 requires a second argument — { expire: 0 } for immediate invalidation
		revalidateTag("sanity", { expire: 0 });

		return NextResponse.json({
			revalidated: true,
			type: body._type,
			slug: body.slug,
			now: Date.now(),
		});
	} catch (error) {
		console.error("Revalidation error:", error);
		return NextResponse.json(
			{ message: "Error revalidating" },
			{ status: 500 },
		);
	}
}
