import { useEffect, useRef, useState } from "react";
import type { UserData } from "../phaser/types/PhaserTypes";
import { fetchUserData } from "../func/fetchUserData";
// import { v4 as uuidv4, v4 } from "uuid";
import { PhaserGame } from "../components/PhaserGame";
import { WsEventHandler } from "../func/wsEventHandler";
export const Park = () => {
  const [userData, setUserData] = useState<UserData | null>();
  const [scene, setScene] = useState<Phaser.Scene | null>();
  const wsEventHandler = useRef<WsEventHandler>(new WsEventHandler()).current;
  const [eventQueue, setEventQueue] = useState<any[]>([]);
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
      if (eventQueue.length > 0) {
        console.log("こいつら実行" + eventQueue);
        eventQueue.forEach((data) => {
          wsEventHandler.handle(data);
        });
        setEventQueue([]); // キューをクリア
      }
    }
  }, [scene, eventQueue]);
  // useEffect(() => {
  //   console.log("test");
  // }, [eventQueue]);
  useEffect(() => {
    if (!userData) return;
    console.log("aiuei");
    const ws = new WebSocket(`ws://localhost:8000/ws/` + userData.user_id);
    ws.onopen = () => {
      ws.send("接続完了");
    };
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("受信:", data);
        setEventQueue((prev) => [...prev, data]);
      } catch (error) {
        console.log(event.data);
      }
    };
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
