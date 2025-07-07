import { Scene } from "phaser";

export class MainGame extends Scene {
  background!: Phaser.GameObjects.Image;
  player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  playerSpeed = 100;
  playerSize = 5;
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  constructor() {
    super("MainGame");
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

    //player
    this.player = this.physics.add.sprite(
      this.cameras.main.centerX + 30,
      this.cameras.main.centerY + 160,
      "mendako"
    );
    const playerScaleX =
      this.cameras.main.width / this.playerSize / this.player.width;
    this.player.setScale(playerScaleX);

    //keyboard
    this.cursors = this.input.keyboard!.createCursorKeys();
  }
  update() {
    if (this.cursors.right.isDown) {
      this.player.setVelocityX(this.playerSpeed);
    } else if (this.cursors.left.isDown) {
      this.player.setVelocityX(-1 * this.playerSpeed);
    } else {
      this.player.setVelocityX(0);
    }
    if (this.cursors.down.isDown) {
      this.player.setVelocityY(this.playerSpeed);
    } else if (this.cursors.up.isDown) {
      this.player.setVelocityY(-1 * this.playerSpeed);
    } else {
      this.player.setVelocityY(0);
    }
  }
}
