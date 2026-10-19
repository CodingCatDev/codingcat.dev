import { CogIcon } from "@sanity/icons/Cog";
import { DocumentTextIcon } from "@sanity/icons/DocumentText";
import { UserIcon } from "@sanity/icons/User";
import { FaCat, FaPodcast, FaRocket, FaShareAlt } from "react-icons/fa";
import { HiOutlineDocumentText, HiOutlinePencilAlt } from "react-icons/hi";
import { PiCurrencyDollarSimpleFill } from "react-icons/pi";
import type { StructureResolver } from "sanity/structure";

const MANAGED_DOCUMENT_TYPES = new Set([
	"settings",
	"post",
	"podcast",
	"podcastType",
	"page",
	"author",
	"guest",
	"sponsor",
	"transcript",
	"syndication",
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
											'_type in ["post", "podcast"] && _id in path("drafts.**")',
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
											'_type in ["post", "podcast"] && _id in path("versions.**")',
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
										.filter('_type == "post" && _id in path("drafts.**")')
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
										.filter('_type == "podcast" && _id in path("drafts.**")')
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
						]),
				),

			S.documentTypeListItem("page").title("Pages").icon(DocumentTextIcon),

			S.divider(),

			// 4. People & Sponsors
			S.documentTypeListItem("author").title("Authors").icon(FaCat),
			S.documentTypeListItem("guest").title("Guests").icon(UserIcon),
			S.documentTypeListItem("sponsor")
				.title("Sponsors")
				.icon(PiCurrencyDollarSimpleFill),

			S.divider(),

			// 5. Automation & Intelligence
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
						.title("Syndication Status")
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
						]),
				),

			// Catch-all for any future ungrouped document types
			...S.documentTypeListItems().filter(
				(listItem) => !MANAGED_DOCUMENT_TYPES.has(listItem.getId() as string),
			),
		]);
