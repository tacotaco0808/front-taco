import type { Image, UUID } from "../types/image";
import { fetchImageData } from "./fetchImageData";
export async function createImageUrl(image_public_id: UUID) {
  try {
    // 指定の画像データ取得

    const image: Image = await fetchImageData({
      image_public_id: image_public_id,
    });

    // データから画像URL作成
    // prettier-ignore
    const image_url = `https://res.cloudinary.com/${import.meta.env.VITE_CLOUDNAME}/image/upload/v${image.version}/${image.public_id}`;
    return image_url;
  } catch (error) {
    console.error("画像URL取得に失敗", error);
    return null;
  }
}
