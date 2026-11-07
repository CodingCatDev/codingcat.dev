import { defineArrayMember, defineField, defineType } from "sanity";
import { TierListStudioInput } from "../../components/TierListStudioInput";

export const tierDetailType = defineType({
	name: "tierDetail",
	title: "Spec / Detail Line",
	type: "object",
	fields: [
		defineField({
			name: "label",
			title: "Label (e.g., VM & Security, Pricing)",
			type: "string",
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "value",
			title: "Value",
			type: "string",
			validation: (rule) => rule.required(),
		}),
	],
	preview: {
		select: {
			title: "label",
			subtitle: "value",
		},
	},
});

export const tierItemType = defineType({
	name: "tierItem",
	title: "Tier List Item",
	type: "object",
	fields: [
		defineField({
			name: "tier",
			title: "Tier Rank",
			type: "string",
			initialValue: "A",
			options: {
				list: [
					{ title: "S - Purrfect (Production Gold)", value: "S" },
					{ title: "A - Strong Pick (Production Ready)", value: "A" },
					{ title: "B - Solid w/ Caveats", value: "B" },
					{ title: "C - Situational / Niche", value: "C" },
					{ title: "D - Pass / Caution", value: "D" },
				],
				layout: "radio",
				direction: "horizontal",
			},
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "name",
			title: "Platform / Tool Name",
			type: "string",
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "category",
			title: "Category / Camp Pill (e.g., 2. Cloud Fleet)",
			type: "string",
		}),
		defineField({
			name: "summary",
			title: "Alex's Architectural Verdict",
			type: "text",
			rows: 2,
		}),
		defineField({
			name: "badge",
			title: "Highlight Badge / Pricing Pill (Optional)",
			type: "string",
		}),
		defineField({
			name: "url",
			title: "Link URL (Optional)",
			type: "url",
		}),
		defineField({
			name: "details",
			title: "Additional Specs (Key-Value Lines)",
			type: "array",
			of: [defineArrayMember({ type: "tierDetail" })],
		}),
	],
	preview: {
		select: {
			tier: "tier",
			name: "name",
			category: "category",
			summary: "summary",
		},
		prepare({ tier, name, category, summary }) {
			return {
				title: `[${tier || "B"}-Tier] ${name || "Untitled Platform"}`,
				subtitle: [category, summary].filter(Boolean).join(" · "),
			};
		},
	},
});

const tierListType = defineType({
	name: "tierList",
	title: "Tier List (S/A/B/C/D Board + AJ)",
	type: "object",
	components: {
		input: TierListStudioInput,
	},
	fields: [
		defineField({
			name: "title",
			title: "Tier List Title",
			type: "string",
			initialValue: "Alex's Architectural Tier List",
		}),
		defineField({
			name: "subtitle",
			title: "Subtitle / Methodology Note",
			type: "string",
			initialValue:
				"Ranked from S-Tier (Purrfect Production Pick) to D-Tier based on security boundaries, memory architecture, and real-world DX.",
		}),
		defineField({
			name: "ajComment",
			title: "AJ's Sticky-Note Comment Bubble",
			type: "string",
			initialValue: "I ranked all of them! Watch out for shared VMs... 👀🐾",
		}),
		defineField({
			name: "items",
			title: "Ranked Platforms / Items",
			type: "array",
			of: [defineArrayMember({ type: "tierItem" })],
		}),
	],
	preview: {
		select: {
			title: "title",
			items: "items",
			ajComment: "ajComment",
		},
		prepare({ title, items, ajComment }) {
			const count = Array.isArray(items) ? items.length : 0;
			return {
				title: `🏆 ${title || "CodingCat.dev Tier List"} (${count} ranked)`,
				subtitle: ajComment ? `AJ: "${ajComment}"` : "Interactive S/A/B/C/D Tier List",
			};
		},
	},
});

export default tierListType;
