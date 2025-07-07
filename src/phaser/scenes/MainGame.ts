import { Scene } from "phaser";

export class MainGame extends Scene {
  // member
  background!: Phaser.GameObjects.Image;
  player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  playerSpeed = 100;
  playerSize = 5;
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  spaceBar!: Phaser.Input.Keyboard.Key;
  pcObj!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  pcObjSize = 7;
  isOverlapping = false;
  // method from react
  toggleShowGallery?: () => void;

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

    //overlap
    this.physics.add.overlap(this.player, this.pcObj, () => {
      this.isOverlapping = true;
    });
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
    if (Phaser.Input.Keyboard.JustDown(this.spaceBar) && this.isOverlapping) {
      if (this.toggleShowGallery) {
        this.toggleShowGallery();
      }
    }

    this.isOverlapping = false;
  }
}
