import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import fs from "fs";
import path from "path";
import os from "os";

//commandにserveを設定し、開発環境での起動のみSSL通信に必要な公開・暗号鍵を参照
export default defineConfig((command) => ({
  plugins: [react()],
  server:
    command.command === "serve"
      ? {
          https: {
            key: fs.readFileSync(
              path.join(os.homedir(), ".ssl", "localhost+2-key.pem")
            ),
            cert: fs.readFileSync(
              path.join(os.homedir(), ".ssl", "localhost+2.pem")
            ),
          },
          host: "localhost",
          port: 5173,
        }
      : undefined,
}));
