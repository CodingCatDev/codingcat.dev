import { documentEventHandler } from "@sanity/functions";
import { createClient } from "@sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url";
import { portableTextToMarkdown } from "@portabletext/markdown";

interface ContentDocument {
	_id: string;
	_type: "post" | "podcast";
	title?: string;
	slug?: { current?: string } | string;
	excerpt?: string;
	youtube?: string;
	coverImage?: any;
	content?: any[];
	season?: number;
	episode?: number;
	devto?: string;
	hashnode?: string;
	awsbuilder?: string;
	tags?: Array<{ _key?: string; label?: string; value?: string }>;
	sponsor?: Array<{ _ref: string }>;
	syndications?: Array<{ _type: "reference"; _ref: string; _key?: string }>;
}

export const handler = documentEventHandler<ContentDocument>(
	async ({ context, event }) => {
		const rawData = event.data;
		if (!rawData?._id || !rawData?._type) {
			console.log("[Syndicate Content] No valid document data in event, skipping.");
			return;
		}

		// Skip drafts
		if (rawData._id.startsWith("drafts.")) {
			console.log("[Syndicate Content] Skipping draft document:", rawData._id);
			return;
		}

		const dataset = context.clientOptions?.dataset || "dev";
		const isProduction = dataset === "production";
		const projectId = context.clientOptions?.projectId || "hfh83o0w";

		const token =
			context.clientOptions?.token ||
			process.env.SANITY_API_WRITE_TOKEN ||
			process.env.SANITY_AUTH_TOKEN;

		const client = createClient({
			...context.clientOptions,
			token,
			apiVersion: "2025-09-30",
		});

		// Fetch the full published document to guarantee we have all content blocks and metadata
		const fetchedDoc = await client.getDocument<ContentDocument>(rawData._id).catch(() => undefined);
		const data: ContentDocument = fetchedDoc || rawData;
		if (!data || !data._id) {
			console.log("[Syndicate Content] Document not found:", rawData._id);
			return;
		}

		const slug =
			typeof data.slug === "object" && data.slug !== null
				? data.slug.current || data._id
				: typeof data.slug === "string"
					? data.slug
					: data._id;

		const canonicalUrl = isProduction
			? `https://codingcat.dev/${data._type}/${slug}`
			: `https://dev.codingcat.dev/${data._type}/${slug}`;

		const imgBuilder = createImageUrlBuilder({ projectId, dataset });
		const urlForImage = (source: any) => {
			if (!source || !source.asset) return undefined;
			return imgBuilder.image(source).auto("format").fit("max");
		};

		// Helper to serialize Portable Text to Markdown matching exact legacy serializer specifications
		const serializeContent = (content: any[] | undefined): string => {
			if (!content || !Array.isArray(content) || content.length === 0) {
				return "";
			}

			try {
				return portableTextToMarkdown(content, {
					types: {
						code: ({ value }) =>
							"```" + (value?.language || "") + "\n" + (value?.code || "") + "\n```",
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
				console.warn("[Syndicate Content] Error serializing Portable Text:", err);
				return data.excerpt || "";
			}
		};

		const contentMarkdown = serializeContent(data.content);
		const docTags = Array.isArray(data.tags) ? data.tags : [];
		const hasAwsTag = docTags.some(
			(t) =>
				t?.value?.toLowerCase() === "aws" || t?.label?.toLowerCase() === "aws",
		);
		const isSponsored = Array.isArray(data.sponsor) && data.sponsor.length > 0;
		const shouldSyndicateAws =
			(hasAwsTag && !isSponsored) ||
			Boolean(data.awsbuilder) ||
			process.env.FORCE_AWS_BUILDER === "true";

		const platforms: Array<"devto" | "hashnode" | "awsbuilder"> = [
			"devto",
			"hashnode",
			...(shouldSyndicateAws ? (["awsbuilder"] as const) : []),
		];

		console.log(
			`[Syndicate Content] Processing ${data._type} (${data._id}) on dataset: ${dataset}. Production mode: ${isProduction}. Platforms: ${platforms.join(", ")}`,
		);

		const parentPatch: Record<string, unknown> = {};

		for (const platform of platforms) {
			const syndicationDocId = `syndication.${data._id}.${platform}`;

			if (!isProduction) {
				// Non-production (dev / preview): simulate and mark complete without outbound API calls
				console.log(
					`[Syndicate Content] Simulating syndication for ${platform} on ${data._id}`,
				);

				try {
					const simHost =
						platform === "devto"
							? "dev.to"
							: platform === "hashnode"
								? "hashnode.com"
								: "builder.aws.com";
					await client.createOrReplace({
						_id: syndicationDocId,
						_type: "syndication",
						target: {
							_type: "reference",
							_ref: data._id,
						},
						platform,
						status: "simulated_complete",
						canonicalUrl,
						externalUrl: `https://${simHost}/preview-simulated/${slug}`,
						externalId: `simulated-${data._id}-${platform}`,
						syndicatedAt: new Date().toISOString(),
						error: undefined,
					});

					console.log(
						`[Syndicate Content] Created simulated syndication document: ${syndicationDocId}`,
					);
				} catch (err) {
					console.error(
						`[Syndicate Content] Failed to create simulated syndication document for ${platform}:`,
						err,
					);
				}
				continue;
			}

			// Production mode: live outbound publishing
			try {
				if (platform === "devto") {
					const apiKey = process.env.DEVTO_API_KEY || process.env.PRIVATE_DEVTO;
					if (!apiKey) {
						console.warn(
							"[Syndicate Content] DEVTO_API_KEY not configured. Skipping Dev.to live dispatch.",
						);
						await client.createOrReplace({
							_id: syndicationDocId,
							_type: "syndication",
							target: { _type: "reference", _ref: data._id },
							platform: "devto",
							status: "failed",
							canonicalUrl,
							error: "DEVTO_API_KEY environment variable is missing",
						});
						continue;
					}

					const normalizedDocTags = docTags
						.map((t) =>
							(t?.value || t?.label || "")
								.toLowerCase()
								.replace(/[^a-z0-9]/g, ""),
						)
						.filter((v) => v.length >= 2 && v.length <= 20);

					const devtoTags = Array.from(
						new Set([
							...(normalizedDocTags.length > 0
								? normalizedDocTags.slice(0, 3)
								: ["webdev", "javascript", "programming"]),
							...(data._type === "podcast" ? ["podcast"] : []),
						]),
					).slice(0, 4);

					const mainImageUrl =
						urlForImage(data.coverImage)?.width(1280).url() || "";

					const youtubeEmbed = data.youtube
						? `{% youtube ${data.youtube.replace("live", "embed")} %}\n\n`
						: "";

					const devtoArticlePayload: any = {
						article: {
							title: data.title || "Untitled",
							published: true,
							tags: devtoTags,
							main_image: mainImageUrl,
							canonical_url: canonicalUrl,
							description: data.excerpt || "",
							organization_id: "1009",
							body_markdown: `Original: ${canonicalUrl}\n\n${youtubeEmbed}${contentMarkdown}`,
						},
					};

					if (data._type === "podcast") {
						devtoArticlePayload.article.series = `codingcatdev_podcast_${data.season || 4}`;
					}

					// Check existing syndication doc to see if this was already published
					const existingSyndication = await client
						.getDocument(syndicationDocId)
						.catch(() => null);

					let res: Response;
					const existingDevtoId =
						existingSyndication?.externalId ||
						(data.devto ? data.devto.split("https://dev.to/").at(-1) : null);

					let targetDevtoUrl = "https://dev.to/api/articles";
					let devtoMethod = "POST";

					if (existingDevtoId && !existingDevtoId.startsWith("simulated-")) {
						// Retrieve existing article ID from Dev.to to perform a PUT update
						const getArticleRes = await fetch(
							`https://dev.to/api/articles/${existingDevtoId}`,
							{
								headers: {
									"api-key": apiKey,
									"Content-Type": "application/json",
								},
							},
						);

						if (getArticleRes.ok) {
							const articleData = (await getArticleRes.json()) as any;
							if (articleData?.id) {
								targetDevtoUrl = `https://dev.to/api/articles/${articleData.id}`;
								devtoMethod = "PUT";
							}
						}
					}

					res = await fetch(targetDevtoUrl, {
						method: devtoMethod,
						headers: {
							"api-key": apiKey,
							"Content-Type": "application/json",
						},
						body: JSON.stringify(devtoArticlePayload),
					});

					let errText = "";
					if (!res.ok) {
						errText = await res.text();
						if (errText.toLowerCase().includes("organization")) {
							delete devtoArticlePayload.article.organization_id;
							res = await fetch(targetDevtoUrl, {
								method: devtoMethod,
								headers: {
									"api-key": apiKey,
									"Content-Type": "application/json",
								},
								body: JSON.stringify(devtoArticlePayload),
							});
							if (!res.ok) {
								errText = await res.text();
							}
						}
					}

					if (!res.ok) {
						throw new Error(`Dev.to API error (${res.status}): ${errText}`);
					}

					const resJson = (await res.json()) as { url?: string; id?: number };

					await client.createOrReplace({
						_id: syndicationDocId,
						_type: "syndication",
						target: { _type: "reference", _ref: data._id },
						platform: "devto",
						status: "published",
						canonicalUrl,
						externalUrl: resJson.url,
						externalId: String(resJson.id ?? ""),
						syndicatedAt: new Date().toISOString(),
						error: undefined,
					});

					// Keep parent document devto field in sync if present
					if (resJson.url && data.devto !== resJson.url) {
						parentPatch.devto = resJson.url;
					}

					console.log(`[Syndicate Content] Successfully published to Dev.to: ${resJson.url}`);
				}

				if (platform === "hashnode") {
					const token =
						process.env.HASHNODE_ACCESS_TOKEN ||
						process.env.PRIVATE_HASHNODE;

					if (!token) {
						console.warn(
							"[Syndicate Content] HASHNODE_ACCESS_TOKEN not configured. Skipping Hashnode live dispatch.",
						);
						await client.createOrReplace({
							_id: syndicationDocId,
							_type: "syndication",
							target: { _type: "reference", _ref: data._id },
							platform: "hashnode",
							status: "failed",
							canonicalUrl,
							error: "HASHNODE_ACCESS_TOKEN environment variable is missing",
						});
						continue;
					}

					const publicationId =
						process.env.HASHNODE_PUBLICATION_ID || "60242f8180da6c44eadf775b";

					const subtitle =
						data.excerpt && data.excerpt.length > 250
							? data.excerpt.substring(0, 247) + "..."
							: data.excerpt || "";

					const mappedHashnodeTags: Array<{ name: string; slug: string }> =
						docTags
							.map((t) => ({
								name: t?.label || t?.value || "",
								slug: (t?.value || t?.label || "")
									.toLowerCase()
									.replace(/[^a-z0-9-]/g, "-"),
							}))
							.filter((t) => t.name && t.slug)
							.slice(0, 4);

					const hashnodeTags: Array<{ name: string; slug: string }> =
						mappedHashnodeTags.length > 0
							? mappedHashnodeTags
							: [
									{ name: "JavaScript", slug: "javascript" },
									{ name: "Web Development", slug: "web-development" },
									{ name: "Beginner Developers", slug: "beginners" },
								];

					if (
						data._type === "podcast" &&
						!hashnodeTags.some((t) => t.slug === "podcast")
					) {
						hashnodeTags.push({
							name: "podcast",
							slug: "podcast",
						});
					}

					const hashnodeCoverImageUrl =
						urlForImage(data.coverImage)?.width(1600).height(840).url() || "";

					const youtubeEmbed = data.youtube
						? `%[${data.youtube.replace("live", "embed")}]\n\n`
						: "";

					const articleInput: any = {
						title: data.title || "Untitled",
						subtitle,
						publicationId,
						slug: `${data._type}-${slug}`,
						tags: hashnodeTags,
						...(hashnodeCoverImageUrl
							? { coverImage: hashnodeCoverImageUrl }
							: {}),
						originalArticleURL: canonicalUrl,
						contentMarkdown: `Original: ${canonicalUrl}\n\n${youtubeEmbed}${contentMarkdown}`,
					};

					if (data._type === "podcast") {
						articleInput.seriesId = "65a9ad4ef60adbf4aeedd0a2";
					}

					// Check existing syndication doc
					const existingSyndication = await client
						.getDocument(syndicationDocId)
						.catch(() => null);

					const existingHashnodeSlug =
						existingSyndication?.externalId || data.hashnode || null;

					let publishedPost: { id: string; slug?: string; url?: string } | null = null;
					const authHeader = token.startsWith("Bearer ") ? token : `Bearer ${token}`;

					if (existingHashnodeSlug && !existingHashnodeSlug.startsWith("simulated-")) {
						// Lookup post ID from Hashnode
						const getPostRes = await fetch("https://gql-beta.hashnode.com", {
							method: "POST",
							headers: {
								"Content-Type": "application/json",
								Authorization: authHeader,
								"x-hashnode-client": "hashnode-cli",
							},
							body: JSON.stringify({
								operationName: "Publication",
								query: `query Publication {
									publication(id: "${publicationId}") {
										post(slug: "${existingHashnodeSlug}") {
											id
										}
									}
								}`,
							}),
						});

						const getPostData = (await getPostRes.json()) as any;
						const postId = getPostData?.data?.publication?.post?.id;

						if (postId) {
							// Update post mutation
							const updateInput = { ...articleInput };
							delete updateInput.slug; // slug cannot be updated

							const updateRes = await fetch("https://gql-beta.hashnode.com", {
								method: "POST",
								headers: {
									"Content-Type": "application/json",
									Authorization: authHeader,
									"x-hashnode-client": "hashnode-cli",
								},
								body: JSON.stringify({
									operationName: "updatePost",
									query: `mutation updatePost($input: UpdatePostInput!) {
										updatePost(input: $input) {
											post {
												id
												title
												slug
												url
											}
										}
									}`,
									variables: {
										input: {
											id: postId,
											...updateInput,
										},
									},
								}),
							});

							const updateData = (await updateRes.json()) as any;
							publishedPost = updateData?.data?.updatePost?.post;
						}
					}

					if (!publishedPost) {
						// Create post mutation
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
								variables: {
									input: articleInput,
								},
							}),
						});

						const publishData = (await publishRes.json()) as any;
						if (publishData?.errors && publishData.errors.length > 0) {
							throw new Error(
								`Hashnode GraphQL errors: ${JSON.stringify(publishData.errors)}`,
							);
						}
						publishedPost = publishData?.data?.publishPost?.post;
					}

					if (!publishedPost) {
						throw new Error("Hashnode publication returned no post data.");
					}

					const externalUrl =
						publishedPost.url || `https://hashnode.codingcat.dev/${publishedPost.slug}`;

					await client.createOrReplace({
						_id: syndicationDocId,
						_type: "syndication",
						target: { _type: "reference", _ref: data._id },
						platform: "hashnode",
						status: "published",
						canonicalUrl,
						externalUrl,
						externalId: publishedPost.slug || publishedPost.id,
						syndicatedAt: new Date().toISOString(),
						error: undefined,
					});

					// Keep parent document hashnode field in sync
					const postSlug = publishedPost.slug || publishedPost.id;
					if (postSlug && data.hashnode !== postSlug) {
						parentPatch.hashnode = postSlug;
					}

					console.log(
						`[Syndicate Content] Successfully published to Hashnode: ${externalUrl}`,
					);
				}

				if (platform === "awsbuilder") {
					const awsSessionToken = process.env.AWS_BUILDER_SESSION_TOKEN;
					if (!awsSessionToken) {
						console.warn(
							"[Syndicate Content] AWS_BUILDER_SESSION_TOKEN not configured. Skipping AWS Builder Center dispatch.",
						);
						continue;
					}

					const awsHeaders = {
						"Content-Type": "application/json",
						Accept: "application/json",
						"builder-session-token": awsSessionToken,
					};

					const existingSyndication = await client
						.getDocument(syndicationDocId)
						.catch(() => null);

					const urlContentIdMatch = data.awsbuilder?.match(
						/builder\.aws\.com\/content\/([A-Za-z0-9]+)/,
					);
					let contentId =
						(existingSyndication?.externalId &&
						!existingSyndication.externalId.startsWith("simulated-")
							? existingSyndication.externalId
							: null) ||
						(urlContentIdMatch ? urlContentIdMatch[1] : null);
					let versionId: string | null = null;

					if (contentId) {
						const editInitRes = await fetch(
							"https://api.builder.aws.com/cs/article/InitializeEditArticle",
							{
								method: "POST",
								headers: awsHeaders,
								body: JSON.stringify({ contentId }),
							},
						);
						if (editInitRes.ok) {
							const editInitJson = (await editInitRes.json()) as any;
							versionId = editInitJson?.versionId || null;
						}
					}

					if (!contentId || !versionId) {
						const initRes = await fetch(
							"https://api.builder.aws.com/cs/article/InitializeArticle",
							{
								method: "POST",
								headers: awsHeaders,
								body: JSON.stringify({}),
							},
						);
						if (!initRes.ok) {
							throw new Error(
								`AWS Builder InitializeArticle failed (${initRes.status}): ${await initRes.text()}`,
							);
						}
						const initJson = (await initRes.json()) as any;
						contentId = initJson?.contentId;
						versionId = initJson?.versionId;
					}

					// Upload cover image if present
					let coverImageUploadKey: string | undefined;
					const coverImageUrl =
						urlForImage(data.coverImage)?.width(1280).format("jpg").url() || "";
					if (coverImageUrl) {
						const imgRes = await fetch(coverImageUrl);
						if (imgRes.ok) {
							const imgBuf = await imgRes.arrayBuffer();
							const presignRes = await fetch(
								"https://api.builder.aws.com/cs/upload/generate-presigned-post",
								{
									method: "POST",
									headers: awsHeaders,
									body: JSON.stringify({
										contentId,
										fileName: `${slug}-cover.jpg`,
										contentType: "image/jpeg",
										uploadType: "ARTICLE",
									}),
								},
							);
							if (presignRes.ok) {
								const presignData = (await presignRes.json()) as any;
								const formData = new FormData();
								for (const [k, v] of Object.entries(
									presignData.presignedPostFields || {},
								)) {
									formData.append(k, String(v));
								}
								formData.append(
									"file",
									new Blob([imgBuf], { type: "image/jpeg" }),
									`${slug}-cover.jpg`,
								);
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
						new Set(
							docTags
								.map((t) => (t?.value || t?.label || "").toLowerCase())
								.filter(Boolean)
								.slice(0, 5),
						),
					);
					if (awsTags.length === 0) awsTags.push("aws");

					const youtubeMd = data.youtube
						? `Watch on YouTube: [${data.youtube}](${data.youtube})\n\n`
						: "";

					const draftPayload: any = {
						contentId,
						versionId,
						title: data.title || "Untitled",
						summary: (data.excerpt || data.title || "").slice(0, 300),
						contentBody: `*Originally published at [${canonicalUrl}](${canonicalUrl})*\n\n${youtubeMd}${contentMarkdown}`,
						canonicalUrl,
						preferredUrlSlug: slug,
						tags: awsTags,
						autoSave: false,
						...(coverImageUploadKey
							? {
									coverImageUploadKey,
									coverImageAlt: data.title || "Cover image",
								}
							: {}),
					};

					const saveRes = await fetch(
						"https://api.builder.aws.com/cs/article/SaveArticleDraft",
						{
							method: "POST",
							headers: awsHeaders,
							body: JSON.stringify(draftPayload),
						},
					);
					if (!saveRes.ok) {
						throw new Error(
							`AWS Builder SaveArticleDraft failed (${saveRes.status}): ${await saveRes.text()}`,
						);
					}

					await fetch("https://api.builder.aws.com/cs/article/SubmissionCheck", {
						method: "POST",
						headers: awsHeaders,
						body: JSON.stringify({ contentId, versionId }),
					});

					const pubRes = await fetch(
						"https://api.builder.aws.com/cs/article/PublishArticle",
						{
							method: "POST",
							headers: awsHeaders,
							body: JSON.stringify({ contentId, versionId }),
						},
					);
					if (!pubRes.ok) {
						throw new Error(
							`AWS Builder PublishArticle failed (${pubRes.status}): ${await pubRes.text()}`,
						);
					}

					const externalUrl = `https://builder.aws.com/content/${contentId}/${slug}`;

					await client.createOrReplace({
						_id: syndicationDocId,
						_type: "syndication",
						target: { _type: "reference", _ref: data._id },
						platform: "awsbuilder",
						status: "published",
						canonicalUrl,
						externalUrl,
						externalId: String(contentId),
						syndicatedAt: new Date().toISOString(),
						error: undefined,
					});

					if (data.awsbuilder !== externalUrl) {
						parentPatch.awsbuilder = externalUrl;
					}

					console.log(
						`[Syndicate Content] Successfully published to AWS Builder Center: ${externalUrl}`,
					);
				}
			} catch (publishErr) {
				const errMsg =
					publishErr instanceof Error ? publishErr.message : String(publishErr);
				console.error(`[Syndicate Content] Error publishing to ${platform}:`, errMsg);

				await client.createOrReplace({
					_id: syndicationDocId,
					_type: "syndication",
					target: { _type: "reference", _ref: data._id },
					platform,
					status: "failed",
					canonicalUrl,
					error: errMsg,
				});
			}
		}

		// Update parent document's `syndications` reference array and platform URLs in a single idempotent patch
		try {
			const latestDoc = await client
				.getDocument<ContentDocument>(data._id)
				.catch(() => undefined);
			const currentSyndications = Array.isArray(latestDoc?.syndications)
				? latestDoc.syndications
				: Array.isArray(data.syndications)
					? data.syndications
					: [];

			const expectedRefs = platforms.map((p) => `syndication.${data._id}.${p}`);
			const byRef = new Map<
				string,
				{ _key: string; _type: "reference"; _ref: string }
			>();
			const usedKeys = new Set<string>();

			for (const item of currentSyndications) {
				if (item && typeof item._ref === "string" && !byRef.has(item._ref)) {
					const deterministicKey = `syn_${item._ref.replace(/[^a-zA-Z0-9]/g, "_")}`;
					const key =
						item._key && !usedKeys.has(item._key)
							? item._key
							: deterministicKey;
					usedKeys.add(key);
					byRef.set(item._ref, {
						_key: key,
						_type: "reference",
						_ref: item._ref,
					});
				}
			}

			for (const ref of expectedRefs) {
				if (!byRef.has(ref)) {
					const key = `syn_${ref.replace(/[^a-zA-Z0-9]/g, "_")}`;
					usedKeys.add(key);
					byRef.set(ref, {
						_key: key,
						_type: "reference",
						_ref: ref,
					});
				}
			}

			const deduplicatedSyndications = Array.from(byRef.values());
			const needsSyndicationUpdate =
				currentSyndications.length !== deduplicatedSyndications.length ||
				currentSyndications.some(
					(s, idx) =>
						s._ref !== deduplicatedSyndications[idx]?._ref ||
						s._key !== deduplicatedSyndications[idx]?._key ||
						Boolean((s as Record<string, unknown>)._weak),
				);

			if (needsSyndicationUpdate) {
				parentPatch.syndications = deduplicatedSyndications;
			}

			if (Object.keys(parentPatch).length > 0) {
				await client.patch(data._id).set(parentPatch).commit();
				console.log(
					`[Syndicate Content] Updated parent ${data._id} (${Object.keys(parentPatch).join(", ")}).`,
				);
			}
		} catch (linkErr) {
			console.warn(
				`[Syndicate Content] Failed to link syndication references to parent ${data._id}:`,
				linkErr,
			);
		}
	},
);
