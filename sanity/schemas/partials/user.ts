import { defineField, defineType } from "sanity";

import baseType from "./base";
import externalLink from "../custom/externalLink";

const content = defineType({
  ...baseType,
  name: "content",
  type: "object",
  groups: [
    {
      name: "socials",
      title: "Social Links",
    },
  ],
  fields: [
    ...baseType.fields,
    defineField({
      name: "socials",
      title: "Social Links",
      type: "object",
      group: "socials",
      fields: [
        defineField({
          name: "codepen",
          type: "string",
        }),
        defineField({
          name: "devto",
          type: "string",
        }),
        defineField({
          name: "discord",
          type: "string",
        }),
        defineField({
          name: "dribble",
          type: "string",
        }),
        defineField({
          name: "facebook",
          type: "string",
        }),
        defineField({
          name: "github",
          type: "string",
        }),
        defineField({
          name: "instagram",
          type: "string",
        }),
        defineField({
          name: "lastfm",
          type: "string",
        }),
        defineField({
          name: "linkedin",
          type: "string",
        }),
        defineField({
          name: "email",
          type: "string",
        }),
        defineField({
          name: "mastodon",
          type: "string",
        }),
        defineField({
          name: "medium",
          type: "string",
        }),
        defineField({
          name: "polywork",
          type: "string",
        }),
        defineField({
          name: "stackoverflow",
          type: "string",
        }),
        defineField({
          name: "substack",
          type: "string",
        }),
        defineField({
          name: "tiktok",
          type: "string",
        }),
        defineField({
          name: "twitch",
          type: "string",
        }),
        defineField({
          name: "twitter",
          type: "string",
        }),
        defineField({
          name: "youtube",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "websites",
      title: "Websites",
      type: "array",
      of: [
        defineField({
          name: "site",
          type: "object",
          fields: [
            defineField({
              name: "site",
              type: "string",
            }),
            defineField(externalLink),
          ],
        }),
      ],
    }),
  ],
});

export default content;
