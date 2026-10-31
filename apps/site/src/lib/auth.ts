import { env } from "cloudflare:workers";
import { mcp } from "@better-auth/mcp";
import { betterAuth } from "better-auth";
import { emailOTP, jwt, magicLink } from "better-auth/plugins";
import { sendCodingCatEmail } from "@/lib/email";

export const BETTER_AUTH_SECRET =
	(env as unknown as { BETTER_AUTH_SECRET?: string })?.BETTER_AUTH_SECRET ||
	(env as unknown as { GUEST_PORTAL_SECRET?: string })?.GUEST_PORTAL_SECRET ||
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
	"poppy:read",
	"poppy:write",
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
 * Ensures core Better-Auth tables (`user`, `session`, `account`, `verification`)
 * and the default MCP explorer user exist in Cloudflare D1.
 */
export async function ensureDefaultUserAndSession(db: D1Database) {
	const now = Date.now();
	await db.batch([
		db.prepare(
			`CREATE TABLE IF NOT EXISTS "user" (
				"id" text PRIMARY KEY NOT NULL,
				"name" text NOT NULL,
				"email" text NOT NULL UNIQUE,
				"emailVerified" integer NOT NULL DEFAULT 0,
				"image" text,
				"createdAt" integer NOT NULL,
				"updatedAt" integer NOT NULL
			)`,
		),
		db.prepare(
			`CREATE TABLE IF NOT EXISTS "session" (
				"id" text PRIMARY KEY NOT NULL,
				"expiresAt" integer NOT NULL,
				"token" text NOT NULL UNIQUE,
				"createdAt" integer NOT NULL,
				"updatedAt" integer NOT NULL,
				"ipAddress" text,
				"userAgent" text,
				"userId" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE
			)`,
		),
		db.prepare(
			`CREATE TABLE IF NOT EXISTS "account" (
				"id" text PRIMARY KEY NOT NULL,
				"accountId" text NOT NULL,
				"providerId" text NOT NULL,
				"userId" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
				"accessToken" text,
				"refreshToken" text,
				"idToken" text,
				"accessTokenExpiresAt" integer,
				"refreshTokenExpiresAt" integer,
				"scope" text,
				"password" text,
				"createdAt" integer NOT NULL,
				"updatedAt" integer NOT NULL
			)`,
		),
		db.prepare(
			`CREATE TABLE IF NOT EXISTS "verification" (
				"id" text PRIMARY KEY NOT NULL,
				"identifier" text NOT NULL,
				"value" text NOT NULL,
				"expiresAt" integer NOT NULL,
				"createdAt" integer NOT NULL,
				"updatedAt" integer NOT NULL
			)`,
		),
		db
			.prepare(
				`INSERT OR IGNORE INTO user (id, name, email, emailVerified, createdAt, updatedAt)
				 VALUES ('user_codingcat_explorer', 'CodingCat Dev Explorer', 'explorer@codingcat.dev', 1, ?, ?)`,
			)
			.bind(now, now),
		db
			.prepare(
				`INSERT OR IGNORE INTO session (id, expiresAt, token, createdAt, updatedAt, userId)
				 VALUES ('sess_codingcat_default', 2147483647000, 'cc_mcp_session_token', ?, ?, 'user_codingcat_explorer')`,
			)
			.bind(now, now),
	]);
}

function resolveSocialProviders() {
	const workerEnv = (env ?? {}) as unknown as Record<
		string,
		string | undefined
	>;
	const googleClientId =
		workerEnv.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID;
	const googleClientSecret =
		workerEnv.GOOGLE_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET;
	const githubClientId =
		workerEnv.GITHUB_CLIENT_ID || process.env.GITHUB_CLIENT_ID;
	const githubClientSecret =
		workerEnv.GITHUB_CLIENT_SECRET || process.env.GITHUB_CLIENT_SECRET;

	const providers: Record<string, any> = {};
	if (googleClientId && googleClientSecret) {
		providers.google = {
			clientId: googleClientId,
			clientSecret: googleClientSecret,
			redirectURI:
				workerEnv.GOOGLE_OAUTH_REDIRECT_URI ||
				process.env.GOOGLE_OAUTH_REDIRECT_URI ||
				"https://postiz.codingcat.dev/integrations/social/youtube",
			prompt: "select_account",
		};
	}
	if (githubClientId && githubClientSecret) {
		providers.github = {
			clientId: githubClientId,
			clientSecret: githubClientSecret,
		};
	}
	return providers;
}

function buildAuthPlugins(origin: string) {
	return [
		jwt(),
		emailOTP({
			otpLength: 6,
			expiresIn: 300,
			allowedAttempts: 3,
			storeOTP: "hashed",
			async sendVerificationOTP({ email, otp, type }) {
				const subject = `CodingCat.dev Studio Sign-In Code: ${otp}`;
				const text = [
					"CodingCat.dev Studio & Deal Room Verification",
					"==============================================",
					"",
					`Your 6-digit One-Time Password (OTP) for ${email} is:`,
					"",
					`    ${otp}`,
					"",
					`This code expires in 5 minutes (Verification type: ${type}).`,
					"If you did not request this code, you can safely ignore this email.",
					"",
					"Alex Patterson",
					"Founder, CodingCat.dev",
				].join("\n");

				const html = `
					<div style="font-family: Inter, system-ui, sans-serif; max-width: 520px; margin: 0 auto; padding: 28px; background: #0B1326; color: #F8FAFC; border-radius: 16px; border: 2px solid #7C3AED;">
						<div style="font-family: monospace; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; color: #C084FC; font-weight: 700; margin-bottom: 8px;">
							CodingCat.dev Studio &middot; Better-Auth OTP
						</div>
						<h1 style="font-size: 22px; font-weight: 800; margin: 0 0 12px; color: #FFFFFF;">
							Your 6-Digit Studio Sign-In Code
						</h1>
						<p style="font-size: 14px; line-height: 1.6; color: #CBD5E1; margin: 0 0 20px;">
							Enter this One-Time Password on your CodingCat.dev Studio Portal to verify <strong>${email}</strong>:
						</p>
						<div style="background: #131B2E; border: 2px solid #C084FC; border-radius: 12px; padding: 18px; text-align: center; font-family: monospace; font-size: 32px; font-weight: 800; letter-spacing: 0.25em; color: #86EFAC; margin-bottom: 20px;">
							${otp}
						</div>
						<p style="font-size: 12px; color: #94A3B8; margin: 0;">
							This code expires in 5 minutes and can only be used once.
						</p>
					</div>
				`;

				await sendCodingCatEmail({
					to: email,
					subject,
					text,
					html,
				});
			},
		}),
		magicLink({
			expiresIn: 300,
			storeToken: "hashed",
			async sendMagicLink({ email, url }) {
				const subject = "Sign in to CodingCat.dev Studio Portal (Magic Link)";
				const text = [
					"CodingCat.dev Studio & Deal Room Magic Link",
					"===========================================",
					"",
					`Click the single-use link below to sign in as ${email}:`,
					"",
					url,
					"",
					"This link expires in 5 minutes.",
					"",
					"Alex Patterson",
					"Founder, CodingCat.dev",
				].join("\n");

				const html = `
					<div style="font-family: Inter, system-ui, sans-serif; max-width: 520px; margin: 0 auto; padding: 28px; background: #0B1326; color: #F8FAFC; border-radius: 16px; border: 2px solid #7C3AED;">
						<div style="font-family: monospace; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; color: #C084FC; font-weight: 700; margin-bottom: 8px;">
							CodingCat.dev Studio &middot; Better-Auth Magic Link
						</div>
						<h1 style="font-size: 22px; font-weight: 800; margin: 0 0 12px; color: #FFFFFF;">
							1-Click Studio Portal Sign-In
						</h1>
						<p style="font-size: 14px; line-height: 1.6; color: #CBD5E1; margin: 0 0 22px;">
							Click the button below to verify <strong>${email}</strong> and unlock your CodingCat.dev Studio Portal:
						</p>
						<div style="margin-bottom: 22px;">
							<a href="${url}" style="display: inline-block; background: #7C3AED; color: #FFFFFF; font-weight: 700; font-size: 14px; text-decoration: none; padding: 12px 24px; border-radius: 10px;">
								Unlock Studio Portal &rarr;
							</a>
						</div>
						<p style="font-size: 11px; color: #94A3B8; word-break: break-all; margin: 0;">
							Or copy and paste this URL into your browser:<br>${url}
						</p>
					</div>
				`;

				await sendCodingCatEmail({
					to: email,
					subject,
					text,
					html,
				});
			},
		}),
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
	];
}

let cachedAuth: any = null;
let cachedOrigin = "";

/**
 * Creates or retrieves the Better Auth instance configured for
 * Model Context Protocol (MCP) and OAuth 2.1 authorization server (`basePath: ""`)
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
		trustedOrigins: [
			"https://codingcat.dev",
			"https://dev.codingcat.dev",
			origin,
		],
		...(db ? { database: db } : {}),
		socialProviders: resolveSocialProviders(),
		plugins: buildAuthPlugins(origin),
	});

	if (!db) {
		cachedAuth = instance;
		cachedOrigin = origin;
	}

	return instance;
}

/**
 * Creates the Better Auth instance mounted at `/api/auth` (`basePath: "/api/auth"`)
 * for Studio Portal, Email OTP, Magic Link, and Google/GitHub Social OAuth.
 */
export function getPortalAuth(origin: string, d1?: D1Database) {
	const db = d1 ?? (env as unknown as { DB?: D1Database })?.DB;

	return betterAuth({
		baseURL: origin,
		basePath: "/api/auth",
		secret: BETTER_AUTH_SECRET,
		trustedOrigins: [
			"https://codingcat.dev",
			"https://dev.codingcat.dev",
			"https://postiz.codingcat.dev",
			origin,
		],
		...(db ? { database: db } : {}),
		account: {
			skipStateCookieCheck: true,
		},
		socialProviders: resolveSocialProviders(),
		plugins: buildAuthPlugins(origin),
	});
}
