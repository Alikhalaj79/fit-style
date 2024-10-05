import React, { useState } from "react";
import {
  TextField,
  Button,
  Snackbar,
  Alert,
  Typography,
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  IconButton,
  Collapse,
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import { createCategory, getCategories } from "../../services/admin";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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

  const [openCategories, setOpenCategories] = useState({});

  const { data: getCategoriesData } = useQuery({
    queryKey: ["getCategories"],
    queryFn: getCategories,
  });

  const { mutate, isLoading, error } = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getCategories"] });
      setSnackbarMessage("دسته‌بندی با موفقیت ایجاد شد!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    },
    onError: (error) => {
      console.log(error);
      setSnackbarMessage("خطا در ایجاد دسته‌بندی");
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

  const handleToggle = (categoryId) => {
    setOpenCategories((prevOpen) => ({
      ...prevOpen,
      [categoryId]: !prevOpen[categoryId],
    }));
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <div>
      <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, mt: 3 }}>
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

          <FormControl fullWidth margin="normal">
            <InputLabel>دسته‌بندی والد</InputLabel>
            <Select
              label="دسته‌بندی والد"
              name="parent"
              value={formData.parent}
              onChange={(e) =>
                setFormData({ ...formData, parent: e.target.value })
              }
              renderValue={(selected) => {
                // search in parents
                let selectedCategory =
                  getCategoriesData?.data?.data?.categories?.find(
                    (category) => category._id === selected
                  );

                // search in children if category not found in parents
                if (!selectedCategory) {
                  getCategoriesData?.data?.data?.categories?.forEach(
                    (category) => {
                      const childCategory = category.children?.find(
                        (child) => child._id === selected
                      );
                      if (childCategory) {
                        selectedCategory = childCategory;
                      }
                    }
                  );
                }

                return selectedCategory
                  ? selectedCategory.title
                  : "انتخاب کنید";
              }}
            >
              {getCategoriesData?.data?.data?.categories?.map((category) => (
                <React.Fragment key={category._id}>
                  <MenuItem
                    value={category._id}
                    onClick={() =>
                      setFormData({ ...formData, parent: category._id })
                    }
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

                      {/* show children categories */}
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
                            setFormData((prevData) => ({
                              ...prevData,
                              parent: child._id,
                            }));
                          }}
                        >
                          {child.title}
                        </MenuItem>
                      ))}
                    </Collapse>
                  )}
                </React.Fragment>
              ))}
            </Select>
          </FormControl>
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
          sx={{ width: "100%" ,gap: 2}}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default CategoryForm;
