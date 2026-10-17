import { defineQuery } from "groq";
import {
	baseFieldsNoContent,
	portableTextFields,
	sponsorRelated,
} from "./shared";

export const sponsorCountQuery = defineQuery(
	`count(*[_type == "sponsor" && defined(slug.current)])`,
);

export const sponsorQuery =
	defineQuery(`*[_type == "sponsor" && slug.current == $slug] [0] {
  ${baseFieldsNoContent},
  ${portableTextFields},
  url
}`);

export const sponsorQueryWithRelated =
	defineQuery(`*[_type == "sponsor" && slug.current == $slug] [0] {
  ${baseFieldsNoContent},
  ${portableTextFields},
  url,
  ${sponsorRelated}
}`);

export const moreSponsorQuery =
	defineQuery(`*[_type == "sponsor" && _id != $skip && defined(slug.current)] | order(date desc) [$offset...$limit] {
  ${baseFieldsNoContent}
}`);
