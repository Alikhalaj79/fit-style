import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { deleteCategory, getCategories } from "../../services/admin";
import {
  Box,
  Button,
  Collapse,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";

// Material UI direction setting for input
const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

const DeleteCategory = () => {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ id: "" });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [openCategories, setOpenCategories] = useState({});

  const {
    data: categoryData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["getCategories"],
    queryFn: getCategories,
  });

  const {
    mutate,
    isLoading: mutateLoading,
    error: mutateError,
  } = useMutation({
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

  const handleToggle = (categoryId) => {
    setOpenCategories((prevOpen) => ({
      ...prevOpen,
      [categoryId]: !prevOpen[categoryId],
    }));
  };

  const handleChange = (e) => {
    setForm({
      id: e.target.value,
    });
  };

  const handleDelete = (e) => {
    e.preventDefault();
    if(!form.id){
      setSnackbarMessage("لطفا یک دسته بندی را انتخاب کنید!")
      setSnackbarSeverity("error");
      setOpenSnackbar(true)
    }else{
      mutate(form.id);
    }
    console.log(form.id);
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
          <FormControl fullWidth>
            <InputLabel>انتخاب دسته</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="انتخاب دسته"
              value={form.id}
              onChange={handleChange}
              renderValue={(selected) => {
                let selectedCategory =
                  categoryData?.data?.data?.categories?.find(
                    (category) => category._id === selected
                  );

                if (!selectedCategory) {
                  categoryData?.data?.data?.categories?.forEach((category) => {
                    const childCategory = category.children?.find(
                      (child) => child._id === selected
                    );
                    if (childCategory) {
                      selectedCategory = childCategory;
                    }
                  });
                }

                return selectedCategory
                  ? selectedCategory.title
                  : "انتخاب کنید";
              }}
            >
              {categoryData?.data?.data?.categories?.map((category) => (
                <div key={category._id}>
                  <MenuItem
                    value={category._id}
                    onClick={() => setForm({ ...form, id: category._id })}
                  >
                    <Box display="flex" alignItems="center">
                      {category.title}
                      {category.children?.length > 0 && (
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggle(category._id);
                          }}
                        >
                          {openCategories[category._id] ? (
                            <ExpandLess />
                          ) : (
                            <ExpandMore />
                          )}
                        </IconButton>
                      )}
                    </Box>
                  </MenuItem>

                  {category.children?.length > 0 && (
                    <Collapse
                      in={openCategories[category._id]}
                      timeout="auto"
                      unmountOnExit
                    >
                      {category.children.map((child) => (
                        <MenuItem
                          key={child._id}
                          value={child._id}
                          sx={{ pl: 4 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setForm((prevData) => ({
                              ...prevData,
                              id: child._id,
                            }));
                          }}
                        >
                          {child.title}
                        </MenuItem>
                      ))}
                    </Collapse>
                  )}
                </div>
              ))}
            </Select>
          </FormControl>
        </CacheProvider>
        <Button
          variant="contained"
          color="error"
          type="submit"
          fullWidth
          sx={{ mt: 2 }}
        >
          {mutateLoading ? "در حال حذف..." : "حذف دسته بندی"}
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
          sx={{ width: "100%" , gap: 2 }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default DeleteCategory;
