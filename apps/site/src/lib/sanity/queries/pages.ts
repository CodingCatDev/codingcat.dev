import { defineQuery } from "groq";
import {
	baseFieldsNoContent,
	contentFields,
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

export const coursesQuery =
	defineQuery(`*[_type == "course"] | order(date asc) {
  ${baseFieldsNoContent},
  youtube,
  videoCloudinary,
  "sectionsCount": count(sections),
  "lessonsCount": count(sections[].lesson[])
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
