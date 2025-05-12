import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import {
  getImageUrl,
  convertPriceToPersian,
} from "../../../services/productsApi";

const ProductCardSecondStyle = ({ product }) => {
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
          opacity: 1,
          transform: "translateY(0)",
        },
      }}
    >
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
        component={Link}
        to={`/product/${product.id}`}
        sx={{
          position: "absolute",
          bottom: 8,
          left: 8,
          backgroundColor: "#f4a261",
          color: "#fff",
          borderRadius: 20,
          padding: "6px 16px",
          fontWeight: 600,
          textTransform: "none",
          "&:hover": {
            backgroundColor: "#e07a5f",
          },
          zIndex: 1,
        }}
      >
        جزئیات محصول
      </Button>
    </Box>
  );
};

export default ProductCardSecondStyle;
