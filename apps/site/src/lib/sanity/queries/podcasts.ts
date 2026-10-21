import { defineQuery } from "groq";
import {
	baseFieldsNoContent,
	contentFields,
	personRefFields,
	podcastFields,
} from "./shared";

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
    ${personRefFields}
  },
  guest[]->{
    ${personRefFields}
  }
}`);

export const morePodcastQuery =
	defineQuery(`*[_type == "podcast" && _id != $skip && defined(slug.current)] | order(date desc, _updatedAt desc) [$offset...$limit] {
  ${baseFieldsNoContent},
  author[]->{
    ${personRefFields}
  },
  guest[]->{
    ${personRefFields}
  }
}`);
