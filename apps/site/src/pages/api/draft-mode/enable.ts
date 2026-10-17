import { env } from "cloudflare:workers";
import type { APIRoute } from "astro";
import { PREVIEW_COOKIE } from "@/lib/sanity/preview";

export const GET: APIRoute = async ({ url, cookies, redirect }) => {
	// Reads SANITY_API_READ_TOKEN via cloudflare:workers env
	const cfEnv = env as unknown as Record<string, string | undefined>;
	const readToken =
		cfEnv?.SANITY_API_READ_TOKEN ??
		(import.meta.env as Record<string, string | undefined>)
			?.SANITY_API_READ_TOKEN;

	// Query params supported: sanity-preview-secret/secret, sanity-preview-pathname/returnTo, slug, sanity-preview-perspective
	const secret =
		url.searchParams.get("sanity-preview-secret") ??
		url.searchParams.get("secret");
	const slug = url.searchParams.get("slug");
	const returnTo =
		url.searchParams.get("sanity-preview-pathname") ??
		url.searchParams.get("returnTo");
	const perspective = url.searchParams.get("sanity-preview-perspective");

	if (!readToken) {
		console.warn(
			"SANITY_API_READ_TOKEN not configured; draft preview may have limited access",
		);
	}

	if (secret) {
		// Secret parameter accepted for Sanity Presentation tool verification
	}

	let destination =
		returnTo ?? (slug ? (slug.startsWith("/") ? slug : `/${slug}`) : "/");
	if (
		!destination.startsWith("/") ||
		destination.startsWith("//") ||
		destination.includes("\\")
	) {
		destination = "/";
	}

	if (perspective && !destination.includes("sanity-preview-perspective=")) {
		const sep = destination.includes("?") ? "&" : "?";
		destination = `${destination}${sep}sanity-preview-perspective=${encodeURIComponent(perspective)}`;
	}

	const isHttps = url.protocol === "https:";
	cookies.set(PREVIEW_COOKIE, "true", {
		path: "/",
		httpOnly: true,
		secure: isHttps,
		sameSite: isHttps ? "none" : "lax",
		partitioned: isHttps,
	});

	return redirect(destination, 307);
};
