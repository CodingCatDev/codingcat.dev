"use server";

import { revalidatePath } from "next/cache";
import { dashboardClient } from "@/lib/sanity/dashboard";

export async function updateLeadStatus(id: string, status: string) {
	await dashboardClient.patch(id).set({ status }).commit();
	revalidatePath("/dashboard/sponsors");
}
