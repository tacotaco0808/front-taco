import styles from "./Home.module.scss";
import WindowBar from "/assets/window_bar.png";
import { PhaserGame } from "../components/PhaserGame";
import { useEffect, useState, useRef } from "react";
import type { HomeGame } from "../phaser/scenes/HomeGame";
import { SearchImages } from "../components/SearchImages";
import axios from "axios";
import type { UserData } from "../phaser/types/PhaserTypes";
import { Link, useLocation, useNavigate } from "react-router";
import { Button } from "@mui/material";
import { LoginStatus } from "../components/LoginStatus";

export const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isVisbleGallery, setIsVisibleGallery] = useState(false);
  const [isVisiblePhaser, setIsVisiblePhaser] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [galleryState, setGalleryState] = useState<{
    currentPage: number;
    searchFilters: {
      format?: string;
      user_id?: string;
    };
  }>({
    currentPage: 1,
    searchFilters: {
      format: undefined,
      user_id: undefined,
    },
  });
  const galleryRef = useRef<HTMLDivElement>(null);

  // ログアウト時の処理
  const handleLogout = () => {
    setUserData(null);
    setIsVisibleGallery(false);
    setIsVisiblePhaser(false); // Phaserを非表示

    // 100ms後にPhaserを再表示（コンポーネント再作成）
    setTimeout(() => {
      setIsVisiblePhaser(true);
    }, 100);
  };

  const handleSetSceneFunc = (scene: Phaser.Scene) => {
    (scene as HomeGame).toggleShowGallery = () => {
      setIsVisibleGallery((prev) => !prev);
    };
    (scene as HomeGame).moveToPark = () => {
      navigate("/park");
    };
  };

  // 画像詳細ページから戻ってきた際の状態復元
  useEffect(() => {
    const state = location.state as any;
    if (state?.restoreGallery && state?.galleryState) {
      //restoreGalleryがtrueであれば情報を復元
      setIsVisibleGallery(state.galleryState.isGalleryVisible);
      setGalleryState({
        currentPage: state.galleryState.currentPage,
        searchFilters: state.galleryState.searchFilters,
      });
      // 状態を消去（リロード時に再実行されないように）
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, [location]);

  // ギャラリーが表示された時に自動スクロール
  useEffect(() => {
    if (isVisbleGallery && galleryRef.current) {
      galleryRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [isVisbleGallery]);

  useEffect(() => {
    const get_me = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_IMAGE_API}/me`, {
          withCredentials: true,
        });
        const resData = res.data;
        setUserData(resData);
      } catch (error) {}
      setIsVisiblePhaser(true);
    };
    get_me();
  }, []);

  return (
    <div>
      <LoginStatus userData={userData} onLogout={handleLogout} />
      <div className={styles.mv_wrapper}>
        {isVisiblePhaser && (
          <PhaserGame
            sceneName="home"
            sceneCallBacks={{
              setSceneFunc: handleSetSceneFunc,
            }}
            userData={userData}
          />
        )}

        <p>
          ゲーム画面をタッチして動かしてみよう <br />
          PCの近くに行って、出てきた表示をタップ!
          <br />
          PCを開いてみよう!
        </p>
      </div>
      <div ref={galleryRef}>
        {isVisbleGallery && (
          <div className={styles.mv_gallery}>
            <div className={styles.pc_window}>
              <img src={WindowBar} />
              <SearchImages
                initialState={galleryState}
                onStateChange={setGalleryState}
              />
              <Button
                component={Link}
                to="/image/post"
                variant="contained"
                disabled={!userData}
              >
                画像の投稿をする
              </Button>
              {userData ? (
                <div>ユーザ：{userData.name}でログインしています</div>
              ) : (
                <p>画像の投稿にはログインが必要です。</p>
              )}
            </div>
          </div>
        )}
      </div>
      {/* <SimpleGallery publicId="e8f82240-61a0-4ef0-a6a3-92e031d0d01e" /> */}
    </div>
  );
};
