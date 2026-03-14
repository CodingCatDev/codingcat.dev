"use server";

import { revalidatePath } from "next/cache";
import { dashboardClient } from "@/lib/sanity/dashboard";

export async function updateLeadStatus(id: string, status: string) {
	if (!dashboardClient) throw new Error("Sanity client not available");
	await dashboardClient.patch(id).set({ status }).commit();
	revalidatePath("/dashboard/sponsors");
}
