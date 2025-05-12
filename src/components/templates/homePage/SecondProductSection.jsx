import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Box, CircularProgress, Typography } from "@mui/material";
// import ProductCardSecondStyle from "./ProductCardSecondStyle";
import { getProducts } from "../../../services/productsApi";
import ProductCardSecondStyle from "./ProductCardSecondStyle";

// تابع دریافت 6 محصول جدید
const getLatestProducts = (products, count = 6) => {
  if (!products || products.length === 0) return [];
  return products.slice(0, count); // فرض بر اینه که محصولات از جدید به قدیم مرتب شدن
};

const SecondProductSection = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["getProducts"],
    queryFn: getProducts,
  });

  if (isLoading) return <CircularProgress />;
  if (error) return <Typography>خطا در دریافت محصولات</Typography>;

  const products = data?.data?.data?.products || [];
  const latestProducts = getLatestProducts(products);

  return (
    <Box sx={{ mt: 10, px: 2 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
        جدیدترین‌ها
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        {latestProducts.map((product) => (
          <ProductCardSecondStyle
            key={product.id}
            product={product}
            isAdmin={false}
          />
        ))}
      </Box>
    </Box>
  );
};

export default SecondProductSection;
