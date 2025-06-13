import { useEffect, useState } from "react";
import { createImageUrl } from "../func/createImageUrl";
import type { UUID } from "../types/image";
type Props = {
  publicId: UUID;
};
export const SimpleGallery = ({ publicId }: Props) => {
  // 一つの指定した画像を表示するだけ 非同期で処理すること
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    async function fetchUrl() {
      const url = await createImageUrl(publicId);
      if (url) {
        setImageUrl(url);
      } else {
        setError(true);
      }
    }
    fetchUrl();
  }, []);
  if (error) {
    return <>画像のURL作成に失敗しました。</>;
  }
  if (!imageUrl) {
    return <>読み込み中・・・</>;
  }
  return (
    <>
      <img src={imageUrl} alt="" />
    </>
  );
};
