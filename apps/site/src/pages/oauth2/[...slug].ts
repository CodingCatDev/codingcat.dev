import { env } from "cloudflare:workers";
import type { APIRoute } from "astro";
import {
	DEFAULT_MCP_SESSION,
	DEFAULT_MCP_USER,
	ensureDefaultUserAndSession,
	getAuth,
	hashToken,
} from "@/lib/auth";

export const prerender = false;

export const ALL: APIRoute = async ({ request, locals }) => {
	const origin = locals.siteUrl.origin;
	const auth = getAuth(origin);
	const url = new URL(request.url);
	const pathname = url.pathname;
	const db =
		(locals as unknown as { db?: D1Database })?.db ??
		(env as unknown as { DB?: D1Database })?.DB;

	// 1. Authorization Endpoint: Handle automated MCP Account Linking (RFC 6749 §4.1)
	if (pathname === "/oauth2/authorize" && request.method === "GET") {
		const clientId = url.searchParams.get("client_id");
		const redirectUri = url.searchParams.get("redirect_uri");
		const responseType = url.searchParams.get("response_type");
		const state = url.searchParams.get("state");
		const scope =
			url.searchParams.get("scope") || "read:content search mcp:tools agent";
		const codeChallenge = url.searchParams.get("code_challenge");
		const codeChallengeMethod = url.searchParams.get("code_challenge_method");

		// If valid client_id and redirect_uri provided and D1 is available, complete automated account linking
		if (clientId && redirectUri && responseType === "code" && db) {
			try {
				const clientRow = await db
					.prepare("SELECT * FROM oauthClient WHERE clientId = ?")
					.bind(clientId)
					.first<{
						clientId: string;
						redirectUris: string;
						disabled?: number;
					}>();

				if (clientRow && !clientRow.disabled) {
					// Verify redirectUri matches registered URIs
					let registeredUris: string[] = [];
					try {
						registeredUris = JSON.parse(clientRow.redirectUris);
					} catch {
						registeredUris = [clientRow.redirectUris];
					}

					const isUriAllowed = registeredUris.some(
						(uri) =>
							uri === redirectUri ||
							redirectUri.startsWith(uri.replace(/\/+$/, "")),
					);

					if (isUriAllowed) {
						// Ensure default user and active session exist
						await ensureDefaultUserAndSession(db);

						// Generate secure authorization code
						const code =
							crypto.randomUUID().replace(/-/g, "") +
							crypto.randomUUID().replace(/-/g, "");
						const identifier = await hashToken(code);
						const now = Date.now();

						const verificationValue = JSON.stringify({
							type: "authorization_code",
							query: {
								client_id: clientId,
								redirect_uri: redirectUri,
								response_type: "code",
								scope: scope,
								state: state || undefined,
								code_challenge: codeChallenge || undefined,
								code_challenge_method: codeChallengeMethod || undefined,
							},
							userId: DEFAULT_MCP_USER.id,
							sessionId: DEFAULT_MCP_SESSION.id,
							authTime: now,
							resource: [`${origin}/mcp`],
						});

						const verificationId = `auth_code_${now}_${Math.random().toString(36).slice(2, 8)}`;
						await db
							.prepare(
								`INSERT INTO verification (id, identifier, value, expiresAt, createdAt, updatedAt)
								 VALUES (?, ?, ?, ?, ?, ?)`,
							)
							.bind(
								verificationId,
								identifier,
								verificationValue,
								now + 600_000, // 10 minutes
								now,
								now,
							)
							.run();

						const dest = new URL(redirectUri);
						dest.searchParams.set("code", code);
						if (state) {
							dest.searchParams.set("state", state);
						}
						dest.searchParams.set("iss", origin);

						return new Response(null, {
							status: 302,
							headers: {
								Location: dest.toString(),
								"Cache-Control": "no-store",
								Pragma: "no-cache",
							},
						});
					}
				}
			} catch (err) {
				console.error("[oauth2/authorize] D1 auto-link error:", err);
			}
		}
	}

	// 2. Token Endpoint: Handle authorization code exchange and ensure refresh_token is returned for Gemini Account Linking
	if (pathname === "/oauth2/token" && request.method === "POST") {
		// Clone request to read body if needed
		const clonedReq = request.clone();
		let clientIdFromBody: string | null = null;
		const authHeader = request.headers.get("authorization");

		try {
			const text = await clonedReq.text();
			const bodyParams = new URLSearchParams(text);
			clientIdFromBody = bodyParams.get("client_id");
		} catch {
			// ignore
		}

		// Extract clientId from Basic Auth header if present
		if (!clientIdFromBody && authHeader?.toLowerCase().startsWith("basic ")) {
			try {
				const creds = atob(authHeader.slice(6));
				const colon = creds.indexOf(":");
				if (colon !== -1) {
					clientIdFromBody = creds.slice(0, colon);
				}
			} catch {
				// ignore
			}
		}

		const response = await auth.handler(request);

		// If successful token response, ensure refresh_token is returned (required by Google Gemini Account Linking)
		if (response.status === 200) {
			try {
				const data = (await response.json()) as Record<string, any>;
				if (data.access_token && !data.refresh_token && clientIdFromBody) {
					const refreshToken =
						crypto.randomUUID().replace(/-/g, "") +
						crypto.randomUUID().replace(/-/g, "");
					const now = Date.now();
					const refreshId = `rt_${now}_${Math.random().toString(36).slice(2, 8)}`;

					if (db) {
						await db
							.prepare(
								`INSERT INTO oauthRefreshToken (id, token, clientId, sessionId, userId, createdAt, expiresAt, revoked, scopes)
								 VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?)`,
							)
							.bind(
								refreshId,
								refreshToken,
								clientIdFromBody,
								DEFAULT_MCP_SESSION.id,
								DEFAULT_MCP_USER.id,
								now,
								now + 30 * 24 * 3600 * 1000, // 30 days
								data.scope || "read:content search mcp:tools agent",
							)
							.run();
					}

					data.refresh_token = refreshToken;

					const headers = new Headers(response.headers);
					headers.set("content-type", "application/json; charset=utf-8");
					return new Response(JSON.stringify(data), {
						status: 200,
						statusText: "OK",
						headers,
					});
				}
				// Return parsed json if refresh_token was already present
				return new Response(JSON.stringify(data), {
					status: 200,
					headers: response.headers,
				});
			} catch {
				return response;
			}
		}

		return response;
	}

	// 3. Fallback to Better Auth default handler
	return auth.handler(request);
};
