import { BrowserRouter, Route, Routes } from "react-router";
import { LoginForm } from "../components/LoginForm";
import { Test } from "../components/Test";
import { Home } from "../pages/Home";
import { ImagePost } from "../components/ImagePost";

export const Router = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/image/post" element={<ImagePost />} />
          <Route path="/test" element={<Test />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};
