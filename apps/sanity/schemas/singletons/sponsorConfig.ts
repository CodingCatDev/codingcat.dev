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
      name: "depositPercentage",
      title: "Upfront Deposit Percentage",
      type: "number",
      description: "Percentage required upfront to lock a calendar & production slot (default 50%)",
      initialValue: 50,
    }),
    defineField({
      name: "rateCardTiers",
      title: "Rate Card Tiers",
      type: "array",
      description: "Multi-channel launch bundles & sponsorship tiers",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "id",
              title: "Tier ID",
              type: "string",
            }),
            defineField({
              name: "name",
              title: "Name",
              type: "string",
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
            }),
            defineField({
              name: "price",
              title: "Total Price (USD)",
              type: "number",
            }),
            defineField({
              name: "depositPrice",
              title: "50% Deposit Price (USD)",
              type: "number",
            }),
          ],
        },
      ],
      initialValue: [
        {
          _type: "object",
          _key: "full-stack-launch",
          id: "full-stack-launch",
          name: "Full-Stack Launch Bundle",
          description:
            "Dedicated YouTube deep-dive (61K+ subs) + 4 vertical Shorts across 7 platforms (28 native video posts) + Canonical SEO/AEO blog post on codingcat.dev (syndicated to Dev.to & Hashnode) + Dual-account social amplification + Live Deal Room.",
          price: 3500,
          depositPrice: 1750,
        },
        {
          _type: "object",
          _key: "podcast-showcase",
          id: "podcast-showcase",
          name: "Sponsored Podcast & Multi-Channel Showcase",
          description:
            "Priority fast-track 45-min podcast episode + 4 vertical Shorts across 7 platforms + Integrated mid-roll + Permanent show notes, blog feature, and Deal Room telemetry.",
          price: 2000,
          depositPrice: 1000,
        },
        {
          _type: "object",
          _key: "ecosystem-integration",
          id: "ecosystem-integration",
          name: "Ecosystem Integration (Mid-Roll + Social Pack)",
          description:
            "60-second host-read mid-roll integration in a technical video + Multi-channel social thread across X, LinkedIn, Bluesky, Threads, and Mastodon + Permanent link on codingcat.dev.",
          price: 950,
          depositPrice: 475,
        },
      ],
    }),
    defineField({
      name: "outreachEmailTemplate",
      title: "Outreach Email Template",
      type: "text",
      description: "Template for automated sponsor outreach emails. Use {{companyName}} for personalization",
      initialValue:
        "Hi {{contactName}},\n\nSaw {{companyName}}'s recent momentum and put together two concrete technical video concepts we could build and distribute across CodingCat.dev (61K+ YouTube subscribers, 7-platform Shorts syndication, and canonical AEO blog posts).\n\n{{videoConcepts}}\n\nWould you be open to a quick 15-minute chat this week? You can grab a live time slot directly here: https://codingcat.dev/sponsorships#sponsorship-form\n\nBest,\nAlex Patterson\nFounder, CodingCat.dev",
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
