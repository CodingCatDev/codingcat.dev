import { defineField, defineType } from "sanity";

export default defineType({
  name: "sponsorConfig",
  title: "Sponsor Config",
  type: "document",
  icon: () => "💰",
  fields: [
    defineField({
      name: "cooldownDays",
      title: "Cooldown Days",
      type: "number",
      description: "Days to wait before contacting a sponsor again after the last outreach",
      initialValue: 14,
    }),
    defineField({
      name: "rateCardTiers",
      title: "Rate Card Tiers",
      type: "array",
      description: "Sponsorship pricing tiers shown in outreach emails. Each tier has a name, description, and price",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "name",
              title: "Name",
              type: "string",
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "string",
            }),
            defineField({
              name: "price",
              title: "Price",
              type: "number",
            }),
          ],
        },
      ],
      initialValue: [
        { _type: "object", _key: "starter", name: "starter", description: "5k-10k impressions", price: 500 },
        { _type: "object", _key: "growth", name: "growth", description: "10k-50k impressions", price: 1500 },
        { _type: "object", _key: "premium", name: "premium", description: "50k+ impressions", price: 3000 },
      ],
    }),
    defineField({
      name: "outreachEmailTemplate",
      title: "Outreach Email Template",
      type: "text",
      description: "Template for automated sponsor outreach emails. Use {{companyName}} for personalization",
      initialValue: "Hi {{companyName}},\n\nI run CodingCat.dev...",
    }),
    defineField({
      name: "maxOutreachPerRun",
      title: "Max Outreach Per Run",
      type: "number",
      description: "Maximum sponsor emails to send per cron run. Keeps volume manageable and avoids spam flags",
      initialValue: 10,
    }),
  ],
  preview: {
    prepare() {
      return { title: "Sponsor Config" };
    },
  },
});
