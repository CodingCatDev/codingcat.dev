/**
 * Sanity Studio configuration for standalone deployment
 * Migrated from Next.js embedded studio to standalone Sanity Studio app
 */
import { visionTool } from "@sanity/vision";
import { type PluginOptions, defineConfig } from "sanity";
import { codeInput } from "@sanity/code-input";
import { podcastRss } from "@codingcatdev/sanity-plugin-podcast-rss";
import { media } from "sanity-plugin-media";

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

import { pageStructure, singletonPlugin } from "./plugins/settings";
import { sharePreviewAction } from "./components/documentActions/sharePreviewAction";
import { assistWithPresets } from "./plugins/assist";
import author from "./schemas/documents/author";
import previewSession from "./schemas/previewSession";
import guest from "./schemas/documents/guest";
import page from "./schemas/documents/page";
import podcast from "./schemas/documents/podcast";
import podcastType from "./schemas/documents/podcastType";
import post from "./schemas/documents/post";
import settings from "./schemas/singletons/settings";
import engineConfig from "./schemas/singletons/engineConfig";
import sponsor from "./schemas/documents/sponsor";

import sponsorshipRequest from "./schemas/documents/sponsorshipRequest";
import contentIdea from "./schemas/documents/contentIdea";
import automatedVideo from "./schemas/documents/automatedVideo";
import mediaAsset from "./schemas/documents/mediaAsset";
import videoAnalytics from "./schemas/documents/videoAnalytics";
import sponsorLead from "./schemas/documents/sponsorLead";
import sponsorPool from "./schemas/documents/sponsorPool";
import tableSchema, { rowType } from "./schemas/custom/table";

// Sanity Studio env vars (SANITY_STUDIO_ prefix is auto-exposed by Sanity CLI)
const projectId = process.env.SANITY_STUDIO_PROJECT_ID || "hfh83o0w";
const dataset = process.env.SANITY_STUDIO_DATASET || "production";
const apiVersion = process.env.SANITY_STUDIO_API_VERSION || "2025-09-30";
const studioUrl = "/";
// Set SANITY_STUDIO_DISABLE_PRESENTATION=true if you get network errors to api.sanity.io (e.g. firewall/VPN)
const presentationEnabled =
	process.env.SANITY_STUDIO_DISABLE_PRESENTATION !== "true";

function resolveHref(type: string, slug?: string): string | undefined {
  switch (type) {
    case "post":
      return slug ? `/post/${slug}` : undefined;
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
      ]);
  };
};

export default defineConfig({
  basePath: studioUrl,
  projectId,
  dataset,
  schema: {
    types: [
      // Portable text block types (table)
      tableSchema,
      rowType,
      // Singletons
      settings,
      engineConfig,
      // Documents
      author,
      guest,
      page,
      podcast,
      podcastType,
      post,
      sponsor,
      previewSession,
      sponsorshipRequest,
      contentIdea,
      automatedVideo,
      mediaAsset,
      videoAnalytics,
      sponsorLead,
      sponsorPool,
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
    ...(presentationEnabled
      ? [
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
                        // biome-ignore lint/style/noNonNullAssertion: resolveHref returns string for known types
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
        ]
      : []),
    structureTool({ structure: podcastStructure() }),
    // Configures the global "new document" button, and document actions, to suit the Settings document singleton
    singletonPlugin([
      settings.name,
      engineConfig.name,
    ]),
    // Sets up AI Assist with preset prompts
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
    // Vision lets you query your content with GROQ in the studio
    visionTool({ defaultApiVersion: apiVersion }),
  ].filter(Boolean) as PluginOptions[],
});
