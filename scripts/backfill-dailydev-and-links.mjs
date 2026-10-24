import fs from "node:fs";
import path from "node:path";
import { createClient } from "@sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || "hfh83o0w";
const token = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_AUTH_TOKEN;
const dast =
  process.env.DAILY_DEV_SESSION_COOKIE ||
  "LLanoEYNBQITREh4k48Zpckdd3UxGDTV.%2B%2FeFxFfX%2F3tZBARFA3zuJFVQ%2F2FnrER0SjdVnRaQDNs%3D";

const prodClient = createClient({
  projectId,
  dataset: "production",
  ...(token ? { token } : {}),
  apiVersion: "2025-09-30",
  useCdn: false,
});

const imgBuilder = createImageUrlBuilder({ projectId, dataset: "production" });
const urlForImage = (source) => {
  if (!source || !source.asset) return undefined;
  return imgBuilder.image(source).auto("format").fit("max");
};

function extractYouTubeId(url) {
  if (!url || typeof url !== "string") return null;
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

function normalizeTitle(str) {
  return (str || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getDailyDevCookies() {
  const baseCookie = dast.includes("__Secure-dast=")
    ? dast
    : `da2=m7Z6H7R0hwoOhyQZ1WW7K; __Secure-dast=${dast}`;
  const bootRes = await fetch("https://api.daily.dev/boot?v=3.47.11", {
    headers: {
      app: "webapp",
      "Content-Type": "application/json",
      Cookie: baseCookie,
      Origin: "https://app.daily.dev",
      Referer: "https://app.daily.dev/",
    },
  });
  const setCookies = bootRes.headers
    .getSetCookie?.()
    ?.map((c) => c.split(";")[0])
    .join("; ");
  return setCookies || baseCookie;
}

async function fetchAllSquadPosts(cookies) {
  const squadSourceId = "dc8ed5af-d1f6-423d-9f17-703d33946006";
  let allSquadPosts = [];
  let after = null;

  while (true) {
    const res = await fetch("https://api.daily.dev/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookies,
        Origin: "https://app.daily.dev",
        Referer: "https://app.daily.dev/",
      },
      body: JSON.stringify({
        query: `query($after: String) {
          sourceFeed(
            source: "${squadSourceId}"
            first: 50
            after: $after
            ranking: TIME
            supportedTypes: ["article", "share", "freeform", "video:youtube", "collection", "poll"]
          ) {
            pageInfo {
              hasNextPage
              endCursor
            }
            edges {
              node {
                id
                title
                type
                createdAt
                permalink
                commentsPermalink
                sharedPost {
                  id
                  title
                  type
                  permalink
                  commentsPermalink
                }
              }
            }
          }
        }`,
        variables: { after },
      }),
    });

    const data = await res.json();
    const feed = data?.data?.sourceFeed;
    if (!feed) break;
    allSquadPosts.push(...feed.edges.map((e) => e.node));
    if (!feed.pageInfo?.hasNextPage) break;
    after = feed.pageInfo.endCursor;
  }

  return allSquadPosts;
}

function buildSquadCommentary(doc, canonicalUrl) {
  const suffix = `\nFull guide: ${canonicalUrl}`;
  const maxBodyLen = Math.max(40, 240 - suffix.length);
  const rawBody = (doc.excerpt || doc.title || "Watch & read on CodingCat.dev").trim();
  const trimmedBody =
    rawBody.length > maxBodyLen ? `${rawBody.slice(0, maxBodyLen - 3).trim()}...` : rawBody;
  return `${trimmedBody}${suffix}`.slice(0, 240);
}

async function createSquadPostWithRetry({ squadSourceId, title, commentary, coverImageUrl, externalLink }) {
  for (let attempt = 1; attempt <= 4; attempt++) {
    const cookies = await getDailyDevCookies();
    const gqlHeaders = {
      "Content-Type": "application/json",
      Cookie: cookies,
      Origin: "https://app.daily.dev",
      Referer: "https://app.daily.dev/",
    };

    const createRes = await fetch("https://api.daily.dev/graphql", {
      method: "POST",
      headers: gqlHeaders,
      body: JSON.stringify({
        query: `mutation CreatePostInMultipleSources(
          $sourceIds: [ID!]!
          $title: String
          $commentary: String
          $imageUrl: String
          $externalLink: String
        ) {
          createPostInMultipleSources(
            sourceIds: $sourceIds
            title: $title
            commentary: $commentary
            imageUrl: $imageUrl
            externalLink: $externalLink
          ) {
            id
            sourceId
            type
            slug
          }
        }`,
        variables: {
          sourceIds: [squadSourceId],
          title,
          commentary,
          ...(coverImageUrl ? { imageUrl: coverImageUrl } : {}),
          externalLink,
        },
      }),
    });

    const createData = await createRes.json();
    const createdId = createData?.data?.createPostInMultipleSources?.[0]?.id;
    if (createdId) {
      const postRes = await fetch("https://api.daily.dev/graphql", {
        method: "POST",
        headers: gqlHeaders,
        body: JSON.stringify({
          query: `query GetSquadPost($id: ID!) {
            post(id: $id) {
              id
              title
              type
              createdAt
              permalink
              commentsPermalink
              sharedPost {
                id
                title
                type
                permalink
                commentsPermalink
              }
            }
          }`,
          variables: { id: createdId },
        }),
      });
      const postJson = await postRes.json();
      return (
        postJson?.data?.post || {
          id: createdId,
          title,
          commentsPermalink: `https://daily.dev/posts/${createdId}`,
        }
      );
    }

    const rateLimitErr = createData?.errors?.find((e) => e?.extensions?.code === "RATE_LIMITED");
    if (rateLimitErr) {
      const waitSec = (Number(rateLimitErr.extensions?.retryAfter) || 30) + 2;
      console.log(`      Rate limited; waiting ${waitSec}s before retry (attempt ${attempt}/4)...`);
      await sleep(waitSec * 1000);
      continue;
    }

    return { error: createData?.errors };
  }
  return { error: "Max retries exceeded" };
}

async function main() {
  const cookies = await getDailyDevCookies();

  console.log("1. Fetching existing posts in CodingCat.dev Squad on daily.dev...");
  let squadPosts = await fetchAllSquadPosts(cookies);
  console.log(`   Found ${squadPosts.length} existing Squad posts.`);

  console.log("2. Fetching all published posts & podcasts from Sanity...");
  const sanityDocs = await prodClient.fetch(
    `*[_type in ["post", "podcast"] && !(_id in path("drafts.**"))] | order(coalesce(date, _createdAt) desc) {
      _id,
      _type,
      title,
      "slug": slug.current,
      "date": coalesce(date, _createdAt),
      excerpt,
      youtube,
      coverImage,
      devto,
      hashnode,
      awsbuilder,
      dailydev,
      medium,
      reddit,
      syndications
    }`
  );
  console.log(`   Found ${sanityDocs.length} published Sanity documents.`);

  const matchSquadPost = (doc) => {
    const normDocTitle = normalizeTitle(doc.title);
    const slug = doc.slug || doc._id;
    for (const sp of squadPosts) {
      const normShared = normalizeTitle(sp.sharedPost?.title);
      const normSpTitle = normalizeTitle(sp.title);
      if (
        (normShared &&
          (normShared === normDocTitle ||
            normShared.includes(normDocTitle) ||
            normDocTitle.includes(normShared))) ||
        (normSpTitle && (normSpTitle === normDocTitle || normSpTitle.includes(normDocTitle))) ||
        (sp.title && sp.title.includes(`/${doc._type}/${slug}`))
      ) {
        return sp;
      }
    }
    return null;
  };

  const mapPath = path.resolve("scripts/dailydev-squad-map.json");
  const existingMap = fs.existsSync(mapPath)
    ? JSON.parse(fs.readFileSync(mapPath, "utf8"))
    : {};

  const docsSince2025 = sanityDocs.filter((d) => d.date >= "2025-01-01");
  const missingSince2025 = docsSince2025.filter(
    (d) => !matchSquadPost(d) && !existingMap[d._id] && !d.dailydev
  );
  console.log(
    `3. Found ${missingSince2025.length} missing 2025-2026 posts/podcasts to backfill to daily.dev Squad.`
  );

  const squadSourceId = "dc8ed5af-d1f6-423d-9f17-703d33946006";
  const chronologicalMissing = [...missingSince2025].reverse();

  for (let i = 0; i < chronologicalMissing.length; i++) {
    const doc = chronologicalMissing[i];
    const slug = doc.slug || doc._id;
    const canonicalUrl = `https://codingcat.dev/${doc._type}/${slug}`;
    const ytId = extractYouTubeId(doc.youtube);
    const externalLink = ytId ? `https://www.youtube.com/watch?v=${ytId}` : canonicalUrl;
    const commentary = ytId
      ? buildSquadCommentary(doc, canonicalUrl)
      : (doc.excerpt || doc.title || "Read on CodingCat.dev").slice(0, 240);
    const coverImageUrl =
      urlForImage(doc.coverImage)?.width(1280).format("jpg").url() ||
      (ytId ? `https://i.ytimg.com/vi/${ytId}/maxresdefault.jpg` : "");

    console.log(
      `   [${i + 1}/${chronologicalMissing.length}] Publishing "${doc.title}" (${doc.date.slice(0, 10)}) [link: ${externalLink}]...`
    );

    let result = await createSquadPostWithRetry({
      squadSourceId,
      title: doc.title || "Untitled",
      commentary,
      coverImageUrl,
      externalLink,
    });

    if (result?.error && ytId) {
      console.warn(
        `      Warning with YouTube link (${JSON.stringify(result.error)}), retrying with canonicalUrl...`
      );
      result = await createSquadPostWithRetry({
        squadSourceId,
        title: doc.title || "Untitled",
        commentary: (doc.excerpt || doc.title || "").slice(0, 240),
        coverImageUrl,
        externalLink: canonicalUrl,
      });
    }

    if (result?.id) {
      squadPosts.unshift(result);
      console.log(`      ✓ Published: ${result.commentsPermalink}`);
    } else {
      console.error(`      ✗ Failed to publish "${doc.title}":`, JSON.stringify(result?.error));
    }

    if (i < chronologicalMissing.length - 1) {
      await sleep(31000);
    }
  }

  console.log("\n4. Re-fetching complete Squad feed and syncing all platform links & syndication docs to Sanity...");
  const refreshedCookies = await getDailyDevCookies();
  squadPosts = await fetchAllSquadPosts(refreshedCookies);
  console.log(`   Total Squad posts now in CodingCat.dev Squad: ${squadPosts.length}`);

  let matchedDailyDevCount = 0;
  let totalSyndicationDocsSynced = 0;
  const prodMutations = [];
  const devMutations = [];
  const squadMap = { ...existingMap };

  for (const doc of sanityDocs) {
    const slug = doc.slug || doc._id;
    const canonicalUrl = `https://codingcat.dev/${doc._type}/${slug}`;
    const matchedSp = matchSquadPost(doc);
    const savedEntry = existingMap[doc._id];

    const dailydevUrl =
      matchedSp?.commentsPermalink ||
      savedEntry?.dailydevUrl ||
      doc.dailydev ||
      (doc._id === "post-php2shell-cve-2026-109618"
        ? "https://daily.dev/posts/two-critical-pre-authentication-rce-flaws-in-php-cve-2026-109618-and-cve-2026-109619-uncovered-by-lmbg2iyss"
        : null);

    if (dailydevUrl) {
      matchedDailyDevCount++;
      const m = dailydevUrl.match(/-([A-Za-z0-9]{9})$/);
      squadMap[doc._id] = {
        dailydevUrl,
        externalId: matchedSp?.id || savedEntry?.externalId || (m ? m[1] : doc._id),
        syndicatedAt:
          matchedSp?.createdAt || savedEntry?.syndicatedAt || doc.date || new Date().toISOString(),
      };
    }

    const platformEntries = [];
    if (doc.devto) {
      platformEntries.push({
        platform: "devto",
        externalUrl: doc.devto,
        externalId: doc.devto.split("/").at(-1) || doc._id,
      });
    }
    if (doc.hashnode) {
      const hnUrl = doc.hashnode.startsWith("http")
        ? doc.hashnode
        : `https://hashnode.codingcat.dev/${doc.hashnode}`;
      platformEntries.push({
        platform: "hashnode",
        externalUrl: hnUrl,
        externalId: doc.hashnode,
      });
    }
    if (doc.awsbuilder) {
      const m = doc.awsbuilder.match(/builder\.aws\.com\/content\/([A-Za-z0-9]+)/);
      platformEntries.push({
        platform: "awsbuilder",
        externalUrl: doc.awsbuilder,
        externalId: m ? m[1] : doc._id,
      });
    }
    if (dailydevUrl) {
      const m = dailydevUrl.match(/-([A-Za-z0-9]{9})$/);
      platformEntries.push({
        platform: "dailydev",
        externalUrl: dailydevUrl,
        externalId: matchedSp?.id || (m ? m[1] : doc._id),
        syndicatedAt: matchedSp?.createdAt || doc.date || new Date().toISOString(),
      });
    }
    if (doc.youtube) {
      const ytId = extractYouTubeId(doc.youtube);
      const ytUrl = ytId ? `https://www.youtube.com/watch?v=${ytId}` : doc.youtube;
      platformEntries.push({
        platform: "youtube",
        externalUrl: ytUrl,
        externalId: ytId || doc.youtube,
      });
    }
    if (doc.medium) {
      platformEntries.push({
        platform: "medium",
        externalUrl: doc.medium,
        externalId: doc.medium.split("/").at(-1) || doc._id,
      });
    }
    if (doc.reddit) {
      platformEntries.push({
        platform: "reddit",
        externalUrl: doc.reddit,
        externalId: doc.reddit.split("/").filter(Boolean).at(-1) || doc._id,
      });
    }

    const synRefs = [];
    for (const entry of platformEntries) {
      const synId = `syndication.${doc._id}.${entry.platform}`;
      const synDoc = {
        _id: synId,
        _type: "syndication",
        target: { _type: "reference", _ref: doc._id },
        platform: entry.platform,
        status: "published",
        canonicalUrl,
        externalUrl: entry.externalUrl,
        externalId: String(entry.externalId),
        syndicatedAt: entry.syndicatedAt || doc.date || new Date().toISOString(),
      };
      prodMutations.push({ createOrReplace: synDoc });
      devMutations.push({ createOrReplace: synDoc });
      totalSyndicationDocsSynced++;

      synRefs.push({
        _key: `syn_${synId.replace(/[^a-zA-Z0-9]/g, "_")}`,
        _type: "reference",
        _ref: synId,
      });
    }

    const docSetPatch = {};
    if (dailydevUrl && doc.dailydev !== dailydevUrl) {
      docSetPatch.dailydev = dailydevUrl;
    }
    if (synRefs.length > 0) {
      docSetPatch.syndications = synRefs;
    }

    if (Object.keys(docSetPatch).length > 0) {
      prodMutations.push({
        patch: {
          id: doc._id,
          set: docSetPatch,
        },
      });
      devMutations.push({
        patch: {
          id: doc._id,
          set: docSetPatch,
        },
      });
    }
  }

  const mapPath = path.resolve("scripts/dailydev-squad-map.json");
  fs.writeFileSync(mapPath, JSON.stringify(squadMap, null, 2));
  console.log(`   Saved ${Object.keys(squadMap).length} Squad mappings to ${mapPath}`);

  console.log(
    `   Prepared ${prodMutations.length} mutations (${totalSyndicationDocsSynced} syndication docs across ${sanityDocs.length} content items; ${matchedDailyDevCount} matched to daily.dev Squad).`
  );

  if (!token) {
    console.log(
      "   (Skipping Sanity write commit locally because SANITY_API_WRITE_TOKEN is not set; will commit in GitHub Actions)"
    );
    return;
  }

  const commitBatches = async (datasetName, mutations) => {
    const batchSize = 100;
    for (let i = 0; i < mutations.length; i += batchSize) {
      const slice = mutations.slice(i, i + batchSize);
      const res = await fetch(
        `https://${projectId}.api.sanity.io/v2025-09-30/data/mutate/${datasetName}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ mutations: slice }),
        }
      );
      if (!res.ok) {
        console.warn(`Batch mutation warning on ${datasetName}:`, await res.text());
      }
    }
  };

  await commitBatches("production", prodMutations);
  console.log("   ✓ Committed all syndication records & platform links to Sanity (production)");
  await commitBatches("dev", devMutations);
  console.log("   ✓ Committed all syndication records & platform links to Sanity (dev)");
}

main().catch((err) => {
  console.error("Backfill error:", err);
  process.exit(1);
});
