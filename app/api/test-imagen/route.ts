import { NextResponse } from "next/server";
import { generateInfographic } from "@/lib/services/gemini-infographics";

export const maxDuration = 60;

export async function GET() {
  try {
    console.log("[test-imagen] Starting test...");
    const result = await generateInfographic({
      prompt: "Infographic 2D architecture style, black background. A simple server rack. Highlighted elements filled with #15b27b.",
      aspectRatio: "16:9",
    });
    return NextResponse.json({
      success: true,
      mimeType: result.mimeType,
      imageSize: result.imageBase64.length,
    });
  } catch (err) {
    console.error("[test-imagen] Error:", err);
    return NextResponse.json({
      success: false,
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack?.split("\n").slice(0, 5) : undefined,
    }, { status: 500 });
  }
}
