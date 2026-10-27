import type { APIRoute } from "astro";

export const prerender = false;

/**
 * Personal Agent Protocol (Poppy) 0.1 public discovery manifest
 * Spec: https://personalagentprotocol.org/docs/spec#3-discovery
 */
export const GET: APIRoute = async ({ request, locals }) => {
	const siteUrl = locals?.siteUrl ?? new URL("https://codingcat.dev");
	let reqUrl = siteUrl;
	if (request?.url) {
		try {
			reqUrl = new URL(request.url);
		} catch {
			reqUrl = siteUrl;
		}
	}

	const rawHostname = reqUrl.hostname || siteUrl.hostname || "codingcat.dev";
	const domain = rawHostname.replace(/^www\./i, "");
	const protocol =
		reqUrl.protocol === "https:" || siteUrl.protocol === "https:"
			? "https:"
			: reqUrl.protocol || "https:";
	const origin =
		rawHostname === "localhost" || rawHostname === "127.0.0.1"
			? siteUrl.origin
			: `${protocol}//${domain}`;

	const manifest = {
		protocol_version: "0.1",
		organization: {
			name: "CodingCat.dev",
			domain,
		},
		auth: {
			issuer: origin,
			direct: {
				scopes: [
					"poppy:read",
					"poppy:write",
					"read:content",
					"search",
					"mcp:tools",
				],
			},
			custom_scopes: {
				"read:content":
					"Read CodingCat.dev tutorials, courses, podcast episodes, and developer guides",
				search:
					"Search across CodingCat.dev blog posts, courses, and podcast episodes",
				"mcp:tools": "Execute CodingCat.dev Model Context Protocol (MCP) tools",
			},
		},
		apis: [
			{
				type: "openapi",
				url: `${origin}/.well-known/openapi.json`,
				description:
					"Search tutorials, courses, podcasts, and submit sponsorship inquiries",
			},
			{
				type: "mcp",
				url: `${origin}/mcp`,
				description:
					"CodingCat.dev Model Context Protocol (MCP) server for content search, design tokens, and editorial rules",
			},
		],
		web: {},
	};

	return new Response(JSON.stringify(manifest, null, 2), {
		headers: {
			"content-type": "application/json; charset=utf-8",
			"access-control-allow-origin": "*",
			"cache-control": "public, max-age=3600, s-maxage=86400",
		},
	});
};
