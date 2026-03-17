/**
 * Sanity Visual Editing (Plain JS).
 * Loaded only when visual editing is enabled; integrates with History API for Presentation tool.
 */
import { enableVisualEditing } from "@sanity/visual-editing";

export function run(): () => void {
  return enableVisualEditing({
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
  });
}
