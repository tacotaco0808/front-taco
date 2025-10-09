// ページ間で受け渡しする状態の型定義
export interface NavigationState {
  // ギャラリーの状態
  isGalleryVisible: boolean;
  currentPage: number;

  // 検索フィルター
  searchFilters: {
    format?: string;
    user_id?: string;
  };

  // どのページから来たか
  fromPage: "home" | "other";

  // その他のメタデータ
  timestamp: number;
}
