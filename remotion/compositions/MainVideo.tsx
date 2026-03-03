import React from "react";
import { AbsoluteFill, Audio, Sequence } from "remotion";
import type { VideoInputProps } from "../types";
import {
  DEFAULT_CTA_DURATION,
  DEFAULT_HOOK_DURATION,
  DEFAULT_SPONSOR_DURATION,
  FPS,
  SPONSOR_INSERT_SECONDS,
  TRANSITION_DURATION,
} from "../constants";
import { HookScene } from "../components/HookScene";
import { Scene } from "../components/Scene";
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

  // Calculate available frames for content scenes.
  // With cross-fade overlap, each transition saves TRANSITION_DURATION frames.
  // Transitions: hook→scene1, scene1→scene2, ..., sceneN→CTA
  // Total transitions = scenes.length + 1 (hook-to-first-scene + between-scenes + last-scene-to-CTA)
  const numTransitions = scenes.length + 1;
  const overlapSavings = numTransitions * TRANSITION_DURATION;
  const scenesAvailableFrames = totalFrames - hookDuration - ctaDuration + overlapSavings;

  // Distribute scene frames evenly across all scenes
  const perSceneFrames = Math.max(
    FPS, // minimum 1 second per scene
    Math.floor(scenesAvailableFrames / scenes.length)
  );

  // Sponsor insertion point in frames (~15s mark)
  const sponsorInsertFrame = SPONSOR_INSERT_SECONDS * FPS;

  // --- Build timeline with cross-fade overlaps ---
  // Each scene starts TRANSITION_DURATION frames before the previous one ends.
  // Hook starts at 0.
  const hookStart = 0;

  // First content scene overlaps with the end of the hook
  const firstSceneStart = hookStart + hookDuration - TRANSITION_DURATION;

  // Calculate scene start positions
  const sceneStarts = scenes.map((_, index) =>
    firstSceneStart + index * (perSceneFrames - TRANSITION_DURATION)
  );

  // CTA overlaps with the end of the last content scene
  const lastSceneEnd = sceneStarts.length > 0
    ? sceneStarts[sceneStarts.length - 1] + perSceneFrames
    : hookStart + hookDuration;
  const ctaStart = lastSceneEnd - TRANSITION_DURATION;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* Audio track — plays for the entire composition */}
      <Audio src={audioUrl} />

      {/* Hook Scene */}
      <Sequence
        from={hookStart}
        durationInFrames={hookDuration}
        name="Hook"
      >
        <HookScene
          hook={hook}
          durationInFrames={hookDuration}
          isVertical={false}
        />
      </Sequence>

      {/* Content Scenes — with cross-fade overlap */}
      {scenes.map((scene, index) => (
        <Sequence
          key={`scene-${index}`}
          from={sceneStarts[index]}
          durationInFrames={perSceneFrames}
          name={`Scene ${index + 1}`}
        >
          <Scene
            narration={scene.narration}
            bRollUrl={scene.bRollUrl}
            visualDescription={scene.visualDescription}
            sceneIndex={index}
            durationInFrames={perSceneFrames}
            isVertical={false}
          />
        </Sequence>
      ))}

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

      {/* CTA Scene — cross-fades in from last content scene */}
      <Sequence
        from={ctaStart}
        durationInFrames={ctaDuration}
        name="CTA"
      >
        <CTAScene
          cta={cta}
          durationInFrames={ctaDuration}
          isVertical={false}
        />
      </Sequence>
    </AbsoluteFill>
  );
};
