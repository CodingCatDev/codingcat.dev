import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { writeClient } from "@/lib/sanity-write-client";

export const dynamic = "force-dynamic";

async function requireAuth() {
  const hasSupabase =
    (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL) &&
    (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY);

  if (!hasSupabase) {
    return {
      error: NextResponse.json(
        { error: "Auth not configured" },
        { status: 503 }
      ),
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  return { user };
}

export async function POST(request: Request) {
  const auth = await requireAuth();
  if ("error" in auth && auth.error) return auth.error;

  try {
    const body = await request.json();

    // Validate input
    const { videoId, action, reason } = body;

    if (!videoId || typeof videoId !== "string") {
      return NextResponse.json(
        { error: "videoId is required and must be a string" },
        { status: 400 }
      );
    }

    if (action !== "approve" && action !== "reject") {
      return NextResponse.json(
        { error: "action must be 'approve' or 'reject'" },
        { status: 400 }
      );
    }

    if (action === "reject" && (!reason || typeof reason !== "string" || !reason.trim())) {
      return NextResponse.json(
        { error: "reason is required for rejection" },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();

    if (action === "approve") {
      await writeClient
        .patch(videoId)
        .set({
          status: "approved",
          reviewedAt: now,
          reviewedBy: auth.user?.email || "dashboard-user",
        })
        .commit();

      // Fire webhook to CF Workflow if configured
      const cfWorkersUrl = process.env.CF_WORKERS_URL;
      if (cfWorkersUrl) {
        try {
          await fetch(cfWorkersUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              workflowId: videoId,
              action: "approved",
            }),
          });
        } catch (webhookErr) {
          // Log but don't fail the approval
          console.error("[review-api] CF Workflow webhook failed:", webhookErr);
        }
      }

      return NextResponse.json({ success: true, status: "approved" });
    }

    // Reject
    await writeClient
      .patch(videoId)
      .set({
        status: "rejected",
        flaggedReason: reason.trim(),
        reviewedAt: now,
        reviewedBy: auth.user?.email || "dashboard-user",
      })
      .commit();

    return NextResponse.json({ success: true, status: "rejected" });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to process review" },
      { status: 500 }
    );
  }
}
