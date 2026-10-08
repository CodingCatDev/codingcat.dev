import { env } from "cloudflare:workers";
import type { APIRoute } from "astro";

export const prerender = false;

const SANITY_CONTEXT_MCP_URL =
	"https://api.sanity.io/v1/context/organizations/ovF2qiKSO/mcp/agent-aj-mcp";

const MCP_HEADERS = {
	"content-type": "application/json; charset=utf-8",
	"access-control-allow-origin": "*",
	"access-control-allow-methods": "GET, POST, OPTIONS",
	"access-control-allow-headers":
		"Content-Type, Authorization, Mcp-Session-Id, Mcp-Protocol-Version",
	"mcp-protocol-version": "2024-11-05",
};

export const OPTIONS: APIRoute = async () => {
	return new Response(null, {
		status: 204,
		headers: MCP_HEADERS,
	});
};

export const GET: APIRoute = async ({ request, locals }) => {
	const origin = locals.siteUrl.origin;
	const accept = request.headers.get("accept") || "";

	// Support SSE stream for legacy MCP HTTP+SSE clients
	if (accept.includes("text/event-stream")) {
		const encoder = new TextEncoder();
		const stream = new ReadableStream({
			start(controller) {
				controller.enqueue(
					encoder.encode(`event: endpoint\ndata: ${origin}/mcp\n\n`),
				);
			},
		});

		return new Response(stream, {
			headers: {
				"content-type": "text/event-stream; charset=utf-8",
				"cache-control": "no-cache, no-transform",
				connection: "keep-alive",
				"access-control-allow-origin": "*",
				"access-control-allow-methods": "GET, POST, OPTIONS",
				"access-control-allow-headers":
					"Content-Type, Authorization, Mcp-Session-Id, Mcp-Protocol-Version",
			},
		});
	}

	return new Response(
		JSON.stringify(
			{
				status: "ok",
				server: "codingcatdev-sanity-context-mcp",
				version: "1.0.0",
				protocolVersion: "2024-11-05",
				supportedVersions: ["2026-07-28", "2024-11-05"],
				transport: "streamable-http",
				endpoint: `${origin}/mcp`,
				serverCard: `${origin}/.well-known/mcp/server-card.json`,
				capabilities: {
					tools: { listChanged: true },
					resources: { subscribe: false, listChanged: false },
					prompts: { listChanged: false },
				},
				tools: [
					"initial_context",
					"schema_explorer",
					"groq_query",
					"array_field_reader",
				],
			},
			null,
			2,
		),
		{
			headers: {
				...MCP_HEADERS,
				"cache-control": "public, max-age=3600",
			},
		},
	);
};

export const POST: APIRoute = async ({ request }) => {
	const rawBody = await request.text();

	// Read server-side Sanity Context token from cloudflare:workers env or process.env
	const cfEnv = env as unknown as Cloudflare.Env | undefined;
	const sanityToken =
		cfEnv?.SANITY_API_READ_TOKEN || process.env.SANITY_API_READ_TOKEN;

	if (!sanityToken) {
		return new Response(
			JSON.stringify({
				jsonrpc: "2.0",
				id: null,
				error: {
					code: -32001,
					message:
						"SANITY_API_READ_TOKEN is not configured on the server. Please add it to your environment variables.",
				},
			}),
			{ status: 500, headers: MCP_HEADERS },
		);
	}

	try {
		// Forward request to Sanity Context MCP endpoint with server-side Bearer token
		const sanityRes = await fetch(SANITY_CONTEXT_MCP_URL, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${sanityToken}`,
				"Content-Type": "application/json",
				Accept:
					request.headers.get("accept") ||
					"application/json, text/event-stream",
			},
			body: rawBody,
		});

		const responseText = await sanityRes.text();

		return new Response(responseText, {
			status: sanityRes.status,
			headers: {
				...MCP_HEADERS,
				"content-type":
					sanityRes.headers.get("content-type") ||
					"application/json; charset=utf-8",
			},
		});
	} catch (error) {
		console.error("[Sanity Context MCP Proxy Error]", error);
		return new Response(
			JSON.stringify({
				jsonrpc: "2.0",
				id: null,
				error: {
					code: -32603,
					message:
						error instanceof Error
							? error.message
							: "Internal error proxying to Sanity Context MCP",
				},
			}),
			{ status: 502, headers: MCP_HEADERS },
		);
	}
};
