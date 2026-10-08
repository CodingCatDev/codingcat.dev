import { env } from "cloudflare:workers";
import { createMCPClient } from "@ai-sdk/mcp";
import { isStepCount, streamText } from "ai";
import type { APIRoute } from "astro";
import { createWorkersAI } from "workers-ai-provider";

export const prerender = false;

const SANITY_CONTEXT_MCP_URL =
	"https://api.sanity.io/v1/context/organizations/ovF2qiKSO/mcp/agent-aj-mcp";

export const OPTIONS: APIRoute = async () => {
	return new Response(null, {
		status: 204,
		headers: {
			"access-control-allow-origin": "*",
			"access-control-allow-methods": "GET, POST, OPTIONS",
			"access-control-allow-headers": "Content-Type, Authorization",
		},
	});
};

export const GET: APIRoute = async () => {
	return new Response(
		JSON.stringify({
			status: "ready",
			name: "CodingCat AI Assistant",
			model: "@cf/meta/llama-3.3-70b-instruct-fp8-fast",
			mcp: SANITY_CONTEXT_MCP_URL,
		}),
		{
			status: 200,
			headers: {
				"content-type": "application/json; charset=utf-8",
				"access-control-allow-origin": "*",
			},
		},
	);
};

export const POST: APIRoute = async ({ request }) => {
	const cfEnv = env as unknown as Record<string, unknown> | undefined;
	const sanityToken =
		(cfEnv?.SANITY_API_READ_TOKEN as string | undefined) ||
		process.env.SANITY_API_READ_TOKEN;

	if (!sanityToken) {
		return new Response(
			JSON.stringify({
				error: "SANITY_API_READ_TOKEN is not configured on the server.",
			}),
			{
				status: 500,
				headers: {
					"content-type": "application/json; charset=utf-8",
					"access-control-allow-origin": "*",
				},
			},
		);
	}

	let body: {
		messages?: Array<{ role: string; content: string }>;
		prompt?: string;
	};
	try {
		body = await request.json();
	} catch {
		return new Response(
			JSON.stringify({ error: "Invalid JSON request body" }),
			{
				status: 400,
				headers: {
					"content-type": "application/json; charset=utf-8",
					"access-control-allow-origin": "*",
				},
			},
		);
	}

	const messages =
		body.messages ||
		(body.prompt ? [{ role: "user" as const, content: body.prompt }] : []);

	if (!messages.length) {
		return new Response(
			JSON.stringify({ error: "Please provide a prompt or messages array" }),
			{
				status: 400,
				headers: {
					"content-type": "application/json; charset=utf-8",
					"access-control-allow-origin": "*",
				},
			},
		);
	}

	// Format messages for Vercel AI SDK
	const coreMessages = messages.map((m) => ({
		role: (m.role === "assistant" || m.role === "user" || m.role === "system"
			? m.role
			: "user") as "user" | "assistant" | "system",
		content: m.content,
	}));

	let mcpClient: Awaited<ReturnType<typeof createMCPClient>> | undefined;

	try {
		// 1. Connect MCP client to Sanity Context MCP endpoint
		mcpClient = await createMCPClient({
			transport: {
				type: "http",
				url: SANITY_CONTEXT_MCP_URL,
				headers: {
					Authorization: `Bearer ${sanityToken}`,
				},
				redirect: "follow",
				fetch: (input, init) => {
					const sanitizedInit = init ? { ...init } : {};
					if (sanitizedInit.redirect === "error") {
						sanitizedInit.redirect = "follow";
					}
					return globalThis.fetch(input, sanitizedInit);
				},
			},
		});

		const tools = await mcpClient.tools();

		// 2. Setup Cloudflare Workers AI model
		const aiBinding = cfEnv?.AI;
		if (!aiBinding) {
			await mcpClient.close();
			return new Response(
				JSON.stringify({
					error:
						"Cloudflare Workers AI binding is not available in the current environment.",
				}),
				{
					status: 500,
					headers: {
						"content-type": "application/json; charset=utf-8",
						"access-control-allow-origin": "*",
					},
				},
			);
		}

		const workersai = createWorkersAI({ binding: aiBinding as any });
		const model = workersai("@cf/meta/llama-3.3-70b-instruct-fp8-fast");

		// 3. Stream model response with multi-step tool calling
		const result = streamText({
			model,
			system:
				"You are CodingCat.dev's intelligent content assistant. Answer user queries by searching and exploring the Sanity Content Lake dataset using your tools (initial_context, groq_query, schema_explorer, array_field_reader). Always ground your answers in the retrieved content (articles, podcasts, authors, transcripts) and cite relevant URLs or titles.",
			messages: coreMessages,
			tools,
			stopWhen: isStepCount(10),
			onFinish: async () => {
				try {
					if (mcpClient) {
						await mcpClient.close();
					}
				} catch {
					// Ignore cleanup errors
				}
			},
		});

		const textResponse = result.toTextStreamResponse();
		const headers = new Headers(textResponse.headers);
		headers.set("access-control-allow-origin", "*");
		return new Response(textResponse.body, {
			status: textResponse.status,
			statusText: textResponse.statusText,
			headers,
		});
	} catch (err) {
		try {
			if (mcpClient) {
				await mcpClient.close();
			}
		} catch {}

		console.error("[Chat API Error]", err);
		return new Response(
			JSON.stringify({
				error:
					err instanceof Error
						? err.message
						: "Failed to generate chat response",
				stack: err instanceof Error ? err.stack : String(err),
			}),
			{
				status: 500,
				headers: {
					"content-type": "application/json; charset=utf-8",
					"access-control-allow-origin": "*",
				},
			},
		);
	}
};
