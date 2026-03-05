import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

export async function POST(request: NextRequest) {
	try {
		const { isValidSignature, body } = await parseBody<{
			_type: string;
			slug?: string;
		}>(request, process.env.SANITY_REVALIDATE_SECRET);

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

		// Revalidate all sanity-tagged caches (the "heavy hammer" approach)
		// This is a backup for when no visitors are active to trigger SanityLive revalidation
		revalidateTag("sanity");

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
