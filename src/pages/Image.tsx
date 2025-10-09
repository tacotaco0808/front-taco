import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import { fetchImageDetail } from "../func/fetchImageDetail";
import type { Image as ImageType } from "../types/image";
import type { NavigationState } from "../types/navigation";
import styles from "./Image.module.scss";

export const Image = () => {
  const { imageId } = useParams<{ imageId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [image, setImage] = useState<ImageType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 前のページから受け取った状態
  const navigationState = location.state as NavigationState | null;

  useEffect(() => {
    const loadImage = async () => {
      if (!imageId) {
        setError("画像IDが指定されていません");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const imageData = await fetchImageDetail(imageId);

        if (imageData) {
          setImage(imageData);
          setError(null);
        } else {
          setError("画像が見つかりませんでした");
        }
      } catch (err) {
        console.error("Error loading image:", err);
        setError("画像の読み込み中にエラーが発生しました");
      } finally {
        setLoading(false);
      }
    };

    loadImage();
  }, [imageId]);

  const handleBack = () => {
    // 状態がある場合はHomeページに戻る、ない場合は前のページに戻る
    if (navigationState && navigationState.fromPage === "home") {
      navigate("/", {
        state: {
          restoreGallery: true,
          galleryState: {
            isGalleryVisible: navigationState.isGalleryVisible,
            currentPage: navigationState.currentPage,
            searchFilters: navigationState.searchFilters,
          },
        },
      });
    } else {
      navigate(-1);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString("ja-JP", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className={styles.imageDetailContainer}>
        <div className={styles.loadingContainer}>読み込み中...</div>
      </div>
    );
  }

  if (error || !image) {
    return (
      <div className={styles.imageDetailContainer}>
        <button onClick={handleBack} className={styles.backButton}>
          ← 戻る
        </button>
        <div className={styles.errorContainer}>
          <div className={styles.errorMessage}>
            {error || "画像が見つかりませんでした"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.imageDetailContainer}>
      <button onClick={handleBack} className={styles.backButton}>
        ← 戻る
      </button>

      <div className={styles.imageDetailCard}>
        <div className={styles.imageContainer}>
          <img
            src={image.image_url}
            alt={image.title}
            className={styles.mainImage}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
              setError("画像の読み込みに失敗しました");
            }}
          />
        </div>

        <div className={styles.imageInfo}>
          <h1 className={styles.imageTitle}>{image.title}</h1>

          {image.description && (
            <p className={styles.imageDescription}>{image.description}</p>
          )}

          <div className={styles.imageMetadata}>
            <div className={styles.metadataItem}>
              <span className={styles.metadataLabel}>投稿日時</span>
              <span className={styles.metadataValue}>
                {formatDate(image.created_at)}
              </span>
            </div>

            <div className={styles.metadataItem}>
              <span className={styles.metadataLabel}>フォーマット</span>
              <span className={styles.metadataValue}>
                {image.format.toUpperCase()}
              </span>
            </div>

            <div className={styles.metadataItem}>
              <span className={styles.metadataLabel}>バージョン</span>
              <span className={styles.metadataValue}>{image.version}</span>
            </div>

            <div className={styles.metadataItem}>
              <span className={styles.metadataLabel}>画像ID</span>
              <span className={styles.metadataValue}>{image.public_id}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
