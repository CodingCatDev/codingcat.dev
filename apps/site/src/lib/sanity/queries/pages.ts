import { defineQuery } from "groq";
import {
	baseFieldsNoContent,
	contentFields,
	personRefFields,
	portableTextFields,
} from "./shared";

export const settingsQuery = defineQuery(`*[_type == "settings"][0]{
  ...,
  ogImage
}`);

export const pageQuery =
	defineQuery(`*[_type == "page" && slug.current == $slug] [0] {
  ${baseFieldsNoContent},
  ${contentFields}
}`);

export const lessonParentCourseQuery =
	defineQuery(`*[_type == "lesson" && slug.current == $slug][0]{
  "slug": slug.current,
  "courseSlug": *[_type == "course" && defined(slug.current) && ^._id in sections[].lesson[]._ref][0].slug.current
}`);

export const coursesQuery =
	defineQuery(`*[_type == "course" && coalesce(archived, false) != true] | order(coalesce(lastUpdated, date) desc) {
  ${baseFieldsNoContent},
  archived,
  lastUpdated,
  youtube,
  videoCloudinary,
  "sectionsCount": count(sections),
  "lessonsCount": count(sections[].lesson[]),
  sections[]{
    title,
    "lessons": lesson[]->{
      "title": coalesce(title, "Lesson"),
      "slug": slug.current,
      excerpt,
      tags[]{
        label,
        value
      }
    }
  }
}`);

export const courseQuery =
	defineQuery(`*[_type == "course" && slug.current == $slug][0] {
  ${baseFieldsNoContent},
  ${contentFields},
  sections[]{
    title,
    lesson[]->{
      _id,
      _type,
      "title": coalesce(title, "Lesson"),
      "slug": slug.current,
      excerpt,
      coverImage,
      youtube,
      videoCloudinary,
      tags[]{
        _key,
        label,
        value
      },
      relatedContent[]->{
        ${baseFieldsNoContent},
        youtube,
        tags[]{
          label,
          value
        },
        author[]->{
          ${personRefFields}
        },
        guest[]->{
          ${personRefFields}
        }
      },
      ${portableTextFields}
    }
  }
}`);

export const homePageQuery = defineQuery(`*[_type == "settings" ][0]{
  "latestPodcast": *[_type == "podcast"]|order(date desc)[0]{
      ${baseFieldsNoContent},
      youtube,
      videoCloudinary,
  },
  "latestPodcasts": *[_type == "podcast"]|order(date desc)[0...4]{
      ${baseFieldsNoContent},
  },
  "topPodcasts": *[_type == "podcast" && defined(statistics.youtube.viewCount) && statistics.youtube.viewCount > 0]|order(statistics.youtube.viewCount desc)[0...4]{
      ${baseFieldsNoContent},
  },
  "latestPosts": *[_type == "post"]|order(date desc)[0...4]{
     ${baseFieldsNoContent},
  },
  "topPosts": *[_type == "post" && defined(statistics.youtube.viewCount) && statistics.youtube.viewCount > 0]|order(statistics.youtube.viewCount desc)[0...4]{
    ${baseFieldsNoContent},
  },
}`);
