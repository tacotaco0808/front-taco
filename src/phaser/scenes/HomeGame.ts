import { Scene } from "phaser";
import type { UserData } from "../types/PhaserTypes";
import { TriggerObject } from "../object/TriggerObject";

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
  targetPosition: { x: number; y: number } | null = null;

  // TriggerObjectに置き換え
  pcObject!: TriggerObject;
  parkObject!: TriggerObject;
  appleObject!: TriggerObject;

  //リンゴのオブジェクト用
  fallingApples!: Phaser.Physics.Arcade.Group;

  //userDataSetter
  setUserData(userData: UserData) {
    this.userName = userData.name;
  }

  // method from react
  toggleShowGallery?: () => void;
  moveToPark?: () => void;

  constructor() {
    super("HomeGame");
  }

  create(data?: {
    userData?: UserData;
    sceneCallBacks?: {
      setSceneFunc?: (scene: Phaser.Scene) => void;
      onPositionUpdate?: (x: number, y: number) => void;
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

    // PCオブジェクトをTriggerObjectで作成
    this.pcObject = new TriggerObject(
      this,
      "PC", // 表示名
      false,
      "pc-obj", // スプライトキー
      {
        x: this.cameras.main.centerX - 50,
        y: this.cameras.main.centerY + 130,
      }, // 位置
      () => {
        // クリック時の処理
        if (this.toggleShowGallery) {
          this.toggleShowGallery();
        }
      },
      7 // オブジェクトサイズ
    );
    this.pcObject.create();
    this.pcObject.setupOverlap(this.playerContainer);

    // ParkオブジェクトをTriggerObjectで作成
    this.parkObject = new TriggerObject(
      this,
      "公園", // 表示名
      false,
      "pc-obj", // スプライトキー
      {
        x: this.cameras.main.centerX + 200,
        y: this.cameras.main.centerY + 220,
      }, // 位置
      () => {
        // クリック時の処理
        if (this.moveToPark) {
          this.moveToPark();
        }
      },
      7 // オブジェクトサイズ
    );
    this.parkObject.create();
    this.parkObject.setupOverlap(this.playerContainer);

    //appleObjectをtriggerObjectで作成
    this.appleObject = new TriggerObject(
      this,
      "apple",
      false,
      "",
      {
        x: this.cameras.main.centerX - 140,
        y: this.cameras.main.centerY - 150,
      },
      () => {
        this.spawnFallingApple();
      }
    );
    this.appleObject.create();
    this.appleObject.setupOverlap(this.playerContainer);

    //リンゴ物理グループ作成
    this.fallingApples = this.physics.add.group({
      allowGravity: true,
      gravityY: 300,
      bounceY: 0.6,
      collideWorldBounds: true,
    });

    // マウス/タッチクリックイベントを追加
    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      this.targetPosition = { x: pointer.worldX, y: pointer.worldY };
    });
  }

  update() {
    const player = this.playerContainer.body as Phaser.Physics.Arcade.Body;

    // タッチ移動の処理
    if (this.targetPosition) {
      const distance = Phaser.Math.Distance.Between(
        this.playerContainer.x,
        this.playerContainer.y,
        this.targetPosition.x,
        this.targetPosition.y
      );

      if (distance < 5) {
        this.targetPosition = null;
        player.setVelocity(0, 0);
      } else {
        const angle = Phaser.Math.Angle.Between(
          this.playerContainer.x,
          this.playerContainer.y,
          this.targetPosition.x,
          this.targetPosition.y
        );
        const velocityX = Math.cos(angle) * this.playerSpeed;
        const velocityY = Math.sin(angle) * this.playerSpeed;
        player.setVelocity(velocityX, velocityY);
      }
    } else if (this.cursors.right.isDown) {
      player.setVelocityX(this.playerSpeed);
      player.setVelocityY(0);
    } else if (this.cursors.left.isDown) {
      player.setVelocityX(-1 * this.playerSpeed);
      player.setVelocityY(0);
    } else if (this.cursors.down.isDown) {
      player.setVelocityY(this.playerSpeed);
      player.setVelocityX(0);
    } else if (this.cursors.up.isDown) {
      player.setVelocityY(-1 * this.playerSpeed);
      player.setVelocityX(0);
    } else {
      player.setVelocity(0, 0);
    }

    // オブジェクトの更新
    this.pcObject.update();
    this.parkObject.update();
    this.appleObject.update();
  }

  destroy() {
    // イベントリスナーの削除
    this.input.off("pointerdown");

    // キーボードイベントの削除
    if (this.cursors) {
      this.input.keyboard?.removeKey(this.cursors.left);
      this.input.keyboard?.removeKey(this.cursors.right);
      this.input.keyboard?.removeKey(this.cursors.up);
      this.input.keyboard?.removeKey(this.cursors.down);
    }

    if (this.spaceBar) {
      this.input.keyboard?.removeKey(this.spaceBar);
    }

    // TriggerObjectのクリーンアップ
    if (this.pcObject) {
      this.pcObject.destroy();
    }
    if (this.parkObject) {
      this.parkObject.destroy();
    }
    if (this.appleObject) {
      this.appleObject.destroy();
    }

    // 外部参照の削除
    this.toggleShowGallery = undefined;
    this.targetPosition = null;
  }

  shutdown() {
    // シーン終了時のクリーンアップ
    this.targetPosition = null;
  }

  // 新しいりんごを生成するメソッド
  spawnFallingApple() {
    const randomX = Phaser.Math.Between(10, this.cameras.main.width - 10);
    const apple = this.physics.add.sprite(randomX, 0, "mendako");

    // 物理設定
    const appleBody = apple.body as Phaser.Physics.Arcade.Body;
    appleBody.setGravityY(300);
    appleBody.setBounce(0.6);
    appleBody.setCollideWorldBounds(true);

    // サイズ調整
    const scale = this.cameras.main.width / 15 / apple.width;
    apple.setScale(scale);

    // グループに追加
    this.fallingApples.add(apple);

    // プレイヤーとの衝突検出
    this.physics.add.overlap(this.playerContainer, apple, () => {
      console.log("りんごをキャッチ！");
      apple.destroy();
    });

    // 5秒後に自動削除
    this.time.delayedCall(5000, () => {
      if (apple.active) {
        apple.destroy();
      }
    });
  }
}
