import { defineQuery } from "groq";
import { baseFieldsNoContent, contentFields } from "./shared";

export const settingsQuery = defineQuery(`*[_type == "settings"][0]{
  ...,
  ogImage
}`);

export const pageQuery =
	defineQuery(`*[_type == "page" && slug.current == $slug] [0] {
  ${baseFieldsNoContent},
  ${contentFields}
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
  "topPodcasts": *[_type == "podcast" && coalesce(statistics.youtube.viewCount, transcript->statistics.viewCount, 0) > 0]|order(coalesce(statistics.youtube.viewCount, transcript->statistics.viewCount, 0) desc)[0...4]{
      ${baseFieldsNoContent},
  },
  "latestPosts": *[_type == "post"]|order(date desc)[0...4]{
     ${baseFieldsNoContent},
  },
  "topPosts": *[_type == "post" && coalesce(statistics.youtube.viewCount, transcript->statistics.viewCount, 0) > 0]|order(coalesce(statistics.youtube.viewCount, transcript->statistics.viewCount, 0) desc)[0...4]{
    ${baseFieldsNoContent},
  },
}`);
