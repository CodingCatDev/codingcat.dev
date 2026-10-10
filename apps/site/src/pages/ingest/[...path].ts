import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";

/**
 * First-party Cloudflare Worker Reverse Proxy for PostHog (`/ingest/*`).
 *
 * Why: ~40%+ of developers use adblockers (uBlock Origin, Brave) that block
 * `posthog.com` and third-party analytics domains. Routing PostHog through
 * `https://codingcat.dev/ingest/*` ensures 100% of visitor flows, clicks, and
 * LMS course conversion funnels are captured over the existing HTTP/3 connection.
 *
 * Routes:
 * - `/ingest/static/*` -> `https://us-assets.i.posthog.com/static/*`
 * - `/ingest/*`        -> `https://us.i.posthog.com/*`
 */
const DEFAULT_API_HOST = "https://us.i.posthog.com";
const DEFAULT_ASSETS_HOST = "https://us-assets.i.posthog.com";

export const ALL: APIRoute = async ({ request, params }) => {
	const runtimeEnv = env as unknown as Record<string, string | undefined>;
	const apiHost = runtimeEnv.PUBLIC_POSTHOG_HOST || DEFAULT_API_HOST;
	const assetsHost = apiHost.includes("eu.")
		? "https://eu-assets.i.posthog.com"
		: DEFAULT_ASSETS_HOST;

	const subPath = params.path || "";
	const url = new URL(request.url);
	const isStaticAsset = subPath.startsWith("static/");
	const targetOrigin = isStaticAsset ? assetsHost : apiHost;
	const targetUrl = `${targetOrigin}/${subPath}${url.search}`;

	const headers = new Headers(request.headers);
	headers.delete("cookie");
	headers.set("host", new URL(targetOrigin).host);

	const clientIp = request.headers.get("cf-connecting-ip");
	if (clientIp) {
		headers.set("x-forwarded-for", clientIp);
	}

	try {
		const upstreamResponse = await fetch(targetUrl, {
			method: request.method,
			headers,
			body:
				request.method !== "GET" && request.method !== "HEAD"
					? await request.arrayBuffer()
					: undefined,
			redirect: "manual",
		});

		const responseHeaders = new Headers(upstreamResponse.headers);
		responseHeaders.delete("set-cookie");

		return new Response(upstreamResponse.body, {
			status: upstreamResponse.status,
			statusText: upstreamResponse.statusText,
			headers: responseHeaders,
		});
	} catch {
		return new Response(null, { status: 204 });
	}
};
