import { Scene } from "phaser";
import type { UserData } from "../types/PhaserTypes";
import { PlayerManager } from "../character/Characters";
import type { EventData, WsEventHandler } from "../../func/wsEventHandler";

export class ParkGame extends Scene {
  userName: string = "NoName";
  background!: Phaser.GameObjects.Image;
  playerSprite!: Phaser.GameObjects.Sprite;
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  playerManager: PlayerManager = new PlayerManager();
  playerSpeed = 100;
  wsEventHandler!: WsEventHandler;
  usernameText!: Phaser.GameObjects.Text;

  playerContainer!: Phaser.GameObjects.Container;
  playerSize = 0.7;
  //コールバック関数
  onPositionUpdate?: (x: number, y: number) => void;

  constructor() {
    super({
      key: "ParkGame",
      // physics: {
      //   default: "arcade",
      //   arcade: { debug: true, gravity: { x: 0, y: 300 } },
      // },
    });
  }
  //userDataSetter
  setUserData(userData: UserData) {
    this.userName = userData.user_name;
  }
  create(data?: {
    userData?: UserData;
    sceneCallBacks?: {
      setSceneFunc?: (scene: Phaser.Scene) => void;
      onPositionUpdate?: (x: number, y: number) => void;
      // 他のコールバックも追加可能
    };
  }) {
    //コールバックの処理
    if (data?.sceneCallBacks?.setSceneFunc) {
      data.sceneCallBacks.setSceneFunc(this); // ← Park.tsxのsetSceneにParkGameインスタンスを渡す
    }
    if (data?.sceneCallBacks?.onPositionUpdate) {
      this.onPositionUpdate = data.sceneCallBacks.onPositionUpdate;
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

    //username
    this.usernameText = this.add
      .text(0, -70, this.userName, {
        fontSize: "24px",
        color: "#ffffff",
      })
      .setOrigin(0.5);
    this.usernameText.setDepth(10);

    //player + username をコンテナでまとめる
    this.playerContainer = this.add.container(0, 0, [
      this.playerSprite,
      this.usernameText,
    ]);
    this.physics.world.enable(this.playerContainer);
    const playerBody = this.playerContainer.body as Phaser.Physics.Arcade.Body;
    playerBody.setSize(
      this.playerSprite.displayWidth * this.playerSize,
      this.playerSprite.displayHeight * this.playerSize
    );
    playerBody.setOffset(
      (-this.playerSprite.displayWidth * this.playerSize) / 2,
      (-this.playerSprite.displayHeight * this.playerSize) / 2
    );
    this.playerContainer.setPosition(
      this.cameras.main.centerX + 70,
      this.cameras.main.centerY + 160
    );
    playerBody.setCollideWorldBounds(true);
    //cursor
    this.cursors = this.input.keyboard!.createCursorKeys();

    //定期イベント
    this.time.addEvent({
      delay: 500,
      loop: true,
      callback: () => {
        // ここにonPositionUpdate
        if (this.onPositionUpdate) {
          this.onPositionUpdate(this.playerContainer.x, this.playerContainer.y);
        }
      },
    });

    //event
    this.events.on("login", (data: EventData) => {
      this.playerManager.addPlayer(data.player_id, 100, 100, this);
    });
    this.events.on("logout", (data: EventData) => {
      this.playerManager.removePlayer(data.player_id);
    });
    // 自分以外のアバターの位置同期
    this.events.on(
      "position",
      (data: EventData & { content?: { x: number; y: number } }) => {
        const player = this.playerManager.getPlayer(data.player_id);
        if (player && data.content?.current) {
          console.log(
            "debug:::" + data.content.current.x + ":" + data.content.current.y
          );
          player.playerContainer.setPosition(
            data.content.current.x,
            data.content.current.y
          );
        }
      }
    );
  }
  update() {
    const player = this.playerContainer.body as Phaser.Physics.Arcade.Body;
    if (this.cursors.right.isDown) {
      player.setVelocityX(this.playerSpeed);
    } else if (this.cursors.left.isDown) {
      player.setVelocityX(-1 * this.playerSpeed);
    } else {
      player.setVelocityX(0);
    }
    if (this.cursors.down.isDown) {
      player.setVelocityY(this.playerSpeed);
    } else if (this.cursors.up.isDown) {
      player.setVelocityY(-1 * this.playerSpeed);
    } else {
      player.setVelocityY(0);
    }
  }
}
