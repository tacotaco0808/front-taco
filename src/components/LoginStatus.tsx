import { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import type { UserData } from "../phaser/types/PhaserTypes";
import { logoutUser } from "../func/logoutUser";
import { useNavigate } from "react-router";

type Props = {
  userData: UserData | null;
  onLogout?: () => void; // ログアウト時のコールバック
};

export const LoginStatus = ({ userData, onLogout }: Props) => {
  const [isLogin, setIsLogin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (userData) {
      setIsLogin(true);
      console.log("dataを受け取りました", userData);
    } else {
      setIsLogin(false);
    }
  }, [userData]);

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleLogoutClick = async () => {
    const success = await logoutUser();
    if (success) {
      // ローカルの状態をクリア
      setIsLogin(false);
      if (onLogout) {
        onLogout(); // 親コンポーネントの状態もクリア
      }
      // navigate("/login");
    }
  };

  return (
    <AppBar position="static" color="primary" sx={{ mb: 2 }}>
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" component="div">
            たこたこの部屋
          </Typography>
        </Box>

        {isLogin && userData ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                color: "white",
                padding: "6px 12px",
                borderRadius: "16px",
                fontSize: "0.875rem",
              }}
            >
              🐙 {userData.name}でログインしています
            </Box>
            <Button
              color="inherit"
              onClick={handleLogoutClick}
              sx={{
                color: "white",
                textTransform: "none",
              }}
            >
              ログアウト
            </Button>
          </Box>
        ) : (
          <Button
            variant="outlined"
            onClick={handleLoginClick}
            sx={{
              color: "white",
              borderColor: "white",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderColor: "white",
              },
            }}
          >
            ログインする
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};
