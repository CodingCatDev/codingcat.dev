import { CogIcon } from "@sanity/icons/Cog";
import { DocumentTextIcon } from "@sanity/icons/DocumentText";
import { UserIcon } from "@sanity/icons/User";
import { FaCat, FaFire, FaPodcast, FaRocket, FaShareAlt } from "react-icons/fa";
import { HiOutlineDocumentText, HiOutlinePencilAlt } from "react-icons/hi";
import { PiCurrencyDollarSimpleFill } from "react-icons/pi";
import type { StructureResolver } from "sanity/structure";

const MANAGED_DOCUMENT_TYPES = new Set([
	"settings",
	"sponsorConfig",
	"booking",
	"sponsorLead",
	"sponsorPool",
	"post",
	"podcast",
	"podcastType",
	"page",
	"author",
	"guest",
	"sponsor",
	"transcript",
	"syndication",
	"trendSignal",
	"media.tag",
]);

export const editorialStructure: StructureResolver = (S) =>
	S.list()
		.title("Editorial Hub")
		.items([
			// 1. Singleton Settings
			S.listItem()
				.title("Site Settings")
				.icon(CogIcon)
				.child(
					S.document()
						.schemaType("settings")
						.documentId("settings")
						.title("Site Settings"),
				),

			S.divider(),

			// 2. Publishing & Release Readiness
			S.listItem()
				.title("Publishing & Release Readiness")
				.icon(FaRocket)
				.child(
					S.list()
						.title("Publishing & Release Readiness")
						.items([
							S.listItem()
								.title("Drafts (In Progress)")
								.child(
									S.documentList()
										.title("Drafts (In Progress)")
										.filter(
											'_type in ["post", "podcast"] && (_id in path("drafts.**") || _originalId in path("drafts.**"))',
										)
										.defaultOrdering([
											{ field: "_updatedAt", direction: "desc" },
										]),
								),
							S.listItem()
								.title("In Content Releases")
								.child(
									S.documentList()
										.title("In Content Releases")
										.filter(
											'_type in ["post", "podcast"] && (_id in path("versions.**") || _originalId in path("versions.**"))',
										)
										.defaultOrdering([
											{ field: "_updatedAt", direction: "desc" },
										]),
								),
							S.listItem()
								.title("Missing Cover / Excerpt / Body")
								.child(
									S.documentList()
										.title("Missing Cover / Excerpt / Body")
										.filter(
											'_type in ["post", "podcast"] && (!defined(coverImage) || !defined(excerpt) || !defined(content))',
										)
										.defaultOrdering([{ field: "date", direction: "desc" }]),
								),
						]),
				),

			S.divider(),

			// 2b. Bookings & Sponsor CRM
			S.listItem()
				.title("Bookings & Sponsor CRM")
				.icon(PiCurrencyDollarSimpleFill)
				.child(
					S.list()
						.title("Bookings & Sponsor CRM")
						.items([
							S.listItem()
								.title("All Podcast & Sponsor Bookings")
								.icon(FaPodcast)
								.child(
									S.documentList()
										.title("All Bookings")
										.schemaType("booking")
										.apiVersion("2025-02-19")
										.filter(
											'_type == "booking" && (_id in path("private.**") || _id in path("*"))',
										)
										.defaultOrdering([
											{ field: "slotStartAt", direction: "desc" },
										]),
								),
							S.listItem()
								.title("Pending Booking Holds (Needs Review)")
								.child(
									S.documentList()
										.title("Pending Booking Holds")
										.schemaType("booking")
										.apiVersion("2025-02-19")
										.filter(
											'_type == "booking" && status == "pending" && (_id in path("private.**") || _id in path("*"))',
										)
										.defaultOrdering([
											{ field: "_createdAt", direction: "desc" },
										]),
								),
							S.listItem()
								.title("Confirmed / Scheduled Bookings")
								.child(
									S.documentList()
										.title("Confirmed Bookings")
										.schemaType("booking")
										.apiVersion("2025-02-19")
										.filter(
											'_type == "booking" && status in ["approved", "scheduled"] && (_id in path("private.**") || _id in path("*"))',
										)
										.defaultOrdering([
											{ field: "slotStartAt", direction: "asc" },
										]),
								),
							S.divider(),
							S.listItem()
								.title("All Sponsor Leads & Deal Rooms")
								.icon(PiCurrencyDollarSimpleFill)
								.child(
									S.documentList()
										.title("Sponsor Leads & Deal Rooms")
										.schemaType("sponsorLead")
										.apiVersion("2025-02-19")
										.filter(
											'_type == "sponsorLead" && (_id in path("private.**") || _id in path("*"))',
										)
										.defaultOrdering([
											{ field: "_updatedAt", direction: "desc" },
										]),
								),
							S.listItem()
								.title("Active Sponsor Deals (Gmail & Inbound)")
								.child(
									S.documentList()
										.title("Active Sponsor Deals")
										.schemaType("sponsorLead")
										.apiVersion("2025-02-19")
										.filter(
											'_type == "sponsorLead" && status in ["new", "contacted", "replied", "negotiating", "deposit_sent"] && (_id in path("private.**") || _id in path("*"))',
										),
								),
							S.listItem()
								.title("Paid / In Production Deals")
								.child(
									S.documentList()
										.title("Paid / In Production")
										.schemaType("sponsorLead")
										.apiVersion("2025-02-19")
										.filter(
											'_type == "sponsorLead" && status in ["deposit_paid", "booked", "balance_sent", "paid"] && (_id in path("private.**") || _id in path("*"))',
										),
								),
							S.listItem()
								.title("Outbound Prospects (Sponsor Pool)")
								.child(
									S.documentList()
										.title("Outbound Prospects")
										.schemaType("sponsorPool")
										.apiVersion("2025-02-19")
										.filter(
											'_type == "sponsorPool" && (_id in path("private.**") || _id in path("*"))',
										),
								),
							S.divider(),
							S.listItem()
								.title("Sponsor Rate Card & Config")
								.icon(CogIcon)
								.child(
									S.document()
										.schemaType("sponsorConfig")
										.documentId("sponsorConfig")
										.title("Sponsor Rate Card & Config"),
								),
						]),
				),

			S.divider(),

			// 3. Core Content
			S.listItem()
				.title("Posts")
				.icon(HiOutlinePencilAlt)
				.child(
					S.list()
						.title("Posts")
						.items([
							S.listItem()
								.title("All Posts")
								.icon(HiOutlinePencilAlt)
								.child(
									S.documentTypeList("post")
										.title("All Posts")
										.defaultOrdering([{ field: "date", direction: "desc" }]),
								),
							S.listItem()
								.title("Draft Posts")
								.child(
									S.documentList()
										.title("Draft Posts")
										.schemaType("post")
										.filter(
											'_type == "post" && (_id in path("drafts.**") || _originalId in path("drafts.**"))',
										)
										.defaultOrdering([
											{ field: "_updatedAt", direction: "desc" },
										]),
								),
							S.divider(),
							S.listItem()
								.title("Missing Cover / Excerpt / Body")
								.child(
									S.documentList()
										.title("Missing Cover / Excerpt / Body")
										.schemaType("post")
										.filter(
											'_type == "post" && (!defined(coverImage) || !defined(excerpt) || !defined(content))',
										),
								),
							S.listItem()
								.title("Missing YouTube")
								.child(
									S.documentList()
										.title("Missing YouTube")
										.schemaType("post")
										.filter('_type == "post" && !defined(youtube)'),
								),
							S.listItem()
								.title("Missing Dev.to")
								.child(
									S.documentList()
										.title("Missing Dev.to")
										.schemaType("post")
										.filter('_type == "post" && !defined(devto)'),
								),
							S.listItem()
								.title("Missing Hashnode")
								.child(
									S.documentList()
										.title("Missing Hashnode")
										.schemaType("post")
										.filter('_type == "post" && !defined(hashnode)'),
								),
							S.listItem()
								.title("Missing daily.dev Squad")
								.child(
									S.documentList()
										.title("Missing daily.dev Squad")
										.schemaType("post")
										.filter('_type == "post" && !defined(dailydev)'),
								),
							S.listItem()
								.title("Missing AWS Builder Center (AWS Tagged)")
								.child(
									S.documentList()
										.title("Missing AWS Builder Center (AWS Tagged)")
										.schemaType("post")
										.filter(
											'_type == "post" && "aws" in tags[].value && !defined(awsbuilder)',
										),
								),
						]),
				),

			S.listItem()
				.title("Podcasts")
				.icon(FaPodcast)
				.child(
					S.list()
						.title("Podcasts")
						.items([
							S.listItem()
								.title("All Episodes")
								.icon(FaPodcast)
								.child(
									S.documentTypeList("podcast")
										.title("All Episodes")
										.defaultOrdering([
											{ field: "season", direction: "desc" },
											{ field: "episode", direction: "desc" },
										]),
								),
							S.listItem()
								.title("Drafts & Upcoming Episodes")
								.child(
									S.documentList()
										.title("Drafts & Upcoming Episodes")
										.schemaType("podcast")
										.filter(
											'_type == "podcast" && (_id in path("drafts.**") || _originalId in path("drafts.**"))',
										)
										.defaultOrdering([
											{ field: "_updatedAt", direction: "desc" },
										]),
								),
							S.divider(),
							S.listItem()
								.title("Needs Release Checklist")
								.child(
									S.documentList()
										.title("Needs Release Checklist")
										.schemaType("podcast")
										.filter(
											'_type == "podcast" && (!defined(coverImage) || !defined(youtube) || !defined(spotify) || !defined(excerpt))',
										)
										.defaultOrdering([
											{ field: "season", direction: "desc" },
											{ field: "episode", direction: "desc" },
										]),
								),
							S.listItem()
								.title("Missing YouTube")
								.child(
									S.documentList()
										.title("Missing YouTube")
										.schemaType("podcast")
										.filter('_type == "podcast" && !defined(youtube)'),
								),
							S.listItem()
								.title("Missing Spotify / RSS")
								.child(
									S.documentList()
										.title("Missing Spotify / RSS")
										.schemaType("podcast")
										.filter('_type == "podcast" && !defined(spotify)'),
								),
							S.listItem()
								.title("Missing Transcript")
								.child(
									S.documentList()
										.title("Missing Transcript")
										.schemaType("podcast")
										.filter('_type == "podcast" && !defined(transcript)'),
								),
							S.listItem()
								.title("Missing Season or Episode")
								.child(
									S.documentList()
										.title("Missing Season or Episode")
										.schemaType("podcast")
										.filter(
											'_type == "podcast" && (!defined(season) || !defined(episode))',
										),
								),
							S.listItem()
								.title("Missing Dev.to")
								.child(
									S.documentList()
										.title("Missing Dev.to")
										.schemaType("podcast")
										.filter('_type == "podcast" && !defined(devto)'),
								),
							S.listItem()
								.title("Missing Hashnode")
								.child(
									S.documentList()
										.title("Missing Hashnode")
										.schemaType("podcast")
										.filter('_type == "podcast" && !defined(hashnode)'),
								),
							S.listItem()
								.title("Missing daily.dev Squad")
								.child(
									S.documentList()
										.title("Missing daily.dev Squad")
										.schemaType("podcast")
										.filter('_type == "podcast" && !defined(dailydev)'),
								),
							S.listItem()
								.title("Missing AWS Builder Center (AWS Tagged)")
								.child(
									S.documentList()
										.title("Missing AWS Builder Center (AWS Tagged)")
										.schemaType("podcast")
										.filter(
											'_type == "podcast" && "aws" in tags[].value && !defined(awsbuilder)',
										),
								),
						]),
				),

			S.documentTypeListItem("page").title("Pages").icon(DocumentTextIcon),

			S.divider(),

			// 4. People & Sponsors
			S.documentTypeListItem("author")
				.title("Authors")
				.icon(FaCat),
			S.documentTypeListItem("guest").title("Guests").icon(UserIcon),
			S.documentTypeListItem("sponsor")
				.title("Sponsors")
				.icon(PiCurrencyDollarSimpleFill),

			S.divider(),

			// 5. Automation & Intelligence
			S.listItem()
				.title("Trend Radar (Web Dev & AI)")
				.icon(FaFire)
				.child(
					S.list()
						.title("Web Dev & AI Trend Radar")
						.items([
							S.listItem()
								.title("All Discovered Trends (Ranked)")
								.icon(FaFire)
								.child(
									S.documentList()
										.title("All Discovered Trends")
										.schemaType("trendSignal")
										.apiVersion("2025-02-19")
										.filter(
											'_type == "trendSignal" && (_id in path("trend.**") || _id in path("*"))',
										)
										.defaultOrdering([
											{ field: "score", direction: "desc" },
											{ field: "discoveredAt", direction: "desc" },
										]),
								),
							S.listItem()
								.title("Drafts Created (Ready to Review)")
								.child(
									S.documentList()
										.title("Drafts Created")
										.schemaType("trendSignal")
										.filter('_type == "trendSignal" && status == "drafted"')
										.defaultOrdering([
											{ field: "discoveredAt", direction: "desc" },
										]),
								),
							S.listItem()
								.title("High-Velocity Signals (Score >= 70)")
								.child(
									S.documentList()
										.title("High-Velocity Signals")
										.schemaType("trendSignal")
										.filter(
											'_type == "trendSignal" && status == "discovered" && score >= 70',
										)
										.defaultOrdering([{ field: "score", direction: "desc" }]),
								),
							S.listItem()
								.title("Published / Covered")
								.child(
									S.documentList()
										.title("Published / Covered")
										.schemaType("trendSignal")
										.filter('_type == "trendSignal" && status == "published"'),
								),
						]),
				),

			S.listItem()
				.title("Transcripts & Video Intelligence")
				.icon(HiOutlineDocumentText)
				.child(
					S.list()
						.title("Transcripts & Video Intelligence")
						.items([
							S.listItem()
								.title("All Transcripts")
								.icon(HiOutlineDocumentText)
								.child(
									S.documentTypeList("transcript")
										.title("All Transcripts")
										.defaultOrdering([
											{ field: "publishedAt", direction: "desc" },
										]),
								),
							S.listItem()
								.title("Completed")
								.child(
									S.documentList()
										.title("Completed Transcripts")
										.schemaType("transcript")
										.filter('_type == "transcript" && status == "completed"'),
								),
							S.listItem()
								.title("Missing Captions / Error")
								.child(
									S.documentList()
										.title("Missing Captions / Error")
										.schemaType("transcript")
										.filter(
											'_type == "transcript" && status in ["no_caption_available", "error"]',
										),
								),
						]),
				),

			S.listItem()
				.title("Content Syndication")
				.icon(FaShareAlt)
				.child(
					S.list()
						.title("Syndication Status & Platform Links")
						.items([
							S.listItem()
								.title("All Syndications")
								.icon(FaShareAlt)
								.child(
									S.documentTypeList("syndication").title("All Syndications"),
								),
							S.listItem()
								.title("Published")
								.child(
									S.documentList()
										.title("Published")
										.schemaType("syndication")
										.filter('_type == "syndication" && status == "published"'),
								),
							S.listItem()
								.title("Simulated Complete")
								.child(
									S.documentList()
										.title("Simulated Complete")
										.schemaType("syndication")
										.filter(
											'_type == "syndication" && status == "simulated_complete"',
										),
								),
							S.listItem()
								.title("Failed")
								.child(
									S.documentList()
										.title("Failed")
										.schemaType("syndication")
										.filter('_type == "syndication" && status == "failed"'),
								),
							S.divider(),
							S.listItem()
								.title("By Platform: YouTube")
								.child(
									S.documentList()
										.title("YouTube Links")
										.schemaType("syndication")
										.filter('_type == "syndication" && platform == "youtube"'),
								),
							S.listItem()
								.title("By Platform: daily.dev Squad")
								.child(
									S.documentList()
										.title("daily.dev Squad Links")
										.schemaType("syndication")
										.filter('_type == "syndication" && platform == "dailydev"'),
								),
							S.listItem()
								.title("By Platform: Dev.to")
								.child(
									S.documentList()
										.title("Dev.to Links")
										.schemaType("syndication")
										.filter('_type == "syndication" && platform == "devto"'),
								),
							S.listItem()
								.title("By Platform: Hashnode")
								.child(
									S.documentList()
										.title("Hashnode Links")
										.schemaType("syndication")
										.filter('_type == "syndication" && platform == "hashnode"'),
								),
							S.listItem()
								.title("By Platform: AWS Builder Center")
								.child(
									S.documentList()
										.title("AWS Builder Center Links")
										.schemaType("syndication")
										.filter(
											'_type == "syndication" && platform == "awsbuilder"',
										),
								),
							S.listItem()
								.title("By Platform: Medium")
								.child(
									S.documentList()
										.title("Medium Links")
										.schemaType("syndication")
										.filter('_type == "syndication" && platform == "medium"'),
								),
							S.listItem()
								.title("By Platform: Reddit (r/CodingCatDev)")
								.child(
									S.documentList()
										.title("Reddit Links")
										.schemaType("syndication")
										.filter('_type == "syndication" && platform == "reddit"'),
								),
						]),
				),

			// Catch-all for any future ungrouped document types
			...S.documentTypeListItems().filter(
				(listItem) => !MANAGED_DOCUMENT_TYPES.has(listItem.getId() as string),
			),
		]);
