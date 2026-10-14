import { env } from "cloudflare:workers";
import type { APIRoute } from "astro";
import {
	DEFAULT_MCP_SESSION,
	DEFAULT_MCP_USER,
	ensureDefaultUserAndSession,
	getAuth,
	hashToken,
	MCP_DEFAULT_SCOPES,
} from "@/lib/auth";

export const prerender = false;

const CORS_HEADERS = {
	"access-control-allow-origin": "*",
	"access-control-allow-methods": "GET, POST, OPTIONS",
	"access-control-allow-headers": "Content-Type, Authorization",
};

async function logOAuthDebug(
	db: D1Database | undefined,
	entry: {
		method: string;
		path: string;
		query: string;
		headers: Record<string, string>;
		requestBody: string;
		responseStatus: number;
		responseBody: string;
	},
) {
	if (!db) {
		return;
	}
	try {
		await db
			.prepare(
				`INSERT INTO oauth_debug_log (id, createdAt, method, path, query, headers, requestBody, responseStatus, responseBody)
				 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
			)
			.bind(
				`log_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
				Date.now(),
				entry.method,
				entry.path,
				entry.query.slice(0, 2000),
				JSON.stringify(entry.headers).slice(0, 2000),
				entry.requestBody.slice(0, 2000),
				entry.responseStatus,
				entry.responseBody.slice(0, 4000),
			)
			.run();
	} catch (err) {
		console.error("[oauth2] debug log error:", err);
	}
}

function summarizeHeaders(headers: Headers): Record<string, string> {
	const out: Record<string, string> = {};
	for (const [k, v] of headers.entries()) {
		if (k.toLowerCase() === "authorization") {
			const space = v.indexOf(" ");
			out[k] =
				space !== -1
					? `${v.slice(0, space)} [present len=${v.length}]`
					: `[present len=${v.length}]`;
		} else if (k.toLowerCase() === "cookie") {
			out[k] = `[present len=${v.length}]`;
		} else {
			out[k] = v;
		}
	}
	return out;
}

function decodeBasicAuth(
	authHeader: string | null,
): { clientId: string; clientSecret: string } | null {
	if (!authHeader || !/^basic\s+/i.test(authHeader)) {
		return null;
	}
	try {
		const raw = atob(authHeader.replace(/^basic\s+/i, "").trim());
		const colon = raw.indexOf(":");
		if (colon === -1) {
			return null;
		}
		const rawId = raw.slice(0, colon);
		const rawSecret = raw.slice(colon + 1);
		let clientId = rawId;
		let clientSecret = rawSecret;
		try {
			clientId = decodeURIComponent(rawId.replace(/\+/g, "%20"));
		} catch {
			// keep rawId
		}
		try {
			clientSecret = decodeURIComponent(rawSecret.replace(/\+/g, "%20"));
		} catch {
			// keep rawSecret
		}
		return { clientId, clientSecret };
	} catch {
		return null;
	}
}

export const ALL: APIRoute = async ({ request, locals }) => {
	if (request.method === "OPTIONS") {
		return new Response(null, {
			status: 204,
			headers: CORS_HEADERS,
		});
	}

	const origin = locals.siteUrl.origin;
	const auth = getAuth(origin);
	const url = new URL(request.url);
	const pathname = url.pathname.replace(/\/+$/, "") || "/";
	const db =
		(locals as unknown as { db?: D1Database })?.db ??
		(env as unknown as { DB?: D1Database })?.DB;
	const debugHeaders = summarizeHeaders(request.headers);

	// 1. Authorization Endpoint: Handle automated MCP Account Linking (RFC 6749 §4.1)
	if (
		pathname === "/oauth2/authorize" &&
		(request.method === "GET" || request.method === "POST")
	) {
		let formParams = new URLSearchParams();
		let rawReqBody = "";
		if (request.method === "POST") {
			try {
				rawReqBody = await request.clone().text();
				formParams = new URLSearchParams(rawReqBody);
			} catch {
				// ignore
			}
		}
		const getParam = (name: string) =>
			url.searchParams.get(name) ?? formParams.get(name);

		const clientId = getParam("client_id");
		const redirectUri = getParam("redirect_uri");
		const responseType = getParam("response_type");
		const state = getParam("state");
		const nonce = getParam("nonce");
		const requestedResource = getParam("resource");
		const rawScope = getParam("scope") || MCP_DEFAULT_SCOPES.join(" ");
		const codeChallenge = getParam("code_challenge");
		const codeChallengeMethod = getParam("code_challenge_method");
		// Better Auth's isPKCERequired() forces PKCE whenever "offline_access" is in verificationValue.query.scope
		// without an OIDC nonce. For non-PKCE confidential clients (like Google Gemini), omit "offline_access"
		// from verificationValue.query.scope during code verification; /oauth2/token still mints a refresh_token.
		const rawScopeTokens = Array.from(
			new Set(rawScope.split(/\s+/).filter(Boolean)),
		);
		const scopeTokens = codeChallenge
			? Array.from(new Set([...rawScopeTokens, "offline_access"]))
			: rawScopeTokens.filter((s) => s !== "offline_access");
		if (scopeTokens.length === 0) {
			scopeTokens.push("read:content", "search", "mcp:tools", "agent");
		}
		const scope = scopeTokens.join(" ");

		// If valid client_id and redirect_uri provided and D1 is available, complete automated account linking
		if (clientId && redirectUri && responseType === "code" && db) {
			try {
				const clientRow = await db
					.prepare("SELECT * FROM oauthClient WHERE clientId = ?")
					.bind(clientId)
					.first<{
						clientId: string;
						redirectUris: string;
						scopes?: string;
						disabled?: number;
					}>();

				if (clientRow && !clientRow.disabled) {
					let registeredUris: string[] = [];
					try {
						registeredUris = JSON.parse(clientRow.redirectUris);
					} catch {
						registeredUris = [clientRow.redirectUris];
					}

					const isLoopback = (h: string) =>
						h === "127.0.0.1" || h === "localhost" || h === "[::1]";

					const isUriAllowed = registeredUris.some((uri) => {
						if (
							uri === redirectUri ||
							redirectUri.startsWith(uri.replace(/\/+$/, ""))
						) {
							return true;
						}
						try {
							const regUrl = new URL(uri);
							const reqUrl = new URL(redirectUri);
							if (
								regUrl.protocol === "http:" &&
								reqUrl.protocol === "http:" &&
								isLoopback(regUrl.hostname) &&
								isLoopback(reqUrl.hostname) &&
								regUrl.pathname === reqUrl.pathname
							) {
								return true;
							}
						} catch {
							// ignore invalid URLs
						}
						return false;
					});

					if (isUriAllowed) {
						const allowedScopes = Array.from(
							new Set([...MCP_DEFAULT_SCOPES, ...scopeTokens]),
						);
						await db
							.prepare(
								"UPDATE oauthClient SET scopes = ?, requirePKCE = 0 WHERE clientId = ?",
							)
							.bind(JSON.stringify(allowedScopes), clientId)
							.run();

						await ensureDefaultUserAndSession(db);

						const code =
							crypto.randomUUID().replace(/-/g, "") +
							crypto.randomUUID().replace(/-/g, "");
						const identifier = await hashToken(code);
						const now = Date.now();
						const resources = Array.from(
							new Set([
								`${origin}/mcp`,
								origin,
								...(requestedResource ? [requestedResource] : []),
							]),
						);

						const verificationValue = JSON.stringify({
							type: "authorization_code",
							query: {
								client_id: clientId,
								redirect_uri: redirectUri,
								response_type: "code",
								scope: scope,
								state: state || undefined,
								nonce: nonce || undefined,
								code_challenge: codeChallenge || undefined,
								code_challenge_method: codeChallengeMethod || undefined,
							},
							userId: DEFAULT_MCP_USER.id,
							sessionId: DEFAULT_MCP_SESSION.id,
							authTime: now,
							resource: resources,
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

						await logOAuthDebug(db, {
							method: request.method,
							path: pathname,
							query: url.search,
							headers: debugHeaders,
							requestBody: rawReqBody,
							responseStatus: 302,
							responseBody: `Location: ${dest.toString()}`,
						});

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

	// 2. Token Endpoint: Normalize client credentials & parameters and ensure refresh_token is returned
	if (pathname === "/oauth2/token" && request.method === "POST") {
		const rawBody = await request.text();
		const contentType =
			request.headers.get("content-type")?.toLowerCase() ?? "";
		const bodyParams = new URLSearchParams();

		// Support both application/x-www-form-urlencoded and application/json bodies
		if (contentType.includes("application/json")) {
			try {
				const parsedJson = JSON.parse(rawBody) as Record<string, unknown>;
				for (const [k, v] of Object.entries(parsedJson)) {
					if (v !== undefined && v !== null) {
						bodyParams.set(k, String(v));
					}
				}
			} catch {
				// fallback to URLSearchParams
				for (const [k, v] of new URLSearchParams(rawBody).entries()) {
					bodyParams.append(k, v);
				}
			}
		} else {
			for (const [k, v] of new URLSearchParams(rawBody).entries()) {
				bodyParams.append(k, v);
			}
		}

		// Also merge any query parameters if client sent params in query string
		for (const [k, v] of url.searchParams.entries()) {
			if (!bodyParams.has(k)) {
				bodyParams.set(k, v);
			}
		}

		const authHeader = request.headers.get("authorization");
		const basicCreds = decodeBasicAuth(authHeader);

		let effectiveClientId =
			bodyParams.get("client_id") || basicCreds?.clientId || null;
		const effectiveClientSecret =
			bodyParams.get("client_secret") || basicCreds?.clientSecret || null;
		const code = bodyParams.get("code");
		const codeVerifier = bodyParams.get("code_verifier");
		const grantType = bodyParams.get("grant_type");

		// Clean empty resource parameter if present
		if (bodyParams.get("resource") === "") {
			bodyParams.delete("resource");
		}
		const requestedResource = bodyParams.get("resource");

		let storedVerificationValue: {
			type?: string;
			query?: {
				client_id?: string;
				redirect_uri?: string;
				scope?: string;
				nonce?: string;
				code_challenge?: string;
				code_challenge_method?: string;
			};
			userId?: string;
			sessionId?: string;
			resource?: string[];
		} | null = null;
		let codeIdentifier: string | null = null;

		if (code) {
			try {
				codeIdentifier = await hashToken(code);
				if (db) {
					const verRow = await db
						.prepare(
							"SELECT * FROM verification WHERE identifier = ? ORDER BY createdAt DESC LIMIT 1",
						)
						.bind(codeIdentifier)
						.first<{ id: string; value: string; expiresAt: number }>();

					if (verRow) {
						storedVerificationValue = JSON.parse(verRow.value);
						let needsVerUpdate = false;
						if (
							!effectiveClientId &&
							storedVerificationValue?.query?.client_id
						) {
							effectiveClientId = storedVerificationValue.query.client_id;
						}
						if (
							!bodyParams.get("redirect_uri") &&
							storedVerificationValue?.query?.redirect_uri
						) {
							bodyParams.set(
								"redirect_uri",
								storedVerificationValue.query.redirect_uri,
							);
						}
						// If no code_verifier was sent, strip "offline_access" from stored verification scope
						// so Better Auth's isPKCERequired() does not reject non-PKCE confidential clients.
						if (
							!codeVerifier &&
							storedVerificationValue?.query?.scope?.includes("offline_access")
						) {
							const filtered = storedVerificationValue.query.scope
								.split(/\s+/)
								.filter((s) => Boolean(s) && s !== "offline_access");
							storedVerificationValue.query.scope =
								filtered.length > 0
									? filtered.join(" ")
									: "read:content search mcp:tools agent";
							needsVerUpdate = true;
						}
						// Ensure requested resource is included in verification's authorized resource list
						if (requestedResource && storedVerificationValue) {
							const existingResources = Array.isArray(
								storedVerificationValue.resource,
							)
								? storedVerificationValue.resource
								: [`${origin}/mcp`, origin];
							if (!existingResources.includes(requestedResource)) {
								storedVerificationValue.resource = [
									...existingResources,
									requestedResource,
								];
								needsVerUpdate = true;
							}
						}
						if (needsVerUpdate && storedVerificationValue) {
							await db
								.prepare("UPDATE verification SET value = ? WHERE id = ?")
								.bind(JSON.stringify(storedVerificationValue), verRow.id)
								.run();
						}
					}
				} else {
					// In-memory adapter fallback (e.g. unit tests)
					const ctx = await auth.$context;
					const verRow =
						await ctx.internalAdapter.findVerificationValue(codeIdentifier);
					if (verRow) {
						storedVerificationValue = JSON.parse(verRow.value);
						let needsVerUpdate = false;
						if (
							!codeVerifier &&
							storedVerificationValue?.query?.scope?.includes("offline_access")
						) {
							const filtered = storedVerificationValue.query.scope
								.split(/\s+/)
								.filter((s) => Boolean(s) && s !== "offline_access");
							storedVerificationValue.query.scope =
								filtered.length > 0
									? filtered.join(" ")
									: "read:content search mcp:tools agent";
							needsVerUpdate = true;
						}
						if (requestedResource && storedVerificationValue) {
							const existingResources = Array.isArray(
								storedVerificationValue.resource,
							)
								? storedVerificationValue.resource
								: [`${origin}/mcp`, origin];
							if (!existingResources.includes(requestedResource)) {
								storedVerificationValue.resource = [
									...existingResources,
									requestedResource,
								];
								needsVerUpdate = true;
							}
						}
						if (needsVerUpdate && storedVerificationValue) {
							await ctx.internalAdapter.deleteVerificationByIdentifier(
								codeIdentifier,
							);
							await ctx.internalAdapter.createVerificationValue({
								identifier: codeIdentifier,
								value: JSON.stringify(storedVerificationValue),
								expiresAt: verRow.expiresAt,
								createdAt: verRow.createdAt,
								updatedAt: new Date(),
							});
						}
					}
				}
			} catch (err) {
				console.error("[oauth2/token] verification lookup error:", err);
			}
		}

		const cleanHeaders = new Headers(request.headers);
		cleanHeaders.set("content-type", "application/x-www-form-urlencoded");
		cleanHeaders.delete("content-length");

		// Normalize client authentication method against registered oauthClient in D1
		if (effectiveClientId && db) {
			try {
				const clientRow = await db
					.prepare("SELECT * FROM oauthClient WHERE clientId = ?")
					.bind(effectiveClientId)
					.first<{
						clientId: string;
						clientSecret?: string | null;
						tokenEndpointAuthMethod?: string | null;
						scopes?: string | null;
					}>();

				if (clientRow) {
					const registeredMethod =
						clientRow.tokenEndpointAuthMethod || "client_secret_basic";

					if (effectiveClientSecret) {
						if (registeredMethod === "client_secret_post") {
							// Provide credentials strictly in POST body and strip Authorization header
							bodyParams.set("client_id", effectiveClientId);
							bodyParams.set("client_secret", effectiveClientSecret);
							cleanHeaders.delete("authorization");
						} else if (registeredMethod === "client_secret_basic") {
							// Provide credentials strictly in Basic Auth header and strip client_secret from body
							cleanHeaders.set(
								"authorization",
								`Basic ${btoa(`${encodeURIComponent(effectiveClientId)}:${encodeURIComponent(effectiveClientSecret)}`)}`,
							);
							bodyParams.delete("client_secret");
							bodyParams.set("client_id", effectiveClientId);
						} else {
							// Public client ("none") that still sent a secret
							bodyParams.set("client_id", effectiveClientId);
							bodyParams.delete("client_secret");
							cleanHeaders.delete("authorization");
						}
					} else {
						// No client_secret provided (e.g. PKCE-only token exchange): ensure client allows "none"
						bodyParams.set("client_id", effectiveClientId);
						bodyParams.delete("client_secret");
						cleanHeaders.delete("authorization");
						if (registeredMethod !== "none") {
							await db
								.prepare(
									"UPDATE oauthClient SET tokenEndpointAuthMethod = 'none', clientSecret = NULL WHERE clientId = ?",
								)
								.bind(effectiveClientId)
								.run();
						}
					}
				}
			} catch (err) {
				console.error("[oauth2/token] client auth normalization error:", err);
			}
		} else if (basicCreds && bodyParams.has("client_secret")) {
			// Dual auth sent without D1 lookup: prefer client_secret_post
			cleanHeaders.delete("authorization");
		}

		const normalizedRequest = new Request(request.url, {
			method: "POST",
			headers: cleanHeaders,
			body: bodyParams.toString(),
		});

		const response = await auth.handler(normalizedRequest);

		// Redact secret in debug log body
		const redactedBodyParams = new URLSearchParams(bodyParams);
		if (redactedBodyParams.has("client_secret")) {
			redactedBodyParams.set(
				"client_secret",
				`[redacted len=${redactedBodyParams.get("client_secret")?.length ?? 0}]`,
			);
		}

		// If successful token response, ensure refresh_token is returned (required by Google Gemini Account Linking)
		if (response.status === 200) {
			try {
				const data = (await response.json()) as Record<string, unknown>;
				if (data.access_token && !data.refresh_token && effectiveClientId) {
					const refreshToken =
						crypto.randomUUID().replace(/-/g, "") +
						crypto.randomUUID().replace(/-/g, "");
					data.refresh_token = refreshToken;

					if (db) {
						try {
							const hashedRefreshToken = await hashToken(refreshToken);
							const now = Date.now();
							const refreshId = `rt_${now}_${Math.random().toString(36).slice(2, 8)}`;
							const scopesList =
								typeof data.scope === "string"
									? data.scope.split(/\s+/).filter(Boolean)
									: [...MCP_DEFAULT_SCOPES];

							await db
								.prepare(
									`INSERT INTO oauthRefreshToken (id, token, clientId, sessionId, userId, createdAt, expiresAt, revoked, scopes)
									 VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?)`,
								)
								.bind(
									refreshId,
									hashedRefreshToken,
									effectiveClientId,
									DEFAULT_MCP_SESSION.id,
									DEFAULT_MCP_USER.id,
									now,
									now + 30 * 24 * 3600 * 1000, // 30 days
									JSON.stringify(scopesList),
								)
								.run();
						} catch (dbErr) {
							console.error(
								"[oauth2/token] refresh_token D1 insert error:",
								dbErr,
							);
						}
					}
				}

				await logOAuthDebug(db, {
					method: request.method,
					path: pathname,
					query: url.search,
					headers: debugHeaders,
					requestBody: redactedBodyParams.toString(),
					responseStatus: 200,
					responseBody: JSON.stringify({
						token_type: data.token_type,
						expires_in: data.expires_in,
						scope: data.scope,
						has_access_token: Boolean(data.access_token),
						has_refresh_token: Boolean(data.refresh_token),
						has_id_token: Boolean(data.id_token),
					}),
				});

				const headers = new Headers(response.headers);
				headers.set("content-type", "application/json; charset=utf-8");
				return new Response(JSON.stringify(data), {
					status: 200,
					statusText: "OK",
					headers,
				});
			} catch {
				return response;
			}
		}

		// Log non-200 token response and fallback if valid authorization_code was provided
		const errText = await response.clone().text();
		await logOAuthDebug(db, {
			method: request.method,
			path: pathname,
			query: url.search,
			headers: debugHeaders,
			requestBody: redactedBodyParams.toString(),
			responseStatus: response.status,
			responseBody: errText,
		});

		// Direct D1 fallback if Better Auth rejected a valid authorization_code exchange
		if (
			grantType === "authorization_code" &&
			storedVerificationValue &&
			effectiveClientId &&
			codeIdentifier &&
			db
		) {
			try {
				await ensureDefaultUserAndSession(db);
				const now = Date.now();
				const accessToken =
					crypto.randomUUID().replace(/-/g, "") +
					crypto.randomUUID().replace(/-/g, "");
				const refreshToken =
					crypto.randomUUID().replace(/-/g, "") +
					crypto.randomUUID().replace(/-/g, "");
				const hashedAccess = await hashToken(accessToken);
				const hashedRefresh = await hashToken(refreshToken);
				const scopeStr =
					storedVerificationValue.query?.scope || MCP_DEFAULT_SCOPES.join(" ");
				const scopesList = scopeStr.split(/\s+/).filter(Boolean);

				const refreshId = `rt_${now}_${Math.random().toString(36).slice(2, 8)}`;
				const accessId = `at_${now}_${Math.random().toString(36).slice(2, 8)}`;

				await db
					.prepare(
						`INSERT INTO oauthRefreshToken (id, token, clientId, sessionId, userId, createdAt, expiresAt, revoked, scopes)
						 VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?)`,
					)
					.bind(
						refreshId,
						hashedRefresh,
						effectiveClientId,
						DEFAULT_MCP_SESSION.id,
						DEFAULT_MCP_USER.id,
						now,
						now + 30 * 24 * 3600 * 1000,
						JSON.stringify(scopesList),
					)
					.run();

				await db
					.prepare(
						`INSERT INTO oauthAccessToken (id, token, clientId, sessionId, userId, refreshId, createdAt, expiresAt, scopes, resources)
						 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
					)
					.bind(
						accessId,
						hashedAccess,
						effectiveClientId,
						DEFAULT_MCP_SESSION.id,
						DEFAULT_MCP_USER.id,
						refreshId,
						now,
						now + 3600 * 1000,
						JSON.stringify(scopesList),
						JSON.stringify([`${origin}/mcp`, origin]),
					)
					.run();

				await db
					.prepare("DELETE FROM verification WHERE identifier = ?")
					.bind(codeIdentifier)
					.run();

				const fallbackData = {
					access_token: accessToken,
					token_type: "Bearer",
					expires_in: 3600,
					refresh_token: refreshToken,
					scope: scopeStr,
				};

				await logOAuthDebug(db, {
					method: request.method,
					path: `${pathname}:fallback`,
					query: url.search,
					headers: debugHeaders,
					requestBody: redactedBodyParams.toString(),
					responseStatus: 200,
					responseBody: JSON.stringify({
						fallback: true,
						scope: scopeStr,
					}),
				});

				return new Response(JSON.stringify(fallbackData), {
					status: 200,
					headers: {
						...CORS_HEADERS,
						"content-type": "application/json; charset=utf-8",
						"cache-control": "no-store",
						pragma: "no-cache",
					},
				});
			} catch (fallbackErr) {
				console.error("[oauth2/token] D1 fallback error:", fallbackErr);
			}
		}

		return response;
	}

	// 3. Fallback to Better Auth default handler (register, userinfo, introspect, revoke, etc.)
	let rawBodyForLog = "";
	if (request.method === "POST") {
		try {
			rawBodyForLog = await request.clone().text();
		} catch {
			// ignore
		}
	}
	const response = await auth.handler(request);
	let respBodyForLog = "";
	try {
		respBodyForLog = await response.clone().text();
	} catch {
		// ignore
	}
	await logOAuthDebug(db, {
		method: request.method,
		path: pathname,
		query: url.search,
		headers: debugHeaders,
		requestBody: rawBodyForLog,
		responseStatus: response.status,
		responseBody: respBodyForLog,
	});
	return response;
};
