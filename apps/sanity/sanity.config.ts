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
import guest from "./schemas/documents/guest";
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
import syndication from "./schemas/documents/syndication";
import transcript from "./schemas/documents/transcript";

// ── Shared constants ─────────────────────────────────────────────────
const projectId = process.env.SANITY_STUDIO_PROJECT_ID || "hfh83o0w";
const apiVersion = process.env.SANITY_STUDIO_API_VERSION || "2025-09-30";

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
	switch (type) {
		case "post":
			return slug ? `/post/${slug}` : undefined;
		case "podcast":
			return slug ? `/podcast/${slug}` : undefined;
		case "page":
			return slug ? `/${slug}` : undefined;
		default:
			return undefined;
	}
}

const homeLocation = {
	title: "Home",
	href: "/",
} satisfies DocumentLocation;

// ── Shared schema types ──────────────────────────────────────────────
const schemaTypes = [
	// Portable text block types (table)
	tableSchema,
	rowType,
	// Singletons
	settings,
	sponsorConfig,
	// Documents
	author,
	guest,
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
												// biome-ignore lint/style/noNonNullAssertion: resolveHref returns string for known types
												href: resolveHref("post", doc?.slug)!,
											},
											homeLocation,
										],
									}),
								}),
								podcast: defineLocations({
									select: {
										title: "title",
										slug: "slug.current",
									},
									resolve: (doc) => ({
										locations: [
											{
												title: doc?.title || "Untitled",
												// biome-ignore lint/style/noNonNullAssertion: resolveHref returns string for known types
												href: resolveHref("podcast", doc?.slug)!,
											},
											homeLocation,
										],
									}),
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

const devWorkspace = {
	name: "dev",
	title: "CodingCat.dev (Dev)",
	projectId,
	dataset: "dev",
	basePath: targetDataset === "dev" ? "/" : "/dev",
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
