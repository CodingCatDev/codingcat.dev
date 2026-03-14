import { defineType, defineField } from "sanity";
import { FaYoutube } from "react-icons/fa6";

export default defineType({
	name: "youtube",
	type: "object",
	title: "YouTube Embed",
	icon: FaYoutube,
	fields: [
		defineField({
			name: "youtube",
			type: "url",
			title: "YouTube video URL",
		}),
	],
});
