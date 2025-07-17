import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { createImage } from "../func/fetchImage";
import axios from "axios";
import styles from "./ImagePost.module.scss";

export const ImagePost = () => {
  const [imageTitle, setImageTitle] = useState<string | null>(null);
  const [imageDetail, setImageDetail] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageFilePreview, setImageFilePreview] = useState<string | null>(null);
  const [errorStr, setErrorStr] = useState<string | null>(null);
  const handleClearForm = () => {
    setImageTitle(null);
    setImageDetail(null);
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
      console.log(resData);
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
    if (file) {
      setImageFile(file);
      setImageFilePreview(URL.createObjectURL(file));
    }
  };

  return (
    <>
      <Box className={styles.wrapper}>
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
        <FormControl>
          {errorStr && <FormHelperText>{errorStr}</FormHelperText>}
          <InputLabel htmlFor="image_title">画像のタイトル</InputLabel>
          <Input id="image_title" onChange={handleChangeInputImageTitle} />
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
          />
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          disabled={!imageFile}
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
