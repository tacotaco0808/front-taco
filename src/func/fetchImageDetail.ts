import type { Image } from "../types/image";

export const fetchImageDetail = async (
  imageId: string
): Promise<Image | null> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_IMAGE_API}/images/${imageId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      console.error("Failed to fetch image detail:", response.status);
      return null;
    }

    const imageData: Image = await response.json();
    return imageData;
  } catch (error) {
    console.error("Error fetching image detail:", error);
    return null;
  }
};
