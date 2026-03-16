/**
 * Stub for @remotion/lambda/client in Cloudflare Workers (no node:process).
 * Aliased in vite.config so the Worker bundle doesn't pull in Node deps.
 * Cron/remotion routes need a Node runtime in production.
 */
const msg =
  "Remotion Lambda is not available in this runtime (Workers). Run the cron/remotion pipeline in a Node environment.";

export const renderMediaOnLambda = async () => {
  throw new Error(msg);
};
export const getRenderProgress = async () => {
  throw new Error(msg);
};
export type AwsRegion = string;
