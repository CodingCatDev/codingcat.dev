import { FaGraduationCap } from "react-icons/fa";
import { defineArrayMember, defineField, defineType } from "sanity";

import contentType from "../partials/content";

export default defineType({
	...contentType,
	name: "course",
	title: "Course",
	icon: FaGraduationCap,
	type: "document",
	groups: [...(contentType.groups || [])],
	fields: [
		defineField({
			name: "archived",
			title: "Archived / Outdated Course",
			description:
				"When enabled, this course is marked as archived/outdated and excluded from The Purrfect Dispatch newsletter spotlights and primary course tracks.",
			type: "boolean",
			initialValue: false,
		}),
		defineField({
			name: "lastUpdated",
			title: "Last Content / Lesson Update",
			description:
				"Actual content update timestamp for this course or its lessons (used instead of system _updatedAt so automated link/SEO scripts do not make old courses look newly updated).",
			type: "datetime",
		}),
		...contentType.fields,
		defineField({
			name: "sections",
			title: "Course Sections & Lessons",
			type: "array",
			of: [
				defineArrayMember({
					type: "object",
					name: "section",
					title: "Section",
					fields: [
						defineField({
							name: "title",
							title: "Section Title",
							type: "string",
						}),
						defineField({
							name: "lesson",
							title: "Lessons",
							type: "array",
							of: [
								defineArrayMember({
									type: "reference",
									to: [{ type: "lesson" }],
								}),
							],
						}),
					],
				}),
			],
		}),
		defineField({
			name: "stripeProduct",
			title: "Stripe Product (Legacy)",
			type: "object",
			hidden: true,
			readOnly: true,
			fields: [
				defineField({ name: "id", type: "string" }),
				defineField({ name: "name", type: "string" }),
			],
		}),
	],
	preview: {
		select: {
			title: "title",
			archived: "archived",
			lastUpdated: "lastUpdated",
			date: "date",
			media: "coverImage",
		},
		prepare({ title, archived, lastUpdated, date, media }) {
			const effective = lastUpdated || date;
			const dateLabel = effective ? new Date(effective).toISOString().slice(0, 10) : "no date";
			return {
				title: `${archived ? "[ARCHIVED] " : ""}${title || "Untitled Course"}`,
				subtitle: `${archived ? "Archived • " : "Active • "}Last Content Update: ${dateLabel}`,
				media,
			};
		},
	},
});
