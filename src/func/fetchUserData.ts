import axios from "axios";
import type { UserData } from "../phaser/types/PhaserTypes";

// オーバーロード構造
export async function fetchUserData(): Promise<UserData | undefined>;
export async function fetchUserData(
  userId: string
): Promise<UserData | undefined>;

// 実装
export async function fetchUserData(
  userId?: string
): Promise<UserData | undefined> {
  try {
    const endpoint = userId
      ? `${import.meta.env.VITE_IMAGE_API}/users/${userId}`
      : `${import.meta.env.VITE_IMAGE_API}/me`;

    const res = await axios.get(endpoint, {
      withCredentials: true,
    });

    const userData: UserData = {
      user_id: res.data.user_id,
      user_name: res.data.name,
      login_id: res.data.login_id,
      created_at: res.data.created_at,
    };

    return userData;
  } catch (error) {
    console.error(
      `fetchUserData failed for ${userId || "current user"}:`,
      error
    );
    return undefined;
  }
}
