import { defineField, defineType } from "sanity";

export default defineType({
	name: "dashboardSettings",
	title: "Dashboard Settings",
	type: "document",
	icon: () => "⚙️",
	fields: [
		defineField({
			name: "videosPerWeek",
			title: "Videos Per Week",
			type: "number",
			initialValue: 3,
			validation: (rule) => rule.min(1).max(14),
		}),
		defineField({
			name: "publishDays",
			title: "Preferred Publish Days",
			type: "array",
			of: [{ type: "string" }],
			options: {
				list: [
					{ title: "Monday", value: "Mon" },
					{ title: "Tuesday", value: "Tue" },
					{ title: "Wednesday", value: "Wed" },
					{ title: "Thursday", value: "Thu" },
					{ title: "Friday", value: "Fri" },
					{ title: "Saturday", value: "Sat" },
					{ title: "Sunday", value: "Sun" },
				],
			},
			initialValue: ["Mon", "Wed", "Fri"],
		}),
		defineField({
			name: "contentCategories",
			title: "Content Categories",
			type: "array",
			of: [{ type: "string" }],
			initialValue: [
				"JavaScript", "TypeScript", "React", "Next.js", "Angular",
				"Svelte", "Node.js", "CSS", "DevOps", "AI / ML",
				"Web Performance", "Tooling",
			],
		}),
		defineField({
			name: "rateCardTiers",
			title: "Sponsor Rate Card Tiers",
			type: "array",
			of: [
				{
					type: "object",
					fields: [
						defineField({ name: "name", title: "Tier Name", type: "string" }),
						defineField({ name: "description", title: "Description", type: "string" }),
						defineField({ name: "price", title: "Price", type: "number" }),
					],
					preview: {
						select: { title: "name", subtitle: "price" },
						prepare({ title, subtitle }) {
							return { title, subtitle: subtitle ? `$${subtitle}` : "" };
						},
					},
				},
			],
			initialValue: [
				{ _type: "object", name: "Pre-roll Mention", description: "15-second sponsor mention at the start of the video", price: 200 },
				{ _type: "object", name: "Mid-roll Segment", description: "60-second dedicated sponsor segment mid-video", price: 500 },
				{ _type: "object", name: "Dedicated Video", description: "Full sponsored video with product deep-dive", price: 1500 },
			],
		}),
	],
	preview: {
		prepare() {
			return { title: "Dashboard Settings" };
		},
	},
});
