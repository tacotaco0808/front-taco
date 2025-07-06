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
    this.load.on("complete", () => {
      this.scene.start("MainGame");
    });
  }
}
