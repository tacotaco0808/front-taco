import { useLayoutEffect, useRef } from "react";
import { GameStart } from "../phaser/GameStart";
import type { UserData } from "../phaser/types/PhaserTypes";
type Props = {
  setSceneFunc?: (scene: Phaser.Scene) => void;
  userData?: UserData | null;
};
export const PhaserGame = ({ setSceneFunc, userData }: Props) => {
  const gameRef = useRef<Phaser.Game | null>(null);
  useLayoutEffect(() => {
    if (gameRef.current === null) {
      gameRef.current = GameStart("game-container", setSceneFunc, userData);
    }
  }, []);
  return <div id="game-container"></div>;
};
