# podcast-rss (vendored)

Vendored from `@codingcatdev/sanity-plugin-podcast-rss@1.0.0`.

Vendored rather than consumed from npm because the published package declares
`peerDependencies: { react: "^18", sanity: "^3" }` and carries `@sanity/ui@2`
as a **direct** dependency. Under Studio v6 that would render v2 components
inside the v4 `ThemeProvider`, handing them theme tokens they don't understand.

This copy is not optional: `schemas/documents/podcast.ts` declares a field of
`type: "podcastRssEpisode"`, which only this plugin registers. Disabling the
plugin breaks schema extraction.

Changes from upstream:
- `Menu` / `MenuButton` / `MenuItem` import from `@sanity/ui/menu` (v4 moved them off the root entry)
- `Stack`/`Select` `space=` -> `gap=` (v4 rename)
- `xml2js` -> native `DOMParser` (xml2js is a Node lib that only worked via a Vite polyfill; Vite 8 drops it)
- Controlled `<Select value=...>` instead of `<option selected>` (React 19 warns on the latter)
- Dropped the unused `useMedia` hook and the unused `useRef` in SearchResults

Upstream should be republished with widened peers; this directory can then go away.
