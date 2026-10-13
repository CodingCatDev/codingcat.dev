import type { APIRoute } from "astro";
import { getAuth } from "@/lib/auth";

export const prerender = false;

export const GET: APIRoute = async ({ request, locals }) => {
	const origin = locals.siteUrl.origin;
	const auth = getAuth(origin);
	return auth.handler(request);
};
