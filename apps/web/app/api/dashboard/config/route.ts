import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getEngineConfig, invalidateEngineConfig } from "@/lib/config";
import { writeClient } from "@/lib/sanity-write-client";

export const dynamic = "force-dynamic";

const CONFIG_DOC_ID = "engineConfig";

// Whitelist of fields that can be updated via the API
const ALLOWED_FIELDS = new Set([
  "autoPublish",
  "qualityThreshold",
  "reviewTimeoutDays",
  "maxIdeasPerRun",
  "longFormPerWeek",
  "shortsPerDay",
  "blogsPerWeek",
  "publishDays",
  "contentCategories",
  "geminiModel",
  "infographicModel",
  "systemInstruction",
  "youtubeEnabled",
  "twitterEnabled",
  "linkedinEnabled",
  "tiktokEnabled",
  "instagramEnabled",
  "blueskyEnabled",
  "youtubeUploadVisibility",
  "notificationEmails",
  "cooldownDays",
  "rateCardTiers",
  "maxOutreachPerRun",
  "brandPrimary",
  "brandBackground",
  "brandText",
]);

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

export async function GET() {
  const auth = await requireAuth();
  if ("error" in auth && auth.error) return auth.error;

  try {
    const config = await getEngineConfig();
    return NextResponse.json(config);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch config" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const auth = await requireAuth();
  if ("error" in auth && auth.error) return auth.error;

  try {
    const body = await request.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    // Filter to only allowed fields
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(body)) {
      if (ALLOWED_FIELDS.has(key)) {
        sanitized[key] = value;
      }
    }

    if (Object.keys(sanitized).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    // Validate specific field types
    if ("qualityThreshold" in sanitized) {
      const v = Number(sanitized.qualityThreshold);
      if (!Number.isFinite(v) || v < 0 || v > 100) {
        return NextResponse.json(
          { error: "qualityThreshold must be between 0 and 100" },
          { status: 400 }
        );
      }
      sanitized.qualityThreshold = v;
    }

    if ("publishDays" in sanitized) {
      const validDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      if (
        !Array.isArray(sanitized.publishDays) ||
        !sanitized.publishDays.every(
          (d: unknown) => typeof d === "string" && validDays.includes(d as string)
        )
      ) {
        return NextResponse.json(
          { error: "publishDays must be an array of valid day abbreviations" },
          { status: 400 }
        );
      }
    }

    if ("rateCardTiers" in sanitized) {
      if (!Array.isArray(sanitized.rateCardTiers)) {
        return NextResponse.json(
          { error: "rateCardTiers must be an array" },
          { status: 400 }
        );
      }
      // Ensure _key on each tier for Sanity arrays
      sanitized.rateCardTiers = (sanitized.rateCardTiers as any[]).map(
        (tier, i) => ({
          _key: tier._key || `tier-${i}`,
          _type: "rateCardTier",
          name: String(tier.name || ""),
          description: String(tier.description || ""),
          price: Number(tier.price || 0),
        })
      );
    }

    if ("autoPublish" in sanitized) {
      sanitized.autoPublish = Boolean(sanitized.autoPublish);
    }

    // Patch the singleton
    await writeClient
      .patch(CONFIG_DOC_ID)
      .set(sanitized)
      .commit();

    // Invalidate the in-memory cache
    invalidateEngineConfig();

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to update config" },
      { status: 500 }
    );
  }
}
