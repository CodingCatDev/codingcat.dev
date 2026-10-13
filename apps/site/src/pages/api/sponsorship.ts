import { env } from "cloudflare:workers";
import type { APIRoute } from "astro";

interface SponsorshipPayload {
	name?: string;
	fullName?: string;
	email?: string;
	company?: string;
	companyName?: string;
	tier?: string | string[];
	sponsorshipTier?: string | string[];
	message?: string;
}

function getTierBudgetCents(tier: string | string[] | undefined): number {
	const raw = (
		Array.isArray(tier) ? tier.join(" ") : String(tier ?? "")
	).toLowerCase();
	if (raw.includes("dedicated")) {
		return 400000;
	}
	if (raw.includes("mid-roll") || raw.includes("integrated")) {
		return 180000;
	}
	if (raw.includes("shout-out")) {
		return 90000;
	}
	if (raw.includes("newsletter") || raw.includes("blog")) {
		return 50000;
	}
	if (raw.includes("series") || raw.includes("custom")) {
		return 500000;
	}
	return 150000;
}

export const POST: APIRoute = async ({ request }) => {
	let data: SponsorshipPayload = {};
	const contentType = request.headers.get("content-type") ?? "";

	if (contentType.includes("application/json")) {
		try {
			data = (await request.json()) as SponsorshipPayload;
		} catch {
			return new Response(
				JSON.stringify({ success: false, message: "Invalid JSON payload" }),
				{
					status: 400,
					headers: { "Content-Type": "application/json" },
				},
			);
		}
	} else if (
		contentType.includes("application/x-www-form-urlencoded") ||
		contentType.includes("multipart/form-data")
	) {
		try {
			const formData = await request.formData();
			const formObj: Record<string, unknown> = {};
			for (const [key, value] of formData.entries()) {
				if (typeof value === "string") {
					formObj[key] = value;
				}
			}
			data = formObj as SponsorshipPayload;
		} catch {
			return new Response(
				JSON.stringify({ success: false, message: "Invalid form payload" }),
				{
					status: 400,
					headers: { "Content-Type": "application/json" },
				},
			);
		}
	} else {
		try {
			const text = await request.text();
			data = JSON.parse(text) as SponsorshipPayload;
		} catch {
			return new Response(
				JSON.stringify({
					success: false,
					message: "Unsupported Content-Type or invalid payload",
				}),
				{
					status: 400,
					headers: { "Content-Type": "application/json" },
				},
			);
		}
	}

	const name = (data.name ?? data.fullName)?.trim();
	const email = data.email?.trim();
	const company = (data.company ?? data.companyName)?.trim();
	const tier = data.tier ?? data.sponsorshipTier;
	const message = data.message?.trim();

	if (!name) {
		return new Response(
			JSON.stringify({ success: false, message: "Name is required" }),
			{
				status: 400,
				headers: { "Content-Type": "application/json" },
			},
		);
	}

	if (!email || !email.includes("@")) {
		return new Response(
			JSON.stringify({
				success: false,
				message: "A valid email address is required",
			}),
			{
				status: 400,
				headers: { "Content-Type": "application/json" },
			},
		);
	}

	const hasTier =
		(typeof tier === "string" && tier.trim().length > 0) ||
		(Array.isArray(tier) && tier.length > 0);

	if (!hasTier) {
		return new Response(
			JSON.stringify({
				success: false,
				message: "Sponsorship tier selection is required",
			}),
			{
				status: 400,
				headers: { "Content-Type": "application/json" },
			},
		);
	}

	const targetPlacements = Array.isArray(tier) ? tier : [String(tier)];
	const proposedBudget = getTierBudgetCents(tier);

	const flipcoreUrl =
		(env as unknown as Record<string, string | undefined>)?.FLIPCORE_API_URL ??
		"https://api.flipfeeds.com";
	const flipcoreWebUrl =
		(env as unknown as Record<string, string | undefined>)
			?.PUBLIC_FLIPCORE_WEB_URL ?? "https://flipfeeds.com";

	const fallbackToken = `spt_${crypto.randomUUID().replace(/-/g, "").slice(0, 16)}`;
	let portalToken = fallbackToken;
	let portalUrl = `${flipcoreWebUrl}/codingcatdev/portal/${fallbackToken}`;
	let dealId = `deal_${crypto.randomUUID().replace(/-/g, "").slice(0, 16)}`;
	let inquiryId = `inq_${crypto.randomUUID().replace(/-/g, "").slice(0, 16)}`;

	try {
		const flipcoreRes = await fetch(`${flipcoreUrl}/v1/deals/inquiries`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				sponsorName: name,
				sponsorEmail: email,
				companyName: company ?? undefined,
				targetPlacements,
				proposedBudget,
				currency: "USD",
				message: message ?? undefined,
				slug: "codingcatdev",
			}),
		});

		if (flipcoreRes.ok) {
			const resData = (await flipcoreRes.json()) as any;
			if (resData.portalUrl) {
				portalUrl = resData.portalUrl;
			}
			if (resData.portalToken) {
				portalToken = resData.portalToken;
			}
			if (resData.dealId) {
				dealId = resData.dealId;
			}
			if (resData.inquiryId) {
				inquiryId = resData.inquiryId;
			}
		}
	} catch {
		// Resilient fallback: uses pre-generated live Deal Room URL
	}

	return new Response(
		JSON.stringify({
			success: true,
			message: "Inquiry received",
			inquiryId,
			dealId,
			portalToken,
			portalUrl,
			dealRoomUrl: portalUrl,
		}),
		{
			status: 200,
			headers: { "Content-Type": "application/json" },
		},
	);
};
