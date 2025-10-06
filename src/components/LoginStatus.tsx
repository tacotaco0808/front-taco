import { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Chip, Box, Button } from "@mui/material";
import type { UserData } from "../phaser/types/PhaserTypes";
import { Navigate, useNavigate } from "react-router";

type Props = {
  userData: UserData | null;
};

export const LoginStatus = ({ userData }: Props) => {
  /*ユーザのログイン情報を表示する */
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
            <Chip
              label={`🐙 ${userData.name}でログインしています`}
              color="secondary"
              variant="filled"
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                color: "white",
              }}
            />
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
