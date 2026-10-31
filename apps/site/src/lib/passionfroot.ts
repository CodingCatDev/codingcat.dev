import { env } from "cloudflare:workers";

export const PASSIONFROOT_CREATOR_API_BASE =
	"https://workspace.passionfroot.me/api/creators/v1";

export interface PassionfrootPartner {
	id: string;
	name: string;
	websiteUrl?: string | null;
}

export interface PassionfrootCollaboration {
	id: string;
	name: string;
	partnerId: string;
	status: "pending" | "confirmed" | "cancelled";
	priceCents: number | null;
	usdPriceCents: number | null;
	currency: string;
	createdAt: string;
	statusUpdatedAt: string;
}

export interface PassionfrootPlacement {
	id: string;
	partnerId: string;
	collaborationId: string;
	date: string;
	name: string;
	status: "pending" | "confirmed" | "completed" | "cancelled" | string;
	platform?: string | null;
	postType?: string | null;
	url?: string | null;
	viewCount?: number | null;
	likeCount?: number | null;
	commentCount?: number | null;
	shareCount?: number | null;
	metricsLastUpdatedAt?: string | null;
	priceCents?: number | null;
	usdPriceCents?: number | null;
	currency?: string;
	partner?: PassionfrootPartner;
}

export interface PassionfrootAttachment {
	fileName: string;
	fileSize: number;
	mimeType: string;
	downloadUrl: string | null;
}

export interface PassionfrootProposalPlacement {
	date: string;
	postType: string | null;
	platform: string | null;
}

export interface PassionfrootProposal {
	proposalId: string | null;
	collaborationId: string;
	requestId: string;
	status: "offer_pending" | "pending" | "accepted" | "rejected" | "cancelled";
	createdBy: "creator" | "brand";
	priceCents: number | null;
	budgetCents: number | null;
	currency: string | null;
	packageName: string;
	comment?: string;
	placements: PassionfrootProposalPlacement[];
}

export interface PassionfrootMessage {
	id: string;
	conversationId: string;
	createdAt: string;
	sender?: {
		type?: "partner" | "creator" | "system" | string;
		name?: string;
	};
	type?: "text" | "request" | "proposal" | string;
	text?: string | null;
	attachments?: PassionfrootAttachment[];
	request?: {
		requestId?: string;
		collaborationId?: string;
		status?: string;
		packageName?: string;
		priceCents?: number | null;
		budgetCents?: number | null;
		currency?: string | null;
		comment?: string;
		placements?: PassionfrootProposalPlacement[];
	};
	proposal?: PassionfrootProposal;
}

export interface PassionfrootConversation {
	id: string;
	partnerId: string;
	collaborationId?: string | null;
	unread?: boolean;
	lastActivityAt?: string;
	partner?: PassionfrootPartner;
}

function getPassionfrootApiKey(overrideKey?: string): string | null {
	if (overrideKey?.trim()) {
		return overrideKey.trim();
	}
	const workerEnv = (env ?? {}) as unknown as Record<
		string,
		string | undefined
	>;
	const key =
		workerEnv.PASSIONFROOT_API_KEY ||
		workerEnv.PASSIONFROOT_CREATOR_API_KEY ||
		process.env.PASSIONFROOT_API_KEY ||
		process.env.PASSIONFROOT_CREATOR_API_KEY;
	return key?.trim() || null;
}

export function hasPassionfrootApiKey(overrideKey?: string): boolean {
	return Boolean(getPassionfrootApiKey(overrideKey));
}

async function passionfrootFetch<T>(
	path: string,
	options: {
		method?: "GET" | "POST";
		body?: unknown;
		idempotent?: boolean;
		apiKey?: string;
	} = {},
): Promise<{ ok: boolean; status: number; data?: T; error?: string }> {
	const apiKey = getPassionfrootApiKey(options.apiKey);
	if (!apiKey) {
		return {
			ok: false,
			status: 401,
			error:
				"Missing PASSIONFROOT_API_KEY. Generate a Creator API key in Passionfroot Settings -> AI agents & API and add it to Cloudflare secrets / .dev.vars.",
		};
	}

	const method = options.method || "GET";
	const headers: Record<string, string> = {
		Authorization: `Bearer ${apiKey}`,
		Accept: "application/json",
	};
	if (options.body !== undefined) {
		headers["Content-Type"] = "application/json";
	}
	if (options.idempotent && method === "POST") {
		headers["Idempotency-Key"] = crypto.randomUUID();
	}

	const url = `${PASSIONFROOT_CREATOR_API_BASE}${path.startsWith("/") ? path : `/${path}`}`;

	for (let attempt = 0; attempt < 2; attempt++) {
		const res = await fetch(url, {
			method,
			headers,
			body:
				options.body !== undefined ? JSON.stringify(options.body) : undefined,
		});

		if (res.status === 429 && attempt === 0) {
			const retryAfter = Number(res.headers.get("Retry-After") || "2");
			await new Promise((r) =>
				setTimeout(r, Math.min(retryAfter * 1000, 5000)),
			);
			continue;
		}

		const json = (await res.json().catch(() => ({}))) as Record<string, any>;
		if (!res.ok) {
			return {
				ok: false,
				status: res.status,
				error:
					json?.error?.message ||
					json?.message ||
					`Passionfroot API returned HTTP ${res.status}`,
			};
		}
		return {
			ok: true,
			status: res.status,
			data: (json?.data !== undefined ? json.data : json) as T,
		};
	}

	return { ok: false, status: 429, error: "Passionfroot rate limit exceeded" };
}

export async function listPassionfrootCollaborations(apiKey?: string) {
	return passionfrootFetch<PassionfrootCollaboration[]>(
		"/collaborations?limit=100",
		{ apiKey },
	);
}

export async function listPassionfrootPlacements(apiKey?: string) {
	return passionfrootFetch<PassionfrootPlacement[]>(
		"/placements?include=partner,collaboration&limit=100",
		{ apiKey },
	);
}

export async function listPassionfrootPartners(apiKey?: string) {
	return passionfrootFetch<PassionfrootPartner[]>("/partners?limit=100", {
		apiKey,
	});
}

export async function listPassionfrootConversations(apiKey?: string) {
	return passionfrootFetch<PassionfrootConversation[]>(
		"/conversations?limit=50",
		{ apiKey },
	);
}

export async function listPassionfrootMessages(
	conversationId: string,
	apiKey?: string,
) {
	return passionfrootFetch<PassionfrootMessage[]>(
		`/conversations/${encodeURIComponent(conversationId)}/messages?limit=50`,
		{ apiKey },
	);
}

export async function sendPassionfrootMessage(
	conversationId: string,
	text: string,
	apiKey?: string,
) {
	return passionfrootFetch<{
		id: string;
		conversationId: string;
		createdAt: string;
	}>(`/conversations/${encodeURIComponent(conversationId)}/messages`, {
		method: "POST",
		body: { text },
		idempotent: true,
		apiKey,
	});
}

export async function markPassionfrootConversationRead(
	conversationId: string,
	apiKey?: string,
) {
	return passionfrootFetch(
		`/conversations/${encodeURIComponent(conversationId)}/read`,
		{
			method: "POST",
			apiKey,
		},
	);
}

export async function acceptPassionfrootRequest(
	requestId: string,
	opts: {
		autoInvoice?: boolean;
		daysUntilInvoiceDue?: number;
		requestAssets?: boolean;
	} = { autoInvoice: true, daysUntilInvoiceDue: 30, requestAssets: true },
	apiKey?: string,
) {
	return passionfrootFetch(
		`/requests/${encodeURIComponent(requestId)}/accept`,
		{
			method: "POST",
			body: opts,
			apiKey,
		},
	);
}

export async function declinePassionfrootRequest(
	requestId: string,
	opts: { reason?: "timing" | "brand_fit" | "other"; comment: string },
	apiKey?: string,
) {
	return passionfrootFetch(
		`/requests/${encodeURIComponent(requestId)}/decline`,
		{
			method: "POST",
			body: {
				reason: opts.reason || "other",
				comment: opts.comment,
			},
			apiKey,
		},
	);
}

export async function acceptPassionfrootProposal(
	proposalId: string,
	apiKey?: string,
) {
	return passionfrootFetch(
		`/proposals/${encodeURIComponent(proposalId)}/accept`,
		{
			method: "POST",
			apiKey,
		},
	);
}

export async function rejectPassionfrootProposal(
	proposalId: string,
	apiKey?: string,
) {
	return passionfrootFetch(
		`/proposals/${encodeURIComponent(proposalId)}/reject`,
		{
			method: "POST",
			apiKey,
		},
	);
}

export async function counterPassionfrootProposal(
	proposalId: string,
	body: {
		placements: Array<{ productId: string; date: string }>;
		basePriceCents: number;
		packageId?: string;
		name?: string;
		comment?: string;
		autoInvoice?: boolean;
		daysUntilInvoiceDue?: number;
	},
	apiKey?: string,
) {
	return passionfrootFetch(
		`/proposals/${encodeURIComponent(proposalId)}/counter`,
		{
			method: "POST",
			body,
			idempotent: true,
			apiKey,
		},
	);
}
