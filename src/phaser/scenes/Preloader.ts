import { Scene } from "phaser";

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
    this.load.spineBinary("prompt-data", "skeleton.skel");
    this.load.spineAtlas("prompt-atlas", "skeleton.atlas");

    this.load.on("complete", () => {
      this.scene.start("MainGame");
    });
  }
}
