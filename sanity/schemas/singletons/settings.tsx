import { CogIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";
import SVG from "react-inlinesvg";

import internalLink from "../custom/internalLink";

export default defineType({
  name: "settings",
  title: "Settings",
  type: "document",
  icon: CogIcon,
  fields: [
    defineField({
      name: "title",
      description: "This field is the title of your blog.",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      description:
        "Used both for the <meta> description tag for SEO, and the blog subheader.",
      title: "Description",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          options: {},
          styles: [],
          lists: [],
          marks: {
            decorators: [],
            annotations: [
              defineField({
                type: "object",
                name: "link",
                fields: [
                  {
                    type: "string",
                    name: "href",
                    title: "URL",
                    validation: (rule) => rule.required(),
                  },
                ],
              }),
            ],
          },
        }),
      ],
    }),
    defineField({
      name: "navLinks",
      description:
        "This is an array of links that will be displayed at the top of the page.",
      title: "Nav Links",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            {
              name: "title",
              type: "string",
              title: "Title",
              validation: (rule) => rule.required(),
            },
            {
              name: "path",
              type: "string",
              title: "Link Path",
              initialValue: "/",
              validation: (rule) => rule.required(),
            },
            {
              name: "sideOnly",
              type: "boolean",
              title: "Show on Side Drawer Only",
            },
          ],
        }),
      ],
    }),
    defineField({
      name: "ogImage",
      title: "Open Graph Image",
      type: "cloudinary.asset",
      description: "Displayed on social cards and search engine results.",
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Settings",
      };
    },
  },
});
