import { defineType } from "sanity";
import { FaXTwitter } from "react-icons/fa6";
import preview from "../../components/TwitterPreview";

export default defineType({
	name: "twitter",
	type: "object",
	title: "X (Twitter) Post Embed",
	icon: FaXTwitter,
	components: {
		preview,
	},
	preview: {
		select: {
			id: "id",
			url: "url",
			handle: "handle",
		},
	},
	fields: [
		{
			name: "id",
			type: "string",
			title: "X (Twitter) Post ID or URL",
			description: "Paste either the numeric status ID or the full x.com / twitter.com status URL.",
		},
		{
			name: "url",
			type: "url",
			title: "Full Post URL (Optional)",
		},
		{
			name: "author",
			type: "string",
			title: "Author Display Name (Optional)",
		},
		{
			name: "handle",
			type: "string",
			title: "Author Handle (Optional, without @)",
		},
		{
			name: "text",
			type: "text",
			title: "Post Text Fallback (Optional)",
			rows: 3,
		},
		{
			name: "date",
			type: "string",
			title: "Display Date (Optional)",
		},
	],
	initialValue: {
		id: "2114705042817110293",
	},
});
