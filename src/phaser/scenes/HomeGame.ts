import type { SpineGameObject } from "@esotericsoftware/spine-phaser-v3";
import { Scene } from "phaser";
import type { UserData } from "../types/PhaserTypes";
export class HomeGame extends Scene {
  // ログイン情報から取得したデータ
  userName: string = "Guest";

  // member
  background!: Phaser.GameObjects.Image;
  playerSprite!: Phaser.GameObjects.Sprite;
  usernameText!: Phaser.GameObjects.Text;
  playerContainer!: Phaser.GameObjects.Container;
  playerSpeed = 100;
  playerSize = 0.7;
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  spaceBar!: Phaser.Input.Keyboard.Key;
  pcObj!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  pcObjSize = 7;
  isOverlapping = false;
  promptDecide!: SpineGameObject | Phaser.GameObjects.Sprite;

  //userDataSetter
  setUserData(userData: UserData) {
    this.userName = userData.name;
  }

  // method from react
  toggleShowGallery?: () => void;

  constructor() {
    super("HomeGame");
  }
  create(data?: {
    userData?: UserData;
    sceneCallBacks?: {
      setSceneFunc?: (scene: Phaser.Scene) => void;
      onPositionUpdate?: (x: number, y: number) => void;
      // 他のコールバックも追加可能
    };
  }) {
    if (data?.userData) {
      this.setUserData(data.userData);
    }
    if (data?.sceneCallBacks?.setSceneFunc) {
      data.sceneCallBacks.setSceneFunc(this);
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

    //keyboard
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.spaceBar = this.input.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    //PC
    this.pcObj = this.physics.add.sprite(
      this.cameras.main.centerX - 50,
      this.cameras.main.centerY + 130,
      "pc-obj"
    );
    const pcObjScale =
      this.cameras.main.width / this.pcObjSize / this.pcObj.width;
    this.pcObj.setScale(pcObjScale);
    this.pcObj.setVisible(false);

    //promptDecide
    if (this.spine && typeof this.add.spine === "function") {
      this.promptDecide = this.add.spine(
        250,
        300,
        "prompt-data",
        "prompt-atlas"
      );
      this.promptDecide.animationState.setAnimation(0, "animation", true);
    } else {
      console.log("spineプラグインが読み込まれていません");
      this.promptDecide = this.add.sprite(0, 0, "prompt-sub");
    }
    this.promptDecide.setScale(this.cameras.main.width / 20 / this.pcObj.width);
    this.promptDecide.setVisible(false);

    //overlap
    this.physics.add.overlap(this.playerContainer, this.pcObj, () => {
      if (!this.promptDecide.visible) {
        this.promptDecide.setVisible(true);
      }
      this.promptDecide.setPosition(this.pcObj.x, this.pcObj.y - 80);
      this.isOverlapping = true;
    });
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
    if (Phaser.Input.Keyboard.JustDown(this.spaceBar) && this.isOverlapping) {
      if (this.toggleShowGallery) {
        this.toggleShowGallery();
      }
    }
    // 表示切り替えをフラグで制御
    this.promptDecide.setVisible(this.isOverlapping);

    this.isOverlapping = false;
  }
}
