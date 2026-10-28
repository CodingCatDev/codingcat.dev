import { PiCurrencyDollarSimpleFill } from "react-icons/pi";
import { defineField, defineType } from "sanity";

import baseType from "../partials/base";
import { socialsField } from "../partials/user";

export default defineType({
	name: "sponsor",
	title: "Sponsor",
	icon: PiCurrencyDollarSimpleFill,
	type: "document",
	groups: [
		{
			name: "socials",
			title: "Social Links",
		},
	],
	fields: [
		...baseType.fields,
		socialsField,
		defineField({
			title: "Partner Landing / Tracking Link",
			name: "url",
			type: "url",
			description:
				"Canonical sponsor URL including contracted coupon or UTM parameters (e.g. https://www.sanity.io/manage?coupon=CodingCatDev)",
			validation: (Rule) =>
				Rule.required().custom((val) => {
					if (!val) return true;
					try {
						const parsed = new URL(val);
						if (
							parsed.hostname.endsWith("sanity.io") &&
							!parsed.searchParams.has("coupon")
						) {
							return "Sanity partner links must include ?coupon=CodingCatDev";
						}
						return true;
					} catch {
						return "Must be a valid URL";
					}
				}),
		}),
		defineField({
			title: "Match Domains",
			name: "matchDomains",
			type: "array",
			of: [{ type: "string" }],
			description:
				"Bare domains (e.g. sanity.io, algolia.com) that automatically rewrite to use this partner's coupon or UTM parameters across the site.",
		}),
		defineField({
			title: "Coupon Code",
			name: "couponCode",
			type: "string",
			description: "Partner coupon code (e.g. CodingCatDev)",
		}),
		defineField({
			title: "Rewrite Mode",
			name: "rewriteMode",
			type: "string",
			initialValue: "root_or_append",
			options: {
				list: [
					{
						title: "Rewrite root /manage to Landing URL & append params to deep links",
						value: "root_or_append",
					},
					{
						title: "Always preserve path & append coupon/UTM query params",
						value: "append_params",
					},
					{
						title: "Replace bare root domain only (for shortlinks like cld.media / mule.to)",
						value: "replace_root_only",
					},
				],
			},
		}),
		defineField({
			title: "Active Partner",
			name: "active",
			type: "boolean",
			initialValue: true,
		}),
	],
});


