import { env } from "cloudflare:workers";
import { mcp } from "@better-auth/mcp";
import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";

export const BETTER_AUTH_SECRET =
	(env as unknown as { BETTER_AUTH_SECRET?: string })?.BETTER_AUTH_SECRET ||
	"codingcat-mcp-oauth2-secret-secure-random-2026-key-better-auth";

export const MCP_DEFAULT_SCOPES = [
	"openid",
	"profile",
	"email",
	"offline_access",
	"read:content",
	"search",
	"mcp:tools",
	"agent",
] as const;

export const DEFAULT_MCP_USER = {
	id: "user_codingcat_explorer",
	name: "CodingCat Dev Explorer",
	email: "explorer@codingcat.dev",
};

export const DEFAULT_MCP_SESSION = {
	id: "sess_codingcat_default",
	token: "cc_mcp_session_token",
	userId: "user_codingcat_explorer",
};

/**
 * Computes base64url(SHA-256(token)) matching Better Auth's token store format.
 */
export async function hashToken(token: string): Promise<string> {
	const hash = await crypto.subtle.digest(
		"SHA-256",
		new TextEncoder().encode(token),
	);
	return btoa(String.fromCharCode(...new Uint8Array(hash)))
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=+$/, "");
}

/**
 * Ensures a default guest/explorer user and active session exist in Cloudflare D1
 * for automated MCP server account linking.
 */
export async function ensureDefaultUserAndSession(db: D1Database) {
	const now = Date.now();
	await db
		.prepare(
			`INSERT OR IGNORE INTO user (id, name, email, emailVerified, createdAt, updatedAt)
			 VALUES ('user_codingcat_explorer', 'CodingCat Dev Explorer', 'explorer@codingcat.dev', 1, ?, ?)`,
		)
		.bind(now, now)
		.run();

	await db
		.prepare(
			`INSERT OR IGNORE INTO session (id, expiresAt, token, createdAt, updatedAt, userId)
			 VALUES ('sess_codingcat_default', 2147483647000, 'cc_mcp_session_token', ?, ?, 'user_codingcat_explorer')`,
		)
		.bind(now, now)
		.run();
}

let cachedAuth: any = null;
let cachedOrigin = "";

/**
 * Creates or retrieves the Better Auth instance configured for
 * Model Context Protocol (MCP) and OAuth 2.1 authorization server
 * backed by Cloudflare D1.
 */
export function getAuth(origin: string, d1?: D1Database) {
	const db = d1 ?? (env as unknown as { DB?: D1Database })?.DB;

	if (!db && cachedAuth && cachedOrigin === origin) {
		return cachedAuth;
	}

	const instance = betterAuth({
		baseURL: origin,
		basePath: "",
		secret: BETTER_AUTH_SECRET,
		...(db ? { database: db } : {}),
		plugins: [
			jwt(),
			mcp({
				resource: `${origin}/mcp`,
				resources: [`${origin}/mcp`, origin],
				clientRegistrationDefaultResources: [`${origin}/mcp`, origin],
				loginPage: "/sign-in",
				consentPage: "/oauth2/consent",
				allowDynamicClientRegistration: true,
				allowUnauthenticatedClientRegistration: true,
				clientRegistrationRequirePKCE: false,
				clientRegistrationDefaultScopes: [...MCP_DEFAULT_SCOPES],
				enforcePerClientResources: false,
				scopes: [...MCP_DEFAULT_SCOPES],
			}),
		],
	});

	if (!db) {
		cachedAuth = instance;
		cachedOrigin = origin;
	}

	return instance;
}
