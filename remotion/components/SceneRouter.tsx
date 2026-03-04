import React from "react";
import type { SceneData } from "../types";
import { Scene } from "./Scene";
// Future imports (uncomment as components are built):
// import { CodeMorphScene } from "./CodeMorphScene";
// import { DynamicListScene } from "./DynamicListScene";
// import { ComparisonGridScene } from "./ComparisonGridScene";
// import { IsometricMockupScene } from "./IsometricMockupScene";

interface SceneRouterProps {
  scene: SceneData;
  sceneIndex: number;
  durationInFrames: number;
  isVertical?: boolean;
}

/**
 * Routes a scene to the appropriate component based on its sceneType.
 * Falls back to the generic Scene component for unimplemented types.
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

  switch (scene.sceneType) {
    case "code":
      if (scene.code) {
        // TODO: Replace with CodeMorphScene when built
        // return <CodeMorphScene {...baseProps} code={scene.code} />;
      }
      break;

    case "list":
      if (scene.list) {
        // TODO: Replace with DynamicListScene when built
        // return <DynamicListScene {...baseProps} items={scene.list.items} icon={scene.list.icon} />;
      }
      break;

    case "comparison":
      if (scene.comparison) {
        // TODO: Replace with ComparisonGridScene when built
        // return <ComparisonGridScene {...baseProps} {...scene.comparison} />;
      }
      break;

    case "mockup":
      if (scene.mockup) {
        // TODO: Replace with IsometricMockupScene when built
        // return <IsometricMockupScene {...baseProps} {...scene.mockup} />;
      }
      break;

    case "narration":
    default:
      break;
  }

  // Fallback: use the existing Scene component
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
