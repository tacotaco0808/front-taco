import { Scene } from "phaser";

type PreloaderSceneData = {
  userData?: any;
  // setSceneFunc?: any;
  sceneCallBacks?: any;
  scene: string;
};

export class Preloader extends Scene {
  constructor() {
    super("Preloader");
  }
  //   init() {
  //     this.add.image(0, 0, "background");
  //   }
  preload() {
    this.load.setPath("assets");
    this.load.image("mendako", "dot_mendako.png");
    this.load.image("pc-obj", "dot_mendako.png");
    this.load.image("prompt-sub", "skeleton.png");
    this.load.spineBinary("prompt-data", "skeleton.skel");
    this.load.spineAtlas("prompt-atlas", "skeleton.atlas");

    this.load.on("complete", () => {
      const { userData, sceneCallBacks, scene } =
        (this.scene.settings.data as PreloaderSceneData) || {};
      if (scene === "home") {
        this.scene.start("HomeGame", {
          userData,
          sceneCallBacks,
        }); /**ここで、()=>{}このラムダ式(Home.tsxのtoggleShowGallery)をぶちこんでいる */
      } else if (scene === "park") {
        this.scene.start("ParkGame", { userData, sceneCallBacks });
      }
    });
  }
}
