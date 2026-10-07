import type { APIRoute } from "astro";
import { PREVIEW_COOKIE } from "@/lib/sanity/preview";

function resolveDestination(raw: string | null): string {
	if (
		!raw ||
		!raw.startsWith("/") ||
		raw.startsWith("//") ||
		raw.includes("\\")
	) {
		return "/";
	}
	return raw;
}

export const POST: APIRoute = async ({ request, url, cookies, redirect }) => {
	let returnTo: string | null = null;
	const contentType = request.headers.get("content-type") ?? "";

	if (
		contentType.includes("application/x-www-form-urlencoded") ||
		contentType.includes("multipart/form-data")
	) {
		try {
			const formData = await request.formData();
			const val = formData.get("returnTo");
			if (typeof val === "string") {
				returnTo = val;
			}
		} catch {
			// fall through
		}
	} else if (contentType.includes("application/json")) {
		try {
			const body = (await request.json()) as Record<string, unknown>;
			if (typeof body?.returnTo === "string") {
				returnTo = body.returnTo;
			}
		} catch {
			// fall through
		}
	}

	if (!returnTo) {
		returnTo = url.searchParams.get("returnTo");
	}

	cookies.delete(PREVIEW_COOKIE, { path: "/" });
	cookies.set(PREVIEW_COOKIE, "", { maxAge: 0, path: "/" });

	return redirect(resolveDestination(returnTo), 303);
};

export const GET: APIRoute = async ({ url, cookies, redirect }) => {
	const returnTo = url.searchParams.get("returnTo");

	cookies.delete(PREVIEW_COOKIE, { path: "/" });
	cookies.set(PREVIEW_COOKIE, "", { maxAge: 0, path: "/" });

	return redirect(resolveDestination(returnTo), 307);
};
