"use server";

import { revalidatePath } from "next/cache";
import { writeClient } from "@/lib/sanity-write-client";

const ALLOWED_FIELDS = ["title", "script.hook", "script.cta"] as const;
type AllowedField = (typeof ALLOWED_FIELDS)[number];

export async function approveVideo(id: string) {
  if (!id || typeof id !== "string") {
    throw new Error("Invalid video ID");
  }

  await writeClient
    .patch(id)
    .set({
      status: "approved",
      reviewedAt: new Date().toISOString(),
      reviewedBy: "dashboard-user",
    })
    .commit();

  revalidatePath("/dashboard/review");
  revalidatePath(`/dashboard/review/${id}`);
}

export async function rejectVideo(id: string, reason: string) {
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
      reviewedBy: "dashboard-user",
    })
    .commit();

  revalidatePath("/dashboard/review");
  revalidatePath(`/dashboard/review/${id}`);
}

export async function updateVideoField(
  id: string,
  field: string,
  value: string
) {
  if (!id || typeof id !== "string") {
    throw new Error("Invalid video ID");
  }
  if (!ALLOWED_FIELDS.includes(field as AllowedField)) {
    throw new Error(
      `Field "${field}" is not editable. Allowed: ${ALLOWED_FIELDS.join(", ")}`
    );
  }
  if (typeof value !== "string") {
    throw new Error("Value must be a string");
  }

  await writeClient.patch(id).set({ [field]: value }).commit();

  revalidatePath(`/dashboard/review/${id}`);
}
