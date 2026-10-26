import { Devvit, SettingScope } from "@devvit/public-api";

Devvit.configure({
  redditAPI: true,
  redis: true,
  http: true,
});

Devvit.addSettings([
  {
    type: "string",
    name: "sanityProjectId",
    label: "Sanity Project ID",
    defaultValue: "hfh83o0w",
    scope: SettingScope.Installation,
  },
  {
    type: "string",
    name: "sanityDataset",
    label: "Sanity Dataset",
    defaultValue: "production",
    scope: SettingScope.Installation,
  },
  {
    type: "string",
    name: "sanityWriteToken",
    label: "Sanity API Write Token (optional: writes Reddit URL back to Sanity)",
    isSecret: true,
    scope: SettingScope.App,
  },
]);

interface SanityContentDoc {
  _id: string;
  _type: "post" | "podcast";
  title: string;
  slug: string;
  date: string;
  excerpt?: string;
  youtube?: string;
  reddit?: string;
}

function extractYouTubeId(url?: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/live\/|youtube\.com\/shorts\/)([A-Za-z0-9_-]{11})/,
    /^([A-Za-z0-9_-]{11})$/,
  ];
  for (const re of patterns) {
    const m = trimmed.match(re);
    if (m) return m[1];
  }
  return null;
}

async function syncLatestCodingCatContent(context: Devvit.Context): Promise<number> {
  const settings = await context.settings.getAll();
  const projectId = (settings.sanityProjectId as string) || "hfh83o0w";
  const dataset = (settings.sanityDataset as string) || "production";
  const sanityWriteToken = (settings.sanityWriteToken as string) || "";

  const subreddit = await context.reddit.getCurrentSubreddit();
  const subredditName = subreddit.name;

  const query = encodeURIComponent(
    `*[_type in ["post", "podcast"] && !(_id in path("drafts.**")) && !defined(reddit)] | order(coalesce(date, _createdAt) desc)[0...5] {
      _id,
      _type,
      title,
      "slug": slug.current,
      "date": coalesce(date, _createdAt),
      excerpt,
      youtube,
      reddit
    }`
  );

  const res = await fetch(
    `https://${projectId}.apicdn.sanity.io/v2025-09-30/data/query/${dataset}?query=${query}`
  );
  if (!res.ok) {
    console.error(`Failed to query Sanity (${res.status}): ${await res.text()}`);
    return 0;
  }

  const json = (await res.json()) as { result?: SanityContentDoc[] };
  const docs = (json.result || []).reverse();
  let postedCount = 0;

  for (const doc of docs) {
    const redisKey = `posted:${doc._id}`;
    const alreadyPosted = await context.redis.get(redisKey);
    if (alreadyPosted || doc.reddit) {
      continue;
    }

    const canonicalUrl = `https://codingcat.dev/${doc._type}/${doc.slug}`;
    const ytId = extractYouTubeId(doc.youtube);
    const youtubeWatchUrl = ytId ? `https://www.youtube.com/watch?v=${ytId}` : null;

    // Submit YouTube watch URL as the primary link when present so Reddit renders the native inline YouTube player
    const targetLinkUrl = youtubeWatchUrl || canonicalUrl;
    const prefix = doc._type === "podcast" ? "[Podcast] " : "";
    const postTitle = `${prefix}${doc.title}`.slice(0, 300);

    const submission = await context.reddit.submitPost({
      subredditName,
      title: postTitle,
      url: targetLinkUrl,
    });

    const redditPostUrl = `https://www.reddit.com${submission.permalink || `/r/${subredditName}/comments/${submission.id.replace(/^t3_/, "")}`}`;

    // Post an automatic first comment with the excerpt, codingcat.dev article + transcript link, and YouTube subscribe CTA
    const commentLines = [
      doc.excerpt ? `> ${doc.excerpt.trim()}` : "",
      "",
      `📖 **Read the full guide, code snippets & transcript on CodingCat.dev:** [${canonicalUrl}](${canonicalUrl})`,
      youtubeWatchUrl
        ? `📺 **Watch on YouTube & Subscribe:** [${youtubeWatchUrl}](${youtubeWatchUrl}?sub_confirmation=1)`
        : `📺 **Subscribe to CodingCat.dev on YouTube:** [https://www.youtube.com/@CodingCatDev](https://www.youtube.com/@CodingCatDev?sub_confirmation=1)`,
    ].filter(Boolean);

    try {
      const comment = await context.reddit.submitComment({
        id: submission.id,
        text: commentLines.join("\n"),
      });
      await comment.distinguish(true);
    } catch (commentErr) {
      console.warn("Could not distinguish comment:", commentErr);
    }

    await context.redis.set(redisKey, redditPostUrl);
    postedCount++;

    // Write Reddit URL and syndication doc back to Sanity if sanityWriteToken is configured
    if (sanityWriteToken) {
      const synId = `syndication.${doc._id}.reddit`;
      const mutations = [
        {
          createOrReplace: {
            _id: synId,
            _type: "syndication",
            target: { _type: "reference", _ref: doc._id },
            platform: "reddit",
            status: "published",
            canonicalUrl,
            externalUrl: redditPostUrl,
            externalId: submission.id,
            syndicatedAt: new Date().toISOString(),
          },
        },
        {
          patch: {
            id: doc._id,
            set: { reddit: redditPostUrl },
          },
        },
      ];

      await fetch(
        `https://${projectId}.api.sanity.io/v2025-09-30/data/mutate/${dataset}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sanityWriteToken}`,
          },
          body: JSON.stringify({ mutations }),
        }
      ).catch((err) => console.warn("Failed writing Reddit URL back to Sanity:", err));
    }
  }

  return postedCount;
}

Devvit.addSchedulerJob({
  name: "codingcat_sanity_sync",
  onRun: async (_event, context) => {
    const count = await syncLatestCodingCatContent(context);
    console.log(`[codingcat_sanity_sync] Published ${count} new items to subreddit.`);
  },
});

Devvit.addTrigger({
  event: "AppInstall",
  onEvent: async (_event, context) => {
    await context.scheduler.runJob({
      name: "codingcat_sanity_sync",
      cron: "*/30 * * * *",
    });
  },
});

Devvit.addMenuItem({
  label: "Sync Latest from CodingCat.dev Now",
  location: "subreddit",
  forUserType: "moderator",
  onPress: async (_event, context) => {
    const count = await syncLatestCodingCatContent(context);
    context.ui.showToast(
      count > 0
        ? `Published ${count} new CodingCat.dev post(s) to r/CodingCatDev!`
        : "r/CodingCatDev is already up to date with Sanity!"
    );
  },
});

export default Devvit;
