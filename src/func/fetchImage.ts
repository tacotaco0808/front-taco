import axios from "axios";

export const createImage = async (
  title: string,
  detail: string,
  image_file: File
) => {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("description", detail);
  formData.append("image_file", image_file);
  const res = await axios.post(
    `${import.meta.env.VITE_IMAGE_API}/images`,
    formData,
    { withCredentials: true }
  );
  return res.data;
};
