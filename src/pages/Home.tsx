import styles from "./Home.module.scss";
import HomeBackground from "../assets/ドット部屋.png";

import { ImagesList } from "../components/ImagesList";
import { PhaserGame } from "../components/PhaserGame";
export const Home = () => {
  return (
    <div>
      <div className={styles.mv_wrapper}>
        <img className={styles.mv_background} src={HomeBackground} alt="" />
        <div className={styles.gallery_wrapper}>
          {/* <ImagesGallery /> */}
          <ImagesList />
        </div>
        <PhaserGame />
      </div>

      {/* <SimpleGallery publicId="e8f82240-61a0-4ef0-a6a3-92e031d0d01e" /> */}
    </div>
  );
};
