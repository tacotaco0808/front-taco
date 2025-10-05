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
    console.log("ここに入ってほしいよ:" + userData.user_name);

    //username
    player.usernameText = scene.add
      .text(0, -70, userData.user_name, {
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

    //listにplayer追加
    this.players[key] = player;
    return player;
  }
  removePlayer(key: string) {
    //listからplayer削除
    if (this.players[key]) {
      const player = this.players[key];
      player.sprite.destroy();
      player.usernameText.destroy();
      player.playerContainer.destroy();
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

  // username: string;
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    // this.username = username;
  }
  /**ログインイベントをwsから拾って、phaser側でログインの処理する(アバター
   * 表示とログアウトの削除
  ) */
}
