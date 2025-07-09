import { useLayoutEffect, useRef } from "react";
import { GameStart } from "../phaser/GameStart";
type Props = {
  setSceneFunc?: (scene: Phaser.Scene) => void;
};
export const PhaserGame = ({ setSceneFunc }: Props) => {
  const gameRef = useRef<Phaser.Game | null>(null);
  useLayoutEffect(() => {
    if (gameRef.current === null) {
      gameRef.current = GameStart("game-container", setSceneFunc);
    }
  }, []);
  return <div id="game-container"></div>;
};
