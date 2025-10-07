import axios from "axios";

export const logoutUser = async (): Promise<boolean> => {
  try {
    await axios.post(
      `${import.meta.env.VITE_IMAGE_API}/logout`,
      {},
      {
        withCredentials: true,
      }
    );
    return true;
  } catch (error) {
    console.error("ログアウトエラー:", error);
    return false;
  }
};
