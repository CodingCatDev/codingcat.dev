import { createClient } from "@supabase/supabase-js";
import { createClient as createSanityClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/lib/api";
import { youtubeParser } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Clients
// ---------------------------------------------------------------------------

function getSupabaseAdmin() {
  return createClient(
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

function getSanityWriteClient() {
  return createSanityClient({
    projectId,
    dataset,
    apiVersion,
    token: process.env.SANITY_API_TOKEN || process.env.SANITY_API_WRITE_TOKEN,
    perspective: "published",
    useCdn: false,
  });
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface YouTubeStatistics {
  viewCount: string;
  likeCount: string;
  favoriteCount: string;
  commentCount: string;
}

export interface YouTubeStatsRow {
  id: string;
  sanity_doc_id: string;
  sanity_doc_type: string;
  youtube_id: string;
  youtube_url: string | null;
  view_count: number;
  like_count: number;
  comment_count: number;
  favorite_count: number;
  last_fetched_at: string | null;
  last_synced_to_sanity_at: string | null;
  created_at: string;
  updated_at: string;
}

// ---------------------------------------------------------------------------
// 1. getYouTubeStats — fetch statistics from YouTube Data API v3
// ---------------------------------------------------------------------------

/**
 * Fetches YouTube video statistics for the given video IDs.
 * Batches requests in groups of 50 (YouTube API limit).
 * Returns a Map from videoId to statistics object.
 */
export async function getYouTubeStats(
  videoIds: string[]
): Promise<Map<string, YouTubeStatistics>> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    throw new Error("Missing YOUTUBE_API_KEY environment variable");
  }

  const statsMap = new Map<string, YouTubeStatistics>();
  const batchSize = 50;

  for (let i = 0; i < videoIds.length; i += batchSize) {
    const batch = videoIds.slice(i, i + batchSize);
    const ids = batch.join(",");

    const url = `https://www.googleapis.com/youtube/v3/videos?id=${ids}&key=${apiKey}&fields=items(id,statistics)&part=statistics`;

    const response = await fetch(url);
    if (!response.ok) {
      const errorBody = await response.text();
      console.error(
        `[youtube-stats] YouTube API error (status ${response.status}): ${errorBody}`
      );
      throw new Error(
        `YouTube API returned ${response.status}: ${errorBody}`
      );
    }

    const json = await response.json();
    for (const item of json.items ?? []) {
      statsMap.set(item.id, item.statistics as YouTubeStatistics);
    }
  }

  return statsMap;
}

// ---------------------------------------------------------------------------
// 2. syncSanityVideosToSupabase — discover videos from Sanity → Supabase
// ---------------------------------------------------------------------------

/**
 * Queries Sanity for all posts and podcasts that have a YouTube URL,
 * then upserts them into the `youtube_stats` Supabase table.
 * Returns the count of upserted records.
 */
export async function syncSanityVideosToSupabase(): Promise<{
  discovered: number;
  errors: number;
}> {
  const sanity = getSanityWriteClient();
  const supabase = getSupabaseAdmin();

  // Fetch all docs with a youtube field from Sanity
  const docs: Array<{
    _id: string;
    _type: string;
    youtube: string;
  }> = await sanity.fetch(
    `*[_type in ["post", "podcast"] && defined(youtube)]{_id, _type, youtube}`
  );

  console.log(`[youtube-stats] Discovered ${docs.length} docs with YouTube URLs in Sanity`);

  let discovered = 0;
  let errors = 0;

  // Upsert in batches to avoid overwhelming Supabase
  const batchSize = 200;
  for (let i = 0; i < docs.length; i += batchSize) {
    const batch = docs.slice(i, i + batchSize);
    const rows = batch
      .map((doc) => {
        const youtubeId = youtubeParser(doc.youtube);
        if (!youtubeId) {
          console.warn(
            `[youtube-stats] Could not parse YouTube ID from URL: ${doc.youtube} (doc: ${doc._id})`
          );
          errors++;
          return null;
        }
        return {
          sanity_doc_id: doc._id,
          sanity_doc_type: doc._type,
          youtube_id: youtubeId,
          youtube_url: doc.youtube,
        };
      })
      .filter(Boolean);

    if (rows.length === 0) continue;

    const { error } = await supabase.from("youtube_stats").upsert(rows, {
      onConflict: "sanity_doc_id",
      ignoreDuplicates: false,
    });

    if (error) {
      console.error(`[youtube-stats] Supabase upsert error:`, error);
      errors += rows.length;
    } else {
      discovered += rows.length;
    }
  }

  console.log(
    `[youtube-stats] Sync complete: ${discovered} upserted, ${errors} errors`
  );
  return { discovered, errors };
}

// ---------------------------------------------------------------------------
// 3. fetchAndStoreYouTubeStats — poll YouTube API → store in Supabase
// ---------------------------------------------------------------------------

/**
 * Fetches the oldest/never-fetched records from Supabase, calls the YouTube
 * API for their stats, and updates the Supabase rows.
 * Returns the count of updated records.
 */
export async function fetchAndStoreYouTubeStats(
  batchSize: number = 50
): Promise<{ fetched: number; errors: number }> {
  const supabase = getSupabaseAdmin();

  // Get the oldest-fetched (or never-fetched) records
  const { data: rows, error: queryError } = await supabase
    .from("youtube_stats")
    .select("*")
    .order("last_fetched_at", { ascending: true, nullsFirst: true })
    .limit(batchSize);

  if (queryError) {
    console.error(`[youtube-stats] Error querying Supabase:`, queryError);
    throw new Error(`Supabase query error: ${queryError.message}`);
  }

  if (!rows || rows.length === 0) {
    console.log("[youtube-stats] No records to fetch stats for");
    return { fetched: 0, errors: 0 };
  }

  console.log(`[youtube-stats] Fetching YouTube stats for ${rows.length} records`);

  // Collect unique video IDs
  const videoIds = [...new Set(rows.map((r: YouTubeStatsRow) => r.youtube_id))];

  let statsMap: Map<string, YouTubeStatistics>;
  try {
    statsMap = await getYouTubeStats(videoIds);
  } catch (err) {
    console.error("[youtube-stats] Failed to fetch YouTube stats:", err);
    throw err;
  }

  console.log(`[youtube-stats] Got stats for ${statsMap.size} videos from YouTube API`);

  let fetched = 0;
  let errors = 0;
  const now = new Date().toISOString();

  for (const row of rows as YouTubeStatsRow[]) {
    const stats = statsMap.get(row.youtube_id);
    if (!stats) {
      console.warn(
        `[youtube-stats] No stats returned for youtube_id=${row.youtube_id} (sanity_doc_id=${row.sanity_doc_id})`
      );
      // Still update last_fetched_at so we don't keep retrying immediately
      await supabase
        .from("youtube_stats")
        .update({ last_fetched_at: now })
        .eq("id", row.id);
      errors++;
      continue;
    }

    const { error: updateError } = await supabase
      .from("youtube_stats")
      .update({
        view_count: parseInt(stats.viewCount, 10) || 0,
        like_count: parseInt(stats.likeCount, 10) || 0,
        comment_count: parseInt(stats.commentCount, 10) || 0,
        favorite_count: parseInt(stats.favoriteCount, 10) || 0,
        last_fetched_at: now,
      })
      .eq("id", row.id);

    if (updateError) {
      console.error(
        `[youtube-stats] Error updating row ${row.id}:`,
        updateError
      );
      errors++;
    } else {
      fetched++;
    }
  }

  console.log(
    `[youtube-stats] Fetch complete: ${fetched} updated, ${errors} errors`
  );
  return { fetched, errors };
}

// ---------------------------------------------------------------------------
// 4. pushStatsToSanity — push updated stats from Supabase → Sanity
// ---------------------------------------------------------------------------

/**
 * Finds Supabase records where stats have been fetched but not yet synced
 * to Sanity, then patches the corresponding Sanity documents.
 * Returns the count of synced records.
 */
export async function pushStatsToSanity(
  batchSize: number = 50
): Promise<{ synced: number; errors: number }> {
  const supabase = getSupabaseAdmin();
  const sanity = getSanityWriteClient();

  // Find records that need syncing:
  // last_fetched_at is set AND (last_synced_to_sanity_at is null OR last_fetched_at > last_synced_to_sanity_at)
  // PostgREST can't compare two columns directly, so we use .rpc() with a raw SQL function.
  // Fallback: query all fetched records and filter in JS (fine for batch sizes ≤ 200).
  const { data: allFetched, error: queryError } = await supabase
    .from("youtube_stats")
    .select("*")
    .not("last_fetched_at", "is", null)
    .order("last_fetched_at", { ascending: false })
    .limit(batchSize * 2);

  if (queryError) {
    console.error(`[youtube-stats] Error querying Supabase for sync:`, queryError);
    throw new Error(`Supabase query error: ${queryError.message}`);
  }

  // Filter in JS: needs sync if never synced, or if fetched after last sync
  const rows = (allFetched ?? []).filter((row: YouTubeStatsRow) => {
    if (!row.last_synced_to_sanity_at) return true;
    return new Date(row.last_fetched_at!) > new Date(row.last_synced_to_sanity_at);
  }).slice(0, batchSize);

  if (queryError) {
    console.error(`[youtube-stats] Error querying Supabase for sync:`, queryError);
    throw new Error(`Supabase query error: ${queryError.message}`);
  }

  if (!rows || rows.length === 0) {
    console.log("[youtube-stats] No records need syncing to Sanity");
    return { synced: 0, errors: 0 };
  }

  console.log(`[youtube-stats] Pushing stats to Sanity for ${rows.length} records`);

  let synced = 0;
  let errors = 0;

  for (const row of rows as YouTubeStatsRow[]) {
    try {
      await sanity
        .patch(row.sanity_doc_id)
        .set({
          "statistics.youtube.viewCount": row.view_count,
          "statistics.youtube.likeCount": row.like_count,
          "statistics.youtube.commentCount": row.comment_count,
          "statistics.youtube.favoriteCount": row.favorite_count,
        })
        .commit({ visibility: "async" });

      // Mark as synced in Supabase
      const now = new Date().toISOString();
      const { error: updateError } = await supabase
        .from("youtube_stats")
        .update({ last_synced_to_sanity_at: now })
        .eq("id", row.id);

      if (updateError) {
        console.error(
          `[youtube-stats] Error updating sync timestamp for row ${row.id}:`,
          updateError
        );
        // The Sanity patch succeeded, so we count it but note the tracking error
        errors++;
      }

      synced++;
    } catch (err) {
      console.error(
        `[youtube-stats] Error patching Sanity doc ${row.sanity_doc_id}:`,
        err
      );
      errors++;
    }
  }

  console.log(
    `[youtube-stats] Sync to Sanity complete: ${synced} synced, ${errors} errors`
  );
  return { synced, errors };
}
