/**
 * A person appearing on an episode. Multi-guest bookings store these in
 * `booking.guests[]`; older single-guest bookings keep one guest in the
 * top-level `guestName` / `guestEmail` / `signature*` fields, which
 * `resolvePortalGuests` maps to a single entry with `_key: "primary"`.
 */
export interface PortalGuest {
	_key: string;
	name: string;
	email: string;
	guestSlug?: string;
	guestDocId?: string;
	signatureMode?: string;
	signatureData?: string;
	signedAt?: string;
}

export const PRIMARY_GUEST_KEY = "primary";

export function hasGuestList(
	booking: Record<string, any> | null | undefined,
): boolean {
	return Array.isArray(booking?.guests) && booking.guests.length > 0;
}

export function resolvePortalGuests(
	booking: Record<string, any> | null | undefined,
	lead?: Record<string, any> | null,
): PortalGuest[] {
	if (hasGuestList(booking)) {
		return (booking?.guests as Array<Record<string, any>>)
			.filter((g) => g?._key && g?.email)
			.map((g) => ({
				_key: g._key,
				name: g.name || g.email,
				email: String(g.email).trim().toLowerCase(),
				guestSlug: g.guestSlug,
				guestDocId: g.guestDocId,
				signatureMode: g.signatureMode,
				signatureData: g.signatureData,
				signedAt: g.signedAt,
			}));
	}

	const email = (booking?.guestEmail || lead?.contactEmail || "")
		.trim()
		.toLowerCase();
	const name = booking?.guestName || lead?.contactName || "";
	if (!email && !name) {
		return [];
	}
	return [
		{
			_key: PRIMARY_GUEST_KEY,
			name: name || email,
			email,
			guestSlug: booking?.guestSlug || lead?.guestSlug,
			guestDocId: booking?.guestDocId || lead?.guestDocId,
			signatureMode: booking?.signatureMode,
			signatureData: booking?.signatureData,
			signedAt: booking?.signedAt,
		},
	];
}

export function findGuestByEmail(
	guests: PortalGuest[],
	email?: string | null,
): PortalGuest | undefined {
	const clean = (email || "").trim().toLowerCase();
	if (!clean) {
		return undefined;
	}
	return guests.find((g) => g.email === clean);
}
