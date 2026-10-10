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
  "standaloneShorts": *[_type == "short"]|order(coalesce(publishedAt, _createdAt) desc)[0...6]{
    _id,
    _type,
    title,
    "slug": slug.current,
    "description": coalesce(description, ""),
    "youtube": youtube,
    "youtubeShortId": null,
    "shortVideoUrl": shortVideoUrl,
    "publishedAt": coalesce(publishedAt, _createdAt),
    "duration": coalesce(duration, 60),
    "viewCount": coalesce(statistics.youtube.viewCount, 0),
    "likeCount": coalesce(statistics.youtube.likeCount, 0)
  },
  "automatedShorts": *[_type == "automatedVideo" && defined(youtubeShortId)]|order(_createdAt desc)[0...6]{
    _id,
    _type,
    title,
    "slug": slug.current,
    "description": coalesce(script.hook, summary, ""),
    "youtube": "https://www.youtube.com/shorts/" + youtubeShortId,
    youtubeShortId,
    "shortVideoUrl": shortUrl,
    "publishedAt": coalesce(publishedAt, _createdAt),
    "duration": 60,
    "viewCount": coalesce(statistics.youtube.viewCount, analytics.views, 0),
    "likeCount": coalesce(statistics.youtube.likeCount, analytics.likes, 0)
  },
}`);
