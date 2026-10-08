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
				"You are CodingCat.dev's intelligent content assistant. Answer user queries by searching and exploring the Sanity Content Lake dataset using your tools (initial_context, groq_query, schema_explorer, array_field_reader). In each step, you can call tools to query the dataset. Once you obtain the results from your tool calls, you MUST synthesize your findings and generate a helpful, complete text answer grounded in the retrieved content (articles, podcasts, authors, transcripts) citing relevant titles or URLs.",
			messages: coreMessages,
			tools,
			stopWhen: isStepCount(10),
			onError: ({ error }) => {
				console.error("[StreamText Internal Error]", error);
			},
		});

		// Pipe text stream through TransformStream with explicit error surface
		const transformStream = new TransformStream();
		const writer = transformStream.writable.getWriter();
		const encoder = new TextEncoder();

		(async () => {
			try {
				let hasOutput = false;
				for await (const chunk of result.textStream) {
					if (chunk) {
						hasOutput = true;
						await writer.write(encoder.encode(chunk));
					}
				}
				if (!hasOutput) {
					// Check all steps to see if text was produced across steps
					const steps = await result.steps;
					const allText = steps.map((s) => s.text).filter(Boolean).join("\n\n");
					if (allText) {
						await writer.write(encoder.encode(allText));
					} else {
						const debugInfo = steps
							.map(
								(s, idx) =>
									`Step ${idx + 1}: finish=${s.finishReason}, tools=${s.toolCalls?.map((t) => t.toolName).join(",") || "none"}`,
							)
							.join("; ");
						await writer.write(
							encoder.encode(
								`I queried the CodingCat.dev Sanity content lake (${steps.length} steps: ${debugInfo}), but no final text was emitted.`,
							),
						);
					}
				}
			} catch (streamErr) {
				console.error("[StreamText Stream Loop Error]", streamErr);
				const errMsg =
					streamErr instanceof Error ? streamErr.message : String(streamErr);
				await writer.write(
					encoder.encode(`\n\n[Error generating response: ${errMsg}]`),
				);
			} finally {
				await writer.close();
				if (mcpClient) {
					try {
						await mcpClient.close();
					} catch {}
				}
			}
		})();

		return new Response(transformStream.readable, {
			headers: {
				"content-type": "text/plain; charset=utf-8",
				"access-control-allow-origin": "*",
				"cache-control": "no-cache",
			},
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
