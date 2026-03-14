/**
 * Notify email subscribers about new content via Resend.
 * Stubbed — requires RESEND_API_KEY to be configured.
 */
export async function notifySubscribers(opts: {
	subject: string;
	videoTitle: string;
	videoUrl: string;
	description: string;
	fromEmail?: string;
	notificationEmails?: string[];
}): Promise<{ sent: boolean; error?: string }> {
	const apiKey = process.env.RESEND_API_KEY;
	if (!apiKey) {
		console.warn("[resend-notify] RESEND_API_KEY not set — skipping email notification");
		return { sent: false, error: "RESEND_API_KEY not configured" };
	}

	try {
		const { Resend } = await import("resend");
		const resend = new Resend(apiKey);

		await resend.emails.send({
			from: `CodingCat.dev <${opts.fromEmail || "noreply@codingcat.dev"}>`,
			to: opts.notificationEmails || ["subscribers@codingcat.dev"],
			subject: opts.subject,
			html: `
				<h1>${opts.videoTitle}</h1>
				<p>${opts.description}</p>
				<a href="${opts.videoUrl}">Watch Now</a>
			`,
		});

		return { sent: true };
	} catch (error) {
		console.error("[resend-notify] Failed to send:", error);
		return { sent: false, error: String(error) };
	}
}
