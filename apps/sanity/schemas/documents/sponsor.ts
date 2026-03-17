import { PiCurrencyDollarSimpleFill } from "react-icons/pi";
import { format, parseISO } from "date-fns";
import { defineField, defineType } from "sanity";

import baseType from "../partials/base";
import {
	socialPreviewFields,
	socialPreviewGroup,
} from "../partials/socialPreview";

export default defineType({
	name: "sponsor",
	title: "Sponsor",
	icon: PiCurrencyDollarSimpleFill,
	type: "document",
	groups: [socialPreviewGroup],
	fields: [
		...baseType.fields,
		...socialPreviewFields,
		defineField({
			title: "Link",
			name: "url",
			type: "url",
			validation: (Rule) => Rule.required(),
		}),
	],
});
