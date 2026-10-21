import { scheduledEventHandler } from "@sanity/functions";

export const handler = scheduledEventHandler(async ({ context }) => {
	console.log("[Sync Nightly Dataset] Starting scheduled dataset sync...");

	const projectId =
		context.clientOptions?.projectId ||
		process.env.SANITY_STUDIO_PROJECT_ID ||
		"hfh83o0w";
	const token =
		context.clientOptions?.token || process.env.SANITY_AUTH_TOKEN;

	if (!token) {
		throw new Error(
			"[Sync Nightly Dataset] Missing Sanity API token (neither context.clientOptions.token nor SANITY_AUTH_TOKEN is present).",
		);
	}

	const apiHost =
		context.clientOptions?.apiHost || "https://api.sanity.io";
	const apiVersion = "v2025-09-30";

	const targetDataset = "dev";
	const sourceDataset = "production";

	if (
		process.env.SANITY_STUDIO_DATASET &&
		process.env.SANITY_STUDIO_DATASET !== "production"
	) {
		console.log(
			`[Sync Nightly Dataset] Stack is "${process.env.SANITY_STUDIO_DATASET}". Nightly dataset sync only executes on production. Skipping.`,
		);
		return;
	}

	console.log(
		`[Sync Nightly Dataset] Resetting dataset "${targetDataset}" from source "${sourceDataset}" for project ${projectId}...`,
	);

	// Ensure target dataset exists or try Enterprise Copy API without pre-deleting `dev`,
	// because non-Enterprise plans fail on `/copy` and pre-deleting `dev` leaves the dev site with no dataset.
	const copyUrl = `${apiHost}/${apiVersion}/projects/${projectId}/datasets/${sourceDataset}/copy`;
	console.log(
		`[Sync Nightly Dataset] Attempting dataset copy "${sourceDataset}" -> "${targetDataset}": ${copyUrl}`,
	);

	const copyResp = await fetch(copyUrl, {
		method: "PUT",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			targetDataset,
			skipHistory: true,
		}),
	});

	if (!copyResp.ok) {
		const errorText = await copyResp.text();
		if (
			copyResp.status === 400 &&
			errorText.includes("advanced dataset management")
		) {
			console.warn(
				`[Sync Nightly Dataset] Plan does not include Enterprise dataset copy API. Skipping destructive delete; dataset sync is handled by GitHub Actions CLI export/import.`,
			);
			return;
		}
		throw new Error(
			`[Sync Nightly Dataset] Failed to initiate dataset copy from "${sourceDataset}" to "${targetDataset}": HTTP ${copyResp.status} — ${errorText}`,
		);
	}

	const copyResult = await copyResp.json().catch(() => ({}));
	console.log(
		`[Sync Nightly Dataset] Successfully initiated dataset copy from "${sourceDataset}" to "${targetDataset}":`,
		copyResult,
	);
});
