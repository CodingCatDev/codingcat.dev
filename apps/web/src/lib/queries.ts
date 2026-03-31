import groq from "groq";

const baseFields = `
  _id,
  _type,
  "title": coalesce(title, "Untitled"),
  "slug": slug.current,
  excerpt,
  coverImage,
  "date": coalesce(date, _createdAt),
  "authorName": author[0]->title,
  "authorImage": author[0]->coverImage
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
  spotify,
  chapters[]{
    title,
    timestamp,
    seconds
  },
  "series": series->{ _id, "title": coalesce(title, "Unknown Series"), "slug": slug.current, description },
  listenLinks
`;

export const homePageQuery = groq`*[_type == "settings"][0]{
  "latestPodcast": *[_type == "podcast"]|order(date desc)[0]{
    ${baseFields},
    excerpt,
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

export const postListQuery = groq`*[_type == "post" && defined(slug.current)] | order(date desc, _updatedAt desc) [$offset...$end] {
  ${baseFields},
  author[]->{
    "title": coalesce(title, "Anonymous"),
    "slug": slug.current,
  },
  categories[]->{ _id, "title": coalesce(title, "Uncategorized"), "slug": slug.current }
}`;

export const postQuery = groq`*[_type == "post" && slug.current == $slug][0] {
  ${baseFields},
  ${contentFields},
  categories[]->{ _id, "title": coalesce(title, "Uncategorized"), "slug": slug.current },
  "ogTitle": socialPreview.ogTitle,
  "ogDescription": socialPreview.ogDescription,
  "ogImage": socialPreview.ogImage
}`;

export const postCountQuery = groq`count(*[_type == "post" && defined(slug.current)])`;

export const podcastListQuery = groq`*[_type == "podcast" && defined(slug.current)] | order(date desc, _updatedAt desc) [$offset...$end] {
  ${baseFields},
  episode,
  season,
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
  ${podcastFields},
  "ogTitle": socialPreview.ogTitle,
  "ogDescription": socialPreview.ogDescription,
  "ogImage": socialPreview.ogImage
}`;

export const podcastCountQuery = groq`count(*[_type == "podcast" && defined(slug.current)])`;

export const settingsQuery = groq`*[_type == "settings"][0]{
  ...,
  ogImage
}`;

// Author queries
export const authorListQuery = groq`*[_type == "author" && defined(slug.current)] | order(title) [$offset...$end] {
  ${baseFields}
}`;

export const authorCountQuery = groq`count(*[_type == "author" && defined(slug.current)])`;

export const authorQuery = groq`*[_type == "author" && slug.current == $slug][0] {
  ${baseFields},
  ${contentFields},
  socials,
  websites,
  company,
  role,
  "ogTitle": socialPreview.ogTitle,
  "ogDescription": socialPreview.ogDescription,
  "ogImage": socialPreview.ogImage,
  "related": {
    "podcast": *[_type == "podcast" && (^._id in author[]._ref || ^._id in guest[]._ref)] | order(date desc) [0...4] {
      ${baseFields}
    },
    "post": *[_type == "post" && (^._id in author[]._ref || ^._id in guest[]._ref)] | order(date desc) [0...4] {
      ${baseFields}
    },
  }
}`;

// Guest queries
export const guestListQuery = groq`*[_type == "guest" && defined(slug.current)] | order(title) [$offset...$end] {
  ${baseFields}
}`;

export const guestCountQuery = groq`count(*[_type == "guest" && defined(slug.current)])`;

export const guestQuery = groq`*[_type == "guest" && slug.current == $slug][0] {
  ${baseFields},
  ${contentFields},
  socials,
  websites,
  company,
  role,
  "ogTitle": socialPreview.ogTitle,
  "ogDescription": socialPreview.ogDescription,
  "ogImage": socialPreview.ogImage,
  "related": {
    "podcast": *[_type == "podcast" && (^._id in author[]._ref || ^._id in guest[]._ref)] | order(date desc) [0...4] {
      ${baseFields}
    },
    "post": *[_type == "post" && (^._id in author[]._ref || ^._id in guest[]._ref)] | order(date desc) [0...4] {
      ${baseFields}
    },
  }
}`;

// Sponsor queries
export const sponsorListQuery = groq`*[_type == "sponsor" && defined(slug.current)] | order(date desc) [$offset...$end] {
  ${baseFields}
}`;

export const sponsorCountQuery = groq`count(*[_type == "sponsor" && defined(slug.current)])`;

export const sponsorQuery = groq`*[_type == "sponsor" && slug.current == $slug][0] {
  ${baseFields},
  ${contentFields},
  socials,
  websites,
  "ogTitle": socialPreview.ogTitle,
  "ogDescription": socialPreview.ogDescription,
  "ogImage": socialPreview.ogImage,
  "related": {
    "podcast": *[_type == "podcast" && ^._id in sponsor[]._ref] | order(date desc) [0...4] {
      ${baseFields}
    },
    "post": *[_type == "post" && ^._id in sponsor[]._ref] | order(date desc) [0...4] {
      ${baseFields}
    },
  }
}`;

// Courses & lessons
const courseFields = `
  stripeProduct
`;

const lessonFields = `
  locked,
  videoCloudinary
`;

export const courseListQuery = groq`*[_type == "course" && defined(slug.current)] | order(date desc, _updatedAt desc) [$offset...$end] {
  ${baseFields},
  ${courseFields},
  author[]->{
    "title": coalesce(title, "Anonymous"),
    "slug": slug.current,
    coverImage
  }
}`;

export const courseCountQuery = groq`count(*[_type == "course" && defined(slug.current)])`;

export const courseQuery = groq`*[_type == "course" && slug.current == $courseSlug][0] {
  ${baseFields},
  ${contentFields},
  ${courseFields}
}`;

export const lessonsInCourseQuery = groq`*[_type == "course" && slug.current == $courseSlug][0] {
  ${baseFields},
  ${courseFields},
  sections[]{
    title,
    lesson[]->{
      ${baseFields},
      ${lessonFields}
    }
  }
}`;

export const lessonQuery = groq`*[_type == "lesson" && slug.current == $lessonSlug][0] {
  ${baseFields},
  ${contentFields},
  ${lessonFields}
}`;

/** Course slug + nested lesson slugs for sitemap generation */
export const sitemapCourseLessonsQuery = groq`*[_type == "course" && defined(slug.current)]{
  "courseSlug": slug.current,
  sections[]{
    lesson[]->defined(slug.current){
      "lessonSlug": slug.current,
      _updatedAt
    }
  }
}`;

// Sitemap
export const sitemapQuery = groq`*[_type in ["author", "course", "guest", "page", "podcast", "post", "sponsor"] && defined(slug.current)] | order(_type asc) {
  _type,
  _updatedAt,
  "slug": slug.current,
}`;

// Generic pages (Sanity "page" type)
export const pageQuery = groq`*[_type == "page" && slug.current == $slug][0] {
  ${baseFields},
  ${contentFields},
  "ogTitle": socialPreview.ogTitle,
  "ogDescription": socialPreview.ogDescription,
  "ogImage": socialPreview.ogImage
}`;

// RSS feeds
export const rssPostsQuery = groq`*[_type == "post" && defined(slug.current)] | order(date desc) [0...20] {
  ${baseFields},
  ${contentFields}
}`;

export const rssPodcastsQuery = groq`*[_type == "podcast" && defined(slug.current)] | order(date desc) [0...20] {
  ${baseFields},
  ${contentFields}
}`;
