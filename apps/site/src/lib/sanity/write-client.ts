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
		priceUsd: 3500,
		totalAmountCents: 350000,
		depositAmountCents: 175000,
		balanceAmountCents: 175000,
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
		id: "podcast-showcase",
		name: "Sponsored Podcast & Multi-Channel Showcase",
		priceUsd: 2000,
		totalAmountCents: 200000,
		depositAmountCents: 100000,
		balanceAmountCents: 100000,
		tagline:
			"Fast-Track Recording \u00b7 Founder / DevRel Engineering Deep-Dive",
		description:
			"Priority fast-track 45-minute podcast & video episode on CodingCat.dev + 4 vertical Shorts distributed across 7 platforms + 60-second host-read mid-roll callout + Permanent show notes, canonical blog feature, and Live ROI Deal Room.",
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
		id: "ecosystem-integration",
		name: "Ecosystem Integration (Mid-Roll + Social Pack)",
		priceUsd: 950,
		totalAmountCents: 95000,
		depositAmountCents: 47500,
		balanceAmountCents: 47500,
		tagline:
			"High-Intent Developer Reach \u00b7 60s Integration + Social Thread",
		description:
			"60-second host-read technical demo integrated into a relevant CodingCat.dev video + Dedicated multi-channel social thread across X, LinkedIn, Bluesky, Threads, and Mastodon + Permanent sponsor link on codingcat.dev.",
		deliverables: [
			{
				title: "60-Second Host-Read Integrated Mid-Roll Ad",
				channel: "youtube",
			},
			{
				title:
					"Multi-Channel Social Thread (X, LinkedIn, Bluesky, Threads, Mastodon)",
				channel: "x",
			},
			{
				title: "Permanent Sponsor Link & Show Notes Inclusion",
				channel: "blog",
			},
		],
	},
	{
		id: "dedicated-video",
		name: "Standalone Dedicated YouTube Video",
		priceUsd: 2500,
		totalAmountCents: 250000,
		depositAmountCents: 125000,
		balanceAmountCents: 125000,
		tagline: "End-to-End Architecture & Code Walkthrough",
		description:
			"Full 10-to-15 minute YouTube video dedicated entirely to building with your product, SDK, or platform. Includes permanent pinned link and sponsor page placement.",
		deliverables: [
			{ title: "Dedicated YouTube Video Walkthrough", channel: "youtube" },
			{ title: "Social Launch Post across X & LinkedIn", channel: "x" },
		],
	},
	{
		id: "mid-roll-ad",
		name: "Integrated 60s Mid-Roll Ad",
		priceUsd: 1800,
		totalAmountCents: 180000,
		depositAmountCents: 90000,
		balanceAmountCents: 90000,
		tagline: "Flagship Tutorial Integration",
		description:
			"60-second host-read integration inside a flagship tutorial or architecture breakdown, with permanent description link and chapter marker.",
		deliverables: [
			{ title: "60-Second Integrated Mid-Roll Segment", channel: "youtube" },
		],
	},
	{
		id: "custom-series",
		name: "Multi-Part Video Series & Advisory",
		priceUsd: 6000,
		totalAmountCents: 600000,
		depositAmountCents: 300000,
		balanceAmountCents: 300000,
		tagline: "Custom Enterprise Campaign \u00b7 3+ Videos + Shorts + Articles",
		description:
			"Multi-part technical series covering your platform from quickstart to production scale, complete with dedicated Shorts, canonical articles, and quarterly campaign reporting.",
		deliverables: [
			{ title: "Multi-Part YouTube Technical Series", channel: "youtube" },
			{
				title: "12x Multi-Platform Vertical Shorts",
				channel: "shorts-network",
			},
			{
				title: "Canonical Documentation & Tutorial Series on CodingCat.dev",
				channel: "blog",
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
		text.includes("3,500") ||
		text.includes("3500")
	) {
		return SPONSOR_PACKAGE_TIERS[0];
	}
	if (
		text.includes("podcast") ||
		text.includes("showcase") ||
		text.includes("2,000") ||
		text.includes("2000")
	) {
		return SPONSOR_PACKAGE_TIERS[1];
	}
	if (text.includes("ecosystem") || text.includes("950")) {
		return SPONSOR_PACKAGE_TIERS[2];
	}
	if (text.includes("dedicated")) {
		return SPONSOR_PACKAGE_TIERS[3];
	}
	if (
		text.includes("mid-roll") ||
		text.includes("1,800") ||
		text.includes("1800")
	) {
		return SPONSOR_PACKAGE_TIERS[4];
	}
	if (text.includes("series") || text.includes("custom")) {
		return SPONSOR_PACKAGE_TIERS[5];
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
		perspective: "published",
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
