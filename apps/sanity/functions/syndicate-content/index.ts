import { documentEventHandler } from "@sanity/functions";
import { createClient } from "@sanity/client";

interface ContentDocument {
	_id: string;
	_type: "post" | "podcast";
	title?: string;
	slug?: { current?: string };
	excerpt?: string;
	youtube?: string;
	coverImage?: any;
	content?: any[];
	season?: number;
}

export const handler = documentEventHandler<ContentDocument>(
	async ({ context, event }) => {
		const { data } = event;
		if (!data?._id || !data?._type) {
			console.log("No valid document data in event, skipping syndication.");
			return;
		}

		const dataset = context.clientOptions?.dataset || "dev";
		const isProduction = dataset === "production";
		const slug = data.slug?.current || data._id;
		const canonicalUrl = isProduction
			? `https://codingcat.dev/${data._type}/${slug}`
			: `https://dev.codingcat.dev/${data._type}/${slug}`;

		const client = createClient({
			...context.clientOptions,
			apiVersion: "2025-09-30",
		});

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

					const devtoPayload = {
						article: {
							title: data.title || "Untitled",
							published: true,
							tags: ["webdev", "javascript", "beginners"],
							canonical_url: canonicalUrl,
							description: data.excerpt || "",
							organization_id: "1009",
							body_markdown: `Original: ${canonicalUrl}\n\n${data.excerpt || ""}`,
						},
					};

					const res = await fetch("https://dev.to/api/articles", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							"api-key": apiKey,
						},
						body: JSON.stringify(devtoPayload),
					});

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
					});
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

					const query = `
						mutation PublishPost($input: PublishPostInput!) {
							publishPost(input: $input) {
								post {
									id
									url
								}
							}
						}
					`;

					const res = await fetch("https://gql.hashnode.com", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							Authorization: token,
						},
						body: JSON.stringify({
							query,
							variables: {
								input: {
									title: data.title || "Untitled",
									publicationId,
									contentMarkdown: `Original: ${canonicalUrl}\n\n${data.excerpt || ""}`,
									originalArticleURL: canonicalUrl,
									tags: [
										{ id: "56744721958ef13879b94cad", name: "JavaScript", slug: "javascript" },
										{ id: "56744722958ef13879b94f1b", name: "Web Development", slug: "web-development" },
									],
								},
							},
						}),
					});

					const gqlData = (await res.json()) as any;
					const publishedPost = gqlData?.data?.publishPost?.post;

					if (!publishedPost) {
						throw new Error(
							`Hashnode publication failed: ${JSON.stringify(gqlData?.errors || "No post returned")}`,
						);
					}

					await client.createOrReplace({
						_id: syndicationDocId,
						_type: "syndication",
						target: { _type: "reference", _ref: data._id },
						platform: "hashnode",
						status: "published",
						canonicalUrl,
						externalUrl: publishedPost.url,
						externalId: publishedPost.id,
						syndicatedAt: new Date().toISOString(),
					});
					console.log(`[Syndicate Content] Successfully published to Hashnode: ${publishedPost.url}`);
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
	},
);
