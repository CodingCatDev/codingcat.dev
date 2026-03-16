/**
 * Sanity CLI config for the web app (typegen only).
 * Uses committed ./sanity/extract.json. Run typegen to generate ./sanity/types.ts from sanity/lib/queries.ts.
 * @see https://www.sanity.io/docs/apis-and-sdks/sanity-typegen
 */
import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  typegen: {
    path: "./**/*.{ts,tsx,js,jsx}",
    schema: "./sanity/extract.json",
    generates: "./sanity/types.ts",
  },
});
