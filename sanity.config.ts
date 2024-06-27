"use client";
/**
 * This config is used to set up Sanity Studio that's mounted on the `app/(sanity)/studio/[[...tool]]/page.tsx` route
 */
import { visionTool } from "@sanity/vision";
import { PluginOptions, defineConfig } from "sanity";
import { cloudinarySchemaPlugin } from "sanity-plugin-cloudinary";
import { tags } from "sanity-plugin-tags";
import { codeInput } from "@sanity/code-input";
import { iconPicker } from "sanity-plugin-icon-picker";
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
import { structureTool } from "sanity/structure";

import { apiVersion, dataset, projectId, studioUrl } from "@/sanity/lib/api";
import { pageStructure, singletonPlugin } from "@/sanity/plugins/settings";
import { assistWithPresets } from "@/sanity/plugins/assist";
import author from "@/sanity/schemas/documents/author";
import course from "@/sanity/schemas/documents/course";
import lesson from "@/sanity/schemas/documents/lesson";
import guest from "@/sanity/schemas/documents/guest";
import page from "@/sanity/schemas/documents/page";
import podcast from "@/sanity/schemas/documents/podcast";
import podcastType from "@/sanity/schemas/documents/podcastType";
import post from "@/sanity/schemas/documents/post";
import settings from "@/sanity/schemas/singletons/settings";
import sponsor from "@/sanity/schemas/documents/sponsor";
import { resolveHref } from "@/sanity/lib/utils";

const homeLocation = {
  title: "Home",
  href: "/",
} satisfies DocumentLocation;

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
    ],
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
                  href: resolveHref("post", doc?.slug)!,
                },
                homeLocation,
              ],
            }),
          }),
        },
      },
      previewUrl: { previewMode: { enable: "/api/draft" } },
    }),
    structureTool({ structure: pageStructure([settings]) }),
    // Configures the global "new document" button, and document actions, to suit the Settings document singleton
    singletonPlugin([settings.name]),
    // Sets up AI Assist with preset prompts
    // https://www.sanity.io/docs/ai-assist
    assistWithPresets(),
    cloudinarySchemaPlugin(),
    tags(),
    codeInput(),
    iconPicker(),
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
