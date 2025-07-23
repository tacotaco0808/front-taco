import axios from "axios";
import { useEffect, useState } from "react";
import type { UserData } from "../phaser/types/PhaserTypes";
import { v4 as uuidv4 } from "uuid";
export const Test = () => {
  const [userData, setUserData] = useState<UserData | null>();
  useEffect(() => {
    const mockId = uuidv4();
    const testFetch = async () => {
      const res = await axios.get(`${import.meta.env.VITE_IMAGE_API}/me`, {
        withCredentials: true,
      });
      const resData: UserData = {
        user_id: mockId,
        user_name: res.data.user_name,
        login_id: res.data.login_id,
        created_at: res.data.created_at,
      };
      if (resData) {
        setUserData(resData);
      }
    };
    testFetch();
  }, []);
  useEffect(() => {
    if (!userData) return;
    const ws = new WebSocket("ws://localhost:8000/ws/" + userData?.user_id);
    ws.onopen = () => {
      console.log("ws接続");
      ws.send("接続完了：From Server");
    };
    ws.onmessage = (event) => {
      console.log(event);
      const messageJson = JSON.parse(event.data);
      console.log(messageJson);
    };
  }, [userData]);
  return (
    <>
      {userData && (
        <>
          <p>{userData.user_id}</p>
          <p>{userData.user_name}</p>
        </>
      )}
    </>
  );
};

// import { useEffect } from "react";

// export const Test = () => {
//   useEffect(() => {
//     const ws = new WebSocket("ws://localhost:8000/ws/1");
//     ws.onopen = () => {
//       console.log("ws接続");
//       ws.send("test");
//     };
//     ws.onmessage = (event) => {
//       console.log(event.data);
//     };
//   }, []);
//   return <></>;
// };
