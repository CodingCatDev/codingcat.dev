import crypto from "node:crypto";
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

function isPredictableToken(tok) {
	if (!tok || typeof tok !== "string") return true;
	// Tokens ending in an 8+ hex random segment (e.g. spt_22fb8e0997bb4c4c or bref_marielogerard_9f4c8a2e71b3) are high-entropy
	return !/[0-9a-f]{8,}$/i.test(tok);
}

async function run() {
	// 1. Migrate any unprefixed top-level CRM/booking docs to private.*
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

	// 2. Harden portalTokens on all private.booking-* and private.sponsorLead-* documents
	// so predictable human slugs are stored in legacyPortalToken (protected by the email gate)
	// and primary portalToken has a cryptographic random suffix.
	const allPrivateDocs = await client.fetch(
		`*[_type in ["booking", "sponsorLead"] && _id in path("private.**")]`,
	);

	let hardenedCount = 0;
	for (const doc of allPrivateDocs) {
		const patch = {};
		const currentToken = doc.portalToken;
		if (!currentToken) {
			const slugBase = String(doc.company || doc.companyName || doc.guestName || "guest")
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, "")
				.slice(0, 12);
			const rand = crypto.randomBytes(6).toString("hex");
			patch.portalToken = `spt_${slugBase}_${rand}`;
		} else if (isPredictableToken(currentToken)) {
			const base = doc.legacyPortalToken || currentToken;
			const rand = crypto
				.createHash("sha256")
				.update(`${doc._id}:${base}:codingcat-2026`)
				.digest("hex")
				.slice(0, 12);
			patch.legacyPortalToken = base;
			patch.portalToken = `${base}_${rand}`;
		}

		// Seed Marie Lo Gerard's 2-Way Run-of-Show & Pre-Call Notes if not yet set
		if (
			doc._id === "private.booking-edaa31db78dc4c21" &&
			!doc.runOfShowNotes
		) {
			patch.preCallNotes = [
				"Pre-Call Completed: Aligned on Lastware & bref-ui architecture walkthrough.",
				"- Format: 45-minute technical conversation + live screen-share demo in StreamYard.",
				"- Key Focus: Why AI-generated frontends drift without deterministic UI primitives, and how bref-ui packages solve it.",
				"- Target Audience: Full-stack TypeScript, React, and Astro builders shipping AI-assisted apps.",
			].join("\n");
			patch.runOfShowNotes = [
				"00:00 - 05:00 · Cold Open & Origin Story: Marie Lo Gerard's background and the genesis of Lastware (open-source packages for AI-built software).",
				"05:00 - 15:00 · The Core Problem: What breaks when LLMs and coding agents generate UI components from scratch vs. consuming structured primitives.",
				"15:00 - 30:00 · Live Architecture & Code Walkthrough (Screen Share): Exploring bref-ui under the hood, token ergonomics, and agent-friendly component contracts.",
				"30:00 - 40:00 · Production Trade-Offs & Gotchas: Maintaining open-source packages for AI-first workflows and what is next on the Lastware roadmap.",
				"40:00 - 45:00 · Purrfect Picks & Wrap-Up: Where developers can star bref-ui, contribute, and follow Marie.",
			].join("\n");
			patch.guestQuestions = [
				"- GitHub / Package Repo link for show notes",
				"- Documentation / Live Demo URL to display on screen",
				"- 1 or 2 'Purrfect Picks' (favorite dev tool, book, show, or project) for the end of the episode",
			].join("\n");
			patch.runOfShowUpdatedAt = new Date().toISOString();
			patch.runOfShowUpdatedBy = "Alex Patterson (CodingCat.dev Studio)";
		}

		if (Object.keys(patch).length > 0) {
			await client.patch(doc._id).set(patch).commit();
			hardenedCount++;
		}
	}

	console.log(
		`[migrate-private-ids] Completed on ${dataset}: migrated=${migrated}, deleted=${deleted}, hardenedTokens=${hardenedCount}.`,
	);
}

run().catch((err) => {
	console.error("[migrate-private-ids] Fatal error:", err);
	process.exit(1);
});
