import { useLayoutEffect, useRef } from "react";
import { GameStart } from "../phaser/GameStart";
import type { UserData } from "../phaser/types/PhaserTypes";
type SceneCallBacks = {
  setSceneFunc?: (scene: Phaser.Scene) => void;
  onPositionUpdate?: (x: number, y: number) => void;
  onSendChat?: (message: string) => void;
};
type Props = {
  sceneName: SceneName;
  sceneCallBacks: SceneCallBacks;
  userData?: UserData | null;
};
type SceneName = "home" | "park";
export const PhaserGame = ({ sceneName, sceneCallBacks, userData }: Props) => {
  const gameRef = useRef<Phaser.Game | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (gameRef.current === null) {
      gameRef.current = GameStart(
        "game-container",
        sceneName,
        sceneCallBacks,
        userData
      );
    }

    // リサイズイベントハンドラー
    const handleResize = () => {
      if (gameRef.current && containerRef.current) {
        const container = containerRef.current;
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;

        // Phaserの内蔵スケールマネージャーを使用してリサイズ
        // これにより内部座標系（500x500）が維持される
        gameRef.current.scale.setParentSize(containerWidth, containerHeight);
        gameRef.current.scale.refresh();
      }
    };

    // 初回リサイズ
    setTimeout(handleResize, 100);

    // ウィンドウリサイズイベントリスナー
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="game-container"
      style={{
        width: "100%",
        height: "100%",
        maxWidth: "500px",
        maxHeight: "500px",
        aspectRatio: "1 / 1",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    />
  );
};
