import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import {
  getImageUrl,
  convertPriceToPersian,
} from "../../../services/productsApi";

const ProductCardSecondStyle = ({ product }) => {
  // Stock count logic
  const stockCount = product.count || 0;
  const isOutOfStock = stockCount === 0;

  return (
    <Box
      sx={{
        position: "relative",
        width: { xs: "100%", sm: 240, md: 280 },
        height: 300,
        overflow: "hidden",
        margin: "12px",
        borderRadius: 4,
        transition: "all 0.3s ease-in-out",
        "&:hover .details": {
          opacity: isOutOfStock ? 0 : 1,
          transform: isOutOfStock ? "translateY(100%)" : "translateY(0)",
        },
        cursor: isOutOfStock ? "not-allowed" : "default",
        opacity: isOutOfStock ? 0.8 : 1,
      }}
    >
      {/* Out of stock overlay */}
      {isOutOfStock && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 3,
            borderRadius: 4,
            transition: "all 0.2s ease-in-out",
            pointerEvents: "none",
          }}
        >
          <Typography
            sx={{
              color: "#9e9e9e",
              fontWeight: 500,
              fontSize: "0.95rem",
              textAlign: "center",
              letterSpacing: "0.3px",
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              padding: "6px 12px",
              borderRadius: "16px",
              border: "1px solid rgba(158, 158, 158, 0.2)",
              backdropFilter: "blur(8px)",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            ناموجود
          </Typography>
        </Box>
      )}

      {/* تصویر محصول */}
      <Box
        sx={{
          width: "100%",
          height: "100%",
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f9f9f9",
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
              filter: isOutOfStock ? "grayscale(40%) brightness(0.9)" : "none",
              opacity: isOutOfStock ? 0.9 : 1,
            }}
            loading="lazy"
            crossOrigin="anonymous"
          />
        </picture>
      </Box>

      {/* جزئیات هنگام هاور */}
      <Box
        className="details"
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0, 0, 0, 0.7)",
          color: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          opacity: 0,
          transform: "translateY(100%)",
          transition: "all 0.3s ease-in-out",
          padding: 2,
          pointerEvents: isOutOfStock ? "none" : "auto",
        }}
      >
        <Typography
          variant="body1"
          sx={{
            fontWeight: 600,
            fontSize: "1rem",
            textAlign: "center",
            mb: 1,
            color: "white",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {product.title}
        </Typography>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            fontSize: "1.1rem",
            color: "#FF6F00",
            mb: 2,
          }}
        >
          {convertPriceToPersian(product.price)} تومان
        </Typography>
      </Box>

      {/* دکمه خرید کنید */}
      <Button
        component={isOutOfStock ? "span" : Link}
        to={isOutOfStock ? undefined : `/product/${product.id}`}
        disabled={isOutOfStock}
        sx={{
          position: "absolute",
          bottom: 8,
          left: 8,
          backgroundColor: isOutOfStock ? "#e0e0e0" : "#f4a261",
          color: isOutOfStock ? "#9e9e9e" : "#fff",
          borderRadius: 20,
          padding: "6px 16px",
          fontWeight: 600,
          textTransform: "none",
          cursor: isOutOfStock ? "not-allowed" : "pointer",
          "&:hover": {
            backgroundColor: isOutOfStock ? "#e0e0e0" : "#e07a5f",
          },
          "&:disabled": {
            backgroundColor: "#e0e0e0",
            color: "#9e9e9e",
          },
          zIndex: 1,
        }}
      >
        {isOutOfStock ? "ناموجود" : "جزئیات محصول"}
      </Button>
    </Box>
  );
};

export default ProductCardSecondStyle;
