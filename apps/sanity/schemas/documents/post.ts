import { HiOutlinePencilAlt } from "react-icons/hi";
import { defineField, defineType } from "sanity";

import contentType from "../partials/content";
import {
	socialPreviewFields,
	socialPreviewGroup,
} from "../partials/socialPreview";
import categoryType from "./category";

export default defineType({
	...contentType,
	name: "post",
	title: "Post",
	icon: HiOutlinePencilAlt,
	type: "document",
	groups: [...(contentType.groups || []), socialPreviewGroup],
	fields: [
		...contentType.fields,
		...socialPreviewFields,
		defineField({
			name: "categories",
			title: "Categories",
			type: "array",
			of: [
				{
					type: "reference",
					to: [{ type: categoryType.name }],
				},
			],
		}),
	],
});
