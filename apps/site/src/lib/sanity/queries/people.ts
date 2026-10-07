import { defineQuery } from "groq";
import {
	baseFieldsNoContent,
	contentFields,
	userFields,
	userRelated,
} from "./shared";

// --- Author ---

export const authorCountQuery = defineQuery(
	`count(*[_type == "author" && defined(slug.current)])`,
);

export const authorQuery =
	defineQuery(`*[_type == "author" && slug.current == $slug] [0] {
  ${baseFieldsNoContent},
  ${contentFields},
  ${userFields}
}`);

export const authorQueryWithRelated =
	defineQuery(`*[_type == "author" && slug.current == $slug] [0] {
  ${baseFieldsNoContent},
  ${contentFields},
  ${userFields},
  ${userRelated}
}`);

export const moreAuthorQuery =
	defineQuery(`*[_type == "author" && _id != $skip && defined(slug.current)] | order(title) [$offset...$limit] {
  ${baseFieldsNoContent}
}`);

// --- Guest ---

export const guestCountQuery = defineQuery(
	`count(*[_type == "guest" && defined(slug.current)])`,
);

export const guestQuery =
	defineQuery(`*[_type == "guest" && slug.current == $slug] [0] {
  ${baseFieldsNoContent},
  ${contentFields},
  ${userFields}
}`);

export const guestQueryWithRelated =
	defineQuery(`*[_type == "guest" && slug.current == $slug] [0] {
  ${baseFieldsNoContent},
  ${contentFields},
  ${userFields},
  ${userRelated}
}`);

export const moreGuestQuery =
	defineQuery(`*[_type == "guest" && _id != $skip && defined(slug.current)] | order(title) [$offset...$limit] {
  ${baseFieldsNoContent}
}`);
