export class TriggerObject {
  scene: Phaser.Scene;
  displayName: string;
  position: { x: number; y: number };
  spriteKey: string;
  collisionObj!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  promptDecide!: Phaser.GameObjects.Text;
  promptTween!: Phaser.Tweens.Tween;
  objSize: number = 7;
  promptBaseY: number = 0;
  isOverlapping: boolean = false;
  handleInteraction: () => void;

  constructor(
    scene: Phaser.Scene,
    displayName: string,
    spriteKey: string,
    position: { x: number; y: number },
    handleInteraction: () => void,
    objSize: number = 7
  ) {
    this.scene = scene;
    this.displayName = displayName;
    this.spriteKey = spriteKey;
    this.position = position;
    this.handleInteraction = handleInteraction;
    this.objSize = objSize;
  }

  create() {
    // 当たり判定オブジェクト作成
    this.collisionObj = this.scene.physics.add.sprite(
      this.position.x,
      this.position.y,
      this.spriteKey
    );

    const objScale =
      this.scene.cameras.main.width / this.objSize / this.collisionObj.width;
    this.collisionObj.setScale(objScale);
    this.collisionObj.setVisible(false);

    // プロンプトテキスト作成
    this.promptDecide = this.scene.add.text(0, 0, this.displayName, {
      fontSize: "24px",
      color: "#ffffff",
      backgroundColor: "rgba(33, 32, 32, 0.8)",
      padding: { x: 12, y: 8 },
      align: "center",
    });
    this.promptDecide.setOrigin(0.5);
    this.promptDecide.setVisible(false);
    this.promptDecide.setDepth(20);

    // プロンプトクリックイベント
    this.promptDecide.setInteractive();
    this.promptDecide.on("pointerdown", () => {
      this.handleInteraction();
    });
  }

  // プレイヤーとのオーバーラップ処理を設定
  setupOverlap(playerContainer: Phaser.GameObjects.Container) {
    this.scene.physics.add.overlap(playerContainer, this.collisionObj, () => {
      if (!this.promptDecide.visible) {
        this.showPrompt();
      }
      this.isOverlapping = true;
    });
  }

  // プロンプト表示とアニメーション開始
  private showPrompt() {
    this.promptDecide.setVisible(true);

    // 位置を設定
    const baseY = this.collisionObj.y - 60;
    this.promptBaseY = baseY;
    this.promptDecide.setPosition(this.collisionObj.x, baseY);

    // 既存のTweenがあれば停止・削除
    if (this.promptTween) {
      this.promptTween.destroy();
    }

    // 上下に揺れるアニメーション
    this.promptTween = this.scene.tweens.add({
      targets: this.promptDecide,
      y: baseY - 15,
      duration: 600,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
  }

  // プロンプト非表示とアニメーション停止
  private hidePrompt() {
    this.promptDecide.setVisible(false);
    if (this.promptTween) {
      this.promptTween.destroy();
      this.promptTween = null as any;
    }
  }

  // 毎フレーム呼ぶ更新処理
  update() {
    const wasVisible = this.promptDecide.visible;
    this.promptDecide.setVisible(this.isOverlapping);

    // 非表示になった時はアニメーションを停止
    if (!this.promptDecide.visible && wasVisible) {
      this.hidePrompt();
    }

    // フラグをリセット（次のフレームでオーバーラップがなければfalseになる）
    this.isOverlapping = false;
  }

  // オブジェクト破棄時のクリーンアップ
  destroy() {
    if (this.promptTween) {
      this.promptTween.destroy();
    }
    if (this.promptDecide) {
      this.promptDecide.destroy();
    }
    if (this.collisionObj) {
      this.collisionObj.destroy();
    }
  }
}
