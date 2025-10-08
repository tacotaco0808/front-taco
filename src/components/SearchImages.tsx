import {
  Button,
  FormControl,
  Input,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
} from "@mui/material";
import { useState } from "react";
import { ImagesList } from "./ImagesList";
import styles from "./SearchImages.module.scss";

export const SearchImages = () => {
  const [format, setFormat] = useState<string>();
  const [user_id, setUser_id] = useState<string>();
  const [input_id, setInput_id] = useState<string>();

  const handleChange = (event: SelectChangeEvent) => {
    const format_input = event.target.value;
    if (format_input === "") {
      setFormat(undefined);
    } else {
      setFormat(format_input);
    }
  };

  const handleChangeInputText = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const userIdString = event.target.value;
    if (userIdString === "") {
      setUser_id(undefined);
    } else {
      setUser_id(userIdString);
    }
  };

  const handleClickButton = () => {
    setInput_id(user_id);
  };

  return (
    <>
      <div className={styles.wrapper}>
        <FormControl className={styles.search_format}>
          <InputLabel id="search-format-label">フォーマット</InputLabel>
          <Select
            labelId="search-format-label"
            id="search-format"
            value={format ?? ""}
            label="フォーマット"
            onChange={handleChange}
            size="small"
          >
            <MenuItem value={""}>指定しない</MenuItem>
            <MenuItem value={"png"}>PNG</MenuItem>
            <MenuItem value={"jpg"}>JPG</MenuItem>
            <MenuItem value={"jpeg"}>JPEG</MenuItem>
          </Select>
        </FormControl>

        <FormControl className={styles.search_userid}>
          <InputLabel htmlFor="search-userid">ユーザーID</InputLabel>
          <Input
            className={styles.input}
            id="search-userid"
            aria-describedby="userid-helper-text"
            value={user_id ?? ""}
            onChange={handleChangeInputText}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setInput_id(e.currentTarget.value);
              }
            }}
            size="small"
            placeholder="ユーザーIDを入力"
          />

          <Button
            variant="contained"
            onClick={handleClickButton}
            className={styles.search_button}
            color="primary"
          >
            🔍 検索
          </Button>
        </FormControl>
      </div>

      <ImagesList format={format} user_id={input_id} />
    </>
  );
};
