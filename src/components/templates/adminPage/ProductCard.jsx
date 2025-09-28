import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Checkbox,
  IconButton,
  Tooltip,
  Chip,
  Stack,
  CircularProgress,
} from "@mui/material";
import {
  convertPriceToPersian,
  getImageUrl,
} from "../../../services/productsApi";
import ImageModal from "./adminComponents/ImageModal";
import EditProductModal from "./adminComponents/EditProductModal";
import DeleteProductModal from "./adminComponents/DeleteProductModal";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
} from "@mui/icons-material";

const ProductCard = ({ product, isAdmin, isSelected = false, onSelect }) => {
  const [openImage, setOpenImage] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Stock count logic
  const stockCount = product.count || 0;
  const isOutOfStock = stockCount === 0;
  const isLowStock = stockCount > 0 && stockCount < 5;

  const handleOpenImage = () => {
    setOpenImage(true);
  };

  const handleCloseImage = () => {
    setOpenImage(false);
  };

  const handleEditClick = () => {
    setOpenEditModal(true);
  };

  const handleEditSave = (updatedData) => {
    console.log("Updated data:", updatedData);
  };

  const handleDelete = () => {
    setOpenDeleteModal(true);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <Card
      sx={{
        width: { xs: "100%", sm: 240, md: 280 },
        borderRadius: 4,
        boxShadow: isSelected
          ? "0 0 10px rgba(25, 118, 210, 0.4)"
          : "0 2px 6px rgba(0, 0, 0, 0.05)",
        overflow: "hidden",
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
        },
        backgroundColor: isSelected ? "#F3F8FF" : "#fff",
        margin: "12px",
        position: "relative",
        display: "block",
        height: "auto",
        cursor: "default",
      }}
    >
      {/* Selection Checkbox */}
      {isAdmin && (
        <Box
          sx={{
            position: "absolute",
            top: 8,
            left: 8,
            zIndex: 3,
          }}
        >
          <Checkbox
            checked={isSelected}
            onChange={() => {
              console.log(
                "Checkbox onChange triggered for product:",
                product.id
              );
              onSelect && onSelect();
            }}
            sx={{
              bgcolor: "rgba(255,255,255,0.95)",
              borderRadius: "50%",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              "&:hover": {
                bgcolor: "rgba(255,255,255,1)",
                transform: "scale(1.1)",
              },
              "&.Mui-checked": {
                bgcolor: "primary.main",
                color: "white",
              },
            }}
          />
        </Box>
      )}

      {/* Product Image */}
      <Box
        sx={{
          height: { xs: 240, sm: 200 },
          width: "100%",
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f9f9f9",
          cursor: "pointer",
          flexShrink: 0,
        }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleOpenImage();
        }}
      >
        <picture>
          <source
            srcSet={
              product?.images?.length > 0
                ? getImageUrl(product.images[0], "webp")
                : "placeholder.webp"
            }
            type="image/webp"
          />
          <img
            src={
              product?.images?.length > 0
                ? getImageUrl(product.images[0])
                : "placeholder.jpg"
            }
            alt={product?.title || "محصول"}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.3s",
            }}
            loading="lazy"
            crossOrigin="anonymous"
          />
        </picture>
      </Box>

      {/* Content */}
      <CardContent
        sx={{
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          flex: 1,
          minWidth: 0,
          justifyContent: "space-between",
          height: "auto",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {/* Product Title */}
          <Typography
            variant="body1"
            sx={{
              fontWeight: 600,
              fontSize: "1rem",
              color: "#212121",
              whiteSpace: "normal",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              lineHeight: 1.4,
            }}
          >
            {product.title}
          </Typography>

          {/* Product Summary */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontSize: "0.875rem",
              color: "#666",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              lineHeight: 1.4,
            }}
          >
            {product.summary}
          </Typography>

          {/* Price */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: "1.1rem",
              color: "#FF6F00",
            }}
          >
            {convertPriceToPersian(product.price)} تومان
          </Typography>

          {/* Stock Information */}
          <Chip
            label={
              isOutOfStock
                ? "ناموجود"
                : isLowStock
                ? `${stockCount} عدد باقی مانده`
                : `${stockCount} عدد موجود`
            }
            size="small"
            sx={{
              backgroundColor: isOutOfStock
                ? "#ffebee"
                : isLowStock
                ? "#fff3e0"
                : "#e8f5e8",
              color: isOutOfStock
                ? "#d32f2f"
                : isLowStock
                ? "#f57c00"
                : "#2e7d32",
              fontWeight: 600,
              fontSize: "0.75rem",
              alignSelf: "flex-start",
            }}
          />
        </Box>
      </CardContent>

      {/* Action Buttons */}
      <Box
        sx={{
          padding: "0 16px 16px",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          gap: 1.5,
        }}
      >
        {isAdmin ? (
          <Stack direction="row" spacing={1} sx={{ width: "100%" }}>
            <Tooltip title="ویرایش محصول" arrow>
              <IconButton
                size="small"
                color="secondary"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleEditClick();
                }}
                sx={{
                  bgcolor: "rgba(156, 39, 176, 0.1)",
                  "&:hover": {
                    bgcolor: "rgba(156, 39, 176, 0.2)",
                  },
                }}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="حذف محصول" arrow>
              <IconButton
                size="small"
                color="error"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleDelete();
                }}
                sx={{
                  bgcolor: "rgba(244, 67, 54, 0.1)",
                  "&:hover": {
                    bgcolor: "rgba(244, 67, 54, 0.2)",
                  },
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        ) : (
          <Button
            fullWidth
            variant="contained"
            size="medium"
            sx={{
              borderRadius: 2,
              backgroundColor: "#222222",
              color: "#fff",
              fontWeight: 600,
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#F57C00",
              },
            }}
          >
            اضافه به سبد خرید
          </Button>
        )}
      </Box>

      {/* Modals */}
      <ImageModal
        images={product.images.map((img) => getImageUrl(img))}
        openImage={openImage}
        handleCloseImage={handleCloseImage}
      />

      <EditProductModal
        openEditModal={openEditModal}
        onClose={() => setOpenEditModal(false)}
        product={product}
        onSave={handleEditSave}
      />

      <DeleteProductModal
        openDeleteModal={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        product={product}
      />
    </Card>
  );
};

export default ProductCard;
