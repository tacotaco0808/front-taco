import { Scene } from "phaser";
import type { UserData } from "../types/PhaserTypes";
import { PlayerManager } from "../character/Characters";
import type {
  AllChatEventData,
  LoginEventData,
  LogoutEventData,
  PositionEventData,
  WsEventHandler,
} from "../../func/wsEventHandler";

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
  targetPosition: { x: number; y: number } | null = null; // 目的地を追加

  // 自分のチャット機能
  private myChatText?: Phaser.GameObjects.Text;
  private myChatTimer?: Phaser.Time.TimerEvent;

  //コールバック関数
  onPositionUpdate?: (x: number, y: number) => void;
  onSendChat?: (message: string) => void;

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
    this.userName = userData.name;
  }
  create(data?: {
    userData?: UserData;
    sceneCallBacks?: {
      setSceneFunc?: (scene: Phaser.Scene) => void;
      onPositionUpdate?: (x: number, y: number) => void;
      onSendChat?: (message: string) => void;
      // 他のコールバックも追加可能
    };
  }) {
    // userDataを設定
    if (data?.userData) {
      this.setUserData(data.userData);
    }
    //コールバックの処理
    if (data?.sceneCallBacks?.setSceneFunc) {
      data.sceneCallBacks.setSceneFunc(this); // ← Park.tsxのsetSceneにParkGameインスタンスを渡す
    }
    if (data?.sceneCallBacks?.onPositionUpdate) {
      this.onPositionUpdate = data.sceneCallBacks.onPositionUpdate;
    }
    if (data?.sceneCallBacks?.onSendChat) {
      this.onSendChat = data.sceneCallBacks.onSendChat;
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

    // マウス/タッチクリックイベントを追加
    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      this.targetPosition = { x: pointer.worldX, y: pointer.worldY };
    });

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

    //Reactで受信したeventを処理
    this.events.on("login", (data: LoginEventData) => {
      this.playerManager.addPlayer(data.player_id, 100, 100, this);
    });
    this.events.on("logout", (data: LogoutEventData) => {
      this.playerManager.removePlayer(data.player_id);
    });
    this.events.on("position", (data: PositionEventData) => {
      const player = this.playerManager.getPlayer(data.player_id);
      if (player && data.content?.current) {
        player.playerContainer.setPosition(
          data.content.current.x,
          data.content.current.y
        );
      }
    });
    this.events.on("allChat", (data: AllChatEventData) => {
      const player = this.playerManager.getPlayer(data.player_id);
      if (player && data.content) {
        player.allChat(data.content.message, 5000);
      }
    });

    // シーン終了時のクリーンアップを登録
    this.events.once("shutdown", this.shutdown, this);
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

      // 目的地に近づいたら停止
      if (distance < 5) {
        this.targetPosition = null;
        player.setVelocity(0, 0);
      } else {
        // 目的地に向かう方向を計算
        const angle = Phaser.Math.Angle.Between(
          this.playerContainer.x,
          this.playerContainer.y,
          this.targetPosition.x,
          this.targetPosition.y
        );

        // 速度を設定
        const velocityX = Math.cos(angle) * this.playerSpeed;
        const velocityY = Math.sin(angle) * this.playerSpeed;
        player.setVelocity(velocityX, velocityY);
      }
    }
    // キーボード操作（既存の処理を else if に変更）
    else if (this.cursors.right.isDown) {
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
  }

  /**
   * 自分のチャットメッセージを表示する
   * @param message 表示するメッセージ
   * @param duration 表示時間（ミリ秒、デフォルト5000ms）
   */
  showMyChat(message: string, duration: number = 5000) {
    if (!this.playerContainer) return;

    // 既存のチャットメッセージがあれば削除
    this.clearMyChat();

    // チャットテキストを作成
    this.myChatText = this.add
      .text(0, -120, message, {
        fontSize: "18px",
        color: "#ffffff",
        backgroundColor: "#000000aa",
        padding: { x: 8, y: 4 },
        wordWrap: { width: 200, useAdvancedWrap: true },
      })
      .setOrigin(0.5);

    // チャットテキストをプレイヤーコンテナに追加
    this.playerContainer.add(this.myChatText);
    this.myChatText.setDepth(20);

    // 指定時間後にメッセージを削除
    this.myChatTimer = this.time.delayedCall(duration, () => {
      this.clearMyChat();
    });
  }

  /**
   * 自分のチャットメッセージをクリア
   */
  private clearMyChat() {
    if (this.myChatText) {
      this.myChatText.destroy();
      this.myChatText = undefined;
    }
    if (this.myChatTimer) {
      this.myChatTimer.destroy();
      this.myChatTimer = undefined;
    }
  }

  /**
   * シーン終了時のクリーンアップ
   */
  shutdown() {
    this.clearMyChat();
    // イベントリスナーの削除
    this.events.off("login");
    this.events.off("logout");
    this.events.off("position");
    this.events.off("allChat");
    this.input.off("pointerdown");
  }
}
