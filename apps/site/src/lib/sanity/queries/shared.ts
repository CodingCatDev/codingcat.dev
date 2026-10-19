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

export const personRefFields = `
  _id,
  _type,
  "title": coalesce(title, "Anonymous"),
  "slug": slug.current,
  coverImage
`;

export const sponsorRefFields = `
  _id,
  _type,
  "title": coalesce(title, "Anonymous"),
  "slug": slug.current,
  excerpt,
  coverImage,
  url
`;

/** Resolves internalLink markDefs to hrefs; keep in sync with lib/sanity/resolve-href.ts. */
export const portableTextFields = `
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
  }
`;

export const contentFields = `
  ${portableTextFields},
  author[]->{
    ${personRefFields}
  },
  devto,
  hashnode,
  sponsor[]->{
    ${sponsorRefFields}
  },
  videoCloudinary,
  youtube,
  transcript->{
    _id,
    title,
    duration,
    durationSeconds,
    status,
    summary,
    fullText,
    chapters,
    cues,
    statistics
  }
`;

export const podcastFields = `
  season,
  episode,
  recordingDate,
  guest[]->{
    ${personRefFields}
  },
  pick[]{
    user->{
      _id,
      _type,
      "title": coalesce(title, "Anonymous"),
      "slug": slug.current
    },
    name,
    site
  },
  spotify,
  listenLinks
`;

export const userFields = `
  socials,
  websites
`;

export const userRelated = `
  "related":{
    "podcast": *[_type == "podcast" && references(^._id)] | order(date desc) [0...4] {
      ${baseFieldsNoContent}
    },
    "post": *[_type == "post" && references(^._id)] | order(date desc) [0...4] {
      ${baseFieldsNoContent}
    },
  }
`;

export const sponsorRelated = `
  "related":{
    "podcast": *[_type == "podcast" && references(^._id)] | order(date desc) [] {
      ${baseFieldsNoContent}
    },
    "post": *[_type == "post" && references(^._id)] | order(date desc) [] {
      ${baseFieldsNoContent}
    },
  }
`;

/**
 * Trimmed field set for feeds — only what is serialized into RSS/JSON.
 * Avoids dereferencing sponsors, tags and video metadata that never appear.
 */
export const rssContentFields = `
  ${portableTextFields},
  author[]->{
    "title": coalesce(title, "Anonymous"),
    "slug": slug.current,
  }
`;
