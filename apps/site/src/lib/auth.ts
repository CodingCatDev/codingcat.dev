import { env } from "cloudflare:workers";
import { mcp } from "@better-auth/mcp";
import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";

/**
 * Creates or retrieves the Better Auth instance configured for
 * Model Context Protocol (MCP) and OAuth 2.1 authorization server
 * backed by Cloudflare D1.
 */
export function getAuth(origin: string, d1?: D1Database) {
	const db = d1 ?? (env as unknown as { DB?: D1Database })?.DB;

	return betterAuth({
		baseURL: origin,
		basePath: "",
		...(db ? { database: db } : {}),
		plugins: [
			jwt(),
			mcp({
				resource: `${origin}/mcp`,
				loginPage: "/sign-in",
				consentPage: "/oauth2/consent",
				allowDynamicClientRegistration: true,
				allowUnauthenticatedClientRegistration: true,
				scopes: [
					"openid",
					"profile",
					"email",
					"offline_access",
					"read:content",
					"search",
					"mcp:tools",
					"agent",
				],
			}),
		],
	});
}
