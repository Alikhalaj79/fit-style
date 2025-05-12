import React, { useState, useRef } from "react";
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
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ClearIcon from "@mui/icons-material/Clear";
import {
  convertPriceToPersian,
  getImageUrl,
} from "../../../../services/productsApi";
import CategorySelector from "./CategorySelector";

// Material UI direction setting for input
const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

const EditProductModal = ({ openEditModal, onClose, product, onSave }) => {
  const [formData, setFormData] = useState({
    images: product?.images || [],
    title: product?.title || "",
    summary: product?.summary || "",
    description: product?.description || "",
    tags: product?.tags?.join(", ") || [],
    category: product?.category || "",
    // parent: product?.category || "",
    price: product?.price || "",
  });

  const [imagePreviews, setImagePreviews] = useState([]);

  // Define refs for each input field
  const refs = {
    title: useRef(null),
    summary: useRef(null),
    description: useRef(null),
    tags: useRef(null),
    category: useRef(null),
    price: useRef(null),
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

    setFormData((prevData) => ({
      ...prevData,
      images: [...prevData.images, ...validFiles],
    }));

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

  const handleClearInput = (field) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: "",
    }));
    // Focus the cleared input field
    refs[field]?.current?.focus();
  };

  const handleSave = () => {
    // const updatedData = {
    //   ...formData,
    //   tags: formData.tags.split(",").map((tag) => tag.trim()),
    //   price: formData.price.replace(/[^\d.]/g, ""), // Convert Persian numbers if needed
    // };
    // onSave(updatedData);
    // onClose();
    console.log(formData);
  };

  return (
    <Dialog open={openEditModal} onClose={onClose} fullWidth maxWidth="sm">
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
                  افزودن عکس
                </Typography>
              </label>
            </div>
            <Typography variant="body2" sx={{ mt: 2, mb: 2 }}>
              حجم عکس ها باید کم تر از دو مگابایت باشد
            </Typography>

            {/* Show preview of selected images */}
            {imagePreviews.length > 0 && (
              <div style={{ marginTop: "20px" }}>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  پیش‌نمایش :
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
        </Grid>

        <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
          {formData.images.map((img, index) => (
            <Box
              key={index}
              sx={{
                // width: 100,
                height: 100,
                position: "relative",
                overflow: "hidden",
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

        <CacheProvider value={cacheRtl}>
          <TextField
            label="عنوان"
            name="title"
            value={formData.title || ""}
            onChange={handleInputChange}
            fullWidth
            required
            margin="dense"
            inputRef={refs.title} // Attach ref
            onClick={() => refs.title.current?.focus()} // Focus on click
          />
          <TextField
            label="خلاصه"
            name="summary"
            value={formData.summary || ""}
            onChange={handleInputChange}
            fullWidth
            margin="dense"
            inputRef={refs.summary}
            onClick={() => refs.summary.current?.focus()}
          />
          <TextField
            label="توضیحات"
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
            label="تگ"
            name="tags"
            value={formData.tags || ""}
            onChange={handleInputChange}
            fullWidth
            margin="dense"
            inputRef={refs.tags}
            onClick={() => refs.tags.current?.focus()}
          />
          <CategorySelector
            formData={formData}
            setFormData={setFormData}
            labelText="دسته‌بندی"
          />
          <TextField
            label="قیمت"
            name="price"
            value={convertPriceToPersian(formData.price || "")}
            onChange={handleInputChange}
            fullWidth
            margin="dense"
            inputRef={refs.price}
            onClick={() => refs.price.current?.focus()}
          />
        </CacheProvider>
      </DialogContent>

      <DialogActions sx={{ gap: 2 }}>
        <Button variant="contained" color="error" onClick={onClose}>
          لغو
        </Button>
        <Button variant="contained" color="primary" onClick={handleSave}>
          ذخیره تغییرات
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProductModal;
