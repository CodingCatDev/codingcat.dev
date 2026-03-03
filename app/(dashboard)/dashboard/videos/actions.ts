"use server";

import { revalidatePath } from "next/cache";
import { dashboardClient } from "@/lib/sanity/dashboard";

export async function regenerateScript(id: string) {
	await dashboardClient.patch(id).set({ status: "draft" }).commit();
	revalidatePath("/dashboard/videos");
}

export async function retryRender(id: string) {
	await dashboardClient.patch(id).set({ status: "video_gen" }).commit();
	revalidatePath("/dashboard/videos");
}

export async function publishAnyway(id: string) {
	await dashboardClient
		.patch(id)
		.set({ status: "published" })
		.unset(["flaggedReason"])
		.commit();
	revalidatePath("/dashboard/videos");
}
