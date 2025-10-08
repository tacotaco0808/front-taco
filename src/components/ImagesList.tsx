import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import { createImagesUrlList } from "../func/createImagesUrlList";
import type { UUID, GalleryImage } from "../types/image";
import { fetchImagesData, type ImagesResponse } from "../func/fetchImagesData";
import styles from "./ImageList.module.scss";
import {
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Pagination,
  Box,
  Typography,
} from "@mui/material";

type Props = {
  user_id?: UUID;
  format?: string;
  limit?: number;
};

export const ImagesList = ({ user_id, format, limit = 4 }: Props) => {
  const navigate = useNavigate();
  const [imagesData, setImagesData] = useState<GalleryImage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pageNum, setPageNum] = useState<number>(1); //1:off0 2:off10 3:off20
  const [totalImages, setTotalImages] = useState<number>(0); // 総画像数
  const [loading, setLoading] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null); // コンテナへの参照

  // 総ページ数を計算
  const totalPages = Math.ceil(totalImages / limit);

  // 画像詳細ページへの遷移
  const handleImageClick = (imageId: string) => {
    navigate(`/images/${imageId}`);
  };

  //データ取得
  useEffect(() => {
    setError(null);
    setLoading(true);

    async function fetchUrlList() {
      try {
        const currentOffset = (pageNum - 1) * limit;
        const response: ImagesResponse = await fetchImagesData({
          user_id,
          format,
          limit,
          offset: currentOffset,
        });

        const { images, total } = response; // count を削除（使用していない）

        const urlList = createImagesUrlList(images);
        if (urlList) {
          const galleryImages: GalleryImage[] = images.map((image, index) => ({
            ...image,
            url: urlList[index],
          }));
          setImagesData(galleryImages);
        } else {
          setImagesData([]);
        }

        // APIから正確な総数を設定
        setTotalImages(total);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("不明なエラー");
        }
        setImagesData([]);
        setTotalImages(0);
      } finally {
        setLoading(false);
      }
    }
    fetchUrlList();
  }, [format, user_id, pageNum, limit]);

  // ページ変更ハンドラー
  const handlePageChange = (
    _event: React.ChangeEvent<unknown>, // _をつけて未使用を明示
    value: number
  ) => {
    // ページ変更前にコンテナの位置をスクロール位置として記憶
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const scrollY = window.scrollY + rect.top;

      setPageNum(value);

      // ページ変更後にスクロール位置を復元
      setTimeout(() => {
        window.scrollTo({
          top: scrollY,
          behavior: "smooth",
        });
      }, 100);
    } else {
      setPageNum(value);
    }
  };

  if (error) {
    return <Box sx={{ p: 2, textAlign: "center" }}>{error}</Box>;
  }

  return (
    <Box
      ref={containerRef}
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* ローディング表示 */}
      {loading && (
        <Box
          sx={{
            width: "90%",
            height: 450,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#f5f5f5",
            borderRadius: "8px",
          }}
        >
          <Typography variant="body2">読み込み中...</Typography>
        </Box>
      )}

      {/* 画像一覧 */}
      {imagesData.length > 0 && !loading && (
        <ImageList sx={{ width: "90%", height: 450 }}>
          {imagesData.map(
            (
              item // index を削除（使用していない）
            ) => (
              <ImageListItem
                className={styles.imagelist_item}
                key={item.public_id}
                onClick={() => handleImageClick(item.public_id)}
                sx={{ cursor: "pointer" }}
              >
                <img src={item.url} alt={item.title || ""} />
                <ImageListItemBar
                  title={item.title}
                  subtitle={item.description}
                />
              </ImageListItem>
            )
          )}
        </ImageList>
      )}

      {/* 画像がない場合 */}
      {imagesData.length === 0 && !loading && !error && (
        <Box
          sx={{
            width: "90%",
            height: 450,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#f9f9f9",
            borderRadius: "8px",
            border: "2px dashed #ccc",
          }}
        >
          <Typography
            variant="body1"
            sx={{ textAlign: "center", color: "#666" }}
          >
            画像が見つかりませんでした
          </Typography>
        </Box>
      )}

      {/* ページネーション */}
      {!loading && totalPages > 1 && (
        <Box sx={{ mt: 2, mb: 2 }}>
          <Pagination
            count={totalPages}
            page={pageNum}
            onChange={handlePageChange}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
          />
          <Typography variant="body2" sx={{ textAlign: "center", mt: 1 }}>
            ページ {pageNum} / {totalPages} （全 {totalImages} 件）
          </Typography>
        </Box>
      )}

      {/* 画像がない場合でもページ情報を表示 */}
      {!loading && totalImages === 0 && (
        <Typography
          variant="body2"
          sx={{ textAlign: "center", mt: 2, opacity: 0.7 }}
        >
          （全 {totalImages} 件）
        </Typography>
      )}
    </Box>
  );
};
