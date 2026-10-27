import { env } from "cloudflare:workers";

export const CODINGCAT_CALENDAR_IDS = [
	"alex.patterson@gmail.com",
	"alex@codingcat.dev",
	"alex@flipfeeds.com",
	"alex.patterson@sanity.io",
	"mikqhmn29svd9p9m99quch9nuo@group.calendar.google.com", // Oliver - Alex
	"2em0afukjm0gk9k3n0ohh5ag3g@group.calendar.google.com", // Oliver - Events
	"a1jir6k8sl9k38fbbohoei5f80@group.calendar.google.com", // Oliver - Heidi
];

export interface AvailableCalendarSlot {
	id: string;
	startAt: string;
	endAt: string;
	durationMinutes: number;
	displayDate: string;
	displayTime: string;
}

export interface CalendarCheckStatus {
	id: string;
	accessible: boolean;
	busyCount: number;
	error?: string;
}

async function getAccessToken(
	refreshTokenOverride?: string,
): Promise<string | null> {
	const workerEnv = (env ?? {}) as unknown as Record<
		string,
		string | undefined
	>;
	const clientId = workerEnv.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID;
	const clientSecret =
		workerEnv.GOOGLE_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET;
	const refreshToken =
		refreshTokenOverride ||
		workerEnv.GOOGLE_REFRESH_TOKEN ||
		process.env.GOOGLE_REFRESH_TOKEN;

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

function resolveBaseStartDate(startDateStr?: string): Date {
	const tomorrow = new Date(Date.now() + 86400_000);
	if (!startDateStr) {
		return tomorrow;
	}
	const parsed = new Date(`${startDateStr}T12:00:00Z`);
	if (Number.isNaN(parsed.getTime())) {
		return tomorrow;
	}
	const maxFuture = new Date(Date.now() + 180 * 86400_000);
	if (parsed < tomorrow) {
		return tomorrow;
	}
	if (parsed > maxFuture) {
		return maxFuture;
	}
	return parsed;
}

function generateDefaultCandidateSlots(
	daysAhead = 21,
	durationMinutes = 45,
	startDateStr?: string,
): AvailableCalendarSlot[] {
	const slots: AvailableCalendarSlot[] = [];
	const baseDate = resolveBaseStartDate(startDateStr);

	// Candidate slots in overlapping US PT (8:00 AM - 2:00 PM PT) & ET (11:00 AM - 5:00 PM ET) work hours:
	// 15:00 UTC (8:00 AM PDT / 11:00 AM EDT), 16:00 UTC (9:00 AM PDT / 12:00 PM EDT),
	// 17:30 UTC (10:30 AM PDT / 1:30 PM EDT), 19:00 UTC (12:00 PM PDT / 3:00 PM EDT),
	// 20:00 UTC (1:00 PM PDT / 4:00 PM EDT)
	const candidateUtcHours = [
		{ hour: 15, minute: 0, label: "8:00 AM PT / 11:00 AM ET" },
		{ hour: 16, minute: 0, label: "9:00 AM PT / 12:00 PM ET" },
		{ hour: 17, minute: 30, label: "10:30 AM PT / 1:30 PM ET" },
		{ hour: 19, minute: 0, label: "12:00 PM PT / 3:00 PM ET" },
		{ hour: 20, minute: 0, label: "1:00 PM PT / 4:00 PM ET" },
	];

	for (let d = 0; d < daysAhead; d++) {
		const dayDate = new Date(baseDate.getTime() + d * 86400_000);
		const dayOfWeek = dayDate.getUTCDay();
		// Weekdays Monday (1) through Friday (5)
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
			const end = new Date(start.getTime() + durationMinutes * 60_000);
			slots.push({
				id: `slot-${start.toISOString().slice(0, 16).replace(/[:T]/g, "-")}`,
				startAt: start.toISOString(),
				endAt: end.toISOString(),
				durationMinutes,
				displayDate: start.toLocaleDateString("en-US", {
					weekday: "short",
					month: "short",
					day: "numeric",
					timeZone: "America/New_York",
				}),
				displayTime: `${cand.label} (${durationMinutes}m)`,
			});
		}
	}

	return slots;
}

async function fetchBusyRanges(
	timeMin: string,
	timeMax: string,
): Promise<{
	liveVerified: boolean;
	busyRanges: Array<{ startMs: number; endMs: number }>;
	calendarStatuses: CalendarCheckStatus[];
}> {
	const accessToken = await getAccessToken();
	if (!accessToken) {
		return {
			liveVerified: false,
			busyRanges: [],
			calendarStatuses: CODINGCAT_CALENDAR_IDS.map((id) => ({
				id,
				accessible: false,
				busyCount: 0,
				error: "missing_oauth_token",
			})),
		};
	}

	const busyRanges: Array<{ startMs: number; endMs: number }> = [];
	const calendarStatuses: CalendarCheckStatus[] = [];

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
			return {
				liveVerified: false,
				busyRanges: [],
				calendarStatuses: CODINGCAT_CALENDAR_IDS.map((id) => ({
					id,
					accessible: false,
					busyCount: 0,
					error: `http_${res.status}`,
				})),
			};
		}

		const data = (await res.json()) as {
			calendars?: Record<
				string,
				{
					busy?: Array<{ start: string; end: string }>;
					errors?: Array<{ reason?: string }>;
				}
			>;
		};

		for (const id of CODINGCAT_CALENDAR_IDS) {
			const cal = data.calendars?.[id];
			const errReason = cal?.errors?.[0]?.reason;
			const busyList = cal?.busy ?? [];
			for (const b of busyList) {
				busyRanges.push({
					startMs: new Date(b.start).getTime(),
					endMs: new Date(b.end).getTime(),
				});
			}
			calendarStatuses.push({
				id,
				accessible: !errReason,
				busyCount: busyList.length,
				...(errReason ? { error: errReason } : {}),
			});
		}

		// Optional secondary token for flipfeeds.com if alex@flipfeeds.com isn't shared via ACL yet
		const workerEnv = (env ?? {}) as unknown as Record<
			string,
			string | undefined
		>;
		const flipfeedsRefreshToken =
			workerEnv.GOOGLE_FLIPFEEDS_REFRESH_TOKEN ||
			process.env.GOOGLE_FLIPFEEDS_REFRESH_TOKEN;
		const flipStatus = calendarStatuses.find(
			(c) => c.id === "alex@flipfeeds.com",
		);
		if (flipfeedsRefreshToken && flipStatus && !flipStatus.accessible) {
			const flipAccess = await getAccessToken(flipfeedsRefreshToken);
			if (flipAccess) {
				const flipRes = await fetch(
					"https://www.googleapis.com/calendar/v3/freeBusy",
					{
						method: "POST",
						headers: {
							Authorization: `Bearer ${flipAccess}`,
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							timeMin,
							timeMax,
							items: [{ id: "alex@flipfeeds.com" }],
						}),
					},
				);
				if (flipRes.ok) {
					const flipData = (await flipRes.json()) as {
						calendars?: Record<
							string,
							{ busy?: Array<{ start: string; end: string }> }
						>;
					};
					const flipBusy =
						flipData.calendars?.["alex@flipfeeds.com"]?.busy ?? [];
					for (const b of flipBusy) {
						busyRanges.push({
							startMs: new Date(b.start).getTime(),
							endMs: new Date(b.end).getTime(),
						});
					}
					flipStatus.accessible = true;
					flipStatus.busyCount = flipBusy.length;
					delete flipStatus.error;
				}
			}
		}

		return {
			liveVerified: true,
			busyRanges,
			calendarStatuses,
		};
	} catch {
		return {
			liveVerified: false,
			busyRanges: [],
			calendarStatuses: CODINGCAT_CALENDAR_IDS.map((id) => ({
				id,
				accessible: false,
				busyCount: 0,
				error: "network_error",
			})),
		};
	}
}

function spreadSlotsAcrossDays(
	slots: AvailableCalendarSlot[],
	maxSlots: number,
	maxPerDay = 2,
): AvailableCalendarSlot[] {
	const selected: AvailableCalendarSlot[] = [];
	const perDayCount = new Map<string, number>();

	for (const slot of slots) {
		const dayKey = slot.startAt.slice(0, 10);
		const current = perDayCount.get(dayKey) ?? 0;
		if (current < maxPerDay) {
			selected.push(slot);
			perDayCount.set(dayKey, current + 1);
			if (selected.length >= maxSlots) {
				return selected;
			}
		}
	}

	if (selected.length < maxSlots) {
		for (const slot of slots) {
			if (!selected.some((s) => s.id === slot.id)) {
				selected.push(slot);
				if (selected.length >= maxSlots) {
					break;
				}
			}
		}
	}

	return selected.sort(
		(a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime(),
	);
}

/**
 * Queries Google Calendar FreeBusy API across Alex Patterson's calendars
 * and returns conflict-free slots during 8am-5pm PT/ET work hours.
 */
export async function getMultiCalendarAvailableSlots(
	maxSlots = 9,
	durationMinutes = 45,
	startDate?: string,
): Promise<{
	slots: AvailableCalendarSlot[];
	liveVerified: boolean;
	calendarStatuses: CalendarCheckStatus[];
}> {
	const candidates = generateDefaultCandidateSlots(
		21,
		durationMinutes,
		startDate,
	);
	if (candidates.length === 0) {
		return { slots: [], liveVerified: false, calendarStatuses: [] };
	}

	const timeMin = candidates[0].startAt;
	const timeMax = candidates[candidates.length - 1].endAt;
	const { liveVerified, busyRanges, calendarStatuses } = await fetchBusyRanges(
		timeMin,
		timeMax,
	);

	if (!liveVerified) {
		return {
			slots: spreadSlotsAcrossDays(candidates, maxSlots),
			liveVerified: false,
			calendarStatuses,
		};
	}

	const available = candidates.filter((slot) => {
		const slotStart = new Date(slot.startAt).getTime();
		const slotEnd = new Date(slot.endAt).getTime();
		return !busyRanges.some((b) => slotStart < b.endMs && slotEnd > b.startMs);
	});

	return {
		slots: spreadSlotsAcrossDays(
			available.length > 0 ? available : candidates,
			maxSlots,
		),
		liveVerified: true,
		calendarStatuses,
	};
}

/**
 * Builds a Google Calendar "Add to Calendar" template link so guests/sponsors can
 * also save the event to their own calendar in 1 click.
 */
export function buildGoogleCalendarTemplateUrl(opts: {
	title: string;
	startAt: string;
	durationMinutes: number;
	description: string;
}): string {
	const start = new Date(opts.startAt);
	const end = new Date(start.getTime() + opts.durationMinutes * 60_000);
	const fmt = (d: Date) =>
		d
			.toISOString()
			.replace(/[-:]/g, "")
			.replace(/\.\d{3}Z$/, "Z");
	const params = new URLSearchParams({
		action: "TEMPLATE",
		text: opts.title,
		dates: `${fmt(start)}/${fmt(end)}`,
		details: opts.description,
		location: "CodingCat.dev Studio (Google Calendar Invite)",
	});
	return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Creates a Google Calendar event on alex@codingcat.dev (and invites alex.patterson@gmail.com + alex@flipfeeds.com):
 * - Sponsored bookings ("sponsored" | "full-stack-launch" | "sponsor-kickoff"):
 *   Immediately creates a CONFIRMED event and sends Google Calendar invites (sendUpdates=all) to the sponsor and Alex.
 * - Editorial bookings ("editorial"):
 *   Creates a TENTATIVE calendar hold on Alex's calendar (sendUpdates=none) so the slot is reserved pending editorial approval.
 */
export async function createGoogleCalendarBookingEvent(opts: {
	guestName: string;
	guestEmail: string;
	company: string;
	track: string;
	startAt: string;
	durationMinutes?: number;
	topics: string;
	portalUrl?: string;
}): Promise<{
	eventId?: string;
	htmlLink?: string;
	addToCalendarUrl: string;
	calendarMode: "confirmed_invite" | "tentative_hold" | "template_fallback";
	conflictDetected?: boolean;
}> {
	const isEditorial = opts.track === "editorial";
	const isKickoff = opts.track === "sponsor-kickoff";
	const durationMinutes = opts.durationMinutes ?? (isKickoff ? 15 : 45);

	const start = new Date(opts.startAt);
	const end = new Date(start.getTime() + durationMinutes * 60_000);

	const summary = isKickoff
		? `[SPONSOR KICKOFF] ${opts.company} × CodingCat.dev (${opts.guestName})`
		: isEditorial
			? `[HOLD - EDITORIAL] CodingCat.dev Podcast: ${opts.guestName} (${opts.company})`
			: `[SPONSORED] CodingCat.dev Showcase: ${opts.guestName} (${opts.company})`;

	const descriptionLines = [
		`CodingCat.dev Session (${opts.track.toUpperCase()} · ${durationMinutes} min)`,
		`Guest / Contact: ${opts.guestName} <${opts.guestEmail}>`,
		`Company: ${opts.company}`,
		`Topics / Goals: ${opts.topics}`,
		isEditorial
			? "Status: Tentative Editorial Hold (Approve in Google Calendar to invite guest)"
			: "Status: Confirmed Sponsored Session",
		...(opts.portalUrl ? [`Sponsor Deal Room: ${opts.portalUrl}`] : []),
	];
	const description = descriptionLines.join("\n");

	const addToCalendarUrl = buildGoogleCalendarTemplateUrl({
		title: summary.replace(/^\[HOLD - EDITORIAL\]\s*/, ""),
		startAt: start.toISOString(),
		durationMinutes,
		description,
	});

	const accessToken = await getAccessToken();
	if (!accessToken) {
		return {
			addToCalendarUrl,
			calendarMode: "template_fallback",
		};
	}

	// Real-time conflict check across all calendars before inserting
	const { liveVerified, busyRanges } = await fetchBusyRanges(
		start.toISOString(),
		end.toISOString(),
	);
	if (liveVerified) {
		const startMs = start.getTime();
		const endMs = end.getTime();
		const hasConflict = busyRanges.some(
			(b) => startMs < b.endMs && endMs > b.startMs,
		);
		if (hasConflict) {
			return {
				addToCalendarUrl,
				calendarMode: "template_fallback",
				conflictDetected: true,
			};
		}
	}

	const sendUpdates = isEditorial ? "none" : "all";
	const status = isEditorial ? "tentative" : "confirmed";
	const attendees = [
		{ email: "alex.patterson@gmail.com" },
		{ email: "alex@codingcat.dev" },
		{ email: "alex@flipfeeds.com" },
		...(isEditorial
			? []
			: [{ email: opts.guestEmail, displayName: opts.guestName }]),
	];

	try {
		const res = await fetch(
			`https://www.googleapis.com/calendar/v3/calendars/alex%40codingcat.dev/events?sendUpdates=${sendUpdates}`,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${accessToken}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					summary,
					description,
					status,
					start: { dateTime: start.toISOString() },
					end: { dateTime: end.toISOString() },
					attendees,
				}),
			},
		);

		if (!res.ok) {
			return {
				addToCalendarUrl,
				calendarMode: "template_fallback",
			};
		}
		const event = (await res.json()) as { id?: string; htmlLink?: string };
		return {
			eventId: event.id,
			htmlLink: event.htmlLink,
			addToCalendarUrl,
			calendarMode: isEditorial ? "tentative_hold" : "confirmed_invite",
		};
	} catch {
		return {
			addToCalendarUrl,
			calendarMode: "template_fallback",
		};
	}
}
