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

		// Revalidate by content type
		revalidateTag(body._type);

		// Revalidate specific slug
		if (body.slug) {
			revalidateTag(`${body._type}:${body.slug}`);
		}

		// Always revalidate home page and settings when any content changes
		revalidateTag("home");

		// Revalidate listing pages
		revalidateTag(`${body._type}-list`);

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
