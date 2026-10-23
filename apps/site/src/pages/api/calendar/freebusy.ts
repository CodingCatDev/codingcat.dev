import type { APIRoute } from "astro";
import {
	CODINGCAT_CALENDAR_IDS,
	getMultiCalendarAvailableSlots,
} from "@/lib/google-calendar";

export const GET: APIRoute = async ({ request, url }) => {
	const reqUrl = url ?? new URL(request.url);
	const max = Number(reqUrl.searchParams.get("limit") || 9);
	const rawDuration = Number(reqUrl.searchParams.get("duration") || 45);
	const durationMinutes = rawDuration === 15 ? 15 : 45;

	const { slots, liveVerified, calendarStatuses } =
		await getMultiCalendarAvailableSlots(
			Math.min(18, Math.max(3, max)),
			durationMinutes,
		);

	return new Response(
		JSON.stringify({
			success: true,
			liveVerified,
			durationMinutes,
			checkedCalendars: CODINGCAT_CALENDAR_IDS,
			calendarStatuses,
			workHoursPolicy:
				"8:00 AM - 5:00 PM PT / ET Overlap (11:00 AM - 5:00 PM ET)",
			slots,
		}),
		{
			status: 200,
			headers: { "Content-Type": "application/json" },
		},
	);
};
