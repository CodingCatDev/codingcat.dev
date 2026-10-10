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
		const platforms: Array<"devto" | "hashnode"> = ["devto", "hashnode"];

		console.log(
			`[Syndicate Content] Processing ${data._type} (${data._id}) on dataset: ${dataset}. Production mode: ${isProduction}`,
		);

		for (const platform of platforms) {
			const syndicationDocId = `syndication.${data._id}.${platform}`;

			if (!isProduction) {
				// Non-production (dev / preview): simulate and mark complete without outbound API calls
				console.log(
					`[Syndicate Content] Simulating syndication for ${platform} on ${data._id}`,
				);

				try {
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
						externalUrl: `https://${platform === "devto" ? "dev.to" : "hashnode.com"}/preview-simulated/${slug}`,
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

					const devtoTags = ["webdev", "javascript", "beginners"];
					if (data._type === "podcast") {
						devtoTags.push("podcast");
					}

					const mainImageUrl =
						urlForImage(data.coverImage)?.width(1000).height(420).url() || "";

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
							res = await fetch(`https://dev.to/api/articles/${articleData.id}`, {
								method: "PUT",
								headers: {
									"api-key": apiKey,
									"Content-Type": "application/json",
								},
								body: JSON.stringify(devtoArticlePayload),
							});
						} else {
							// If lookup failed, create as new article
							res = await fetch("https://dev.to/api/articles", {
								method: "POST",
								headers: {
									"api-key": apiKey,
									"Content-Type": "application/json",
								},
								body: JSON.stringify(devtoArticlePayload),
							});
						}
					} else {
						// Create new article
						res = await fetch("https://dev.to/api/articles", {
							method: "POST",
							headers: {
								"api-key": apiKey,
								"Content-Type": "application/json",
							},
							body: JSON.stringify(devtoArticlePayload),
						});
					}

					if (!res.ok) {
						const errText = await res.text();
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
						await client.patch(data._id).set({ devto: resJson.url }).commit();
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

					const hashnodeTags: Array<{ name: string; slug: string }> = [
						{ name: "JavaScript", slug: "javascript" },
						{ name: "Web Development", slug: "web-development" },
						{ name: "Beginner Developers", slug: "beginners" },
					];

					if (data._type === "podcast") {
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
						...(hashnodeCoverImageUrl ? { coverImage: hashnodeCoverImageUrl } : {}),
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

					if (existingHashnodeSlug && !existingHashnodeSlug.startsWith("simulated-")) {
						// Lookup post ID from Hashnode
						const getPostRes = await fetch("https://gql-beta.hashnode.com", {
							method: "POST",
							headers: {
								"Content-Type": "application/json",
								Authorization: token,
							},
							body: JSON.stringify({
								operationName: "Publication",
								query: `query Publication {
									publication(host: "hashnode.codingcat.dev") {
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
									Authorization: token,
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
								Authorization: token,
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
						await client.patch(data._id).set({ hashnode: postSlug }).commit();
					}

					console.log(
						`[Syndicate Content] Successfully published to Hashnode: ${externalUrl}`,
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

		// Update parent document's `syndications` reference array to maintain strong bidirectional links
		try {
			const expectedRefs = platforms.map((p) => `syndication.${data._id}.${p}`);
			const existingRefs = (data.syndications || []).map((s) => s._ref);

			const newRefs = expectedRefs.filter((ref) => !existingRefs.includes(ref));
			if (newRefs.length > 0) {
				const referencesToAppend = newRefs.map((ref) => ({
					_key: `syn_${ref.replace(/[^a-zA-Z0-9]/g, "_")}`,
					_type: "reference" as const,
					_ref: ref,
				}));

				await client
					.patch(data._id)
					.setIfMissing({ syndications: [] })
					.append("syndications", referencesToAppend)
					.commit();

				console.log(
					`[Syndicate Content] Linked ${newRefs.length} syndication references to parent ${data._id}.`,
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
