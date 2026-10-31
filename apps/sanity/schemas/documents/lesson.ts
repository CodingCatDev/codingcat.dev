import { HiOutlineBookOpen } from "react-icons/hi";
import { defineField, defineType } from "sanity";

import contentType from "../partials/content";

export default defineType({
	...contentType,
	name: "lesson",
	title: "Lesson",
	icon: HiOutlineBookOpen,
	type: "document",
	groups: [...(contentType.groups || [])],
	fields: [
		defineField({
			name: "archived",
			title: "Archived / Outdated Lesson",
			type: "boolean",
			initialValue: false,
		}),
		defineField({
			name: "lastUpdated",
			title: "Last Content Update",
			description:
				"Actual content update timestamp for this lesson (used instead of system _updatedAt).",
			type: "datetime",
		}),
		defineField({
			name: "locked",
			title: "Locked",
			type: "boolean",
			initialValue: false,
		}),
		...contentType.fields,
	],
});
