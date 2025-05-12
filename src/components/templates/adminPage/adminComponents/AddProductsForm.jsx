import React, { useState } from "react";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import { useQueryClient } from "@tanstack/react-query";
import CategorySelector from "./CategorySelector";
import axios from "axios";

// Material UI direction setting for input
const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

const AddProductForm = () => {
  const queryClient = useQueryClient();

  // Snackbar state management
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    description: "",
    tags: [],
    category: "",
    price: "",
    images: [],
  });

  const [imagePreviews, setImagePreviews] = useState([]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handler for file input (images)
  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);

    // Filter files based on size (max 2 MB)
    const validFiles = newFiles.filter((file) => {
      if (file.size > 2 * 1024 * 1024) {
        setSnackbarMessage("حجم فایل باید کمتر از ۲ مگابایت باشد.");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        return false;
      }
      return true;
    });

    const allFiles = [...formData.images, ...validFiles];
   
    // Update formData with the selected files
    setFormData((prevData) => ({
      ...prevData,
      images: allFiles,
    }));

    // Generate image previews
    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
  };

  // Clear selected images
  const clearImages = () => {
    setFormData((prevData) => ({
      ...prevData,
      images: [],
    }));
    setImagePreviews([]);
  };

  // Clear a specific image
  const removeImage = (indexToRemove) => {
    setFormData((prevData) => ({
      ...prevData,
      images: prevData.images.filter((_, index) => index !== indexToRemove),
    }));
    setImagePreviews((prevPreviews) =>
      prevPreviews.filter((_, index) => index !== indexToRemove)
    );
  };

  // Form submission handler
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(formData);
    const filteredProduct = { ...formData };
    //delete tags if its empty
    if (!filteredProduct.tags || filteredProduct.tags.length === 0) {
      delete filteredProduct.tags;
    } else if (typeof filteredProduct.tags === "string") {
      // change tags to array
      filteredProduct.tags = filteredProduct.tags
        .split(",")
        .map((tag) => tag.trim());
    }

    if (filteredProduct.parent) {
      filteredProduct.category = filteredProduct.parent; // Move parent to category
      delete filteredProduct.parent; // Remove parent field
    }

    // Create a FormData object and add modified fields
    const formDataObj = new FormData();
    Object.keys(filteredProduct).forEach((key) => {
      if (Array.isArray(filteredProduct[key])) {
        // Add array elements separately (e.g., images or tags)
        filteredProduct[key].forEach((value) => {
          formDataObj.append(key, value);
        });
      } else {
        formDataObj.append(key, filteredProduct[key]);
      }
    });

   try {
    // Use axios.post directly with base URL from environment variables
     await axios.post(
      `${import.meta.env.VITE_BASE_URL}products/add`,
      formDataObj,
      { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true }
    );

     queryClient.invalidateQueries({ queryKey: ["getProducts"] });
     setSnackbarMessage("محصول با موفقیت اضافه شد!");
     setSnackbarSeverity("success");
     setOpenSnackbar(true);
  } catch (error) {
    setSnackbarMessage("خطا در اضافه کردن محصول");
    setSnackbarSeverity("error");
    setOpenSnackbar(true);
  }
  };
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <div>
      <Card sx={{ maxWidth: 600, mt: 4 }}>
        <CardContent>
          <CacheProvider value={cacheRtl}>
            <Typography
              sx={{ mt: 2, mb: 4 }}
              variant="h5"
              component="div"
              gutterBottom
            >
              اضافه کردن محصول جدید
            </Typography>
            <form onSubmit={handleSubmit}>
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
                        افزودن عکس
                      </Typography>
                    </label>
                  </div>
                      <Typography variant="body2" sx={{mt: 2}}>حجم عکس ها باید کم تر از دو مگابایت باشد</Typography>

                  {/* Show preview of selected images */}
                  {imagePreviews.length > 0 && (
                    <div style={{ marginTop: "20px" }}>
                      <Typography variant="body1" sx={{mb: 2}}>پیش‌نمایش :</Typography>
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
                              onClick={() => removeImage(index)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </div>
                        ))}
                      </div>
                      <Button
                        startIcon={<DeleteIcon />}
                        variant="outlined"
                        color="secondary"
                        onClick={clearImages}
                        sx={{ marginTop: "10px" }}
                      >
                        پاک کردن همه عکس‌ها
                      </Button>
                    </div>
                  )}
                </Grid>

                {/* Title */}
                <Grid item="true" size={{ xs: 12, sm: 10, md: 8 }}>
                  <TextField
                    label="عنوان"
                    fullWidth
                    required
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                  />
                </Grid>

                {/* Summary */}
                <Grid item="true" size={{ xs: 12, sm: 10, md: 8 }}>
                  <TextField
                    label="متن محصول"
                    fullWidth
                    required
                    name="summary"
                    value={formData.summary}
                    onChange={handleChange}
                  />
                </Grid>

                {/* Description */}
                <Grid item="true" size={{ xs: 12, sm: 10, md: 8 }}>
                  <TextField
                    label="توضیحات"
                    fullWidth
                    multiline
                    rows={4}
                    required
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </Grid>

                {/* Tags */}
                <Grid item="true" size={{ xs: 12, sm: 10, md: 8 }}>
                  <TextField
                    label="تگ"
                    fullWidth
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                  />
                </Grid>

                {/* Category */}
                <Grid item="true" size={{ xs: 12, sm: 10, md: 8 }}>
                  <CategorySelector
                    formData={formData}
                    setFormData={setFormData}
                    labelText="دسته بندی (کتگوری) *"
                  />
                </Grid>

                {/* Price */}
                <Grid item="true" size={{ xs: 12, sm: 10, md: 8 }}>
                  <TextField
                    label="قیمت"
                    fullWidth
                    required
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                  />
                </Grid>

                {/* Submit Button */}
                <Grid
                  item="true"
                  size={{ xs: 12, sm: 10, md: 8 }}
                  sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}
                >
                  <Button type="submit" variant="contained" color="primary">
                    ثبت محصول
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CacheProvider>
        </CardContent>
      </Card>
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

export default AddProductForm;
