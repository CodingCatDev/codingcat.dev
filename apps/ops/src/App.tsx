import { useClient } from "@sanity/sdk-react";
import { useCallback, useEffect, useState } from "react";

type WorkspaceTab = "crm" | "bookings" | "billing" | "syndication" | "drafts";

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

interface SponsorLeadDoc {
	_id: string;
	companyName: string;
	contactName?: string;
	contactEmail: string;
	website?: string;
	portalToken?: string;
	source?: string;
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
	intent?: string;
	threadId?: string;
	notes?: string;
	deliverables?: DeliverableItem[];
}

interface BookingDoc {
	_id: string;
	_createdAt?: string;
	guestName: string;
	guestEmail: string;
	company?: string;
	socialUrl?: string;
	track?: string;
	status?: string;
	slotStartAt?: string;
	topics?: string;
	appointmentScheduleUrl?: string;
	googleCalendarEventId?: string;
	signatureMode?: "draw" | "type";
	signatureData?: string;
	signedAt?: string;
	portalToken?: string;
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
	{ value: "paid", label: "Paid in Full (100%)" },
];

const BOOKING_STATUS_OPTIONS = [
	{ value: "pending", label: "Pending Review (Hold)" },
	{ value: "approved", label: "Approved" },
	{ value: "scheduled", label: "Confirmed on Calendar" },
	{ value: "recorded", label: "Recorded" },
	{ value: "published", label: "Published" },
	{ value: "cancelled", label: "Declined / Cancelled" },
];

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

	const [activeTab, setActiveTab] = useState<WorkspaceTab>("crm");
	const [loading, setLoading] = useState(true);
	const [statusBanner, setStatusBanner] = useState<string | null>(null);
	const [copiedId, setCopiedId] = useState<string | null>(null);

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
		} catch (err: any) {
			console.error("Failed to fetch Ops data:", err);
		} finally {
			setLoading(false);
		}
	}, [client]);

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
			showFlash(`Updated booking status to "${newStatus}"`);
		} catch (err: any) {
			showFlash(`Error updating booking: ${err?.message || "Unknown error"}`);
		}
	};

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
						1. Sponsor CRM ({leads.length})
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
						2. Podcast Bookings &amp; E-SIGN ({bookings.length})
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
						3. Deal Rooms &amp; 50/50 Billing ({leads.length})
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
									Active Sponsor Deals &amp; Inbound Leads ({leads.length})
								</h2>
								<p style={{ margin: "4px 0 0", color: "#4b5563", fontSize: 13 }}>
									Click any action button to open the Gmail thread, launch the
									Sponsor Deal Room, copy the portal link, or update deal status
									in Sanity.
								</p>
							</div>
							<button
								type="button"
								onClick={() => setShowNewLeadForm((v) => !v)}
								style={primaryBtnStyle}
							>
								{showNewLeadForm ? "Cancel" : "+ New Sponsor Deal Room"}
							</button>
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
										<th style={{ padding: "10px 8px" }}>Company</th>
										<th style={{ padding: "10px 8px" }}>Contact</th>
										<th style={{ padding: "10px 8px" }}>Package &amp; Notes</th>
										<th style={{ padding: "10px 8px" }}>Total / 50% Deposit</th>
										<th style={{ padding: "10px 8px" }}>Stage (Editable)</th>
										<th style={{ padding: "10px 8px" }}>Execute / Actions</th>
									</tr>
								</thead>
								<tbody>
									{leads.map((lead) => {
										const portalUrl = lead.portalToken
											? `${siteOrigin}/portal/${lead.portalToken}`
											: `${siteOrigin}/portal/${lead._id.replace(/^sponsorLead-/, "")}`;
										const gmailUrl = lead.threadId
											? `https://mail.google.com/mail/u/0/#inbox/${lead.threadId}`
											: `https://mail.google.com/mail/u/0/#search/${encodeURIComponent(lead.contactEmail || lead.companyName)}`;

										return (
											<tr
												key={lead._id}
												style={{ borderBottom: "1px solid #f3f4f6" }}
											>
												<td style={{ padding: "10px 8px", fontWeight: 700 }}>
													{lead.companyName}
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
													{formatUsd(lead.totalAmountCents)}{" "}
													<span style={{ color: "#6b7280", fontWeight: 400 }}>
														({formatUsd(lead.depositAmountCents)} deposit)
													</span>
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
														<a
															href={gmailUrl}
															target="_blank"
															rel="noreferrer"
															style={btnStyle}
															title="Open thread or draft in Gmail"
														>
															Gmail ↗
														</a>
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
															onClick={() => handleCopy(portalUrl, lead._id)}
															style={btnStyle}
														>
															{copiedId === lead._id ? "✓ Copied" : "Copy Link"}
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
									Podcast &amp; Sponsor Calendar Bookings ({bookings.length})
								</h2>
								<p style={{ margin: "4px 0 0", color: "#4b5563", fontSize: 13 }}>
									Bookings submitted via <code>codingcat.dev/book</code> and
									synced with Google Calendar &amp; Google Tasks. Click{" "}
									<strong>Topics &amp; E-SIGN</strong> to inspect talking points
									and digital signatures.
								</p>
							</div>
							<div style={{ display: "flex", gap: 8 }}>
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
										<th style={{ padding: "10px 8px" }}>Recording Slot</th>
										<th style={{ padding: "10px 8px" }}>Guest &amp; Company</th>
										<th style={{ padding: "10px 8px" }}>Track</th>
										<th style={{ padding: "10px 8px" }}>E-SIGN Release</th>
										<th style={{ padding: "10px 8px" }}>Status (Editable)</th>
										<th style={{ padding: "10px 8px" }}>Actions</th>
									</tr>
								</thead>
								<tbody>
									{bookings.map((b) => {
										const isExpanded = expandedBookingId === b._id;
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
														{formatDateTime(b.slotStartAt || b._createdAt)}
													</td>
													<td style={{ padding: "10px 8px" }}>
														<div style={{ fontWeight: 700 }}>{b.guestName}</div>
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
															<span style={{ color: "#9ca3af", fontSize: 12 }}>
																Unsigned
															</span>
														)}
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
																	: "Topics & E-SIGN"}
															</button>
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
																		"repeat(auto-fit, minmax(300px, 1fr))",
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
							Sponsor Deal Rooms &amp; 50/50 Milestone Billing ({leads.length})
						</h2>
						<p style={{ color: "#4b5563", fontSize: 13, marginBottom: 16 }}>
							Every Sponsor Deal Room at{" "}
							<code>{siteOrigin}/portal/[token]</code> includes live Google
							Calendar kickoff/recording booking, 50% upfront deposit checkout,
							Net-15 corporate invoices, and deliverable ROI tracking.
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
										<th style={{ padding: "10px 8px" }}>Company</th>
										<th style={{ padding: "10px 8px" }}>Deal Room Token</th>
										<th style={{ padding: "10px 8px" }}>50% Upfront Deposit</th>
										<th style={{ padding: "10px 8px" }}>50% Publish Balance</th>
										<th style={{ padding: "10px 8px" }}>Billing Actions</th>
									</tr>
								</thead>
								<tbody>
									{leads.map((lead) => {
										const token =
											lead.portalToken ||
											lead._id.replace(/^sponsorLead-/, "");
										const portalUrl = `${siteOrigin}/portal/${token}`;
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
														{lead.companyName}
														<div
															style={{
																fontSize: 11,
																color: "#6b7280",
																fontWeight: 400,
															}}
														>
															{lead.contactEmail}
														</div>
													</td>
													<td style={{ padding: "10px 8px" }}>
														<code>{token}</code>
													</td>
													<td style={{ padding: "10px 8px" }}>
														<span
															style={{
																fontWeight: 700,
																color: isDepositPaid ? "#059669" : "#d97706",
															}}
														>
															{formatUsd(lead.depositAmountCents)} ·{" "}
															{isDepositPaid ? "✓ PAID" : "Pending"}
														</span>
													</td>
													<td style={{ padding: "10px 8px" }}>
														<span
															style={{
																fontWeight: 700,
																color: isBalancePaid ? "#059669" : "#6b7280",
															}}
														>
															{formatUsd(lead.balanceAmountCents)} ·{" "}
															{isBalancePaid ? "✓ PAID" : "Due on Publish"}
														</span>
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
																	handleCopy(portalUrl, `billing-${lead._id}`)
																}
																style={btnStyle}
															>
																{copiedId === `billing-${lead._id}`
																	? "✓ Copied"
																	: "Copy Portal URL"}
															</button>
															{!isDepositPaid && (
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
															{isDepositPaid && !isBalancePaid && (
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
																	? "Hide Deliverables"
																	: `Deliverables (${lead.deliverables?.length || 0})`}
															</button>
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
																	fontSize: 12,
																	fontWeight: 700,
																	marginBottom: 8,
																}}
															>
																Campaign Deliverables for {lead.companyName}:
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
																		<strong>{d.title}</strong> ({d.channel}) :{" "}
																		<code>{d.status}</code>
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
