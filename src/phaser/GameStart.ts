import { AUTO, Game } from "phaser";
import { Boot } from "./scenes/Boot";
import { Preloader } from "./scenes/Preloader";
import { MainGame } from "./scenes/MainGame";

export const GameStart = (parent: string) => {
  const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: 500,
    height: 500,
    parent: "game-container",
    backgroundColor: "#028af8",
    scene: [Boot, Preloader, MainGame],
  };
  return new Game({ ...config, parent });
};
