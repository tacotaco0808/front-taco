import { useLayoutEffect, useRef } from "react";
import { GameStart } from "../phaser/GameStart";
import type { UserData } from "../phaser/types/PhaserTypes";
type SceneCallBacks = {
  setSceneFunc?: (scene: Phaser.Scene) => void;
  onPositionUpdate?: (x: number, y: number) => void;
};
type Props = {
  sceneName: SceneName;
  sceneCallBacks: SceneCallBacks;
  userData?: UserData | null;
};
type SceneName = "home" | "park";
export const PhaserGame = ({ sceneName, sceneCallBacks, userData }: Props) => {
  const gameRef = useRef<Phaser.Game | null>(null);
  useLayoutEffect(() => {
    if (gameRef.current === null) {
      gameRef.current = GameStart(
        "game-container",
        sceneName,
        sceneCallBacks,
        userData
      );
    }
    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);
  return <div id="game-container"></div>;
};
