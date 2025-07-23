import axios from "axios";
import type { UserData } from "../phaser/types/PhaserTypes";

export const fetchUserData = async () => {
  const res = await axios.get(`${import.meta.env.VITE_IMAGE_API}/me`, {
    withCredentials: true,
  });

  const userData: UserData = {
    user_id: res.data.user_id,
    user_name: res.data.user_name,
    login_id: res.data.login_id,
    created_at: res.data.created_at,
  };
  if (userData) {
    return userData;
  }
};
