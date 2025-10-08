import { useEffect, useState } from "react";
import { createImagesUrlList } from "../func/createImagesUrlList";
import type { UUID, GalleryImage } from "../types/image";
import { fetchImagesData, type ImagesResponse } from "../func/fetchImagesData";
import styles from "./ImageGallery.module.scss";
type Props = {
  user_id?: UUID;
  format?: string;
  interval?: number; // msスライドショー切り替え時間
};
export const ImagesGallery = ({ user_id, format, interval = 3000 }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imagesData, setImagesData] = useState<GalleryImage[]>([]);
  const [error, setError] = useState(false);

  //データ取得
  useEffect(() => {
    async function fetchUrlList() {
      try {
        const response: ImagesResponse = await fetchImagesData({
          user_id,
          format,
        });
        const { images } = response;
        const urlList = createImagesUrlList(images);
        if (urlList) {
          const galleryImages: GalleryImage[] = images.map((image, index) => ({
            ...image,
            url: urlList[index],
          }));
          setImagesData(galleryImages);
        } else {
          setError(true);
        }
      } catch (error) {
        setError(true);
      }
    }
    fetchUrlList();
  }, []);

  //スライドショーのインターバル
  useEffect(() => {
    if (imagesData.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % imagesData.length);
    }, interval);
    return () => clearInterval(timer);
  }, [imagesData, interval]);

  if (error) {
    return <>画像のURL作成に失敗しました。</>;
  }

  return (
    <>
      {imagesData.length > 0 && (
        <>
          <h3>{imagesData[currentIndex].title}</h3>
          <div className={styles.gallery_wrapper}>
            <img
              src={imagesData[currentIndex].url}
              alt={`Image ${currentIndex}`}
              style={{ borderRadius: "10px" }}
            />
          </div>
          <p>{imagesData[currentIndex].description}</p>
        </>
      )}
    </>
  );
};
