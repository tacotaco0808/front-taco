import { AUTO, Game } from "phaser";
import { Boot } from "./scenes/Boot";
import { Preloader } from "./scenes/Preloader";
import { HomeGame } from "./scenes/HomeGame";
import { SpinePlugin } from "@esotericsoftware/spine-phaser-v3";
import type { UserData } from "./types/PhaserTypes";
import { ParkGame } from "./scenes/Parkgame";
type SceneName = "home" | "park";
export const GameStart = (
  parent: string,
  scene: SceneName,
  setSceneFunc?: (scene: Phaser.Scene) => void,
  userData?: UserData | null
) => {
  // if (userData) {
  //   mainGame.setUserData(userData);
  // }
  // if (setSceneFunc) {
  //   setSceneFunc(mainGame);
  // }
  const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: 500,
    height: 500,
    parent: parent,
    backgroundColor: "#028af8",
    scene: [Boot, Preloader, HomeGame, ParkGame],
    physics: {
      default: "arcade",
      arcade: {
        gravity: {
          y: 0,
          x: 0,
        },
        debug: false,
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
  const game = new Game(config);
  game.scene.start("Boot", { scene, setSceneFunc, userData });
  return game;
};
