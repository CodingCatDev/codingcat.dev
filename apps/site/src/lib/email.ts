import { env } from "cloudflare:workers";

interface SendEmailBinding {
	send(message: unknown): Promise<void>;
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

function buildMimeMessage(opts: {
	from: string;
	fromName: string;
	to: string;
	subject: string;
	text: string;
	html?: string;
}): string {
	const boundary = `----=_Part_${crypto.randomUUID().replace(/-/g, "")}`;
	const date = new Date().toUTCString();
	const msgId = `<${crypto.randomUUID()}@codingcat.dev>`;
	const lines = [
		`From: "${opts.fromName}" <${opts.from}>`,
		`To: <${opts.to}>`,
		`Subject: ${encodeMimeSubject(opts.subject)}`,
		`Date: ${date}`,
		`Message-ID: ${msgId}`,
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
			if (!res.ok) continue;
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

async function sendViaGmailApi(rawMime: string): Promise<boolean> {
	const accessToken = await getGoogleGmailAccessToken();
	if (!accessToken) {
		return false;
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
				body: JSON.stringify({ raw: rawBase64Url }),
			},
		);
		if (sendRes.ok) {
			return true;
		}
	} catch {
		// fall through
	}
	return false;
}

export async function sendCodingCatEmail(opts: {
	to: string;
	subject: string;
	text: string;
	html?: string;
	from?: string;
	fromName?: string;
}): Promise<boolean> {
	const from = opts.from ?? "alex@codingcat.dev";
	const fromName = opts.fromName ?? "Alex Patterson (CodingCat.dev)";
	const raw = buildMimeMessage({
		from,
		fromName,
		to: opts.to,
		subject: opts.subject,
		text: opts.text,
		html: opts.html,
	});

	// 1. Primary: Send via Gmail API (delivers to any external guest or sponsor email address)
	const gmailSent = await sendViaGmailApi(raw);
	if (gmailSent) {
		return true;
	}

	// 2. Fallback: Cloudflare Email Routing send_email binding (for verified Cloudflare destination addresses)
	try {
		const workerEnv = (env ?? {}) as unknown as {
			EMAIL?: SendEmailBinding;
		};
		if (!workerEnv.EMAIL) {
			return false;
		}

		const { EmailMessage } = await import("cloudflare:email");
		const msg = new EmailMessage(from, opts.to, raw);
		await workerEnv.EMAIL.send(msg);
		return true;
	} catch {
		return false;
	}
}
