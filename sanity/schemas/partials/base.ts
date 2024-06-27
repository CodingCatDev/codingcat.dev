import { format, parseISO } from "date-fns";
import { defineArrayMember, defineField, defineType } from "sanity";
import { SiCloudinary } from "react-icons/si";

//Custom Editor for markdown paste
import input from "../../components/BlockEditor";

// Custom annotations
import externalLink from "../custom/externalLink";
import internalLink from "../custom/internalLink";

// Custom schemas (need imported in sanity.config.ts)
import codepen from "../custom/codepen";
import codesandbox from "../custom/codesandbox";
import twitter from "../custom/twitter-embed";

const baseType = defineType({
  name: "base",
  type: "object",
  fields: [
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "cloudinary.asset",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "date",
      title: "Publish Date",
      type: "datetime",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "A slug is required for the post to show up in the preview",
      options: {
        source: "title",
        maxLength: 96,
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "number",
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "array",
      components: {
        input,
      },
      of: [
        defineArrayMember({
          type: "block",
          marks: {
            annotations: [
              defineArrayMember(externalLink),
              defineArrayMember(internalLink),
            ],
          },
        }),
        //Plugins
        defineArrayMember({
          type: "cloudinary.asset",
          title: "Cloudinary",
          icon: SiCloudinary,
        }),
        defineArrayMember({
          type: "code",
          name: "code",
          title: "Code",
          options: {
            language: "typescript",
          },
        }),
        //Custom Schemas
        defineArrayMember(codepen),
        defineArrayMember(codesandbox),
        defineArrayMember(twitter),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      _createdAt: "_createdAt",
      _updatedAt: "_updatedAt",
    },
    prepare({ title, _createdAt, _updatedAt }) {
      const subtitles = [
        _createdAt && `on ${format(parseISO(_createdAt), "LLL d, yyyy")}`,
        _updatedAt && `upd ${format(parseISO(_updatedAt), "LLL d, yyyy")}`,
      ].filter(Boolean);

      return {
        title,
        subtitle: subtitles.join(" "),
      };
    },
  },
});
export default baseType;
