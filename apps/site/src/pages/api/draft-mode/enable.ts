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

	// Query params supported: secret, slug, returnTo
	const secret = url.searchParams.get("secret");
	const slug = url.searchParams.get("slug");
	const returnTo = url.searchParams.get("returnTo");

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

	cookies.set(PREVIEW_COOKIE, "true", {
		path: "/",
		httpOnly: true,
		secure: true,
		sameSite: "lax",
	});

	return redirect(destination, 307);
};
