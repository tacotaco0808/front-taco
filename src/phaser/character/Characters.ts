export class PlayerManager {
  private players: Record<string, Player> = {};
  addPlayer(key: string, x: number, y: number, scene: Phaser.Scene) {
    const player = new Player(x, y);
    player.sprite = scene.add.sprite(x, y, "mendako");
    this.players[key] = player;
    return player;
  }
  removePlayer(key: string) {
    if (this.players[key]) {
      this.players[key].sprite.destroy();
      delete this.players[key];
    }
  }
  getPlayer(key: string): Player | undefined {
    return this.players[key];
  }
}
export class Player {
  sprite!: Phaser.GameObjects.Sprite;
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  /**ログインイベントをwsから拾って、phaser側でログインの処理する(アバター
   * 表示とログアウトの削除
  ) */
}
