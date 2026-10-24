import { createClient } from "@sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url";
import { portableTextToMarkdown } from "@portabletext/markdown";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || "hfh83o0w";
const dataset = process.env.SANITY_STUDIO_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_AUTH_TOKEN;
const devtoApiKey = process.env.DEVTO_API_KEY || process.env.PRIVATE_DEVTO;
const hashnodeToken = process.env.HASHNODE_ACCESS_TOKEN || process.env.PRIVATE_HASHNODE;
const docId = process.env.TARGET_DOCUMENT_ID || "05eda048-efff-4e0f-8b76-83a2f482fa13";

console.log("Syndication script starting with config:");
console.log("- Document ID:", docId);
console.log("- Project ID:", projectId);
console.log("- Dataset:", dataset);
console.log("- Has Write Token:", Boolean(token));
console.log("- Has Dev.to Key:", Boolean(devtoApiKey));
console.log("- Has Hashnode Key:", Boolean(hashnodeToken));

if (!token) {
  console.error("Missing SANITY_API_WRITE_TOKEN or SANITY_AUTH_TOKEN.");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2025-09-30",
  useCdn: false,
});

async function createGoogleSyndicationTask({ title, canonicalUrl, tags = [] }) {
  const refreshToken = process.env.GOOGLE_WORKSPACE_REFRESH_TOKEN;
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!refreshToken || !clientId || !clientSecret) {
    console.log("Google Workspace credentials not set; skipping Google Task creation.");
    return;
  }

  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
    });
    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;
    if (!accessToken) {
      console.warn("Could not obtain Google access_token for Task creation.");
      return;
    }

    const taskTitle = `Cross-post to Hashnode & Medium: ${title}`;
    const taskNotes = [
      `Canonical URL: ${canonicalUrl}`,
      `Tags: ${tags.join(", ")}`,
      ``,
      `1. Hashnode (Free UI Editor):`,
      `   - Open: https://hashnode.com/draft`,
      `   - Set Original Article URL (Canonical): ${canonicalUrl}`,
      ``,
      `2. Medium (1-Click Import):`,
      `   - Open: https://medium.com/p/import`,
      `   - Paste: ${canonicalUrl} (automatically sets canonical tag)`,
      ``,
      `3. daily.dev Squad:`,
      `   - Open: https://daily.dev/squads/codingcatdev -> Click "Share a link" -> Paste ${canonicalUrl}`,
    ].join("\n");

    // 1. Try Google Tasks API first
    const tasksRes = await fetch("https://tasks.googleapis.com/tasks/v1/lists/@default/tasks", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: taskTitle,
        notes: taskNotes,
        due: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      }),
    });

    if (tasksRes.ok) {
      const createdTask = await tasksRes.json();
      console.log(`✓ Created Google Task: "${taskTitle}" (ID: ${createdTask.id})`);
      return;
    }

    // 2. Fallback to Google Calendar To-Do Event on alex.patterson@gmail.com if Tasks scope is not yet authorized
    const startDate = new Date(Date.now() + 60 * 60 * 1000);
    const endDate = new Date(startDate.getTime() + 30 * 60 * 1000);
    const calRes = await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/alex.patterson%40gmail.com/events",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          summary: `📋 [Task] ${taskTitle}`,
          description: taskNotes,
          start: { dateTime: startDate.toISOString() },
          end: { dateTime: endDate.toISOString() },
        }),
      }
    );

    if (calRes.ok) {
      const createdEvent = await calRes.json();
      console.log(`✓ Created Google Calendar Task Reminder: "${taskTitle}" (${createdEvent.htmlLink})`);
    } else {
      console.warn("Could not create Google Calendar fallback reminder:", await calRes.text());
    }
  } catch (err) {
    console.warn("Error creating Google syndication task:", err);
  }
}

async function run() {
  const doc = await client.getDocument(docId);
  if (!doc) {
    console.error(`Document not found: ${docId}`);
    process.exit(1);
  }

  console.log(`Loaded document: "${doc.title}" (type: ${doc._type})`);
  const slug = typeof doc.slug === "object" ? doc.slug?.current : (doc.slug || docId);
  const canonicalUrl = `https://codingcat.dev/${doc._type}/${slug}`;

  const imgBuilder = createImageUrlBuilder({ projectId, dataset });
  const urlForImage = (source) => {
    if (!source || !source.asset) return undefined;
    return imgBuilder.image(source).auto("format").fit("max");
  };

  const extractYouTubeId = (url) => {
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
  };

  const formatYouTubeBlock = (url, targetPlatform = "devto") => {
    const ytId = extractYouTubeId(url);
    if (!ytId && !url) return "";
    const watchUrl = ytId ? `https://www.youtube.com/watch?v=${ytId}` : url;
    if (targetPlatform === "devto") {
      return `{% youtube ${ytId || url.replace("live", "embed")} %}`;
    }
    if (targetPlatform === "hashnode") {
      return `%[${watchUrl}]`;
    }
    const thumbUrl = ytId ? `https://i.ytimg.com/vi/${ytId}/maxresdefault.jpg` : "";
    return thumbUrl
      ? `[![Watch on YouTube](${thumbUrl})](${watchUrl})\n\n**[▶ Watch the video on YouTube](${watchUrl})**`
      : `**[▶ Watch on YouTube](${watchUrl})**`;
  };

  const serializeContent = (content, targetPlatform = "devto") => {
    if (!content || !Array.isArray(content) || content.length === 0) {
      return "";
    }
    try {
      return portableTextToMarkdown(content, {
        types: {
          code: ({ value }) => "```" + (value?.language || "") + "\n" + (value?.code || "") + "\n```",
          image: ({ value }) => {
            const url = urlForImage(value)?.url();
            return url ? `![](${url})` : "";
          },
          youtube: ({ value }) => formatYouTubeBlock(value?.youtube || value?.url || "", targetPlatform),
          youtubeShorts: ({ value }) =>
            Array.isArray(value?.shorts)
              ? value.shorts.map((s) => formatYouTubeBlock(s, targetPlatform)).join("\n\n")
              : "",
          codepen: ({ value }) => `{% codepen ${value?.url || ""} %}`,
          codesandbox: ({ value }) => {
            const id = value?.url?.split("https://codesandbox.io/p/sandbox/")?.at(-1);
            return `{% codesandbox ${id || value?.url || ""} %}`;
          },
          twitter: ({ value }) => `{% twitter ${value?.id || ""} %}`,
          quote: ({ value }) => `> ${serializeContent(value?.content, targetPlatform)}`,
        },
      });
    } catch (err) {
      console.warn("Error serializing content:", err);
      return doc.excerpt || "";
    }
  };

  const contentMarkdown = serializeContent(doc.content, "devto");
  const hashnodeMarkdown = serializeContent(doc.content, "hashnode");
  const awsMarkdown = serializeContent(doc.content, "awsbuilder");
  const topYouTubeId = extractYouTubeId(doc.youtube);
  const topYouTubeWatchUrl = topYouTubeId
    ? `https://www.youtube.com/watch?v=${topYouTubeId}`
    : doc.youtube || "";
  console.log(`Content serialized to Markdown: ${contentMarkdown.length} characters`);

  if (doc.youtube) {
    await client.createOrReplace({
      _id: `syndication.${doc._id}.youtube`,
      _type: "syndication",
      target: { _type: "reference", _ref: doc._id },
      platform: "youtube",
      status: "published",
      canonicalUrl,
      externalUrl: topYouTubeWatchUrl,
      externalId: topYouTubeId || doc.youtube,
      syndicatedAt: doc.date || new Date().toISOString(),
    });
  }

  const docTags = Array.isArray(doc.tags) ? doc.tags : [];
  const hasAwsTag = docTags.some(
    (t) => t?.value?.toLowerCase() === "aws" || t?.label?.toLowerCase() === "aws"
  );
  const isSponsored = Array.isArray(doc.sponsor) && doc.sponsor.length > 0;
  const shouldSyndicateAws =
    (hasAwsTag && !isSponsored) ||
    Boolean(doc.awsbuilder) ||
    process.env.FORCE_AWS_BUILDER === "true";

  // --- DEV.TO SYNDICATION ---
  if (devtoApiKey) {
    console.log("\n--- Syndicating to Dev.to ---");
    const syndicationDocId = `syndication.${doc._id}.devto`;
    const normalizedDocTags = docTags
      .map((t) => (t?.value || t?.label || "").toLowerCase().replace(/[^a-z0-9]/g, ""))
      .filter((v) => v.length >= 2 && v.length <= 20);
    const devtoTags = Array.from(
      new Set([
        ...(normalizedDocTags.length > 0
          ? normalizedDocTags.slice(0, 3)
          : ["webdev", "javascript", "programming"]),
        ...(doc._type === "podcast" ? ["podcast"] : []),
      ])
    ).slice(0, 4);

    const mainImageUrl = urlForImage(doc.coverImage)?.width(1280).url() || "";
    const youtubeEmbed = doc.youtube
      ? `{% youtube ${topYouTubeId || doc.youtube.replace("live", "embed")} %}\n\n**[▶ Watch on YouTube & Subscribe to CodingCat.dev](${topYouTubeWatchUrl}${topYouTubeWatchUrl.includes("?") ? "&" : "?"}sub_confirmation=1)**\n\n`
      : "";

    const devtoArticlePayload = {
      article: {
        title: doc.title || "Untitled",
        published: true,
        tags: devtoTags,
        main_image: mainImageUrl,
        canonical_url: canonicalUrl,
        description: doc.excerpt || "",
        organization_id: "1009",
        body_markdown: `Original: ${canonicalUrl}\n\n${youtubeEmbed}${contentMarkdown}`,
      },
    };

    if (doc._type === "podcast") {
      devtoArticlePayload.article.series = `codingcatdev_podcast_${doc.season || 4}`;
    }

    try {
      const existingSyndication = await client.getDocument(syndicationDocId).catch(() => null);
      let existingArticleId =
        existingSyndication?.externalId && !String(existingSyndication.externalId).startsWith("simulated-")
          ? String(existingSyndication.externalId)
          : null;

      if (!existingArticleId && doc.devto) {
        const pathSlug = doc.devto.split("https://dev.to/").at(-1);
        if (pathSlug) {
          const lookupRes = await fetch(`https://dev.to/api/articles/${pathSlug}`, {
            headers: {
              "api-key": devtoApiKey,
              "Content-Type": "application/json",
            },
          });
          if (lookupRes.ok) {
            const lookupJson = await lookupRes.json();
            if (lookupJson?.id) {
              existingArticleId = String(lookupJson.id);
            }
          }
        }
      }

      const method = existingArticleId ? "PUT" : "POST";
      const targetUrl = existingArticleId
        ? `https://dev.to/api/articles/${existingArticleId}`
        : "https://dev.to/api/articles";

      // First attempt with organization_id: 1009
      console.log(`Sending ${method} to ${targetUrl} with organization_id: 1009...`);
      let res = await fetch(targetUrl, {
        method,
        headers: {
          "api-key": devtoApiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(devtoArticlePayload),
      });

      let resText = await res.text();
      console.log("Dev.to initial response status:", res.status);
      console.log("Dev.to initial response body:", resText);

      // If org 1009 fails (e.g. 401 or 422 unauthorized org), retry without organization_id
      if (!res.ok && resText.toLowerCase().includes("organization")) {
        console.warn("Dev.to rejected organization_id 1009. Retrying under personal account without organization_id...");
        delete devtoArticlePayload.article.organization_id;
        res = await fetch(targetUrl, {
          method,
          headers: {
            "api-key": devtoApiKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(devtoArticlePayload),
        });
        resText = await res.text();
        console.log("Dev.to retry response status:", res.status);
        console.log("Dev.to retry response body:", resText);
      }

      if (res.ok) {
        const resJson = JSON.parse(resText);
        console.log(`✓ Dev.to published: ${resJson.url} (ID: ${resJson.id})`);

        await client.createOrReplace({
          _id: syndicationDocId,
          _type: "syndication",
          target: { _type: "reference", _ref: doc._id },
          platform: "devto",
          status: "published",
          canonicalUrl,
          externalUrl: resJson.url,
          externalId: String(resJson.id ?? ""),
          syndicatedAt: new Date().toISOString(),
        });

        await client.patch(doc._id).set({ devto: resJson.url }).commit();
        console.log(`✓ Updated Sanity doc ${doc._id} devto URL`);
      } else {
        console.error("✗ Dev.to publication failed:", resText);
      }
    } catch (err) {
      console.error("✗ Dev.to request error:", err);
    }
  } else {
    console.log("Dev.to key missing, skipping Dev.to");
  }

  // --- HASHNODE SYNDICATION ---
  if (hashnodeToken) {
    console.log("\n--- Syndicating to Hashnode ---");
    const syndicationDocId = `syndication.${doc._id}.hashnode`;
    const publicationId = process.env.HASHNODE_PUBLICATION_ID || "60242f8180da6c44eadf775b";

    const subtitle = doc.excerpt && doc.excerpt.length > 250
      ? doc.excerpt.substring(0, 247) + "..."
      : (doc.excerpt || "");

    const mappedHashnodeTags = docTags
      .map((t) => ({
        name: t?.label || t?.value || "",
        slug: (t?.value || t?.label || "").toLowerCase().replace(/[^a-z0-9-]/g, "-"),
      }))
      .filter((t) => t.name && t.slug)
      .slice(0, 4);

    const hashnodeTags = mappedHashnodeTags.length > 0
      ? mappedHashnodeTags
      : [
          { name: "JavaScript", slug: "javascript" },
          { name: "Web Development", slug: "web-development" },
          { name: "Beginner Developers", slug: "beginners" },
        ];

    const hashnodeCoverImageUrl = urlForImage(doc.coverImage)?.width(1600).url() || "";
    const youtubeEmbed = doc.youtube
      ? `%[${topYouTubeWatchUrl}]\n\n**[▶ Watch on YouTube & Subscribe to CodingCat.dev](${topYouTubeWatchUrl}${topYouTubeWatchUrl.includes("?") ? "&" : "?"}sub_confirmation=1)**\n\n`
      : "";

    const articleInput = {
      title: doc.title || "Untitled",
      subtitle,
      publicationId,
      slug: `${doc._type}-${slug}`,
      tags: hashnodeTags,
      ...(hashnodeCoverImageUrl ? { coverImage: hashnodeCoverImageUrl } : {}),
      originalArticleURL: canonicalUrl,
      contentMarkdown: `Original: ${canonicalUrl}\n\n${youtubeEmbed}${hashnodeMarkdown}`,
    };

    try {
      const authHeader = hashnodeToken.startsWith("Bearer ") ? hashnodeToken : `Bearer ${hashnodeToken}`;
      const publishRes = await fetch("https://gql-beta.hashnode.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
          "x-hashnode-client": "hashnode-cli",
        },
        body: JSON.stringify({
          operationName: "publishPost",
          query: `mutation publishPost($input: PublishPostInput!) {
            publishPost(input: $input) {
              post {
                id
                title
                slug
                url
              }
            }
          }`,
          variables: { input: articleInput },
        }),
      });

      const publishData = await publishRes.json();
      console.log("Hashnode response:", JSON.stringify(publishData, null, 2));

      const publishedPost = publishData?.data?.publishPost?.post;
      if (publishedPost) {
        const externalUrl = publishedPost.url || `https://hashnode.codingcat.dev/${publishedPost.slug}`;
        console.log(`✓ Hashnode published: ${externalUrl}`);

        await client.createOrReplace({
          _id: syndicationDocId,
          _type: "syndication",
          target: { _type: "reference", _ref: doc._id },
          platform: "hashnode",
          status: "published",
          canonicalUrl,
          externalUrl,
          externalId: publishedPost.slug || publishedPost.id,
          syndicatedAt: new Date().toISOString(),
        });

        const postSlug = publishedPost.slug || publishedPost.id;
        await client.patch(doc._id).set({ hashnode: postSlug }).commit();
        console.log(`✓ Updated Sanity doc ${doc._id} hashnode slug`);
      } else {
        console.error("✗ Hashnode publication failed:", publishData?.errors);
        await createGoogleSyndicationTask({
          title: doc.title || "Untitled",
          canonicalUrl,
          tags: hashnodeTags.map((t) => t.slug),
        });
      }
    } catch (err) {
      console.error("✗ Hashnode request error:", err);
    }
  }

  // --- AWS BUILDER CENTER SYNDICATION (Gated on AWS tag) ---
  const awsSessionToken = process.env.AWS_BUILDER_SESSION_TOKEN;
  if (shouldSyndicateAws && awsSessionToken) {
    console.log("\n--- Syndicating to AWS Builder Center ---");
    const syndicationDocId = `syndication.${doc._id}.awsbuilder`;
    const awsHeaders = {
      "Content-Type": "application/json",
      Accept: "application/json",
      "builder-session-token": awsSessionToken,
      Cookie: `builder-session-token=${awsSessionToken}`,
    };

    try {
      const existingSyndication = await client.getDocument(syndicationDocId).catch(() => null);
      const urlContentIdMatch = doc.awsbuilder?.match(/builder\.aws\.com\/content\/([A-Za-z0-9]+)/);
      let contentId =
        (existingSyndication?.externalId && !String(existingSyndication.externalId).startsWith("simulated-")
          ? String(existingSyndication.externalId)
          : null) ||
        (urlContentIdMatch ? urlContentIdMatch[1] : null);
      let versionId = null;

      if (contentId) {
        const editInitRes = await fetch("https://api.builder.aws.com/cs/article/InitializeEditArticle", {
          method: "POST",
          headers: awsHeaders,
          body: JSON.stringify({ contentId }),
        });
        if (editInitRes.ok) {
          const editInitJson = await editInitRes.json();
          versionId = editInitJson?.versionId || null;
        }
      }

      if (!contentId || !versionId) {
        const initRes = await fetch("https://api.builder.aws.com/cs/article/InitializeArticle", {
          method: "POST",
          headers: awsHeaders,
          body: JSON.stringify({}),
        });
        if (!initRes.ok) {
          throw new Error(`InitializeArticle failed (${initRes.status}): ${await initRes.text()}`);
        }
        const initJson = await initRes.json();
        contentId = initJson?.contentId;
        versionId = initJson?.versionId;
      }

      let coverImageUploadKey;
      const coverImageUrl = urlForImage(doc.coverImage)?.width(1280).format("jpg").url() || "";
      if (coverImageUrl) {
        const imgRes = await fetch(coverImageUrl);
        if (imgRes.ok) {
          const imgBuf = await imgRes.arrayBuffer();
          const presignRes = await fetch("https://api.builder.aws.com/cs/upload/generate-presigned-post", {
            method: "POST",
            headers: awsHeaders,
            body: JSON.stringify({
              contentId,
              fileName: `${slug}-cover.jpg`,
              contentType: "image/jpeg",
              uploadType: "ARTICLE",
            }),
          });
          if (presignRes.ok) {
            const presignData = await presignRes.json();
            const formData = new FormData();
            for (const [k, v] of Object.entries(presignData.presignedPostFields || {})) {
              formData.append(k, String(v));
            }
            formData.append("file", new Blob([imgBuf], { type: "image/jpeg" }), `${slug}-cover.jpg`);
            const s3Res = await fetch(presignData.presignedPostUrl, {
              method: "POST",
              body: formData,
            });
            if (s3Res.ok || s3Res.status === 204) {
              coverImageUploadKey = presignData.uploadKey;
            }
          }
        }
      }

      const awsTags = Array.from(
        new Set(docTags.map((t) => (t?.value || t?.label || "").toLowerCase()).filter(Boolean).slice(0, 5))
      );
      if (awsTags.length === 0) awsTags.push("aws");

      const youtubeMd = doc.youtube
        ? `${formatYouTubeBlock(doc.youtube, "awsbuilder")}\n\n`
        : "";
      const draftPayload = {
        contentId,
        versionId,
        title: doc.title || "Untitled",
        summary: (doc.excerpt || doc.title || "").slice(0, 300),
        contentBody: `*Originally published at [${canonicalUrl}](${canonicalUrl})*\n\n${youtubeMd}${awsMarkdown}`,
        canonicalUrl,
        preferredUrlSlug: slug,
        tags: awsTags,
        autoSave: false,
        ...(coverImageUploadKey ? { coverImageUploadKey, coverImageAlt: doc.title || "Cover image" } : {}),
      };

      const saveRes = await fetch("https://api.builder.aws.com/cs/article/SaveArticleDraft", {
        method: "POST",
        headers: awsHeaders,
        body: JSON.stringify(draftPayload),
      });
      if (!saveRes.ok) {
        throw new Error(`SaveArticleDraft failed (${saveRes.status}): ${await saveRes.text()}`);
      }

      await fetch("https://api.builder.aws.com/cs/article/SubmissionCheck", {
        method: "POST",
        headers: awsHeaders,
        body: JSON.stringify({ contentId, versionId }),
      });

      const pubRes = await fetch("https://api.builder.aws.com/cs/article/PublishArticle", {
        method: "POST",
        headers: awsHeaders,
        body: JSON.stringify({ contentId, versionId }),
      });
      if (!pubRes.ok) {
        throw new Error(`PublishArticle failed (${pubRes.status}): ${await pubRes.text()}`);
      }

      const externalUrl = `https://builder.aws.com/content/${contentId}/${slug}`;
      console.log(`✓ AWS Builder Center published: ${externalUrl}`);

      await client.createOrReplace({
        _id: syndicationDocId,
        _type: "syndication",
        target: { _type: "reference", _ref: doc._id },
        platform: "awsbuilder",
        status: "published",
        canonicalUrl,
        externalUrl,
        externalId: String(contentId),
        syndicatedAt: new Date().toISOString(),
      });

      await client.patch(doc._id).set({ awsbuilder: externalUrl }).commit();
    } catch (err) {
      console.error("✗ AWS Builder Center syndication error:", err);
    }
  }

  // --- DAILY.DEV SQUAD SYNDICATION ---
  const dailyDevSession = process.env.DAILY_DEV_SESSION_COOKIE;
  if (dailyDevSession) {
    console.log("\n--- Syndicating to daily.dev Squad ---");
    const syndicationDocId = `syndication.${doc._id}.dailydev`;
    const squadSourceId = "dc8ed5af-d1f6-423d-9f17-703d33946006";
    const baseCookie = dailyDevSession.includes("__Secure-dast=")
      ? dailyDevSession
      : `da2=m7Z6H7R0hwoOhyQZ1WW7K; __Secure-dast=${dailyDevSession}`;

    try {
      const bootRes = await fetch("https://api.daily.dev/boot?v=3.47.11", {
        headers: {
          app: "webapp",
          "Content-Type": "application/json",
          Cookie: baseCookie,
          Origin: "https://app.daily.dev",
          Referer: "https://app.daily.dev/",
        },
      });
      const refreshedCookies =
        bootRes.headers
          .getSetCookie?.()
          ?.map((c) => c.split(";")[0])
          .join("; ") || baseCookie;

      const gqlHeaders = {
        "Content-Type": "application/json",
        Cookie: refreshedCookies,
        Origin: "https://app.daily.dev",
        Referer: "https://app.daily.dev/",
      };

      const existingSyndication = await client.getDocument(syndicationDocId).catch(() => null);
      let postId =
        existingSyndication?.externalId &&
        !String(existingSyndication.externalId).startsWith("simulated-")
          ? String(existingSyndication.externalId)
          : doc._id === "post-php2shell-cve-2026-109618"
            ? "lmBG2IYsS"
            : null;

      const squadSuffix = topYouTubeWatchUrl ? `\nFull guide: ${canonicalUrl}` : "";
      const maxExcerptLen = Math.max(40, 240 - squadSuffix.length);
      const rawCommentary = (doc.excerpt || doc.title || "New on CodingCat.dev!").trim();
      const trimmedCommentary =
        rawCommentary.length > maxExcerptLen
          ? `${rawCommentary.slice(0, maxExcerptLen - 3).trim()}...`
          : rawCommentary;
      const commentary = `${trimmedCommentary}${squadSuffix}`.slice(0, 240);
      const coverImageUrl =
        urlForImage(doc.coverImage)?.width(1280).format("jpg").url() ||
        (topYouTubeId ? `https://i.ytimg.com/vi/${topYouTubeId}/maxresdefault.jpg` : "");
      const squadExternalLink = topYouTubeWatchUrl || canonicalUrl;

      if (!postId && doc.dailydev) {
        const match = doc.dailydev.match(/-([A-Za-z0-9]{9})$/);
        if (match) postId = match[1];
      }

      if (postId) {
        const editRes = await fetch("https://api.daily.dev/graphql", {
          method: "POST",
          headers: gqlHeaders,
          body: JSON.stringify({
            query: `mutation UpdateSquadPost($id: ID!, $commentary: String) {
              editSharePost(id: $id, commentary: $commentary) {
                id
              }
            }`,
            variables: { id: postId, commentary },
          }),
        });
        const editData = await editRes.json();
        if (editData?.errors) {
          console.warn("daily.dev editSharePost warning, creating new Squad post:", editData.errors);
          postId = null;
        }
      }

      if (!postId) {
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
              title: doc.title || "Untitled",
              commentary,
              ...(coverImageUrl ? { imageUrl: coverImageUrl } : {}),
              externalLink: squadExternalLink,
            },
          }),
        });
        let createData = await createRes.json();
        if (createData?.errors && squadExternalLink !== canonicalUrl) {
          console.warn(
            "daily.dev Squad YouTube link warning, retrying with canonicalUrl:",
            createData.errors
          );
          const retryRes = await fetch("https://api.daily.dev/graphql", {
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
                title: doc.title || "Untitled",
                commentary: rawCommentary.slice(0, 240),
                ...(coverImageUrl ? { imageUrl: coverImageUrl } : {}),
                externalLink: canonicalUrl,
              },
            }),
          });
          createData = await retryRes.json();
        }
        if (createData?.errors) {
          throw new Error(
            `daily.dev createPostInMultipleSources error: ${JSON.stringify(createData.errors)}`
          );
        }
        postId = createData?.data?.createPostInMultipleSources?.[0]?.id;
      }

      if (!postId) {
        throw new Error("daily.dev Squad publish did not return a post ID");
      }

      const postRes = await fetch("https://api.daily.dev/graphql", {
        method: "POST",
        headers: gqlHeaders,
        body: JSON.stringify({
          query: `query GetSquadPost($id: ID!) {
            post(id: $id) {
              id
              commentsPermalink
              permalink
            }
          }`,
          variables: { id: postId },
        }),
      });
      const postJson = await postRes.json();
      const externalUrl =
        postJson?.data?.post?.commentsPermalink || `https://daily.dev/posts/${postId}`;

      console.log(`✓ daily.dev Squad published: ${externalUrl}`);

      await client.createOrReplace({
        _id: syndicationDocId,
        _type: "syndication",
        target: { _type: "reference", _ref: doc._id },
        platform: "dailydev",
        status: "published",
        canonicalUrl,
        externalUrl,
        externalId: String(postId),
        syndicatedAt: new Date().toISOString(),
      });

      await client.patch(doc._id).set({ dailydev: externalUrl }).commit();
      console.log(`✓ Updated Sanity doc ${doc._id} dailydev URL`);
    } catch (err) {
      console.error("✗ daily.dev Squad syndication error:", err);
    }
  }

  // --- LINK SYNDICATION REFERENCES ON PARENT ---
  try {
    const platforms = [
      "devto",
      "hashnode",
      "dailydev",
      "youtube",
      "medium",
      "reddit",
      ...(shouldSyndicateAws ? ["awsbuilder"] : []),
    ];
    const candidateRefs = platforms.map((p) => `syndication.${doc._id}.${p}`);
    const existingSynDocs = await Promise.all(
      candidateRefs.map((ref) => client.getDocument(ref).catch(() => null))
    );
    const expectedRefs = candidateRefs.filter((_, idx) => Boolean(existingSynDocs[idx]));
    const latestDoc = await client.getDocument(doc._id);
    const existingRefs = (latestDoc?.syndications || []).map((s) => s._ref);

    const newRefs = expectedRefs.filter((ref) => !existingRefs.includes(ref));
    if (newRefs.length > 0) {
      const referencesToAppend = newRefs.map((ref) => ({
        _key: `syn_${ref.replace(/[^a-zA-Z0-9]/g, "_")}`,
        _type: "reference",
        _ref: ref,
      }));

      await client
        .patch(doc._id)
        .setIfMissing({ syndications: [] })
        .append("syndications", referencesToAppend)
        .commit();

      console.log(`✓ Linked ${newRefs.length} syndications to parent document ${doc._id}`);
    }
  } catch (err) {
    console.warn("Could not append syndications array to parent:", err);
  }

  console.log("\nSyndication run completed successfully!");
}

run().catch((err) => {
  console.error("Run error:", err);
  process.exit(1);
});
