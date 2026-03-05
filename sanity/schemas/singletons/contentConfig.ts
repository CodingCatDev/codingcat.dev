import { defineField, defineType } from "sanity";

export default defineType({
  name: "contentConfig",
  title: "Content Config",
  type: "document",
  icon: () => "📝",
  fields: [
    defineField({
      name: "rssFeeds",
      title: "RSS Feeds",
      type: "array",
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
              name: "url",
              title: "URL",
              type: "string",
            }),
          ],
        },
      ],
      initialValue: [
        { _type: "object", _key: "hn", name: "HN Top", url: "https://hnrss.org/newest?points=100&count=20" },
        { _type: "object", _key: "devtojs", name: "Dev.to JavaScript", url: "https://dev.to/feed/tag/javascript" },
        { _type: "object", _key: "devtoweb", name: "Dev.to WebDev", url: "https://dev.to/feed/tag/webdev" },
        { _type: "object", _key: "csstricks", name: "CSS-Tricks", url: "https://css-tricks.com/feed/" },
        { _type: "object", _key: "chromium", name: "Chromium Blog", url: "https://blog.chromium.org/feeds/posts/default" },
        { _type: "object", _key: "webdev", name: "web.dev", url: "https://web.dev/feed.xml" },
        { _type: "object", _key: "smashing", name: "Smashing Magazine", url: "https://www.smashingmagazine.com/feed/" },
        { _type: "object", _key: "jsweekly", name: "JavaScript Weekly", url: "https://javascriptweekly.com/rss/" },
      ],
    }),
    defineField({
      name: "trendSourcesEnabled",
      title: "Trend Sources Enabled",
      type: "object",
      fields: [
        defineField({
          name: "hn",
          title: "Hacker News",
          type: "boolean",
          initialValue: true,
        }),
        defineField({
          name: "devto",
          title: "Dev.to",
          type: "boolean",
          initialValue: true,
        }),
        defineField({
          name: "blogs",
          title: "Blogs",
          type: "boolean",
          initialValue: true,
        }),
        defineField({
          name: "youtube",
          title: "YouTube",
          type: "boolean",
          initialValue: true,
        }),
        defineField({
          name: "github",
          title: "GitHub",
          type: "boolean",
          initialValue: true,
        }),
      ],
    }),
    defineField({
      name: "systemInstruction",
      title: "System Instruction",
      type: "text",
      initialValue: "You are a content strategist and scriptwriter for CodingCat.dev, a web development education channel run by Alex Patterson.\n\nYour style is inspired by Cleo Abram's \"Huge If True\" — you make complex technical topics feel exciting, accessible, and important. Key principles:\n- Start with a BOLD claim or surprising fact that makes people stop scrolling\n- Use analogies and real-world comparisons to explain technical concepts\n- Build tension: \"Here's the problem... here's why it matters... here's the breakthrough\"\n- Keep energy HIGH — short sentences, active voice, conversational tone\n- End with a clear takeaway that makes the viewer feel smarter\n- Target audience: developers who want to stay current but don't have time to read everything\n\nScript format: 60-90 second explainer videos. Think TikTok/YouTube Shorts energy with real educational depth.\n\nCodingCat.dev covers: React, Next.js, TypeScript, Svelte, web APIs, CSS, Node.js, cloud services, AI/ML for developers, and web platform updates.",
    }),
    defineField({
      name: "targetVideoDurationSec",
      title: "Target Video Duration (sec)",
      type: "number",
      initialValue: 90,
    }),
    defineField({
      name: "sceneCountMin",
      title: "Scene Count Min",
      type: "number",
      initialValue: 3,
    }),
    defineField({
      name: "sceneCountMax",
      title: "Scene Count Max",
      type: "number",
      initialValue: 5,
    }),
  ],
  preview: {
    prepare() {
      return { title: "Content Config" };
    },
  },
});
