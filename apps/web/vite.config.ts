import path from "node:path";
import { defineConfig } from "vite";
import vinext from "vinext";
import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  plugins: [
    vinext(),
    cloudflare({
      viteEnvironment: { name: "rsc", childEnvironments: ["ssr"] },
    }),
  ],
  resolve: {
    alias: {
      // Remotion Lambda uses node:process; Workers doesn't support it. Stub so dev starts.
      "@remotion/lambda/client": path.resolve(__dirname, "lib/remotion-lambda-stub.ts"),
      "@remotion/lambda-client": path.resolve(__dirname, "lib/remotion-lambda-stub.ts"),
    },
  },
  ssr: {
    external: ["@remotion/lambda", "@remotion/lambda-client"],
  },
});
