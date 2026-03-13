import { NextResponse } from "next/server";
import { generateInfographic, generateFromScenePrompts } from "@/lib/services/gemini-infographics";
import { getConfigValue } from "@/lib/config";

export const maxDuration = 120;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const mode = url.searchParams.get("mode") || "single";

  try {
    // Check what model name getConfigValue returns
    const configModel = await getConfigValue(
      "pipeline_config", "infographicModel", "imagen-4.0-fast-generate-001"
    );
    console.log("[test-imagen] Config model:", configModel);

    if (mode === "config") {
      return NextResponse.json({ configModel });
    }

    if (mode === "batch") {
      // Test the actual generateFromScenePrompts path with 2 prompts
      const result = await generateFromScenePrompts(
        [
          "Infographic 2D architecture style, black background. A simple server rack. Highlighted elements filled with #15b27b.",
          "Infographic 2D architecture style, black background. A cloud with arrows. Highlighted elements filled with #15b27b.",
        ],
        "Test Topic"
      );
      return NextResponse.json({
        success: true,
        horizontal: result.horizontal.length,
        vertical: result.vertical.length,
        errors: result.errors,
      });
    }

    // Single test
    const result = await generateInfographic({
      prompt: "Infographic 2D architecture style, black background. A simple server rack. Highlighted elements filled with #15b27b.",
      aspectRatio: "16:9",
    });
    return NextResponse.json({
      success: true,
      mimeType: result.mimeType,
      imageSize: result.imageBase64.length,
      configModel,
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
