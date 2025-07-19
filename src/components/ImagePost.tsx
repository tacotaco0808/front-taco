import {
  Alert,
  Box,
  Button,
  FormControl,
  Input,
  InputLabel,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { createImage } from "../func/fetchImage";
import axios from "axios";
import styles from "./ImagePost.module.scss";

export const ImagePost = () => {
  const [imageTitle, setImageTitle] = useState<string>("");
  const [imageDetail, setImageDetail] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageFilePreview, setImageFilePreview] = useState<string | null>(null);
  const [errorStr, setErrorStr] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  useEffect(() => {
    // タイマーのアンマウント
    if (!isSuccess) {
      return;
    }
    const timer = setTimeout(() => {
      setIsSuccess(false);
    }, 3000);
    return () => {
      clearTimeout(timer);
    };
  }, [isSuccess]);

  useEffect(() => {
    // imageFilePreviewのメモリ解放
    return () => {
      if (imageFilePreview) {
        URL.revokeObjectURL(imageFilePreview);
      }
    };
  }, [imageFilePreview]);

  const handleClearForm = () => {
    setImageTitle("");
    setImageDetail("");
    setImageFile(null);
    setImageFilePreview(null);
    setErrorStr(null);
  };

  const handleSubmit = async () => {
    if (!imageTitle || !imageDetail || !imageFile) {
      return;
    }
    try {
      const resData = await createImage(imageTitle, imageDetail, imageFile);
      handleClearForm();
      if (resData) {
        setIsSuccess(true);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const detail = error.response?.data?.detail;
        setErrorStr(detail);
      } else if (error instanceof Error) {
        setErrorStr(error.message);
      }
    }
  };
  const handleChangeInputImageTitle = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setImageTitle(event.target.value);
  };
  const handleChangeInputImageDetail = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setImageDetail(event.target.value);
  };
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && !file.type.startsWith("image/")) {
      setErrorStr("画像ファイルを選択してください");
      return;
    } else if (file) {
      setErrorStr(null);
    }

    if (file) {
      setImageFile(file);
      setImageFilePreview(URL.createObjectURL(file));
    }
  };

  return (
    <>
      <Box className={styles.wrapper}>
        {isSuccess && (
          <Alert severity="success">画像の投稿ができました！</Alert>
        )}
        <Button variant="contained" component="label">
          画像を選択
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleImageChange}
          />
        </Button>
        {imageFilePreview && (
          <Box
            component="img"
            src={imageFilePreview}
            alt="Preview"
            sx={{ width: 200, height: "auto", borderRadius: 2 }}
          />
        )}
        {errorStr && <Alert severity="error">{errorStr}</Alert>}

        <FormControl>
          <InputLabel htmlFor="image_title">画像のタイトル</InputLabel>

          <Input
            id="image_title"
            onChange={handleChangeInputImageTitle}
            value={imageTitle}
          />
        </FormControl>
        <FormControl>
          <TextField
            id="image_detail"
            label="画像の説明"
            multiline
            placeholder="ここに画像の説明を入力してね"
            onChange={handleChangeInputImageDetail}
            minRows={1}
            maxRows={10}
            value={imageDetail}
          />
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          disabled={!imageTitle || !imageDetail || !imageFile}
          onClick={handleSubmit}
        >
          画像をアップロードする
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleClearForm}>
          フォームをクリア
        </Button>
      </Box>
    </>
  );
};
