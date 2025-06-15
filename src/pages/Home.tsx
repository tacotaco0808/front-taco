import styles from "./Home.module.scss";
import HomeBackground from "../assets/ドット部屋.png";
import { SimpleGallery } from "../components/SimpleGallery";
import { ImagesGallery } from "../components/ImagesGallery";
export const Home = () => {
  return (
    <div>
      <div className={styles.mv_wrapper}>
        <img className={styles.mv_background} src={HomeBackground} alt="" />
      </div>
      {/* <SimpleGallery publicId="e8f82240-61a0-4ef0-a6a3-92e031d0d01e" /> */}
      <ImagesGallery />
    </div>
  );
};
