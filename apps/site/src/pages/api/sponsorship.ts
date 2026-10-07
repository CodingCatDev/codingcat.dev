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
	const tier = data.tier ?? data.sponsorshipTier;

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

	return new Response(
		JSON.stringify({ success: true, message: "Inquiry received" }),
		{
			status: 200,
			headers: { "Content-Type": "application/json" },
		},
	);
};
