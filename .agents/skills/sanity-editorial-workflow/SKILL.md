---
name: sanity-editorial-workflow
description: End-to-end editorial workflow for CodingCat.dev using Sanity MCP, Sanity CLI, Gemini writing, cover photo generation/upload, and Sanity Content Releases readiness checks. Use when drafting blog posts or podcast show notes, creating or uploading cover images, checking draft/release status, or preparing Sanity Content Releases.
---

# Sanity Editorial Workflow (MCP, CLI, Gemini Writing, Photos & Content Releases)

Use this skill whenever the user asks to:
- Check the status of drafts, upcoming episodes/posts, or **Sanity Content Releases**
- Write or update blog posts (`post`) or podcast show notes (`podcast`) using Gemini (from a topic or a YouTube `transcript`)
- Generate or upload cover images (`coverImage`) to Sanity and attach them to documents
- Stage or audit documents in a Sanity Content Release before publishing

Do **not** create custom wrapper scripts when you can execute operations directly via **Sanity MCP** (`codingcat-dev` / Sanity Context MCP) and **Sanity CLI** (`pnpm --filter @codingcatdev/sanity exec sanity ...`).

---

## 1. Checking Content Releases & Publishing Readiness

Sanity stores documents in three ID namespaces depending on their lifecycle state:
- **Published**: `<docId>`
- **Drafts**: `drafts.<docId>`
- **Content Releases**: `versions.<releaseId>.<docId>` (paired with a release metadata document of `_type == "system.release"`)

### A. Inspect Active Content Releases & Versioned Documents
Run via Sanity CLI (`--with-user-token` reads `drafts.**` and `versions.**` using the logged-in Sanity CLI session):

```bash
pnpm --filter @codingcatdev/sanity exec sanity documents query \
  '{
    "releases": *[_type == "system.release"] | order(_updatedAt desc) {
      _id,
      name,
      state,
      publishAt,
      "metadata": metadata { title, description, releaseType }
    },
    "releaseDocs": *[_id in path("versions.**") && _type in ["post", "podcast"]] | order(_updatedAt desc) {
      _id,
      _type,
      title,
      "slug": slug.current,
      date,
      "hasCoverImage": defined(coverImage.asset._ref),
      "hasExcerpt": defined(excerpt) && length(excerpt) > 10,
      "blockCount": count(content),
      "hasYoutube": defined(youtube),
      "hasSpotify": defined(spotify),
      "hasTranscript": defined(transcript)
    },
    "drafts": *[_id in path("drafts.**") && _type in ["post", "podcast"]] | order(_updatedAt desc) {
      _id,
      _type,
      title,
      "slug": slug.current,
      date,
      "hasCoverImage": defined(coverImage.asset._ref),
      "hasExcerpt": defined(excerpt) && length(excerpt) > 10,
      "blockCount": count(content),
      "hasYoutube": defined(youtube),
      "hasSpotify": defined(spotify),
      "hasTranscript": defined(transcript)
    }
  }' --dataset production --api-version v2025-09-30
```

### B. Publishing Readiness Checklist
Before a `post` or `podcast` is ready to publish (or ready inside a Content Release), verify:
1. **Shared Required Fields (`post` & `podcast`)**:
   - `title` (non-empty string)
   - `slug.current` (lowercase hyphenated slug)
   - `date` (ISO 8601 datetime)
   - `coverImage.asset._ref` (16:9 image uploaded to Sanity)
   - `excerpt` (1–2 sentence summary, <= 160 chars recommended)
   - `content` (non-empty Portable Text array)
   - `author` (defaults to Alex Patterson `_ref: "RIgC5r4TJ0hCGOzxHszD1w"`)
2. **Podcast-Specific Fields (`podcast`)**:
   - `season` (integer) & `episode` (integer)
   - `recordingDate` (ISO 8601 datetime)
   - `guest` (array of references to `guest` documents)
   - `youtube` (YouTube URL — triggers `sync-youtube-transcript` on publish)
   - `spotify` & `listenLinks` (auto-synced by `sync-podcast-links` once published on Anchor/Spotify RSS)

---

## 2. Writing Posts & Podcast Show Notes via Gemini

### Step 1: Retrieve Source Context (Transcript or Existing Draft)
- Use the `codingcat-dev` MCP tool `get_content_by_slug` or `query_content`, or run a Sanity CLI query to fetch the document and its `transcript->fullText`, `transcript->chapters`, and `guest[]->`:
  ```bash
  pnpm --filter @codingcatdev/sanity exec sanity documents query \
    '*[_type in ["post", "podcast"] && (slug.current == $slug || _id == $id)][0]{
      _id, _type, title, "slug": slug.current, excerpt, youtube,
      "transcript": transcript->{ fullText, summary, chapters },
      "guests": guest[]->{ title, excerpt, socials, websites }
    }' --dataset production
  ```

### Step 2: Draft Content & Convert Markdown to Portable Text
- Write the article or episode show notes in clean Markdown:
  - Use `##` (`h2`) and `###` (`h3`) headings to structure sections.
  - Include bulleted takeaways, links mentioned, and fenced code blocks where relevant.
  - Do **not** repeat the document `title` as an `# h1` at the top of `content`.
  - Write a crisp 1–2 sentence `excerpt` that complements the title without repeating it.
- Convert the Markdown to Sanity Portable Text blocks using `@portabletext/markdown` (`markdownToPortableText`) — see `.agents/skills/portable-text-conversion/SKILL.md`.

### Step 3: Save to Draft (`drafts.<id>`) or Content Release (`versions.<releaseId>.<id>`)
- Target `drafts.<docId>` (or `versions.<releaseId>.<docId>` if staging for a Content Release) so changes can be reviewed in Sanity Studio before going live:
  ```bash
  pnpm --filter @codingcatdev/sanity exec sanity documents create <json-file> --replace --dataset production
  ```

---

## 3. Creating & Uploading Photos (`coverImage`)

### Step 1: Generate a 16:9 Cover Image (When Needed)
- Invoke the `image-generator` subagent with a clear 16:9 visual brief tailored to the post/podcast topic and CodingCat.dev's modern developer aesthetic (avoiding cluttered text overlays if the title is already rendered on cards).

### Step 2: Upload the Image Asset & Attach `coverImage`
- Upload the local image file to Sanity's Asset API and patch the target draft/release document using `@sanity/client` via `pnpm --filter @codingcatdev/sanity exec sanity exec <script> --with-user-token`:
  ```ts
  import { createReadStream } from "node:fs";
  import { basename } from "node:path";
  import { getCliClient } from "sanity/cli";

  const client = getCliClient({ apiVersion: "2025-09-30" });
  const asset = await client.assets.upload("image", createReadStream(filePath), {
    filename: basename(filePath),
  });

  await client
    .patch(targetDocumentId) // e.g. "drafts.<id>" or "versions.<releaseId>.<id>"
    .set({
      coverImage: {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: asset._id,
        },
      },
    })
    .commit();
  ```
