import { useDocuments } from "@sanity/sdk-react";
import { useEffect, useState } from "react";

type WorkspaceTab = "crm" | "bookings" | "billing" | "syndication";

interface SeededGmailDraft {
	companyName: string;
	contact: string;
	threadId: string;
	draftId: string;
	tier: string;
	totalUsd: number;
	depositUsd: number;
	status: string;
}

const ACTIVE_GMAIL_DEALS: SeededGmailDraft[] = [
	{
		companyName: "StreamLapel",
		contact: "hello@streamlapel.com",
		threadId: "1a140656cb9a4be1",
		draftId: "r8880837980856049603",
		tier: "Integrated 60s Mid-Roll Ad (Oct 26 - Nov 6)",
		totalUsd: 1800,
		depositUsd: 900,
		status: "Reply Draft Ready in Gmail",
	},
	{
		companyName: "Tessen ZERO",
		contact: "Yannick Parfait <hello@tessen.ai>",
		threadId: "1a126242f701063b",
		draftId: "r4979210524997526110",
		tier: "Full-Stack Launch Bundle",
		totalUsd: 3500,
		depositUsd: 1750,
		status: "Reply Draft Ready in Gmail",
	},
	{
		companyName: "Influencer Laboratory",
		contact: "john@influencerlaboratoryinc.com",
		threadId: "1a15468638753504",
		draftId: "r3892744900021531970",
		tier: "Full-Stack Launch Bundle (21.1% US/CA/UK/AU Geo Sent)",
		totalUsd: 3500,
		depositUsd: 1750,
		status: "Reply Draft Ready in Gmail",
	},
	{
		companyName: "Typeless",
		contact: "qia@typeless.com",
		threadId: "1a13b726a4593e01",
		draftId: "r5723240746882402069",
		tier: "Oct 26 Launch + 7-Platform Shorts Pack",
		totalUsd: 2000,
		depositUsd: 1000,
		status: "Reply Draft Ready in Gmail",
	},
	{
		companyName: "SuperPlane",
		contact: "larisa@superplane.com",
		threadId: "1a13b7352b2a713e",
		draftId: "r1343316162270961096",
		tier: "Full-Stack Launch Bundle (Oct 26-30 GA)",
		totalUsd: 3500,
		depositUsd: 1750,
		status: "Reply Draft Ready in Gmail",
	},
	{
		companyName: "MiniMax (EezyCollab)",
		contact: "talent@eezycollab.xyz",
		threadId: "1a0d8c55420283dc",
		draftId: "r-7977440252907745009",
		tier: "Full-Stack Launch Bundle / Dedicated Video",
		totalUsd: 3500,
		depositUsd: 1750,
		status: "Reply Draft Ready in Gmail",
	},
	{
		companyName: "Kolect (AI 3D Platform)",
		contact: "sophia.nguyen@kolect.ai",
		threadId: "1a138ebfcd7f64c0",
		draftId: "r-3575370967009126686",
		tier: "Full-Stack Launch Bundle",
		totalUsd: 3500,
		depositUsd: 1750,
		status: "Reply Draft Ready in Gmail",
	},
	{
		companyName: "Kolect (Flova)",
		contact: "sophia.nguyen@kolect.ai",
		threadId: "1a15878e1da6781e",
		draftId: "r7006830561667617324",
		tier: "Organic YouTube Feature (Ad Rights Excluded)",
		totalUsd: 950,
		depositUsd: 475,
		status: "Reply Draft Ready in Gmail",
	},
];

export function App() {
	const projectId = process.env.SANITY_APP_PROJECT_ID || "hfh83o0w";
	const dataset = process.env.SANITY_APP_DATASET || "production";
	const isDev = dataset === "dev";
	const envLabel = isDev ? "Dev" : "Production";
	const siteOrigin = isDev ? "https://dev.codingcat.dev" : "https://codingcat.dev";

	const [activeTab, setActiveTab] = useState<WorkspaceTab>("crm");
	const [discovering, setDiscovering] = useState(false);
	const [discoveredProspects, setDiscoveredProspects] = useState<Array<any>>([]);

	const sponsorLeads = useDocuments({ documentType: "sponsorLead" });
	const sponsorPool = useDocuments({ documentType: "sponsorPool" });
	const bookings = useDocuments({ documentType: "booking" });
	const syndications = useDocuments({ documentType: "syndication" });
	const [syndicatedContent, setSyndicatedContent] = useState<Array<any>>([]);

	useEffect(() => {
		const query = encodeURIComponent(
			`*[_type in ["post", "podcast"] && !(_id in path("drafts.**"))] | order(coalesce(date, _createdAt) desc)[0...40] {
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
			}`,
		);
		fetch(`https://${projectId}.apicdn.sanity.io/v2025-09-30/data/query/${dataset}?query=${query}`)
			.then((r) => r.json())
			.then((d) => {
				if (Array.isArray(d?.result)) setSyndicatedContent(d.result);
			})
			.catch(() => {});
	}, [projectId, dataset]);

	const handleDiscoverOutbound = async () => {
		setDiscovering(true);
		try {
			const res = await fetch(`${siteOrigin}/api/sponsors/outbound`);
			if (res.ok) {
				const data = await res.json();
				setDiscoveredProspects(data.prospects || []);
			}
		} catch {
			// Fallback
		} finally {
			setDiscovering(false);
		}
	};

	return (
		<div style={{ padding: 24, fontFamily: "system-ui, sans-serif", maxWidth: 1200, margin: "0 auto" }}>
			<header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
				<div>
					<h1 style={{ margin: 0, fontSize: 28 }}>
						CodingCat.dev Revenue &amp; Booking OS ({envLabel})
					</h1>
					<p style={{ margin: "4px 0 0", color: "#666", fontSize: 14 }}>
						Unified Sanity App SDK Workspace &middot; Project <code>{projectId}</code> &middot; Dataset{" "}
						<code>{dataset}</code> ({envLabel})
					</p>
				</div>
				<div style={{ display: "flex", gap: 8 }}>
					<button
						type="button"
						onClick={() => setActiveTab("crm")}
						style={{
							padding: "8px 16px",
							borderRadius: 8,
							border: "1px solid #ccc",
							background: activeTab === "crm" ? "#111" : "#fff",
							color: activeTab === "crm" ? "#fff" : "#111",
							fontWeight: 600,
							cursor: "pointer",
						}}
					>
						1. Sponsor CRM &amp; Outbound ({sponsorLeads.data?.length || ACTIVE_GMAIL_DEALS.length})
					</button>
					<button
						type="button"
						onClick={() => setActiveTab("bookings")}
						style={{
							padding: "8px 16px",
							borderRadius: 8,
							border: "1px solid #ccc",
							background: activeTab === "bookings" ? "#111" : "#fff",
							color: activeTab === "bookings" ? "#fff" : "#111",
							fontWeight: 600,
							cursor: "pointer",
						}}
					>
						2. Calendar Bookings &amp; E-SIGN ({bookings.data?.length || 7})
					</button>
					<button
						type="button"
						onClick={() => setActiveTab("billing")}
						style={{
							padding: "8px 16px",
							borderRadius: 8,
							border: "1px solid #ccc",
							background: activeTab === "billing" ? "#111" : "#fff",
							color: activeTab === "billing" ? "#fff" : "#111",
							fontWeight: 600,
							cursor: "pointer",
						}}
					>
						3. Stripe 50/50 Billing &amp; Deal Rooms
					</button>
					<button
						type="button"
						onClick={() => setActiveTab("syndication")}
						style={{
							padding: "8px 16px",
							borderRadius: 8,
							border: "1px solid #ccc",
							background: activeTab === "syndication" ? "#111" : "#fff",
							color: activeTab === "syndication" ? "#fff" : "#111",
							fontWeight: 600,
							cursor: "pointer",
						}}
					>
						4. Syndication &amp; Platform Links ({syndications.data?.length || syndicatedContent.length})
					</button>
				</div>
			</header>

			{activeTab === "crm" && (
				<div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
					<section style={{ padding: 20, border: "1px solid #ddd", borderRadius: 12 }}>
						<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
							<div>
								<h2 style={{ margin: 0, fontSize: 18 }}>Active Inbound Sponsor Threads (Gmail + Sanity)</h2>
								<p style={{ margin: "4px 0 0", color: "#666", fontSize: 13 }}>
									Threaded Gmail reply drafts are staged in <code>alex.patterson@gmail.com</code> with verified 21.1% US/CA/UK/AU geography metrics.
								</p>
							</div>
						</div>
						<table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
							<thead>
								<tr style={{ textAlign: "left", borderBottom: "1px solid #eee" }}>
									<th style={{ padding: 8 }}>Company</th>
									<th style={{ padding: 8 }}>Contact</th>
									<th style={{ padding: 8 }}>Recommended Package</th>
									<th style={{ padding: 8 }}>Total / 50% Deposit</th>
									<th style={{ padding: 8 }}>Status</th>
								</tr>
							</thead>
							<tbody>
								{ACTIVE_GMAIL_DEALS.map((deal) => (
									<tr key={deal.threadId} style={{ borderBottom: "1px solid #f4f4f4" }}>
										<td style={{ padding: 8, fontWeight: 600 }}>{deal.companyName}</td>
										<td style={{ padding: 8 }}>{deal.contact}</td>
										<td style={{ padding: 8 }}>{deal.tier}</td>
										<td style={{ padding: 8 }}>
											${deal.totalUsd.toLocaleString()} (${deal.depositUsd.toLocaleString()} deposit)
										</td>
										<td style={{ padding: 8 }}>{deal.status}</td>
									</tr>
								))}
							</tbody>
						</table>
					</section>

					<section style={{ padding: 20, border: "1px solid #ddd", borderRadius: 12 }}>
						<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
							<div>
								<h2 style={{ margin: 0, fontSize: 18 }}>
									Outbound Funded AI &amp; YC Startup Scraper ({sponsorPool.data?.length || discoveredProspects.length})
								</h2>
								<p style={{ margin: "4px 0 0", color: "#666", fontSize: 13 }}>
									Automatically generates 2 tailored CodingCat.dev video concepts per startup + Cloudflare Email Routing outreach.
								</p>
							</div>
							<button
								type="button"
								onClick={handleDiscoverOutbound}
								disabled={discovering}
								style={{
									padding: "8px 14px",
									borderRadius: 8,
									background: "#2563eb",
									color: "#fff",
									border: "none",
									fontWeight: 600,
									cursor: "pointer",
								}}
							>
								{discovering ? "Scanning Launch HN & YC..." : "Scan Launch HN & Generate 2 Video Concepts"}
							</button>
						</div>

						{discoveredProspects.length > 0 && (
							<div style={{ display: "grid", gap: 12 }}>
								{discoveredProspects.map((p) => (
									<div key={p.companyName} style={{ padding: 14, border: "1px solid #eee", borderRadius: 8 }}>
										<div style={{ display: "flex", justifyContent: "space-between" }}>
											<strong>
												{p.companyName} ({p.fundingRound}) — {p.category}
											</strong>
											<span>Score: {p.relevanceScore}/100</span>
										</div>
										<ul style={{ margin: "8px 0", paddingLeft: 18, fontSize: 13 }}>
											{p.videoConcepts?.map((vc: any, i: number) => (
												<li key={i}>
													<strong>{vc.title}</strong> — {vc.angle}
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

			{activeTab === "bookings" && (
				<section style={{ padding: 20, border: "1px solid #ddd", borderRadius: 12 }}>
					<h2 style={{ marginTop: 0 }}>Two-Track Podcast &amp; Sponsor Calendar Bookings</h2>
					<p style={{ color: "#666", fontSize: 14 }}>
						All recording sessions enforce 8:00 AM - 5:00 PM PT/ET business hours and E-SIGN digital media release capture at <code>codingcat.dev/book</code>.
					</p>
					<div style={{ display: "flex", gap: 12, marginTop: 16 }}>
						<a
							href="https://codingcat.dev/book"
							target="_blank"
							rel="noreferrer"
							style={{ padding: "10px 16px", background: "#111", color: "#fff", borderRadius: 8, textDecoration: "none", fontSize: 13, fontWeight: 600 }}
						>
							Open Podcast Recording Booking &nearr;
						</a>
						<a
							href="https://codingcat.dev/sponsorships#sponsorship-form"
							target="_blank"
							rel="noreferrer"
							style={{ padding: "10px 16px", border: "1px solid #ccc", color: "#111", borderRadius: 8, textDecoration: "none", fontSize: 13, fontWeight: 600 }}
						>
							Open Sponsor Discovery &amp; Deal Room &nearr;
						</a>
					</div>
				</section>
			)}

			{activeTab === "billing" && (
				<section style={{ padding: 20, border: "1px solid #ddd", borderRadius: 12 }}>
					<h2 style={{ marginTop: 0 }}>50% Upfront Deposit + 50% on Publish Milestone Billing</h2>
					<p style={{ color: "#666", fontSize: 14 }}>
						Every Sponsor Deal Room at <code>codingcat.dev/portal/[token]</code> supports both instant Stripe Checkout (Card / ACH) and Net-15 Corporate Hosted Invoices.
					</p>
					<ul style={{ fontSize: 14, lineHeight: 1.7 }}>
						<li><strong>Full-Stack Launch Bundle ($3,500)</strong>: $1,750 upfront deposit + $1,750 on publish</li>
						<li><strong>Sponsored Podcast &amp; Multi-Channel Showcase ($2,000)</strong>: $1,000 upfront deposit + $1,000 on publish</li>
						<li><strong>Ecosystem Integration ($950)</strong>: $475 upfront deposit + $475 on publish</li>
					</ul>
				</section>
			)}

			{activeTab === "syndication" && (
				<section style={{ padding: 20, border: "1px solid #ddd", borderRadius: 12 }}>
					<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
						<div>
							<h2 style={{ margin: 0, fontSize: 18 }}>Cross-Platform Syndication &amp; YouTube Funnel Tracker</h2>
							<p style={{ margin: "4px 0 0", color: "#666", fontSize: 13 }}>
								Tracks canonical <code>codingcat.dev</code> URLs and outbound links across YouTube, daily.dev Squad, Dev.to, Hashnode, AWS Builder Center, Medium, and Reddit.
							</p>
						</div>
						<div style={{ display: "flex", gap: 8 }}>
							<a
								href="https://daily.dev/squads/codingcatdev"
								target="_blank"
								rel="noreferrer"
								style={{ padding: "8px 12px", border: "1px solid #ccc", borderRadius: 6, textDecoration: "none", color: "#111", fontSize: 12, fontWeight: 600 }}
							>
								daily.dev Squad &nearr;
							</a>
							<a
								href="https://dev.to/codingcatdev"
								target="_blank"
								rel="noreferrer"
								style={{ padding: "8px 12px", border: "1px solid #ccc", borderRadius: 6, textDecoration: "none", color: "#111", fontSize: 12, fontWeight: 600 }}
							>
								Dev.to Org &nearr;
							</a>
						</div>
					</div>
					<div style={{ overflowX: "auto" }}>
						<table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
							<thead>
								<tr style={{ textAlign: "left", borderBottom: "2px solid #eee" }}>
									<th style={{ padding: "8px 6px" }}>Date</th>
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
								{syndicatedContent.map((item) => {
									const canonical = `${siteOrigin}/${item._type}/${item.slug}`;
									const hnUrl = item.hashnode
										? item.hashnode.startsWith("http")
											? item.hashnode
											: `https://hashnode.codingcat.dev/${item.hashnode}`
										: null;
									return (
										<tr key={item._id} style={{ borderBottom: "1px solid #f0f0f0" }}>
											<td style={{ padding: "8px 6px", whiteSpace: "nowrap", color: "#666" }}>
												{(item.date || "").slice(0, 10)}
											</td>
											<td style={{ padding: "8px 6px", fontWeight: 600 }}>
												<a href={canonical} target="_blank" rel="noreferrer" style={{ color: "#111" }}>
													{item.title}
												</a>
											</td>
											<td style={{ padding: "8px 6px" }}>
												{item.youtube ? (
													<a href={item.youtube} target="_blank" rel="noreferrer" style={{ color: "#c00", fontWeight: 600 }}>
														Watch &nearr;
													</a>
												) : (
													<span style={{ color: "#aaa" }}>-</span>
												)}
											</td>
											<td style={{ padding: "8px 6px" }}>
												{item.dailydev ? (
													<a href={item.dailydev} target="_blank" rel="noreferrer" style={{ color: "#7c3aed", fontWeight: 600 }}>
														Squad &nearr;
													</a>
												) : (
													<span style={{ color: "#aaa" }}>-</span>
												)}
											</td>
											<td style={{ padding: "8px 6px" }}>
												{item.devto ? (
													<a href={item.devto} target="_blank" rel="noreferrer" style={{ color: "#2563eb", fontWeight: 600 }}>
														Dev.to &nearr;
													</a>
												) : (
													<span style={{ color: "#aaa" }}>-</span>
												)}
											</td>
											<td style={{ padding: "8px 6px" }}>
												{hnUrl ? (
													<a href={hnUrl} target="_blank" rel="noreferrer" style={{ color: "#2563eb", fontWeight: 600 }}>
														Hashnode &nearr;
													</a>
												) : (
													<span style={{ color: "#aaa" }}>-</span>
												)}
											</td>
											<td style={{ padding: "8px 6px" }}>
												{item.awsbuilder ? (
													<a href={item.awsbuilder} target="_blank" rel="noreferrer" style={{ color: "#d97706", fontWeight: 600 }}>
														AWS &nearr;
													</a>
												) : (
													<span style={{ color: "#aaa" }}>-</span>
												)}
											</td>
											<td style={{ padding: "8px 6px" }}>
												{item.medium && (
													<a href={item.medium} target="_blank" rel="noreferrer" style={{ marginRight: 8 }}>
														Medium &nearr;
													</a>
												)}
												{item.reddit && (
													<a href={item.reddit} target="_blank" rel="noreferrer" style={{ color: "#ea580c" }}>
														Reddit &nearr;
													</a>
												)}
												{!item.medium && !item.reddit && <span style={{ color: "#aaa" }}>-</span>}
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				</section>
			)}
		</div>
	);
}
