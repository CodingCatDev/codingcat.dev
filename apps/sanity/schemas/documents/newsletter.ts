import { format, parseISO } from "date-fns";
import { HiOutlineMail } from "react-icons/hi";
import { defineField, defineType } from "sanity";

import baseType from "../partials/base";
import authorType from "./author";
import courseType from "./course";
import sponsorType from "./sponsor";

export default defineType({
	...baseType,
	name: "newsletter",
	title: "Newsletter Issue (The Purrfect Dispatch)",
	icon: HiOutlineMail,
	type: "document",
	groups: [
		{
			name: "delivery",
			title: "Buttondown & Delivery",
		},
		{
			name: "sections",
			title: "Spotlight & Cat of the Week",
		},
	],
	fields: [
		defineField({
			name: "issueNumber",
			title: "Issue Number",
			type: "number",
			description: "Sequential issue number for The Purrfect Dispatch (e.g., 1, 2, 3)",
			validation: (rule) => rule.required().min(1),
		}),
		defineField({
			name: "preheader",
			title: "Email Preheader / Inbox Preview",
			type: "string",
			description:
				"Short teaser shown next to the subject line in Gmail / Apple Mail (target 70-110 characters).",
		}),
		...baseType.fields,
		defineField({
			name: "author",
			title: "Author",
			type: "array",
			of: [
				{
					type: "reference",
					to: [{ type: authorType.name }],
				},
			],
			initialValue: [
				{
					_type: "reference",
					_ref: "RIgC5r4TJ0hCGOzxHszD1w",
				},
			],
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "sponsor",
			title: "Sponsor",
			type: "array",
			of: [
				{
					type: "reference",
					to: [{ type: sponsorType.name }],
				},
			],
		}),
		defineField({
			name: "courseSpotlight",
			title: "Course Spotlight",
			type: "reference",
			to: [{ type: courseType.name }],
			group: "sections",
			description:
				"Featured active CodingCat.dev Course for this issue (must not be archived).",
			options: {
				filter: "coalesce(archived, false) != true",
			},
		}),
		defineField({
			name: "catOfTheWeek",
			title: "Favorite Cat of the Week",
			type: "object",
			group: "sections",
			fields: [
				defineField({
					name: "image",
					title: "Cat Photo",
					type: "image",
					options: { hotspot: true },
				}),
				defineField({
					name: "alt",
					title: "Alt Text",
					type: "string",
				}),
				defineField({
					name: "caption",
					title: "Cat Joke / Caption",
					type: "text",
					rows: 3,
				}),
			],
		}),
		defineField({
			name: "tags",
			title: "Tags",
			type: "array",
			of: [
				{
					type: "object",
					name: "tag",
					fields: [
						defineField({ name: "label", title: "Label", type: "string" }),
						defineField({ name: "value", title: "Value", type: "string" }),
					],
				},
			],
		}),
		defineField({
			name: "deliveryStatus",
			title: "Delivery Status",
			type: "string",
			group: "delivery",
			initialValue: "draft",
			options: {
				list: [
					{ title: "Draft (In Progress)", value: "draft" },
					{ title: "Scheduled in Buttondown", value: "scheduled" },
					{ title: "Sent to Subscribers", value: "sent" },
				],
				layout: "radio",
			},
		}),
		defineField({
			name: "sendAt",
			title: "Scheduled Send Time (ET / UTC)",
			type: "datetime",
			group: "delivery",
			description:
				"When this issue is published in Sanity, the Buttondown webhook schedules delivery for this timestamp (defaults to next Friday at 9:00 AM ET if empty).",
		}),
		defineField({
			name: "buttondownEmailId",
			title: "Buttondown Email ID",
			type: "string",
			group: "delivery",
			description: "Synced Buttondown email ID (e.g., em_6f9z1a0cxn9ksvj28jzr7hzrzw).",
		}),
		defineField({
			name: "buttondownWebUrl",
			title: "Buttondown Archive URL",
			type: "url",
			group: "delivery",
		}),
		defineField({
			name: "sentAt",
			title: "Actual Sent Timestamp",
			type: "datetime",
			group: "delivery",
		}),
	],
	preview: {
		select: {
			title: "title",
			issueNumber: "issueNumber",
			deliveryStatus: "deliveryStatus",
			date: "date",
			media: "coverImage",
		},
		prepare({ title, issueNumber, deliveryStatus, date, media }) {
			const badge =
				deliveryStatus === "sent"
					? "✅ Sent"
					: deliveryStatus === "scheduled"
						? "🗓️ Scheduled"
						: "📝 Draft";
			const formattedDate = date ? format(parseISO(date), "LLL d, yyyy") : "";
			return {
				title: issueNumber ? `#${issueNumber}: ${title || "Untitled"}` : title || "Untitled",
				subtitle: [badge, formattedDate].filter(Boolean).join(" • "),
				media,
			};
		},
	},
});
