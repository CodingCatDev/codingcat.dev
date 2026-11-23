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
          price: 1000,
          depositPrice: 0,
        },
        {
          _type: "object",
          _key: "sponsor-of-the-month",
          id: "sponsor-of-the-month",
          name: "Sponsor of the Month (4x Ads)",
          description:
            "Host-read ad at the beginning of 4 consecutive podcast & YouTube episodes, with description link, promo code, and show notes.",
          price: 800,
          depositPrice: 0,
        },
        {
          _type: "object",
          _key: "dedicated-video",
          id: "dedicated-video",
          name: "Standalone Dedicated YouTube Video",
          description:
            "Full YouTube video dedicated entirely to building with your product, SDK, or platform.",
          price: 600,
          depositPrice: 0,
        },
        {
          _type: "object",
          _key: "podcast-showcase",
          id: "podcast-showcase",
          name: "Sponsored Podcast & Multi-Channel Showcase",
          description:
            "Priority fast-track 45-min podcast episode + 4 vertical Shorts across 7 platforms + host-read callout + permanent show notes, blog feature, and Deal Room telemetry.",
          price: 500,
          depositPrice: 0,
        },
        {
          _type: "object",
          _key: "mid-roll-ad",
          id: "mid-roll-ad",
          name: "Pre-Roll / Integrated 60s Ad",
          description:
            "Host-read sponsor mention or 60-second technical integration in a podcast or YouTube tutorial with permanent show notes link.",
          price: 250,
          depositPrice: 0,
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
    defineField({
      name: "partnerTrackers",
      title: "Partner Link & UTM/Coupon Trackers",
      type: "array",
      description:
        "Automatic URL rewrites applied whenever a post, podcast, or sponsor card links to a partner domain (e.g. sanity.io -> https://www.sanity.io/manage?coupon=CodingCatDev).",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "name", title: "Partner Name", type: "string" }),
            defineField({
              name: "matchDomains",
              title: "Match Domains",
              type: "array",
              of: [{ type: "string" }],
            }),
            defineField({
              name: "landingUrl",
              title: "Canonical Partner URL",
              type: "url",
            }),
            defineField({
              name: "couponCode",
              title: "Coupon Code",
              type: "string",
            }),
            defineField({
              name: "utmSource",
              title: "UTM Source",
              type: "string",
              initialValue: "codingcatdev",
            }),
          ],
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Sponsor Config" };
    },
  },
});
