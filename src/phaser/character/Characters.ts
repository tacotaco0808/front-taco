import { fetchUserData } from "../../func/fetchUserData";
import type { UserData } from "../types/PhaserTypes";

export class PlayerManager {
  //Playerが管理されている
  //Player.playerContainerが実質てきなプレイヤーの実態
  private players: Record<string, Player> = {};
  async addPlayer(
    key: string, // player_id
    // username: string,
    x: number,
    y: number,
    scene: Phaser.Scene
  ) {
    //player生成+スケーリング
    const player = new Player(x, y);
    player.sprite = scene.add.sprite(0, 0, "mendako");
    const playerScaleX = scene.cameras.main.width / 5 / player.sprite.width;
    player.sprite.setScale(playerScaleX);

    //userData取得
    const userData = await fetchUserData(key);
    if (!userData) {
      throw new Error(
        "PlayerManager.addPlayer: ユーザーデータの取得に失敗しました (fetchUserData returned null/undefined)"
      );
    }
    player.userData = userData;
    console.log("ここに入ってほしいよ:" + userData.name);

    //username
    player.usernameText = scene.add
      .text(0, -70, userData.name, {
        fontSize: "24px",
        color: "#ffffff",
      })
      .setOrigin(0.5);
    player.usernameText.setDepth(10);

    //player + username をコンテナでまとめる
    player.playerContainer = scene.add.container(0, 0, [
      player.sprite,
      player.usernameText,
    ]);
    scene.physics.world.enable(player.playerContainer);
    const playerBody = player.playerContainer
      .body as Phaser.Physics.Arcade.Body;
    playerBody.setSize(
      player.sprite.displayWidth * player.playerSize,
      player.sprite.displayHeight * player.playerSize
    );
    playerBody.setOffset(
      (-player.sprite.displayWidth * player.playerSize) / 2,
      (-player.sprite.displayHeight * player.playerSize) / 2
    );
    player.playerContainer.setPosition(
      scene.cameras.main.centerX + 70,
      scene.cameras.main.centerY + 160
    );
    playerBody.setCollideWorldBounds(true);

    // プレイヤーにシーンの参照を設定
    player.setScene(scene);

    //listにplayer追加
    this.players[key] = player;
    return player;
  }
  removePlayer(key: string) {
    //listからplayer削除
    if (this.players[key]) {
      const player = this.players[key];
      // プレイヤーのクリーンアップメソッドを呼び出し
      player.destroy();
      delete this.players[key];
    }
  }
  getPlayer(key: string): Player | undefined {
    return this.players[key];
  }
}
export class Player {
  sprite!: Phaser.GameObjects.Sprite;
  usernameText!: Phaser.GameObjects.Text;
  playerContainer!: Phaser.GameObjects.Container;
  playerSize = 0.7;
  userData!: UserData;

  // チャット関連
  private chatText?: Phaser.GameObjects.Text;
  private chatTimer?: Phaser.Time.TimerEvent;
  private scene?: Phaser.Scene;

  // username: string;
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    // this.username = username;
  }

  setScene(scene: Phaser.Scene) {
    this.scene = scene;
  }

  allChat(message: string, duration: number = 3000) {
    if (!this.scene || !this.playerContainer) return;

    // 既存のチャットメッセージがあれば削除
    this.clearChat();

    // チャットテキストを作成
    this.chatText = this.scene.add
      .text(0, -120, message, {
        fontSize: "18px",
        color: "#ffffff",
        backgroundColor: "#000000aa",
        padding: { x: 8, y: 4 },
        wordWrap: { width: 200, useAdvancedWrap: true },
      })
      .setOrigin(0.5);

    // チャットテキストをプレイヤーコンテナに追加
    this.playerContainer.add(this.chatText);
    this.chatText.setDepth(20);

    // 指定時間後にメッセージを削除
    this.chatTimer = this.scene.time.delayedCall(duration, () => {
      this.clearChat();
    });
  }

  private clearChat() {
    if (this.chatText) {
      this.chatText.destroy();
      this.chatText = undefined;
    }
    if (this.chatTimer) {
      this.chatTimer.destroy();
      this.chatTimer = undefined;
    }
  }

  /**
   * プレイヤーを破棄する際のクリーンアップ
   */
  destroy() {
    this.clearChat();
    if (this.sprite) this.sprite.destroy();
    if (this.usernameText) this.usernameText.destroy();
    if (this.playerContainer) this.playerContainer.destroy();
  }

  /**ログインイベントをwsから拾って、phaser側でログインの処理する(アバター
   * 表示とログアウトの削除
  ) */
}
