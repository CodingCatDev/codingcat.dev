"use server";

import { revalidatePath } from "next/cache";
import { dashboardClient } from "@/lib/sanity/dashboard";

export async function approveIdea(id: string) {
	if (!dashboardClient) throw new Error("Sanity client not available");
	await dashboardClient.patch(id).set({ status: "approved" }).commit();
	revalidatePath("/dashboard/content");
}

export async function rejectIdea(id: string) {
	if (!dashboardClient) throw new Error("Sanity client not available");
	await dashboardClient.patch(id).set({ status: "rejected" }).commit();
	revalidatePath("/dashboard/content");
}
