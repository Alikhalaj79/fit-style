import React, { useState } from "react";
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
import { createCategory, getCategories } from "../../services/admin";
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

  const [formData, setFormData] = useState({ title: "" , slug: "" , icon: "" , parent: "" , });

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
    mutate(filteredData);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
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
          {/*  getCategory Input */}
          <CategorySelector formData={formData} setFormData={setFormData} labelText="دسته بندی والد" />

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
