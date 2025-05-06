import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Divider,
  CircularProgress,
  Alert,
  Paper,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchProductById, getImageUrl } from "../services/productsApi";
import { addToCart } from "../services/cartApi";

const ProductDetails = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [selectedImage, setSelectedImage] = useState(0);

  // دریافت اطلاعات محصول
  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProductById(id),
  });

  // موتاسیون برای اضافه کردن به سبد خرید
  const addToCartMutation = useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      queryClient.invalidateQueries(["cart"]);
    },
  });

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        خطا در دریافت اطلاعات محصول
      </Alert>
    );
  }

  if (!product?.data?.product) {
    return (
      <Alert severity="warning" sx={{ mt: 2 }}>
        محصول مورد نظر یافت نشد
      </Alert>
    );
  }

  const productData = product.data.product;

  const fixImagePath = (path) => {
    if (!path) return null;

    // همیشه به جلو / تبدیل کن
    let fixedPath = path.replace(/\\/g, "/");

    // اگه شامل upload هست، فقط از upload به بعد نگه دار
    const uploadIndex = fixedPath.indexOf("/upload/");
    if (uploadIndex !== -1) {
      fixedPath = fixedPath.substring(uploadIndex + 1); // از upload به بعد
    }

    return fixedPath;
  };

  // بررسی وجود تصاویر
  const productImages = productData.images
    ? Array.isArray(productData.images)
      ? productData.images.map((img) => {
          const fixedPath = fixImagePath(img);
          return `http://localhost:3000/${fixedPath}`;
        })
      : [`http://localhost:3000/${fixImagePath(productData.images)}`]
    : [];
  const mainImage = productImages[selectedImage] || "";

  console.log("Product Images:", productImages);
  console.log("Main Image:", mainImage);

  const handleAddToCart = () => {
    addToCartMutation.mutate(productData.id);
  };

  return (
    <Container
      maxWidth="lg"
      sx={{ py: 8, minHeight: "80vh", px: { xs: 1, md: 2 } }}
    >
      <Paper
        elevation={0}
        sx={{
          borderRadius: 2,
          border: "1px solid #e0e0e0",
          backgroundColor: "#fff",
          overflow: "hidden",
          minHeight: "50vh",
        }}
      >
        <Grid container sx={{ height: "100%" }}>
          {/* تصاویر محصول */}
          <Grid item xs={12} md={6} sx={{ height: "100%" }}>
            <Box
              sx={{
                p: 2,
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {mainImage && (
                <Box
                  component="img"
                  src={mainImage}
                  alt={productData.title}
                  sx={{
                    width: "100%",
                    height: { xs: 300, sm: 400, md: "60%" },
                    objectFit: "contain",
                    mb: 2,
                    borderRadius: 1,
                  }}
                />
              )}
              {productImages && productImages.length > 0 && (
                <Grid container spacing={1} sx={{ mt: "auto" }}>
                  {productImages.map((image, index) => (
                    <Grid item key={index} xs={4} sm={3}>
                      <Box
                        component="img"
                        src={image}
                        alt={`تصویر ${index + 1}`}
                        onClick={() => setSelectedImage(index)}
                        sx={{
                          width: "100%",
                          height: { xs: 80, sm: 100 },
                          objectFit: "cover",
                          cursor: "pointer",
                          borderRadius: 1,
                          border:
                            selectedImage === index
                              ? "2px solid #FF6B00"
                              : "1px solid #e0e0e0",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            border: "2px solid #FF6B00",
                            transform: "scale(1.02)",
                          },
                        }}
                      />
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          </Grid>

          {/* اطلاعات محصول */}
          <Grid item xs={12} md={6} sx={{ height: "100%" }}>
            <Box
              sx={{
                p: 3,
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography
                variant="h4"
                component="h4"
                gutterBottom
                sx={{
                  fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
                  color: "#333",
                }}
              >
                {productData.title}
              </Typography>

              <Typography
                variant="subtitle1"
                color="text.secondary"
                gutterBottom
                sx={{
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                  color: "#666",
                }}
              >
                {productData.summary}
              </Typography>

              <Typography
                variant="h5"
                gutterBottom
                sx={{
                  fontSize: { xs: "1.25rem", sm: "1.5rem" },
                  color: "#FF6B00",
                  fontWeight: "bold",
                  mt: 2,
                }}
              >
                {productData.price ? productData.price.toLocaleString() : "0"}{" "}
                تومان
              </Typography>

              <Typography
                variant="body1"
                paragraph
                sx={{
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                  lineHeight: 1.8,
                  color: "#666",
                  mt: 3,
                  flex: 1,
                }}
              >
                {productData.description}
              </Typography>

              <Box display="flex" gap={2} mt="auto">
                <Button
                  variant="contained"
                  startIcon={<ShoppingCartIcon />}
                  onClick={handleAddToCart}
                  sx={{
                    flex: 1,
                    borderRadius: 1,
                    py: 1.5,
                    backgroundColor: "#FF6B00",
                    "&:hover": { backgroundColor: "#E65A00" },
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                  }}
                >
                  افزودن به سبد خرید
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ProductDetails;
