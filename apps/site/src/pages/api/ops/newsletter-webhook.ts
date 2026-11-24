import { env } from "cloudflare:workers";
import type { APIRoute } from "astro";
import { newsletterQuery } from "@/lib/sanity/queries";
import { getSanityServerClient } from "@/lib/sanity/write-client";

const CORS_HEADERS = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
	"Access-Control-Allow-Headers":
		"Content-Type, Authorization, X-Sanity-Webhook-Secret",
	"Content-Type": "application/json",
};

const AJ_INLINE_LOGO_URL =
	"https://cdn.sanity.io/images/hfh83o0w/production/5a80f58002c526483f20e1be09804c70dec243a2-512x512.png?w=64&auto=format&fit=max";
const AJ_INLINE_LOGO_HTML = `<img src="${AJ_INLINE_LOGO_URL}" alt="CodingCat.dev" width="24" height="24" class="cc-logo-inline" style="width:24px;height:24px;vertical-align:middle;border:none;display:inline-block;margin:0 2px;" />`;

/**
 * Computes the next Friday at 9:00 AM America/New_York (14:00 UTC in standard time / 13:00 UTC in EDT)
 * if no explicit `sendAt` timestamp is set on the published Sanity `newsletter` document.
 */
function resolveNextFridaySendAt(explicitSendAt?: string | null): string {
	if (explicitSendAt) {
		const parsed = new Date(explicitSendAt);
		if (
			!Number.isNaN(parsed.getTime()) &&
			parsed.getTime() > Date.now() + 60_000
		) {
			return parsed.toISOString();
		}
	}
	const now = new Date();
	const candidate = new Date(now);
	const day = candidate.getUTCDay(); // 5 = Friday
	let daysUntilFriday = (5 - day + 7) % 7;
	if (daysUntilFriday === 0 && candidate.getUTCHours() >= 13) {
		daysUntilFriday = 7;
	}
	candidate.setUTCDate(candidate.getUTCDate() + daysUntilFriday);
	candidate.setUTCHours(14, 0, 0, 0);
	return candidate.toISOString();
}

function escapeHtml(text: string): string {
	return text
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");
}

function portableTextToMarkdown(
	blocks: Array<Record<string, any>> | undefined,
	issue: Record<string, any>,
): string {
	const lines: string[] = [];

	if (issue.preheader) {
		lines.push(`*${issue.preheader}*`, "");
	}

	lines.push(
		"> **Road to 100K on YouTube (62.5K / 100K Subscribers):** Help us cross 100,000 subscribers so we can publish even more free full-length architecture deep dives! [**Subscribe to @CodingCatDev on YouTube →**](https://www.youtube.com/@CodingCatDev?sub_confirmation=1)",
		"",
	);

	for (const block of blocks || []) {
		if (block._type === "block") {
			const markDefs = new Map<string, Record<string, any>>(
				(block.markDefs || []).map((m: Record<string, any>) => [m._key, m]),
			);
			const text = (block.children || [])
				.map((span: Record<string, any>) => {
					let chunk = String(span.text || "");
					for (const mark of span.marks || []) {
						if (mark === "strong") {
							chunk = `**${chunk}**`;
						} else if (mark === "em") {
							chunk = `*${chunk}*`;
						} else if (mark === "code") {
							chunk = `\`${chunk}\``;
						} else {
							const def = markDefs.get(mark);
							if (def) {
								const href = def.href || def.url || "#";
								chunk = `[${chunk}](${href})`;
							}
						}
					}
					return chunk;
				})
				.join("");

			if (!text.trim()) {
				continue;
			}
			if (block.style === "h2") {
				lines.push(`## ${AJ_INLINE_LOGO_HTML} ${text}`, "");
			} else if (block.style === "h3") {
				lines.push(`### ${text}`, "");
			} else if (block.style === "blockquote") {
				lines.push(`> ${text}`, "");
			} else {
				lines.push(text, "");
			}
		} else if (
			block._type === "table" &&
			Array.isArray(block.rows) &&
			block.rows.length > 0
		) {
			const header = block.rows[0]?.cells || [];
			if (header.length > 0) {
				lines.push(`| ${header.join(" | ")} |`);
				lines.push(`| ${header.map(() => ":---").join(" | ")} |`);
				for (const row of block.rows.slice(1)) {
					lines.push(`| ${(row.cells || []).join(" | ")} |`);
				}
				lines.push("");
			}
		} else if (block._type === "code" && block.code) {
			lines.push(
				`<div class="codehilite" style="background:#0B1326;color:#F8FAFC;padding:16px;border-radius:12px;overflow-x:auto;font-family:'JetBrains Mono',monospace;font-size:13px;line-height:1.55;"><pre style="margin:0;color:#F8FAFC;"><code>${escapeHtml(String(block.code))}</code></pre></div>`,
				"",
			);
		}
	}

	if (issue.courseSpotlight?.slug) {
		lines.push(
			`## ${AJ_INLINE_LOGO_HTML} Featured 2026 Course Spotlight`,
			"",
			`### [${issue.courseSpotlight.title}](https://codingcat.dev/course/${issue.courseSpotlight.slug})`,
			"",
			issue.courseSpotlight.excerpt || "",
			"",
			`[**Start Course on CodingCat.dev →**](https://codingcat.dev/course/${issue.courseSpotlight.slug})`,
			"",
		);
	}

	if (issue.catOfTheWeek?.caption) {
		lines.push(
			`## ${AJ_INLINE_LOGO_HTML} Favorite Cat of the Week 🐱`,
			"",
			issue.catOfTheWeek.caption,
			"",
		);
	}

	lines.push(
		"---",
		`Read the web version in our [Newsletter Archive](https://codingcat.dev/newsletter/${issue.slug}) or reply directly to \`newsletter@codingcat.dev\`.`,
	);

	return lines.join("\n");
}

export const OPTIONS: APIRoute = async () => {
	return new Response(null, { status: 204, headers: CORS_HEADERS });
};

export const GET: APIRoute = async () => {
	const workerEnv = (env ?? {}) as unknown as Record<
		string,
		string | undefined
	>;
	return new Response(
		JSON.stringify({
			ok: true,
			service: "CodingCat.dev Sanity -> Buttondown Newsletter Webhook",
			hasButtondownKey: Boolean(workerEnv.BUTTONDOWN_API_KEY),
		}),
		{ status: 200, headers: CORS_HEADERS },
	);
};

export const POST: APIRoute = async ({ request }) => {
	const workerEnv = (env ?? {}) as unknown as Record<
		string,
		string | undefined
	>;
	const buttondownKey = workerEnv.BUTTONDOWN_API_KEY || "";
	const webhookSecret = workerEnv.SANITY_WEBHOOK_SECRET || "";

	if (webhookSecret) {
		const provided =
			request.headers.get("x-sanity-webhook-secret") ||
			request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ||
			"";
		if (provided !== webhookSecret) {
			return new Response(
				JSON.stringify({ ok: false, error: "Unauthorized webhook signature" }),
				{ status: 401, headers: CORS_HEADERS },
			);
		}
	}

	let payload: Record<string, any> = {};
	try {
		payload = (await request.json()) as Record<string, any>;
	} catch {
		return new Response(
			JSON.stringify({ ok: false, error: "Invalid JSON payload" }),
			{ status: 400, headers: CORS_HEADERS },
		);
	}

	const docId = String(payload._id || payload.id || "").trim();
	const slug = String(payload.slug?.current || payload.slug || "").trim();

	// Ignore unapproved drafts (`drafts.*`) — only published `newsletter` documents schedule sends
	if (docId.startsWith("drafts.")) {
		return new Response(
			JSON.stringify({
				ok: true,
				skipped: true,
				reason:
					"Document is still a draft in Sanity Studio; waiting for Publish approval.",
			}),
			{ status: 200, headers: CORS_HEADERS },
		);
	}

	const { client, canWrite } = getSanityServerClient();
	const issue = slug
		? await client.fetch(newsletterQuery, { slug })
		: docId
			? await client.fetch(
					`*[_type == "newsletter" && _id == $id][0]{ _id, issueNumber, title, "slug": slug.current, preheader, excerpt, date, sendAt, deliveryStatus, buttondownEmailId, content, courseSpotlight->{ title, "slug": slug.current, excerpt }, catOfTheWeek }`,
					{ id: docId },
				)
			: null;

	if (!issue?._id) {
		return new Response(
			JSON.stringify({
				ok: false,
				error: "Newsletter issue not found in Sanity",
			}),
			{ status: 404, headers: CORS_HEADERS },
		);
	}

	if (!buttondownKey) {
		return new Response(
			JSON.stringify({
				ok: false,
				error: "Missing BUTTONDOWN_API_KEY in Cloudflare Worker environment",
			}),
			{ status: 500, headers: CORS_HEADERS },
		);
	}

	const publishDate = resolveNextFridaySendAt(issue.sendAt);
	const bodyMarkdown = portableTextToMarkdown(issue.content, issue);
	const existingButtondownId =
		issue.buttondownEmailId || payload.buttondownEmailId;

	const buttondownPayload: Record<string, any> = {
		subject: issue.title,
		body: bodyMarkdown,
		status: "scheduled",
		publish_date: publishDate,
	};

	const endpoint = existingButtondownId
		? `https://api.buttondown.com/v1/emails/${existingButtondownId}`
		: "https://api.buttondown.com/v1/emails";
	const method = existingButtondownId ? "PATCH" : "POST";

	const bdRes = await fetch(endpoint, {
		method,
		headers: {
			Authorization: `Token ${buttondownKey}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify(buttondownPayload),
	});

	if (!bdRes.ok) {
		const errText = await bdRes.text();
		return new Response(
			JSON.stringify({
				ok: false,
				error: `Buttondown API ${method} failed (${bdRes.status})`,
				detail: errText,
			}),
			{ status: 502, headers: CORS_HEADERS },
		);
	}

	const bdEmail = (await bdRes.json()) as Record<string, any>;

	if (canWrite) {
		await client
			.patch(issue._id)
			.set({
				deliveryStatus: "scheduled",
				sendAt: publishDate,
				buttondownEmailId: bdEmail.id,
				buttondownWebUrl: bdEmail.absolute_url || undefined,
			})
			.commit();
	}

	return new Response(
		JSON.stringify({
			ok: true,
			issueId: issue._id,
			buttondownEmailId: bdEmail.id,
			status: bdEmail.status || "scheduled",
			publishDate,
		}),
		{ status: 200, headers: CORS_HEADERS },
	);
};
