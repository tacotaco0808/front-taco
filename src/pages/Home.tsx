import styles from "./Home.module.scss";
import WindowBar from "/assets/window_bar.png";
import { PhaserGame } from "../components/PhaserGame";
import { useEffect, useState } from "react";
import type { HomeGame } from "../phaser/scenes/HomeGame";
import { SearchImages } from "../components/SearchImages";
import axios from "axios";
import type { UserData } from "../phaser/types/PhaserTypes";
import { Link } from "react-router";
import { Button } from "@mui/material";
export const Home = () => {
  const [isVisbleGallery, setIsVisibleGallery] = useState(false);
  const [isVisiblePhaser, setIsVisiblePhaser] = useState(false);
  const [userData, setUserData] = useState<UserData | null>();
  const handleSetSceneFunc = (scene: Phaser.Scene) => {
    (scene as HomeGame).toggleShowGallery = () => {
      setIsVisibleGallery((prev) => !prev);
    };
  };
  useEffect(() => {
    const get_me = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_IMAGE_API}/me`, {
          withCredentials: true,
        });
        const resData = res.data;
        setUserData(resData);
      } catch (error) {
        console.log(error);
      }
      setIsVisiblePhaser(true);
    };
    get_me();
  }, []);
  return (
    <div>
      {userData && <div>{userData.user_name}</div>}
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
          カーソル（←↑→↓）で動かしてみよう <br />
          スペースで決定 <br />
          PCを開いてみよう!
        </p>
      </div>
      <div>
        {isVisbleGallery && (
          <div className={styles.mv_gallery}>
            <div className={styles.pc_window}>
              <img src={WindowBar} />
              <SearchImages />
              <Button
                component={Link}
                to="/image/post"
                variant="contained"
                disabled={!userData}
              >
                画像の投稿をする
              </Button>
              {userData ? (
                <div>ユーザ：{userData.user_name}でログインしています</div>
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
