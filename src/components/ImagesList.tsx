import { useEffect, useState } from "react";
import { createImagesUrlList } from "../func/createImagesUrlList";
import type { UUID, Image, GalleryImage } from "../types/image";
import { fetchImagesData } from "../func/fetchImagesData";
import styles from "./ImageList.module.scss";
import { ImageList, ImageListItem, ImageListItemBar } from "@mui/material";
type Props = {
  user_id?: UUID;
  format?: string;
  interval?: number; // msスライドショー切り替え時間
};
export const ImagesList = ({ user_id, format }: Props) => {
  const [imagesData, setImagesData] = useState<GalleryImage[]>([]);
  const [error, setError] = useState<string | null>(null);

  //データ取得
  useEffect(() => {
    setError(null);
    async function fetchUrlList() {
      try {
        const images: Image[] = await fetchImagesData({ user_id, format });
        const urlList = createImagesUrlList(images);
        if (urlList) {
          const galleryImages: GalleryImage[] = images.map((image, index) => ({
            ...image,
            url: urlList[index],
          }));
          setImagesData(galleryImages);
        } else {
          throw new Error("検索された画像は見つかりませんでした。");
        }
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("不明なエラー");
        }
      }
    }
    fetchUrlList();
  }, [format, user_id]);

  //   //スライドショーのインターバル
  //   useEffect(() => {
  //     if (imagesData.length === 0) return;
  //     const timer = setInterval(() => {
  //       setCurrentIndex((prevIndex) => (prevIndex + 1) % imagesData.length);
  //     }, interval);
  //     return () => clearInterval(timer);
  //   }, [imagesData, interval]);

  if (error) {
    return <>{error}</>;
  }

  return (
    <>
      {imagesData.length > 0 && (
        <ImageList sx={{ width: "90%", height: 450 }}>
          {imagesData.map((item, index) => (
            <ImageListItem className={styles.imagelist_item} key={index}>
              <img src={item.url} alt="" />
              <ImageListItemBar
                title={item.title}
                subtitle={item.description}
              />
            </ImageListItem>
          ))}
        </ImageList>
      )}
    </>
  );
};
