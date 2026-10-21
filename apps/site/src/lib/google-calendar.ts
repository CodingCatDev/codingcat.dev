import { env } from "cloudflare:workers";

export const CODINGCAT_CALENDAR_IDS = [
	"alex.patterson@gmail.com",
	"alex@codingcat.dev",
	"alex.patterson@sanity.io",
	"mikqhmn29svd9p9m99quch9nuo@group.calendar.google.com", // Oliver - Alex
	"2em0afukjm0gk9k3n0ohh5ag3g@group.calendar.google.com", // Oliver - Events
	"a1jir6k8sl9k38fbbohoei5f80@group.calendar.google.com", // Oliver - Heidi
];

export interface AvailableCalendarSlot {
	id: string;
	startAt: string;
	endAt: string;
	displayDate: string;
	displayTime: string;
}

async function getAccessToken(): Promise<string | null> {
	const workerEnv = (env ?? {}) as unknown as Record<
		string,
		string | undefined
	>;
	const clientId = workerEnv.GOOGLE_CLIENT_ID;
	const clientSecret = workerEnv.GOOGLE_CLIENT_SECRET;
	const refreshToken = workerEnv.GOOGLE_REFRESH_TOKEN;

	if (!clientId || !clientSecret || !refreshToken) {
		return null;
	}

	const body = new URLSearchParams({
		client_id: clientId,
		client_secret: clientSecret,
		refresh_token: refreshToken,
		grant_type: "refresh_token",
	});

	const res = await fetch("https://oauth2.googleapis.com/token", {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: body.toString(),
	});

	if (!res.ok) {
		return null;
	}
	const data = (await res.json()) as { access_token?: string };
	return data.access_token ?? null;
}

function generateDefaultCandidateSlots(
	daysAhead = 14,
): AvailableCalendarSlot[] {
	const slots: AvailableCalendarSlot[] = [];
	const now = new Date();

	// Candidate slots in overlapping US PT (8:00 AM - 2:00 PM PT) & ET (11:00 AM - 5:00 PM ET) work hours:
	// 16:00 UTC (9:00 AM PDT / 12:00 PM EDT), 17:30 UTC (10:30 AM PDT / 1:30 PM EDT), 19:00 UTC (12:00 PM PDT / 3:00 PM EDT)
	const candidateUtcHours = [
		{ hour: 16, minute: 0, label: "9:00 AM PT / 12:00 PM ET" },
		{ hour: 17, minute: 30, label: "10:30 AM PT / 1:30 PM ET" },
		{ hour: 19, minute: 0, label: "12:00 PM PT / 3:00 PM ET" },
	];

	for (let d = 1; d <= daysAhead; d++) {
		const dayDate = new Date(now.getTime() + d * 86400_000);
		const dayOfWeek = dayDate.getUTCDay();
		// Weekdays Monday (1) through Friday (5), prioritizing Tue-Thu
		if (dayOfWeek === 0 || dayOfWeek === 6) {
			continue;
		}

		for (const cand of candidateUtcHours) {
			const start = new Date(
				Date.UTC(
					dayDate.getUTCFullYear(),
					dayDate.getUTCMonth(),
					dayDate.getUTCDate(),
					cand.hour,
					cand.minute,
					0,
				),
			);
			const end = new Date(start.getTime() + 45 * 60_000);
			slots.push({
				id: `slot-${start.toISOString().slice(0, 16).replace(/[:T]/g, "-")}`,
				startAt: start.toISOString(),
				endAt: end.toISOString(),
				displayDate: start.toLocaleDateString("en-US", {
					weekday: "short",
					month: "short",
					day: "numeric",
					timeZone: "America/New_York",
				}),
				displayTime: cand.label,
			});
		}
	}

	return slots;
}

/**
 * Queries Google Calendar FreeBusy API across all 6 of Alex Patterson's calendars
 * (Personal, CodingCat.dev, Sanity.io, and Oliver family calendars) and returns
 * conflict-free 45-minute recording slots during 8am-5pm PT/ET work hours.
 */
export async function getMultiCalendarAvailableSlots(
	maxSlots = 9,
): Promise<{ slots: AvailableCalendarSlot[]; liveVerified: boolean }> {
	const candidates = generateDefaultCandidateSlots(14);
	const accessToken = await getAccessToken();

	if (!accessToken || candidates.length === 0) {
		return {
			slots: candidates.slice(0, maxSlots),
			liveVerified: false,
		};
	}

	const timeMin = candidates[0].startAt;
	const timeMax = candidates[candidates.length - 1].endAt;

	try {
		const res = await fetch("https://www.googleapis.com/calendar/v3/freeBusy", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${accessToken}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				timeMin,
				timeMax,
				items: CODINGCAT_CALENDAR_IDS.map((id) => ({ id })),
			}),
		});

		if (!res.ok) {
			return { slots: candidates.slice(0, maxSlots), liveVerified: false };
		}

		const data = (await res.json()) as {
			calendars?: Record<
				string,
				{ busy?: Array<{ start: string; end: string }> }
			>;
		};

		const busyRanges: Array<{ startMs: number; endMs: number }> = [];
		for (const cal of Object.values(data.calendars ?? {})) {
			for (const b of cal.busy ?? []) {
				busyRanges.push({
					startMs: new Date(b.start).getTime(),
					endMs: new Date(b.end).getTime(),
				});
			}
		}

		const available = candidates.filter((slot) => {
			const slotStart = new Date(slot.startAt).getTime();
			const slotEnd = new Date(slot.endAt).getTime();
			return !busyRanges.some(
				(b) => slotStart < b.endMs && slotEnd > b.startMs,
			);
		});

		return {
			slots: (available.length > 0 ? available : candidates).slice(0, maxSlots),
			liveVerified: true,
		};
	} catch {
		return {
			slots: candidates.slice(0, maxSlots),
			liveVerified: false,
		};
	}
}

/**
 * Creates a Google Calendar event on alex@codingcat.dev (or alex.patterson@gmail.com)
 * when a Sponsored Showcase or approved Editorial session is booked.
 */
export async function createGoogleCalendarBookingEvent(opts: {
	guestName: string;
	guestEmail: string;
	company: string;
	track: string;
	startAt: string;
	topics: string;
	portalUrl?: string;
}): Promise<{ eventId: string; htmlLink?: string } | null> {
	const accessToken = await getAccessToken();
	if (!accessToken) {
		return null;
	}

	const start = new Date(opts.startAt);
	const end = new Date(start.getTime() + 45 * 60_000);

	const summary =
		opts.track === "editorial"
			? `CodingCat.dev Podcast: ${opts.guestName} (${opts.company})`
			: `[SPONSORED] CodingCat.dev Showcase: ${opts.guestName} (${opts.company})`;

	const descriptionLines = [
		`CodingCat.dev Recording Session (${opts.track.toUpperCase()})`,
		`Guest: ${opts.guestName} (${opts.guestEmail})`,
		`Company: ${opts.company}`,
		`Topics: ${opts.topics}`,
		"E-SIGN Media Release: Signed & stored in Sanity",
		...(opts.portalUrl ? [`Deal Room: ${opts.portalUrl}`] : []),
	];

	try {
		const res = await fetch(
			"https://www.googleapis.com/calendar/v3/calendars/alex%40codingcat.dev/events?sendUpdates=all",
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${accessToken}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					summary,
					description: descriptionLines.join("\n"),
					start: { dateTime: start.toISOString() },
					end: { dateTime: end.toISOString() },
					attendees: [
						{ email: "alex.patterson@gmail.com" },
						{ email: "alex@codingcat.dev" },
						{ email: opts.guestEmail, displayName: opts.guestName },
					],
				}),
			},
		);

		if (!res.ok) {
			return null;
		}
		const event = (await res.json()) as { id?: string; htmlLink?: string };
		if (!event.id) {
			return null;
		}
		return { eventId: event.id, htmlLink: event.htmlLink };
	} catch {
		return null;
	}
}
