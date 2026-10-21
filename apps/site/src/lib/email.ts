import { env } from "cloudflare:workers";

interface SendEmailBinding {
	send(message: unknown): Promise<void>;
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
		`Subject: ${opts.subject}`,
		`Date: ${date}`,
		`Message-ID: ${msgId}`,
		"MIME-Version: 1.0",
		`Content-Type: multipart/alternative; boundary="${boundary}"`,
		"",
		`--${boundary}`,
		"Content-Type: text/plain; charset=UTF-8",
		"Content-Transfer-Encoding: 7bit",
		"",
		opts.text,
	];

	if (opts.html) {
		lines.push(
			`--${boundary}`,
			"Content-Type: text/html; charset=UTF-8",
			"Content-Transfer-Encoding: 7bit",
			"",
			opts.html,
		);
	}

	lines.push(`--${boundary}--`, "");
	return lines.join("\r\n");
}

export async function sendCodingCatEmail(opts: {
	to: string;
	subject: string;
	text: string;
	html?: string;
	from?: string;
	fromName?: string;
}): Promise<boolean> {
	try {
		const workerEnv = (env ?? {}) as unknown as {
			EMAIL?: SendEmailBinding;
		};
		if (!workerEnv.EMAIL) {
			return false;
		}

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

		const { EmailMessage } = await import("cloudflare:email");
		const msg = new EmailMessage(from, opts.to, raw);
		await workerEnv.EMAIL.send(msg);
		return true;
	} catch {
		return false;
	}
}
