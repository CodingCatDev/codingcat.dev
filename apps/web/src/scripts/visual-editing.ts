/**
 * Sanity Visual Editing (Plain JS).
 * Loaded only when visual editing is enabled; integrates with History API for Presentation tool.
 * Listens for presentation/perspective postMessages so switching perspective in Studio reloads
 * the preview with the correct sanity-preview-perspective URL param (outer context URL change
 * is not reflected in the iframe, so we must handle the message).
 */
import { enableVisualEditing } from "@sanity/visual-editing";

function subscribeToPerspectiveChanges(): () => void {
  const studioOrigin =
    typeof import.meta.env.PUBLIC_SANITY_STUDIO_URL === "string"
      ? new URL(import.meta.env.PUBLIC_SANITY_STUDIO_URL).origin
      : null;

  const handler = (event: MessageEvent) => {
    if (studioOrigin && event.origin !== studioOrigin) return;
    const type = event.data?.type;
    const data = event.data?.data;
    if (type !== "presentation/perspective" || data == null) return;

    const perspective = data.perspective;
    if (perspective == null) return;

    const value =
      typeof perspective === "string"
        ? perspective
        : Array.isArray(perspective)
          ? perspective.join(",")
          : String(perspective);

    const url = new URL(window.location.href);
    url.searchParams.set("sanity-preview-perspective", value);
    window.location.replace(url.toString());
  };

  window.addEventListener("message", handler);
  return () => window.removeEventListener("message", handler);
}

export function run(): () => void {
  const teardownPerspective = subscribeToPerspectiveChanges();

  const teardownVisualEditing = enableVisualEditing({
    history: {
      subscribe: (navigate) => {
        const handler = (_event: PopStateEvent) => {
          navigate({
            type: "push",
            url: `${location.pathname}${location.search}`,
          });
        };
        window.addEventListener("popstate", handler);
        return () => window.removeEventListener("popstate", handler);
      },
      update: (update) => {
        switch (update.type) {
          case "push":
            window.history.pushState(null, "", update.url);
            // Reload so the new URL (e.g. perspective param) is loaded and server fetches correct data
            window.location.reload();
            break;
          case "pop":
            window.history.back();
            break;
          case "replace":
            window.history.replaceState(null, "", update.url);
            window.location.reload();
            break;
          default:
            throw new Error(`Unknown update type: ${(update as { type: string }).type}`);
        }
      },
    },
    zIndex: 1000,
    refresh: async (payload) => {
      // Reload preview when user clicks Refresh or when a document is saved in Studio
      if (payload.source === "manual" || payload.source === "mutation") {
        window.location.reload();
      }
    },
  });

  return () => {
    teardownPerspective();
    teardownVisualEditing();
  };
}
