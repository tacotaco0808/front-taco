import axios from "axios";
import { useEffect } from "react";

export const Test = () => {
  useEffect(() => {
    const testFetch = async () => {
      const res = await axios.get(`${import.meta.env.VITE_IMAGE_API}/me`, {
        withCredentials: true,
      });
      console.log(res.data);
      return res;
    };
    testFetch();
  }, []);
  return <></>;
};
