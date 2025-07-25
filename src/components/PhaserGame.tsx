import { useLayoutEffect, useRef } from "react";
import { GameStart } from "../phaser/GameStart";
import type { UserData } from "../phaser/types/PhaserTypes";
type Props = {
  sceneName: SceneName;
  setSceneFunc?: (scene: Phaser.Scene) => void;
  userData?: UserData | null;
};
type SceneName = "home" | "park";
export const PhaserGame = ({ sceneName, setSceneFunc, userData }: Props) => {
  const gameRef = useRef<Phaser.Game | null>(null);
  useLayoutEffect(() => {
    if (gameRef.current === null) {
      gameRef.current = GameStart(
        "game-container",
        sceneName,
        setSceneFunc,
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
