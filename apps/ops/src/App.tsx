import { useClient } from "@sanity/sdk-react";
import { useCallback, useEffect, useState } from "react";

type WorkspaceTab =
	| "schedule"
	| "crm"
	| "bookings"
	| "billing"
	| "syndication"
	| "drafts";

interface MasterCalendarEvent {
	id: string;
	calendarId: string;
	title: string;
	startAt: string;
	endAt: string;
	location?: string;
	htmlLink?: string;
	visibility?: string;
	status?: string;
}

interface DraftContentItem {
	_id: string;
	_type: "post" | "podcast" | "course" | "lesson";
	title?: string;
	slug?: string;
	_updatedAt?: string;
	_createdAt?: string;
	excerpt?: string;
	contentLen?: number;
	hasCover?: boolean;
	hasPublishedVersion?: boolean;
}

interface TrendSignalDoc {
	_id: string;
	title: string;
	slug?: string;
	source?: string;
	sourceUrl?: string;
	score?: number;
	status?: string;
	summary?: string;
	rawMetrics?: string;
	discoveredAt?: string;
	socialDrafts?: {
		x?: string;
		linkedin?: string;
		reddit?: string;
		dailydev?: string;
	};
}

interface DeliverableItem {
	_key?: string;
	title: string;
	channel: string;
	status: string;
	url?: string;
	views?: number;
}

interface SharedAssetItem {
	_key?: string;
	title?: string;
	category?: string;
	uploadedBy?: "partner" | "codingcat" | "passionfroot";
	source?: "direct" | "passionfroot";
	externalUrl?: string;
	fileUrl?: string;
	mimeType?: string;
	sizeBytes?: number;
	notes?: string;
	uploadedAt?: string;
}

interface PassionfrootMessageItem {
	_key?: string;
	messageId?: string;
	senderType?: string;
	senderName?: string;
	text?: string;
	createdAt?: string;
}

interface SponsorLeadDoc {
	_id: string;
	companyName: string;
	contactName?: string;
	contactEmail: string;
	website?: string;
	portalToken?: string;
	source?: string;
	billingProvider?: "stripe" | "passionfroot";
	status: string;
	rateCard?: string;
	totalAmountCents?: number;
	depositAmountCents?: number;
	balanceAmountCents?: number;
	depositPaidAt?: string;
	balancePaidAt?: string;
	stripeDepositCheckoutUrl?: string;
	stripeDepositInvoiceUrl?: string;
	stripeBalanceCheckoutUrl?: string;
	stripeBalanceInvoiceUrl?: string;
	passionfrootCollaborationId?: string;
	passionfrootRequestId?: string;
	passionfrootProposalId?: string;
	passionfrootPlacementId?: string;
	passionfrootConversationId?: string;
	passionfrootPartnerId?: string;
	passionfrootStatus?: string;
	passionfrootGrossBudgetCents?: number;
	passionfrootNetEarningsCents?: number;
	passionfrootCurrency?: string;
	passionfrootMessages?: PassionfrootMessageItem[];
	intent?: string;
	threadId?: string;
	notes?: string;
	deliverables?: DeliverableItem[];
	sharedAssets?: SharedAssetItem[];
}

interface BookingDoc {
	_id: string;
	_createdAt?: string;
	guestName: string;
	guestEmail: string;
	company?: string;
	socialUrl?: string;
	track?: string;
	bookingSource?: "direct" | "passionfroot";
	sessionType?: "recording" | "pre_meeting";
	status?: string;
	slotStartAt?: string;
	recordingUrl?: string;
	preMeetingStatus?: "none" | "requested" | "scheduled" | "completed" | "bypassed";
	preMeetingSlotStartAt?: string;
	preMeetingGoogleEventId?: string;
	preMeetingMeetUrl?: string;
	topics?: string;
	appointmentScheduleUrl?: string;
	googleCalendarEventId?: string;
	passionfrootCollaborationId?: string;
	passionfrootPlacementId?: string;
	passionfrootConversationId?: string;
	signatureMode?: "draw" | "type";
	signatureData?: string;
	signedAt?: string;
	portalToken?: string;
	sharedAssets?: SharedAssetItem[];
}

interface SyndicatedContentItem {
	_id: string;
	_type: "post" | "podcast";
	title: string;
	slug: string;
	date: string;
	youtube?: string | null;
	dailydev?: string | null;
	devto?: string | null;
	hashnode?: string | null;
	awsbuilder?: string | null;
	medium?: string | null;
	reddit?: string | null;
}

const RATE_CARD_TIERS: Record<
	string,
	{ label: string; totalCents: number; depositCents: number }
> = {
	"full-stack-launch": {
		label: "Full-Stack Launch Bundle ($3,500)",
		totalCents: 350000,
		depositCents: 175000,
	},
	"podcast-showcase": {
		label: "Sponsored Podcast & Showcase ($2,000)",
		totalCents: 200000,
		depositCents: 100000,
	},
	"dedicated-video": {
		label: "Dedicated YouTube Video ($2,500)",
		totalCents: 250000,
		depositCents: 125000,
	},
	"mid-roll-ad": {
		label: "Integrated 60s Mid-Roll Ad ($1,800)",
		totalCents: 180000,
		depositCents: 90000,
	},
	"ecosystem-integration": {
		label: "Ecosystem Integration ($950)",
		totalCents: 95000,
		depositCents: 47500,
	},
};

const LEAD_STATUS_OPTIONS = [
	{ value: "new", label: "New Inquiry" },
	{ value: "contacted", label: "Contacted" },
	{ value: "replied", label: "Reply Draft Ready / Replied" },
	{ value: "negotiating", label: "Negotiating" },
	{ value: "deposit_sent", label: "50% Deposit Sent" },
	{ value: "deposit_paid", label: "50% Deposit Paid" },
	{ value: "booked", label: "Booked / In Production" },
	{ value: "balance_sent", label: "Final 50% Balance Sent" },
	{ value: "paid", label: "Paid in Full (100% — Archive)" },
	{ value: "cancelled", label: "Cancelled / Declined (Archive)" },
	{ value: "archived", label: "Archived / Completed" },
];

const BOOKING_STATUS_OPTIONS = [
	{ value: "pending", label: "Pending Review (Hold)" },
	{ value: "approved", label: "Approved" },
	{ value: "scheduled", label: "Confirmed on Calendar" },
	{ value: "recorded", label: "Recorded" },
	{ value: "published", label: "Published (Archive)" },
	{ value: "cancelled", label: "Declined / Cancelled (Archive)" },
];

function isArchivedLeadStatus(status?: string): boolean {
	return (
		status === "paid" || status === "cancelled" || status === "archived"
	);
}

function isArchivedBookingStatus(status?: string): boolean {
	return status === "published" || status === "cancelled";
}

function formatUsd(cents?: number): string {
	if (!cents && cents !== 0) return "$0";
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		maximumFractionDigits: 0,
	}).format(cents / 100);
}

function formatDateTime(iso?: string): string {
	if (!iso) return "Unscheduled";
	try {
		return new Date(iso).toLocaleString("en-US", {
			weekday: "short",
			month: "short",
			day: "numeric",
			hour: "numeric",
			minute: "2-digit",
		});
	} catch {
		return iso;
	}
}

export function App() {
	const projectId = process.env.SANITY_APP_PROJECT_ID || "hfh83o0w";
	const dataset = process.env.SANITY_APP_DATASET || "production";
	const isDev = dataset === "dev";
	const envLabel = isDev ? "Dev" : "Production";
	const siteOrigin = isDev
		? "https://dev.codingcat.dev"
		: "https://codingcat.dev";

	const client = useClient({ apiVersion: "2025-09-30" });

	const [activeTab, setActiveTab] = useState<WorkspaceTab>("schedule");
	const [loading, setLoading] = useState(true);
	const [statusBanner, setStatusBanner] = useState<string | null>(null);
	const [copiedId, setCopiedId] = useState<string | null>(null);
	const [showArchivedLeads, setShowArchivedLeads] = useState(false);
	const [showArchivedBookings, setShowArchivedBookings] = useState(false);
	const [masterCalendarEvents, setMasterCalendarEvents] = useState<
		MasterCalendarEvent[]
	>([]);
	const [sendingDigest, setSendingDigest] = useState(false);

	// Data states loaded via authenticated Sanity SDK client
	const [leads, setLeads] = useState<SponsorLeadDoc[]>([]);
	const [bookings, setBookings] = useState<BookingDoc[]>([]);
	const [syndicatedContent, setSyndicatedContent] = useState<
		SyndicatedContentItem[]
	>([]);
	const [syndicationDocCount, setSyndicationDocCount] = useState<number>(0);
	const [syndicationFilter, setSyndicationFilter] = useState<
		"all" | "missing" | "youtube"
	>("all");
	const [draftItems, setDraftItems] = useState<DraftContentItem[]>([]);
	const [trendSignals, setTrendSignals] = useState<TrendSignalDoc[]>([]);
	const [expandedTrendId, setExpandedTrendId] = useState<string | null>(null);

	// Outbound scraper state
	const [discovering, setDiscovering] = useState(false);
	const [discoveredProspects, setDiscoveredProspects] = useState<Array<any>>(
		[],
	);

	// New Sponsor Lead modal/inline form state
	const [showNewLeadForm, setShowNewLeadForm] = useState(false);
	const [newCompany, setNewCompany] = useState("");
	const [newContactName, setNewContactName] = useState("");
	const [newContactEmail, setNewContactEmail] = useState("");
	const [newRateCard, setNewRateCard] = useState("full-stack-launch");
	const [newIntent, setNewIntent] = useState("");

	// Expanded signature / booking details
	const [expandedBookingId, setExpandedBookingId] = useState<string | null>(
		null,
	);
	const [expandedLeadId, setExpandedLeadId] = useState<string | null>(null);
	const [expandedCrmLeadId, setExpandedCrmLeadId] = useState<string | null>(
		null,
	);

	// Source Filters & Passionfroot API integration state
	const [leadSourceFilter, setLeadSourceFilter] = useState<
		"all" | "passionfroot" | "direct" | "inbound"
	>("all");
	const [bookingSourceFilter, setBookingSourceFilter] = useState<
		"all" | "passionfroot" | "direct"
	>("all");
	const [syncingPassionfroot, setSyncingPassionfroot] = useState(false);
	const [showPassionfrootConfig, setShowPassionfrootConfig] = useState(false);
	const [passionfrootApiKey, setPassionfrootApiKey] = useState<string>(() => {
		try {
			return localStorage.getItem("codingcat_pf_api_key") || "";
		} catch {
			return "";
		}
	});
	const [pfChatInput, setPfChatInput] = useState<Record<string, string>>({});
	const [vaultTitleInput, setVaultTitleInput] = useState<Record<string, string>>(
		{},
	);
	const [vaultUrlInput, setVaultUrlInput] = useState<Record<string, string>>(
		{},
	);
	const [busyActionId, setBusyActionId] = useState<string | null>(null);

	const showFlash = useCallback((msg: string) => {
		setStatusBanner(msg);
		setTimeout(() => {
			setStatusBanner((prev) => (prev === msg ? null : prev));
		}, 4000);
	}, []);

	const fetchAllData = useCallback(async () => {
		setLoading(true);
		try {
			const res = await client.fetch<{
				leads: SponsorLeadDoc[];
				bookings: BookingDoc[];
				syndicatedContent: SyndicatedContentItem[];
				syndicationDocCount: number;
				draftItems: DraftContentItem[];
				trendSignals: TrendSignalDoc[];
			}>(
				`{
				"leads": *[_type == "sponsorLead" && !(_id in path("drafts.**"))] | order(coalesce(lastEmailAt, _updatedAt, _createdAt) desc),
				"bookings": *[_type == "booking" && !(_id in path("drafts.**"))] | order(coalesce(slotStartAt, _createdAt) desc),
				"syndicatedContent": *[_type in ["post", "podcast"] && !(_id in path("drafts.**"))] | order(coalesce(date, _createdAt) desc)[0...50] {
					_id,
					_type,
					title,
					"slug": slug.current,
					"date": coalesce(date, _createdAt),
					youtube,
					dailydev,
					devto,
					hashnode,
					awsbuilder,
					medium,
					reddit
				},
				"syndicationDocCount": count(*[_type == "syndication"]),
				"draftItems": *[_type in ["post", "podcast", "course", "lesson"] && _id in path("drafts.**")] | order(_updatedAt desc) {
					_id,
					_type,
					title,
					"slug": slug.current,
					_updatedAt,
					_createdAt,
					excerpt,
					"contentLen": count(content),
					"hasCover": defined(coverImage.asset)
				},
				"trendSignals": *[_type == "trendSignal"] | order(coalesce(discoveredAt, _createdAt) desc)[0...40] {
					_id,
					title,
					"slug": slug.current,
					source,
					sourceUrl,
					score,
					status,
					summary,
					rawMetrics,
					discoveredAt,
					socialDrafts
				}
			}`,
				{},
				{ perspective: "raw" },
			);

			if (res) {
				setLeads(res.leads || []);
				setBookings(res.bookings || []);
				setSyndicatedContent(res.syndicatedContent || []);
				setSyndicationDocCount(res.syndicationDocCount || 0);
				setDraftItems(res.draftItems || []);
				setTrendSignals(res.trendSignals || []);
			}

			try {
				const calRes = await fetch(`${siteOrigin}/api/ops/daily-digest`);
				if (calRes.ok) {
					const calData = await calRes.json();
					if (Array.isArray(calData.calendarEvents)) {
						setMasterCalendarEvents(calData.calendarEvents);
					}
				}
			} catch {
				// Ignore calendar digest fetch errors
			}
		} catch (err: any) {
			console.error("Failed to fetch Ops data:", err);
		} finally {
			setLoading(false);
		}
	}, [client, siteOrigin]);

	useEffect(() => {
		fetchAllData();
	}, [fetchAllData]);

	const handleCopy = (text: string, id: string) => {
		navigator.clipboard.writeText(text);
		setCopiedId(id);
		setTimeout(() => setCopiedId(null), 2000);
	};

	const handleUpdateLeadStatus = async (leadId: string, newStatus: string) => {
		try {
			const patchData: Record<string, any> = { status: newStatus };
			if (newStatus === "deposit_paid") {
				patchData.depositPaidAt = new Date().toISOString();
			} else if (newStatus === "paid") {
				patchData.balancePaidAt = new Date().toISOString();
			}
			await client.patch(leadId).set(patchData).commit();
			setLeads((prev) =>
				prev.map((l) => (l._id === leadId ? { ...l, ...patchData } : l)),
			);
			showFlash(`Updated deal status to "${newStatus}"`);
		} catch (err: any) {
			showFlash(`Error updating deal: ${err?.message || "Unknown error"}`);
		}
	};

	const handleCreateLead = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!newCompany.trim() || !newContactEmail.trim()) return;
		const slugToken = `spt_${newCompany
			.toLowerCase()
			.replace(/[^a-z0-9]/g, "")
			.slice(0, 12)}_${Math.random().toString(36).slice(2, 6)}`;
		const tier =
			RATE_CARD_TIERS[newRateCard] || RATE_CARD_TIERS["full-stack-launch"];
		const docId = `sponsorLead-${slugToken}`;

		const newDoc: SponsorLeadDoc & { _type: "sponsorLead" } = {
			_id: docId,
			_type: "sponsorLead",
			companyName: newCompany.trim(),
			contactName: newContactName.trim() || newCompany.trim(),
			contactEmail: newContactEmail.trim(),
			portalToken: slugToken,
			source: "inbound",
			status: "new",
			rateCard: newRateCard,
			totalAmountCents: tier.totalCents,
			depositAmountCents: tier.depositCents,
			balanceAmountCents: tier.totalCents - tier.depositCents,
			intent: newIntent.trim() || tier.label,
			deliverables: [
				{
					_key: "deliv-0",
					channel: "youtube",
					status: "pending",
					title: "YouTube Video / Sponsorship Integration",
				},
				{
					_key: "deliv-1",
					channel: "shorts-network",
					status: "pending",
					title: "Vertical Shorts across 7 Platforms",
				},
				{
					_key: "deliv-2",
					channel: "blog",
					status: "pending",
					title: "Canonical SEO & AEO Article on CodingCat.dev",
				},
			],
		};

		try {
			await client.createOrReplace(newDoc);
			setLeads((prev) => [newDoc, ...prev]);
			setShowNewLeadForm(false);
			setNewCompany("");
			setNewContactName("");
			setNewContactEmail("");
			setNewIntent("");
			showFlash(
				`Created Deal Room for ${newDoc.companyName}: ${siteOrigin}/portal/${slugToken}`,
			);
		} catch (err: any) {
			showFlash(`Failed to create lead: ${err?.message || "Unknown error"}`);
		}
	};

	const handleUpdateBookingStatus = async (
		bookingId: string,
		newStatus: string,
	) => {
		try {
			await client.patch(bookingId).set({ status: newStatus }).commit();
			setBookings((prev) =>
				prev.map((b) =>
					b._id === bookingId ? { ...b, status: newStatus } : b,
				),
			);
			if (newStatus === "approved" || newStatus === "scheduled") {
				await handleBookingManage(bookingId, "approve_recording");
			} else if (newStatus === "cancelled") {
				await handleBookingManage(bookingId, "cancel_booking");
			} else {
				showFlash(`Updated booking status to "${newStatus}"`);
			}
		} catch (err: any) {
			showFlash(`Error updating booking: ${err?.message || "Unknown error"}`);
		}
	};

	const handleBookingManage = async (
		bookingId: string,
		action:
			| "approve_recording"
			| "cancel_booking"
			| "request_pre_meeting"
			| "bypass_pre_meeting",
	) => {
		setBusyActionId(`${bookingId}:${action}`);
		try {
			const res = await fetch(`${siteOrigin}/api/book/manage`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ bookingId, action }),
			});
			const data = await res.json();
			if (!res.ok) {
				throw new Error(data.error || "Failed to update booking");
			}
			await fetchAllData();
			if (action === "approve_recording") {
				showFlash(
					`Approved recording, synced private block to alex.patterson@sanity.io, and sent StreamYard link (${data.recordingUrl || "https://streamyard.com/c4kv26is93"}) to guest.`,
				);
			} else if (action === "cancel_booking") {
				showFlash(
					"Cancelled booking, archived record, and removed calendar blocks from alex@codingcat.dev and alex.patterson@sanity.io.",
				);
			} else if (action === "request_pre_meeting") {
				showFlash(
					"Flagged booking for a 15-minute Google Meet pre-meeting.",
				);
			} else {
				showFlash("Bypassed 15-minute pre-meeting.");
			}
		} catch (err: any) {
			showFlash(`Booking action error: ${err?.message || "Unknown error"}`);
		} finally {
			setBusyActionId(null);
		}
	};

	const handleSendDailyDigestEmail = async () => {
		setSendingDigest(true);
		try {
			const res = await fetch(`${siteOrigin}/api/ops/daily-digest`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ sendEmail: true, to: "alex@codingcat.dev" }),
			});
			const data = await res.json();
			if (!res.ok) {
				throw new Error(data.message || "Failed to send digest email");
			}
			showFlash(
				`Sent Today's Action Digest email to alex@codingcat.dev (${data.summary?.pendingHoldsCount || 0} holds, ${data.summary?.upcoming72hCount || 0} upcoming recordings, ${data.summary?.actionLeadsCount || 0} deals).`,
			);
		} catch (err: any) {
			showFlash(`Digest Email Error: ${err?.message || "Unknown error"}`);
		} finally {
			setSendingDigest(false);
		}
	};

	const handleSyncPassionfroot = async () => {
		setSyncingPassionfroot(true);
		try {
			const res = await fetch(`${siteOrigin}/api/ops/passionfroot`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					action: "sync",
					apiKey: passionfrootApiKey.trim() || undefined,
				}),
			});
			const data = await res.json();
			if (!res.ok) {
				throw new Error(data.error || "Passionfroot sync failed");
			}
			await fetchAllData();
			showFlash(
				`Synced Passionfroot Workspace (${data.creatorName || "CodingCat.dev"}): ${data.syncedLeadsCount || 0} collaborations, ${data.syncedBookingsCount || 0} placements, ${data.ingestedAttachmentsCount || 0} Media Library assets mirrored.`,
			);
		} catch (err: any) {
			showFlash(`Passionfroot Sync: ${err?.message || "Unknown error"}`);
		} finally {
			setSyncingPassionfroot(false);
		}
	};

	const handlePassionfrootAction = async (
		lead: SponsorLeadDoc,
		action:
			| "accept_request"
			| "decline_request"
			| "accept_proposal"
			| "send_portal_link"
			| "send_message",
		extra?: Record<string, any>,
	) => {
		const token =
			lead.portalToken || lead._id.replace(/^sponsorLead-/, "");
		setBusyActionId(`${lead._id}:${action}`);
		try {
			const res = await fetch(`${siteOrigin}/api/ops/passionfroot`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					action,
					apiKey: passionfrootApiKey.trim() || undefined,
					leadId: lead._id,
					portalToken: token,
					requestId: lead.passionfrootRequestId,
					proposalId: lead.passionfrootProposalId,
					conversationId: lead.passionfrootConversationId,
					partnerId: lead.passionfrootPartnerId,
					autoInvoice: true,
					requestAssets: true,
					...extra,
				}),
			});
			const data = await res.json();
			if (!res.ok) {
				throw new Error(data.error || "Passionfroot action failed");
			}
			await fetchAllData();
			showFlash(
				`Passionfroot action "${action}" completed for ${lead.companyName}.`,
			);
		} catch (err: any) {
			showFlash(`Passionfroot Action Error: ${err?.message || "Unknown error"}`);
		} finally {
			setBusyActionId(null);
		}
	};

	const handleAddSharedAssetLink = async (
		docId: string,
		token: string,
		sourceType: "direct" | "passionfroot",
	) => {
		const title = (vaultTitleInput[docId] || "").trim();
		const externalUrl = (vaultUrlInput[docId] || "").trim();
		if (!title && !externalUrl) return;
		setBusyActionId(`${docId}:vault`);
		try {
			const formData = new FormData();
			formData.set("token", token);
			formData.set("title", title || externalUrl);
			formData.set("category", "script_brief");
			formData.set("uploadedBy", "codingcat");
			formData.set("source", sourceType);
			if (externalUrl) formData.set("externalUrl", externalUrl);

			const res = await fetch(`${siteOrigin}/api/portal/assets`, {
				method: "POST",
				body: formData,
			});
			const data = await res.json();
			if (!res.ok) {
				throw new Error(data.error || "Failed to add asset to vault");
			}
			setVaultTitleInput((prev) => ({ ...prev, [docId]: "" }));
			setVaultUrlInput((prev) => ({ ...prev, [docId]: "" }));
			await fetchAllData();
			showFlash("Added item to Sanity Media Library 2-Way Asset Vault (#vault).");
		} catch (err: any) {
			showFlash(`Vault Error: ${err?.message || "Unknown error"}`);
		} finally {
			setBusyActionId(null);
		}
	};

	const activeLeadsCount = leads.filter(
		(l) => !isArchivedLeadStatus(l.status),
	).length;
	const archivedLeadsCount = leads.filter((l) =>
		isArchivedLeadStatus(l.status),
	).length;
	const activeBookingsCount = bookings.filter(
		(b) => !isArchivedBookingStatus(b.status),
	).length;
	const archivedBookingsCount = bookings.filter((b) =>
		isArchivedBookingStatus(b.status),
	).length;

	const filteredLeads = leads.filter((l) => {
		const isArch = isArchivedLeadStatus(l.status);
		if (showArchivedLeads ? !isArch : isArch) return false;

		const isPf =
			l.source === "passionfroot" ||
			l.billingProvider === "passionfroot" ||
			Boolean(l.passionfrootCollaborationId);
		const isDirect = l.source === "booking";
		if (leadSourceFilter === "passionfroot") return isPf;
		if (leadSourceFilter === "direct") return isDirect;
		if (leadSourceFilter === "inbound") return !isPf && !isDirect;
		return true;
	});

	const filteredBookings = bookings.filter((b) => {
		const isArch = isArchivedBookingStatus(b.status);
		if (showArchivedBookings ? !isArch : isArch) return false;

		const isPf =
			b.bookingSource === "passionfroot" ||
			Boolean(b.passionfrootCollaborationId);
		if (bookingSourceFilter === "passionfroot") return isPf;
		if (bookingSourceFilter === "direct") return !isPf;
		return true;
	});

	const handleConvertBookingToDeal = async (b: BookingDoc) => {
		const slugToken =
			b.portalToken ||
			`spt_${(b.company || b.guestName)
				.toLowerCase()
				.replace(/[^a-z0-9]/g, "")
				.slice(0, 12)}`;
		const docId = `sponsorLead-${slugToken}`;
		const newDoc: SponsorLeadDoc & { _type: "sponsorLead" } = {
			_id: docId,
			_type: "sponsorLead",
			companyName: b.company || b.guestName,
			contactName: b.guestName,
			contactEmail: b.guestEmail,
			portalToken: slugToken,
			source: "booking",
			status: "negotiating",
			rateCard: "podcast-showcase",
			totalAmountCents: 200000,
			depositAmountCents: 100000,
			balanceAmountCents: 100000,
			intent: b.topics || "Sponsored Podcast & Multi-Channel Showcase",
		};
		try {
			await client.createOrReplace(newDoc);
			await client
				.patch(b._id)
				.set({ portalToken: slugToken, track: "sponsored" })
				.commit();
			await fetchAllData();
			setActiveTab("billing");
			showFlash(
				`Created Sponsor Deal Room for ${b.company || b.guestName} (${siteOrigin}/portal/${slugToken})`,
			);
		} catch (err: any) {
			showFlash(`Error creating deal room: ${err?.message || "Unknown error"}`);
		}
	};

	const handleDiscoverOutbound = async () => {
		setDiscovering(true);
		try {
			const res = await fetch(`${siteOrigin}/api/sponsors/outbound`);
			if (res.ok) {
				const data = await res.json();
				setDiscoveredProspects(data.prospects || []);
			}
		} catch {
			// Ignore network errors
		} finally {
			setDiscovering(false);
		}
	};

	const handleDeleteDraft = async (draftId: string, title?: string) => {
		try {
			await client.delete(draftId);
			setDraftItems((prev) => prev.filter((d) => d._id !== draftId));
			showFlash(`Deleted draft "${title || draftId}"`);
		} catch (err: any) {
			showFlash(`Error deleting draft: ${err?.message || "Unknown error"}`);
		}
	};

	const handleUpdateTrendStatus = async (
		trendId: string,
		newStatus: string,
	) => {
		try {
			await client.patch(trendId).set({ status: newStatus }).commit();
			setTrendSignals((prev) =>
				prev.map((t) =>
					t._id === trendId ? { ...t, status: newStatus } : t,
				),
			);
			showFlash(`Updated trend status to "${newStatus}"`);
		} catch (err: any) {
			showFlash(`Error updating trend: ${err?.message || "Unknown error"}`);
		}
	};

	const handleDeleteTrend = async (trendId: string) => {
		try {
			await client.delete(trendId);
			setTrendSignals((prev) => prev.filter((t) => t._id !== trendId));
			showFlash("Removed trend signal from radar");
		} catch (err: any) {
			showFlash(`Error deleting trend: ${err?.message || "Unknown error"}`);
		}
	};

	const filteredSyndications = syndicatedContent.filter((item) => {
		if (syndicationFilter === "youtube") return Boolean(item.youtube);
		if (syndicationFilter === "missing") {
			return !item.dailydev || !item.devto || !item.hashnode || !item.reddit;
		}
		return true;
	});

	const btnStyle: React.CSSProperties = {
		padding: "6px 10px",
		borderRadius: 6,
		border: "1px solid #d1d5db",
		background: "#fff",
		color: "#111827",
		fontSize: 12,
		fontWeight: 600,
		cursor: "pointer",
		textDecoration: "none",
		display: "inline-flex",
		alignItems: "center",
		gap: 4,
		whiteSpace: "nowrap",
	};

	const primaryBtnStyle: React.CSSProperties = {
		...btnStyle,
		background: "#4B2E83",
		borderColor: "#4B2E83",
		color: "#fff",
	};

	return (
		<div
			style={{
				padding: 24,
				fontFamily: "system-ui, -apple-system, sans-serif",
				maxWidth: 1320,
				margin: "0 auto",
				color: "#111827",
			}}
		>
			{statusBanner && (
				<div
					style={{
						marginBottom: 16,
						padding: "10px 16px",
						borderRadius: 8,
						background: "#ecfdf5",
						border: "1px solid #10b981",
						color: "#065f46",
						fontWeight: 600,
						fontSize: 13,
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
					}}
				>
					<span>✓ {statusBanner}</span>
					<button
						type="button"
						onClick={() => setStatusBanner(null)}
						style={{
							background: "transparent",
							border: "none",
							cursor: "pointer",
							fontWeight: 700,
							color: "#065f46",
						}}
					>
						✕
					</button>
				</div>
			)}

			<header
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					flexWrap: "wrap",
					gap: 16,
					marginBottom: 24,
					borderBottom: "1px solid #e5e7eb",
					paddingBottom: 16,
				}}
			>
				<div>
					<h1 style={{ margin: 0, fontSize: 26, fontWeight: 800 }}>
						CodingCat.dev Revenue &amp; Booking OS ({envLabel})
					</h1>
					<p style={{ margin: "4px 0 0", color: "#4b5563", fontSize: 13 }}>
						Project <code>{projectId}</code> · Dataset <code>{dataset}</code> ·{" "}
						<a
							href={`${siteOrigin}/sponsorships`}
							target="_blank"
							rel="noreferrer"
							style={{ color: "#4B2E83", fontWeight: 600 }}
						>
							Sponsorships Page ↗
						</a>{" "}
						·{" "}
						<a
							href={`${siteOrigin}/book`}
							target="_blank"
							rel="noreferrer"
							style={{ color: "#4B2E83", fontWeight: 600 }}
						>
							Booking Page ↗
						</a>
					</p>
				</div>

				<div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
					<button
						type="button"
						onClick={() => setActiveTab("schedule")}
						style={{
							padding: "8px 14px",
							borderRadius: 8,
							border: "1px solid #d1d5db",
							background: activeTab === "schedule" ? "#111827" : "#fff",
							color: activeTab === "schedule" ? "#fff" : "#111827",
							fontWeight: 700,
							cursor: "pointer",
							fontSize: 13,
						}}
					>
						0. 📅 Schedule &amp; Today
					</button>
					<button
						type="button"
						onClick={() => setActiveTab("crm")}
						style={{
							padding: "8px 14px",
							borderRadius: 8,
							border: "1px solid #d1d5db",
							background: activeTab === "crm" ? "#111827" : "#fff",
							color: activeTab === "crm" ? "#fff" : "#111827",
							fontWeight: 600,
							cursor: "pointer",
							fontSize: 13,
						}}
					>
						1. Sponsor CRM (
						{leads.filter((l) => !isArchivedLeadStatus(l.status)).length} Active)
					</button>
					<button
						type="button"
						onClick={() => setActiveTab("bookings")}
						style={{
							padding: "8px 14px",
							borderRadius: 8,
							border: "1px solid #d1d5db",
							background: activeTab === "bookings" ? "#111827" : "#fff",
							color: activeTab === "bookings" ? "#fff" : "#111827",
							fontWeight: 600,
							cursor: "pointer",
							fontSize: 13,
						}}
					>
						2. Podcast Bookings (
						{bookings.filter((b) => !isArchivedBookingStatus(b.status)).length}{" "}
						Active)
					</button>
					<button
						type="button"
						onClick={() => setActiveTab("billing")}
						style={{
							padding: "8px 14px",
							borderRadius: 8,
							border: "1px solid #d1d5db",
							background: activeTab === "billing" ? "#111827" : "#fff",
							color: activeTab === "billing" ? "#fff" : "#111827",
							fontWeight: 600,
							cursor: "pointer",
							fontSize: 13,
						}}
					>
						3. Deal Rooms &amp; 50/50 Billing (
						{leads.filter((l) => !isArchivedLeadStatus(l.status)).length})
					</button>
					<button
						type="button"
						onClick={() => setActiveTab("syndication")}
						style={{
							padding: "8px 14px",
							borderRadius: 8,
							border: "1px solid #d1d5db",
							background: activeTab === "syndication" ? "#111827" : "#fff",
							color: activeTab === "syndication" ? "#fff" : "#111827",
							fontWeight: 600,
							cursor: "pointer",
							fontSize: 13,
						}}
					>
						4. Content Syndication ({syndicatedContent.length} Posts)
					</button>
					<button
						type="button"
						onClick={() => setActiveTab("drafts")}
						style={{
							padding: "8px 14px",
							borderRadius: 8,
							border: "1px solid #d1d5db",
							background: activeTab === "drafts" ? "#111827" : "#fff",
							color: activeTab === "drafts" ? "#fff" : "#111827",
							fontWeight: 600,
							cursor: "pointer",
							fontSize: 13,
						}}
					>
						5. Drafts &amp; Trend Review ({draftItems.length} Drafts /{" "}
						{trendSignals.length} Trends)
					</button>
					<button
						type="button"
						onClick={handleSendDailyDigestEmail}
						disabled={sendingDailyDigest}
						style={{
							...btnStyle,
							padding: "8px 12px",
							background: "#eff6ff",
							borderColor: "#3b82f6",
							color: "#1d4ed8",
							fontWeight: 700,
						}}
						title="Email Today's Action Queue & Ongoing Schedule to alex@codingcat.dev"
					>
						{sendingDailyDigest
							? "📧 Sending Digest..."
							: "📧 Email Today's Digest"}
					</button>
					<button
						type="button"
						onClick={fetchAllData}
						style={{
							...btnStyle,
							padding: "8px 12px",
						}}
						title="Refresh from Sanity"
					>
						↻ Refresh
					</button>
				</div>
			</header>

			{loading && (
				<div style={{ padding: 24, color: "#6b7280", fontSize: 14 }}>
					Loading live Sanity documents...
				</div>
			)}

			{/* TAB 0: UNIFIED SCHEDULE & TODAY'S ACTION QUEUE */}
			{!loading && activeTab === "schedule" && (
				<div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
					<section
						style={{
							padding: 20,
							border: "1px solid #e5e7eb",
							borderRadius: 12,
							background: "#fff",
						}}
					>
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								flexWrap: "wrap",
								gap: 12,
								marginBottom: 16,
							}}
						>
							<div>
								<h2 style={{ margin: 0, fontSize: 18 }}>
									⚡ Today&apos;s Action Queue &amp; Master Ongoing Schedule
								</h2>
								<p style={{ margin: "4px 0 0", color: "#4b5563", fontSize: 13 }}>
									Unified view across <code>alex@codingcat.dev</code>,{" "}
									<code>alex.patterson@sanity.io</code> (private blocks),{" "}
									<strong>Podcast Bookings</strong>, and{" "}
									<strong>Active Sponsor Deals</strong>. Paid in Full (100%) and
									Cancelled items are automatically archived.
								</p>
							</div>
							<div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
								<button
									type="button"
									onClick={handleSendDailyDigestEmail}
									disabled={sendingDailyDigest}
									style={{
										...btnStyle,
										background: "#1d4ed8",
										borderColor: "#1d4ed8",
										color: "#fff",
										fontWeight: 700,
									}}
								>
									{sendingDailyDigest
										? "📧 Sending Digest to alex@codingcat.dev..."
										: "📧 Email Today's Action Digest Now"}
								</button>
								<button
									type="button"
									onClick={handleSyncPassionfroot}
									disabled={syncingPassionfroot}
									style={{
										...btnStyle,
										background: "#ecfdf5",
										borderColor: "#10b981",
										color: "#065f46",
										fontWeight: 700,
									}}
								>
									{syncingPassionfroot
										? "🌱 Syncing PF..."
										: "🌱 Sync Passionfroot"}
								</button>
							</div>
						</div>

						<div
							style={{
								display: "grid",
								gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
								gap: 16,
								marginBottom: 24,
							}}
						>
							{/* Action Card 1: Unapproved Holds */}
							<div
								style={{
									padding: 16,
									borderRadius: 10,
									border: "1px solid #fde68a",
									background: "#fffbeb",
								}}
							>
								<h3 style={{ margin: "0 0 8px", fontSize: 15, color: "#92400e" }}>
									⏳ Unapproved Recording Holds (
									{
										bookings.filter(
											(b) =>
												b.status === "pending" &&
												!isArchivedBookingStatus(b.status),
										).length
									}
									)
								</h3>
								<p style={{ margin: "0 0 12px", fontSize: 12, color: "#78350f" }}>
									These slots already hard-block <code>alex@codingcat.dev</code>{" "}
									and have a private busy block on{" "}
									<code>alex.patterson@sanity.io</code>. Approve to send{" "}
									<code>https://streamyard.com/c4kv26is93</code> or Cancel to
									free the calendars.
								</p>
								{bookings.filter(
									(b) =>
										b.status === "pending" &&
										!isArchivedBookingStatus(b.status),
								).length === 0 ? (
									<div
										style={{
											fontSize: 13,
											color: "#065f46",
											fontWeight: 600,
										}}
									>
										✓ Zero unapproved holds waiting!
									</div>
								) : (
									<div style={{ display: "grid", gap: 10 }}>
										{bookings
											.filter(
												(b) =>
													b.status === "pending" &&
													!isArchivedBookingStatus(b.status),
											)
											.map((b) => (
												<div
													key={b._id}
													style={{
														padding: 10,
														borderRadius: 8,
														background: "#fff",
														border: "1px solid #fcd34d",
														display: "flex",
														justifyContent: "space-between",
														alignItems: "center",
														gap: 8,
														flexWrap: "wrap",
													}}
												>
													<div>
														<div style={{ fontWeight: 700, fontSize: 13 }}>
															{b.guestName} ({b.company || "Independent"})
														</div>
														<div style={{ fontSize: 12, color: "#4b5563" }}>
															{formatDateTime(b.slotStartAt || b._createdAt)} ·{" "}
															{b.guestEmail}
														</div>
													</div>
													<div style={{ display: "flex", gap: 6 }}>
														<button
															type="button"
															disabled={
																busyActionId === `${b._id}:approve_recording`
															}
															onClick={() =>
																handleBookingManage(b._id, "approve_recording")
															}
															style={{
																...btnStyle,
																background: "#059669",
																borderColor: "#059669",
																color: "#fff",
															}}
														>
															✓ Approve &amp; Send StreamYard
														</button>
														<button
															type="button"
															disabled={
																busyActionId === `${b._id}:cancel_booking`
															}
															onClick={() =>
																handleBookingManage(b._id, "cancel_booking")
															}
															style={{
																...btnStyle,
																color: "#b91c1c",
																borderColor: "#fca5a5",
															}}
														>
															✕ Cancel
														</button>
													</div>
												</div>
											))}
									</div>
								)}
							</div>

							{/* Action Card 2: Active Deals Needing Action */}
							<div
								style={{
									padding: 16,
									borderRadius: 10,
									border: "1px solid #bfdbfe",
									background: "#eff6ff",
								}}
							>
								<h3 style={{ margin: "0 0 8px", fontSize: 15, color: "#1e40af" }}>
									💼 Active Sponsor Deals Needing Action (
									{leads.filter((l) => !isArchivedLeadStatus(l.status)).length})
								</h3>
								<p style={{ margin: "0 0 12px", fontSize: 12, color: "#1e3a8a" }}>
									Mark <strong>Paid in Full (100%)</strong> or{" "}
									<strong>✕ Cancel</strong> to automatically archive out of your
									active queue.
								</p>
								<div
									style={{
										display: "grid",
										gap: 8,
										maxHeight: 280,
										overflowY: "auto",
									}}
								>
									{leads
										.filter((l) => !isArchivedLeadStatus(l.status))
										.map((lead) => {
											const token =
												lead.portalToken ||
												lead._id.replace(/^sponsorLead-/, "");
											const portalUrl = `${siteOrigin}/portal/${token}`;
											const isPf =
												lead.source === "passionfroot" ||
												lead.billingProvider === "passionfroot" ||
												Boolean(lead.passionfrootCollaborationId);
											return (
												<div
													key={lead._id}
													style={{
														padding: 10,
														borderRadius: 8,
														background: "#fff",
														border: "1px solid #dbeafe",
														display: "flex",
														justifyContent: "space-between",
														alignItems: "center",
														gap: 8,
														flexWrap: "wrap",
													}}
												>
													<div>
														<div style={{ fontWeight: 700, fontSize: 13 }}>
															{lead.companyName}{" "}
															<span
																style={{
																	fontSize: 11,
																	fontWeight: 600,
																	color: isPf ? "#059669" : "#4b5563",
																}}
															>
																({isPf ? "🌱 PF" : "⚡ Direct"} ·{" "}
																{formatUsd(
																	lead.passionfrootNetEarningsCents ||
																		lead.totalAmountCents,
																)}
																)
															</span>
														</div>
														<div style={{ fontSize: 11, color: "#6b7280" }}>
															Stage: <code>{lead.status || "new"}</code> ·{" "}
															{lead.contactEmail}
														</div>
													</div>
													<div style={{ display: "flex", gap: 6 }}>
														<a
															href={portalUrl}
															target="_blank"
															rel="noreferrer"
															style={btnStyle}
														>
															Portal ↗
														</a>
														<button
															type="button"
															onClick={() =>
																handleUpdateLeadStatus(lead._id, "paid")
															}
															style={{
																...btnStyle,
																background: "#dcfce7",
																borderColor: "#86efac",
																color: "#065f46",
															}}
															title="Mark 100% Paid in Full and Archive"
														>
															✓ Paid (Archive)
														</button>
														<button
															type="button"
															onClick={() =>
																handleUpdateLeadStatus(lead._id, "cancelled")
															}
															style={{
																...btnStyle,
																color: "#b91c1c",
																borderColor: "#fca5a5",
															}}
															title="Cancel deal and move to Archive"
														>
															✕ Cancel
														</button>
													</div>
												</div>
											);
										})}
								</div>
							</div>
						</div>

						{/* Ongoing Master Calendar Timeline */}
						<div>
							<h3 style={{ margin: "0 0 12px", fontSize: 16 }}>
								📅 Ongoing Multi-Calendar Schedule (Next 45 Days)
							</h3>
							<div style={{ overflowX: "auto" }}>
								<table
									style={{
										width: "100%",
										borderCollapse: "collapse",
										fontSize: 13,
									}}
								>
									<thead>
										<tr
											style={{
												textAlign: "left",
												borderBottom: "2px solid #e5e7eb",
												color: "#374151",
											}}
										>
											<th style={{ padding: "10px 8px" }}>Date &amp; Time (ET)</th>
											<th style={{ padding: "10px 8px" }}>Calendar / Source</th>
											<th style={{ padding: "10px 8px" }}>
												Event / Podcast Recording
											</th>
											<th style={{ padding: "10px 8px" }}>
												Status &amp; Studio Link
											</th>
											<th style={{ padding: "10px 8px" }}>Quick Actions</th>
										</tr>
									</thead>
									<tbody>
										{(() => {
											const nowMs = Date.now() - 12 * 60 * 60 * 1000;
											const bookingEvents = bookings
												.filter(
													(b) =>
														!isArchivedBookingStatus(b.status) &&
														b.slotStartAt &&
														Date.parse(b.slotStartAt) >= nowMs,
												)
												.map((b) => ({
													id: b._id,
													startAt: b.slotStartAt!,
													calendarLabel:
														"🎙️ CodingCat Podcast + 🔒 Sanity Private Block",
													title: `${b.guestName} (${b.company || "Independent"})`,
													status: b.status || "pending",
													streamyardUrl:
														b.recordingUrl ||
														"https://streamyard.com/c4kv26is93",
													booking: b,
												}));

											const bookingEventIds = new Set(
												bookings
													.map((b) => b.calendarEventId)
													.filter(Boolean),
											);

											const externalEvents = masterCalendarEvents
												.filter(
													(ev) =>
														!bookingEventIds.has(ev.id) &&
														!ev.summary.startsWith("[CodingCat.dev]") &&
														!ev.summary.startsWith("CodingCat.dev Podcast") &&
														!ev.summary.startsWith(
															"[HOLD] CodingCat.dev Podcast",
														) &&
														Date.parse(ev.start) >= nowMs,
												)
												.map((ev) => ({
													id: `${ev.calendarId}:${ev.id}`,
													startAt: ev.start,
													calendarLabel:
														ev.calendarId === "alex.patterson@sanity.io"
															? "🟧 alex.patterson@sanity.io"
															: "🟪 alex@codingcat.dev",
													title: ev.summary,
													status: ev.visibility === "private" ? "private" : "busy",
													streamyardUrl: ev.htmlLink || "",
													booking: null as PodcastBooking | null,
												}));

											const combined = [...bookingEvents, ...externalEvents].sort(
												(a, b) => Date.parse(a.startAt) - Date.parse(b.startAt),
											);

											if (combined.length === 0) {
												return (
													<tr>
														<td
															colSpan={5}
															style={{ padding: 16, color: "#6b7280" }}
														>
															No upcoming events found in the next 45 days.
														</td>
													</tr>
												);
											}

											return combined.map((item) => {
												const b = item.booking;
												const isApproved =
													b &&
													(b.status === "approved" ||
														b.status === "scheduled" ||
														b.status === "recorded");
												return (
													<tr
														key={item.id}
														style={{
															borderBottom: "1px solid #f3f4f6",
															background: b ? "#f5f3ff" : "#fff",
														}}
													>
														<td
															style={{
																padding: "10px 8px",
																whiteSpace: "nowrap",
																fontWeight: 700,
															}}
														>
															{formatDateTime(item.startAt)}
														</td>
														<td style={{ padding: "10px 8px" }}>
															<span
																style={{
																	padding: "2px 8px",
																	borderRadius: 999,
																	fontSize: 11,
																	fontWeight: 700,
																	background: b ? "#ede9fe" : "#f3f4f6",
																	color: b ? "#5b21b6" : "#374151",
																}}
															>
																{item.calendarLabel}
															</span>
														</td>
														<td style={{ padding: "10px 8px", fontWeight: 600 }}>
															{item.title}
															{b && (
																<div
																	style={{
																		fontSize: 11,
																		color: "#6b7280",
																		fontWeight: 400,
																	}}
																>
																	{b.guestEmail} ·{" "}
																	{b.bookingSource === "passionfroot"
																		? "🌱 Passionfroot"
																		: "⚡ Direct Book"}
																</div>
															)}
														</td>
														<td style={{ padding: "10px 8px" }}>
															{b ? (
																<div>
																	<span
																		style={{
																			padding: "2px 7px",
																			borderRadius: 999,
																			fontSize: 11,
																			fontWeight: 700,
																			background: isApproved
																				? "#dcfce7"
																				: "#fef3c7",
																			color: isApproved ? "#065f46" : "#92400e",
																		}}
																	>
																		{isApproved
																			? "✓ Approved (StreamYard Sent)"
																			: "⏳ Hold (Pending Approval)"}
																	</span>
																	<div style={{ marginTop: 4, fontSize: 11 }}>
																		<a
																			href="https://streamyard.com/c4kv26is93"
																			target="_blank"
																			rel="noreferrer"
																			style={{
																				color: "#2563eb",
																				fontWeight: 600,
																			}}
																		>
																			StreamYard Studio ↗
																		</a>
																	</div>
																</div>
															) : (
																<span
																	style={{ fontSize: 12, color: "#6b7280" }}
																>
																	Calendar Busy Block
																</span>
															)}
														</td>
														<td style={{ padding: "10px 8px" }}>
															{b ? (
																<div
																	style={{
																		display: "flex",
																		gap: 6,
																		flexWrap: "wrap",
																	}}
																>
																	{!isApproved && (
																		<button
																			type="button"
																			disabled={
																				busyActionId ===
																				`${b._id}:approve_recording`
																			}
																			onClick={() =>
																				handleBookingManage(
																					b._id,
																					"approve_recording",
																				)
																			}
																			style={{
																				...btnStyle,
																				background: "#059669",
																				borderColor: "#059669",
																				color: "#fff",
																			}}
																		>
																			✓ Approve
																		</button>
																	)}
																	<button
																		type="button"
																		disabled={
																			busyActionId === `${b._id}:cancel_booking`
																		}
																		onClick={() =>
																			handleBookingManage(
																				b._id,
																				"cancel_booking",
																			)
																		}
																		style={{
																			...btnStyle,
																			color: "#b91c1c",
																			borderColor: "#fca5a5",
																		}}
																	>
																		✕ Cancel
																	</button>
																</div>
															) : item.streamyardUrl ? (
																<a
																	href={item.streamyardUrl}
																	target="_blank"
																	rel="noreferrer"
																	style={btnStyle}
																>
																	Open in GCal ↗
																</a>
															) : null}
														</td>
													</tr>
												);
											});
										})()}
									</tbody>
								</table>
							</div>
						</div>
					</section>
				</div>
			)}

			{/* TAB 1: SPONSOR CRM & OUTBOUND */}
			{!loading && activeTab === "crm" && (
				<div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
					<section
						style={{
							padding: 20,
							border: "1px solid #e5e7eb",
							borderRadius: 12,
							background: "#fff",
						}}
					>
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								marginBottom: 16,
								flexWrap: "wrap",
								gap: 12,
							}}
						>
							<div>
								<h2 style={{ margin: 0, fontSize: 18 }}>
									Active Sponsor Deals &amp; Inbound Leads ({filteredLeads.length} /{" "}
									{leads.length})
								</h2>
								<p style={{ margin: "4px 0 0", color: "#4b5563", fontSize: 13 }}>
									Differentiates <strong>🌱 Passionfroot API</strong> deals vs.{" "}
									<strong>⚡ Direct Book</strong> &amp; <strong>📬 Inbound</strong>{" "}
									leads, with 1-click Passionfroot actions and Sanity Media Library
									Asset Vaults (<code>#vault</code>).
								</p>
							</div>
							<div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
								<button
									type="button"
									onClick={handleSyncPassionfroot}
									disabled={syncingPassionfroot}
									style={{
										...btnStyle,
										background: "#ecfdf5",
										borderColor: "#10b981",
										color: "#065f46",
										fontWeight: 700,
									}}
								>
									{syncingPassionfroot
										? "🌱 Syncing Passionfroot..."
										: "🌱 Sync Passionfroot API"}
								</button>
								<button
									type="button"
									onClick={() => setShowPassionfrootConfig((v) => !v)}
									style={btnStyle}
									title="Configure Passionfroot API Key override"
								>
									⚙️ API Key
								</button>
								<button
									type="button"
									onClick={() => setShowNewLeadForm((v) => !v)}
									style={primaryBtnStyle}
								>
									{showNewLeadForm ? "Cancel" : "+ New Sponsor Deal Room"}
								</button>
							</div>
						</div>

						{showPassionfrootConfig && (
							<div
								style={{
									marginBottom: 16,
									padding: 12,
									borderRadius: 8,
									background: "#f0fdf4",
									border: "1px solid #bbf7d0",
									display: "flex",
									gap: 8,
									alignItems: "center",
									flexWrap: "wrap",
								}}
							>
								<span style={{ fontSize: 12, fontWeight: 700, color: "#065f46" }}>
									Passionfroot Workspace API Key (<code>apik_...</code>):
								</span>
								<input
									type="password"
									value={passionfrootApiKey}
									onChange={(e) => {
										const val = e.target.value;
										setPassionfrootApiKey(val);
										try {
											localStorage.setItem("codingcat_pf_api_key", val);
										} catch {
											// Ignore storage errors
										}
									}}
									placeholder="Uses Cloudflare PASSIONFROOT_API_KEY env by default, or paste apik_... here"
									style={{
										flex: 1,
										minWidth: 280,
										padding: "6px 10px",
										borderRadius: 6,
										border: "1px solid #86efac",
										fontSize: 12,
									}}
								/>
								<button
									type="button"
									onClick={() => setShowPassionfrootConfig(false)}
									style={btnStyle}
								>
									Done
								</button>
							</div>
						)}

						<div
							style={{
								display: "flex",
								gap: 8,
								flexWrap: "wrap",
								marginBottom: 16,
							}}
						>
							<button
								type="button"
								onClick={() => setShowArchivedLeads(false)}
								style={{
									...btnStyle,
									background: !showArchivedLeads ? "#059669" : "#f9fafb",
									color: !showArchivedLeads ? "#fff" : "#374151",
									borderColor: !showArchivedLeads ? "#059669" : "#d1d5db",
									fontWeight: 700,
								}}
							>
								⚡ Active Queue (
								{leads.filter((l) => !isArchivedLeadStatus(l.status)).length})
							</button>
							<button
								type="button"
								onClick={() => setShowArchivedLeads(true)}
								style={{
									...btnStyle,
									background: showArchivedLeads ? "#4b5563" : "#f9fafb",
									color: showArchivedLeads ? "#fff" : "#374151",
									borderColor: showArchivedLeads ? "#4b5563" : "#d1d5db",
									fontWeight: 700,
								}}
							>
								🗄️ Archived: Paid in Full / Cancelled (
								{leads.filter((l) => isArchivedLeadStatus(l.status)).length})
							</button>
							<span style={{ color: "#d1d5db", alignSelf: "center" }}>|</span>
							{(
								[
									{ id: "all", label: `All Sources (${filteredLeads.length})` },
									{
										id: "passionfroot",
										label: `🌱 Passionfroot (${leads.filter((l) => (showArchivedLeads ? isArchivedLeadStatus(l.status) : !isArchivedLeadStatus(l.status)) && (l.source === "passionfroot" || l.billingProvider === "passionfroot" || Boolean(l.passionfrootCollaborationId))).length})`,
									},
									{
										id: "direct",
										label: `⚡ Direct Book (${leads.filter((l) => (showArchivedLeads ? isArchivedLeadStatus(l.status) : !isArchivedLeadStatus(l.status)) && l.source === "booking").length})`,
									},
									{
										id: "inbound",
										label: `📬 Inbound / Gmail (${leads.filter((l) => (showArchivedLeads ? isArchivedLeadStatus(l.status) : !isArchivedLeadStatus(l.status)) && l.source !== "passionfroot" && l.billingProvider !== "passionfroot" && !l.passionfrootCollaborationId && l.source !== "booking").length})`,
									},
								] as const
							).map((f) => (
								<button
									key={f.id}
									type="button"
									onClick={() => setLeadSourceFilter(f.id)}
									style={{
										...btnStyle,
										background:
											leadSourceFilter === f.id ? "#111827" : "#f9fafb",
										color: leadSourceFilter === f.id ? "#fff" : "#374151",
										borderColor:
											leadSourceFilter === f.id ? "#111827" : "#d1d5db",
									}}
								>
									{f.label}
								</button>
							))}
						</div>

						{showNewLeadForm && (
							<form
								onSubmit={handleCreateLead}
								style={{
									marginBottom: 20,
									padding: 16,
									background: "#f9fafb",
									border: "1px solid #d1d5db",
									borderRadius: 10,
									display: "grid",
									gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
									gap: 12,
								}}
							>
								<div>
									<label
										style={{
											display: "block",
											fontSize: 12,
											fontWeight: 600,
											marginBottom: 4,
										}}
									>
										Company Name *
									</label>
									<input
										required
										value={newCompany}
										onChange={(e) => setNewCompany(e.target.value)}
										placeholder="e.g. Acme AI"
										style={{
											width: "100%",
											padding: "7px 10px",
											borderRadius: 6,
											border: "1px solid #cbd5e1",
											fontSize: 13,
										}}
									/>
								</div>
								<div>
									<label
										style={{
											display: "block",
											fontSize: 12,
											fontWeight: 600,
											marginBottom: 4,
										}}
									>
										Contact Name
									</label>
									<input
										value={newContactName}
										onChange={(e) => setNewContactName(e.target.value)}
										placeholder="e.g. Jane Doe"
										style={{
											width: "100%",
											padding: "7px 10px",
											borderRadius: 6,
											border: "1px solid #cbd5e1",
											fontSize: 13,
										}}
									/>
								</div>
								<div>
									<label
										style={{
											display: "block",
											fontSize: 12,
											fontWeight: 600,
											marginBottom: 4,
										}}
									>
										Contact Email *
									</label>
									<input
										required
										type="email"
										value={newContactEmail}
										onChange={(e) => setNewContactEmail(e.target.value)}
										placeholder="jane@acme.ai"
										style={{
											width: "100%",
											padding: "7px 10px",
											borderRadius: 6,
											border: "1px solid #cbd5e1",
											fontSize: 13,
										}}
									/>
								</div>
								<div>
									<label
										style={{
											display: "block",
											fontSize: 12,
											fontWeight: 600,
											marginBottom: 4,
										}}
									>
										Package Tier
									</label>
									<select
										value={newRateCard}
										onChange={(e) => setNewRateCard(e.target.value)}
										style={{
											width: "100%",
											padding: "7px 10px",
											borderRadius: 6,
											border: "1px solid #cbd5e1",
											fontSize: 13,
										}}
									>
										{Object.entries(RATE_CARD_TIERS).map(([k, v]) => (
											<option key={k} value={k}>
												{v.label}
											</option>
										))}
									</select>
								</div>
								<div style={{ gridColumn: "1 / -1" }}>
									<label
										style={{
											display: "block",
											fontSize: 12,
											fontWeight: 600,
											marginBottom: 4,
										}}
									>
										Campaign Notes / Goals
									</label>
									<input
										value={newIntent}
										onChange={(e) => setNewIntent(e.target.value)}
										placeholder="Launch window, product focus, or special deliverables..."
										style={{
											width: "100%",
											padding: "7px 10px",
											borderRadius: 6,
											border: "1px solid #cbd5e1",
											fontSize: 13,
										}}
									/>
								</div>
								<div style={{ gridColumn: "1 / -1" }}>
									<button type="submit" style={primaryBtnStyle}>
										Create Sponsor Lead &amp; Provision Deal Room
									</button>
								</div>
							</form>
						)}

						<div style={{ overflowX: "auto" }}>
							<table
								style={{
									width: "100%",
									borderCollapse: "collapse",
									fontSize: 13,
								}}
							>
								<thead>
									<tr
										style={{
											textAlign: "left",
											borderBottom: "2px solid #e5e7eb",
											color: "#374151",
										}}
									>
										<th style={{ padding: "10px 8px" }}>Company &amp; Source</th>
										<th style={{ padding: "10px 8px" }}>Contact</th>
										<th style={{ padding: "10px 8px" }}>Package &amp; Notes</th>
										<th style={{ padding: "10px 8px" }}>
											Total / Payout &amp; Billing
										</th>
										<th style={{ padding: "10px 8px" }}>Stage (Editable)</th>
										<th style={{ padding: "10px 8px" }}>Execute / Actions</th>
									</tr>
								</thead>
								<tbody>
									{filteredLeads.map((lead) => {
										const token =
											lead.portalToken ||
											lead._id.replace(/^sponsorLead-/, "");
										const portalUrl = `${siteOrigin}/portal/${token}`;
										const vaultUrl = `${portalUrl}#vault`;
										const gmailUrl = lead.threadId
											? `https://mail.google.com/mail/u/0/#inbox/${lead.threadId}`
											: `https://mail.google.com/mail/u/0/#search/${encodeURIComponent(lead.contactEmail || lead.companyName)}`;
										const isPf =
											lead.source === "passionfroot" ||
											lead.billingProvider === "passionfroot" ||
											Boolean(lead.passionfrootCollaborationId);
										const isDirect = lead.source === "booking";
										const isExpanded = expandedCrmLeadId === lead._id;
										const assetCount = lead.sharedAssets?.length || 0;

										return (
											<>
												<tr
													key={lead._id}
													style={{ borderBottom: "1px solid #f3f4f6" }}
												>
													<td style={{ padding: "10px 8px", fontWeight: 700 }}>
														<div>{lead.companyName}</div>
														<div
															style={{
																display: "flex",
																gap: 6,
																flexWrap: "wrap",
																marginTop: 4,
															}}
														>
															<span
																style={{
																	padding: "2px 7px",
																	borderRadius: 999,
																	fontSize: 10,
																	fontWeight: 700,
																	background: isPf
																		? "#dcfce7"
																		: isDirect
																			? "#ede9fe"
																			: "#f3f4f6",
																	color: isPf
																		? "#065f46"
																		: isDirect
																			? "#5b21b6"
																			: "#374151",
																}}
															>
																{isPf
																	? "🌱 Passionfroot"
																	: isDirect
																		? "⚡ Direct Book"
																		: "📬 Inbound / Gmail"}
															</span>
															{lead.passionfrootStatus && (
																<span
																	style={{
																		padding: "2px 6px",
																		borderRadius: 999,
																		fontSize: 10,
																		fontWeight: 600,
																		background: "#fef3c7",
																		color: "#92400e",
																	}}
																>
																	PF: {lead.passionfrootStatus}
																</span>
															)}
														</div>
													</td>
													<td style={{ padding: "10px 8px" }}>
														<a
															href={`mailto:${lead.contactEmail}`}
															style={{
																color: "#2563eb",
																textDecoration: "none",
																fontWeight: 500,
															}}
														>
															{lead.contactName
																? `${lead.contactName} <${lead.contactEmail}>`
																: lead.contactEmail}
														</a>
													</td>
													<td style={{ padding: "10px 8px", maxWidth: 280 }}>
														<div style={{ fontWeight: 600 }}>
															{RATE_CARD_TIERS[lead.rateCard || ""]?.label ||
																lead.rateCard ||
																"Custom Package"}
														</div>
														{lead.intent && (
															<div
																style={{
																	fontSize: 12,
																	color: "#6b7280",
																	marginTop: 2,
																}}
															>
																{lead.intent}
															</div>
														)}
													</td>
													<td
														style={{
															padding: "10px 8px",
															whiteSpace: "nowrap",
															fontWeight: 600,
														}}
													>
														{isPf ? (
															<div>
																<div style={{ color: "#059669" }}>
																	Net:{" "}
																	{formatUsd(
																		lead.passionfrootNetEarningsCents ||
																			lead.totalAmountCents,
																	)}
																</div>
																<div
																	style={{
																		fontSize: 11,
																		color: "#6b7280",
																		fontWeight: 400,
																	}}
																>
																	Gross:{" "}
																	{formatUsd(
																		lead.passionfrootGrossBudgetCents ||
																			lead.totalAmountCents,
																	)}{" "}
																	(PF Billing)
																</div>
															</div>
														) : (
															<div>
																{formatUsd(lead.totalAmountCents)}{" "}
																<span
																	style={{ color: "#6b7280", fontWeight: 400 }}
																>
																	({formatUsd(lead.depositAmountCents)} deposit)
																</span>
															</div>
														)}
													</td>
													<td style={{ padding: "10px 8px" }}>
														<select
															value={lead.status || "new"}
															onChange={(e) =>
																handleUpdateLeadStatus(lead._id, e.target.value)
															}
															style={{
																padding: "5px 8px",
																borderRadius: 6,
																border: "1px solid #d1d5db",
																fontSize: 12,
																fontWeight: 600,
																background:
																	lead.status === "paid" ||
																	lead.status === "deposit_paid"
																		? "#dcfce7"
																		: lead.status === "replied"
																			? "#fef3c7"
																			: "#f9fafb",
															}}
														>
															{LEAD_STATUS_OPTIONS.map((opt) => (
																<option key={opt.value} value={opt.value}>
																	{opt.label}
																</option>
															))}
														</select>
													</td>
													<td style={{ padding: "10px 8px" }}>
														<div
															style={{
																display: "flex",
																gap: 6,
																flexWrap: "wrap",
															}}
														>
															<button
																type="button"
																onClick={() =>
																	setExpandedCrmLeadId(
																		isExpanded ? null : lead._id,
																	)
																}
																style={{
																	...btnStyle,
																	background: isExpanded
																		? "#111827"
																		: "#f3f4f6",
																	color: isExpanded ? "#fff" : "#111827",
																}}
															>
																{isExpanded
																	? "Hide Vault & Actions"
																	: `${isPf ? "🌱 PF Actions" : "📁 Vault"} (${assetCount})`}
															</button>
															<a
																href={portalUrl}
																target="_blank"
																rel="noreferrer"
																style={primaryBtnStyle}
																title="Open interactive Sponsor Deal Room"
															>
																Deal Room ↗
															</a>
															<button
																type="button"
																onClick={() =>
																	handleCopy(vaultUrl, `vault-${lead._id}`)
																}
																style={btnStyle}
																title="Copy direct Sanity Media Library Asset Vault link (#vault)"
															>
																{copiedId === `vault-${lead._id}`
																	? "✓ Vault Copied"
																	: "Copy #vault Link"}
															</button>
															<a
																href={gmailUrl}
																target="_blank"
																rel="noreferrer"
																style={btnStyle}
																title="Open thread or draft in Gmail"
															>
																Gmail ↗
															</a>
															{!isArchivedLeadStatus(lead.status) && (
																<button
																	type="button"
																	onClick={() =>
																		handleUpdateLeadStatus(
																			lead._id,
																			"cancelled",
																		)
																	}
																	style={{
																		...btnStyle,
																		color: "#b91c1c",
																		borderColor: "#fca5a5",
																	}}
																	title="Cancel deal and move to Archive"
																>
																	✕ Cancel
																</button>
															)}
														</div>
													</td>
												</tr>
												{isExpanded && (
													<tr
														key={`${lead._id}-crm-expanded`}
														style={{
															background: "#f9fafb",
															borderBottom: "2px solid #e5e7eb",
														}}
													>
														<td colSpan={6} style={{ padding: 16 }}>
															<div
																style={{
																	display: "grid",
																	gridTemplateColumns:
																		"repeat(auto-fit, minmax(320px, 1fr))",
																	gap: 16,
																}}
															>
																{isPf && (
																	<div
																		style={{
																			padding: 14,
																			background: "#ecfdf5",
																			border: "1px solid #a7f3d0",
																			borderRadius: 10,
																		}}
																	>
																		<h4
																			style={{
																				margin: "0 0 8px",
																				fontSize: 13,
																				color: "#065f46",
																			}}
																		>
																			🌱 Passionfroot Creator API Quick Actions
																		</h4>
																		<div
																			style={{
																				display: "flex",
																				gap: 8,
																				flexWrap: "wrap",
																				marginBottom: 12,
																			}}
																		>
																			{lead.passionfrootRequestId && (
																				<>
																					<button
																						type="button"
																						disabled={
																							busyActionId ===
																							`${lead._id}:accept_request`
																						}
																						onClick={() =>
																							handlePassionfrootAction(
																								lead,
																								"accept_request",
																							)
																						}
																						style={{
																							...btnStyle,
																							background: "#059669",
																							borderColor: "#059669",
																							color: "#fff",
																						}}
																					>
																						✓ Accept Request (Auto-Invoice +
																						Request Assets)
																					</button>
																					<button
																						type="button"
																						disabled={
																							busyActionId ===
																							`${lead._id}:decline_request`
																						}
																						onClick={() =>
																							handlePassionfrootAction(
																								lead,
																								"decline_request",
																							)
																						}
																						style={{
																							...btnStyle,
																							color: "#b91c1c",
																							borderColor: "#fca5a5",
																						}}
																					>
																						✕ Decline Request
																					</button>
																				</>
																			)}
																			{lead.passionfrootProposalId && (
																				<button
																					type="button"
																					disabled={
																						busyActionId ===
																						`${lead._id}:accept_proposal`
																					}
																					onClick={() =>
																						handlePassionfrootAction(
																							lead,
																							"accept_proposal",
																						)
																					}
																					style={{
																						...btnStyle,
																						background: "#059669",
																						borderColor: "#059669",
																						color: "#fff",
																					}}
																				>
																					✓ Accept Proposal
																				</button>
																			)}
																			<button
																				type="button"
																				disabled={
																					busyActionId ===
																					`${lead._id}:send_portal_link`
																				}
																				onClick={() =>
																					handlePassionfrootAction(
																						lead,
																						"send_portal_link",
																					)
																				}
																				style={primaryBtnStyle}
																			>
																				📤 Send CodingCat Portal &amp; Calendar
																				Link to PF Chat
																			</button>
																		</div>

																		<div
																			style={{
																				display: "flex",
																				gap: 6,
																				marginBottom: 10,
																			}}
																		>
																			<input
																				value={pfChatInput[lead._id] || ""}
																				onChange={(e) =>
																					setPfChatInput((prev) => ({
																						...prev,
																						[lead._id]: e.target.value,
																					}))
																				}
																				placeholder="Reply directly to partner in Passionfroot chat..."
																				style={{
																					flex: 1,
																					padding: "6px 10px",
																					borderRadius: 6,
																					border: "1px solid #6ee7b7",
																					fontSize: 12,
																				}}
																			/>
																			<button
																				type="button"
																				disabled={
																					busyActionId ===
																					`${lead._id}:send_message`
																				}
																				onClick={() => {
																					const msg = (
																						pfChatInput[lead._id] || ""
																					).trim();
																					if (!msg) return;
																					handlePassionfrootAction(
																						lead,
																						"send_message",
																						{ messageText: msg },
																					);
																					setPfChatInput((prev) => ({
																						...prev,
																						[lead._id]: "",
																					}));
																				}}
																				style={btnStyle}
																			>
																				Send Reply
																			</button>
																		</div>

																		{(lead.passionfrootMessages || []).length >
																			0 && (
																			<div
																				style={{
																					maxHeight: 140,
																					overflowY: "auto",
																					background: "#fff",
																					padding: 8,
																					borderRadius: 6,
																					border: "1px solid #d1fae5",
																					fontSize: 12,
																				}}
																			>
																				{(lead.passionfrootMessages || [])
																					.slice(-5)
																					.map((m, idx) => (
																						<div
																							key={m._key || idx}
																							style={{ marginBottom: 6 }}
																						>
																							<strong>
																								{m.senderName || m.senderType}:
																							</strong>{" "}
																							{m.text}
																						</div>
																					))}
																			</div>
																		)}
																	</div>
																)}

																<div
																	style={{
																		padding: 14,
																		background: "#fff",
																		border: "1px solid #e5e7eb",
																		borderRadius: 10,
																	}}
																>
																	<div
																		style={{
																			display: "flex",
																			justifyContent: "space-between",
																			alignItems: "center",
																			marginBottom: 8,
																		}}
																	>
																		<h4
																			style={{
																				margin: 0,
																				fontSize: 13,
																				color: "#111827",
																			}}
																		>
																			📁 Sanity Media Library 2-Way Asset Vault
																			({assetCount})
																		</h4>
																		<button
																			type="button"
																			onClick={() =>
																				handleCopy(
																					vaultUrl,
																					`vault-inner-${lead._id}`,
																				)
																			}
																			style={btnStyle}
																		>
																			{copiedId === `vault-inner-${lead._id}`
																				? "✓ Copied #vault Link"
																				: "Copy Partner Dropzone URL"}
																		</button>
																	</div>

																	{assetCount === 0 ? (
																		<p
																			style={{
																				margin: "0 0 10px",
																				fontSize: 12,
																				color: "#6b7280",
																			}}
																		>
																			No shared assets yet. Share{" "}
																			<code>{vaultUrl}</code> with the partner
																			or drop a link below.
																		</p>
																	) : (
																		<ul
																			style={{
																				margin: "0 0 10px",
																				paddingLeft: 18,
																				fontSize: 12,
																				lineHeight: 1.6,
																			}}
																		>
																			{(lead.sharedAssets || []).map(
																				(a, idx) => (
																					<li key={a._key || idx}>
																						<strong>{a.title}</strong> (
																						{a.uploadedBy || "partner"} ·{" "}
																						{a.source === "passionfroot"
																							? "🌱 PF"
																							: "⚡ Direct"}
																						)
																						{(a.externalUrl || a.fileUrl) && (
																							<>
																								{" "}
																								·{" "}
																								<a
																									href={
																										a.externalUrl || a.fileUrl
																									}
																									target="_blank"
																									rel="noreferrer"
																									style={{ color: "#2563eb" }}
																								>
																									Open Asset ↗
																								</a>
																							</>
																						)}
																					</li>
																				),
																			)}
																		</ul>
																	)}

																	<div
																		style={{
																			display: "flex",
																			gap: 6,
																			flexWrap: "wrap",
																		}}
																	>
																		<input
																			value={vaultTitleInput[lead._id] || ""}
																			onChange={(e) =>
																				setVaultTitleInput((prev) => ({
																					...prev,
																					[lead._id]: e.target.value,
																				}))
																			}
																			placeholder="Asset label (e.g. Draft Cut, Thumbnail)"
																			style={{
																				flex: 1,
																				minWidth: 140,
																				padding: "6px 8px",
																				borderRadius: 6,
																				border: "1px solid #d1d5db",
																				fontSize: 12,
																			}}
																		/>
																		<input
																			value={vaultUrlInput[lead._id] || ""}
																			onChange={(e) =>
																				setVaultUrlInput((prev) => ({
																					...prev,
																					[lead._id]: e.target.value,
																				}))
																			}
																			placeholder="https://... (Sanity CDN, Frame.io, Docs)"
																			style={{
																				flex: 1,
																				minWidth: 160,
																				padding: "6px 8px",
																				borderRadius: 6,
																				border: "1px solid #d1d5db",
																				fontSize: 12,
																			}}
																		/>
																		<button
																			type="button"
																			disabled={
																				busyActionId === `${lead._id}:vault`
																			}
																			onClick={() =>
																				handleAddSharedAssetLink(
																					lead._id,
																					token,
																					isPf ? "passionfroot" : "direct",
																				)
																			}
																			style={btnStyle}
																		>
																			+ Add to Vault
																		</button>
																	</div>
																</div>
															</div>
														</td>
													</tr>
												)}
											</>
										);
									})}
								</tbody>
							</table>
						</div>
					</section>

					<section
						style={{
							padding: 20,
							border: "1px solid #e5e7eb",
							borderRadius: 12,
							background: "#fff",
						}}
					>
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								marginBottom: 16,
							}}
						>
							<div>
								<h2 style={{ margin: 0, fontSize: 18 }}>
									Outbound Funded AI &amp; YC Startup Scraper (
									{discoveredProspects.length})
								</h2>
								<p style={{ margin: "4px 0 0", color: "#4b5563", fontSize: 13 }}>
									Automatically generates 2 tailored CodingCat.dev video concepts
									per startup.
								</p>
							</div>
							<button
								type="button"
								onClick={handleDiscoverOutbound}
								disabled={discovering}
								style={primaryBtnStyle}
							>
								{discovering
									? "Scanning Launch HN & YC..."
									: "Scan Launch HN & Generate 2 Video Concepts"}
							</button>
						</div>

						{discoveredProspects.length > 0 && (
							<div style={{ display: "grid", gap: 12 }}>
								{discoveredProspects.map((p) => (
									<div
										key={p.companyName}
										style={{
											padding: 14,
											border: "1px solid #e5e7eb",
											borderRadius: 8,
										}}
									>
										<div
											style={{
												display: "flex",
												justifyContent: "space-between",
											}}
										>
											<strong>
												{p.companyName} ({p.fundingRound}) : {p.category}
											</strong>
											<span>Score: {p.relevanceScore}/100</span>
										</div>
										<ul
											style={{
												margin: "8px 0",
												paddingLeft: 18,
												fontSize: 13,
											}}
										>
											{p.videoConcepts?.map((vc: any, i: number) => (
												<li key={i}>
													<strong>{vc.title}</strong> : {vc.angle}
												</li>
											))}
										</ul>
									</div>
								))}
							</div>
						)}
					</section>
				</div>
			)}

			{/* TAB 2: CALENDAR BOOKINGS & E-SIGN */}
			{!loading && activeTab === "bookings" && (
				<div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
					<section
						style={{
							padding: 20,
							border: "1px solid #e5e7eb",
							borderRadius: 12,
							background: "#fff",
						}}
					>
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								flexWrap: "wrap",
								gap: 12,
								marginBottom: 16,
							}}
						>
							<div>
								<h2 style={{ margin: 0, fontSize: 18 }}>
									Podcast &amp; Sponsor Calendar Bookings (
									{filteredBookings.length} / {bookings.length})
								</h2>
								<p style={{ margin: "4px 0 0", color: "#4b5563", fontSize: 13 }}>
									All placeholders hard-block{" "}
									<code>alex@codingcat.dev</code> as <strong>Busy</strong> so
									nothing jumps the slot. Click{" "}
									<strong>✓ Approve &amp; Send StreamYard</strong> to unlock{" "}
									<code>https://streamyard.com/c4kv26is93</code>, or request a{" "}
									<strong>15m Google Meet Pre-Meeting</strong>.
								</p>
							</div>
							<div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
								<button
									type="button"
									onClick={handleSyncPassionfroot}
									disabled={syncingPassionfroot}
									style={{
										...btnStyle,
										background: "#ecfdf5",
										borderColor: "#10b981",
										color: "#065f46",
										fontWeight: 700,
									}}
								>
									{syncingPassionfroot
										? "🌱 Syncing..."
										: "🌱 Sync Passionfroot Placements"}
								</button>
								<a
									href={`${siteOrigin}/book`}
									target="_blank"
									rel="noreferrer"
									style={primaryBtnStyle}
								>
									Open Public Booking Page ↗
								</a>
								<a
									href="https://calendar.google.com"
									target="_blank"
									rel="noreferrer"
									style={btnStyle}
								>
									Open Google Calendar ↗
								</a>
							</div>
						</div>

						<div
							style={{
								display: "flex",
								gap: 8,
								flexWrap: "wrap",
								marginBottom: 16,
							}}
						>
							<button
								type="button"
								onClick={() => setShowArchivedBookings(false)}
								style={{
									...btnStyle,
									background: !showArchivedBookings ? "#059669" : "#f9fafb",
									color: !showArchivedBookings ? "#fff" : "#374151",
									borderColor: !showArchivedBookings ? "#059669" : "#d1d5db",
									fontWeight: 700,
								}}
							>
								🎙️ Active Bookings (
								{
									bookings.filter((b) => !isArchivedBookingStatus(b.status))
										.length
								}
								)
							</button>
							<button
								type="button"
								onClick={() => setShowArchivedBookings(true)}
								style={{
									...btnStyle,
									background: showArchivedBookings ? "#4b5563" : "#f9fafb",
									color: showArchivedBookings ? "#fff" : "#374151",
									borderColor: showArchivedBookings ? "#4b5563" : "#d1d5db",
									fontWeight: 700,
								}}
							>
								🗄️ Archived: Published / Cancelled (
								{
									bookings.filter((b) => isArchivedBookingStatus(b.status))
										.length
								}
								)
							</button>
							<span style={{ color: "#d1d5db", alignSelf: "center" }}>|</span>
							{(
								[
									{
										id: "all",
										label: `All Sources (${filteredBookings.length})`,
									},
									{
										id: "direct",
										label: `⚡ Direct Book (${bookings.filter((b) => (showArchivedBookings ? isArchivedBookingStatus(b.status) : !isArchivedBookingStatus(b.status)) && b.bookingSource !== "passionfroot" && !b.passionfrootCollaborationId).length})`,
									},
									{
										id: "passionfroot",
										label: `🌱 Passionfroot Placements (${bookings.filter((b) => (showArchivedBookings ? isArchivedBookingStatus(b.status) : !isArchivedBookingStatus(b.status)) && (b.bookingSource === "passionfroot" || Boolean(b.passionfrootCollaborationId))).length})`,
									},
								] as const
							).map((f) => (
								<button
									key={f.id}
									type="button"
									onClick={() => setBookingSourceFilter(f.id)}
									style={{
										...btnStyle,
										background:
											bookingSourceFilter === f.id ? "#111827" : "#f9fafb",
										color: bookingSourceFilter === f.id ? "#fff" : "#374151",
										borderColor:
											bookingSourceFilter === f.id ? "#111827" : "#d1d5db",
									}}
								>
									{f.label}
								</button>
							))}
						</div>

						<div style={{ overflowX: "auto" }}>
							<table
								style={{
									width: "100%",
									borderCollapse: "collapse",
									fontSize: 13,
								}}
							>
								<thead>
									<tr
										style={{
											textAlign: "left",
											borderBottom: "2px solid #e5e7eb",
											color: "#374151",
										}}
									>
										<th style={{ padding: "10px 8px" }}>
											Slot &amp; Pre-Meeting
										</th>
										<th style={{ padding: "10px 8px" }}>
											Guest, Company &amp; Source
										</th>
										<th style={{ padding: "10px 8px" }}>Track</th>
										<th style={{ padding: "10px 8px" }}>E-SIGN &amp; Studio</th>
										<th style={{ padding: "10px 8px" }}>Status (Editable)</th>
										<th style={{ padding: "10px 8px" }}>Actions</th>
									</tr>
								</thead>
								<tbody>
									{filteredBookings.map((b) => {
										const isExpanded = expandedBookingId === b._id;
										const isPf =
											b.bookingSource === "passionfroot" ||
											Boolean(b.passionfrootCollaborationId);
										const isApproved =
											b.status === "approved" ||
											b.status === "scheduled" ||
											b.status === "recorded" ||
											b.status === "published";
										const token =
											b.portalToken || b._id.replace(/^booking-/, "");
										const portalUrl = `${siteOrigin}/portal/${token}`;
										const vaultUrl = `${portalUrl}#vault`;
										const assetCount = b.sharedAssets?.length || 0;
										const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(b.guestEmail)}&su=${encodeURIComponent(`CodingCat.dev Podcast: ${b.guestName} (${b.company || "Recording"})`)}`;

										return (
											<>
												<tr
													key={b._id}
													style={{ borderBottom: "1px solid #f3f4f6" }}
												>
													<td
														style={{
															padding: "10px 8px",
															whiteSpace: "nowrap",
															fontWeight: 600,
														}}
													>
														<div>
															{formatDateTime(b.slotStartAt || b._createdAt)}
														</div>
														<div
															style={{
																display: "flex",
																gap: 4,
																flexWrap: "wrap",
																marginTop: 4,
															}}
														>
															<span
																style={{
																	padding: "2px 6px",
																	borderRadius: 999,
																	fontSize: 10,
																	fontWeight: 700,
																	background:
																		b.sessionType === "pre_meeting"
																			? "#dbeafe"
																			: "#f3f4f6",
																	color:
																		b.sessionType === "pre_meeting"
																			? "#1d4ed8"
																			: "#374151",
																}}
															>
																{b.sessionType === "pre_meeting"
																	? "📅 15m Google Meet Pre-Call"
																	: "🎙️ 60m StreamYard Hold"}
															</span>
															{b.preMeetingStatus &&
																b.preMeetingStatus !== "none" && (
																	<span
																		style={{
																			padding: "2px 6px",
																			borderRadius: 999,
																			fontSize: 10,
																			fontWeight: 700,
																			background:
																				b.preMeetingStatus === "scheduled" ||
																				b.preMeetingStatus === "completed"
																					? "#dcfce7"
																					: "#fef3c7",
																			color:
																				b.preMeetingStatus === "scheduled" ||
																				b.preMeetingStatus === "completed"
																					? "#065f46"
																					: "#92400e",
																		}}
																	>
																		Pre-Meet: {b.preMeetingStatus}
																	</span>
																)}
														</div>
													</td>
													<td style={{ padding: "10px 8px" }}>
														<div
															style={{
																display: "flex",
																alignItems: "center",
																gap: 6,
																flexWrap: "wrap",
															}}
														>
															<span style={{ fontWeight: 700 }}>
																{b.guestName}
															</span>
															<span
																style={{
																	padding: "2px 7px",
																	borderRadius: 999,
																	fontSize: 10,
																	fontWeight: 700,
																	background: isPf ? "#dcfce7" : "#ede9fe",
																	color: isPf ? "#065f46" : "#5b21b6",
																}}
															>
																{isPf ? "🌱 Passionfroot" : "⚡ Direct Book"}
															</span>
														</div>
														<div style={{ fontSize: 12, color: "#4b5563" }}>
															{b.company || "Independent"} ·{" "}
															<a
																href={`mailto:${b.guestEmail}`}
																style={{ color: "#2563eb" }}
															>
																{b.guestEmail}
															</a>
															{b.socialUrl && (
																<>
																	{" "}
																	·{" "}
																	<a
																		href={b.socialUrl}
																		target="_blank"
																		rel="noreferrer"
																		style={{ color: "#4B2E83", fontWeight: 600 }}
																	>
																		Profile/Repo ↗
																	</a>
																</>
															)}
														</div>
													</td>
													<td style={{ padding: "10px 8px" }}>
														<span
															style={{
																padding: "3px 8px",
																borderRadius: 999,
																fontSize: 11,
																fontWeight: 700,
																textTransform: "uppercase",
																background:
																	b.track === "editorial"
																		? "#ede9fe"
																		: "#dcfce7",
																color:
																	b.track === "editorial"
																		? "#5b21b6"
																		: "#166534",
															}}
														>
															{b.track || "editorial"}
														</span>
													</td>
													<td style={{ padding: "10px 8px" }}>
														<div>
															{b.signatureData ? (
																<span
																	style={{
																		color: "#059669",
																		fontWeight: 600,
																		fontSize: 12,
																	}}
																>
																	✓ Signed ({b.signatureMode || "type"})
																</span>
															) : (
																<span
																	style={{ color: "#9ca3af", fontSize: 12 }}
																>
																	Unsigned
																</span>
															)}
														</div>
														<div style={{ marginTop: 4, fontSize: 11 }}>
															{isApproved ? (
																<a
																	href={
																		b.recordingUrl ||
																		"https://streamyard.com/c4kv26is93"
																	}
																	target="_blank"
																	rel="noreferrer"
																	style={{
																		color: "#059669",
																		fontWeight: 700,
																		textDecoration: "none",
																	}}
																>
																	🎙️ StreamYard Unlocked ↗
																</a>
															) : (
																<span style={{ color: "#d97706" }}>
																	🔒 StreamYard Withheld
																</span>
															)}
															{b.preMeetingMeetUrl && (
																<>
																	{" · "}
																	<a
																		href={b.preMeetingMeetUrl}
																		target="_blank"
																		rel="noreferrer"
																		style={{
																			color: "#2563eb",
																			fontWeight: 700,
																			textDecoration: "none",
																		}}
																	>
																		Google Meet ↗
																	</a>
																</>
															)}
														</div>
													</td>
													<td style={{ padding: "10px 8px" }}>
														<select
															value={b.status || "pending"}
															onChange={(e) =>
																handleUpdateBookingStatus(
																	b._id,
																	e.target.value,
																)
															}
															style={{
																padding: "5px 8px",
																borderRadius: 6,
																border: "1px solid #d1d5db",
																fontSize: 12,
																fontWeight: 600,
																background:
																	b.status === "scheduled" ||
																	b.status === "approved"
																		? "#dcfce7"
																		: b.status === "pending"
																			? "#fef3c7"
																			: "#f9fafb",
															}}
														>
															{BOOKING_STATUS_OPTIONS.map((opt) => (
																<option key={opt.value} value={opt.value}>
																	{opt.label}
																</option>
															))}
														</select>
													</td>
													<td style={{ padding: "10px 8px" }}>
														<div
															style={{
																display: "flex",
																gap: 6,
																flexWrap: "wrap",
															}}
														>
															{!isApproved && (
																<button
																	type="button"
																	disabled={
																		busyActionId ===
																		`${b._id}:approve_recording`
																	}
																	onClick={() =>
																		handleBookingManage(
																			b._id,
																			"approve_recording",
																		)
																	}
																	style={{
																		...btnStyle,
																		background: "#059669",
																		borderColor: "#059669",
																		color: "#fff",
																	}}
																	title="Approve recording hold on Google Calendar and send StreamYard link (https://streamyard.com/c4kv26is93) to guest"
																>
																	{busyActionId ===
																	`${b._id}:approve_recording`
																		? "Approving..."
																		: "✓ Approve & Send StreamYard"}
																</button>
															)}
															{b.preMeetingStatus !== "requested" &&
																b.preMeetingStatus !== "scheduled" && (
																	<button
																		type="button"
																		disabled={
																			busyActionId ===
																			`${b._id}:request_pre_meeting`
																		}
																		onClick={() =>
																			handleBookingManage(
																				b._id,
																				"request_pre_meeting",
																			)
																		}
																		style={btnStyle}
																		title="Request a 15-minute Google Meet pre-meeting with this guest"
																	>
																		📅 Request 15m Pre-Call
																	</button>
																)}
															{b.preMeetingStatus === "requested" && (
																<button
																	type="button"
																	disabled={
																		busyActionId ===
																		`${b._id}:bypass_pre_meeting`
																	}
																	onClick={() =>
																		handleBookingManage(
																			b._id,
																			"bypass_pre_meeting",
																		)
																	}
																	style={btnStyle}
																>
																	Skip Pre-Call
																</button>
															)}
															<button
																type="button"
																onClick={() =>
																	setExpandedBookingId(
																		isExpanded ? null : b._id,
																	)
																}
																style={primaryBtnStyle}
															>
																{isExpanded
																	? "Hide Details"
																	: `Topics, E-SIGN & Vault (${assetCount})`}
															</button>
															<a
																href={vaultUrl}
																target="_blank"
																rel="noreferrer"
																style={btnStyle}
																title="Open guest portal and Sanity Media Library Asset Vault"
															>
																Portal &amp; Vault ↗
															</a>
															{b.appointmentScheduleUrl && (
																<a
																	href={b.appointmentScheduleUrl}
																	target="_blank"
																	rel="noreferrer"
																	style={btnStyle}
																>
																	Calendar ↗
																</a>
															)}
															<a
																href={gmailComposeUrl}
																target="_blank"
																rel="noreferrer"
																style={btnStyle}
															>
																Email Guest ↗
															</a>
															<button
																type="button"
																onClick={() => handleConvertBookingToDeal(b)}
																style={btnStyle}
																title="Create a Sponsor Deal Room for this guest"
															>
																+ Deal Room
															</button>
															{!isArchivedBookingStatus(b.status) && (
																<button
																	type="button"
																	disabled={
																		busyActionId === `${b._id}:cancel_booking`
																	}
																	onClick={() =>
																		handleBookingManage(b._id, "cancel_booking")
																	}
																	style={{
																		...btnStyle,
																		color: "#b91c1c",
																		borderColor: "#fca5a5",
																	}}
																	title="Cancel booking and remove holds from alex@codingcat.dev and alex.patterson@sanity.io"
																>
																	✕ Cancel
																</button>
															)}
														</div>
													</td>
												</tr>
												{isExpanded && (
													<tr
														key={`${b._id}-expanded`}
														style={{
															background: "#f9fafb",
															borderBottom: "2px solid #e5e7eb",
														}}
													>
														<td colSpan={6} style={{ padding: 16 }}>
															<div
																style={{
																	display: "grid",
																	gridTemplateColumns:
																		"repeat(auto-fit, minmax(280px, 1fr))",
																	gap: 16,
																}}
															>
																<div>
																	<h4
																		style={{
																			margin: "0 0 8px",
																			fontSize: 13,
																			color: "#111827",
																		}}
																	>
																		Proposed Talking Points &amp; Session Goals:
																	</h4>
																	<pre
																		style={{
																			margin: 0,
																			whiteSpace: "pre-wrap",
																			fontFamily: "inherit",
																			fontSize: 13,
																			lineHeight: 1.5,
																			background: "#fff",
																			padding: 12,
																			borderRadius: 8,
																			border: "1px solid #e5e7eb",
																		}}
																	>
																		{b.topics || "No talking points provided."}
																	</pre>
																	<div
																		style={{
																			marginTop: 10,
																			padding: 10,
																			borderRadius: 8,
																			background: "#fff",
																			border: "1px solid #e5e7eb",
																			fontSize: 12,
																		}}
																	>
																		<div>
																			<strong>StreamYard Studio:</strong>{" "}
																			<a
																				href={
																					b.recordingUrl ||
																					"https://streamyard.com/c4kv26is93"
																				}
																				target="_blank"
																				rel="noreferrer"
																				style={{ color: "#2563eb" }}
																			>
																				{b.recordingUrl ||
																					"https://streamyard.com/c4kv26is93"}{" "}
																				↗
																			</a>
																		</div>
																		{b.preMeetingMeetUrl && (
																			<div style={{ marginTop: 4 }}>
																				<strong>
																					15m Google Meet Pre-Call:
																				</strong>{" "}
																				<a
																					href={b.preMeetingMeetUrl}
																					target="_blank"
																					rel="noreferrer"
																					style={{ color: "#059669" }}
																				>
																					{b.preMeetingMeetUrl} ↗
																				</a>{" "}
																				({formatDateTime(b.preMeetingSlotStartAt)})
																			</div>
																		)}
																	</div>
																</div>
																<div>
																	<h4
																		style={{
																			margin: "0 0 8px",
																			fontSize: 13,
																			color: "#111827",
																		}}
																	>
																		E-SIGN Media Release Signature (
																		{b.signedAt
																			? formatDateTime(b.signedAt)
																			: "Recorded"}
																		):
																	</h4>
																	{b.signatureData?.startsWith("data:image/") ? (
																		<div
																			style={{
																				background: "#fff",
																				padding: 12,
																				borderRadius: 8,
																				border: "1px solid #e5e7eb",
																				display: "inline-block",
																			}}
																		>
																			<img
																				src={b.signatureData}
																				alt={`${b.guestName} signature`}
																				style={{
																					maxHeight: 90,
																					maxWidth: "100%",
																				}}
																			/>
																		</div>
																	) : (
																		<div
																			style={{
																				background: "#fff",
																				padding: 12,
																				borderRadius: 8,
																				border: "1px solid #e5e7eb",
																				fontFamily: "serif",
																				fontSize: 20,
																				fontStyle: "italic",
																			}}
																		>
																			{b.signatureData || b.guestName}
																		</div>
																	)}
																</div>
																<div
																	style={{
																		background: "#fff",
																		padding: 12,
																		borderRadius: 8,
																		border: "1px solid #e5e7eb",
																	}}
																>
																	<div
																		style={{
																			display: "flex",
																			justifyContent: "space-between",
																			alignItems: "center",
																			marginBottom: 8,
																		}}
																	>
																		<h4
																			style={{
																				margin: 0,
																				fontSize: 13,
																				color: "#111827",
																			}}
																		>
																			📁 Sanity Media Library Vault ({assetCount}
																			)
																		</h4>
																		<button
																			type="button"
																			onClick={() =>
																				handleCopy(
																					vaultUrl,
																					`book-vault-${b._id}`,
																				)
																			}
																			style={btnStyle}
																		>
																			{copiedId === `book-vault-${b._id}`
																				? "✓ Copied"
																				: "Copy #vault URL"}
																		</button>
																	</div>
																	{assetCount === 0 ? (
																		<p
																			style={{
																				margin: "0 0 8px",
																				fontSize: 12,
																				color: "#6b7280",
																			}}
																		>
																			Guest can drop headshots, slides, or B-roll
																			at <code>{vaultUrl}</code>.
																		</p>
																	) : (
																		<ul
																			style={{
																				margin: "0 0 8px",
																				paddingLeft: 18,
																				fontSize: 12,
																				lineHeight: 1.6,
																			}}
																		>
																			{(b.sharedAssets || []).map((a, idx) => (
																				<li key={a._key || idx}>
																					<strong>{a.title}</strong> (
																					{a.uploadedBy || "partner"})
																					{(a.externalUrl || a.fileUrl) && (
																						<>
																							{" · "}
																							<a
																								href={
																									a.externalUrl || a.fileUrl
																								}
																								target="_blank"
																								rel="noreferrer"
																								style={{ color: "#2563eb" }}
																							>
																								Open ↗
																							</a>
																						</>
																					)}
																				</li>
																			))}
																		</ul>
																	)}
																	<div
																		style={{
																			display: "flex",
																			gap: 6,
																			flexWrap: "wrap",
																		}}
																	>
																		<input
																			value={vaultTitleInput[b._id] || ""}
																			onChange={(e) =>
																				setVaultTitleInput((prev) => ({
																					...prev,
																					[b._id]: e.target.value,
																				}))
																			}
																			placeholder="Asset title..."
																			style={{
																				flex: 1,
																				minWidth: 110,
																				padding: "5px 8px",
																				borderRadius: 6,
																				border: "1px solid #d1d5db",
																				fontSize: 12,
																			}}
																		/>
																		<input
																			value={vaultUrlInput[b._id] || ""}
																			onChange={(e) =>
																				setVaultUrlInput((prev) => ({
																					...prev,
																					[b._id]: e.target.value,
																				}))
																			}
																			placeholder="https://..."
																			style={{
																				flex: 1,
																				minWidth: 130,
																				padding: "5px 8px",
																				borderRadius: 6,
																				border: "1px solid #d1d5db",
																				fontSize: 12,
																			}}
																		/>
																		<button
																			type="button"
																			disabled={
																				busyActionId === `${b._id}:vault`
																			}
																			onClick={() =>
																				handleAddSharedAssetLink(
																					b._id,
																					token,
																					isPf ? "passionfroot" : "direct",
																				)
																			}
																			style={btnStyle}
																		>
																			+ Add
																		</button>
																	</div>
																</div>
															</div>
														</td>
													</tr>
												)}
											</>
										);
									})}
								</tbody>
							</table>
						</div>
					</section>
				</div>
			)}

			{/* TAB 3: DEAL ROOMS & 50/50 STRIPE BILLING */}
			{!loading && activeTab === "billing" && (
				<div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
					<section
						style={{
							padding: 20,
							border: "1px solid #e5e7eb",
							borderRadius: 12,
							background: "#fff",
						}}
					>
						<h2 style={{ marginTop: 0, fontSize: 18 }}>
							Sponsor Deal Rooms, Passionfroot Billing &amp; 50/50 Milestone
							Billing ({filteredLeads.length} / {leads.length})
						</h2>
						<p style={{ color: "#4b5563", fontSize: 13, marginBottom: 16 }}>
							Every Sponsor Deal Room at{" "}
							<code>{siteOrigin}/portal/[token]</code> includes live Google
							Calendar kickoff/recording booking, Sanity Media Library 2-Way
							Asset Vault (<code>#vault</code>), and either{" "}
							<strong>⚡ Direct 50/50 Stripe Milestone Billing</strong> or{" "}
							<strong>🌱 Passionfroot Managed Billing</strong>.
						</p>

						<div style={{ overflowX: "auto" }}>
							<table
								style={{
									width: "100%",
									borderCollapse: "collapse",
									fontSize: 13,
								}}
							>
								<thead>
									<tr
										style={{
											textAlign: "left",
											borderBottom: "2px solid #e5e7eb",
											color: "#374151",
										}}
									>
										<th style={{ padding: "10px 8px" }}>
											Company &amp; Billing Provider
										</th>
										<th style={{ padding: "10px 8px" }}>Deal Room Token</th>
										<th style={{ padding: "10px 8px" }}>
											50% Upfront Deposit / PF Gross
										</th>
										<th style={{ padding: "10px 8px" }}>
											50% Publish Balance / PF Net Payout
										</th>
										<th style={{ padding: "10px 8px" }}>Billing Actions</th>
									</tr>
								</thead>
								<tbody>
									{filteredLeads.map((lead) => {
										const token =
											lead.portalToken ||
											lead._id.replace(/^sponsorLead-/, "");
										const portalUrl = `${siteOrigin}/portal/${token}`;
										const vaultUrl = `${portalUrl}#vault`;
										const isPf =
											lead.source === "passionfroot" ||
											lead.billingProvider === "passionfroot" ||
											Boolean(lead.passionfrootCollaborationId);
										const isDepositPaid =
											Boolean(lead.depositPaidAt) ||
											lead.status === "deposit_paid" ||
											lead.status === "booked" ||
											lead.status === "paid";
										const isBalancePaid =
											Boolean(lead.balancePaidAt) || lead.status === "paid";
										const isExpanded = expandedLeadId === lead._id;

										return (
											<>
												<tr
													key={lead._id}
													style={{ borderBottom: "1px solid #f3f4f6" }}
												>
													<td style={{ padding: "10px 8px", fontWeight: 700 }}>
														<div>{lead.companyName}</div>
														<div
															style={{
																display: "flex",
																gap: 6,
																alignItems: "center",
																marginTop: 4,
															}}
														>
															<span
																style={{
																	padding: "2px 7px",
																	borderRadius: 999,
																	fontSize: 10,
																	fontWeight: 700,
																	background: isPf ? "#dcfce7" : "#ede9fe",
																	color: isPf ? "#065f46" : "#5b21b6",
																}}
															>
																{isPf
																	? "🌱 Passionfroot Escrow"
																	: "⚡ Direct Stripe 50/50"}
															</span>
															<span
																style={{
																	fontSize: 11,
																	color: "#6b7280",
																	fontWeight: 400,
																}}
															>
																{lead.contactEmail}
															</span>
														</div>
													</td>
													<td style={{ padding: "10px 8px" }}>
														<code>{token}</code>
													</td>
													<td style={{ padding: "10px 8px" }}>
														{isPf ? (
															<span
																style={{
																	fontWeight: 700,
																	color: "#374151",
																}}
															>
																Gross:{" "}
																{formatUsd(
																	lead.passionfrootGrossBudgetCents ||
																		lead.totalAmountCents,
																)}{" "}
																· <code>{lead.passionfrootStatus || "PF"}</code>
															</span>
														) : (
															<span
																style={{
																	fontWeight: 700,
																	color: isDepositPaid ? "#059669" : "#d97706",
																}}
															>
																{formatUsd(lead.depositAmountCents)} ·{" "}
																{isDepositPaid ? "✓ PAID" : "Pending"}
															</span>
														)}
													</td>
													<td style={{ padding: "10px 8px" }}>
														{isPf ? (
															<span
																style={{
																	fontWeight: 700,
																	color: "#059669",
																}}
															>
																Net Payout:{" "}
																{formatUsd(
																	lead.passionfrootNetEarningsCents ||
																		lead.totalAmountCents,
																)}
															</span>
														) : (
															<span
																style={{
																	fontWeight: 700,
																	color: isBalancePaid ? "#059669" : "#6b7280",
																}}
															>
																{formatUsd(lead.balanceAmountCents)} ·{" "}
																{isBalancePaid ? "✓ PAID" : "Due on Publish"}
															</span>
														)}
													</td>
													<td style={{ padding: "10px 8px" }}>
														<div
															style={{
																display: "flex",
																gap: 6,
																flexWrap: "wrap",
															}}
														>
															<a
																href={portalUrl}
																target="_blank"
																rel="noreferrer"
																style={primaryBtnStyle}
															>
																Open Deal Room ↗
															</a>
															<button
																type="button"
																onClick={() =>
																	handleCopy(vaultUrl, `billing-${lead._id}`)
																}
																style={btnStyle}
															>
																{copiedId === `billing-${lead._id}`
																	? "✓ Copied #vault"
																	: "Copy #vault URL"}
															</button>
															{!isPf && !isDepositPaid && (
																<button
																	type="button"
																	onClick={() =>
																		handleUpdateLeadStatus(
																			lead._id,
																			"deposit_paid",
																		)
																	}
																	style={btnStyle}
																>
																	Mark 50% Deposit Paid
																</button>
															)}
															{!isPf && isDepositPaid && !isBalancePaid && (
																<button
																	type="button"
																	onClick={() =>
																		handleUpdateLeadStatus(lead._id, "paid")
																	}
																	style={btnStyle}
																>
																	Mark 100% Paid
																</button>
															)}
															<button
																type="button"
																onClick={() =>
																	setExpandedLeadId(
																		isExpanded ? null : lead._id,
																	)
																}
																style={btnStyle}
															>
																{isExpanded
																	? "Hide Deliverables & Vault"
																	: `Deliverables (${lead.deliverables?.length || 0}) & Vault (${lead.sharedAssets?.length || 0})`}
															</button>
															{!isArchivedLeadStatus(lead.status) && (
																<button
																	type="button"
																	onClick={() =>
																		handleUpdateLeadStatus(
																			lead._id,
																			"cancelled",
																		)
																	}
																	style={{
																		...btnStyle,
																		color: "#b91c1c",
																		borderColor: "#fca5a5",
																	}}
																	title="Cancel deal and move to Archive"
																>
																	✕ Cancel
																</button>
															)}
														</div>
													</td>
												</tr>
												{isExpanded && (
													<tr
														key={`${lead._id}-deliv`}
														style={{
															background: "#f9fafb",
															borderBottom: "2px solid #e5e7eb",
														}}
													>
														<td colSpan={5} style={{ padding: 14 }}>
															<div
																style={{
																	display: "grid",
																	gridTemplateColumns:
																		"repeat(auto-fit, minmax(280px, 1fr))",
																	gap: 16,
																}}
															>
																<div>
																	<div
																		style={{
																			fontSize: 12,
																			fontWeight: 700,
																			marginBottom: 8,
																		}}
																	>
																		Campaign Deliverables for{" "}
																		{lead.companyName}:
																	</div>
																	<ul
																		style={{
																			margin: 0,
																			paddingLeft: 18,
																			fontSize: 12,
																			lineHeight: 1.7,
																		}}
																	>
																		{(lead.deliverables || []).map((d, idx) => (
																			<li key={d._key || idx}>
																				<strong>{d.title}</strong> ({d.channel})
																				: <code>{d.status}</code>
																				{d.url && (
																					<>
																						{" "}
																						·{" "}
																						<a
																							href={d.url}
																							target="_blank"
																							rel="noreferrer"
																							style={{ color: "#2563eb" }}
																						>
																							{d.url} ↗
																						</a>
																					</>
																				)}
																			</li>
																		))}
																	</ul>
																</div>
																<div>
																	<div
																		style={{
																			fontSize: 12,
																			fontWeight: 700,
																			marginBottom: 8,
																		}}
																	>
																		📁 Sanity Media Library Vault (
																		{lead.sharedAssets?.length || 0}):
																	</div>
																	<ul
																		style={{
																			margin: 0,
																			paddingLeft: 18,
																			fontSize: 12,
																			lineHeight: 1.7,
																		}}
																	>
																		{(lead.sharedAssets || []).map((a, idx) => (
																			<li key={a._key || idx}>
																				<strong>{a.title}</strong> (
																				{a.uploadedBy || "partner"} ·{" "}
																				{a.source === "passionfroot"
																					? "🌱 PF"
																					: "⚡ Direct"}
																				)
																				{(a.externalUrl || a.fileUrl) && (
																					<>
																						{" · "}
																						<a
																							href={a.externalUrl || a.fileUrl}
																							target="_blank"
																							rel="noreferrer"
																							style={{ color: "#2563eb" }}
																						>
																							Open Asset ↗
																						</a>
																					</>
																				)}
																			</li>
																		))}
																	</ul>
																</div>
															</div>
														</td>
													</tr>
												)}
											</>
										);
									})}
								</tbody>
							</table>
						</div>
					</section>
				</div>
			)}

			{/* TAB 4: CONTENT SYNDICATION & PLATFORM LINKS */}
			{!loading && activeTab === "syndication" && (
				<section
					style={{
						padding: 20,
						border: "1px solid #e5e7eb",
						borderRadius: 12,
						background: "#fff",
					}}
				>
					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							flexWrap: "wrap",
							gap: 12,
							marginBottom: 16,
						}}
					>
						<div>
							<h2 style={{ margin: 0, fontSize: 18 }}>
								Blog &amp; Podcast Cross-Platform Syndication Tracker
							</h2>
							<p style={{ margin: "4px 0 0", color: "#4b5563", fontSize: 13 }}>
								Tracks all CodingCat.dev Blog Posts and Podcast Episodes (both
								organic tutorials and sponsored launches) across YouTube,
								daily.dev Squad, Dev.to, Hashnode, AWS Builder Center, Medium,
								and Reddit (<code>{syndicationDocCount.toLocaleString()}</code>{" "}
								total platform records in Sanity).
							</p>
						</div>
						<div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
							<select
								value={syndicationFilter}
								onChange={(e) =>
									setSyndicationFilter(
										e.target.value as "all" | "missing" | "youtube",
									)
								}
								style={{
									padding: "6px 10px",
									borderRadius: 6,
									border: "1px solid #d1d5db",
									fontSize: 12,
									fontWeight: 600,
								}}
							>
								<option value="all">
									All Recent Content ({syndicatedContent.length})
								</option>
								<option value="missing">Missing Platform Links</option>
								<option value="youtube">Has YouTube Video</option>
							</select>
							<a
								href="https://daily.dev/squads/codingcatdev"
								target="_blank"
								rel="noreferrer"
								style={btnStyle}
							>
								daily.dev Squad ↗
							</a>
							<a
								href="https://dev.to/codingcatdev"
								target="_blank"
								rel="noreferrer"
								style={btnStyle}
							>
								Dev.to Org ↗
							</a>
							<a
								href="https://www.reddit.com/r/CodingCatDev/"
								target="_blank"
								rel="noreferrer"
								style={btnStyle}
							>
								r/CodingCatDev ↗
							</a>
						</div>
					</div>
					<div style={{ overflowX: "auto" }}>
						<table
							style={{
								width: "100%",
								borderCollapse: "collapse",
								fontSize: 13,
							}}
						>
							<thead>
								<tr
									style={{
										textAlign: "left",
										borderBottom: "2px solid #e5e7eb",
										color: "#374151",
									}}
								>
									<th style={{ padding: "8px 6px" }}>Date</th>
									<th style={{ padding: "8px 6px" }}>Type</th>
									<th style={{ padding: "8px 6px" }}>Title (Canonical)</th>
									<th style={{ padding: "8px 6px" }}>YouTube</th>
									<th style={{ padding: "8px 6px" }}>daily.dev Squad</th>
									<th style={{ padding: "8px 6px" }}>Dev.to</th>
									<th style={{ padding: "8px 6px" }}>Hashnode</th>
									<th style={{ padding: "8px 6px" }}>AWS Builder</th>
									<th style={{ padding: "8px 6px" }}>Medium / Reddit</th>
								</tr>
							</thead>
							<tbody>
								{filteredSyndications.map((item) => {
									const canonical = `${siteOrigin}/${item._type}/${item.slug}`;
									const hnUrl = item.hashnode
										? item.hashnode.startsWith("http")
											? item.hashnode
											: `https://hashnode.codingcat.dev/${item.hashnode}`
										: null;
									return (
										<tr
											key={item._id}
											style={{ borderBottom: "1px solid #f3f4f6" }}
										>
											<td
												style={{
													padding: "8px 6px",
													whiteSpace: "nowrap",
													color: "#6b7280",
												}}
											>
												{(item.date || "").slice(0, 10)}
											</td>
											<td style={{ padding: "8px 6px" }}>
												<span
													style={{
														fontSize: 11,
														fontWeight: 700,
														textTransform: "uppercase",
														color:
															item._type === "podcast" ? "#7c3aed" : "#2563eb",
													}}
												>
													{item._type}
												</span>
											</td>
											<td style={{ padding: "8px 6px", fontWeight: 600 }}>
												<a
													href={canonical}
													target="_blank"
													rel="noreferrer"
													style={{ color: "#111827", textDecoration: "none" }}
												>
													{item.title} ↗
												</a>
											</td>
											<td style={{ padding: "8px 6px" }}>
												{item.youtube ? (
													<a
														href={item.youtube}
														target="_blank"
														rel="noreferrer"
														style={{ color: "#dc2626", fontWeight: 600 }}
													>
														Watch ↗
													</a>
												) : (
													<span style={{ color: "#9ca3af" }}>-</span>
												)}
											</td>
											<td style={{ padding: "8px 6px" }}>
												{item.dailydev ? (
													<a
														href={item.dailydev}
														target="_blank"
														rel="noreferrer"
														style={{ color: "#7c3aed", fontWeight: 600 }}
													>
														Squad ↗
													</a>
												) : (
													<span style={{ color: "#9ca3af" }}>-</span>
												)}
											</td>
											<td style={{ padding: "8px 6px" }}>
												{item.devto ? (
													<a
														href={item.devto}
														target="_blank"
														rel="noreferrer"
														style={{ color: "#2563eb", fontWeight: 600 }}
													>
														Dev.to ↗
													</a>
												) : (
													<span style={{ color: "#9ca3af" }}>-</span>
												)}
											</td>
											<td style={{ padding: "8px 6px" }}>
												{hnUrl ? (
													<a
														href={hnUrl}
														target="_blank"
														rel="noreferrer"
														style={{ color: "#2563eb", fontWeight: 600 }}
													>
														Hashnode ↗
													</a>
												) : (
													<span style={{ color: "#9ca3af" }}>-</span>
												)}
											</td>
											<td style={{ padding: "8px 6px" }}>
												{item.awsbuilder ? (
													<a
														href={item.awsbuilder}
														target="_blank"
														rel="noreferrer"
														style={{ color: "#d97706", fontWeight: 600 }}
													>
														AWS ↗
													</a>
												) : (
													<span style={{ color: "#9ca3af" }}>-</span>
												)}
											</td>
											<td style={{ padding: "8px 6px" }}>
												{item.medium && (
													<a
														href={item.medium}
														target="_blank"
														rel="noreferrer"
														style={{ marginRight: 8, fontWeight: 600 }}
													>
														Medium ↗
													</a>
												)}
												{item.reddit && (
													<a
														href={item.reddit}
														target="_blank"
														rel="noreferrer"
														style={{ color: "#ea580c", fontWeight: 600 }}
													>
														Reddit ↗
													</a>
												)}
												{!item.medium && !item.reddit && (
													<span style={{ color: "#9ca3af" }}>-</span>
												)}
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				</section>
			)}

			{/* TAB 5: DRAFTS & TREND RADAR REVIEW QUEUE */}
			{!loading && activeTab === "drafts" && (
				<div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
					<section
						style={{
							padding: 20,
							border: "1px solid #e5e7eb",
							borderRadius: 12,
							background: "#fff",
						}}
					>
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								flexWrap: "wrap",
								gap: 12,
								marginBottom: 16,
							}}
						>
							<div>
								<h2 style={{ margin: 0, fontSize: 18 }}>
									Pending Sanity Drafts ({draftItems.length})
								</h2>
								<p style={{ margin: "4px 0 0", color: "#4b5563", fontSize: 13 }}>
									Inspect all unpublished <code>drafts.*</code> documents in
									Sanity before they are published or syndicated. Open directly
									in Sanity Studio, launch a live Draft Preview on{" "}
									<code>{siteOrigin}</code>, or delete unwanted drafts in 1
									click.
								</p>
							</div>
						</div>

						<div style={{ overflowX: "auto" }}>
							<table
								style={{
									width: "100%",
									borderCollapse: "collapse",
									fontSize: 13,
								}}
							>
								<thead>
									<tr
										style={{
											textAlign: "left",
											borderBottom: "2px solid #e5e7eb",
											color: "#374151",
										}}
									>
										<th style={{ padding: "8px 6px" }}>Updated</th>
										<th style={{ padding: "8px 6px" }}>Type</th>
										<th style={{ padding: "8px 6px" }}>Draft ID &amp; Title</th>
										<th style={{ padding: "8px 6px" }}>Blocks / Cover</th>
										<th style={{ padding: "8px 6px" }}>Excerpt Preview</th>
										<th style={{ padding: "8px 6px" }}>Review &amp; Actions</th>
									</tr>
								</thead>
								<tbody>
									{draftItems.map((draft) => {
										const baseId = draft._id.replace(/^drafts\./, "");
										const studioHost = isDev
											? "https://codingcat-dev.sanity.studio"
											: "https://codingcat-prod.sanity.studio";
										const studioEditUrl = `${studioHost}/intent/edit/id=${encodeURIComponent(baseId)};type=${encodeURIComponent(draft._type)}/`;
										const routePrefix =
											draft._type === "podcast"
												? "/podcast/"
												: draft._type === "course"
													? "/course/"
													: "/post/";
										const previewUrl = draft.slug
											? `${siteOrigin}/api/draft-mode/enable?redirect=${encodeURIComponent(`${routePrefix}${draft.slug}`)}`
											: null;
										const hashnodeCopyUrl =
											draft.slug && draft._type === "post"
												? `https://transcripts.codingcat.dev/hashnode/${draft.slug}`
												: null;

										return (
											<tr
												key={draft._id}
												style={{ borderBottom: "1px solid #f3f4f6" }}
											>
												<td
													style={{
														padding: "10px 6px",
														whiteSpace: "nowrap",
														color: "#6b7280",
													}}
												>
													{formatDateTime(draft._updatedAt || draft._createdAt)}
												</td>
												<td style={{ padding: "10px 6px" }}>
													<span
														style={{
															fontSize: 11,
															fontWeight: 700,
															textTransform: "uppercase",
															color:
																draft._type === "podcast"
																	? "#7c3aed"
																	: "#2563eb",
														}}
													>
														{draft._type}
													</span>
												</td>
												<td style={{ padding: "10px 6px" }}>
													<div style={{ fontWeight: 700 }}>
														{draft.title || "(Untitled Draft)"}
													</div>
													<div
														style={{
															fontSize: 11,
															color: "#6b7280",
															fontFamily: "monospace",
														}}
													>
														{draft._id}
													</div>
												</td>
												<td
													style={{
														padding: "10px 6px",
														whiteSpace: "nowrap",
													}}
												>
													<span style={{ fontWeight: 600 }}>
														{draft.contentLen ?? 0} blocks
													</span>{" "}
													·{" "}
													<span
														style={{
															color: draft.hasCover ? "#059669" : "#d97706",
															fontWeight: 600,
														}}
													>
														{draft.hasCover ? "✓ Cover" : "No Cover"}
													</span>
												</td>
												<td
													style={{
														padding: "10px 6px",
														maxWidth: 320,
														color: "#4b5563",
														fontSize: 12,
													}}
												>
													{draft.excerpt || "No excerpt set."}
												</td>
												<td style={{ padding: "10px 6px" }}>
													<div
														style={{
															display: "flex",
															gap: 6,
															flexWrap: "wrap",
														}}
													>
														<a
															href={studioEditUrl}
															target="_blank"
															rel="noreferrer"
															style={primaryBtnStyle}
														>
															Open in Studio ↗
														</a>
														{previewUrl && (
															<a
																href={previewUrl}
																target="_blank"
																rel="noreferrer"
																style={btnStyle}
															>
																Live Preview ↗
															</a>
														)}
														{hashnodeCopyUrl && (
															<a
																href={hashnodeCopyUrl}
																target="_blank"
																rel="noreferrer"
																style={btnStyle}
															>
																1-Tap Copy MD ↗
															</a>
														)}
														<button
															type="button"
															onClick={() =>
																handleDeleteDraft(draft._id, draft.title)
															}
															style={{
																...btnStyle,
																color: "#dc2626",
																borderColor: "#fecaca",
																background: "#fef2f2",
															}}
														>
															Delete Draft
														</button>
													</div>
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>
					</section>

					<section
						style={{
							padding: 20,
							border: "1px solid #e5e7eb",
							borderRadius: 12,
							background: "#fff",
						}}
					>
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								flexWrap: "wrap",
								gap: 12,
								marginBottom: 16,
							}}
						>
							<div>
								<h2 style={{ margin: 0, fontSize: 18 }}>
									Trend Radar Discovery Queue ({trendSignals.length})
								</h2>
								<p style={{ margin: "4px 0 0", color: "#4b5563", fontSize: 13 }}>
									Discovered Web Dev &amp; AI signals from Hacker News, GitHub
									Trending, Google Trends, Reddit, and daily.dev. Nothing goes
									out automatically: review pre-drafted social copy here or
									dismiss noisy trends.
								</p>
							</div>
						</div>

						<div style={{ overflowX: "auto" }}>
							<table
								style={{
									width: "100%",
									borderCollapse: "collapse",
									fontSize: 13,
								}}
							>
								<thead>
									<tr
										style={{
											textAlign: "left",
											borderBottom: "2px solid #e5e7eb",
											color: "#374151",
										}}
									>
										<th style={{ padding: "8px 6px" }}>Score</th>
										<th style={{ padding: "8px 6px" }}>Source</th>
										<th style={{ padding: "8px 6px" }}>Topic &amp; Summary</th>
										<th style={{ padding: "8px 6px" }}>Status</th>
										<th style={{ padding: "8px 6px" }}>Review &amp; Social Copy</th>
									</tr>
								</thead>
								<tbody>
									{trendSignals.map((trend) => {
										const isExpanded = expandedTrendId === trend._id;
										return (
											<>
												<tr
													key={trend._id}
													style={{ borderBottom: "1px solid #f3f4f6" }}
												>
													<td
														style={{
															padding: "10px 6px",
															fontWeight: 800,
															color:
																(trend.score || 0) >= 85
																	? "#059669"
																	: "#4B2E83",
														}}
													>
														{trend.score || 0}/100
													</td>
													<td
														style={{
															padding: "10px 6px",
															whiteSpace: "nowrap",
															fontSize: 12,
															fontWeight: 600,
														}}
													>
														{trend.source || "web"}
													</td>
													<td style={{ padding: "10px 6px", maxWidth: 440 }}>
														<div style={{ fontWeight: 700 }}>
															{trend.sourceUrl ? (
																<a
																	href={trend.sourceUrl}
																	target="_blank"
																	rel="noreferrer"
																	style={{
																		color: "#111827",
																		textDecoration: "none",
																	}}
																>
																	{trend.title} ↗
																</a>
															) : (
																trend.title
															)}
														</div>
														<div
															style={{
																fontSize: 12,
																color: "#6b7280",
																marginTop: 2,
															}}
														>
															{trend.summary || trend.rawMetrics}
														</div>
													</td>
													<td style={{ padding: "10px 6px" }}>
														<select
															value={trend.status || "discovered"}
															onChange={(e) =>
																handleUpdateTrendStatus(
																	trend._id,
																	e.target.value,
																)
															}
															style={{
																padding: "5px 8px",
																borderRadius: 6,
																border: "1px solid #d1d5db",
																fontSize: 12,
																fontWeight: 600,
															}}
														>
															<option value="discovered">Discovered</option>
															<option value="drafted">Approved / Drafted</option>
															<option value="shared">Shared on Social</option>
															<option value="ignored">Ignored</option>
														</select>
													</td>
													<td style={{ padding: "10px 6px" }}>
														<div
															style={{
																display: "flex",
																gap: 6,
																flexWrap: "wrap",
															}}
														>
															<button
																type="button"
																onClick={() =>
																	setExpandedTrendId(
																		isExpanded ? null : trend._id,
																	)
																}
																style={primaryBtnStyle}
															>
																{isExpanded
																	? "Hide Social Copy"
																	: "Inspect Social Drafts"}
															</button>
															{trend.sourceUrl && (
																<a
																	href={trend.sourceUrl}
																	target="_blank"
																	rel="noreferrer"
																	style={btnStyle}
																>
																	Source ↗
																</a>
															)}
															<button
																type="button"
																onClick={() => handleDeleteTrend(trend._id)}
																style={{
																	...btnStyle,
																	color: "#dc2626",
																	borderColor: "#fecaca",
																	background: "#fef2f2",
																}}
															>
																Delete
															</button>
														</div>
													</td>
												</tr>
												{isExpanded && (
													<tr
														key={`${trend._id}-social`}
														style={{
															background: "#f9fafb",
															borderBottom: "2px solid #e5e7eb",
														}}
													>
														<td colSpan={5} style={{ padding: 16 }}>
															<div
																style={{
																	display: "grid",
																	gridTemplateColumns:
																		"repeat(auto-fit, minmax(280px, 1fr))",
																	gap: 12,
																}}
															>
																<div>
																	<div
																		style={{
																			display: "flex",
																			justifyContent: "space-between",
																			alignItems: "center",
																			marginBottom: 6,
																		}}
																	>
																		<strong style={{ fontSize: 12 }}>
																			X / Twitter Draft
																		</strong>
																		{trend.socialDrafts?.x && (
																			<button
																				type="button"
																				onClick={() =>
																					handleCopy(
																						trend.socialDrafts?.x || "",
																						`${trend._id}-x`,
																					)
																				}
																				style={btnStyle}
																			>
																				{copiedId === `${trend._id}-x`
																					? "✓ Copied"
																					: "Copy X"}
																			</button>
																		)}
																	</div>
																	<pre
																		style={{
																			margin: 0,
																			whiteSpace: "pre-wrap",
																			fontFamily: "inherit",
																			fontSize: 12,
																			background: "#fff",
																			padding: 10,
																			borderRadius: 6,
																			border: "1px solid #e5e7eb",
																		}}
																	>
																		{trend.socialDrafts?.x || "No X draft."}
																	</pre>
																</div>
																<div>
																	<div
																		style={{
																			display: "flex",
																			justifyContent: "space-between",
																			alignItems: "center",
																			marginBottom: 6,
																		}}
																	>
																		<strong style={{ fontSize: 12 }}>
																			LinkedIn Draft
																		</strong>
																		{trend.socialDrafts?.linkedin && (
																			<button
																				type="button"
																				onClick={() =>
																					handleCopy(
																						trend.socialDrafts?.linkedin || "",
																						`${trend._id}-li`,
																					)
																				}
																				style={btnStyle}
																			>
																				{copiedId === `${trend._id}-li`
																					? "✓ Copied"
																					: "Copy LinkedIn"}
																			</button>
																		)}
																	</div>
																	<pre
																		style={{
																			margin: 0,
																			whiteSpace: "pre-wrap",
																			fontFamily: "inherit",
																			fontSize: 12,
																			background: "#fff",
																			padding: 10,
																			borderRadius: 6,
																			border: "1px solid #e5e7eb",
																		}}
																	>
																		{trend.socialDrafts?.linkedin ||
																			"No LinkedIn draft."}
																	</pre>
																</div>
															</div>
														</td>
													</tr>
												)}
											</>
										);
									})}
								</tbody>
							</table>
						</div>
					</section>
				</div>
			)}
		</div>
	);
}
