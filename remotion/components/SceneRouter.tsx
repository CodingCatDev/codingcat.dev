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
 * 1. Explicit sceneType with matching data (code/list/comparison/mockup)
 * 2. infographicUrls array → InfographicScene (multi-image cycling)
 * 3. infographicUrl single → InfographicScene (wrapped in array)
 * 4. Fallback → Scene (Pexels b-roll, no text overlay)
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

  // --- 1. Specialized scene types (code/list/comparison/mockup) ---
  switch (scene.sceneType) {
    case "code":
      if (scene.code) {
        return <CodeMorphScene {...baseProps} code={scene.code} />;
      }
      break;

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

  // --- 2. Infographic URLs array (multi-image cycling) ---
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
