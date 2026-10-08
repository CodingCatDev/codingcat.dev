/**
 * GROQ projection partials shared across query files.
 *
 * These are interpolated into `defineQuery` template literals. Sanity TypeGen
 * resolves const interpolation, including across module boundaries, so the
 * generated result types stay accurate — verified against this layout.
 */

export const baseFieldsNoContent = `
  _id,
  _type,
  _updatedAt,
  "status": select(_originalId in path("drafts.**") => "draft", "published"),
  "title": coalesce(title, "Untitled"),
  "slug": slug.current,
  excerpt,
  coverImage,
  "date": coalesce(date, _createdAt)
`;

/** Resolves internalLink markDefs to hrefs; keep in sync with lib/sanity/resolve-href.ts. */
export const contentFields = `
  content[]{
    ...,
    markDefs[]{
      ...,
      _type == "internalLink" => {
        @.reference->_type == "page" => {
          "href": "/" + @.reference->slug.current
        },
        @.reference->_type != "page" => {
          "href": "/" + @.reference->_type + "/" + @.reference->slug.current
        }
      },
    }
  },
  author[]->{
    ...,
    "title": coalesce(title, "Anonymous"),
    "slug": slug.current,
  },
  devto,
  hashnode,
  sponsor[]->{
    ...,
    "title": coalesce(title, "Anonymous"),
    "slug": slug.current,
  },
  tags,
  videoCloudinary,
  youtube,
  transcript->{
    _id,
    title,
    duration,
    durationSeconds,
    status,
    summary,
    chapters,
    cues,
    statistics
  }
`;

export const podcastFields = `
  podcastType[]->{
    ...,
    "title": coalesce(title, "Missing Podcast Title"),
  },
  season,
  episode,
  recordingDate,
  guest[]->{
    ...,
    "title": coalesce(title, "Anonymous"),
    "slug": slug.current,
  },
  pick[]{
    user->,
    name,
    site
  },
  spotify
`;

export const userFields = `
  socials,
  websites
`;

export const userRelated = `
  "related":{
    "podcast": *[_type == "podcast" && (^._id in author[]._ref || ^._id in guest[]._ref)] | order(date desc) [0...4] {
      ${baseFieldsNoContent}
    },
    "post": *[_type == "post" && (^._id in author[]._ref || ^._id in guest[]._ref)] | order(date desc) [0...4] {
      ${baseFieldsNoContent}
    },
  }
`;

export const sponsorRelated = `
  "related":{
    "podcast": *[_type == "podcast" && ^._id in sponsor[]._ref] | order(date desc) [] {
      ${baseFieldsNoContent}
    },
    "post": *[_type == "post" && ^._id in sponsor[]._ref] | order(date desc) [] {
      ${baseFieldsNoContent}
    },
  }
`;

/**
 * Trimmed field set for feeds — only what is serialized into RSS/JSON.
 * Avoids dereferencing sponsors, tags and video metadata that never appear.
 */
export const rssContentFields = `
  content[]{
    ...,
    markDefs[]{
      ...,
      _type == "internalLink" => {
        @.reference->_type == "page" => {
          "href": "/" + @.reference->slug.current
        },
        @.reference->_type != "page" => {
          "href": "/" + @.reference->_type + "/" + @.reference->slug.current
        }
      },
    }
  },
  author[]->{
    "title": coalesce(title, "Anonymous"),
    "slug": slug.current,
  }
`;
