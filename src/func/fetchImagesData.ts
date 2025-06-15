import axios from "axios";
import type { UUID, Image } from "../types/image";

type Props = {
  user_id?: UUID;
  format?: string;
};
export async function fetchImagesData({
  user_id,
  format,
}: Props): Promise<Image[]> {
  try {
    // 条件に一致する画像を複数取得
    const res = await axios.get(`${import.meta.env.VITE_IMAGE_API}/images`, {
      params: {
        user_id: user_id,
        format: format,
      },
    });
    const images: Image[] = res.data;
    // imagesが空の場合エラーとして処理
    if (!images || images.length === 0) {
      throw new Error("検索された画像は見つかりませんでした。");
    }
    return images;
  } catch (error) {
    throw error;
  }
}
