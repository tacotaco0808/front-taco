import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import fs from "fs";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync("/home/ubuntu/ssl/localhost+2-key.pem"),
      cert: fs.readFileSync("/home/ubuntu/ssl/localhost+2.pem"),
    },
    host: "localhost",
    port: 5173,
  },
});
