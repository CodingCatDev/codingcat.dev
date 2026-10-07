import { defineQuery } from "groq";
import { baseFieldsNoContent, contentFields, podcastFields } from "./shared";

export const podcastCountQuery = defineQuery(
	`count(*[_type == "podcast" && defined(slug.current)])`,
);

export const podcastQuery =
	defineQuery(`*[_type == "podcast" && slug.current == $slug] [0] {
  ${baseFieldsNoContent},
  ${contentFields},
  ${podcastFields}
}`);

export const latestPodcastQuery =
	defineQuery(`*[_type == "podcast" && defined(slug.current)] | order(date desc, _updatedAt desc) [0] {
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
}`);

export const morePodcastQuery =
	defineQuery(`*[_type == "podcast" && _id != $skip && defined(slug.current)] | order(date desc, _updatedAt desc) [$offset...$limit] {
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
}`);
