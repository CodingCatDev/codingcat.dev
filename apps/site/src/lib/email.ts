import { env } from "cloudflare:workers";

interface SendEmailBinding {
	send(message: unknown): Promise<void>;
}

export interface CodingCatEmailOptions {
	to: string | string[];
	cc?: string | string[];
	replyTo?: string;
	subject: string;
	text: string;
	html?: string;
	from?: string;
	fromName?: string;
	threadId?: string;
	inReplyTo?: string;
	references?: string;
	messageId?: string;
}

export interface CodingCatEmailResult {
	ok: boolean;
	id?: string;
	threadId?: string;
	rfc822MessageId: string;
	subject: string;
}

function toBase64UrlUtf8(input: string): string {
	const bytes = new TextEncoder().encode(input);
	let binary = "";
	for (let i = 0; i < bytes.length; i++) {
		binary += String.fromCharCode(bytes[i]);
	}
	return btoa(binary)
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=+$/, "");
}

function encodeMimeSubject(subject: string): string {
	if (/^[\x20-\x7E]*$/.test(subject)) {
		return subject;
	}
	const bytes = new TextEncoder().encode(subject);
	let binary = "";
	for (let i = 0; i < bytes.length; i++) {
		binary += String.fromCharCode(bytes[i]);
	}
	return `=?UTF-8?B?${btoa(binary)}?=`;
}

function formatAddressList(addresses: string | string[] | undefined): string {
	if (!addresses) {
		return "";
	}
	const list = Array.isArray(addresses) ? addresses : [addresses];
	const cleaned = Array.from(
		new Set(list.map((a) => String(a || "").trim()).filter(Boolean)),
	);
	return cleaned
		.map((addr) => (addr.includes("<") ? addr : `<${addr}>`))
		.join(", ");
}

function escapeHtml(input: string): string {
	return input
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");
}

export function buildCanonicalPodcastBookingSubject(
	guestName: string,
	company?: string,
): string {
	const cleanGuest = (guestName || "Podcast Guest").trim();
	const cleanCompany = (company || "").trim();
	const hasDistinctCompany =
		cleanCompany.length > 0 &&
		cleanCompany.toLowerCase() !== cleanGuest.toLowerCase();
	const label = hasDistinctCompany
		? `${cleanGuest} (${cleanCompany})`
		: cleanGuest;
	return `CodingCat.dev Podcast: ${label} | Studio Portal & Booking Details`;
}

export interface PodcastPortalEmailCardOptions {
	guestName: string;
	company?: string;
	statusBadge: string;
	headline: string;
	introParagraph: string;
	slotSummary?: string;
	portalUrl: string;
	primaryCtaLabel?: string;
	primaryCtaUrl?: string;
	secondaryCtaLabel?: string;
	secondaryCtaUrl?: string;
	runOfShowLines?: string[];
	checklistItems?: string[];
	AuthorizedEmailsNote?: string;
	closingNote?: string;
}

export function buildPodcastPortalEmailCard(
	opts: PodcastPortalEmailCardOptions,
): { text: string; html: string } {
	const primaryLabel = opts.primaryCtaLabel || "Open Your Studio Portal ->";
	const primaryUrl = opts.primaryCtaUrl || opts.portalUrl;
	const checklist = opts.checklistItems?.length
		? opts.checklistItems
		: [
				"Step 1 (Speaker Profile): Verify your bio, 512x512 headshot, websites, and social links.",
				"Step 2 (Run-of-Show & Questions): Review or edit our 5-part episode outline and talking points in real time.",
				"Step 3 (Sanity Media Vault): Drop any architecture diagrams, repo links, logos, or demo URLs for the show.",
			];

	const textLines: string[] = [
		`Hi ${opts.guestName},`,
		"",
		opts.introParagraph,
		"",
		`Status: ${opts.statusBadge}`,
		...(opts.slotSummary ? [`Scheduled Slot: ${opts.slotSummary}`] : []),
		`Studio Portal & Sanity Media Vault: ${opts.portalUrl}`,
		...(opts.secondaryCtaUrl && opts.secondaryCtaUrl !== opts.portalUrl
			? [`${opts.secondaryCtaLabel || "Studio Link"}: ${opts.secondaryCtaUrl}`]
			: []),
		"",
		"What You Can Do in Your Studio Portal:",
		...checklist.map((item) => `- ${item}`),
	];

	if (opts.runOfShowLines && opts.runOfShowLines.length > 0) {
		textLines.push(
			"",
			"Proposed 5-Part Run-of-Show (Live-Editable in Your Portal):",
			...opts.runOfShowLines,
		);
	}

	if (opts.AuthorizedEmailsNote) {
		textLines.push("", opts.AuthorizedEmailsNote);
	}

	if (opts.closingNote) {
		textLines.push("", opts.closingNote);
	}

	textLines.push(
		"",
		"Looking forward to recording with you!",
		"",
		"Best,",
		"Alex Patterson",
		"Founder, CodingCat.dev",
	);

	const runOfShowHtml =
		opts.runOfShowLines && opts.runOfShowLines.length > 0
			? `
			<div style="margin: 22px 0; padding: 18px; background: #131B2E; border-radius: 12px; border: 1px solid #334155;">
				<div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #C084FC; font-weight: 700; margin-bottom: 10px;">
					Proposed 5-Part Run-of-Show (Co-Editable in Portal)
				</div>
				<pre style="margin: 0; white-space: pre-wrap; word-wrap: break-word; font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12.5px; line-height: 1.55; color: #E2E8F0;">${escapeHtml(opts.runOfShowLines.join("\n"))}</pre>
			</div>`
			: "";

	const checklistHtml = checklist
		.map(
			(item) =>
				`<li style="margin-bottom: 8px; color: #CBD5E1; font-size: 13.5px; line-height: 1.5;">${escapeHtml(item)}</li>`,
		)
		.join("");

	const secondaryButtonHtml =
		opts.secondaryCtaUrl && opts.secondaryCtaLabel
			? `
			<a href="${escapeHtml(opts.secondaryCtaUrl)}" style="display: inline-block; background: #131B2E; color: #C084FC; border: 1px solid #7C3AED; font-weight: 700; font-size: 13.5px; text-decoration: none; padding: 12px 20px; border-radius: 10px; margin-right: 10px; margin-bottom: 10px;">
				${escapeHtml(opts.secondaryCtaLabel)}
			</a>`
			: "";

	const html = `
<div style="font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 640px; margin: 0 auto; padding: 28px; background: #0B1326; color: #F8FAFC; border-radius: 16px; border: 2px solid #7C3AED;">
	<div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #C084FC; font-weight: 700; margin-bottom: 8px;">
		${escapeHtml(opts.statusBadge)}
	</div>
	<h1 style="font-size: 22px; font-weight: 800; margin: 0 0 12px; color: #FFFFFF; line-height: 1.3;">
		${escapeHtml(opts.headline)}
	</h1>
	<p style="font-size: 14.5px; line-height: 1.6; color: #CBD5E1; margin: 0 0 18px;">
		Hi ${escapeHtml(opts.guestName)}, ${escapeHtml(opts.introParagraph)}
	</p>
	${
		opts.slotSummary
			? `<div style="margin: 0 0 18px; padding: 12px 16px; background: #131B2E; border-left: 4px solid #C5E86C; border-radius: 8px; font-size: 13.5px; color: #F8FAFC;">
				<strong style="color: #C5E86C;">Scheduled Slot:</strong> ${escapeHtml(opts.slotSummary)}
			</div>`
			: ""
	}
	<div style="margin: 0 0 18px;">
		<a href="${escapeHtml(primaryUrl)}" style="display: inline-block; background: #7C3AED; color: #FFFFFF; font-weight: 700; font-size: 14px; text-decoration: none; padding: 12px 22px; border-radius: 10px; margin-right: 10px; margin-bottom: 10px;">
			${escapeHtml(primaryLabel)}
		</a>
		${secondaryButtonHtml}
	</div>
	<div style="margin: 18px 0; padding: 16px 18px; background: #131B2E; border-radius: 12px; border: 1px solid #1E293B;">
		<div style="font-size: 13px; font-weight: 700; color: #FFFFFF; margin-bottom: 8px;">
			What You Can Do in Your Studio Portal:
		</div>
		<ul style="margin: 0; padding-left: 18px;">
			${checklistHtml}
		</ul>
	</div>
	${runOfShowHtml}
	${
		opts.AuthorizedEmailsNote
			? `<p style="font-size: 12.5px; line-height: 1.5; color: #94A3B8; margin: 14px 0 0;">${escapeHtml(opts.AuthorizedEmailsNote)}</p>`
			: ""
	}
	${
		opts.closingNote
			? `<p style="font-size: 13.5px; line-height: 1.6; color: #CBD5E1; margin: 14px 0 0;">${escapeHtml(opts.closingNote)}</p>`
			: ""
	}
	<hr style="border: 0; border-top: 1px solid #1E293B; margin: 22px 0 14px;" />
	<p style="font-size: 13px; color: #94A3B8; margin: 0;">
		Looking forward to recording with you!<br />
		<strong style="color: #F8FAFC;">Alex Patterson</strong> &middot; Founder, <a href="https://codingcat.dev" style="color: #C084FC; text-decoration: none;">CodingCat.dev</a>
	</p>
</div>`.trim();

	return {
		text: textLines.join("\n"),
		html,
	};
}

function buildMimeMessage(opts: {
	from: string;
	fromName: string;
	to: string | string[];
	cc?: string | string[];
	replyTo?: string;
	subject: string;
	text: string;
	html?: string;
	inReplyTo?: string;
	references?: string;
	messageId: string;
}): string {
	const boundary = `----=_Part_${crypto.randomUUID().replace(/-/g, "")}`;
	const date = new Date().toUTCString();
	const toHeader = formatAddressList(opts.to);
	const ccHeader = formatAddressList(opts.cc);
	const lines = [
		`From: "${opts.fromName}" <${opts.from}>`,
		`To: ${toHeader}`,
		...(ccHeader ? [`Cc: ${ccHeader}`] : []),
		...(opts.replyTo ? [`Reply-To: ${opts.replyTo}`] : []),
		`Subject: ${encodeMimeSubject(opts.subject)}`,
		`Date: ${date}`,
		`Message-ID: ${opts.messageId}`,
		...(opts.inReplyTo ? [`In-Reply-To: ${opts.inReplyTo}`] : []),
		...(opts.references ? [`References: ${opts.references}`] : []),
		"MIME-Version: 1.0",
		`Content-Type: multipart/alternative; boundary="${boundary}"`,
		"",
		`--${boundary}`,
		"Content-Type: text/plain; charset=UTF-8",
		"Content-Transfer-Encoding: 8bit",
		"",
		opts.text,
	];

	if (opts.html) {
		lines.push(
			`--${boundary}`,
			"Content-Type: text/html; charset=UTF-8",
			"Content-Transfer-Encoding: 8bit",
			"",
			opts.html,
		);
	}

	lines.push(`--${boundary}--`, "");
	return lines.join("\r\n");
}

function cleanSecret(val: string | undefined): string {
	return (val || "").trim().replace(/^["']|["']$/g, "");
}

async function getGoogleGmailAccessToken(): Promise<string | null> {
	const workerEnv = (env ?? {}) as unknown as Record<
		string,
		string | undefined
	>;
	const clientId = cleanSecret(
		workerEnv.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID,
	);
	const clientSecret = cleanSecret(
		workerEnv.GOOGLE_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET,
	);
	const refreshTokens = Array.from(
		new Set(
			[
				cleanSecret(
					workerEnv.GOOGLE_WORKSPACE_REFRESH_TOKEN ||
						process.env.GOOGLE_WORKSPACE_REFRESH_TOKEN,
				),
				cleanSecret(
					workerEnv.GOOGLE_REFRESH_TOKEN || process.env.GOOGLE_REFRESH_TOKEN,
				),
			].filter(Boolean),
		),
	);

	if (!clientId || !clientSecret || refreshTokens.length === 0) {
		return null;
	}

	let fallbackToken: string | null = null;

	for (const refreshToken of refreshTokens) {
		try {
			const res = await fetch("https://oauth2.googleapis.com/token", {
				method: "POST",
				headers: { "Content-Type": "application/x-www-form-urlencoded" },
				body: new URLSearchParams({
					client_id: clientId,
					client_secret: clientSecret,
					refresh_token: refreshToken,
					grant_type: "refresh_token",
				}),
			});
			if (!res.ok) {
				continue;
			}
			const data = (await res.json()) as {
				access_token?: string;
				scope?: string;
			};
			if (data.access_token) {
				if (
					data.scope &&
					(data.scope.includes("gmail.compose") ||
						data.scope.includes("gmail.send") ||
						data.scope.includes("mail.google.com"))
				) {
					return data.access_token;
				}
				if (!fallbackToken) {
					fallbackToken = data.access_token;
				}
			}
		} catch {
			// try next token
		}
	}

	return fallbackToken;
}

async function sendViaGmailApi(
	rawMime: string,
	threadId?: string,
): Promise<{ ok: boolean; id?: string; threadId?: string }> {
	const accessToken = await getGoogleGmailAccessToken();
	if (!accessToken) {
		return { ok: false };
	}

	const rawBase64Url = toBase64UrlUtf8(rawMime);
	try {
		const sendRes = await fetch(
			"https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${accessToken}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					raw: rawBase64Url,
					...(threadId ? { threadId } : {}),
				}),
			},
		);
		if (sendRes.ok) {
			const data = (await sendRes.json()) as {
				id?: string;
				threadId?: string;
			};
			return {
				ok: true,
				id: data.id,
				threadId: data.threadId || threadId,
			};
		}
	} catch {
		// fall through
	}
	return { ok: false };
}

export async function sendCodingCatEmailDetailed(
	opts: CodingCatEmailOptions,
): Promise<CodingCatEmailResult> {
	const from = opts.from ?? "alex@codingcat.dev";
	const fromName = opts.fromName ?? "Alex Patterson (CodingCat.dev)";
	const rfc822MessageId =
		opts.messageId || `<${crypto.randomUUID()}@codingcat.dev>`;
	const raw = buildMimeMessage({
		from,
		fromName,
		to: opts.to,
		cc: opts.cc,
		replyTo: opts.replyTo,
		subject: opts.subject,
		text: opts.text,
		html: opts.html,
		inReplyTo: opts.inReplyTo,
		references: opts.references || opts.inReplyTo,
		messageId: rfc822MessageId,
	});

	// 1. Primary: Send via Gmail API (delivers to any external guest or sponsor email address)
	const gmailRes = await sendViaGmailApi(raw, opts.threadId);
	if (gmailRes.ok) {
		return {
			ok: true,
			id: gmailRes.id,
			threadId: gmailRes.threadId,
			rfc822MessageId,
			subject: opts.subject,
		};
	}

	// 2. Fallback: Cloudflare Email Routing send_email binding
	try {
		const workerEnv = (env ?? {}) as unknown as {
			EMAIL?: SendEmailBinding;
		};
		if (!workerEnv.EMAIL) {
			return { ok: false, rfc822MessageId, subject: opts.subject };
		}

		const primaryTo = Array.isArray(opts.to) ? opts.to[0] : opts.to;
		const { EmailMessage } = await import("cloudflare:email");
		const msg = new EmailMessage(from, primaryTo, raw);
		await workerEnv.EMAIL.send(msg);
		return { ok: true, rfc822MessageId, subject: opts.subject };
	} catch {
		return { ok: false, rfc822MessageId, subject: opts.subject };
	}
}

export async function sendCodingCatEmail(
	opts: CodingCatEmailOptions,
): Promise<boolean> {
	const res = await sendCodingCatEmailDetailed(opts);
	return res.ok;
}
