import { useLayoutEffect, useRef } from "react";
import { GameStart } from "../phaser/GameStart";

export const PhaserGame = () => {
  const gameRef = useRef<Phaser.Game | null>(null);
  useLayoutEffect(() => {
    if (gameRef.current === null) {
      gameRef.current = GameStart("game-container");
    }
  }, []);
  return <div id="game-container"></div>;
};
