import { scheduledEventHandler } from "@sanity/functions";
import { createClient } from "@sanity/client";
import {
	fetchProviderCatalog,
	resolvePodcastLinks,
	type SanityPodcastDoc,
} from "../lib/podcast-providers";

export const handler = scheduledEventHandler(async ({ context }) => {
	const token =
		process.env.SANITY_API_WRITE_TOKEN ||
		process.env.SANITY_AUTH_TOKEN ||
		context.clientOptions?.token;

	if (!token) {
		console.error(
			"[Sync Missing Podcast Links] Missing Sanity write token. Aborting scheduled sync.",
		);
		return;
	}

	const dataset =
		process.env.SANITY_STUDIO_DATASET ||
		context.clientOptions?.dataset ||
		"production";

	const projectId =
		context.clientOptions?.projectId ||
		process.env.SANITY_STUDIO_PROJECT_ID ||
		"hfh83o0w";

	const client = createClient({
		projectId,
		dataset,
		token,
		apiVersion: "2025-09-30",
		useCdn: false,
	});

	const batchSize = parseInt(process.env.SYNC_BATCH_SIZE || "250", 10);

	console.log(
		`[Sync Missing Podcast Links] Checking podcasts with missing provider links in ${projectId}/${dataset} (limit: ${batchSize})...`,
	);

	const docs = await client.fetch<SanityPodcastDoc[]>(
		`*[_type == "podcast" && !(_id in path("drafts.**")) && (
			!defined(spotify) ||
			!defined(listenLinks.spotify) ||
			!defined(listenLinks.apple) ||
			!defined(listenLinks.pocketCasts) ||
			!defined(listenLinks.castbox) ||
			!defined(listenLinks.castro) ||
			!defined(listenLinks.overcast) ||
			!defined(listenLinks.rss)
		)] | order(date desc)[0...$batchSize]{
			_id,
			_type,
			title,
			slug,
			season,
			episode,
			youtube,
			spotify,
			listenLinks
		}`,
		{ batchSize },
	);

	if (!docs.length) {
		console.log(
			"[Sync Missing Podcast Links] All podcast documents have complete provider links.",
		);
		return;
	}

	console.log(
		`[Sync Missing Podcast Links] Found ${docs.length} podcasts needing provider link resolution. Fetching catalogs...`,
	);

	const catalog = await fetchProviderCatalog();
	let updatedCount = 0;

	for (const doc of docs) {
		try {
			const { spotifyRecord, listenLinks, changed } = resolvePodcastLinks(
				doc,
				catalog,
			);
			if (!changed) continue;

			const patchPayload: Record<string, unknown> = {
				listenLinks,
			};
			if (spotifyRecord) {
				patchPayload.spotify = spotifyRecord;
			}

			await client.patch(doc._id).set(patchPayload).commit();
			updatedCount++;
			console.log(
				`[Sync Missing Podcast Links] Patched ${doc._id} (${doc.title || "Untitled"})`,
			);
		} catch (err) {
			console.error(
				`[Sync Missing Podcast Links] Failed to patch ${doc._id}:`,
				err,
			);
		}
	}

	console.log(
		`[Sync Missing Podcast Links] Completed run. Updated ${updatedCount}/${docs.length} podcast documents.`,
	);
});
