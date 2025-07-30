import { Scene } from "phaser";
import type { UserData } from "../types/PhaserTypes";
import { Player, PlayerManager } from "../character/Characters";
import type { WsEventHandler } from "../../func/wsEventHandler";

export class ParkGame extends Scene {
  userName: string = "NoName";
  background!: Phaser.GameObjects.Image;
  playerSprite!: Phaser.GameObjects.Sprite;
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  playerManager: PlayerManager = new PlayerManager();
  wsEventHandler!: WsEventHandler;
  private wasRightDown = false;
  private cnt = 0;
  constructor() {
    super("ParkGame");
  }
  //userDataSetter
  setUserData(userData: UserData) {
    this.userName = userData.user_name;
  }
  create(data?: {
    userData?: UserData;
    setSceneFunc?: (scene: Phaser.Scene) => void;
  }) {
    if (data?.setSceneFunc) {
      data.setSceneFunc(this); // ← Park.tsxのsetSceneにParkGameインスタンスを渡す
    }
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

    //player
    this.playerSprite = this.add.sprite(0, 0, "mendako");
    const playerScaleX = this.cameras.main.width / 5 / this.playerSprite.width;
    this.playerSprite.setScale(playerScaleX);

    //cursor
    this.cursors = this.input.keyboard!.createCursorKeys();

    //event
    this.events.on("remoteCommand", (data) => {
      if (data.type === "login") {
        this.playerManager.addPlayer(data.player_id, this.cnt + 50, 100, this);
        this.cnt += 50;
      }
      if (data.type === "logout") {
        this.playerManager.removePlayer(data.player_id);
        this.cnt += 50;
      }
    });
  }
  update() {
    const isDown = this.cursors.right.isDown;
    if (isDown && !this.wasRightDown) {
      // this.playerManager.addPlayer(String(this.cnt), this.cnt + 50, 100, this);
      // 押された瞬間だけ実行
    }
    this.wasRightDown = isDown;
  }
}
