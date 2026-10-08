import type { APIRoute } from "astro";

export const prerender = false;

export const GET: APIRoute = async ({ locals }) => {
	const origin = locals.siteUrl.origin;

	const openApiSpec = {
		openapi: "3.1.0",
		info: {
			title: "CodingCat.dev Public API",
			description:
				"Public search and agent interaction APIs for CodingCat.dev web development tutorials, podcasts, and media.",
			version: "1.0.0",
			contact: {
				name: "CodingCat.dev Team",
				url: "https://codingcat.dev",
				email: "alex@codingcat.dev",
			},
			license: {
				name: "MIT",
				url: "https://opensource.org/licenses/MIT",
			},
		},
		servers: [
			{
				url: origin,
				description: "Production API Server",
			},
		],
		paths: {
			"/api/search": {
				get: {
					summary: "Search Content",
					description:
						"Search tutorials, articles, podcasts, guests, and sponsors with keyword and semantic relevance scoring.",
					operationId: "searchContent",
					parameters: [
						{
							name: "q",
							in: "query",
							required: true,
							description: "Search keyword or natural language query",
							schema: {
								type: "string",
							},
						},
					],
					responses: {
						"200": {
							description: "Successful search results",
							content: {
								"application/json": {
									schema: {
										type: "object",
										properties: {
											query: { type: "string" },
											total: { type: "integer" },
											results: {
												type: "array",
												items: {
													type: "object",
													properties: {
														title: { type: "string" },
														type: { type: "string" },
														url: { type: "string" },
														markdownUrl: { type: "string" },
														excerpt: { type: "string" },
														date: { type: "string" },
													},
												},
											},
										},
									},
								},
							},
						},
						"400": {
							description: "Missing required search query",
						},
					},
				},
			},
			"/api/mcp": {
				post: {
					summary: "Streamable HTTP Model Context Protocol (MCP) Server",
					description:
						"JSON-RPC 2.0 MCP endpoint implementing agent tools for searching and discovering CodingCat.dev technical content.",
					operationId: "mcpEndpoint",
					requestBody: {
						required: true,
						content: {
							"application/json": {
								schema: {
									type: "object",
									properties: {
										jsonrpc: { type: "string", example: "2.0" },
										id: {
											oneOf: [{ type: "string" }, { type: "integer" }],
										},
										method: { type: "string" },
										params: { type: "object" },
									},
									required: ["jsonrpc", "method"],
								},
							},
						},
					},
					responses: {
						"200": {
							description: "JSON-RPC 2.0 Response",
							content: {
								"application/json": {
									schema: {
										type: "object",
										properties: {
											jsonrpc: { type: "string", example: "2.0" },
											id: {
												oneOf: [{ type: "string" }, { type: "integer" }],
											},
											result: { type: "object" },
											error: { type: "object" },
										},
									},
								},
							},
						},
					},
				},
			},
			"/api/sponsorship": {
				post: {
					summary: "Submit Sponsorship Inquiry",
					description:
						"Submit sponsorship interest for podcast mid-rolls, dedicated videos, newsletters, or site partnerships.",
					operationId: "submitSponsorship",
					requestBody: {
						required: true,
						content: {
							"application/json": {
								schema: {
									type: "object",
									properties: {
										name: { type: "string" },
										email: { type: "string", format: "email" },
										company: { type: "string" },
										tier: { type: "string" },
										message: { type: "string" },
									},
									required: ["name", "email", "tier"],
								},
							},
						},
					},
					responses: {
						"200": {
							description: "Inquiry received successfully",
						},
						"400": {
							description: "Missing required fields or invalid format",
						},
					},
				},
			},
		},
	};

	return new Response(JSON.stringify(openApiSpec, null, 2), {
		headers: {
			"content-type": "application/vnd.oai.openapi+json; charset=utf-8",
			"access-control-allow-origin": "*",
			"cache-control": "public, max-age=3600, s-maxage=86400",
		},
	});
};
