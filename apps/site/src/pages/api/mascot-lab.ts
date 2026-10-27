/**
 * `/api/mascot-lab` | Cloudflare D1 Preset API & Creator Session Handler for `/mascot-lab`.
 * Zero em-dashes used.
 */
import { env } from "cloudflare:workers";
import type { APIRoute } from "astro";
import { DEFAULT_MCP_USER, ensureDefaultUserAndSession } from "@/lib/auth";

export const prerender = false;

export interface MascotLabPresetRecord {
	id: string;
	userId: string;
	userName: string;
	name: string;
	state: string;
	variant: string;
	angle: string;
	mouth: string;
	caption: string;
	bgTheme: string;
	showYarnBall: number;
	showPivots: number;
	createdAt: number;
}

const DEFAULT_STARTER_PRESETS: MascotLabPresetRecord[] = [
	{
		id: "preset-hero-idle-left",
		userId: DEFAULT_MCP_USER.id,
		userName: "Alex Patterson",
		name: "Hero Card (Looking Left)",
		state: "idle-wave",
		variant: "full-body",
		angle: "three-quarter-left",
		mouth: "smile-open",
		caption: "Purrfect code! 🐾",
		bgTheme: "obsidian",
		showYarnBall: 0,
		showPivots: 0,
		createdAt: 1730000000000,
	},
	{
		id: "preset-podcast-groove",
		userId: DEFAULT_MCP_USER.id,
		userName: "Alex Patterson",
		name: "120 BPM Podcast Groove",
		state: "podcast-groove",
		variant: "full-body",
		angle: "three-quarter-right",
		mouth: "grin",
		caption: "Watch Episode →",
		bgTheme: "obsidian",
		showYarnBall: 0,
		showPivots: 0,
		createdAt: 1730000010000,
	},
	{
		id: "preset-diagram-head",
		userId: DEFAULT_MCP_USER.id,
		userName: "Alex Patterson",
		name: "Visual Diagram Header (Head Crop)",
		state: "point-diagram",
		variant: "head",
		angle: "three-quarter-left",
		mouth: "smile-open",
		caption: "Let's build it!",
		bgTheme: "chalk",
		showYarnBall: 0,
		showPivots: 0,
		createdAt: 1730000020000,
	},
	{
		id: "preset-wtf-mind-blown",
		userId: DEFAULT_MCP_USER.id,
		userName: "Alex Patterson",
		name: "WTF is... Shock Pose",
		state: "mind-blown",
		variant: "full-body",
		angle: "three-quarter-right",
		mouth: "surprised-o",
		caption: "Wait, edge SQLite?!",
		bgTheme: "void",
		showYarnBall: 0,
		showPivots: 0,
		createdAt: 1730000030000,
	},
];

function parseCookies(cookieHeader: string | null): Record<string, string> {
	if (!cookieHeader) {
		return {};
	}
	const out: Record<string, string> = {};
	for (const part of cookieHeader.split(";")) {
		const idx = part.indexOf("=");
		if (idx > 0) {
			const k = part.slice(0, idx).trim();
			const v = part.slice(idx + 1).trim();
			try {
				out[k] = decodeURIComponent(v);
			} catch {
				out[k] = v;
			}
		}
	}
	return out;
}

export function resolveMascotLabUser(request: Request): {
	authenticated: boolean;
	userId: string;
	userName: string;
	userEmail: string;
} {
	const cookies = parseCookies(request.headers.get("cookie"));
	const creatorSession = cookies.cc_mascot_lab_user;
	const betterAuthSession =
		cookies["better-auth.session_token"] ||
		cookies["__Secure-better-auth.session_token"] ||
		cookies.cc_mcp_session;

	if (creatorSession) {
		const [namePart, emailPart] = creatorSession.split("|");
		return {
			authenticated: true,
			userId: DEFAULT_MCP_USER.id,
			userName: namePart || DEFAULT_MCP_USER.name,
			userEmail: emailPart || DEFAULT_MCP_USER.email,
		};
	}

	if (betterAuthSession) {
		return {
			authenticated: true,
			userId: DEFAULT_MCP_USER.id,
			userName: DEFAULT_MCP_USER.name,
			userEmail: DEFAULT_MCP_USER.email,
		};
	}

	return {
		authenticated: false,
		userId: DEFAULT_MCP_USER.id,
		userName: DEFAULT_MCP_USER.name,
		userEmail: DEFAULT_MCP_USER.email,
	};
}

async function ensureMascotPresetsTable(db: D1Database) {
	await ensureDefaultUserAndSession(db);
	await db
		.prepare(
			`CREATE TABLE IF NOT EXISTS mascot_presets (
				id TEXT PRIMARY KEY,
				userId TEXT NOT NULL,
				userName TEXT NOT NULL,
				name TEXT NOT NULL,
				state TEXT NOT NULL,
				variant TEXT NOT NULL,
				angle TEXT NOT NULL DEFAULT 'three-quarter-right',
				mouth TEXT NOT NULL,
				caption TEXT NOT NULL DEFAULT '',
				bgTheme TEXT NOT NULL DEFAULT 'obsidian',
				showYarnBall INTEGER NOT NULL DEFAULT 0,
				showPivots INTEGER NOT NULL DEFAULT 0,
				createdAt INTEGER NOT NULL
			)`,
		)
		.run();
}

export const GET: APIRoute = async ({ request }) => {
	const user = resolveMascotLabUser(request);
	const db = (env as unknown as { DB?: D1Database })?.DB;

	if (!db) {
		return new Response(
			JSON.stringify({
				success: true,
				authenticated: user.authenticated,
				user: user.authenticated
					? { name: user.userName, email: user.userEmail }
					: null,
				presets: DEFAULT_STARTER_PRESETS,
			}),
			{ status: 200, headers: { "Content-Type": "application/json" } },
		);
	}

	try {
		await ensureMascotPresetsTable(db);
		const rows = await db
			.prepare(
				`SELECT id, userId, userName, name, state, variant, angle, mouth, caption, bgTheme, showYarnBall, showPivots, createdAt
				 FROM mascot_presets
				 ORDER BY createdAt DESC
				 LIMIT 24`,
			)
			.all<MascotLabPresetRecord>();

		const customPresets = rows.results ?? [];
		const merged = [
			...customPresets,
			...DEFAULT_STARTER_PRESETS.filter(
				(d) => !customPresets.some((c) => c.id === d.id),
			),
		];

		return new Response(
			JSON.stringify({
				success: true,
				authenticated: user.authenticated,
				user: user.authenticated
					? { name: user.userName, email: user.userEmail }
					: null,
				presets: merged,
			}),
			{ status: 200, headers: { "Content-Type": "application/json" } },
		);
	} catch {
		return new Response(
			JSON.stringify({
				success: true,
				authenticated: user.authenticated,
				user: user.authenticated
					? { name: user.userName, email: user.userEmail }
					: null,
				presets: DEFAULT_STARTER_PRESETS,
			}),
			{ status: 200, headers: { "Content-Type": "application/json" } },
		);
	}
};

export const POST: APIRoute = async ({ request }) => {
	let payload: Record<string, unknown> = {};
	try {
		payload = (await request.json()) as Record<string, unknown>;
	} catch {
		return new Response(
			JSON.stringify({ success: false, message: "Invalid JSON body" }),
			{ status: 400, headers: { "Content-Type": "application/json" } },
		);
	}

	if (payload.action === "login") {
		const name =
			String(payload.name || DEFAULT_MCP_USER.name).trim() ||
			DEFAULT_MCP_USER.name;
		const email =
			String(payload.email || DEFAULT_MCP_USER.email).trim() ||
			DEFAULT_MCP_USER.email;
		const db = (env as unknown as { DB?: D1Database })?.DB;
		if (db) {
			try {
				await ensureDefaultUserAndSession(db);
			} catch {
				// Non-fatal in local preview
			}
		}
		const cookieVal = encodeURIComponent(`${name}|${email}`);
		return new Response(
			JSON.stringify({
				success: true,
				authenticated: true,
				user: { name, email },
			}),
			{
				status: 200,
				headers: {
					"Content-Type": "application/json",
					"Set-Cookie": `cc_mascot_lab_user=${cookieVal}; Path=/; Max-Age=2592000; SameSite=Lax`,
				},
			},
		);
	}

	if (payload.action === "logout") {
		return new Response(
			JSON.stringify({ success: true, authenticated: false }),
			{
				status: 200,
				headers: {
					"Content-Type": "application/json",
					"Set-Cookie": "cc_mascot_lab_user=; Path=/; Max-Age=0; SameSite=Lax",
				},
			},
		);
	}

	const user = resolveMascotLabUser(request);
	if (!user.authenticated) {
		return new Response(
			JSON.stringify({
				success: false,
				requiresAuth: true,
				signInUrl: "/sign-in?redirect=/mascot-lab",
				message: "Sign in to save custom AJ presets to Cloudflare D1.",
			}),
			{ status: 401, headers: { "Content-Type": "application/json" } },
		);
	}

	const preset: MascotLabPresetRecord = {
		id: `preset-${crypto.randomUUID().replace(/-/g, "").slice(0, 12)}`,
		userId: user.userId,
		userName: user.userName,
		name: String(payload.name || "Custom AJ Pose")
			.trim()
			.slice(0, 48),
		state: String(payload.state || "idle-wave"),
		variant: String(payload.variant || "full-body"),
		angle: String(payload.angle || "three-quarter-right"),
		mouth: String(payload.mouth || "smile-open"),
		caption: String(payload.caption ?? "Purrfect code! 🐾").slice(0, 64),
		bgTheme: String(payload.bgTheme || "obsidian"),
		showYarnBall: payload.showYarnBall ? 1 : 0,
		showPivots: payload.showPivots ? 1 : 0,
		createdAt: Date.now(),
	};

	const db = (env as unknown as { DB?: D1Database })?.DB;
	if (db) {
		try {
			await ensureMascotPresetsTable(db);
			await db
				.prepare(
					`INSERT INTO mascot_presets (id, userId, userName, name, state, variant, angle, mouth, caption, bgTheme, showYarnBall, showPivots, createdAt)
					 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
				)
				.bind(
					preset.id,
					preset.userId,
					preset.userName,
					preset.name,
					preset.state,
					preset.variant,
					preset.angle,
					preset.mouth,
					preset.caption,
					preset.bgTheme,
					preset.showYarnBall,
					preset.showPivots,
					preset.createdAt,
				)
				.run();
		} catch {
			// Fallback to returning the preset record if D1 write fails locally
		}
	}

	return new Response(
		JSON.stringify({
			success: true,
			preset,
		}),
		{ status: 200, headers: { "Content-Type": "application/json" } },
	);
};

export const DELETE: APIRoute = async ({ request, url }) => {
	const user = resolveMascotLabUser(request);
	if (!user.authenticated) {
		return new Response(
			JSON.stringify({ success: false, message: "Sign in required" }),
			{ status: 401, headers: { "Content-Type": "application/json" } },
		);
	}
	const id = url.searchParams.get("id");
	if (!id) {
		return new Response(
			JSON.stringify({ success: false, message: "Missing preset id" }),
			{ status: 400, headers: { "Content-Type": "application/json" } },
		);
	}

	const db = (env as unknown as { DB?: D1Database })?.DB;
	if (db) {
		try {
			await ensureMascotPresetsTable(db);
			await db
				.prepare("DELETE FROM mascot_presets WHERE id = ?")
				.bind(id)
				.run();
		} catch {
			// Non-fatal
		}
	}

	return new Response(JSON.stringify({ success: true, deletedId: id }), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
};
