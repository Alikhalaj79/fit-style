import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Box, CircularProgress, Typography } from "@mui/material";
import ProductCard from "./ProductCard";
import { getProducts } from "../../../services/productsApi";

// تابع دریافت ۸ محصول تصادفی
const getRandomProducts = (products, count = 6) => {
  if (!products || products.length === 0) return [];
  const shuffled = [...products].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const ProductsSection = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["getProducts"],
    queryFn: getProducts,
  });

  if (isLoading) return <CircularProgress />;
  if (error) return <Typography>خطا در دریافت محصولات</Typography>;

  const products = data?.data?.data?.products || [];
  const randomProducts = getRandomProducts(products);

  return (
    <Box sx={{ mt: 10, px: 2 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
        محصولات ویژه
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap",  justifyContent:"space-between" }}>
        {randomProducts.map((product) => (
          <ProductCard key={product.id} product={product} isAdmin={false} />
        ))}
      </Box>
    </Box>
  );
};

export default ProductsSection;
