import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Box, Typography, Container, CircularProgress } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import ProductCard from "./ProductCard";
import { getProducts } from "../../../services/productsApi";

// Custom styles for Swiper
const swiperStyles = `
  .similar-products-swiper {
    padding: 20px 0;
  }
  
  .similar-products-swiper .swiper-button-next,
  .similar-products-swiper .swiper-button-prev {
    color: #FF6B00;
    background: rgba(255, 255, 255, 0.9);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
  }
  
  .similar-products-swiper .swiper-button-next:hover,
  .similar-products-swiper .swiper-button-prev:hover {
    background: rgba(255, 255, 255, 1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: scale(1.1);
  }
  
  .similar-products-swiper .swiper-button-next::after,
  .similar-products-swiper .swiper-button-prev::after {
    font-size: 18px;
    font-weight: bold;
  }
  
  .similar-products-swiper .swiper-pagination {
    bottom: 0;
  }
  
  .similar-products-swiper .swiper-pagination-bullet {
    background: #ccc;
    opacity: 0.5;
    width: 10px;
    height: 10px;
    transition: all 0.3s ease;
  }
  
  .similar-products-swiper .swiper-pagination-bullet-active {
    background: #FF6B00;
    opacity: 1;
    transform: scale(1.2);
  }
  
  .similar-products-swiper .swiper-slide {
    height: auto;
  }
  
  @media (max-width: 768px) {
    .similar-products-swiper .swiper-button-next,
    .similar-products-swiper .swiper-button-prev {
      width: 35px;
      height: 35px;
    }
    
    .similar-products-swiper .swiper-button-next::after,
    .similar-products-swiper .swiper-button-prev::after {
      font-size: 16px;
    }
  }
`;

const SimilarProducts = ({ categoryId, currentProductId, limit = 8 }) => {
  const {
    data: products,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress size={40} />
      </Box>
    );
  }

  if (error || !products?.data?.products) {
    return null;
  }

  // Filter products by category and exclude current product
  const similarProducts = products.data.products
    .filter(
      (product) =>
        product._id !== currentProductId &&
        product.images &&
        product.images.length > 0
    )
    .slice(0, limit);

  if (similarProducts.length === 0) {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <style>{swiperStyles}</style>
      <Typography
        variant="h4"
        component="h2"
        sx={{
          fontSize: { xs: "1.5rem", sm: "2rem", md: "2.25rem" },
          color: "#333",
          fontWeight: 700,
          mb: 3,
          textAlign: "center",
          position: "relative",
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: -8,
            left: "50%",
            transform: "translateX(-50%)",
            width: 60,
            height: 3,
            backgroundColor: "#FF6B00",
            borderRadius: 2,
          },
        }}
      >
        محصولات مشابه
      </Typography>

      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={20}
        slidesPerView={1}
        navigation={true}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        loop={similarProducts.length > 4}
        breakpoints={{
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 20,
          },
        }}
        style={{
          padding: "20px 0",
        }}
        className="similar-products-swiper"
      >
        {similarProducts.map((product) => (
          <SwiperSlide key={product._id}>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <ProductCard
                product={{
                  id: product._id,
                  title: product.title,
                  price: product.price,
                  images: product.images,
                  category: product.category,
                }}
              />
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>
    </Container>
  );
};

export default SimilarProducts;
