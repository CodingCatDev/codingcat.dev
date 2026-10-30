import { createClient } from "@sanity/client";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || "hfh83o0w";
const dataset = process.env.SANITY_STUDIO_DATASET || "production";
const token =
	process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_AUTH_TOKEN;

if (!token) {
	console.warn(
		"[migrate-private-ids] No SANITY_API_WRITE_TOKEN or SANITY_AUTH_TOKEN provided; skipping migration.",
	);
	process.exit(0);
}

const client = createClient({
	projectId,
	dataset,
	apiVersion: "2025-02-19",
	token,
	useCdn: false,
	perspective: "raw",
});

async function run() {
	const publicDocs = await client.fetch(
		`*[_type in ["booking", "sponsorLead", "sponsorPool"] && !(_id in path("private.**")) && !(_id in path("drafts.**"))]`,
	);

	console.log(
		`[migrate-private-ids] Found ${publicDocs.length} unprefixed CRM/booking documents in ${dataset}.`,
	);

	let migrated = 0;
	let deleted = 0;

	for (const doc of publicDocs) {
		const oldId = String(doc._id || "");
		if (!oldId || oldId.startsWith("private.")) continue;
		const newId = `private.${oldId}`;
		const { _rev, ...rest } = doc;

		await client.createOrReplace({
			...rest,
			_id: newId,
		});
		migrated++;

		try {
			await client.delete(`drafts.${oldId}`);
		} catch {
			// Ignore if no draft exists
		}

		try {
			await client.delete(oldId);
			deleted++;
		} catch (err) {
			console.warn(
				`[migrate-private-ids] Could not delete ${oldId}:`,
				err?.message || err,
			);
		}
	}

	console.log(
		`[migrate-private-ids] Completed on ${dataset}: migrated=${migrated}, deleted=${deleted}.`,
	);
}

run().catch((err) => {
	console.error("[migrate-private-ids] Fatal error:", err);
	process.exit(1);
});
