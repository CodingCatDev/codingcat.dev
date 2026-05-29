/**
 * Remotion entry point for the CodingCat.dev video pipeline.
 *
 * This module exports the RemotionRoot component which registers
 * all video compositions (MainVideo 16:9 and ShortVideo 9:16).
 *
 * Usage:
 *   - Remotion Studio: point `remotion.config.ts` entryPoint to this file
 *   - Programmatic render: import RemotionRoot and use with @remotion/renderer
 */

export { RemotionRoot } from "./Root";
export type {
  VideoInputProps,
  SceneData,
  SponsorData,
  SceneProps,
  HookSceneProps,
  CTASceneProps,
  SponsorSlotProps,
} from "./types";
export { videoInputPropsSchema, sceneDataSchema, sponsorDataSchema } from "./types";
export {
  FPS,
  MAIN_WIDTH,
  MAIN_HEIGHT,
  SHORT_WIDTH,
  SHORT_HEIGHT,
  COLORS,
  FONT_SIZES,
  ANIMATION,
  BRAND,
} from "./constants";
