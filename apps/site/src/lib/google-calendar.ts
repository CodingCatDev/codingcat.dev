import { env } from "cloudflare:workers";
import { getSanityServerClient } from "@/lib/sanity/write-client";

export const STREAMYARD_STUDIO_URL = "https://streamyard.com/c4kv26is93";

export const CODINGCAT_CALENDAR_IDS = ["alex@codingcat.dev"];

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
	// Prefer GOOGLE_WORKSPACE_REFRESH_TOKEN (alex@codingcat.dev) so all bookings and FreeBusy
	// checks operate under the CodingCat.dev workspace account and never expose personal emails.
	const refreshToken =
		refreshTokenOverride ||
		workerEnv.GOOGLE_WORKSPACE_REFRESH_TOKEN ||
		process.env.GOOGLE_WORKSPACE_REFRESH_TOKEN ||
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

	// Also subtract active Sanity booking holds & pre-meetings so placeholders
	// immediately block slots even before Google Calendar FreeBusy propagation.
	try {
		const { client } = getSanityServerClient();
		const heldBookings = await client.fetch<
			Array<{
				slotStartAt?: string;
				preMeetingSlotStartAt?: string;
				sessionType?: string;
				track?: string;
			}>
		>(
			`*[_type == "booking" && status != "cancelled" && (defined(slotStartAt) || defined(preMeetingSlotStartAt))]{
				slotStartAt,
				preMeetingSlotStartAt,
				sessionType,
				track
			}`,
		);
		for (const b of heldBookings || []) {
			if (b.slotStartAt) {
				const startMs = new Date(b.slotStartAt).getTime();
				const dur =
					b.sessionType === "pre-meeting-15m" || b.track === "sponsor-kickoff"
						? 15
						: 45;
				if (!Number.isNaN(startMs)) {
					busyRanges.push({ startMs, endMs: startMs + dur * 60_000 });
				}
			}
			if (b.preMeetingSlotStartAt) {
				const preStartMs = new Date(b.preMeetingSlotStartAt).getTime();
				if (!Number.isNaN(preStartMs)) {
					busyRanges.push({
						startMs: preStartMs,
						endMs: preStartMs + 15 * 60_000,
					});
				}
			}
		}
	} catch {
		// Non-fatal fallback to Google Calendar busyRanges
	}

	if (!liveVerified && busyRanges.length === 0) {
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
 * Creates a Google Calendar event exclusively on alex@codingcat.dev:
 * - 15-minute Pre-Meetings ("pre-meeting-15m" | "sponsor-kickoff"):
 *   Immediately creates a CONFIRMED, OPAQUE (Busy) event with an auto-generated Google Meet room
 *   (conferenceDataVersion=1) and sends invites (sendUpdates=all) to the guest and alex@codingcat.dev.
 * - 60-minute Recording Sessions ("recording-60m"):
 *   Immediately creates a CONFIRMED, OPAQUE (Busy) calendar hold on alex@codingcat.dev and sends
 *   the calendar hold invite to the guest (sendUpdates=all) so it lands on their calendar right away,
 *   while withholding https://streamyard.com/c4kv26is93 until approved in the Ops App.
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
	isPreMeeting?: boolean;
	autoApproveRecording?: boolean;
}): Promise<{
	eventId?: string;
	htmlLink?: string;
	meetUrl?: string;
	recordingUrl: string;
	addToCalendarUrl: string;
	calendarMode: "confirmed_invite" | "tentative_hold" | "template_fallback";
	conflictDetected?: boolean;
}> {
	const isPreMeeting =
		Boolean(opts.isPreMeeting) ||
		opts.track === "sponsor-kickoff" ||
		opts.durationMinutes === 15;
	const durationMinutes = opts.durationMinutes ?? (isPreMeeting ? 15 : 60);
	const isApprovedRecording =
		!isPreMeeting && Boolean(opts.autoApproveRecording);

	const start = new Date(opts.startAt);
	const end = new Date(start.getTime() + durationMinutes * 60_000);

	const summary = isPreMeeting
		? `[PRE-MEETING · 15m] ${opts.company} × CodingCat.dev (${opts.guestName})`
		: isApprovedRecording
			? `CodingCat.dev Podcast Recording: ${opts.guestName} (${opts.company})`
			: `[HOLD] CodingCat.dev Podcast: ${opts.guestName} (${opts.company})`;

	const descriptionLines = [
		`CodingCat.dev Session (${isPreMeeting ? "15m Pre-Meeting (Google Meet)" : `${durationMinutes}m Podcast Recording (${opts.track.toUpperCase()})`})`,
		`Guest / Contact: ${opts.guestName} <${opts.guestEmail}>`,
		`Company: ${opts.company}`,
		`Topics / Goals: ${opts.topics}`,
		isPreMeeting
			? "Meeting Room: Google Meet (auto-attached to this calendar invite)"
			: isApprovedRecording
				? `Recording Studio (StreamYard): ${STREAMYARD_STUDIO_URL}`
				: "Status: Calendar Hold Reserved. Once Alex confirms your session, this calendar invite will automatically update with your StreamYard studio link.",
		...(opts.portalUrl
			? [`Guest Portal & Sanity Media Vault: ${opts.portalUrl}#vault`]
			: []),
	];
	const description = descriptionLines.join("\n");

	const addToCalendarUrl = buildGoogleCalendarTemplateUrl({
		title: summary.replace(/^\[HOLD\]\s*/, ""),
		startAt: start.toISOString(),
		durationMinutes,
		description: isPreMeeting
			? description
			: [
					`CodingCat.dev Podcast Recording (${durationMinutes} min)`,
					`Guest: ${opts.guestName} (${opts.company})`,
					...(opts.portalUrl ? [`Deal Room & Asset Vault: ${opts.portalUrl}#vault`] : []),
				].join("\n"),
	});

	const accessToken = await getAccessToken();
	if (!accessToken) {
		return {
			recordingUrl: STREAMYARD_STUDIO_URL,
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
				recordingUrl: STREAMYARD_STUDIO_URL,
				addToCalendarUrl,
				calendarMode: "template_fallback",
				conflictDetected: true,
			};
		}
	}

	// Always invite the guest immediately (sendUpdates=all) on alex@codingcat.dev so the event
	// lands on their Google Calendar right away without exposing any personal email address.
	const sendUpdates = "all";
	const attendees = [
		{ email: "alex@codingcat.dev", displayName: "Alex Patterson", responseStatus: "accepted" },
		{ email: opts.guestEmail, displayName: opts.guestName },
	];

	const queryParams = new URLSearchParams({ sendUpdates });
	if (isPreMeeting) {
		queryParams.set("conferenceDataVersion", "1");
	}

	const eventBody: Record<string, unknown> = {
		summary,
		description,
		// Always "confirmed" + "opaque" so FreeBusy blocks this slot on alex@codingcat.dev!
		status: "confirmed",
		transparency: "opaque",
		location: isPreMeeting
			? "Google Meet"
			: isApprovedRecording
				? STREAMYARD_STUDIO_URL
				: opts.portalUrl
					? `${opts.portalUrl}#vault`
					: "CodingCat.dev Studio (StreamYard link sent upon approval)",
		start: { dateTime: start.toISOString() },
		end: { dateTime: end.toISOString() },
		attendees,
	};

	if (isPreMeeting) {
		eventBody.conferenceData = {
			createRequest: {
				requestId: `cc-meet-${crypto.randomUUID().slice(0, 12)}`,
				conferenceSolutionKey: { type: "hangoutsMeet" },
			},
		};
	}

	try {
		const res = await fetch(
			`https://www.googleapis.com/calendar/v3/calendars/alex%40codingcat.dev/events?${queryParams.toString()}`,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${accessToken}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(eventBody),
			},
		);

		if (!res.ok) {
			return {
				recordingUrl: STREAMYARD_STUDIO_URL,
				addToCalendarUrl,
				calendarMode: "template_fallback",
			};
		}
		const event = (await res.json()) as {
			id?: string;
			htmlLink?: string;
			hangoutLink?: string;
			conferenceData?: {
				entryPoints?: Array<{ entryPointType?: string; uri?: string }>;
			};
		};
		const meetUrl =
			event.hangoutLink ||
			event.conferenceData?.entryPoints?.find(
				(e) => e.entryPointType === "video",
			)?.uri;
		return {
			eventId: event.id,
			htmlLink: event.htmlLink,
			meetUrl,
			recordingUrl: STREAMYARD_STUDIO_URL,
			addToCalendarUrl,
			calendarMode:
				isPreMeeting || isApprovedRecording
					? "confirmed_invite"
					: "tentative_hold",
		};
	} catch {
		return {
			recordingUrl: STREAMYARD_STUDIO_URL,
			addToCalendarUrl,
			calendarMode: "template_fallback",
		};
	}
}

/**
 * Upgrades an existing opaque calendar hold on alex@codingcat.dev to an approved
 * recording invite: reveals https://streamyard.com/c4kv26is93, adds the guest as an
 * attendee, and triggers Google Calendar email notifications (sendUpdates=all).
 */
export async function approveGoogleCalendarRecordingEvent(opts: {
	eventId?: string;
	guestName: string;
	guestEmail: string;
	company: string;
	track: string;
	startAt: string;
	durationMinutes?: number;
	topics: string;
	portalUrl?: string;
}): Promise<{
	ok: boolean;
	eventId?: string;
	htmlLink?: string;
	recordingUrl: string;
}> {
	const accessToken = await getAccessToken();
	if (!accessToken) {
		return { ok: false, recordingUrl: STREAMYARD_STUDIO_URL };
	}

	const durationMinutes = opts.durationMinutes ?? 60;
	const start = new Date(opts.startAt);
	const end = new Date(start.getTime() + durationMinutes * 60_000);
	const summary = `CodingCat.dev Podcast Recording: ${opts.guestName} (${opts.company})`;
	const description = [
		`CodingCat.dev Podcast Recording (${durationMinutes} min)`,
		`Recording Studio (StreamYard): ${STREAMYARD_STUDIO_URL}`,
		`Guest / Contact: ${opts.guestName} <${opts.guestEmail}>`,
		`Company: ${opts.company}`,
		`Topics: ${opts.topics}`,
		...(opts.portalUrl
			? [`Deal Room & Sanity Media Vault: ${opts.portalUrl}#vault`]
			: []),
	].join("\n");

	const payload = {
		summary,
		description,
		location: STREAMYARD_STUDIO_URL,
		status: "confirmed",
		transparency: "opaque",
		start: { dateTime: start.toISOString() },
		end: { dateTime: end.toISOString() },
		attendees: [
			{ email: "alex@codingcat.dev", displayName: "Alex Patterson", responseStatus: "accepted" },
			{ email: opts.guestEmail, displayName: opts.guestName },
		],
	};

	try {
		if (opts.eventId) {
			const patchRes = await fetch(
				`https://www.googleapis.com/calendar/v3/calendars/alex%40codingcat.dev/events/${encodeURIComponent(opts.eventId)}?sendUpdates=all`,
				{
					method: "PATCH",
					headers: {
						Authorization: `Bearer ${accessToken}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify(payload),
				},
			);
			if (patchRes.ok) {
				const updated = (await patchRes.json()) as {
					id?: string;
					htmlLink?: string;
				};
				return {
					ok: true,
					eventId: updated.id || opts.eventId,
					htmlLink: updated.htmlLink,
					recordingUrl: STREAMYARD_STUDIO_URL,
				};
			}
		}

		// Fallback: create a fresh confirmed recording event if no prior eventId existed
		const postRes = await fetch(
			"https://www.googleapis.com/calendar/v3/calendars/alex%40codingcat.dev/events?sendUpdates=all",
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${accessToken}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			},
		);
		if (!postRes.ok) {
			return { ok: false, recordingUrl: STREAMYARD_STUDIO_URL };
		}
		const created = (await postRes.json()) as {
			id?: string;
			htmlLink?: string;
		};
		return {
			ok: true,
			eventId: created.id,
			htmlLink: created.htmlLink,
			recordingUrl: STREAMYARD_STUDIO_URL,
		};
	} catch {
		return { ok: false, recordingUrl: STREAMYARD_STUDIO_URL };
	}
}
