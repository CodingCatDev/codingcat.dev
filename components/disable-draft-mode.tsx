"use client";

import { useDraftModeEnvironment } from "next-sanity/hooks";

export function DisableDraftMode() {
  const environment = useDraftModeEnvironment();

  // Only show the disable draft mode button when outside of Presentation Tool
  if (environment !== "live" && environment !== "unknown") {
    return null;
  }

  return (
    <a
      href="/api/draft-mode/disable"
      className="fixed bottom-4 right-4 bg-red-500 text-white rounded-md hover:bg-red-600 px-4 py-2"
    >
      Disable Draft Mode
    </a>
  );
}