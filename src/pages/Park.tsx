import { useEffect, useRef, useState } from "react";
import type { UserData } from "../phaser/types/PhaserTypes";
import { fetchUserData } from "../func/fetchUserData";
import { v4 as uuidv4, v4 } from "uuid";
import { PhaserGame } from "../components/PhaserGame";
import { WsEventHandler } from "../func/wsEventHandler";
export const Park = () => {
  const [userData, setUserData] = useState<UserData | null>();
  const [scene, setScene] = useState<Phaser.Scene | null>();
  const wsEventHandler = useRef<WsEventHandler>(new WsEventHandler()).current;
  useEffect(() => {
    const getMe = async () => {
      const me = await fetchUserData();
      if (me) {
        setUserData(me);
      }
    };
    getMe();
  }, []);
  useEffect(() => {
    if (scene) {
      wsEventHandler.setScene(scene);
    }
  }, [scene]);
  useEffect(() => {
    if (!userData) return;
    const userDataMock = uuidv4();
    const ws = new WebSocket(`ws://localhost:8000/ws/` + userData.user_id);
    ws.onopen = () => {
      ws.send("接続完了");
    };
    ws.onmessage = (event) => {
      if (!setScene) return;
      const data = JSON.parse(event.data);
      wsEventHandler.handle(data);
      console.log(data);
    };
    //parkシーンを表示 GameStart.tsでシーンを変更できるようにする。
    //
    //例えば"park"を引数に入れたら、boot preloader "park"　の順に画面遷移
    //シーンのインスタンスを生成してそれを引数に渡せばよい
    //parkシーンから座標を取得
    //座標をこのコンポーネントからwsへ送信
    //座標をサーバから全プレイヤーへ配信
    //全クライアントの座標を取得
    //全クライアントの座標を描画
  }, [userData]);
  return (
    <>
      {userData && (
        <PhaserGame
          sceneName="park"
          userData={userData}
          setSceneFunc={setScene}
        />
      )}
    </>
  );
};
