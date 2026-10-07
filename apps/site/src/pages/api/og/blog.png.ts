/**
 * OG card for blog posts.
 *
 * Uses workers-og with React element objects rather than an HTML string:
 * workers-og parses HTML with HTMLRewriter, which corrupts the HTML-to-VDOM
 * conversion on Workers (text chunking, phantom child nodes). Passing element
 * objects straight to ImageResponse bypasses that path entirely.
 *
 * Query params: `title` (required), `author`, `type`.
 */
import type { APIRoute } from "astro";
import { ImageResponse } from "workers-og";
import { buildOgElement, loadFonts, OG_CACHE_HEADER } from "@/lib/og-utils";

export const GET: APIRoute = async ({ url }) => {
	try {
		const title = url.searchParams.get("title") || "CodingCat.dev";
		const author = url.searchParams.get("author") || "CodingCat.dev";
		const type = url.searchParams.get("type") || "Blog";

		const element = buildOgElement({ title, author, type });

		const response = new ImageResponse(element, {
			width: 1200,
			height: 630,
			fonts: loadFonts(),
		});

		const buffer = await response.arrayBuffer();

		return new Response(buffer, {
			headers: {
				"Content-Type": "image/png",
				"Content-Length": buffer.byteLength.toString(),
				"Cache-Control": OG_CACHE_HEADER,
			},
		});
	} catch (error) {
		// A failed card must not break the page that references it; social
		// scrapers fall back to the next og:image or to no image at all.
		console.error("og image generation failed", error);
		return new Response(null, { status: 500 });
	}
};
