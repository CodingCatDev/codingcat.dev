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
								minLength: 1,
								description:
									"Search term or question to find in tutorials and podcasts",
							},
						},
						{
							name: "type",
							in: "query",
							required: false,
							description: "Filter results by specific content type",
							schema: {
								type: "string",
								enum: ["all", "post", "podcast"],
								default: "all",
								description: "Content type filter",
							},
						},
					],
					responses: {
						"200": {
							description:
								"Successful search results with matching content items",
							content: {
								"application/json": {
									schema: {
										$ref: "#/components/schemas/SearchResponse",
									},
								},
							},
						},
						"400": {
							description: "Missing or invalid search query parameter",
							content: {
								"application/problem+json": {
									schema: {
										$ref: "#/components/schemas/ProblemDetails",
									},
								},
							},
						},
						"500": {
							description:
								"Internal server error during search query execution",
							content: {
								"application/problem+json": {
									schema: {
										$ref: "#/components/schemas/ProblemDetails",
									},
								},
							},
						},
					},
				},
			},
			"/api/mcp": {
				post: {
					summary: "Model Context Protocol (MCP) Server",
					description:
						"JSON-RPC 2.0 MCP endpoint supporting tools/list, tools/call, server/discover, and initialize for AI agent interaction.",
					operationId: "mcpEndpoint",
					requestBody: {
						required: true,
						content: {
							"application/json": {
								schema: {
									$ref: "#/components/schemas/McpJsonRpcRequest",
								},
							},
						},
					},
					responses: {
						"200": {
							description:
								"JSON-RPC 2.0 response containing execution result or protocol error",
							content: {
								"application/json": {
									schema: {
										$ref: "#/components/schemas/McpJsonRpcResponse",
									},
								},
							},
						},
						"400": {
							description: "Invalid JSON-RPC request syntax or parse failure",
							content: {
								"application/json": {
									schema: {
										$ref: "#/components/schemas/McpJsonRpcResponse",
									},
								},
							},
						},
						"500": {
							description: "Unexpected JSON-RPC execution failure",
							content: {
								"application/json": {
									schema: {
										$ref: "#/components/schemas/McpJsonRpcResponse",
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
									$ref: "#/components/schemas/SponsorshipRequest",
								},
							},
						},
					},
					responses: {
						"200": {
							description: "Inquiry received and acknowledged successfully",
							content: {
								"application/json": {
									schema: {
										$ref: "#/components/schemas/SponsorshipResponse",
									},
								},
							},
						},
						"400": {
							description:
								"Missing required fields or invalid submission payload",
							content: {
								"application/problem+json": {
									schema: {
										$ref: "#/components/schemas/ProblemDetails",
									},
								},
							},
						},
						"500": {
							description: "Failed to process sponsorship inquiry",
							content: {
								"application/problem+json": {
									schema: {
										$ref: "#/components/schemas/ProblemDetails",
									},
								},
							},
						},
					},
				},
			},
		},
		components: {
			schemas: {
				ProblemDetails: {
					type: "object",
					description: "RFC 9457 standard problem details object for HTTP APIs",
					properties: {
						type: {
							type: "string",
							format: "uri",
							description: "URI reference identifying the problem type",
							example: "https://codingcat.dev/errors/not-found",
						},
						title: {
							type: "string",
							description: "Short human-readable summary of the problem type",
							example: "Not Found",
						},
						status: {
							type: "integer",
							description: "HTTP status code generated by origin server",
							example: 404,
						},
						detail: {
							type: "string",
							description:
								"Human-readable explanation specific to this occurrence of the problem",
							example:
								"The requested API endpoint was not found on this server.",
						},
						instance: {
							type: "string",
							format: "uri-reference",
							description:
								"URI reference identifying specific occurrence of the problem",
							example: "/api/missing",
						},
					},
					required: ["type", "title", "status", "detail"],
				},
				SearchResult: {
					type: "object",
					description:
						"Individual tutorial, podcast, or article search hit with metadata",
					properties: {
						title: {
							type: "string",
							description: "Title of the tutorial or podcast episode",
							example: "Building Modern Web Applications",
						},
						type: {
							type: "string",
							enum: ["post", "podcast", "page"],
							description: "Content document type in Sanity CMS",
							example: "post",
						},
						url: {
							type: "string",
							format: "uri",
							description: "Full canonical web URL of the content page",
							example: "https://codingcat.dev/post/modern-web",
						},
						markdownUrl: {
							type: "string",
							format: "uri",
							description:
								"Direct token-efficient Markdown representation of the content",
							example: "https://codingcat.dev/post/modern-web.md",
						},
						excerpt: {
							type: "string",
							description: "Brief summary or meta description of the entry",
							example: "Learn how to build modern web apps...",
						},
						date: {
							type: "string",
							format: "date-time",
							description: "Publication date in ISO 8601 format",
							example: "2026-01-15T00:00:00.000Z",
						},
					},
					required: ["title", "type", "url", "markdownUrl"],
				},
				SearchResponse: {
					type: "object",
					description:
						"Search results container including original query and hit list",
					properties: {
						query: {
							type: "string",
							description:
								"Normalized query term executed against the search index",
							example: "next.js vs astro",
						},
						total: {
							type: "integer",
							description: "Total number of matching content records returned",
							example: 12,
						},
						results: {
							type: "array",
							description: "List of matched content items sorted by relevance",
							items: {
								$ref: "#/components/schemas/SearchResult",
							},
						},
					},
					required: ["query", "total", "results"],
				},
				McpJsonRpcRequest: {
					type: "object",
					description: "Model Context Protocol JSON-RPC 2.0 request payload",
					properties: {
						jsonrpc: {
							type: "string",
							enum: ["2.0"],
							description: "JSON-RPC specification version",
							example: "2.0",
						},
						id: {
							oneOf: [{ type: "string" }, { type: "integer" }],
							description: "Unique request identifier echoed in response",
							example: 1,
						},
						method: {
							type: "string",
							description:
								"MCP method name (e.g. tools/list, tools/call, server/discover, initialize)",
							example: "tools/list",
						},
						params: {
							type: "object",
							description: "Method arguments object",
						},
					},
					required: ["jsonrpc", "method"],
				},
				McpJsonRpcError: {
					type: "object",
					description: "JSON-RPC 2.0 error descriptor",
					properties: {
						code: {
							type: "integer",
							description: "Standard JSON-RPC error code",
							example: -32601,
						},
						message: {
							type: "string",
							description: "Short human-readable error description",
							example: "Method not found",
						},
						data: {
							type: "object",
							description: "Additional structured error diagnostic details",
						},
					},
					required: ["code", "message"],
				},
				McpJsonRpcResponse: {
					type: "object",
					description: "Model Context Protocol JSON-RPC 2.0 response payload",
					properties: {
						jsonrpc: {
							type: "string",
							enum: ["2.0"],
							example: "2.0",
						},
						id: {
							oneOf: [
								{ type: "string" },
								{ type: "integer" },
								{ type: "null" },
							],
							example: 1,
						},
						result: {
							type: "object",
							description: "Success payload for the executed method",
						},
						error: {
							$ref: "#/components/schemas/McpJsonRpcError",
						},
					},
					required: ["jsonrpc"],
				},
				SponsorshipRequest: {
					type: "object",
					description: "Sponsorship inquiry submission parameters",
					properties: {
						name: {
							type: "string",
							description: "Contact name of the sponsor or marketer",
							example: "Jane Doe",
						},
						email: {
							type: "string",
							format: "email",
							description: "Direct email address for sponsorship follow-up",
							example: "sponsor@example.com",
						},
						company: {
							type: "string",
							description: "Company or brand name seeking sponsorship",
							example: "Acme Cloud",
						},
						tier: {
							type: "string",
							description: "Desired sponsorship package or campaign format",
							example: "podcast-episode",
						},
						message: {
							type: "string",
							description:
								"Campaign goals, target audience, and preferred dates",
							example: "We would like to sponsor 3 episodes in Q2.",
						},
					},
					required: ["name", "email", "tier"],
				},
				SponsorshipResponse: {
					type: "object",
					description: "Confirmation of sponsorship submission",
					properties: {
						success: {
							type: "boolean",
							description:
								"Indicates whether the inquiry was successfully recorded",
							example: true,
						},
						message: {
							type: "string",
							description: "User-facing acknowledgement of submission status",
							example:
								"Inquiry received. We will respond within 2 business days.",
						},
					},
					required: ["success", "message"],
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
