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

  const serializeContent = (content) => {
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
          codepen: ({ value }) => `{% codepen ${value?.url || ""} %}`,
          codesandbox: ({ value }) => {
            const id = value?.url?.split("https://codesandbox.io/p/sandbox/")?.at(-1);
            return `{% codesandbox ${id || value?.url || ""} %}`;
          },
          twitter: ({ value }) => `{% twitter ${value?.id || ""} %}`,
          quote: ({ value }) => `> ${serializeContent(value?.content)}`,
        },
      });
    } catch (err) {
      console.warn("Error serializing content:", err);
      return doc.excerpt || "";
    }
  };

  const contentMarkdown = serializeContent(doc.content);
  console.log(`Content serialized to Markdown: ${contentMarkdown.length} characters`);

  // --- DEV.TO SYNDICATION ---
  if (devtoApiKey) {
    console.log("\n--- Syndicating to Dev.to ---");
    const syndicationDocId = `syndication.${doc._id}.devto`;
    const devtoTags = ["webdev", "javascript", "beginners"];
    if (doc._type === "podcast") devtoTags.push("podcast");

    const mainImageUrl = urlForImage(doc.coverImage)?.width(1000).height(420).url() || "";
    const youtubeEmbed = doc.youtube ? `{% youtube ${doc.youtube.replace("live", "embed")} %}\n\n` : "";

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
      // First attempt with organization_id: 1009
      console.log("Sending POST to Dev.to API with organization_id: 1009...");
      let res = await fetch("https://dev.to/api/articles", {
        method: "POST",
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
        res = await fetch("https://dev.to/api/articles", {
          method: "POST",
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

    const hashnodeTags = [
      { name: "JavaScript", slug: "javascript" },
      { name: "Web Development", slug: "web-development" },
      { name: "Beginner Developers", slug: "beginners" },
    ];

    const hashnodeCoverImageUrl = urlForImage(doc.coverImage)?.width(1600).height(840).url() || "";
    const youtubeEmbed = doc.youtube ? `%[${doc.youtube.replace("live", "embed")}]\n\n` : "";

    const articleInput = {
      title: doc.title || "Untitled",
      subtitle,
      publicationId,
      slug: `${doc._type}-${slug}`,
      tags: hashnodeTags,
      ...(hashnodeCoverImageUrl ? { coverImage: hashnodeCoverImageUrl } : {}),
      originalArticleURL: canonicalUrl,
      contentMarkdown: `Original: ${canonicalUrl}\n\n${youtubeEmbed}${contentMarkdown}`,
    };

    try {
      const publishRes = await fetch("https://gql-beta.hashnode.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: hashnodeToken,
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
      }
    } catch (err) {
      console.error("✗ Hashnode request error:", err);
    }
  }

  // --- LINK SYNDICATION REFERENCES ON PARENT ---
  try {
    const platforms = ["devto", "hashnode"];
    const expectedRefs = platforms.map((p) => `syndication.${doc._id}.${p}`);
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
