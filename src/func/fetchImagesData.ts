import axios from "axios";
import type { UUID, Image } from "../types/image";

export type ImagesResponse = {
  images: Image[];
  total: number;
  count: number;
};

type Props = {
  user_id?: UUID;
  format?: string;
  limit?: number;
  offset?: number;
};
export async function fetchImagesData({
  user_id,
  format,
  limit = 10,
  offset = 0,
}: Props): Promise<ImagesResponse> {
  try {
    const res = await axios.get(`${import.meta.env.VITE_IMAGE_API}/images`, {
      params: {
        user_id: user_id,
        format: format,
        limit: limit,
        offset: offset,
      },
    });

    return {
      images: res.data.images,
      total: res.data.total,
      count: res.data.count,
    };
  } catch (error) {
    throw error;
  }
}
