import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Grid,
  Breadcrumbs,
  Link as MuiLink,
  Pagination,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ProductCard from "../components/templates/homePage/ProductCard";
import { getProducts } from "../services/productsApi";

const ITEMS_PER_PAGE = 8;

const ProductsByCategoryPage = () => {
  const { categorySlug } = useParams();
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: productsData,
    isLoading: isLoadingProducts,
    error: productsError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  if (isLoadingProducts) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (productsError) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">
          خطا در دریافت محصولات: {productsError.message}
        </Alert>
      </Container>
    );
  }

  const allProducts = productsData?.data?.products || [];

  const filteredProducts = allProducts.filter(
    (product) => product.category?.slug === categorySlug
  );

  let currentCategoryName = categorySlug;
  if (filteredProducts.length > 0 && filteredProducts[0].category?.title) {
    currentCategoryName = filteredProducts[0].category.title;
  }

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo(0, 0);
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
        sx={{ mb: 3 }}
      >
        <MuiLink
          component={RouterLink}
          underline="hover"
          color="inherit"
          to="/"
        >
          خانه
        </MuiLink>
        <MuiLink
          component={RouterLink}
          underline="hover"
          color="inherit"
          to="/categories"
        >
          دسته‌بندی‌ها
        </MuiLink>
        <Typography color="text.primary">{currentCategoryName}</Typography>
      </Breadcrumbs>

      <Typography variant="h6" component="h6" fontWeight="bold" gutterBottom>
        محصولات دسته‌بندی : {currentCategoryName}
      </Typography>

      {filteredProducts.length === 0 && !isLoadingProducts && (
        <Typography align="center" color="text.secondary" sx={{ mt: 4 }}>
          محصولی در این دسته‌بندی یافت نشد.
        </Typography>
      )}

      {paginatedProducts.length > 0 && (
        <>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            {paginatedProducts.map((product) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                key={product._id || product.id}
                sx={{
                  padding: "12px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <ProductCard product={product} isAdmin={false} />
              </Grid>
            ))}
          </Grid>
          {totalPages > 1 && (
            <Box display="flex" justifyContent="center" sx={{ mt: 4, py: 2 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default ProductsByCategoryPage;
