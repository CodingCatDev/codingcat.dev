/**
 * Sanity Studio configuration with dev/production workspaces.
 *
 * Both workspaces share the same schemas, plugins, and structure.
 * They differ only in dataset and presentation tool preview URL.
 *
 * Workspace switcher appears in the Studio top-left corner.
 */
import { visionTool } from "@sanity/vision";
import { type PluginOptions, defineConfig } from "sanity";
import { codeInput } from "@sanity/code-input";
// Vendored from @codingcatdev/sanity-plugin-podcast-rss — see ./plugins/podcast-rss/README.md
import { podcastRss } from "./plugins/podcast-rss";
import { media } from "sanity-plugin-media";

import {
	presentationTool,
	defineDocuments,
	defineLocations,
	type DocumentLocation,
} from "sanity/presentation";
import { structureTool } from "sanity/structure";

import { singletonPlugin } from "./plugins/settings";
import { assistWithPresets } from "./plugins/assist";
import { editorialStructure } from "./structure";
import author from "./schemas/documents/author";
import course from "./schemas/documents/course";
import guest from "./schemas/documents/guest";
import lesson from "./schemas/documents/lesson";
import page from "./schemas/documents/page";
import podcast from "./schemas/documents/podcast";
import podcastType from "./schemas/documents/podcastType";
import post from "./schemas/documents/post";
import settings from "./schemas/singletons/settings";
import sponsorConfig from "./schemas/singletons/sponsorConfig";
import sponsor from "./schemas/documents/sponsor";
import sponsorLead from "./schemas/documents/sponsorLead";
import sponsorPool from "./schemas/documents/sponsorPool";
import booking from "./schemas/documents/booking";
import tableSchema, { rowType } from "./schemas/custom/table";
import tierListSchema, {
	tierDetailType,
	tierItemType,
} from "./schemas/custom/tierList";
import syndication from "./schemas/documents/syndication";
import transcript from "./schemas/documents/transcript";
import trendSignal from "./schemas/documents/trendSignal";

// ── Shared constants ─────────────────────────────────────────────────
const projectId = process.env.SANITY_STUDIO_PROJECT_ID || "hfh83o0w";
const apiVersion = process.env.SANITY_STUDIO_API_VERSION || "2025-09-30";
export const MEDIA_LIBRARY_ID =
	process.env.SANITY_STUDIO_MEDIA_LIBRARY_ID || "mlttp0BZbCpV";

export function buildMediaLibraryFilters(dataset: "production" | "dev") {
	return [
		{
			name:
				dataset === "production"
					? "Production Public Assets"
					: "Dev Sandbox Assets",
			query: `aspects.metadata.environment == "${dataset}" && aspects.metadata.visibility != "private-vault"`,
		},
		{
			name: "Editorial (Courses, Podcasts, Blog)",
			query: `aspects.metadata.environment == "${dataset}" && aspects.metadata.category == "editorial"`,
		},
		{
			name: "Guest Speaker Headshots",
			query: `aspects.metadata.environment == "${dataset}" && aspects.metadata.category == "guest"`,
		},
		{
			name: "Sponsor Logos & Creatives",
			query: `aspects.metadata.environment == "${dataset}" && aspects.metadata.category == "sponsor"`,
		},
		{
			name: "Studio Portal Vault (Private)",
			query: `aspects.metadata.environment == "${dataset}" && (aspects.metadata.category == "portal-vault" || aspects.metadata.visibility == "private-vault")`,
		},
	];
}

// Set SANITY_STUDIO_DISABLE_PRESENTATION=true if you get network errors to api.sanity.io (e.g. firewall/VPN)
const presentationEnabled =
	process.env.SANITY_STUDIO_DISABLE_PRESENTATION !== "true";

// Use local Astro dev server for presentation preview when running Studio locally
const isLocal =
	typeof import.meta !== "undefined" &&
	(import.meta as unknown as { env?: { DEV?: boolean } }).env?.DEV;
const localPreviewOrigin = "http://localhost:4321";

// ── Shared helpers ───────────────────────────────────────────────────
function resolveHref(type: string, slug?: string): string | undefined {
	if (!slug) {
		return undefined;
	}
	switch (type) {
		case "post":
			return `/post/${slug}`;
		case "podcast":
			return `/podcast/${slug}`;
		case "course":
			return `/course/${slug}`;
		case "author":
			return `/author/${slug}`;
		case "guest":
			return `/guest/${slug}`;
		case "sponsor":
			return `/sponsor/${slug}`;
		case "page":
			return `/${slug}`;
		default:
			return undefined;
	}
}

const homeLocation = {
	title: "Home",
	href: "/",
} satisfies DocumentLocation;

const blogLocation = {
	title: "Blog",
	href: "/blog",
} satisfies DocumentLocation;

const podcastsLocation = {
	title: "Podcasts",
	href: "/podcasts",
} satisfies DocumentLocation;

const coursesLocation = {
	title: "Courses",
	href: "/courses",
} satisfies DocumentLocation;

// ── Shared schema types ──────────────────────────────────────────────
const schemaTypes = [
	// Portable text block types (table & tierList)
	tableSchema,
	rowType,
	tierListSchema,
	tierItemType,
	tierDetailType,
	// Singletons
	settings,
	sponsorConfig,
	// Documents
	author,
	course,
	guest,
	lesson,
	page,
	podcast,
	podcastType,
	post,
	sponsor,
	sponsorLead,
	sponsorPool,
	booking,
	syndication,
	transcript,
	trendSignal,
];

// ── Build plugins for a given preview URL ────────────────────────────
function buildPlugins(previewUrl: string): PluginOptions[] {
	return [
		...(presentationEnabled
			? [
					presentationTool({
						resolve: {
							mainDocuments: defineDocuments([
								{
									route: "/post/:slug",
									filter: `_type == "post" && slug.current == $slug`,
								},
								{
									route: "/podcast/:slug",
									filter: `_type == "podcast" && slug.current == $slug`,
								},
								{
									route: "/course/:slug",
									filter: `_type == "course" && slug.current == $slug`,
								},
								{
									route: "/author/:slug",
									filter: `_type == "author" && slug.current == $slug`,
								},
								{
									route: "/guest/:slug",
									filter: `_type == "guest" && slug.current == $slug`,
								},
								{
									route: "/sponsor/:slug",
									filter: `_type == "sponsor" && slug.current == $slug`,
								},
								{
									route: "/:slug",
									filter: `_type == "page" && slug.current == $slug`,
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
									resolve: (doc) => {
										const href = resolveHref("post", doc?.slug);
										return {
											locations: [
												...(href
													? [
															{
																title: doc?.title || "Untitled",
																href,
															},
														]
													: []),
												blogLocation,
												homeLocation,
											],
										};
									},
								}),
								podcast: defineLocations({
									select: {
										title: "title",
										slug: "slug.current",
									},
									resolve: (doc) => {
										const href = resolveHref("podcast", doc?.slug);
										return {
											locations: [
												...(href
													? [
															{
																title: doc?.title || "Untitled",
																href,
															},
														]
													: []),
												podcastsLocation,
												homeLocation,
											],
										};
									},
								}),
								course: defineLocations({
									select: {
										title: "title",
										slug: "slug.current",
									},
									resolve: (doc) => {
										const href = resolveHref("course", doc?.slug);
										return {
											locations: [
												...(href
													? [
															{
																title: doc?.title || "Untitled",
																href,
															},
														]
													: []),
												coursesLocation,
												homeLocation,
											],
										};
									},
								}),
								page: defineLocations({
									select: {
										title: "title",
										slug: "slug.current",
									},
									resolve: (doc) => {
										const href = resolveHref("page", doc?.slug);
										return {
											locations: href
												? [
														{
															title: doc?.title || "Untitled",
															href,
														},
													]
												: [],
										};
									},
								}),
								author: defineLocations({
									select: {
										title: "title",
										slug: "slug.current",
									},
									resolve: (doc) => {
										const href = resolveHref("author", doc?.slug);
										return {
											locations: href
												? [
														{
															title: doc?.title || "Untitled",
															href,
														},
													]
												: [],
										};
									},
								}),
								guest: defineLocations({
									select: {
										title: "title",
										slug: "slug.current",
									},
									resolve: (doc) => {
										const href = resolveHref("guest", doc?.slug);
										return {
											locations: href
												? [
														{
															title: doc?.title || "Untitled",
															href,
														},
													]
												: [],
										};
									},
								}),
								sponsor: defineLocations({
									select: {
										title: "title",
										slug: "slug.current",
									},
									resolve: (doc) => {
										const href = resolveHref("sponsor", doc?.slug);
										return {
											locations: href
												? [
														{
															title: doc?.title || "Untitled",
															href,
														},
													]
												: [],
										};
									},
								}),
							},
						},
						previewUrl: {
							initial: previewUrl,
							previewMode: {
								enable: "/api/draft-mode/enable",
								disable: "/api/draft-mode/disable",
							},
						},
						// Required: allow preview iframe origin to send postMessage to Studio (visual editing)
						allowOrigins: [previewUrl],
					}),
				]
			: []),
		structureTool({ structure: editorialStructure }),
		singletonPlugin([settings.name, sponsorConfig.name]),
		assistWithPresets(),
		media(),
		codeInput(),
		podcastRss({
			podcasts: [
				{
					title: "CodingCat.dev",
					url: "https://anchor.fm/s/115b203c/podcast/rss",
				},
			],
		}),
		visionTool({ defaultApiVersion: apiVersion }),
	].filter(Boolean) as PluginOptions[];
}

// ── Workspace definitions ────────────────────────────────────────────
const targetDataset = process.env.SANITY_STUDIO_DATASET;

const sharedMediaLibraryConfig = {
	mediaLibrary: {
		enabled: true,
		libraryId: MEDIA_LIBRARY_ID,
	},
	auth: {
		loginMethod: "token" as const,
	},
};

const devWorkspace = {
	name: "dev",
	title: "CodingCat.dev (Dev)",
	projectId,
	dataset: "dev",
	basePath: targetDataset === "dev" ? "/" : "/dev",
	...sharedMediaLibraryConfig,
	schema: { types: schemaTypes },
	plugins: buildPlugins(
		isLocal ? localPreviewOrigin : "https://dev.codingcat.dev",
	),
};

const prodWorkspace = {
	name: "production",
	title: "CodingCat.dev (Production)",
	projectId,
	dataset: "production",
	basePath: targetDataset === "production" ? "/" : "/production",
	...sharedMediaLibraryConfig,
	schema: { types: schemaTypes },
	plugins: buildPlugins(
		isLocal ? localPreviewOrigin : "https://codingcat.dev",
	),
};

export default defineConfig(
	targetDataset === "dev"
		? [devWorkspace]
		: targetDataset === "production"
			? [prodWorkspace]
			: [prodWorkspace, devWorkspace],
);
