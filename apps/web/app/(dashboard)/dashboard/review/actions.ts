"use server";

import { revalidatePath } from "next/cache";
import { writeClient } from "@/lib/sanity-write-client";
import { createClient } from "@/lib/supabase/server";

const ALLOWED_FIELDS = ["title", "script.hook", "script.cta"] as const;
type AllowedField = (typeof ALLOWED_FIELDS)[number];

/**
 * Verify the caller is authenticated. Fail closed — throws if auth
 * is not configured or user is not logged in.
 */
async function requireAuth(): Promise<string> {
	const hasSupabase =
		(process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL) &&
		(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
			process.env.SUPABASE_ANON_KEY);

	if (!hasSupabase) {
		throw new Error("Auth not configured");
	}

	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		throw new Error("Unauthorized — please sign in");
	}

	return user.email ?? "dashboard-user";
}

export async function approveVideo(id: string) {
	const userEmail = await requireAuth();

	if (!id || typeof id !== "string") {
		throw new Error("Invalid video ID");
	}

	await writeClient
		.patch(id)
		.set({
			status: "approved",
			reviewedAt: new Date().toISOString(),
			reviewedBy: userEmail,
		})
		.commit();

	revalidatePath("/dashboard/review");
	revalidatePath(`/dashboard/review/${id}`);
}

export async function rejectVideo(id: string, reason: string) {
	const userEmail = await requireAuth();

	if (!id || typeof id !== "string") {
		throw new Error("Invalid video ID");
	}
	if (!reason || typeof reason !== "string" || reason.trim().length === 0) {
		throw new Error("Rejection reason is required");
	}

	await writeClient
		.patch(id)
		.set({
			status: "rejected",
			flaggedReason: reason.trim(),
			reviewedAt: new Date().toISOString(),
			reviewedBy: userEmail,
		})
		.commit();

	revalidatePath("/dashboard/review");
	revalidatePath(`/dashboard/review/${id}`);
}

export async function updateVideoField(
	id: string,
	field: string,
	value: string,
) {
	await requireAuth();

	if (!id || typeof id !== "string") {
		throw new Error("Invalid video ID");
	}
	if (!ALLOWED_FIELDS.includes(field as AllowedField)) {
		throw new Error(
			`Field "${field}" is not editable. Allowed: ${ALLOWED_FIELDS.join(", ")}`,
		);
	}
	if (typeof value !== "string") {
		throw new Error("Value must be a string");
	}

	await writeClient.patch(id).set({ [field]: value }).commit();

	revalidatePath(`/dashboard/review/${id}`);
}
