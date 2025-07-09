import styles from "./Home.module.scss";
import WindowBar from "/assets/window_bar.png";
import { ImagesList } from "../components/ImagesList";
import { PhaserGame } from "../components/PhaserGame";
import { useState } from "react";
import type { MainGame } from "../phaser/scenes/MainGame";
export const Home = () => {
  const [isVisbleGallery, setIsVisibleGallery] = useState(false);
  const handleSetSceneFunc = (scene: Phaser.Scene) => {
    (scene as MainGame).toggleShowGallery = () => {
      setIsVisibleGallery((prev) => !prev);
    };
  };
  return (
    <div>
      <div className={styles.mv_wrapper}>
        {/* <img className={styles.mv_background} src={HomeBackground} alt="" />
        <div className={styles.gallery_wrapper}>
          <ImagesList />
        </div> */}
        <PhaserGame setSceneFunc={handleSetSceneFunc} />
        <p>
          カーソル（←↑→↓）で動かしてみよう <br />
          スペースで決定 <br />
          PCを開いてみよう
        </p>
      </div>
      <div>
        {isVisbleGallery && (
          <div className={styles.mv_gallery}>
            <div className={styles.pc_window}>
              <img src={WindowBar} />
              <ImagesList />
            </div>
          </div>
        )}
      </div>
      {/* <SimpleGallery publicId="e8f82240-61a0-4ef0-a6a3-92e031d0d01e" /> */}
    </div>
  );
};
