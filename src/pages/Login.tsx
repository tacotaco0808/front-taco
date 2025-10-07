import { LoginForm } from "../components/LoginForm";
import { Button, Box } from "@mui/material";
import { useNavigate } from "react-router";

export const Login = () => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <Box sx={{ position: "relative", minHeight: "100vh" }}>
      <Box sx={{ position: "absolute", top: 16, left: 16, zIndex: 10 }}>
        <Button
          variant="outlined"
          onClick={handleBackToHome}
          sx={{
            color: "primary.main",
            borderColor: "primary.main",
            "&:hover": {
              backgroundColor: "rgba(25, 118, 210, 0.04)",
            },
          }}
        >
          ← ホーム画面に戻る
        </Button>
      </Box>
      <Box sx={{ paddingTop: "80px" }}>
        <LoginForm />
      </Box>
    </Box>
  );
};
