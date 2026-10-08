import { env } from "cloudflare:workers";
import { createMCPClient } from "@ai-sdk/mcp";
import { isStepCount, streamText } from "ai";
import type { APIRoute } from "astro";
import { createWorkersAI } from "workers-ai-provider";

export const prerender = false;

const SANITY_CONTEXT_MCP_URL =
	"https://api.sanity.io/v1/context/organizations/ovF2qiKSO/mcp/agent-aj-mcp";

export const POST: APIRoute = async ({ request }) => {
	const cfEnv = env as unknown as Cloudflare.Env | undefined;
	const sanityToken =
		cfEnv?.SANITY_API_READ_TOKEN || process.env.SANITY_API_READ_TOKEN;

	if (!sanityToken) {
		return new Response(
			JSON.stringify({
				error: "SANITY_API_READ_TOKEN is not configured on the server.",
			}),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
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
				headers: { "Content-Type": "application/json" },
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
				headers: { "Content-Type": "application/json" },
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

	// 1. Connect MCP client to Sanity Context MCP endpoint
	const mcpClient = await createMCPClient({
		transport: {
			type: "http",
			url: SANITY_CONTEXT_MCP_URL,
			headers: {
				Authorization: `Bearer ${sanityToken}`,
			},
		},
	});

	try {
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
					headers: { "Content-Type": "application/json" },
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
					await mcpClient.close();
				} catch {
					// Ignore cleanup errors
				}
			},
		});

		return result.toTextStreamResponse();
	} catch (err) {
		try {
			await mcpClient.close();
		} catch {}

		console.error("[Chat API Error]", err);
		return new Response(
			JSON.stringify({
				error:
					err instanceof Error
						? err.message
						: "Failed to generate chat response",
			}),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			},
		);
	}
};
