import { env } from "cloudflare:workers";
import type { APIRoute } from "astro";
import { sendCodingCatEmail } from "@/lib/email";
import { STREAMYARD_STUDIO_URL } from "@/lib/google-calendar";
import { getSanityServerClient } from "@/lib/sanity/write-client";

const CORS_HEADERS = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
	"Access-Control-Allow-Headers": "Content-Type, Authorization",
	"Content-Type": "application/json",
};

export const OPTIONS: APIRoute = async () => {
	return new Response(null, { status: 204, headers: CORS_HEADERS });
};

async function getGoogleCalendarToken(): Promise<string | null> {
	const workerEnv = (env ?? {}) as unknown as Record<
		string,
		string | undefined
	>;
	const clientId = workerEnv.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID;
	const clientSecret =
		workerEnv.GOOGLE_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET;
	const refreshToken =
		workerEnv.GOOGLE_WORKSPACE_REFRESH_TOKEN ||
		process.env.GOOGLE_WORKSPACE_REFRESH_TOKEN ||
		workerEnv.GOOGLE_REFRESH_TOKEN ||
		process.env.GOOGLE_REFRESH_TOKEN;

	if (!clientId || !clientSecret || !refreshToken) {
		return null;
	}

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
	if (!res.ok) return null;
	const data = (await res.json()) as { access_token?: string };
	return data.access_token ?? null;
}

export interface MasterScheduleItem {
	id: string;
	calendarId: string;
	title: string;
	startAt: string;
	endAt: string;
	location?: string;
	htmlLink?: string;
	visibility?: string;
	status?: string;
}

async function fetchUpcomingCalendarEvents(
	daysAhead = 45,
): Promise<MasterScheduleItem[]> {
	const token = await getGoogleCalendarToken();
	if (!token) return [];

	const now = new Date();
	const timeMin = new Date(now.getTime() - 12 * 3600_000).toISOString();
	const timeMax = new Date(
		now.getTime() + daysAhead * 86400_000,
	).toISOString();

	const calendars = ["alex@codingcat.dev", "alex.patterson@sanity.io"];
	const results: MasterScheduleItem[] = [];

	await Promise.all(
		calendars.map(async (calId) => {
			try {
				const res = await fetch(
					`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calId)}/events?timeMin=${encodeURIComponent(timeMin)}&timeMax=${encodeURIComponent(timeMax)}&singleEvents=true&orderBy=startTime&maxResults=120`,
					{ headers: { Authorization: `Bearer ${token}` } },
				);
				if (!res.ok) return;
				const data = (await res.json()) as {
					items?: Array<{
						id?: string;
						summary?: string;
						start?: { dateTime?: string; date?: string };
						end?: { dateTime?: string; date?: string };
						location?: string;
						htmlLink?: string;
						visibility?: string;
						status?: string;
					}>;
				};
				for (const item of data.items || []) {
					const startAt = item.start?.dateTime || item.start?.date;
					const endAt = item.end?.dateTime || item.end?.date;
					if (!startAt || !endAt || item.status === "cancelled") continue;
					// Skip duplicate private shadow blocks from alex.patterson@sanity.io in the master feed
					// since alex@codingcat.dev already has the primary booking event
					if (
						calId === "alex.patterson@sanity.io" &&
						(item.summary || "").startsWith("[CodingCat.dev]")
					) {
						continue;
					}
					results.push({
						id: `${calId}:${item.id}`,
						calendarId: calId,
						title: item.summary || "(Busy)",
						startAt,
						endAt,
						location: item.location,
						htmlLink: item.htmlLink,
						visibility: item.visibility,
						status: item.status,
					});
				}
			} catch {
				// Ignore calendar fetch failure
			}
		}),
	);

	return results.sort(
		(a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime(),
	);
}

async function buildAndOptionallySendDigest(opts: {
	sendEmail: boolean;
	recipientEmail?: string;
	siteOrigin: string;
}) {
	const { client } = getSanityServerClient();

	const data = await client.fetch<{
		bookings: Array<Record<string, any>>;
		leads: Array<Record<string, any>>;
	}>(`{
		"bookings": *[_type == "booking" && !(_id in path("drafts.**")) && !(status in ["cancelled", "published", "archived"])] | order(coalesce(slotStartAt, _createdAt) asc),
		"leads": *[_type == "sponsorLead" && !(_id in path("drafts.**")) && !(status in ["cancelled", "paid", "archived"])] | order(coalesce(lastEmailAt, _updatedAt, _createdAt) desc)
	}`);

	const calendarEvents = await fetchUpcomingCalendarEvents(45);

	const now = new Date();
	const todayEtStr = now.toLocaleDateString("en-CA", {
		timeZone: "America/Detroit",
	});
	const next72hMs = now.getTime() + 72 * 3600_000;

	const pendingHolds = (data.bookings || []).filter(
		(b) => b.status === "pending",
	);
	const upcoming72hBookings = (data.bookings || []).filter((b) => {
		if (!b.slotStartAt) return false;
		const ms = new Date(b.slotStartAt).getTime();
		return ms >= now.getTime() - 4 * 3600_000 && ms <= next72hMs;
	});
	const todayCalendarEvents = calendarEvents.filter((ev) => {
		try {
			const dStr = new Date(ev.startAt).toLocaleDateString("en-CA", {
				timeZone: "America/Detroit",
			});
			return dStr === todayEtStr;
		} catch {
			return false;
		}
	});
	const actionLeads = (data.leads || []).filter((l) =>
		["new", "replied", "negotiating", "deposit_sent", "balance_sent"].includes(
			l.status || "new",
		),
	);

	const fmtTime = (iso?: string) => {
		if (!iso) return "Unscheduled";
		try {
			return new Date(iso).toLocaleString("en-US", {
				weekday: "short",
				month: "short",
				day: "numeric",
				hour: "numeric",
				minute: "2-digit",
				timeZone: "America/Detroit",
			});
		} catch {
			return iso;
		}
	};

	const textLines: string[] = [
		`CodingCat.dev Daily Action Digest (${todayEtStr})`,
		"==================================================",
		"",
		`1. TODAY'S SCHEDULE (${todayCalendarEvents.length} events on alex@codingcat.dev & alex.patterson@sanity.io):`,
		...(todayCalendarEvents.length === 0
			? ["   - No calendar events scheduled for today."]
			: todayCalendarEvents.map(
					(ev) =>
						`   - [${fmtTime(ev.startAt)}] ${ev.title} (${ev.calendarId})${ev.location ? ` -> ${ev.location}` : ""}`,
				)),
		"",
		`2. UNAPPROVED PODCAST HOLDS NEEDING ACTION (${pendingHolds.length}):`,
		...(pendingHolds.length === 0
			? ["   - Zero unapproved holds waiting."]
			: pendingHolds.map(
					(b) =>
						`   - [${fmtTime(b.slotStartAt)}] ${b.guestName} (${b.company || "Independent"}) <${b.guestEmail}> -> Approve StreamYard (${STREAMYARD_STUDIO_URL}) or Request 15m Pre-Call in Ops App`,
				)),
		"",
		`3. RECORDINGS IN THE NEXT 72 HOURS (${upcoming72hBookings.length}):`,
		...(upcoming72hBookings.length === 0
			? ["   - No recordings in the next 72 hours."]
			: upcoming72hBookings.map(
					(b) =>
						`   - [${fmtTime(b.slotStartAt)}] ${b.guestName} (${b.company || "Independent"}) · Status: ${b.status} · Vault: ${opts.siteOrigin}/portal/${b.portalToken || b._id.replace(/^booking-/, "")}#vault`,
				)),
		"",
		`4. ACTIVE SPONSOR DEALS NEEDING FOLLOW-UP (${actionLeads.length}):`,
		...(actionLeads.length === 0
			? ["   - All active sponsor deals are up to date."]
			: actionLeads.map(
					(l) =>
						`   - ${l.companyName} (${l.contactEmail}) · Stage: ${l.status} · Source: ${l.source || "inbound"} · Deal Room: ${opts.siteOrigin}/portal/${l.portalToken || l._id.replace(/^sponsorLead-/, "")}`,
				)),
		"",
		`Open CodingCat.dev Studio & Ops App: ${opts.siteOrigin}`,
	];

	const emailText = textLines.join("\n");
	let emailResult: { sent: boolean; provider: string } | null = null;

	if (opts.sendEmail) {
		emailResult = await sendCodingCatEmail({
			to: opts.recipientEmail || "alex@codingcat.dev",
			subject: `[CodingCat.dev Today] ${todayEtStr}: ${pendingHolds.length} Holds, ${upcoming72hBookings.length} Upcoming Recordings, ${actionLeads.length} Deals`,
			text: emailText,
		});
	}

	return {
		ok: true,
		date: todayEtStr,
		summary: {
			todayEventsCount: todayCalendarEvents.length,
			pendingHoldsCount: pendingHolds.length,
			upcoming72hCount: upcoming72hBookings.length,
			actionLeadsCount: actionLeads.length,
		},
		todayCalendarEvents,
		pendingHolds,
		upcoming72hBookings,
		actionLeads,
		calendarEvents,
		emailText,
		emailResult,
	};
}

export const GET: APIRoute = async ({ url, request }) => {
	const sendEmail =
		url.searchParams.get("sendEmail") === "1" ||
		url.searchParams.get("sendEmail") === "true";
	const recipientEmail = url.searchParams.get("to") || undefined;
	const siteOrigin = url.origin || new URL(request.url).origin;

	const payload = await buildAndOptionallySendDigest({
		sendEmail,
		recipientEmail,
		siteOrigin,
	});
	return new Response(JSON.stringify(payload), {
		status: 200,
		headers: CORS_HEADERS,
	});
};

export const POST: APIRoute = async ({ url, request }) => {
	let body: { sendEmail?: boolean; to?: string } = {};
	try {
		body = await request.json();
	} catch {
		// Default to sending email on POST
	}
	const siteOrigin = url.origin || new URL(request.url).origin;
	const payload = await buildAndOptionallySendDigest({
		sendEmail: body.sendEmail ?? true,
		recipientEmail: body.to,
		siteOrigin,
	});
	return new Response(JSON.stringify(payload), {
		status: 200,
		headers: CORS_HEADERS,
	});
};
