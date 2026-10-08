import { env } from "cloudflare:workers";
import { createMCPClient } from "@ai-sdk/mcp";
import { createClient } from "@sanity/client";
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

		const mcpTools = await mcpClient.tools();

		// Directly configure Sanity client for fallback per prompt instructions (Step 3)
		const sanityClient = createClient({
			projectId: (cfEnv?.PUBLIC_SANITY_PROJECT_ID as string) || "hfh83o0w",
			dataset: (cfEnv?.PUBLIC_SANITY_DATASET as string) || "production",
			apiVersion: (cfEnv?.PUBLIC_SANITY_API_VERSION as string) || "2025-09-30",
			useCdn: false,
			token: sanityToken,
		});

		const tools = {
			...mcpTools,
			groq_query: {
				...mcpTools.groq_query,
				execute: async ({ query }: { query: string }) => {
					try {
						const mcpResult = await (mcpTools.groq_query as any).execute(
							{ query },
							{} as any,
						);
						const parsed =
							typeof mcpResult === "string"
								? JSON.parse(mcpResult)
								: mcpResult;
						const results =
							parsed?.result ||
							(Array.isArray(parsed?.content) && parsed.content[0]?.text
								? JSON.parse(parsed.content[0].text)?.result
								: null);
						if (Array.isArray(results) && results.length > 0) {
							return mcpResult;
						}
					} catch {}

					// Fallback: direct Sanity fetch
					try {
						const cleanQuery = query.startsWith("*") ? query : `*[${query}]`;
						const directResult = await sanityClient.fetch(cleanQuery);
						return {
							content: [
								{
									type: "text",
									text: JSON.stringify({ result: directResult }),
								},
							],
						};
					} catch (directErr) {
						return {
							content: [
								{
									type: "text",
									text: JSON.stringify({
										error:
											directErr instanceof Error
												? directErr.message
												: String(directErr),
									}),
								},
							],
							isError: true,
						};
					}
				},
			},
		};

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
				"You are CodingCat.dev's intelligent content assistant (AJ). Answer user queries by searching and exploring the Sanity Content Lake dataset using your tools (initial_context, groq_query, schema_explorer, array_field_reader).\n\nDataset tips:\n- Content types: 'post' (blog articles), 'podcast' (podcast episodes), 'author', 'guest', 'transcript'.\n- People's names (authors, guests) are stored in the 'title' field (e.g. *[_type == 'author' && title match '*Alex*']).\n- Fields on posts and podcasts: title, slug, excerpt, date, author[]->title, guest[]->title, youtube.\n- Once you receive results from your query, synthesize them into a helpful, conversational, grounded response citing specific titles and URLs (/post/<slug> or /podcast/<slug>).",
			messages: coreMessages,
			tools,
			stopWhen: isStepCount(5),
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
				for await (const part of result.stream) {
					if (part.type === "text-delta") {
						hasOutput = true;
						await writer.write(encoder.encode(part.text));
					} else if (part.type === "error") {
						console.error("[Stream Part Error]", (part as any).error);
						await writer.write(
							encoder.encode(
								`\n\n[Model Stream Error: ${(part as any).error instanceof Error ? (part as any).error.message : JSON.stringify((part as any).error)}]`,
							),
						);
					}
				}
				if (!hasOutput) {
					// Check all steps to see if text was produced across steps
					const steps = await result.steps;
					const allText = steps
						.map((s) => s.text)
						.filter(Boolean)
						.join("\n\n");
					if (allText) {
						await writer.write(encoder.encode(allText));
					} else {
						const stepTrace = steps.map((s, idx) => ({
							step: idx + 1,
							finishReason: s.finishReason,
							toolCalls: s.toolCalls?.map((tc) => ({
								name: tc.toolName,
								args: (tc as any).args ?? (tc as any).input,
							})),
							toolResults: s.toolResults?.map((tr) => ({
								name: tr.toolName,
								output: (tr as any).output ?? (tr as any).result,
							})),
						}));
						await writer.write(
							encoder.encode(
								`I searched the CodingCat.dev Sanity content lake. Diagnostic trace:\n${JSON.stringify(stepTrace, null, 2)}`,
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
