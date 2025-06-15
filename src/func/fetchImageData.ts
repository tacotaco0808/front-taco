import axios from "axios";
import type { Image, UUID } from "../types/image";

type Props = {
  image_public_id: UUID;
};
export async function fetchImageData({
  image_public_id,
}: Props): Promise<Image> {
  try {
    const res = await axios.get(`${import.meta.env.VITE_IMAGE_API}/image`, {
      params: {
        public_id: image_public_id,
      },
    });
    const image: Image = res.data;
    return image;
  } catch (error) {
    throw error;
  }
}
