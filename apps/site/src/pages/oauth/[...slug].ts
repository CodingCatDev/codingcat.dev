import type { APIRoute } from "astro";
import { ALL as oauth2ALL } from "../oauth2/[...slug]";

export const prerender = false;

export const ALL: APIRoute = async (context) => {
	const url = new URL(context.request.url);
	// Rewrite legacy /oauth/* path to /oauth2/* so the /oauth2 handler processes it
	url.pathname = url.pathname.replace(/^\/oauth(\/|$)/, "/oauth2$1");
	const rewrittenRequest = new Request(url.toString(), context.request);
	return oauth2ALL({
		...context,
		request: rewrittenRequest,
	});
};
