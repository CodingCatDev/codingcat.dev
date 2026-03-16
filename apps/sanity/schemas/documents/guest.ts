import { UserIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

import userType from "../partials/user";

export default defineType({
	...userType,
	name: "guest",
	title: "Guest",
	icon: UserIcon,
	type: "document",
	fields: [
		...userType.fields,
		defineField({
			name: "company",
			title: "Company",
			type: "string",
			description: "Company or organization",
		}),
		defineField({
			name: "role",
			title: "Role",
			type: "string",
			description: "Job title or role",
		}),
	],
});
