import React, { useRef, useState } from "react";
import {
  TextField,
  Button,
  Snackbar,
  Alert,
  Typography,
  Box,
} from "@mui/material";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import { createCategory, getCategories } from "../../../../services/admin";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import CategorySelector from "./CategorySelector";

// Material UI direction setting for input
const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

const CategoryForm = () => {
  const queryClient = useQueryClient();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    icon: "",
    photo: "",
    parent: "",
  });
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState("");
  const fileInputRef = useRef(null);

  const { mutate, isLoading, error } = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getCategories"] });
      setSnackbarMessage("دسته‌ بندی با موفقیت ایجاد شد!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    },
    onError: (error) => {
      console.log(error);
      setSnackbarMessage("خطا در ایجاد دسته‌ بندی");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    },
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const filteredData = { ...formData };
    if (!filteredData.slug) delete filteredData.slug;
    if (!filteredData.parent) delete filteredData.parent;
    if (!filteredData.photo) delete filteredData.photo;
    mutate(filteredData);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setFormData({
      ...formData,
      photo: file.name,
    });
    const url = URL.createObjectURL(file);
    setPhotoPreviewUrl(url);
  };

  const handleRemovePhoto = () => {
    setFormData({
      ...formData,
      photo: "",
    });
    if (photoPreviewUrl) URL.revokeObjectURL(photoPreviewUrl);
    setPhotoPreviewUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ maxWidth: 400, mt: 3 }}
      >
        <Typography variant="h6" mb={2}>
          ایجاد دسته‌بندی جدید
        </Typography>

        <CacheProvider value={cacheRtl}>
          <TextField
            label="عنوان"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
          />
          <TextField
            label="اسلاگ (Slug)"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="آیکون"
            name="icon"
            value={formData.icon}
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
          />
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              تصویر
            </Typography>
            <input
              ref={fileInputRef}
              type="file"
              name="photo"
              accept="image/*"
              onChange={handlePhotoChange}
              style={{ display: "none" }}
            />
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() =>
                  fileInputRef.current && fileInputRef.current.click()
                }
              >
                انتخاب تصویر
              </Button>
              {formData.photo && (
                <Button
                  color="error"
                  variant="text"
                  onClick={handleRemovePhoto}
                >
                  حذف تصویر
                </Button>
              )}
            </Box>
            {photoPreviewUrl && (
              <Box sx={{ mt: 2, borderRadius: 1, overflow: "hidden" }}>
                <img
                  src={photoPreviewUrl}
                  alt="پیش‌نمایش تصویر"
                  style={{ width: "100%", height: 180, objectFit: "cover" }}
                />
              </Box>
            )}
          </Box>
          {/*  getCategory Input */}
          <CategorySelector
            formData={formData}
            setFormData={setFormData}
            labelText="دسته بندی والد"
          />
        </CacheProvider>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          fullWidth
          sx={{ mt: 2 }}
        >
          {isLoading ? "در حال ارسال..." : "ایجاد دسته‌ بندی"}
        </Button>
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%", gap: 2 }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default CategoryForm;
