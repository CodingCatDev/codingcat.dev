import { env } from "cloudflare:workers";
import type { APIRoute } from "astro";
import {
	acceptPassionfrootProposal,
	acceptPassionfrootRequest,
	declinePassionfrootRequest,
	hasPassionfrootApiKey,
	listPassionfrootCollaborations,
	listPassionfrootConversations,
	listPassionfrootMessages,
	listPassionfrootPartners,
	listPassionfrootPlacements,
	markPassionfrootConversationRead,
	type PassionfrootMessage,
	rejectPassionfrootProposal,
	sendPassionfrootMessage,
} from "@/lib/passionfroot";
import { getSanityServerClient } from "@/lib/sanity/write-client";
import { ensureSanityMediaTags } from "../portal/assets";

const CORS_HEADERS = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
	"Access-Control-Allow-Headers": "Content-Type, Authorization",
	"Content-Type": "application/json",
};

export const OPTIONS: APIRoute = async () => {
	return new Response(null, { status: 204, headers: CORS_HEADERS });
};

function mapPlatformToChannel(platform?: string | null): string {
	const p = (platform || "").toLowerCase();
	if (p.includes("short") || p.includes("tiktok") || p.includes("reel")) {
		return "youtube-short";
	}
	if (p.includes("youtube") || p.includes("podcast") || p.includes("video")) {
		return "youtube";
	}
	if (p.includes("x") || p.includes("twitter")) {
		return "x";
	}
	if (p.includes("linkedin")) {
		return "linkedin";
	}
	if (p.includes("newsletter") || p.includes("blog") || p.includes("article")) {
		return "blog";
	}
	return "shorts-network";
}

export const GET: APIRoute = async () => {
	return new Response(
		JSON.stringify({
			ok: true,
			configured: hasPassionfrootApiKey(),
			endpoint: "https://workspace.passionfroot.me/api/creators/v1",
		}),
		{ status: 200, headers: CORS_HEADERS },
	);
};

export const POST: APIRoute = async ({ request, url }) => {
	let body: Record<string, any> = {};
	try {
		body = (await request.json()) as Record<string, any>;
	} catch {
		return new Response(
			JSON.stringify({ ok: false, message: "Invalid JSON body" }),
			{ status: 400, headers: CORS_HEADERS },
		);
	}

	const action = String(body.action || "sync").trim();
	const apiKeyOverride =
		typeof body.apiKey === "string" && body.apiKey.trim()
			? body.apiKey.trim()
			: undefined;

	const { client, canWrite } = getSanityServerClient();
	const workerEnv = (env ?? {}) as unknown as Record<
		string,
		string | undefined
	>;
	const fallbackOrigin = url?.origin ?? new URL(request.url).origin;
	const siteUrl = (workerEnv.SITE_URL || fallbackOrigin).replace(/\/$/, "");

	if (action === "sync") {
		if (!hasPassionfrootApiKey(apiKeyOverride)) {
			return new Response(
				JSON.stringify({
					ok: false,
					configured: false,
					message:
						"PASSIONFROOT_API_KEY is not set yet. Add your Passionfroot Creator API key to Cloudflare secrets or paste it in the Ops App to sync.",
				}),
				{ status: 200, headers: CORS_HEADERS },
			);
		}

		const [collabsRes, placementsRes, partnersRes, convosRes] =
			await Promise.all([
				listPassionfrootCollaborations(apiKeyOverride),
				listPassionfrootPlacements(apiKeyOverride),
				listPassionfrootPartners(apiKeyOverride),
				listPassionfrootConversations(apiKeyOverride),
			]);

		if (!collabsRes.ok) {
			return new Response(
				JSON.stringify({
					ok: false,
					configured: true,
					message: collabsRes.error || "Failed to fetch Passionfroot data",
				}),
				{ status: 200, headers: CORS_HEADERS },
			);
		}

		const collaborations = Array.isArray(collabsRes.data)
			? collabsRes.data
			: [];
		const placements = Array.isArray(placementsRes.data)
			? placementsRes.data
			: [];
		const partners = Array.isArray(partnersRes.data) ? partnersRes.data : [];
		const conversations = Array.isArray(convosRes.data) ? convosRes.data : [];

		const partnerById = new Map(partners.map((p) => [p.id, p]));
		for (const pl of placements) {
			if (pl.partner && !partnerById.has(pl.partner.id)) {
				partnerById.set(pl.partner.id, pl.partner);
			}
		}

		let syncedLeadsCount = 0;
		let mirroredAttachmentsCount = 0;

		for (const collab of collaborations) {
			const partner = partnerById.get(collab.partnerId);
			const companyName =
				partner?.name || collab.name || "Passionfroot Partner";
			const convo = conversations.find(
				(c) =>
					c.collaborationId === collab.id || c.partnerId === collab.partnerId,
			);
			const collabPlacements = placements.filter(
				(p) => p.collaborationId === collab.id,
			);

			let messages: PassionfrootMessage[] = [];
			if (convo?.id) {
				const msgRes = await listPassionfrootMessages(convo.id, apiKeyOverride);
				if (msgRes.ok && Array.isArray(msgRes.data)) {
					messages = msgRes.data;
				}
			}

			let activeRequestId: string | undefined;
			let activeProposalId: string | undefined;
			let proposalStatus: string | undefined;
			let grossBudgetCents: number | undefined;
			let netPriceCents: number | undefined =
				collab.usdPriceCents ?? collab.priceCents ?? undefined;

			for (const m of messages) {
				if (m.request?.requestId && !activeRequestId) {
					activeRequestId = m.request.requestId;
					proposalStatus = m.request.status || proposalStatus;
					if (m.request.budgetCents) {
						grossBudgetCents = m.request.budgetCents;
					}
					if (m.request.priceCents && !netPriceCents) {
						netPriceCents = m.request.priceCents;
					}
				}
				if (m.proposal?.proposalId && !activeProposalId) {
					activeProposalId = m.proposal.proposalId;
					proposalStatus = m.proposal.status || proposalStatus;
					if (m.proposal.budgetCents) {
						grossBudgetCents = m.proposal.budgetCents;
					}
					if (m.proposal.priceCents && !netPriceCents) {
						netPriceCents = m.proposal.priceCents;
					}
				}
			}

			const portalToken = `spt_pf_${collab.id.replace(/[^a-zA-Z0-9]/g, "").slice(0, 16)}`;
			const leadId = `private.sponsorLead-${portalToken}`;
			const legacyLeadId = `sponsorLead-${portalToken}`;

			// Check existing doc so we don't re-upload already mirrored attachments
			const existingDoc = canWrite
				? await client.fetch<{
						sharedAssets?: Array<{
							_key?: string;
							title?: string;
							assetId?: string;
						}>;
					} | null>("*[_id in [$id, $legacyId]][0]{ sharedAssets }", {
						id: leadId,
						legacyId: legacyLeadId,
					})
				: null;
			const existingSharedAssets = Array.isArray(existingDoc?.sharedAssets)
				? [...existingDoc.sharedAssets]
				: [];

			// Auto-ingest Passionfroot message attachments before their 1-hour signed downloadUrl expires!
			if (canWrite) {
				for (const m of messages) {
					for (const att of m.attachments || []) {
						if (!att.downloadUrl || !att.fileName) {
							continue;
						}
						const alreadyMirrored = existingSharedAssets.some(
							(a) => a.title === att.fileName,
						);
						if (alreadyMirrored) {
							continue;
						}

						try {
							const fileRes = await fetch(att.downloadUrl);
							if (!fileRes.ok) {
								continue;
							}
							const buf = await fileRes.arrayBuffer();
							const isImg = (att.mimeType || "").startsWith("image/");
							const uploadedAsset = await client.assets.upload(
								isImg ? "image" : "file",
								new Uint8Array(buf) as unknown as Blob,
								{
									filename: att.fileName,
									contentType: att.mimeType || "application/octet-stream",
									title: `${companyName} - ${att.fileName}`,
								},
							);

							const tagRefs = await ensureSanityMediaTags(client, [
								"private-vault",
								"source:passionfroot",
								`partner:${companyName}`,
							]);
							if (tagRefs.length > 0) {
								await client
									.patch(uploadedAsset._id)
									.set({ "opt.media.tags": tagRefs })
									.commit()
									.catch(() => {});
							}

							existingSharedAssets.push({
								_key: `pf-att-${m.id.slice(0, 8)}-${existingSharedAssets.length}`,
								title: att.fileName,
								category: isImg ? "logo" : "brief",
								visibility: "private",
								uploadedBy: "passionfroot",
								uploadedAt: m.createdAt || new Date().toISOString(),
								assetId: uploadedAsset._id,
								mimeType: att.mimeType,
								fileSize: att.fileSize,
								externalUrl: `${siteUrl}/api/portal/assets?token=${encodeURIComponent(portalToken)}&assetId=${encodeURIComponent(uploadedAsset._id)}`,
							} as any);
							mirroredAttachmentsCount++;
						} catch {
							// Non-fatal if signed URL expired before sync
						}
					}
				}
			}

			const mappedStatus =
				collab.status === "confirmed"
					? "booked"
					: collab.status === "cancelled"
						? "replied"
						: "negotiating";

			const deliverables = collabPlacements.map((pl, idx) => ({
				_key: `pf-plc-${pl.id || idx}`,
				title: `${pl.name}${pl.postType ? ` (${pl.postType})` : ""}`,
				channel: mapPlatformToChannel(pl.platform),
				status:
					pl.status === "completed" || pl.url
						? "published"
						: pl.status === "confirmed"
							? "in-progress"
							: "pending",
				...(pl.url ? { url: pl.url } : {}),
				...(typeof pl.viewCount === "number" ? { views: pl.viewCount } : {}),
				...(pl.date ? { publishedAt: pl.date } : {}),
			}));

			const messageSummaries = messages.slice(0, 15).map((m, idx) => ({
				_key: `pf-msg-${m.id || idx}`,
				messageId: m.id,
				senderType: m.sender?.type || "partner",
				itemType: m.type || "text",
				text:
					m.text ||
					m.request?.comment ||
					m.proposal?.comment ||
					(m.request?.packageName
						? `Package Request: ${m.request.packageName}`
						: m.proposal?.packageName
							? `Proposal: ${m.proposal.packageName}`
							: ""),
				createdAt: m.createdAt,
				...(m.request?.requestId ? { requestId: m.request.requestId } : {}),
				...(m.proposal?.proposalId
					? { proposalId: m.proposal.proposalId }
					: {}),
			}));

			if (canWrite) {
				await client.createOrReplace({
					_id: leadId,
					_type: "sponsorLead",
					companyName,
					contactName: companyName,
					contactEmail: `passionfroot+${collab.partnerId}@codingcat.dev`,
					...(partner?.websiteUrl ? { website: partner.websiteUrl } : {}),
					portalToken,
					source: "passionfroot",
					billingProvider: "passionfroot",
					status: mappedStatus,
					rateCard: "podcast-showcase",
					totalAmountCents: grossBudgetCents || netPriceCents || 0,
					depositAmountCents: 0,
					balanceAmountCents: 0,
					intent: collab.name,
					deliverables,
					passionfrootPartnerId: collab.partnerId,
					passionfrootCollaborationId: collab.id,
					...(convo?.id ? { passionfrootConversationId: convo.id } : {}),
					...(activeRequestId
						? { passionfrootRequestId: activeRequestId }
						: {}),
					...(activeProposalId
						? { passionfrootProposalId: activeProposalId }
						: {}),
					...(proposalStatus
						? { passionfrootProposalStatus: proposalStatus }
						: {}),
					...(typeof netPriceCents === "number"
						? { passionfrootNetEarningsCents: netPriceCents }
						: {}),
					...(typeof grossBudgetCents === "number"
						? { passionfrootGrossBudgetCents: grossBudgetCents }
						: {}),
					passionfrootCurrency: collab.currency || "USD",
					passionfrootUnread: Boolean(convo?.unread),
					...(convo?.lastActivityAt
						? { passionfrootLastMessageAt: convo.lastActivityAt }
						: {}),
					passionfrootMessages: messageSummaries,
					sharedAssets: existingSharedAssets,
					lastEmailAt:
						convo?.lastActivityAt ||
						collab.statusUpdatedAt ||
						new Date().toISOString(),
				});
				syncedLeadsCount++;
			}
		}

		return new Response(
			JSON.stringify({
				ok: true,
				configured: true,
				syncedLeadsCount,
				mirroredAttachmentsCount,
				collaborationsCount: collaborations.length,
				placementsCount: placements.length,
			}),
			{ status: 200, headers: CORS_HEADERS },
		);
	}

	const leadId = String(body.leadId || "").trim();
	const requestId = String(body.requestId || "").trim();
	const proposalId = String(body.proposalId || "").trim();
	const conversationId = String(body.conversationId || "").trim();
	const portalToken = String(body.portalToken || "").trim();
	const companyName = String(body.companyName || "Partner").trim();

	if (action === "accept_request" && requestId) {
		const res = await acceptPassionfrootRequest(
			requestId,
			{
				autoInvoice: true,
				daysUntilInvoiceDue: 30,
				requestAssets: true,
			},
			apiKeyOverride,
		);
		if (!res.ok) {
			return new Response(JSON.stringify({ ok: false, message: res.error }), {
				status: 400,
				headers: CORS_HEADERS,
			});
		}
		if (canWrite && leadId) {
			await client
				.patch(leadId)
				.set({
					status: "booked",
					passionfrootProposalStatus: "accepted",
				})
				.commit()
				.catch(() => {});
		}
		return new Response(
			JSON.stringify({
				ok: true,
				action,
				requestId,
				status: "booked",
			}),
			{ status: 200, headers: CORS_HEADERS },
		);
	}

	if (action === "decline_request" && requestId) {
		const comment =
			String(body.comment || "").trim() ||
			"Thank you for reaching out! We do not have availability for this window right now.";
		const reason =
			body.reason === "timing" || body.reason === "brand_fit"
				? body.reason
				: "other";
		const res = await declinePassionfrootRequest(
			requestId,
			{ reason, comment },
			apiKeyOverride,
		);
		if (!res.ok) {
			return new Response(JSON.stringify({ ok: false, message: res.error }), {
				status: 400,
				headers: CORS_HEADERS,
			});
		}
		if (canWrite && leadId) {
			await client
				.patch(leadId)
				.set({
					status: "replied",
					passionfrootProposalStatus: "rejected",
				})
				.commit()
				.catch(() => {});
		}
		return new Response(JSON.stringify({ ok: true, action, requestId }), {
			status: 200,
			headers: CORS_HEADERS,
		});
	}

	if (action === "accept_proposal" && proposalId) {
		const res = await acceptPassionfrootProposal(proposalId, apiKeyOverride);
		if (!res.ok) {
			return new Response(JSON.stringify({ ok: false, message: res.error }), {
				status: 400,
				headers: CORS_HEADERS,
			});
		}
		if (canWrite && leadId) {
			await client
				.patch(leadId)
				.set({
					status: "booked",
					passionfrootProposalStatus: "accepted",
				})
				.commit()
				.catch(() => {});
		}
		return new Response(
			JSON.stringify({ ok: true, action, proposalId, status: "booked" }),
			{ status: 200, headers: CORS_HEADERS },
		);
	}

	if (action === "reject_proposal" && proposalId) {
		const res = await rejectPassionfrootProposal(proposalId, apiKeyOverride);
		if (!res.ok) {
			return new Response(JSON.stringify({ ok: false, message: res.error }), {
				status: 400,
				headers: CORS_HEADERS,
			});
		}
		if (canWrite && leadId) {
			await client
				.patch(leadId)
				.set({
					status: "replied",
					passionfrootProposalStatus: "rejected",
				})
				.commit()
				.catch(() => {});
		}
		return new Response(JSON.stringify({ ok: true, action, proposalId }), {
			status: 200,
			headers: CORS_HEADERS,
		});
	}

	if (
		(action === "send_message" || action === "send_portal_link") &&
		conversationId
	) {
		const dealRoomUrl = `${siteUrl}/portal/${portalToken || "demo"}?company=${encodeURIComponent(companyName)}#vault`;
		const messageText =
			action === "send_portal_link"
				? String(body.text || "").trim() ||
					`Excited to collaborate with ${companyName}! Since Passionfroot only locks the campaign date, please use your CodingCat.dev Deal Room & Studio Vault to pick your exact 15-min Google Meet kickoff or 45-min StreamYard recording slot on my calendar and drop any brand assets/briefs into our permanent vault: ${dealRoomUrl}`
				: String(body.text || "").trim();

		if (!messageText) {
			return new Response(
				JSON.stringify({ ok: false, message: "Message text is required" }),
				{ status: 400, headers: CORS_HEADERS },
			);
		}

		const res = await sendPassionfrootMessage(
			conversationId,
			messageText,
			apiKeyOverride,
		);
		if (!res.ok) {
			return new Response(JSON.stringify({ ok: false, message: res.error }), {
				status: 400,
				headers: CORS_HEADERS,
			});
		}

		await markPassionfrootConversationRead(
			conversationId,
			apiKeyOverride,
		).catch(() => {});

		if (canWrite && leadId) {
			await client
				.patch(leadId)
				.set({
					passionfrootUnread: false,
					lastEmailAt: new Date().toISOString(),
				})
				.commit()
				.catch(() => {});
		}

		return new Response(
			JSON.stringify({
				ok: true,
				action,
				conversationId,
				dealRoomUrl,
				sentMessage: res.data,
			}),
			{ status: 200, headers: CORS_HEADERS },
		);
	}

	return new Response(
		JSON.stringify({ ok: false, message: `Unsupported action: ${action}` }),
		{ status: 400, headers: CORS_HEADERS },
	);
};
