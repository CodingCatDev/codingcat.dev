import type { APIRoute } from "astro";
import { getAuth } from "@/lib/auth";

export const prerender = false;

export const ALL: APIRoute = async ({ request, locals }) => {
	const origin = locals.siteUrl.origin;
	const url = new URL(request.url);
	// Rewrite legacy /oauth/* path to /oauth2/* so Better Auth can process it
	url.pathname = url.pathname.replace(/^\/oauth(\/|$)/, "/oauth2$1");
	const rewrittenRequest = new Request(url.toString(), request);
	const auth = getAuth(origin);
	return auth.handler(rewrittenRequest);
};
