import { Scene } from "phaser";
import type { UserData } from "../types/PhaserTypes";

export class ParkGame extends Scene {
  userName: string = "NoName";
  background!: Phaser.GameObjects.Image;
  constructor() {
    super("ParkGame");
  }
  //userDataSetter
  setUserData(userData: UserData) {
    this.userName = userData.user_name;
  }
  create() {
    //bg
    this.background = this.add.image(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      "mendako-home-bg"
    );
    this.background.setOrigin(0.5, 0.5);
    //画面サイズに収まるための倍率(scale)計算
    const scaleX = this.cameras.main.width / this.background.width;
    const scaleY = this.cameras.main.height / this.background.height;
    const scale = Math.max(scaleX, scaleY);
    this.background.setScale(scale);
  }
}
