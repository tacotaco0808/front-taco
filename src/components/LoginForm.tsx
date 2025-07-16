import { Button, FormControl, Input, InputLabel } from "@mui/material";
import { useState } from "react";
import { loginUser } from "../func/loginUser";
import axios from "axios";

export const LoginForm = () => {
  const [password, setPassword] = useState<string>("");
  const [loginId, setLoginId] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const handleClickButton = async () => {
    if (!loginId || !password) {
      return;
    }
    try {
      await loginUser(loginId, password);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const detail = error.response?.data?.detail;
        setError(detail);
      } else if (error instanceof Error) {
        setError(error.message);
      }
    }
  };
  const handleChangeInputLoginID = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLoginId(event.target.value);
  };
  const handleChangeInputPassword = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPassword(event.target.value);
  };
  return (
    <>
      <FormControl>
        <InputLabel htmlFor="login_id">Please enter loginID here.</InputLabel>
        <Input id="login_id" onChange={handleChangeInputLoginID} />
      </FormControl>
      <FormControl>
        <InputLabel htmlFor="password">Please enter password here.</InputLabel>
        <Input
          id="password"
          type="password"
          onChange={handleChangeInputPassword}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleClickButton();
            }
          }}
        />
      </FormControl>
      <Button variant="outlined" onClick={handleClickButton} sx={{ ml: 2 }}>
        Login
      </Button>
      {error && <div>{error}</div>}
    </>
  );
};
