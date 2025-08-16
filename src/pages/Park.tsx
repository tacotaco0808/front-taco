import { useEffect, useRef, useState } from "react";
import type { UserData } from "../phaser/types/PhaserTypes";
import { fetchUserData } from "../func/fetchUserData";
// import { v4 as uuidv4, v4 } from "uuid";
import { PhaserGame } from "../components/PhaserGame";
import { WsEventHandler } from "../func/wsEventHandler";
type UserPosition = {
  x: number;
  y: number;
};
export const Park = () => {
  const [userData, setUserData] = useState<UserData | null>();
  const [scene, setScene] = useState<Phaser.Scene | null>();
  const wsEventHandler = useRef<WsEventHandler>(new WsEventHandler()).current;
  const [eventQueue, setEventQueue] = useState<any[]>([]);
  const phaserUserPositionRef = useRef<UserPosition>({ x: 0, y: 0 });
  const wsRef = useRef<WebSocket | null>(null);
  const handleSetSceneFunc = (scene: Phaser.Scene) => {
    setScene(scene);
  };
  const handlePositionUpdate = (x: number, y: number) => {
    console.log("phaserからの座標", x, y);
    phaserUserPositionRef.current = { x: x, y: y };
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          event: "position",
          player_id: userData?.user_id,
          content: phaserUserPositionRef,
        })
      );
    }
  };
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

  useEffect(() => {
    if (!userData) return;
    const ws = new WebSocket(`ws://localhost:8000/ws/` + userData.user_id);
    wsRef.current = ws;
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
    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [userData]);
  return (
    <>
      {userData && (
        <PhaserGame
          sceneName="park"
          userData={userData}
          sceneCallBacks={{
            setSceneFunc: handleSetSceneFunc,
            onPositionUpdate: handlePositionUpdate,
          }}
        />
      )}
    </>
  );
};
