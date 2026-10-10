import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { trackClientBeaconEvent } from "@/lib/analytics";

/**
 * First-party beacon endpoint (`POST /api/event`) for zero-overhead client click
 * and LMS interaction tracking via `navigator.sendBeacon`.
 *
 * Writes directly to Cloudflare Workers Analytics Engine (`env.ANALYTICS.writeDataPoint`).
 */
export const POST: APIRoute = async ({ request }) => {
	try {
		const raw = await request.text();
		if (!raw) {
			return new Response(null, { status: 204 });
		}
		const payload = JSON.parse(raw) as {
			type?: string;
			path?: string;
			target?: string;
			label?: string;
			value?: number;
		};

		trackClientBeaconEvent({
			env: env as unknown as Record<string, unknown>,
			request,
			eventType: payload.type || "ui_interaction",
			pathname: payload.path || "/",
			target: payload.target,
			label: payload.label,
			value: typeof payload.value === "number" ? payload.value : 1,
		});
	} catch {
		// Always return 204 for beacons
	}

	return new Response(null, {
		status: 204,
		headers: {
			"cache-control": "no-store",
		},
	});
};
