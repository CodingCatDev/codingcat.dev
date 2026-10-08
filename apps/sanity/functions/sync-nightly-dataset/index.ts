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

	// 1. Delete existing target dataset (dev) if it exists
	const deleteUrl = `${apiHost}/${apiVersion}/projects/${projectId}/datasets/${targetDataset}`;
	console.log(`[Sync Nightly Dataset] Deleting existing dataset "${targetDataset}": ${deleteUrl}`);

	const deleteResp = await fetch(deleteUrl, {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	if (deleteResp.ok) {
		console.log(
			`[Sync Nightly Dataset] Target dataset "${targetDataset}" deleted successfully (HTTP ${deleteResp.status}).`,
		);
	} else if (deleteResp.status === 404) {
		console.log(
			`[Sync Nightly Dataset] Target dataset "${targetDataset}" does not exist yet (HTTP 404). Proceeding to clone.`,
		);
	} else {
		const deleteError = await deleteResp.text();
		console.warn(
			`[Sync Nightly Dataset] Notice when deleting dataset "${targetDataset}": HTTP ${deleteResp.status} — ${deleteError}`,
		);
	}

	// 2. Clone source dataset (production) to target (dev) via Sanity Enterprise Copy API
	const copyUrl = `${apiHost}/${apiVersion}/projects/${projectId}/datasets/${sourceDataset}/copy`;
	console.log(
		`[Sync Nightly Dataset] Copying "${sourceDataset}" -> "${targetDataset}": ${copyUrl}`,
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
