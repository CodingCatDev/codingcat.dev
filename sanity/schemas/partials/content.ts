import { defineField, defineType } from "sanity";

import baseType from "./base";
import authorType from "../documents/author";
import sponsorType from "../documents/sponsor";

import { input } from "../../components/YouTubePreview";

const content = defineType({
  ...baseType,
  name: "content",
  type: "object",
  groups: [
    {
      name: "data",
      title: "Data Updates",
    },
  ],
  fields: [
    ...baseType.fields,
    defineField({
      name: "videoCloudinary",
      title: "Cloudinary Video",
      type: "cloudinary.asset",
    }),
    defineField({
      name: "youtube",
      title: "YouTube",
      type: "string",
      components: {
        input,
      },
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: authorType.name }],
        },
      ],
      initialValue: [
        {
          _type: "reference",
          _ref: "RIgC5r4TJ0hCGOzxHszD1w",
        },
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "sponsor",
      title: "Sponsor",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: sponsorType.name }],
        },
      ],
    }),
    // defineField({
    //   title: "Tags",
    //   name: "tags",
    //   type: "tags",
    //   options: {
    //     includeFromRelated: "tags",
    //   },
    //   validation: (Rule) => Rule.unique(),
    // }),
    defineField({
      name: "devto",
      title: "Dev.to",
      type: "url",
      group: "data",
    }),
    defineField({
      name: "hashnode",
      title: "Hashnode",
      type: "string",
      group: "data",
    }),
    defineField({
      name: "statistics",
      type: "object",
      group: "data",
      fields: [
        defineField({
          name: "youtube",
          type: "object",
          fields: [
            defineField({
              name: "commentCount",
              type: "number",
            }),
            defineField({
              name: "favoriteCount",
              type: "number",
            }),
            defineField({
              name: "likeCount",
              type: "number",
            }),
            defineField({
              name: "viewCount",
              type: "number",
            }),
          ]
        }),
      ]
    }),
  ],
});

export default content;
