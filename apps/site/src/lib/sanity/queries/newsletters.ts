import { defineQuery } from "groq";
import {
	baseFieldsNoContent,
	personRefFields,
	portableTextFields,
	sponsorRefFields,
} from "./shared";

export const newsletterCountQuery = defineQuery(
	`count(*[_type == "newsletter" && defined(slug.current)])`,
);

export const newsletterListQuery = defineQuery(
	`*[_type == "newsletter" && defined(slug.current)] | order(issueNumber desc, date desc) [0...50] {
  ${baseFieldsNoContent},
  issueNumber,
  preheader,
  deliveryStatus,
  sendAt,
  sentAt,
  buttondownWebUrl,
  author[]->{
    ${personRefFields}
  },
  courseSpotlight->{
    _id,
    "title": coalesce(title, "Untitled"),
    "slug": slug.current,
    excerpt,
    coverImage
  }
}`,
);

export const newsletterQuery = defineQuery(
	`*[_type == "newsletter" && slug.current == $slug] [0] {
  ${baseFieldsNoContent},
  issueNumber,
  preheader,
  deliveryStatus,
  sendAt,
  sentAt,
  buttondownEmailId,
  buttondownWebUrl,
  ${portableTextFields},
  author[]->{
    ${personRefFields}
  },
  sponsor[]->{
    ${sponsorRefFields}
  },
  tags[]{
    _key,
    label,
    value
  },
  courseSpotlight->{
    _id,
    _type,
    "title": coalesce(title, "Untitled"),
    "slug": slug.current,
    excerpt,
    coverImage
  },
  catOfTheWeek{
    image,
    alt,
    caption
  }
}`,
);
