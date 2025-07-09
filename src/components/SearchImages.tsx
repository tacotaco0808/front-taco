import {
  Button,
  FormControl,
  FormHelperText,
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
    // setInput_id(user_id);
  };
  return (
    <>
      <div className={styles.wrapper}>
        <FormControl sx={{ minWidth: "10rem" }}>
          <InputLabel id="search-format-label">Search Format</InputLabel>
          <Select
            labelId="search-format-label"
            id="search-format"
            value={format ?? ""}
            label="search format"
            onChange={handleChange}
          >
            <MenuItem value={""}>指定しない</MenuItem>
            <MenuItem value={"png"}>png</MenuItem>
            <MenuItem value={"jpg"}>jpg</MenuItem>
            <MenuItem value={"jpeg"}>jpeg</MenuItem>
          </Select>
        </FormControl>
        <FormControl className={styles.search_userid}>
          <InputLabel htmlFor="search-userid">Search User ID</InputLabel>
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
          />

          {/* <FormHelperText id="userid-helper-text">
              Search images from User ID
            </FormHelperText> */}

          <Button variant="outlined" onClick={handleClickButton} sx={{ ml: 2 }}>
            Search
          </Button>
        </FormControl>
      </div>

      <ImagesList format={format} user_id={input_id} />
    </>
  );
};
