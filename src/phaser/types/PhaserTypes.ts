import type { UUID } from "../../types/image";

export type UserData = {
  user_id: UUID; // UUID（文字列）
  user_name: string; // ユーザー表示名
  login_id: string; // ログインID
  created_at: string; // ISO形式の日付文字列
};
