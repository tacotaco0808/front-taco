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

interface SearchState {
  currentPage: number;
  searchFilters: {
    format?: string;
    user_id?: string;
  };
}

interface Props {
  initialState?: SearchState;
  onStateChange?: (state: SearchState) => void;
}

export const SearchImages = ({ initialState, onStateChange }: Props) => {
  const [format, setFormat] = useState<string>(
    initialState?.searchFilters.format || ""
  );
  const [user_id, setUser_id] = useState<string>(
    initialState?.searchFilters.user_id || ""
  );
  const [input_id, setInput_id] = useState<string>(
    initialState?.searchFilters.user_id || ""
  );

  // 状態変更を親コンポーネントに通知
  const notifyStateChange = (
    newFormat?: string,
    newUserId?: string,
    page?: number
  ) => {
    if (onStateChange) {
      onStateChange({
        //ここを実行すると、親コンポーネントへstateを同期できる
        currentPage: page || 1, // ページ指定がない場合は1にリセット
        searchFilters: {
          format: newFormat || undefined,
          user_id: newUserId || undefined,
        },
      });
    }
  };

  const handleChange = (event: SelectChangeEvent) => {
    const format_input = event.target.value;
    const newFormat = format_input === "" ? "" : format_input;
    setFormat(newFormat);
    notifyStateChange(newFormat, input_id);
  };

  const handleChangeInputText = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const userIdString = event.target.value;
    setUser_id(userIdString);
  };

  const handleClickButton = () => {
    setInput_id(user_id);
    notifyStateChange(format, user_id);
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
                const newUserId = e.currentTarget.value;
                setInput_id(newUserId);
                notifyStateChange(format, newUserId);
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

      <ImagesList
        format={format || undefined}
        user_id={input_id || undefined}
        currentPage={initialState?.currentPage || 1}
        onPageChange={(page) => notifyStateChange(format, input_id, page)}
      />
    </>
  );
};
