import { use, useEffect, useState } from "react";
import { createImagesUrlList } from "../func/createImagesUrlList";
import type { UUID, Image, GalleryImage } from "../types/image";
import { fetchImagesData } from "../func/fetchImagesData";
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
      const images: Image[] = await fetchImagesData({ user_id, format });
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
        <div style={{ textAlign: "center", width: "200px" }}>
          <h3>{imagesData[currentIndex].title}</h3>
          <img
            src={imagesData[currentIndex].url}
            alt={`Image ${currentIndex}`}
            width={100}
            style={{ borderRadius: "10px" }}
          />
          <p>{imagesData[currentIndex].description}</p>
        </div>
      )}
    </>
  );
};
