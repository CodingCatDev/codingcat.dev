export const fetchCache = "force-no-store";

import type { NextRequest } from "next/server";
import {
  syncSanityVideosToSupabase,
  fetchAndStoreYouTubeStats,
  pushStatsToSanity,
} from "@/lib/youtube-stats";

export async function POST(request: NextRequest) {
  // Authenticate via CRON_SECRET
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    console.error("[YOUTUBE] Unauthorized request: invalid authorization header");
    return new Response("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  try {
    console.log(`[YOUTUBE] POST handler started (action=${action ?? "all"})`);

    const results: Record<string, unknown> = {};

    // Phase 1: Discover — sync Sanity videos to Supabase registry
    if (!action || action === "discover") {
      console.log("[YOUTUBE] Running discover phase...");
      results.discover = await syncSanityVideosToSupabase();
    }

    // Phase 2: Fetch — poll YouTube API and store stats in Supabase
    if (!action || action === "fetch") {
      console.log("[YOUTUBE] Running fetch phase...");
      results.fetch = await fetchAndStoreYouTubeStats();
    }

    // Phase 3: Sync — push updated stats from Supabase to Sanity
    if (!action || action === "sync") {
      console.log("[YOUTUBE] Running sync phase...");
      results.sync = await pushStatsToSanity();
    }

    console.log("[YOUTUBE] Completed successfully", results);
    return Response.json({ success: true, ...results });
  } catch (error) {
    console.error("[YOUTUBE] Unexpected error:", error);
    return Response.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
