import { defineArrayMember, defineField, defineType } from "sanity";
import { FaQuoteLeft } from "react-icons/fa6";
import preview from "../../components/QuotePreview";
import externalLink from "./externalLink";
import internalLink from "./internalLink";

export default defineType({
	name: "quote",
	type: "object",
	icon: FaQuoteLeft,
	fields: [
		defineField({
			name: "content",
			title: "Content",
			type: "array",
			of: [
				defineArrayMember({
					type: "block",
					marks: {
						annotations: [
							defineArrayMember(externalLink),
							defineArrayMember(internalLink),
						],
					},
				}),
			],
		}),
		defineField({
			name: "url",
			type: "url",
			title: "URL",
			description: "Source on the web",
		}),
	],
});
