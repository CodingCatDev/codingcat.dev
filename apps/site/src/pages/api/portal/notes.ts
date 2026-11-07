import { env } from "cloudflare:workers";
import type { APIRoute } from "astro";
import {
	buildCanonicalPodcastBookingSubject,
	buildPodcastPortalEmailCard,
	sendCodingCatEmailDetailed,
} from "@/lib/email";
import {
	extractPortalAllowedEmails,
	verifyPortalRequestAuth,
} from "@/lib/portal-security";
import { uploadAndLinkMediaLibraryAsset } from "@/lib/sanity/media-library";
import { getSanityServerClient } from "@/lib/sanity/write-client";
import { ensureSanityMediaTags } from "./assets";

const CORS_HEADERS = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
	"Access-Control-Allow-Headers":
		"Content-Type, Authorization, X-Portal-Key, X-Portal-Email, X-Ops-App",
	"Content-Type": "application/json",
};

export const OPTIONS: APIRoute = async () => {
	return new Response(null, { status: 204, headers: CORS_HEADERS });
};

export interface CollaborationAttachment {
	_key: string;
	title: string;
	category?: string;
	assetId?: string;
	mimeType?: string;
	fileSize?: number;
	externalUrl: string;
}

export interface CollaborationThreadItem {
	_key: string;
	authorName: string;
	authorRole: "host" | "guest";
	authorEmail?: string;
	noteType: "call_note" | "comment" | "ros_update" | "file_drop" | "feedback";
	message: string;
	createdAt: string;
	emailedToCounterpart?: boolean;
	attachments?: CollaborationAttachment[];
	feedbackRating?: number;
	feedbackTopics?: string[];
	feedbackMeta?: Record<string, any>;
}

/**
 * GET /api/portal/notes?token=...&docId=...
 * Fetches the latest 2-Way Run-of-Show fields, Collaboration Thread (comments/call notes),
 * and Shared Vault Assets for live polling without a full page reload.
 */
export const GET: APIRoute = async ({ request, url }) => {
	const token = (url.searchParams.get("token") || "").trim();
	const docId = (url.searchParams.get("docId") || "").trim();
	const isOpsApp =
		url.searchParams.get("ops") === "1" ||
		request.headers.get("x-ops-app") === "1";

	if (!token && !docId) {
		return new Response(
			JSON.stringify({ ok: false, message: "token or docId is required" }),
			{ status: 400, headers: CORS_HEADERS },
		);
	}

	const { client } = getSanityServerClient();
	const targetDocs = await client.fetch<Array<Record<string, any>>>(
		`*[_type in ["booking", "sponsorLead"] && (
			($token != "" && (portalToken == $token || legacyPortalToken == $token)) ||
			($docId != "" && (_id == $docId || _id == "private." + $docId)) ||
			($token != "" && (_id == "private.sponsorLead-" + $token || _id == "private.booking-" + $token))
		)]{
			_id,
			_type,
			portalToken,
			legacyPortalToken,
			guestName,
			guestEmail,
			contactName,
			contactEmail,
			company,
			companyName,
			coordinatorEmail,
			coordinatorEmails,
			allowedEmails,
			guests,
			preCallNotes,
			runOfShowNotes,
			guestQuestions,
			runOfShowUpdatedAt,
			runOfShowUpdatedBy,
			collaborationThread,
			sharedAssets
		}`,
		{ token, docId } as Record<string, any>,
	);

	if (!targetDocs || targetDocs.length === 0) {
		return new Response(
			JSON.stringify({ ok: false, message: "Document not found" }),
			{ status: 404, headers: CORS_HEADERS },
		);
	}

	const primaryDoc =
		targetDocs.find((d) => d._type === "booking") || targetDocs[0];
	const canonicalToken = primaryDoc?.portalToken || token;

	if (!isOpsApp) {
		const allowedEmails = extractPortalAllowedEmails(...targetDocs);
		const auth = await verifyPortalRequestAuth({
			request,
			url,
			token: canonicalToken,
			allowedEmails,
		});
		if (!auth.authorized) {
			return new Response(
				JSON.stringify({
					ok: false,
					message: "Unauthorized: Sign in to view portal notes.",
				}),
				{ status: 403, headers: CORS_HEADERS },
			);
		}
	}

	const mergedThread: CollaborationThreadItem[] = [];
	const seenKeys = new Set<string>();
	for (const d of targetDocs) {
		for (const item of Array.isArray(d.collaborationThread)
			? d.collaborationThread
			: []) {
			const k = item._key || `${item.createdAt}-${item.authorName}`;
			if (!seenKeys.has(k)) {
				seenKeys.add(k);
				mergedThread.push(item);
			}
		}
	}
	mergedThread.sort(
		(a, b) =>
			new Date(a.createdAt || 0).getTime() -
			new Date(b.createdAt || 0).getTime(),
	);

	return new Response(
		JSON.stringify({
			ok: true,
			preCallNotes: primaryDoc?.preCallNotes || "",
			runOfShowNotes: primaryDoc?.runOfShowNotes || "",
			guestQuestions: primaryDoc?.guestQuestions || "",
			runOfShowUpdatedAt: primaryDoc?.runOfShowUpdatedAt,
			runOfShowUpdatedBy: primaryDoc?.runOfShowUpdatedBy,
			collaborationThread: mergedThread,
			sharedAssets: primaryDoc?.sharedAssets || [],
		}),
		{ status: 200, headers: CORS_HEADERS },
	);
};

/**
 * POST /api/portal/notes
 * 2-Way co-editable Run-of-Show, Pre-Call Notes, Guest Questions, AND
 * Notion/Slack-style Call Notes & Comment Thread with drag-and-drop file attachments
 * and 2-way canonical Gmail thread notifications.
 */
export const POST: APIRoute = async ({ request, url }) => {
	const contentType = request.headers.get("content-type") || "";
	let token = "";
	let docId = "";
	let preCallNotes: string | undefined;
	let runOfShowNotes: string | undefined;
	let guestQuestions: string | undefined;
	let topics: string | undefined;
	let updatedBy = "";
	let authorRole: "host" | "guest" = "guest";
	let authorEmail = "";
	let noteType:
		| "call_note"
		| "comment"
		| "ros_update"
		| "file_drop"
		| "feedback" = "comment";
	let chatMessage = "";
	let externalUrl = "";
	let attachmentTitle = "";
	let attachmentCategory = "brief";
	let notifyCounterpart = true;
	let feedbackRating: number | undefined;
	let feedbackTopics: string[] = [];
	let feedbackMeta: Record<string, any> | undefined;
	let isOpsApp = request.headers.get("x-ops-app") === "1";
	const uploadedFiles: File[] = [];

	if (contentType.includes("multipart/form-data")) {
		try {
			const form = await request.formData();
			token = String(form.get("token") || "").trim();
			docId = String(form.get("docId") || "").trim();
			if (form.has("preCallNotes")) {
				preCallNotes = String(form.get("preCallNotes") || "");
			}
			if (form.has("runOfShowNotes")) {
				runOfShowNotes = String(form.get("runOfShowNotes") || "");
			}
			if (form.has("guestQuestions")) {
				guestQuestions = String(form.get("guestQuestions") || "");
			}
			if (form.has("topics")) {
				topics = String(form.get("topics") || "");
			}
			updatedBy = String(form.get("updatedBy") || "").trim();
			const rawRole = String(form.get("authorRole") || "").trim();
			if (rawRole === "host" || rawRole === "guest") {
				authorRole = rawRole;
			}
			authorEmail = String(form.get("authorEmail") || "").trim();
			const rawNoteType = String(form.get("noteType") || "").trim();
			if (
				rawNoteType === "call_note" ||
				rawNoteType === "comment" ||
				rawNoteType === "ros_update" ||
				rawNoteType === "file_drop" ||
				rawNoteType === "feedback"
			) {
				noteType = rawNoteType;
			}
			if (form.has("feedbackRating")) {
				const parsedRating = Number(form.get("feedbackRating"));
				if (parsedRating >= 1 && parsedRating <= 5) {
					feedbackRating = parsedRating;
				}
			}
			if (form.has("feedbackTopics")) {
				const rawTopics = String(form.get("feedbackTopics") || "").trim();
				if (rawTopics) {
					try {
						const parsed = JSON.parse(rawTopics);
						if (Array.isArray(parsed)) {
							feedbackTopics = parsed
								.map((t) => String(t).trim())
								.filter(Boolean);
						}
					} catch {
						feedbackTopics = rawTopics
							.split(",")
							.map((t) => t.trim())
							.filter(Boolean);
					}
				}
			}
			if (form.has("feedbackMeta")) {
				const rawMeta = String(form.get("feedbackMeta") || "").trim();
				if (rawMeta) {
					try {
						feedbackMeta = JSON.parse(rawMeta);
					} catch {
						// Ignore malformed JSON metadata
					}
				}
			}
			chatMessage = String(form.get("message") || "").trim();
			externalUrl = String(form.get("externalUrl") || "").trim();
			attachmentTitle = String(form.get("attachmentTitle") || "").trim();
			attachmentCategory = String(
				form.get("attachmentCategory") || "brief",
			).trim();
			if (form.has("notifyCounterpart")) {
				const rawNotify = String(form.get("notifyCounterpart"));
				notifyCounterpart = rawNotify !== "false" && rawNotify !== "0";
			}
			if (form.get("ops") === "1" || authorRole === "host") {
				isOpsApp = true;
			}
			const allFiles = form.getAll("files");
			const singleFile = form.get("file");
			for (const f of [...allFiles, ...(singleFile ? [singleFile] : [])]) {
				if (f instanceof File && f.size > 0) {
					uploadedFiles.push(f);
				}
			}
		} catch {
			return new Response(
				JSON.stringify({ ok: false, message: "Invalid multipart form data" }),
				{ status: 400, headers: CORS_HEADERS },
			);
		}
	} else {
		try {
			const body = (await request.json()) as Record<string, any>;
			token = String(body.token || "").trim();
			docId = String(body.docId || "").trim();
			if (typeof body.preCallNotes === "string") {
				preCallNotes = body.preCallNotes;
			}
			if (typeof body.runOfShowNotes === "string") {
				runOfShowNotes = body.runOfShowNotes;
			}
			if (typeof body.guestQuestions === "string") {
				guestQuestions = body.guestQuestions;
			}
			if (typeof body.topics === "string") {
				topics = body.topics;
			}
			updatedBy = String(body.updatedBy || "").trim();
			if (body.authorRole === "host" || body.authorRole === "guest") {
				authorRole = body.authorRole;
			}
			authorEmail = String(body.authorEmail || "").trim();
			if (
				body.noteType === "call_note" ||
				body.noteType === "comment" ||
				body.noteType === "ros_update" ||
				body.noteType === "file_drop" ||
				body.noteType === "feedback"
			) {
				noteType = body.noteType;
			}
			if (
				typeof body.feedbackRating === "number" &&
				body.feedbackRating >= 1 &&
				body.feedbackRating <= 5
			) {
				feedbackRating = body.feedbackRating;
			}
			if (Array.isArray(body.feedbackTopics)) {
				feedbackTopics = body.feedbackTopics
					.map((t: unknown) => String(t).trim())
					.filter(Boolean);
			}
			if (body.feedbackMeta && typeof body.feedbackMeta === "object") {
				feedbackMeta = body.feedbackMeta;
			}
			chatMessage = String(body.message || "").trim();
			externalUrl = String(body.externalUrl || "").trim();
			attachmentTitle = String(body.attachmentTitle || "").trim();
			attachmentCategory = String(body.attachmentCategory || "brief").trim();
			if (typeof body.notifyCounterpart === "boolean") {
				notifyCounterpart = body.notifyCounterpart;
			}
			if (body.ops === true || body.authorRole === "host") {
				isOpsApp = true;
			}
		} catch {
			return new Response(
				JSON.stringify({ ok: false, message: "Invalid JSON payload" }),
				{ status: 400, headers: CORS_HEADERS },
			);
		}
	}

	if (!token && !docId) {
		return new Response(
			JSON.stringify({
				ok: false,
				message: "token or docId is required to save Run-of-Show or call notes",
			}),
			{ status: 400, headers: CORS_HEADERS },
		);
	}

	const { client, canWrite } = getSanityServerClient();
	if (!canWrite) {
		return new Response(
			JSON.stringify({
				ok: false,
				message: "Sanity write token is not configured in this environment.",
			}),
			{ status: 503, headers: CORS_HEADERS },
		);
	}

	const targetDocs = await client.fetch<
		Array<{
			_id: string;
			_type: string;
			portalToken?: string;
			legacyPortalToken?: string;
			guestName?: string;
			guestEmail?: string;
			contactName?: string;
			contactEmail?: string;
			company?: string;
			companyName?: string;
			slotStartAt?: string;
			preCallNotes?: string;
			runOfShowNotes?: string;
			guestQuestions?: string;
			gmailThreadId?: string;
			gmailMessageId?: string;
			gmailSubject?: string;
			coordinatorEmail?: string;
			coordinatorEmails?: string[];
			allowedEmails?: string[];
			source?: string;
			bookingSource?: string;
			collaborationThread?: CollaborationThreadItem[];
		}>
	>(
		`*[_type in ["booking", "sponsorLead"] && (
			($token != "" && (portalToken == $token || legacyPortalToken == $token)) ||
			($docId != "" && (_id == $docId || _id == "private." + $docId)) ||
			($token != "" && (_id == "private.sponsorLead-" + $token || _id == "private.booking-" + $token))
		)]{
			_id,
			_type,
			portalToken,
			legacyPortalToken,
			guestName,
			guestEmail,
			contactName,
			contactEmail,
			company,
			companyName,
			slotStartAt,
			preCallNotes,
			runOfShowNotes,
			guestQuestions,
			gmailThreadId,
			gmailMessageId,
			gmailSubject,
			coordinatorEmail,
			coordinatorEmails,
			allowedEmails,
			guests,
			source,
			bookingSource,
			collaborationThread
		}`,
		{ token, docId } as Record<string, any>,
	);

	if (!targetDocs || targetDocs.length === 0) {
		if (noteType === "feedback") {
			const fallbackAuth = await verifyPortalRequestAuth({
				request,
				url: url ?? new URL(request.url),
				token: token || "book-page",
				allowedEmails: [],
			});
			if (fallbackAuth.authenticated) {
				const fallbackId = "private.booking-portal-feedback-inbox";
				const createdFallback = await client.createIfNotExists({
					_id: fallbackId,
					_type: "booking",
					portalToken: "book-page",
					guestName:
						updatedBy || fallbackAuth.verifiedEmail || "Booking Page Visitor",
					guestEmail:
						fallbackAuth.verifiedEmail || authorEmail || "alex@codingcat.dev",
					company: "CodingCat.dev Booking Feedback",
					status: "feedback_inbox",
					collaborationThread: [],
				});
				targetDocs.push(createdFallback as any);
			}
		}
		if (!targetDocs || targetDocs.length === 0) {
			return new Response(
				JSON.stringify({
					ok: false,
					message: "Matching booking or deal room document not found.",
				}),
				{ status: 404, headers: CORS_HEADERS },
			);
		}
	}

	const primaryDoc =
		targetDocs.find((d) => d._type === "booking") || targetDocs[0];
	const canonicalToken =
		primaryDoc?.portalToken ||
		token ||
		primaryDoc._id.replace(/^(private\.)?(booking|sponsorLead)-/, "");
	const allowedEmails = extractPortalAllowedEmails(...targetDocs);

	let verifiedEmail = authorEmail;
	if (!isOpsApp) {
		const auth = await verifyPortalRequestAuth({
			request,
			url: url ?? new URL(request.url),
			token: canonicalToken,
			allowedEmails,
		});

		if (!auth.authorized) {
			return new Response(
				JSON.stringify({
					ok: false,
					message:
						"Unauthorized: Please sign in with your invited guest or sponsor email via Better-Auth before editing notes or posting comments.",
				}),
				{ status: 403, headers: CORS_HEADERS },
			);
		}
		verifiedEmail = auth.verifiedEmail || authorEmail;
	} else {
		authorRole = "host";
		verifiedEmail = verifiedEmail || "alex@codingcat.dev";
	}

	const guestName =
		primaryDoc?.guestName || primaryDoc?.contactName || "Podcast Guest";
	const guestEmail = primaryDoc?.guestEmail || primaryDoc?.contactEmail || "";
	const company = primaryDoc?.company || primaryDoc?.companyName || guestName;
	const nowIso = new Date().toISOString();
	const resolvedAuthorName =
		updatedBy ||
		(authorRole === "host"
			? "Alex Patterson"
			: guestName || verifiedEmail || "Guest");

	const origin = url?.origin ?? new URL(request.url).origin;
	const workerEnv = (env ?? {}) as unknown as Record<
		string,
		string | undefined
	>;
	const siteUrl = (workerEnv.SITE_URL || origin).replace(/\/$/, "");
	const portalUrl = `${siteUrl}/portal/${canonicalToken}`;

	// 1. Handle any files dropped into the chat or linked via externalUrl
	const newAttachments: CollaborationAttachment[] = [];
	const newVaultEntries: Array<Record<string, any>> = [];
	const isPassionfroot =
		primaryDoc?.source === "passionfroot" ||
		primaryDoc?.bookingSource === "passionfroot";

	for (const file of uploadedFiles) {
		const arrayBuf = await file.arrayBuffer();
		const bytes = new Uint8Array(arrayBuf);
		const isImg = (file.type || "").startsWith("image/");
		const titleForFile = attachmentTitle || file.name;
		const uploadedAsset = await client.assets.upload(
			isImg ? "image" : "file",
			bytes as unknown as Blob,
			{
				filename: file.name,
				contentType: file.type || "application/octet-stream",
				title: titleForFile,
			},
		);

		const tagStrings = [
			"private-vault",
			isPassionfroot ? "source:passionfroot" : "source:direct",
			`partner:${company}`,
			`category:${attachmentCategory}`,
			"chat-drop",
		];

		const mlResult = await uploadAndLinkMediaLibraryAsset({
			bytes,
			filename: file.name,
			category: "portal-vault",
			visibility: "private-vault",
			title: titleForFile,
			partnerSlug: company,
			docType: primaryDoc?._type || "booking",
			tags: tagStrings,
		}).catch(() => null);

		const tagRefs = await ensureSanityMediaTags(client, tagStrings);
		if (tagRefs.length > 0) {
			try {
				await client
					.patch(uploadedAsset._id)
					.set({ "opt.media.tags": tagRefs })
					.commit();
			} catch {
				// Non-fatal
			}
		}

		const proxiedUrl = `${siteUrl}/api/portal/assets?token=${encodeURIComponent(canonicalToken)}&assetId=${encodeURIComponent(uploadedAsset._id)}`;
		const key = `att-${crypto.randomUUID().replace(/-/g, "").slice(0, 10)}`;

		newAttachments.push({
			_key: key,
			title: titleForFile,
			category: attachmentCategory,
			assetId: uploadedAsset._id,
			mimeType: file.type || "application/octet-stream",
			fileSize: file.size,
			externalUrl: proxiedUrl,
		});

		newVaultEntries.push({
			_key: `vault-${key}`,
			title: titleForFile,
			category: attachmentCategory,
			visibility: "private",
			uploadedBy: authorRole === "host" ? "codingcat" : "partner",
			uploadedAt: nowIso,
			assetId: uploadedAsset._id,
			...(mlResult?.mediaLibraryId
				? { mediaLibraryId: mlResult.mediaLibraryId }
				: {}),
			...(mlResult?.mediaLibraryAssetId
				? { mediaLibraryAssetId: mlResult.mediaLibraryAssetId }
				: {}),
			...(mlResult?.folderId
				? { mediaLibraryFolderId: mlResult.folderId }
				: {}),
			...(mlResult?.gdr ? { media: mlResult.gdr } : {}),
			mimeType: file.type || "application/octet-stream",
			fileSize: file.size,
			externalUrl: proxiedUrl,
		});
	}

	if (externalUrl) {
		const key = `att-${crypto.randomUUID().replace(/-/g, "").slice(0, 10)}`;
		const label = attachmentTitle || externalUrl;
		newAttachments.push({
			_key: key,
			title: label,
			category: attachmentCategory,
			externalUrl,
		});
		newVaultEntries.push({
			_key: `vault-${key}`,
			title: label,
			category: attachmentCategory,
			visibility: "private",
			uploadedBy: authorRole === "host" ? "codingcat" : "partner",
			uploadedAt: nowIso,
			externalUrl,
		});
	}

	// 2. Prepare Run-of-Show field updates
	const hasRosFieldUpdates =
		typeof preCallNotes === "string" ||
		typeof runOfShowNotes === "string" ||
		typeof guestQuestions === "string" ||
		(typeof topics === "string" && topics.trim().length > 0);

	const patchFields: Record<string, unknown> = {};
	if (hasRosFieldUpdates) {
		patchFields.runOfShowUpdatedAt = nowIso;
		patchFields.runOfShowUpdatedBy = resolvedAuthorName;
	}
	if (typeof preCallNotes === "string") {
		patchFields.preCallNotes = preCallNotes.slice(0, 12000);
	}
	if (typeof runOfShowNotes === "string") {
		patchFields.runOfShowNotes = runOfShowNotes.slice(0, 24000);
	}
	if (typeof guestQuestions === "string") {
		patchFields.guestQuestions = guestQuestions.slice(0, 12000);
	}
	if (typeof topics === "string" && topics.trim()) {
		patchFields.topics = topics.trim().slice(0, 8000);
	}

	// 3. Build Collaboration Thread Item (either explicit chat/call note, feedback with annotated screenshot, OR auto-logged Run-of-Show update)
	let threadItem: CollaborationThreadItem | null = null;
	let feedbackEntry: Record<string, any> | null = null;
	if (chatMessage || newAttachments.length > 0 || noteType === "feedback") {
		const effectiveNoteType =
			noteType === "feedback"
				? "feedback"
				: newAttachments.length > 0 && !chatMessage
					? "file_drop"
					: noteType;
		const formattedFeedbackLines: string[] = [];
		if (effectiveNoteType === "feedback") {
			if (feedbackRating) {
				formattedFeedbackLines.push(
					`⭐ Portal & Booking Experience Rating: ${feedbackRating}/5`,
				);
			}
			if (feedbackTopics.length > 0) {
				formattedFeedbackLines.push(`🏷️ Topics: ${feedbackTopics.join(", ")}`);
			}
			if (chatMessage) {
				formattedFeedbackLines.push("", chatMessage);
			}
			if (feedbackMeta?.selectedElement?.selector) {
				formattedFeedbackLines.push(
					"",
					`🎯 Highlighted Element: ${feedbackMeta.selectedElement.selector}${feedbackMeta.selectedElement.text ? ` ("${String(feedbackMeta.selectedElement.text).slice(0, 80)}")` : ""}`,
				);
			}
			if (feedbackMeta?.viewport || feedbackMeta?.timezone) {
				formattedFeedbackLines.push(
					`🖥️ Context: ${feedbackMeta.viewport || "unknown viewport"} · ${feedbackMeta.timezone || "unknown tz"} · ${feedbackMeta.pageUrl || ""}`,
				);
			}
			feedbackEntry = {
				_key: `fb-${crypto.randomUUID().replace(/-/g, "").slice(0, 12)}`,
				authorName: resolvedAuthorName,
				authorRole,
				authorEmail:
					verifiedEmail ||
					(authorRole === "host" ? "alex@codingcat.dev" : guestEmail),
				rating: feedbackRating,
				topics: feedbackTopics,
				message: chatMessage,
				meta: feedbackMeta,
				attachments: newAttachments,
				createdAt: nowIso,
			};
		}
		threadItem = {
			_key: `note-${crypto.randomUUID().replace(/-/g, "").slice(0, 12)}`,
			authorName: resolvedAuthorName,
			authorRole,
			authorEmail:
				verifiedEmail ||
				(authorRole === "host" ? "alex@codingcat.dev" : guestEmail),
			noteType: effectiveNoteType,
			message:
				effectiveNoteType === "feedback"
					? formattedFeedbackLines.join("\n") ||
						"Submitted Studio Portal feedback & screen annotation."
					: chatMessage ||
						`Dropped ${newAttachments.length} ${newAttachments.length === 1 ? "file/link" : "files/links"} into the Studio Vault: ${newAttachments.map((a) => a.title).join(", ")}`,
			createdAt: nowIso,
			emailedToCounterpart: Boolean(notifyCounterpart),
			...(newAttachments.length > 0 ? { attachments: newAttachments } : {}),
			...(feedbackRating ? { feedbackRating } : {}),
			...(feedbackTopics.length > 0 ? { feedbackTopics } : {}),
			...(feedbackMeta ? { feedbackMeta } : {}),
		};
	} else if (hasRosFieldUpdates) {
		const changedParts: string[] = [];
		if (
			typeof preCallNotes === "string" &&
			preCallNotes !== (primaryDoc?.preCallNotes || "")
		) {
			changedParts.push("Pre-Call Notes");
		}
		if (
			typeof guestQuestions === "string" &&
			guestQuestions !== (primaryDoc?.guestQuestions || "")
		) {
			changedParts.push("Guest Questions & Links");
		}
		if (
			typeof runOfShowNotes === "string" &&
			runOfShowNotes !== (primaryDoc?.runOfShowNotes || "")
		) {
			changedParts.push("5-Part Run-of-Show Outline");
		}
		threadItem = {
			_key: `note-${crypto.randomUUID().replace(/-/g, "").slice(0, 12)}`,
			authorName: resolvedAuthorName,
			authorRole,
			authorEmail:
				verifiedEmail ||
				(authorRole === "host" ? "alex@codingcat.dev" : guestEmail),
			noteType: "ros_update",
			message:
				changedParts.length > 0
					? `Updated ${changedParts.join(", ")} in the shared Run-of-Show.`
					: "Saved updates to the shared Run-of-Show & Pre-Call Notes.",
			createdAt: nowIso,
			emailedToCounterpart: Boolean(notifyCounterpart),
		};
	}

	// 4. Send 2-Way Email Notification in Canonical Gmail Thread (if notifyCounterpart is enabled)
	let emailSent = false;
	let updatedGmailThreadId = primaryDoc?.gmailThreadId;
	let updatedGmailMessageId = primaryDoc?.gmailMessageId;
	const canonicalSubject =
		primaryDoc?.gmailSubject ||
		buildCanonicalPodcastBookingSubject(guestName, company);
	const coordinatorEmails = Array.isArray(primaryDoc?.coordinatorEmails)
		? primaryDoc.coordinatorEmails
		: primaryDoc?.coordinatorEmail
			? [primaryDoc.coordinatorEmail]
			: undefined;

	const finalPreCall =
		typeof preCallNotes === "string"
			? preCallNotes
			: primaryDoc?.preCallNotes || "";
	const finalGuestQuestions =
		typeof guestQuestions === "string"
			? guestQuestions
			: primaryDoc?.guestQuestions || "";
	const finalRunOfShow =
		typeof runOfShowNotes === "string"
			? runOfShowNotes
			: primaryDoc?.runOfShowNotes || "";

	const combinedOutlineBlock: string[] = [];
	if (threadItem && threadItem.message) {
		combinedOutlineBlock.push(
			`💬 Latest Note from ${resolvedAuthorName}:`,
			threadItem.message,
			"",
		);
	}
	if (newAttachments.length > 0) {
		combinedOutlineBlock.push(
			"📎 Attached Files / Links (Synced to Portal #vault):",
			...newAttachments.map((a) => `• ${a.title}: ${a.externalUrl}`),
			"",
		);
	}
	if (finalPreCall.trim()) {
		combinedOutlineBlock.push(
			"1. Pre-Call Alignment & Tech Check Notes:",
			finalPreCall.trim(),
			"",
		);
	}
	if (finalGuestQuestions.trim()) {
		combinedOutlineBlock.push(
			"2. Prompts, Links & Lower-Third Callouts:",
			finalGuestQuestions.trim(),
			"",
		);
	}
	if (finalRunOfShow.trim()) {
		combinedOutlineBlock.push(
			"3. 45-Minute Episode Run-of-Show (5-Part Arc):",
			finalRunOfShow.trim(),
		);
	}

	if (notifyCounterpart) {
		try {
			if (authorRole === "host" && guestEmail) {
				// Host -> Guest notification in the canonical Gmail thread
				const formattedSlot = primaryDoc?.slotStartAt
					? `${new Date(primaryDoc.slotStartAt).toLocaleString("en-US", {
							dateStyle: "full",
							timeStyle: "short",
							timeZone: "America/New_York",
						})} ET`
					: undefined;

				const card = buildPodcastPortalEmailCard({
					guestName,
					company,
					statusBadge:
						noteType === "call_note"
							? "CodingCat.dev Studio · New Pre-Call / Session Notes"
							: newAttachments.length > 0
								? "CodingCat.dev Studio · New Files & Notes Shared"
								: "CodingCat.dev Studio · Updated Run-of-Show & Notes",
					headline:
						chatMessage && noteType === "call_note"
							? `Call Notes & Next Steps for ${company} x CodingCat.dev`
							: "Alex Patterson Updated Your Shared Run-of-Show & Notes",
					introParagraph: chatMessage
						? `I just posted new notes${newAttachments.length > 0 ? " and shared files" : ""} in your CodingCat.dev Studio Portal: "${chatMessage.slice(0, 280)}${chatMessage.length > 280 ? "..." : ""}". You can reply, drop files into the chat, or edit the shared Run-of-Show directly in your portal below.`
						: "I just updated our shared Pre-Call Notes and 5-Part Run-of-Show outline in your CodingCat.dev Studio Portal. Take a look below and feel free to edit or leave a comment directly in the portal!",
					slotSummary: formattedSlot,
					portalUrl: `${portalUrl}#run-of-show`,
					primaryCtaLabel: "Reply & Edit Notes in Studio Portal ->",
					primaryCtaUrl: `${portalUrl}#run-of-show`,
					secondaryCtaLabel:
						newAttachments.length > 0
							? "Open Asset Vault (#vault) ->"
							: undefined,
					secondaryCtaUrl:
						newAttachments.length > 0 ? `${portalUrl}#vault` : undefined,
					runOfShowLines:
						combinedOutlineBlock.length > 0 ? combinedOutlineBlock : undefined,
				});

				const emailRes = await sendCodingCatEmailDetailed({
					to: guestEmail,
					cc: coordinatorEmails,
					subject: updatedGmailThreadId
						? `Re: ${canonicalSubject}`
						: canonicalSubject,
					text: card.text,
					html: card.html,
					...(updatedGmailThreadId ? { threadId: updatedGmailThreadId } : {}),
					...(updatedGmailMessageId
						? {
								inReplyTo: updatedGmailMessageId,
								references: updatedGmailMessageId,
							}
						: {}),
				});

				emailSent = emailRes.ok;
				if (emailRes.threadId) {
					updatedGmailThreadId = emailRes.threadId;
					patchFields.gmailThreadId = emailRes.threadId;
				}
				if (emailRes.rfc822MessageId) {
					updatedGmailMessageId = emailRes.rfc822MessageId;
					patchFields.gmailMessageId = emailRes.rfc822MessageId;
				}
				patchFields.gmailSubject = canonicalSubject;
			} else if (authorRole === "guest" || noteType === "feedback") {
				// Guest -> Host (alex@codingcat.dev) alert in the canonical Gmail thread
				const opsAppUrl =
					"https://www.sanity.io/@ovF2qiKSO/application/bv37w3mpgxoi5p12dg9kmp9r/";
				const isFeedback = noteType === "feedback";
				const card = buildPodcastPortalEmailCard({
					guestName: "Alex",
					company,
					statusBadge: isFeedback
						? `🛠️ Portal & Booking Feedback (${feedbackRating ? `${feedbackRating}/5` : "Annotated"}) · ${resolvedAuthorName}`
						: `Guest Portal Update · ${resolvedAuthorName} (${company})`,
					headline: isFeedback
						? `${resolvedAuthorName} Submitted Portal Feedback${newAttachments.length > 0 ? " + Marked-Up Screenshot" : ""}`
						: chatMessage
							? `${resolvedAuthorName} Posted a Note in the Studio Portal`
							: `${resolvedAuthorName} Updated the Shared Run-of-Show`,
					introParagraph: isFeedback
						? `${resolvedAuthorName} (${verifiedEmail || guestEmail}) just submitted feedback on the CodingCat.dev Booking & Studio Portal${feedbackRating ? ` (Rating: ${feedbackRating}/5)` : ""}${feedbackTopics.length > 0 ? ` [${feedbackTopics.join(", ")}]` : ""}${newAttachments.length > 0 ? " with an annotated screen capture synced to Sanity Media Library" : ""}.`
						: chatMessage
							? `${resolvedAuthorName} (${verifiedEmail || guestEmail}) just posted a message${newAttachments.length > 0 ? ` and dropped ${newAttachments.length} attachment(s)` : ""} in the ${company} Studio Portal: "${chatMessage}".`
							: `${resolvedAuthorName} (${verifiedEmail || guestEmail}) just edited the shared Run-of-Show / Pre-Call Notes in the ${company} Studio Portal.`,
					portalUrl: `${portalUrl}#run-of-show`,
					primaryCtaLabel:
						isFeedback && newAttachments[0]?.externalUrl
							? "View Annotated Screenshot ->"
							: "Open Studio Portal (#run-of-show) ->",
					primaryCtaUrl:
						isFeedback && newAttachments[0]?.externalUrl
							? newAttachments[0].externalUrl
							: `${portalUrl}#run-of-show`,
					secondaryCtaLabel: "Open Studio Portal ->",
					secondaryCtaUrl: `${portalUrl}#run-of-show`,
					runOfShowLines:
						combinedOutlineBlock.length > 0 ? combinedOutlineBlock : undefined,
				});

				const emailRes = await sendCodingCatEmailDetailed({
					to: "alex@codingcat.dev",
					replyTo: verifiedEmail || guestEmail || undefined,
					subject: updatedGmailThreadId
						? `Re: ${canonicalSubject}`
						: canonicalSubject,
					text: card.text,
					html: card.html,
					...(updatedGmailThreadId ? { threadId: updatedGmailThreadId } : {}),
					...(updatedGmailMessageId
						? {
								inReplyTo: updatedGmailMessageId,
								references: updatedGmailMessageId,
							}
						: {}),
				});

				emailSent = emailRes.ok;
				if (emailRes.threadId && !updatedGmailThreadId) {
					updatedGmailThreadId = emailRes.threadId;
					patchFields.gmailThreadId = emailRes.threadId;
				}
			}
		} catch {
			// Non-fatal if email provider fails
		}
	}

	if (threadItem) {
		threadItem.emailedToCounterpart = emailSent;
	}

	// 5. Commit all patches (fields + collaborationThread + sharedAssets) to Sanity
	const updatedIds: string[] = [];
	for (const doc of targetDocs) {
		let patchBuilder = client.patch(doc._id);
		if (Object.keys(patchFields).length > 0) {
			patchBuilder = patchBuilder.set(patchFields);
		}
		if (threadItem) {
			patchBuilder = patchBuilder
				.setIfMissing({ collaborationThread: [] })
				.append("collaborationThread", [threadItem]);
		}
		if (feedbackEntry) {
			patchBuilder = patchBuilder
				.setIfMissing({ feedbackItems: [] })
				.append("feedbackItems", [feedbackEntry]);
		}
		if (newVaultEntries.length > 0) {
			patchBuilder = patchBuilder
				.setIfMissing({ sharedAssets: [] })
				.append("sharedAssets", newVaultEntries);
		}
		await patchBuilder.commit();
		updatedIds.push(doc._id);
	}

	const updatedThread = [
		...(Array.isArray(primaryDoc?.collaborationThread)
			? primaryDoc.collaborationThread
			: []),
		...(threadItem ? [threadItem] : []),
	];

	return new Response(
		JSON.stringify({
			ok: true,
			updatedDocIds: updatedIds,
			runOfShowUpdatedAt: nowIso,
			runOfShowUpdatedBy: resolvedAuthorName,
			threadItem,
			collaborationThread: updatedThread,
			uploadedAttachments: newAttachments,
			newVaultEntries,
			emailSent,
			emailResult: { sent: emailSent },
			gmailThreadId: updatedGmailThreadId,
		}),
		{
			status: 200,
			headers: CORS_HEADERS,
		},
	);
};
