import styles from "./Home.module.scss";
import HomeBackground from "../assets/ドット部屋.png";
import { SimpleGallery } from "../components/SimpleGallery";
export const Home = () => {
  return (
    <div>
      <div className={styles.mv_wrapper}>
        <img className={styles.mv_background} src={HomeBackground} alt="" />
      </div>
      <SimpleGallery publicId="d95e0c9f-aea9-4ab1-ba82-da88cc3df6b9" />
    </div>
  );
};
