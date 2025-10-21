"use client";
/**
 * This config is used to set up Sanity Studio that's mounted on the `app/(sanity)/studio/[[...tool]]/page.tsx` route
 */
import { visionTool } from "@sanity/vision";
import { type PluginOptions, defineConfig } from "sanity";
import { cloudinarySchemaPlugin } from "sanity-plugin-cloudinary";
// import { tags } from "sanity-plugin-tags";
import { codeInput } from "@sanity/code-input";
// import { iconPicker } from "sanity-plugin-icon-picker" https://github.com/christopherafbjur/sanity-plugin-icon-picker/issues/73;
import { podcastRss } from "@codingcatdev/sanity-plugin-podcast-rss";

// TODO: Review for possible plugins
// import {draftReviewPluginV3} from 'sanity-plugin-draft-review-v3'
// https://github.com/jamesreaco/inbox-tool-sanity
// https://www.sanity.io/plugins/vercel-deploy
// https://github.com/sanity-io/document-internationalization

import {
	presentationTool,
	defineDocuments,
	defineLocations,
	type DocumentLocation,
} from "sanity/presentation";
import {
	DocumentTypeListBuilder,
	type StructureResolver,
	structureTool,
} from "sanity/structure";

import { apiVersion, dataset, projectId, studioUrl } from "@/sanity/lib/api";
import { pageStructure, singletonPlugin } from "@/sanity/plugins/settings";
import { sharePreviewAction } from "@/sanity/components/documentActions/sharePreviewAction";
import { assistWithPresets } from "@/sanity/plugins/assist";
import author from "@/sanity/schemas/documents/author";
import previewSession from "@/sanity/schemas/previewSession";
import course from "@/sanity/schemas/documents/course";
import lesson from "@/sanity/schemas/documents/lesson";
import guest from "@/sanity/schemas/documents/guest";
import page from "@/sanity/schemas/documents/page";
import podcast from "@/sanity/schemas/documents/podcast";
import podcastType from "@/sanity/schemas/documents/podcastType";
import post from "@/sanity/schemas/documents/post";
import settings from "@/sanity/schemas/singletons/settings";
import sponsor from "@/sanity/schemas/documents/sponsor";
import sponsorshipRequest from "@/sanity/schemas/documents/sponsorshipRequest";
import youtubeUpdateTask from "@/sanity/schemas/documents/youtubeUpdateTask";
import { table } from "@sanity/table";
import { resolveHref } from "@/sanity/lib/utils";

const homeLocation = {
	title: "Home",
	href: "/",
} satisfies DocumentLocation;

export const podcastStructure = (): StructureResolver => {
	return (S) => {
		return S.list()
			.title("Content")
			.items([
				S.listItem()
					.title("Podcasts")
					.child(
						S.list()
							.title("Filters")
							.items([
								S.listItem()
									.title("By Type")
									.child(
										S.documentTypeList("podcastType")
											.title("Podcast by Type")
											.child((podcastTypeId) =>
												S.documentList()
													.title("Podcasts")
													.filter(
														'_type == "podcast" && $podcastTypeId == podcastType._ref',
													)
													.params({ podcastTypeId }),
											),
									),
								S.listItem()
									.title("Missing Hashnode")
									.child(() =>
										S.documentList()
											.title("Podcasts")
											.filter('_type == "podcast" && hashnode == null'),
									),
								S.listItem()
									.title("Missing Dev.to")
									.child(() =>
										S.documentList()
											.title("Podcasts")
											.filter('_type == "podcast" && devto == null'),
									),
								S.listItem()
									.title("Missing Season")
									.child(() =>
										S.documentList()
											.title("Podcasts")
											.filter('_type == "podcast" && season == null'),
									),
								S.listItem()
									.title("Missing Episode")
									.child(() =>
										S.documentList()
											.title("Podcasts")
											.filter('_type == "podcast" && episode == null'),
									),
								S.listItem()
									.title("Missing YouTube")
									.child(() =>
										S.documentList()
											.title("Podcasts")
											.filter('_type == "podcast" && youtube == null'),
									),
							]),
					),
				...S.documentTypeListItems(),
				// .filter(
				//   (listItem) => !['podcast'].includes(`${listItem.getId()}`)
				// ),
			]);
	};
};
export default defineConfig({
	basePath: studioUrl,
	projectId,
	dataset,
	schema: {
		types: [
			// Singletons
			settings,
			// Documents
			author,
			course,
			lesson,
			guest,
			page,
			podcast,
			podcastType,
			post,
			sponsor,
			youtubeUpdateTask,
			previewSession,
			sponsorshipRequest,
		],
	},
	document: {
		actions: (prev, context) => {
			if (context.schemaType === "post" || context.schemaType === "podcast") {
				return [sharePreviewAction, ...prev];
			}
			return prev;
		},
	},
	plugins: [
		presentationTool({
			resolve: {
				mainDocuments: defineDocuments([
					{
						route: "/post/:slug",
						filter: `_type == "post" && slug.current == $slug`,
					},
				]),
				locations: {
					settings: defineLocations({
						locations: [homeLocation],
						message: "This document is used on all pages",
						tone: "caution",
					}),
					post: defineLocations({
						select: {
							title: "title",
							slug: "slug.current",
						},
						resolve: (doc) => ({
							locations: [
								{
									title: doc?.title || "Untitled",
									// biome-ignore lint/style/noNonNullAssertion: <explanation>
									href: resolveHref("post", doc?.slug)!,
								},
								homeLocation,
							],
						}),
					}),
				},
			},
			previewUrl: {
				previewMode: {
					enable: "/api/draft-mode/enable",
					disable: "/api/draft-mode/disable",
				},
			},
		}),
		structureTool({ structure: podcastStructure() }),
		// Configures the global "new document" button, and document actions, to suit the Settings document singleton
		singletonPlugin([settings.name]),
		// Sets up AI Assist with preset prompts
		// https://www.sanity.io/docs/ai-assistPcli
		assistWithPresets(),
		table(),
		cloudinarySchemaPlugin(),
		// tags(),
		codeInput(),
		// iconPicker(),
		podcastRss({
			podcasts: [
				{
					title: "CodingCat.dev",
					url: "https://anchor.fm/s/115b203c/podcast/rss",
				},
			],
		}),
		// Vision lets you query your content with GROQ in the studio
		// https://www.sanity.io/docs/the-vision-plugin
		process.env.NODE_ENV === "development" &&
		visionTool({ defaultApiVersion: apiVersion }),
	].filter(Boolean) as PluginOptions[],
});
