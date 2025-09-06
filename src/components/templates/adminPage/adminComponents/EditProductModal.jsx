import React, { useState, useRef, useEffect } from "react";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  TextField,
  Button,
  IconButton,
  Typography,
  Alert,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ClearIcon from "@mui/icons-material/Clear";
import {
  convertPriceToPersian,
  getImageUrl,
  editProduct,
} from "../../../../services/productsApi";
import api from "../../../../configs/api";
import CategorySelector from "./CategorySelector";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { getCategories } from "../../../../services/admin";

// Material UI direction setting for input
const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

const EditProductModal = ({ openEditModal, onClose, product, onSave }) => {
  const queryClient = useQueryClient();

  // Get admin categories to map product category to admin category
  const { data: adminCategoriesData } = useQuery({
    queryKey: ["getCategories"],
    queryFn: getCategories,
  });

  const adminCategories = adminCategoriesData?.data?.data?.categories || [];

  // Function to find admin category ID by product category title
  const findAdminCategoryId = React.useCallback(
    (productCategory) => {
      if (!productCategory || !adminCategories.length) return "";

      // First try to find by title
      const foundByTitle = adminCategories.find(
        (cat) => cat.title === productCategory.title
      );
      if (foundByTitle) return foundByTitle._id;

      // If not found by title, try to find in children
      for (const category of adminCategories) {
        if (category.children) {
          const foundInChildren = category.children.find(
            (child) => child.title === productCategory.title
          );
          if (foundInChildren) return foundInChildren._id;
        }
      }

      return "";
    },
    [adminCategories]
  );

  // Get the admin category ID for the product's category
  const adminCategoryId = findAdminCategoryId(product?.category);

  // Debug: Log product ID
  console.log("Product ID for editing:", product?.id);
  console.log("Product _id for editing:", product?._id);
  console.log("Full product object:", product);

  const [formData, setFormData] = useState({
    images: product?.images || [],
    title: product?.title || "",
    summary: product?.summary || "",
    description: product?.description || "",
    tags: product?.tags?.join(", ") || "",
    category:
      adminCategoryId || product?.category?.id || product?.category || "",
    parent: adminCategoryId || product?.category?.id || product?.category || "",
    price: product?.price || "",
    count: product?.count || "",
  });

  // Update formData when admin categories are loaded
  useEffect(() => {
    if (adminCategories.length > 0 && product?.category) {
      const adminCategoryId = findAdminCategoryId(product.category);
      if (adminCategoryId) {
        setFormData((prev) => ({
          ...prev,
          category: adminCategoryId,
          parent: adminCategoryId,
        }));
      }
    }
  }, [adminCategories, product?.category, findAdminCategoryId]);

  const [imagePreviews, setImagePreviews] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Define refs for each input field
  const refs = {
    title: useRef(null),
    summary: useRef(null),
    description: useRef(null),
    tags: useRef(null),
    category: useRef(null),
    price: useRef(null),
    count: useRef(null),
  };

  // Edit product mutation
  const editMutation = useMutation({
    mutationFn: async (data) => {
      console.log(
        "Edit mutation - data type:",
        data instanceof FormData ? "FormData" : "JSON"
      );
      console.log("Edit mutation - data:", data);

      // If data is FormData (has images), send with multipart/form-data
      if (data instanceof FormData) {
        console.log("Sending FormData to server...");
        const response = await api.patch(
          `products/edit/${product._id || product.id}`,
          data,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        console.log("Server response:", response);
        return response.data;
      } else {
        console.log("Sending JSON to server...");
        // Use the original editProduct function for JSON data
        return await editProduct(product._id || product.id, data);
      }
    },
    onSuccess: (data) => {
      setSnackbar({
        open: true,
        message: "محصول با موفقیت ویرایش شد",
        severity: "success",
      });
      queryClient.invalidateQueries(["getProducts"]);
      onSave && onSave(data);
      onClose();
    },
    onError: (error) => {
      console.error("Edit product error:", error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "خطا در ویرایش محصول",
        severity: "error",
      });
    },
  });

  // Handler for file input (images)
  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);

    // Filter files based on size (max 2 MB)
    const validFiles = newFiles.filter((file) => {
      if (file.size > 2 * 1024 * 1024) {
        setSnackbar({
          open: true,
          message: "حجم فایل باید کمتر از ۲ مگابایت باشد.",
          severity: "error",
        });
        return false;
      }
      return true;
    });

    setNewImages((prev) => [...prev, ...validFiles]);

    // Generate image previews
    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRemoveImage = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      images: prevData.images.filter((_, i) => i !== index),
    }));
  };

  const handleRemoveNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearInput = (field) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: "",
    }));
    // Focus the cleared input field
    refs[field]?.current?.focus();
  };

  const handleSave = async () => {
    try {
      // Validate required fields
      if (!formData.title.trim()) {
        setSnackbar({
          open: true,
          message: "عنوان محصول الزامی است",
          severity: "error",
        });
        return;
      }

      if (!formData.price) {
        setSnackbar({
          open: true,
          message: "قیمت محصول الزامی است",
          severity: "error",
        });
        return;
      }

      // Prepare data for API
      const updateData = {
        title: formData.title.trim(),
        summary: formData.summary.trim(),
        description: formData.description.trim(),
        tags: formData.tags
          ? formData.tags.split(",").map((tag) => tag.trim())
          : [],
        category: formData.category || formData.parent,
        price: parseFloat(formData.price.toString().replace(/[^\d.]/g, "")),
        count: formData.count ? parseInt(formData.count) : 0,
      };

      // If there are new images, create FormData
      if (newImages.length > 0) {
        const formDataToSend = new FormData();

        // Add text fields
        Object.keys(updateData).forEach((key) => {
          if (key === "tags") {
            formDataToSend.append(key, JSON.stringify(updateData[key]));
          } else {
            formDataToSend.append(key, updateData[key]);
          }
        });

        // Add new images
        newImages.forEach((file) => {
          formDataToSend.append("images", file);
        });

        // Add existing images that weren't removed
        if (formData.images && formData.images.length > 0) {
          formDataToSend.append(
            "existingImages",
            JSON.stringify(formData.images)
          );
        }

        console.log("Sending FormData with images:", formDataToSend);
        // Debug: Log FormData contents
        for (let [key, value] of formDataToSend.entries()) {
          console.log(`FormData - ${key}:`, value);
        }
        editMutation.mutate(formDataToSend);
      } else {
        // No new images, send JSON data
        console.log("Sending JSON data:", updateData);
        editMutation.mutate(updateData);
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "خطا در آماده‌سازی داده‌ها",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <>
      <Dialog open={openEditModal} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle>ویرایش محصول</DialogTitle>

        <DialogContent dividers>
          <Grid container spacing={2}>
            {/* Image Upload */}
            <Grid item="true" size={{ xs: 12, sm: 10, md: 8 }}>
              <div
                style={{
                  border: "2px dashed #ccc",
                  padding: "60px",
                  textAlign: "center",
                  borderRadius: "8px",
                  backgroundColor: "#f9f9f9",
                  cursor: "pointer",
                }}
              >
                <input
                  type="file"
                  name="images"
                  multiple
                  accept="image/*"
                  style={{ display: "none" }}
                  id="file-upload"
                  onChange={handleFileChange}
                />
                <label htmlFor="file-upload">
                  <IconButton
                    color="primary"
                    aria-label="upload pictures"
                    component="span"
                  >
                    <CloudUploadIcon fontSize="large" />
                  </IconButton>
                  <Typography variant="body2" color="textSecondary">
                    افزودن عکس جدید
                  </Typography>
                </label>
              </div>
              <Typography variant="body2" sx={{ mt: 2, mb: 2 }}>
                حجم عکس ها باید کم تر از دو مگابایت باشد
              </Typography>

              {/* Show preview of new images */}
              {imagePreviews.length > 0 && (
                <div style={{ marginTop: "20px" }}>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    پیش‌نمایش عکس‌های جدید:
                  </Typography>
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      flexWrap: "wrap",
                    }}
                  >
                    {imagePreviews.map((src, index) => (
                      <div key={index} style={{ position: "relative" }}>
                        <img
                          src={src}
                          alt={`Preview ${index}`}
                          style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "cover",
                            borderRadius: "8px",
                          }}
                        />
                        <IconButton
                          style={{
                            position: "absolute",
                            top: "5px",
                            right: "5px",
                            backgroundColor: "rgba(255, 255, 255, 0.7)",
                          }}
                          onClick={() => handleRemoveNewImage(index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Grid>
          </Grid>

          {/* Existing Images */}
          {formData.images.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                عکس‌های موجود:
              </Typography>
              <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
                {formData.images.map((img, index) => (
                  <Box
                    key={index}
                    sx={{
                      width: 100,
                      height: 100,
                      position: "relative",
                      overflow: "hidden",
                      borderRadius: 1,
                    }}
                  >
                    <img
                      crossOrigin="anonymous"
                      src={getImageUrl(img)}
                      alt={`Product Image ${index + 1}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    <IconButton
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 4,
                        right: 4,
                        backgroundColor: "rgba(0,0,0,0.1)",
                        color: "#fff",
                        "&:hover": { backgroundColor: "rgba(0,0,0,0.8)" },
                      }}
                      onClick={() => handleRemoveImage(index)}
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          <CacheProvider value={cacheRtl}>
            <TextField
              label="عنوان محصول *"
              name="title"
              value={formData.title || ""}
              onChange={handleInputChange}
              fullWidth
              required
              margin="dense"
              inputRef={refs.title}
              onClick={() => refs.title.current?.focus()}
            />
            <TextField
              label="خلاصه محصول *"
              name="summary"
              value={formData.summary || ""}
              onChange={handleInputChange}
              fullWidth
              margin="dense"
              inputRef={refs.summary}
              onClick={() => refs.summary.current?.focus()}
            />
            <TextField
              label="توضیحات محصول *"
              name="description"
              value={formData.description || ""}
              onChange={handleInputChange}
              multiline
              rows={4}
              fullWidth
              margin="dense"
              inputRef={refs.description}
              onClick={() => refs.description.current?.focus()}
            />
            <TextField
              label="تگ‌ها (اختیاری)"
              name="tags"
              value={formData.tags || ""}
              onChange={handleInputChange}
              fullWidth
              margin="dense"
              inputRef={refs.tags}
              onClick={() => refs.tags.current?.focus()}
              placeholder="تگ‌ها را با کاما جدا کنید"
            />
            <CategorySelector
              formData={formData}
              setFormData={setFormData}
              labelText="دسته بندی (کتگوری) *"
            />
            <TextField
              label="قیمت محصول"
              name="price"
              value={formData.price || ""}
              onChange={handleInputChange}
              fullWidth
              margin="dense"
              inputRef={refs.price}
              onClick={() => refs.price.current?.focus()}
            />
            <TextField
              label="تعداد موجودی"
              name="count"
              type="number"
              value={formData.count || ""}
              onChange={handleInputChange}
              fullWidth
              margin="dense"
              inputRef={refs.count}
              onClick={() => refs.count.current?.focus()}
              inputProps={{ min: 0 }}
            />
          </CacheProvider>
        </DialogContent>

        <DialogActions sx={{ gap: 2 }}>
          <Button
            variant="outlined"
            onClick={onClose}
            disabled={editMutation.isPending}
          >
            لغو
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={editMutation.isPending}
            startIcon={
              editMutation.isPending ? <CircularProgress size={20} /> : null
            }
          >
            {editMutation.isPending ? "در حال ذخیره..." : "ذخیره تغییرات"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default EditProductModal;
