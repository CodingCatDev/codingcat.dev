import React from "react";
import type { SceneData } from "../types";
import { Scene } from "./Scene";
import { CodeMorphScene } from "./CodeMorphScene";
import { DynamicListScene } from "./DynamicListScene";
import { ComparisonGridScene } from "./ComparisonGridScene";
import { IsometricMockupScene } from "./IsometricMockupScene";
import { InfographicScene } from "./InfographicScene";

interface SceneRouterProps {
  scene: SceneData;
  sceneIndex: number;
  durationInFrames: number;
  isVertical?: boolean;
}

/**
 * Routes a scene to the appropriate component based on its sceneType and data.
 *
 * Priority order:
 * 1. sceneType "code" → CodeMorphScene (Alex likes the terminal look)
 * 2. infographicUrls array → InfographicScene (wins over comparison/list/mockup)
 * 3. infographicUrl single → InfographicScene (wrapped in array)
 * 4. Specialized scene types (list/comparison/mockup) — fallback when no infographics
 * 5. Fallback → Scene (Pexels b-roll, no text overlay)
 */
export const SceneRouter: React.FC<SceneRouterProps> = ({
  scene,
  sceneIndex,
  durationInFrames,
  isVertical = false,
}) => {
  const baseProps = {
    narration: scene.narration,
    sceneIndex,
    durationInFrames,
    isVertical,
    wordTimestamps: scene.wordTimestamps,
  };

  // --- 1. Code scenes: Alex likes the terminal look, keep CodeMorphScene ---
  if (scene.sceneType === "code" && scene.code) {
    return <CodeMorphScene {...baseProps} code={scene.code} />;
  }

  // --- 2. Infographic URLs array (wins over comparison/list/mockup) ---
  if (scene.infographicUrls && scene.infographicUrls.length > 0) {
    return (
      <InfographicScene
        {...baseProps}
        infographicUrls={scene.infographicUrls}
      />
    );
  }

  // --- 3. Legacy single infographic URL (wrap in array) ---
  if (scene.infographicUrl) {
    return (
      <InfographicScene
        {...baseProps}
        infographicUrls={[scene.infographicUrl]}
      />
    );
  }

  // --- 4. Specialized scene types (fallback when no infographics) ---
  switch (scene.sceneType) {
    case "list":
      if (scene.list) {
        return (
          <DynamicListScene
            {...baseProps}
            items={scene.list.items}
            icon={scene.list.icon}
          />
        );
      }
      break;

    case "comparison":
      if (scene.comparison) {
        return <ComparisonGridScene {...baseProps} {...scene.comparison} />;
      }
      break;

    case "mockup":
      if (scene.mockup) {
        return <IsometricMockupScene {...baseProps} {...scene.mockup} />;
      }
      break;

    default:
      break;
  }

  // --- 4. Fallback: Pexels b-roll scene (no text overlay) ---
  return (
    <Scene
      narration={scene.narration}
      bRollUrl={scene.bRollUrl}
      visualDescription={scene.visualDescription}
      sceneIndex={sceneIndex}
      durationInFrames={durationInFrames}
      isVertical={isVertical}
    />
  );
};
