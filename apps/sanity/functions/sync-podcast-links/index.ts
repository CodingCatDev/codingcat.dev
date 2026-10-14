import { documentEventHandler } from "@sanity/functions";
import { createClient } from "@sanity/client";
import {
	fetchProviderCatalog,
	resolvePodcastLinks,
	type SanityPodcastDoc,
} from "../lib/podcast-providers";

export const handler = documentEventHandler<SanityPodcastDoc>(
	async ({ context, event }) => {
		const rawData = event.data;
		if (!rawData?._id || rawData._type !== "podcast") {
			return;
		}

		if (rawData._id.startsWith("drafts.")) {
			return;
		}

		const token =
			context.clientOptions?.token ||
			process.env.SANITY_API_WRITE_TOKEN ||
			process.env.SANITY_AUTH_TOKEN;

		if (!token) {
			console.error(
				"[Sync Podcast Links] Missing Sanity write token. Cannot patch podcast document.",
			);
			return;
		}

		const client = createClient({
			...context.clientOptions,
			projectId:
				context.clientOptions?.projectId ||
				process.env.SANITY_STUDIO_PROJECT_ID ||
				"hfh83o0w",
			dataset:
				context.clientOptions?.dataset ||
				process.env.SANITY_STUDIO_DATASET ||
				"production",
			token,
			apiVersion: "2025-09-30",
			useCdn: false,
		});

		const fetchedDoc = await client
			.getDocument<SanityPodcastDoc>(rawData._id)
			.catch(() => undefined);
		const doc: SanityPodcastDoc = fetchedDoc || rawData;
		if (!doc?._id) return;

		// Quick check: if spotify and all core provider links are already populated, skip outbound fetches
		const links = doc.listenLinks;
		const hasAllCoreProviders = Boolean(
			doc.spotify?.guid?.id &&
				links?.spotify &&
				links?.apple &&
				links?.pocketCasts &&
				links?.castbox &&
				links?.castro &&
				links?.overcast &&
				links?.rss &&
				(!doc.youtube || links?.youtube === doc.youtube),
		);

		if (hasAllCoreProviders) {
			console.log(
				`[Sync Podcast Links] Document ${doc._id} already has spotify and all listenLinks populated. Skipping.`,
			);
			return;
		}

		console.log(
			`[Sync Podcast Links] Resolving podcast provider links for ${doc._id} (${doc.title || "Untitled"})...`,
		);

		const catalog = await fetchProviderCatalog();
		const { spotifyRecord, listenLinks, changed } = resolvePodcastLinks(
			doc,
			catalog,
		);

		if (!changed) {
			console.log(
				`[Sync Podcast Links] No new provider links found for ${doc._id}.`,
			);
			return;
		}

		const patchPayload: Record<string, unknown> = {
			listenLinks,
		};
		if (spotifyRecord) {
			patchPayload.spotify = spotifyRecord;
		}

		await client.patch(doc._id).set(patchPayload).commit();
		console.log(
			`[Sync Podcast Links] Updated ${doc._id} with provider links:`,
			Object.keys(listenLinks),
		);
	},
);
