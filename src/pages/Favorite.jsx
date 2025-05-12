import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Container,
} from "@mui/material";
import ProductCard from "../components/templates/homePage/ProductCard";
import { fetchFavoriteProducts } from "../services/favoriteApi";

const Favorite = () => {
  const { data: favoriteProducts, isLoading } = useQuery({
    queryKey: ["favorite"],
    queryFn: fetchFavoriteProducts,
  });

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography
        variant="h5"
        sx={{
          fontWeight: 700,
          mb: 4,
          color: "#212121",
        }}
      >
        محصولات مورد علاقه
      </Typography>

      {favoriteProducts?.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "50vh",
            gap: 2,
          }}
        >
          <Typography variant="h6" color="text.secondary">
            هنوز محصولی به علاقه‌مندی‌ها اضافه نکرده‌اید
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {favoriteProducts?.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Favorite;
