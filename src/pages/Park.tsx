import { useEffect, useRef, useState } from "react";
import type { UserData } from "../phaser/types/PhaserTypes";
import { fetchUserData } from "../func/fetchUserData";
import { PhaserGame } from "../components/PhaserGame";
import { WsEventHandler, type AllChatEventData } from "../func/wsEventHandler";
import { Box, Button, Paper, TextField } from "@mui/material";
import { useNavigate } from "react-router";
import {
  MySnackbarComponent,
  type SnackbarRef,
} from "../components/MySnackbarComponent";

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
  const snackbarRef = useRef<SnackbarRef>(null);
  const [phaserMessage, setPhaserMessage] = useState("");
  const navigate = useNavigate();
  const handleSetSceneFunc = (scene: Phaser.Scene) => {
    setScene(scene);
  };
  // ゲーム内の自分の座標を取得し、サーバへ送信
  const handlePositionUpdate = (x: number, y: number) => {
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

  // アラートを表示する関数
  const showAlert = (
    message: string,
    severity: "success" | "error" | "warning" | "info" = "info"
  ) => {
    snackbarRef.current?.showAlert(message, severity);
  };

  useEffect(() => {
    const getMe = async () => {
      const me = await fetchUserData();
      if (me) {
        setUserData(me);
        showAlert(`${me.name}さん、パークへようこそ！`, "success");
      } else {
        showAlert("ログインが必要です", "error");

        // タイマーIDを保存してクリーンアップ可能にする
        const timer = setTimeout(() => {
          navigate("/login");
        }, 3000);

        // コンポーネントがアンマウントされたらタイマーをクリア
        return () => clearTimeout(timer);
      }
    };
    getMe();
  }, [navigate]);
  useEffect(() => {
    //　シーンを準備後、受信したイベントを処理する
    if (scene) {
      wsEventHandler.setScene(scene);
      if (eventQueue.length > 0) {
        eventQueue.forEach((data) => {
          wsEventHandler.handle(data);
        });
        setEventQueue([]); // キューをクリア
      }
    }
  }, [scene, eventQueue]);

  useEffect(() => {
    if (!userData) return;
    // const ws = new WebSocket(`ws://localhost:8000/ws/` + userData.user_id);
    const ws = new WebSocket(
      `${import.meta.env.VITE_WS}/ws/` + userData.user_id
    );
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
  const handleSendMessage = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          event: "allChat",
          player_id: userData?.user_id,
          content: { message: phaserMessage },
        } as AllChatEventData)
      );
    }
  };
  return (
    <>
      {userData && (
        <>
          <PhaserGame
            sceneName="park"
            userData={userData}
            sceneCallBacks={{
              setSceneFunc: handleSetSceneFunc,
              onPositionUpdate: handlePositionUpdate,
            }}
          />
          <Paper
            sx={{
              position: "fixed",
              bottom: 20,
              left: 20,
              p: 2,
              minWidth: 300,
            }}
          >
            <Box sx={{ display: "flex", gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="メッセージを入力..."
                value={phaserMessage}
                onChange={(e) => setPhaserMessage(e.target.value)}
              />
              <Button
                variant="contained"
                onClick={handleSendMessage}
                disabled={!phaserMessage.trim()}
              >
                送信
              </Button>
            </Box>
          </Paper>
        </>
      )}
      <MySnackbarComponent ref={snackbarRef} />
    </>
  );
};
