import { groq } from "next-sanity";

export const docCount = groq`count(*[_type == $type])`;

export const settingsQuery = groq`*[_type == "settings"][0]`;

// Partials

const baseFieldsNoContent = `
  _id,
  _type,
  "status": select(_originalId in path("drafts.**") => "draft", "published"),
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
  devto,
  hashnode,
  sponsor[]->{
    ...,
    "title": coalesce(title, "Anonymous"),
    "slug": slug.current,
  },
  tags,
  videoCloudinary,
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
  }
`;

const courseFields = `
  stripeProduct
`;

const lessonFields = `
  locked,
  videoCloudinary
`;

const userFields = `
  socials,
  websites
`;

const userRelated = `
  "related":{
    "course": *[_type == "course" && (^._id in author[]._ref || ^._id in guest[]._ref)] | order(date desc) [0...4] {
      ${baseFieldsNoContent}
    },
    "podcast": *[_type == "podcast" && (^._id in author[]._ref || ^._id in guest[]._ref)] | order(date desc) [0...4] {
      ${baseFieldsNoContent}
    },
    "post": *[_type == "post" && (^._id in author[]._ref || ^._id in guest[]._ref)] | order(date desc) [0...4] {
      ${baseFieldsNoContent}
    },
  }
`;

const sponsorRelated = `
  "related":{
    "course": *[_type == "course" && ^._id in sponsor[]._ref] | order(date desc) [] {
      ${baseFieldsNoContent}
    },
    "podcast": *[_type == "podcast" && ^._id in sponsor[]._ref] | order(date desc) [] {
      ${baseFieldsNoContent}
    },
    "post": *[_type == "post" && ^._id in sponsor[]._ref] | order(date desc) [] {
      ${baseFieldsNoContent}
    },
  }
`;

export const homePageQuery = groq`*[_type == "settings" ][0]{
  "featuredCourse": *[_type == "course" && featured > 0]|order(featured desc)[0]{
      ${baseFieldsNoContent},
      ${courseFields},
  },
  "featuredCourses": *[_type == "course" && featured > 0]|order(featured desc)[0...4]{
      ${baseFieldsNoContent},
      ${courseFields},
  },
  "latestPodcast": *[_type == "podcast"]|order(date desc)[0]{
      ${baseFieldsNoContent},
  },
  "topPodcasts": *[_type == "podcast" && views > 0]|order(views desc)[0...4]{
      ${baseFieldsNoContent},
  },
  "latestPosts": *[_type == "post"]|order(date desc)[0...4]{
     ${baseFieldsNoContent},
  },
  "topPosts": *[_type == "post" && views > 0]|order(views desc)[0...4]{
    ${baseFieldsNoContent},
  },
}`;

// Pages
export const pageQuery = groq`*[_type == "page" && slug.current == $slug] [0] {
  ${baseFieldsNoContent},
  ${contentFields}
}`;

// Post

export const blogQuery = groq`*[_type == "post" && defined(slug.current)] | order(date desc, _updatedAt desc) [0] {
  ${baseFieldsNoContent},
  author[]->{
    ...,
    "title": coalesce(title, "Anonymous"),
    "slug": slug.current,
  }
}`;

export const morePostQuery = groq`*[_type == "post" && _id != $skip && defined(slug.current)] | order(date desc, _updatedAt desc) [$offset...$limit] {
  ${baseFieldsNoContent},
  author[]->{
    ...,
    "title": coalesce(title, "Anonymous"),
    "slug": slug.current,
  }
}`;

export const postQuery = groq`*[_type == "post" && slug.current == $slug] [0] {
  ${baseFieldsNoContent},
  ${contentFields}
}`;

// Podcast

export const podcastsQuery = groq`*[_type == "podcast" && defined(slug.current)] | order(date desc, _updatedAt desc) [0] {
  ${baseFieldsNoContent},
  author[]->{
    ...,
    "title": coalesce(title, "Anonymous"),
    "slug": slug.current,
  },
  guest[]->{
    ...,
    "title": coalesce(title, "Anonymous"),
    "slug": slug.current,
  }
}`;

export const morePodcastQuery = groq`*[_type == "podcast" && _id != $skip && defined(slug.current)] | order(date desc, _updatedAt desc) [$offset...$limit] {
  ${baseFieldsNoContent},
  author[]->{
    ...,
    "title": coalesce(title, "Anonymous"),
    "slug": slug.current,
  },
  guest[]->{
    ...,
    "title": coalesce(title, "Anonymous"),
    "slug": slug.current,
  }
}`;

export const podcastQuery = groq`*[_type == "podcast" && slug.current == $slug] [0] {
  ${baseFieldsNoContent},
  ${contentFields},
  ${podcastFields}
}`;

// Courses

export const coursesQuery = groq`*[_type == "course" && defined(slug.current)] | order(date desc, _updatedAt desc) [0] {
  ${baseFieldsNoContent},
  ${courseFields},
  author[]->{
    ...,
    "title": coalesce(title, "Anonymous"),
    "slug": slug.current,
  }
}`;

export const moreCourseQuery = groq`*[_type == "course" && _id != $skip && defined(slug.current)] | order(date desc, _updatedAt desc) [$offset...$limit] {
  ${baseFieldsNoContent},
  ${courseFields},
  author[]->{
    ...,
    "title": coalesce(title, "Anonymous"),
    "slug": slug.current,
  }
}`;

export const courseQuery = groq`*[_type == "course" && slug.current == $courseSlug] [0] {
  ${baseFieldsNoContent},
  ${courseFields},
  ${contentFields},
  ${podcastFields}
}`;

// Lessons

export const lessonsInCourseQuery = groq`*[_type == "course" && slug.current == $courseSlug] [0] {
  ${baseFieldsNoContent},
  ${courseFields},
  sections[]{
    title,
    lesson[]->{
      ${baseFieldsNoContent},
      ${lessonFields}
    }
  }
}`;

export const lessonQuery = groq`*[_type == "lesson" && slug.current == $lessonSlug] [0] {
  ${baseFieldsNoContent},
  ${contentFields},
  ${lessonFields}
}`;

// Author

export const moreAuthorQuery = groq`*[_type == "author" && _id != $skip && defined(slug.current)] | order(title) [$offset...$limit] {
  ${baseFieldsNoContent}
}`;

export const authorQuery = groq`*[_type == "author" && slug.current == $slug] [0] {
  ${baseFieldsNoContent},
  ${contentFields},
  ${userFields}
}`;

export const authorQueryWithRelated = groq`*[_type == "author" && slug.current == $slug] [0] {
  ${baseFieldsNoContent},
  ${contentFields},
  ${userFields},
  ${userRelated}
}`;

// Guest

export const moreGuestQuery = groq`*[_type == "guest" && _id != $skip && defined(slug.current)] | order(title) [$offset...$limit] {
  ${baseFieldsNoContent}
}`;

export const guestQuery = groq`*[_type == "guest" && slug.current == $slug] [0] {
  ${baseFieldsNoContent},
  ${contentFields},
  ${userFields}
}`;

export const guestQueryWithRelated = groq`*[_type == "guest" && slug.current == $slug] [0] {
  ${baseFieldsNoContent},
  ${contentFields},
  ${userFields},
  ${userRelated}
}`;

// Sponsor

export const moreSponsorQuery = groq`*[_type == "sponsor" && _id != $skip && defined(slug.current)] | order(date desc) [$offset...$limit] {
  ${baseFieldsNoContent}
}`;

export const sponsorQuery = groq`*[_type == "sponsor" && slug.current == $slug] [0] {
  ${baseFieldsNoContent},
  ${contentFields},
  ${userFields}
}`;

export const sponsorQueryWithRelated = groq`*[_type == "sponsor" && slug.current == $slug] [0] {
  ${baseFieldsNoContent},
  ${contentFields},
  ${userFields},
  ${sponsorRelated}
}`;

// RSS

export const rssQuery = groq`*[_type == $type && _id != $skip && defined(slug.current)] | order(date desc) [$offset...$limit] {
  ${baseFieldsNoContent},
  ${contentFields},
}`;

// Sitemaps
export const sitemapQuery = groq`*[_type in ["author", "course", "guest", "page", "podcast", "post", "sponsor"] && defined(slug.current)] | order(_type asc) | order(_updated desc) {
  _type,
  _updatedAt,
  "slug": slug.current,
  sections[]{
    lesson[]->{
      _type,
      _updatedAt,
      "slug": slug.current,
    }
  }
}`;
