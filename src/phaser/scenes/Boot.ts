import { Scene } from "phaser";

export class Boot extends Scene {
  constructor() {
    super("Boot");
  }
  preload() {
    this.load.image("mendako-home-bg", "/assets/ドット部屋.png");
    this.load.on("complete", () => {
      this.scene.start("Preloader");
    });
  }
}
