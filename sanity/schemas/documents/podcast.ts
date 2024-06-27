import { FaPodcast } from "react-icons/fa";
import { format, parseISO } from "date-fns";
import { defineField, defineType } from "sanity";

import contentType from "../partials/content";
import podcastType from "./podcastType";
import guestType from "./guest";
import authorType from "./author";

export default defineType({
  ...contentType,
  name: "podcast",
  title: "Podcast",
  icon: FaPodcast,
  type: "document",
  groups: [
    ...(contentType.groups || []),
    {
      name: "podcast",
      title: "Podcast Details",
    },
  ],
  fields: [
    ...contentType.fields,
    defineField({
      name: "podcastType",
      title: "Podcast Type",
      type: "reference",
      group: "podcast",
      to: [{ type: podcastType.name }],
      validation: (rule) => [rule.required()],
    }),
    defineField({
      name: "season",
      title: "Season",
      type: "number",
      group: "podcast",
      validation: (rule) => [
        rule.required(),
        rule.min(0),
        rule.max(10),
        rule.integer(),
      ],
    }),
    defineField({
      name: "episode",
      title: "Episode",
      type: "number",
      group: "podcast",
      validation: (rule) => [
        rule.required(),
        rule.min(0),
        rule.max(100),
        rule.integer(),
      ],
    }),
    defineField({
      name: "recordingDate",
      title: "Recording Date",
      type: "datetime",
      group: "podcast",
      validation: (rule) => [rule.required()],
    }),
    defineField({
      name: "guest",
      title: "Guest(s)",
      type: "array",
      group: "podcast",
      of: [
        {
          type: "reference",
          to: [{ type: guestType.name }],
        },
      ],
      validation: (rule) => [rule.required()],
    }),
    defineField({
      name: "pick",
      title: "Pick(s)",
      type: "array",
      group: "podcast",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "user",
              title: "Author or Guest",
              type: "reference",
              to: [{ type: guestType.name }, { type: authorType.name }],
              validation: (rule) => [rule.required()],
            }),
            defineField({
              name: "name",
              title: "Pick Name",
              type: "string",
              validation: (rule) => [rule.required()],
            }),
            defineField({
              name: "site",
              title: "Pick Url",
              type: "url",
            }),
          ],
          preview: {
            select: {
              title: "user.title",
              name: "name",
              site: "site",
            },
            prepare({ title, name, site }) {
              const subtitles = [name, ` - ${site}`].filter(Boolean);
              return {
                title,
                subtitle: subtitles.join(" "),
              };
            },
          },
        },
      ],
    }),
    defineField({
      name: "spotify",
      title: "Spotify",
      type: "podcastRssEpisode",
      validation: (rule) => [rule.required()],
    }),
  ],
  orderings: [
    {
      title: "Season Episode New",
      name: "seasonDesc",
      by: [
        { field: "season", direction: "desc" },
        { field: "episode", direction: "desc" },
      ],
    },
    {
      title: "Season Episode Old",
      name: "seasonAsc",
      by: [
        { field: "season", direction: "asc" },
        { field: "episode", direction: "asc" },
      ],
    },
  ],
  preview: {
    ...contentType.preview,
    select: {
      ...contentType.preview?.select,
      episode: "episode",
      season: "season",
    },
    prepare({ title, _createdAt, _updatedAt, episode, season }) {
      const subtitles = [
        _createdAt && `on ${format(parseISO(_createdAt), "LLL d, yyyy")}`,
        _updatedAt && `updated ${format(parseISO(_updatedAt), "LLL d, yyyy")}`,
      ].filter(Boolean);

      return {
        title: `${season}.${episode} - ${title}`,
        subtitle: subtitles.join(" "),
      };
    },
  },
});
