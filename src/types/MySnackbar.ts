export interface MySnackbar {
  open: boolean;
  message: string;
  severity?: "success" | "error" | "warning" | "info";
}
export const DEFAULT_SNACKBAR: MySnackbar = {
  open: false,
  message: "",
  severity: "info",
} as const;
