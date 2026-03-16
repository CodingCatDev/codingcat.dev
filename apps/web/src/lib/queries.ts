import groq from "groq";

const baseFields = `
  _id,
  _type,
  "title": coalesce(title, "Untitled"),
  "slug": slug.current,
  excerpt,
  coverImage,
  "date": coalesce(date, _createdAt)
`;

const contentFields = `
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
  sponsor[]->{
    ...,
    "title": coalesce(title, "Anonymous"),
    "slug": slug.current,
  },
  tags,
  youtube
`;

const podcastFields = `
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

export const homePageQuery = groq`*[_type == "settings"][0]{
  "latestPodcast": *[_type == "podcast"]|order(date desc)[0]{
    ${baseFields},
    youtube,
  },
  "latestPodcasts": *[_type == "podcast"]|order(date desc)[0...4]{
    ${baseFields},
  },
  "topPodcasts": *[_type == "podcast" && statistics.youtube.viewCount > 0]|order(statistics.youtube.viewCount desc)[0...4]{
    ${baseFields},
  },
  "latestPosts": *[_type == "post"]|order(date desc)[0...4]{
    ${baseFields},
  },
  "topPosts": *[_type == "post" && statistics.youtube.viewCount > 0]|order(statistics.youtube.viewCount desc)[0...4]{
    ${baseFields},
  },
}`;

export const postListQuery = groq`*[_type == "post" && defined(slug.current)] | order(date desc, _updatedAt desc) [$offset...$limit] {
  ${baseFields},
  author[]->{
    "title": coalesce(title, "Anonymous"),
    "slug": slug.current,
  }
}`;

export const postQuery = groq`*[_type == "post" && slug.current == $slug][0] {
  ${baseFields},
  ${contentFields}
}`;

export const postCountQuery = groq`count(*[_type == "post" && defined(slug.current)])`;

export const podcastListQuery = groq`*[_type == "podcast" && defined(slug.current)] | order(date desc, _updatedAt desc) [$offset...$limit] {
  ${baseFields},
  author[]->{
    "title": coalesce(title, "Anonymous"),
    "slug": slug.current,
  },
  guest[]->{
    "title": coalesce(title, "Anonymous"),
    "slug": slug.current,
  }
}`;

export const podcastQuery = groq`*[_type == "podcast" && slug.current == $slug][0] {
  ${baseFields},
  ${contentFields},
  ${podcastFields}
}`;

export const podcastCountQuery = groq`count(*[_type == "podcast" && defined(slug.current)])`;

export const settingsQuery = groq`*[_type == "settings"][0]{
  ...,
  ogImage
}`;
