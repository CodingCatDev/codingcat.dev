import type { APIRoute } from "astro";

export const prerender = false;

export const POST: APIRoute = async () => {
	return new Response(
		JSON.stringify(
			{
				access_token: `cat_agent_${Date.now()}_pub`,
				token_type: "Bearer",
				expires_in: 86400,
				scope: "read:content search mcp:tools agent",
			},
			null,
			2,
		),
		{
			headers: {
				"content-type": "application/json; charset=utf-8",
				"access-control-allow-origin": "*",
			},
		},
	);
};
