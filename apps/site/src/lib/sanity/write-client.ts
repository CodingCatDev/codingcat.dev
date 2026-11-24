import { env } from "cloudflare:workers";
import { createClient, type SanityClient } from "@sanity/client";

export interface SponsorPackageTier {
	id: string;
	name: string;
	priceUsd: number;
	totalAmountCents: number;
	depositAmountCents: number;
	balanceAmountCents: number;
	tagline: string;
	description: string;
	deliverables: Array<{
		title: string;
		channel: string;
	}>;
}

export const SPONSOR_PACKAGE_TIERS: SponsorPackageTier[] = [
	{
		id: "full-stack-launch",
		name: "Full-Stack Launch Bundle",
		priceUsd: 1000,
		totalAmountCents: 100000,
		depositAmountCents: 0,
		balanceAmountCents: 0,
		tagline: "Most Popular \u00b7 Complete Multi-Channel DevTool Launch",
		description:
			"Dedicated YouTube technical deep-dive (61K+ subscribers) + 4 vertical Shorts published across 7 platforms (28 native video posts via Postiz) + Canonical SEO & Agent-Ready (AEO / WebMCP / llms.txt) article on codingcat.dev syndicated to Dev.to & Hashnode + Dual-account social amplification (@CodingCatDev + @codercatdev) + Live ROI Deal Room.",
		deliverables: [
			{
				title: "Dedicated YouTube Technical Deep-Dive Video",
				channel: "youtube",
			},
			{
				title: "4x Vertical Shorts across 7 Platforms (28 Native Video Posts)",
				channel: "shorts-network",
			},
			{
				title: "Canonical SEO & Agent-Ready (AEO) Article on CodingCat.dev",
				channel: "blog",
			},
			{
				title: "Canonical Syndication to Dev.to & Hashnode",
				channel: "syndication",
			},
			{
				title: "Dual-Account Launch Thread (@CodingCatDev + @codercatdev)",
				channel: "x",
			},
			{ title: "LinkedIn Technical Breakdown Post", channel: "linkedin" },
		],
	},
	{
		id: "sponsor-of-the-month",
		name: "Sponsor of the Month (4x Ads)",
		priceUsd: 800,
		totalAmountCents: 80000,
		depositAmountCents: 0,
		balanceAmountCents: 0,
		tagline: "4x Podcast Pre-Roll Ads \u00b7 20% Bundle Savings",
		description:
			"Host-read ad at the beginning of 4 consecutive CodingCat.dev podcast & YouTube episodes, complete with description link, promo code, and permanent show notes placement.",
		deliverables: [
			{
				title: "4x Host-Read Pre-Roll Ads across Podcast & YouTube",
				channel: "youtube",
			},
			{
				title: "Promo Code & Link in All 4 Episode Show Notes",
				channel: "blog",
			},
		],
	},
	{
		id: "dedicated-video",
		name: "Standalone Dedicated YouTube Video",
		priceUsd: 600,
		totalAmountCents: 60000,
		depositAmountCents: 0,
		balanceAmountCents: 0,
		tagline: "End-to-End Architecture & Code Walkthrough",
		description:
			"Full YouTube video dedicated entirely to building with your product, SDK, or platform. Includes permanent pinned link and sponsor page placement.",
		deliverables: [
			{ title: "Dedicated YouTube Video Walkthrough", channel: "youtube" },
			{ title: "Social Launch Post across X & LinkedIn", channel: "x" },
		],
	},
	{
		id: "podcast-showcase",
		name: "Sponsored Podcast & Multi-Channel Showcase",
		priceUsd: 500,
		totalAmountCents: 50000,
		depositAmountCents: 0,
		balanceAmountCents: 0,
		tagline:
			"Fast-Track Recording \u00b7 Founder / DevRel Engineering Deep-Dive",
		description:
			"Priority fast-track 45-minute podcast & video episode on CodingCat.dev + 4 vertical Shorts distributed across 7 platforms + host-read callout + permanent show notes, canonical blog feature, and Live ROI Deal Room.",
		deliverables: [
			{
				title: "45-Minute Sponsored Podcast & YouTube Video Episode",
				channel: "youtube",
			},
			{
				title: "4x Vertical Episode Shorts across 7 Platforms",
				channel: "shorts-network",
			},
			{
				title: "Canonical Episode Post & Show Notes on CodingCat.dev",
				channel: "blog",
			},
			{
				title:
					"Multi-Channel Launch Amplification (X, LinkedIn, Bluesky, Threads, Mastodon)",
				channel: "x",
			},
		],
	},
	{
		id: "mid-roll-ad",
		name: "Pre-Roll / Integrated 60s Ad",
		priceUsd: 250,
		totalAmountCents: 25000,
		depositAmountCents: 0,
		balanceAmountCents: 0,
		tagline: "Single Episode Pre-Roll or Mid-Roll Placement",
		description:
			"Host-read sponsor mention or 60-second technical integration inside a CodingCat.dev podcast or YouTube tutorial, with permanent description link and show notes.",
		deliverables: [
			{ title: "Host-Read Pre-Roll / 60s Integrated Ad", channel: "youtube" },
			{ title: "Permanent Show Notes & Description Link", channel: "blog" },
		],
	},
	{
		id: "x-thread",
		name: "Sponsored X Thread",
		priceUsd: 150,
		totalAmountCents: 15000,
		depositAmountCents: 0,
		balanceAmountCents: 0,
		tagline: "Educational Technical Thread on @CodingCatDev",
		description:
			"Multi-post educational thread on X walking developers through your product, architecture, or launch announcement with code snippets or visuals.",
		deliverables: [
			{
				title: "Sponsored Technical Thread on X (@CodingCatDev)",
				channel: "x",
			},
		],
	},
	{
		id: "social-post",
		name: "Sponsored Social Post (X / LinkedIn / Shorts)",
		priceUsd: 100,
		totalAmountCents: 10000,
		depositAmountCents: 0,
		balanceAmountCents: 0,
		tagline: "Single-Platform Tweet, LinkedIn Post, or Vertical Short",
		description:
			"Single sponsored post on X, LinkedIn, Instagram Reel, or TikTok to promote your developer tool, launch, or event.",
		deliverables: [
			{
				title: "Sponsored Social Post (X Tweet, LinkedIn, or Vertical Short)",
				channel: "x",
			},
		],
	},
];

export function resolveSponsorTier(
	rawTier: string | string[] | undefined,
): SponsorPackageTier {
	const text = (
		Array.isArray(rawTier) ? rawTier.join(" ") : String(rawTier ?? "")
	).toLowerCase();
	for (const tier of SPONSOR_PACKAGE_TIERS) {
		if (text.includes(tier.id) || text.includes(tier.name.toLowerCase())) {
			return tier;
		}
	}
	if (
		text.includes("full-stack") ||
		text.includes("bundle") ||
		text.includes("1,000") ||
		text.includes("1000") ||
		text.includes("custom") ||
		text.includes("series")
	) {
		return SPONSOR_PACKAGE_TIERS[0];
	}
	if (
		text.includes("month") ||
		text.includes("4 ads") ||
		text.includes("4x") ||
		text.includes("800")
	) {
		return SPONSOR_PACKAGE_TIERS[1];
	}
	if (text.includes("dedicated") || text.includes("600")) {
		return SPONSOR_PACKAGE_TIERS[2];
	}
	if (
		text.includes("podcast") ||
		text.includes("showcase") ||
		text.includes("500")
	) {
		return SPONSOR_PACKAGE_TIERS[3];
	}
	if (
		text.includes("mid-roll") ||
		text.includes("pre-roll") ||
		text.includes("ecosystem") ||
		text.includes("250")
	) {
		return SPONSOR_PACKAGE_TIERS[4];
	}
	if (text.includes("thread") || text.includes("150")) {
		return SPONSOR_PACKAGE_TIERS[5];
	}
	if (
		text.includes("tweet") ||
		text.includes("social") ||
		text.includes("linkedin") ||
		text.includes("reel") ||
		text.includes("tiktok") ||
		text.includes("100")
	) {
		return SPONSOR_PACKAGE_TIERS[6];
	}
	return SPONSOR_PACKAGE_TIERS[0];
}

export function getSanityServerClient(): {
	client: SanityClient;
	canWrite: boolean;
} {
	const workerEnv = (env ?? {}) as unknown as Record<
		string,
		string | undefined
	>;
	const projectId = workerEnv.PUBLIC_SANITY_PROJECT_ID || "hfh83o0w";
	const dataset = workerEnv.PUBLIC_SANITY_DATASET || "production";
	const apiVersion = workerEnv.PUBLIC_SANITY_API_VERSION || "2025-09-30";
	const writeToken =
		workerEnv.SANITY_API_WRITE_TOKEN ||
		workerEnv.SANITY_AUTH_TOKEN ||
		workerEnv.SANITY_WRITE_TOKEN;
	const readToken = workerEnv.SANITY_API_READ_TOKEN;
	const token = writeToken || readToken;

	const client = createClient({
		projectId,
		dataset,
		apiVersion,
		useCdn: false,
		token,
		perspective: "raw",
	});

	return {
		client,
		canWrite: Boolean(writeToken),
	};
}

export async function uploadSanityImageDataUrl(
	dataUrl: string,
	filenameBase = "guest-avatar",
): Promise<{ _id: string; url: string } | null> {
	const workerEnv = (env ?? {}) as unknown as Record<
		string,
		string | undefined
	>;
	const projectId = workerEnv.PUBLIC_SANITY_PROJECT_ID || "hfh83o0w";
	const dataset = workerEnv.PUBLIC_SANITY_DATASET || "production";
	const apiVersion = workerEnv.PUBLIC_SANITY_API_VERSION || "2025-09-30";
	const writeToken =
		workerEnv.SANITY_API_WRITE_TOKEN ||
		workerEnv.SANITY_AUTH_TOKEN ||
		workerEnv.SANITY_WRITE_TOKEN;

	if (!writeToken) {
		return null;
	}

	const match = dataUrl.match(
		/^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/,
	);
	if (!match) {
		throw new Error(
			"Invalid image format. Please upload a JPEG, PNG, or WebP image.",
		);
	}

	const mimeType = match[1];
	const base64Data = match[2];
	const binaryStr = atob(base64Data);
	const len = binaryStr.length;

	if (len < 64 || len > 2 * 1024 * 1024) {
		throw new Error("Profile photo must be under 2 MB.");
	}

	const bytes = new Uint8Array(len);
	for (let i = 0; i < len; i++) {
		bytes[i] = binaryStr.charCodeAt(i);
	}

	// Verify magic bytes for JPEG (FF D8 FF), PNG (89 50 4E 47), or WebP (RIFF....WEBP)
	const isJpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
	const isPng =
		bytes[0] === 0x89 &&
		bytes[1] === 0x50 &&
		bytes[2] === 0x4e &&
		bytes[3] === 0x47;
	const isWebp =
		bytes[0] === 0x52 &&
		bytes[1] === 0x49 &&
		bytes[2] === 0x46 &&
		bytes[3] === 0x46 &&
		bytes[8] === 0x57 &&
		bytes[9] === 0x45 &&
		bytes[10] === 0x42 &&
		bytes[11] === 0x50;

	if (!isJpeg && !isPng && !isWebp) {
		throw new Error("Invalid image file header.");
	}

	const ext =
		mimeType === "image/png"
			? "png"
			: mimeType === "image/webp"
				? "webp"
				: "jpg";
	const cleanFilename = `${filenameBase.replace(/[^a-zA-Z0-9_-]/g, "-")}.${ext}`;

	const uploadUrl = `https://${projectId}.api.sanity.io/v${apiVersion}/assets/images/${dataset}?filename=${encodeURIComponent(cleanFilename)}`;
	const res = await fetch(uploadUrl, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${writeToken}`,
			"Content-Type": mimeType,
		},
		body: bytes,
	});

	if (!res.ok) {
		const text = await res.text();
		throw new Error(`Sanity image upload failed (${res.status}): ${text}`);
	}

	const json = (await res.json()) as {
		document?: { _id?: string; url?: string };
	};
	if (!json.document?._id || !json.document?.url) {
		throw new Error("Sanity did not return an uploaded image asset document.");
	}

	return {
		_id: json.document._id,
		url: json.document.url,
	};
}
