import type { Image } from "../types/image";

export function createImagesUrlList(images: Image[]) {
  try {
    // const images: Image[] = await fetchImagesData({ user_id, format });

    // urlを作成しリストに格納
    const images_url_list = images.map((image) => {
      const image_url = `https://res.cloudinary.com/${
        import.meta.env.VITE_CLOUDNAME
      }/image/upload/v${image.version}/${image.public_id}`;
      return image_url;
    });
    return images_url_list;
  } catch (error) {
    console.error("画像取得に失敗", error);
    return null;
  }
}
