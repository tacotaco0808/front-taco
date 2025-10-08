import { BrowserRouter, Route, Routes } from "react-router";
import { Home } from "../pages/Home";
import { ImagePost } from "../components/ImagePost";
import { Park } from "../pages/Park";
import { Login } from "../pages/Login";
import { Image } from "../pages/Image";

export const Router = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/image/post" element={<ImagePost />} />
          <Route path="/images/:imageId" element={<Image />} />
          <Route path="/park" element={<Park />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};
