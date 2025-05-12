import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { deleteCategory } from "../../../../services/admin";
import { Box, Button, Typography, Snackbar, Alert } from "@mui/material";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import CategorySelector from "./CategorySelector";

// تنظیم جهت RTL
const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

const DeleteCategory = () => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({ parent: "" }); // اصلاح به `parent` برای هماهنگی با CategorySelector
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // Mutation برای حذف دسته‌بندی
  const { mutate, isPending } = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getCategories"] });
      setSnackbarMessage("دسته‌ بندی با موفقیت حذف شد!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    },
    onError: (error) => {
      console.log(error);
      setSnackbarMessage("خطا در حذف دسته‌ بندی");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    },
  });

  const handleDelete = (e) => {
    e.preventDefault();
    if (!formData.parent) {
      setSnackbarMessage("لطفا یک دسته بندی را انتخاب کنید!");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } else {
      mutate(formData.parent); // مطمئن شوید که ID درست به mutate ارسال می‌شود
    }
    console.log("دسته انتخاب شده:", formData.parent);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <div>
      <Typography variant="h6" mt={3}>
        حذف دسته بندی
      </Typography>
      <Box
        component="form"
        onSubmit={handleDelete}
        sx={{ maxWidth: 400, mt: 4 }}
      >
        <CacheProvider value={cacheRtl}>
          <CategorySelector
            formData={formData}
            setFormData={setFormData}
            labelText="دسته بندی مورد نظر را انتخاب کنید"
          />
        </CacheProvider>
        <Button
          variant="contained"
          color="error"
          type="submit"
          fullWidth
          sx={{ mt: 2 }}
        >
          {isPending ? "در حال حذف..." : "حذف دسته بندی"}
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

export default DeleteCategory;
