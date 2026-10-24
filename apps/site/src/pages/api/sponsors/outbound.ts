import type { APIRoute } from "astro";
import { sendCodingCatEmail } from "@/lib/email";
import { getSanityServerClient } from "@/lib/sanity/write-client";

export interface OutboundProspect {
	companyName: string;
	website: string;
	contactName: string;
	contactEmail: string;
	category: string;
	fundingRound: string;
	source: "yc" | "hackernews" | "linkedin" | "curated";
	relevanceScore: number;
	videoConcepts: Array<{
		title: string;
		hook: string;
		angle: string;
		targetPackage: string;
	}>;
	outreachDraftSubject: string;
	outreachDraftBody: string;
}

function sanitizeDashes(text: string): string {
	return text
		.replace(/\u2014/g, ", ")
		.replace(/\u2013/g, "-")
		.replace(/--+/g, ",");
}

function buildTailoredConcepts(
	companyName: string,
	category: string,
	summary: string,
) {
	const cleanSummary = sanitizeDashes(
		summary || category || "AI and developer infrastructure",
	);
	const concepts = [
		{
			title: `Building Production AI Agents with ${companyName}: Architecture & Cost Breakdown`,
			hook: `Most teams wire up ${companyName} in a weekend prototype and hit scaling walls in production. Here is how to structure ${companyName} in 60 seconds without burning token or latency budgets.`,
			angle:
				"End-to-end production build on CodingCat.dev showing real SDK integration, latency benchmarks, and 4 vertical Shorts syndicated across 7 developer networks.",
			targetPackage: "Full-Stack Launch Bundle ($3,500)",
		},
		{
			title: `Under the Hood of ${companyName}: Engineering Deep-Dive (${cleanSummary.slice(0, 60)})`,
			hook: `What happens under the hood when you replace brittle glue code with ${companyName}? Let us walk through the live architecture.`,
			angle:
				"45-minute technical founder/staff-engineer podcast showcase + canonical AEO/WebMCP article on codingcat.dev syndicated to Dev.to and Hashnode.",
			targetPackage: "Sponsored Podcast & Multi-Channel Showcase ($2,000)",
		},
	];

	const outreachDraftSubject = sanitizeDashes(
		`2 technical video concepts for ${companyName} x CodingCat.dev`,
	);

	const outreachDraftBody = sanitizeDashes(
		[
			`Hi ${companyName} team,`,
			"",
			`I have been following ${companyName}'s momentum in ${cleanSummary} and put together two concrete technical video concepts we could build and distribute for your team on CodingCat.dev (61.2K+ YouTube subscribers, ~21% US/CA/UK/AU senior engineering audience, 7-platform Shorts syndication, and canonical AEO blog coverage):`,
			"",
			`1. "${concepts[0].title}"`,
			`   Angle: ${concepts[0].angle}`,
			"",
			`2. "${concepts[1].title}"`,
			`   Angle: ${concepts[1].angle}`,
			"",
			"Our Full-Stack Launch Bundle ($3,500 total, locked with a 50% upfront deposit and 50% on publish) includes the dedicated YouTube build, 4 vertical Shorts published across 7 platforms (28 native video posts), a canonical SEO + Agent-Ready (WebMCP / llms.txt) article on codingcat.dev syndicated to Dev.to and Hashnode, and a live ROI Deal Room.",
			"",
			"If you are open to a quick 15-minute scoping call this week, you can pick a live conflict-free slot or open a Sponsor Deal Room here:",
			"https://codingcat.dev/sponsorships#sponsorship-form",
			"",
			"Best,",
			"Alex Patterson",
			"Founder, CodingCat.dev",
			"https://codingcat.dev/sponsorships",
		].join("\n"),
	);

	return { concepts, outreachDraftSubject, outreachDraftBody };
}

async function discoverLaunchHnProspects(): Promise<OutboundProspect[]> {
	const prospects: OutboundProspect[] = [];
	try {
		const res = await fetch(
			"https://hn.algolia.com/api/v1/search_by_date?query=%22Launch%20HN%22&tags=story&hitsPerPage=8",
		);
		if (res.ok) {
			const data = (await res.json()) as {
				hits?: Array<{
					title?: string;
					url?: string;
					author?: string;
					points?: number;
				}>;
			};
			for (const hit of data.hits ?? []) {
				const rawTitle = hit.title ?? "";
				// Match "Launch HN: Company (YC W26) – Summary"
				const cleaned = rawTitle.replace(/^Launch HN:\s*/i, "");
				const parts = cleaned.split(/[\u2013\u2014\-:]/);
				const nameWithBatch = (parts[0] ?? "").trim();
				const summary =
					parts.slice(1).join(" ").trim() ||
					"Developer Infrastructure & AI Tooling";
				const batchMatch = nameWithBatch.match(/\((YC [^)]+)\)/i);
				const companyName = nameWithBatch
					.replace(/\s*\([^)]*\)\s*/g, "")
					.trim();
				if (!companyName || companyName.length < 2) {
					continue;
				}

				let domain = "example.com";
				if (hit.url) {
					try {
						domain = new URL(hit.url).hostname.replace(/^www\./, "");
					} catch {
						// fallback
					}
				}
				const website = hit.url || `https://${domain}`;
				const { concepts, outreachDraftSubject, outreachDraftBody } =
					buildTailoredConcepts(companyName, "AI / Developer Tools", summary);

				prospects.push({
					companyName,
					website,
					contactName: hit.author ? `${hit.author} (Founder)` : "Founding Team",
					contactEmail: `founders@${domain}`,
					category: sanitizeDashes(summary.slice(0, 80)),
					fundingRound: batchMatch ? batchMatch[1] : "YC / Launch HN",
					source: "yc",
					relevanceScore: Math.min(
						98,
						75 + Math.round((hit.points ?? 20) / 10),
					),
					videoConcepts: concepts,
					outreachDraftSubject,
					outreachDraftBody,
				});
			}
		}
	} catch {
		// Fallback curated prospects below
	}

	if (prospects.length === 0) {
		const fallbackSeeds = [
			{
				companyName: "SuperPlane",
				website: "https://superplane.com",
				contactName: "Larisa (Growth)",
				contactEmail: "larisa@superplane.com",
				category: "Open-Source DevOps & Cloud Orchestration",
				fundingRound: "GA Launch Oct 2026",
				source: "curated" as const,
			},
			{
				companyName: "Tessen ZERO",
				website: "https://tessen.ai",
				contactName: "Yannick Parfait",
				contactEmail: "hello@tessen.ai",
				category: "Autonomous Security & AI Agent Guardrails",
				fundingRound: "Seed Launch",
				source: "curated" as const,
			},
		];
		for (const seed of fallbackSeeds) {
			const { concepts, outreachDraftSubject, outreachDraftBody } =
				buildTailoredConcepts(seed.companyName, seed.category, seed.category);
			prospects.push({
				...seed,
				relevanceScore: 95,
				videoConcepts: concepts,
				outreachDraftSubject,
				outreachDraftBody,
			});
		}
	}

	return prospects;
}

export const GET: APIRoute = async () => {
	const prospects = await discoverLaunchHnProspects();
	return new Response(
		JSON.stringify({
			success: true,
			count: prospects.length,
			prospects,
		}),
		{ status: 200, headers: { "Content-Type": "application/json" } },
	);
};

export const POST: APIRoute = async ({ request }) => {
	let body: {
		action?: "discover" | "send_outreach";
		companyName?: string;
		website?: string;
		contactName?: string;
		contactEmail?: string;
		category?: string;
		fundingRound?: string;
		subject?: string;
		message?: string;
	} = {};

	try {
		body = await request.json();
	} catch {
		// Default to discover
	}

	if (body.action === "send_outreach" && body.contactEmail) {
		const { concepts, outreachDraftSubject, outreachDraftBody } =
			buildTailoredConcepts(
				body.companyName || "Partner",
				body.category || "Developer Tooling",
				body.category || "Developer Tooling",
			);

		const subject = sanitizeDashes(body.subject || outreachDraftSubject);
		const text = sanitizeDashes(body.message || outreachDraftBody);

		const sent = await sendCodingCatEmail({
			to: body.contactEmail,
			subject,
			text,
		});

		const { client, canWrite } = getSanityServerClient();
		if (canWrite && body.companyName) {
			try {
				const slugId = body.companyName
					.toLowerCase()
					.replace(/[^a-z0-9]+/g, "-");
				await client.createOrReplace({
					_id: `sponsorPool-${slugId}`,
					_type: "sponsorPool",
					companyName: body.companyName,
					contactName: body.contactName || "Founding Team",
					contactEmail: body.contactEmail,
					...(body.website ? { website: body.website } : {}),
					category: body.category || "AI / DevTools",
					fundingRound: body.fundingRound || "Seed / Launch",
					source: "yc",
					relevanceScore: 92,
					videoConcepts: concepts.map((c, idx) => ({
						_key: `vc-${idx}`,
						...c,
					})),
					outreachDraftSubject: subject,
					outreachDraftBody: text,
					lastContactedAt: new Date().toISOString(),
					optedOut: false,
				});
			} catch {
				// Non-fatal
			}
		}

		return new Response(
			JSON.stringify({
				success: true,
				emailSentViaCloudflare: sent,
				subject,
				text,
				videoConcepts: concepts,
			}),
			{ status: 200, headers: { "Content-Type": "application/json" } },
		);
	}

	const prospects = await discoverLaunchHnProspects();
	const { client, canWrite } = getSanityServerClient();

	if (canWrite) {
		for (const p of prospects.slice(0, 6)) {
			try {
				const slugId = p.companyName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
				await client.createOrReplace({
					_id: `sponsorPool-${slugId}`,
					_type: "sponsorPool",
					companyName: p.companyName,
					contactName: p.contactName,
					contactEmail: p.contactEmail,
					website: p.website,
					category: p.category,
					fundingRound: p.fundingRound,
					source: p.source,
					relevanceScore: p.relevanceScore,
					videoConcepts: p.videoConcepts.map((c, idx) => ({
						_key: `vc-${idx}`,
						...c,
					})),
					outreachDraftSubject: p.outreachDraftSubject,
					outreachDraftBody: p.outreachDraftBody,
					optedOut: false,
				});
			} catch {
				// Non-fatal
			}
		}
	}

	return new Response(
		JSON.stringify({
			success: true,
			savedToSanity: canWrite,
			count: prospects.length,
			prospects,
		}),
		{ status: 200, headers: { "Content-Type": "application/json" } },
	);
};
