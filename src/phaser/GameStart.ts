import { AUTO, Game } from "phaser";
import { Boot } from "./scenes/Boot";
import { Preloader } from "./scenes/Preloader";
import { MainGame } from "./scenes/MainGame";
import { SpinePlugin } from "@esotericsoftware/spine-phaser-v3";

export const GameStart = (
  parent: string,
  setSceneFunc?: (scene: Phaser.Scene) => void
) => {
  const mainGame = new MainGame();
  if (setSceneFunc) {
    setSceneFunc(mainGame);
  }
  const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: 500,
    height: 500,
    parent: parent,
    backgroundColor: "#028af8",
    scene: [Boot, Preloader, mainGame],
    physics: {
      default: "arcade",
      arcade: {
        gravity: {
          y: 0,
          x: 0,
        },
        debug: true,
      },
    },
    plugins: {
      scene: [
        {
          key: "spine.SpinePlugin",
          plugin: SpinePlugin,
          mapping: "spine",
        },
      ],
    },
  };
  return new Game(config);
};
