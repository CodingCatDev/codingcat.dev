import React from "react";
import { AbsoluteFill, Audio, Sequence } from "remotion";
import type { VideoInputProps } from "../types";
import {
  DEFAULT_CTA_DURATION,
  DEFAULT_HOOK_DURATION,
  DEFAULT_SPONSOR_DURATION,
  FPS,
  SPONSOR_INSERT_SECONDS,
} from "../constants";
import { HookScene } from "../components/HookScene";
import { SceneRouter } from "../components/SceneRouter";
import { CTAScene } from "../components/CTAScene";
import { SponsorSlot } from "../components/SponsorSlot";

export const MainVideo: React.FC<VideoInputProps> = ({
  audioUrl,
  audioDurationInSeconds,
  hook,
  scenes,
  cta,
  sponsor,
  hookDurationInFrames,
  ctaDurationInFrames,
  sponsorDurationInFrames,
}) => {
  const hookDuration = hookDurationInFrames ?? DEFAULT_HOOK_DURATION;
  const ctaDuration = ctaDurationInFrames ?? DEFAULT_CTA_DURATION;
  const sponsorDuration = sponsor
    ? (sponsorDurationInFrames ?? DEFAULT_SPONSOR_DURATION)
    : 0;

  const totalFrames = Math.ceil(audioDurationInSeconds * FPS);

  // Calculate how many frames are available for content scenes
  const scenesAvailableFrames = totalFrames - hookDuration - ctaDuration;

  // Distribute scene frames evenly across all scenes
  const perSceneFrames = Math.max(
    FPS, // minimum 1 second per scene
    Math.floor(scenesAvailableFrames / scenes.length)
  );

  // Sponsor insertion point in frames (~15s mark)
  const sponsorInsertFrame = SPONSOR_INSERT_SECONDS * FPS;

  // Build the sequence timeline
  let currentFrame = 0;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* Audio track — plays for the entire composition */}
      <Audio src={audioUrl} />

      {/* Hook Scene */}
      <Sequence from={currentFrame} durationInFrames={hookDuration} name="Hook">
        <HookScene hook={hook} durationInFrames={hookDuration} isVertical={false} />
      </Sequence>
      {(() => {
        currentFrame += hookDuration;
        return null;
      })()}

      {/* Content Scenes */}
      {scenes.map((scene, index) => {
        const sceneStart = hookDuration + index * perSceneFrames;
        return (
          <Sequence
            key={`scene-${index}`}
            from={sceneStart}
            durationInFrames={perSceneFrames}
            name={`Scene ${index + 1}`}
          >
            <SceneRouter
              scene={scene}
              sceneIndex={index}
              durationInFrames={perSceneFrames}
              isVertical={false}
            />
          </Sequence>
        );
      })}

      {/* Sponsor Slot — overlaid at ~15s mark if sponsor data exists */}
      {sponsor && sponsorDuration > 0 && (
        <Sequence
          from={sponsorInsertFrame}
          durationInFrames={sponsorDuration}
          name="Sponsor"
        >
          <SponsorSlot
            sponsor={sponsor}
            durationInFrames={sponsorDuration}
            isVertical={false}
          />
        </Sequence>
      )}

      {/* CTA Scene */}
      <Sequence
        from={totalFrames - ctaDuration}
        durationInFrames={ctaDuration}
        name="CTA"
      >
        <CTAScene cta={cta} durationInFrames={ctaDuration} isVertical={false} />
      </Sequence>
    </AbsoluteFill>
  );
};
