/**
 * Sanity Visual Editing (Plain JS) — minimal integration per official docs.
 * https://reference.sanity.io/_sanity/visual-editing/
 *
 * History update uses pushState/replaceState only so the Studio can drive
 * iframe navigation (e.g. by loading the preview URL when you click locations).
 * We only handle presentation/perspective so perspective switches reload with the right param.
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
            break;
          case "pop":
            window.history.back();
            break;
          case "replace":
            window.history.replaceState(null, "", update.url);
            break;
          default:
            throw new Error(`Unknown update type: ${(update as { type: string }).type}`);
        }
      },
    },
    zIndex: 1000,
    // Let default behavior apply: manual = reload, mutation = no default for Plain JS
    refresh: async (payload) => {
      if (payload.source === "manual") {
        window.location.reload();
      }
      // source === 'mutation': no default for Plain JS per docs; don't reload unless you want to
    },
  });

  return () => {
    teardownPerspective();
    teardownVisualEditing();
  };
}
