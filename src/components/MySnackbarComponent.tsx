import { Alert, Snackbar } from "@mui/material";
import { forwardRef, useImperativeHandle, useState } from "react";
import { DEFAULT_SNACKBAR, type MySnackbar } from "../types/MySnackbar";

// 親コンポーネントが呼び出せるメソッドの型
export interface SnackbarRef {
  showAlert: (
    message: string,
    severity?: "success" | "error" | "warning" | "info"
  ) => void;
}

// 親でuseRefを作成し、refからshowAlertを呼び出す
export const MySnackbarComponent = forwardRef<SnackbarRef>((_, ref) => {
  const [snackbar, setSnackbar] = useState<MySnackbar>(DEFAULT_SNACKBAR);

  const showAlert = (
    message: string,
    severity: "success" | "error" | "warning" | "info" = "info"
  ) => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // 親コンポーネントがshowAlertを呼び出せるようにする
  useImperativeHandle(ref, () => ({
    showAlert,
  }));

  return (
    <Snackbar
      open={snackbar.open}
      autoHideDuration={4000}
      onClose={handleCloseSnackbar}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert
        onClose={handleCloseSnackbar}
        severity={snackbar.severity}
        variant="filled"
        sx={{ width: "100%" }}
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
  );
});

MySnackbarComponent.displayName = "MySnackbarComponent";
