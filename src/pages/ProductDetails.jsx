import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  CircularProgress,
  Alert,
  IconButton,
  Chip,
  Breadcrumbs,
  Link,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchProductById,
  getImageUrl,
  convertPriceToPersian,
} from "../services/productsApi";
import { fetchCart } from "../services/cartApi";
import { useCartMutations } from "../kooks/useCartMutation";
import { getUserProfile } from "../services/users";
import ImageModal from "../components/templates/layout/ImageModal";
// import SimilarProducts from "../components/templates/homePage/SimilarProducts";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [selectedImage, setSelectedImage] = useState(0);
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [openImageModal, setOpenImageModal] = useState(false);
  const [loadingAction, setLoadingAction] = useState(null); // "add" | "increase" | "decrease" | "remove"
  const [pendingProductId, setPendingProductId] = useState(null);

  // Get product information
  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProductById(id),
  });

  // Get cart data
  const { data: cartData, isFetching } = useQuery({
    queryKey: ["cart"],
    queryFn: fetchCart,
    staleTime: 1000 * 60,
  });

  const { addMutation, increaseMutation, decreaseMutation, removeMutation } =
    useCartMutations({
      setPendingProductId,
      setLoadingAction,
    });

  // Define productData before use
  const productData = product?.data?.product;

  const productInCart = cartData?.items?.find(
    (item) => item.productId._id === productData?._id
  );

  const isPending = pendingProductId === productData?._id;

  // Reset loadingAction when pendingProductId becomes null
  useEffect(() => {
    if (!pendingProductId) {
      setLoadingAction(null);
    }
  }, [pendingProductId]);

  const handleAddToCart = async () => {
    setLoadingAction("add");
    try {
      const profileData = queryClient.getQueryData(["profile"]);

      if (!profileData?.data?.data?.user) {
        const response = await getUserProfile();
        if (!response?.data?.data?.user) {
          setOpenLoginModal(true);
          setLoadingAction(null);
          return;
        }
        // Update profile data in cache
        queryClient.setQueryData(["profile"], response);
      }

      addMutation.mutate({ productId: productData._id, quantity: 1 });
    } catch (error) {
      setLoadingAction(null);
      setOpenLoginModal(true);
    }
  };

  const handleIncrease = () => {
    setLoadingAction("increase");
    increaseMutation.mutate({
      productId: productData._id,
      quantity: productInCart.quantity,
    });
  };

  const handleDecrease = () => {
    setLoadingAction("decrease");
    decreaseMutation.mutate({
      productId: productData._id,
      quantity: productInCart.quantity,
    });
  };

  const handleRemove = () => {
    setLoadingAction("remove");
    removeMutation.mutate(productData._id);
  };

  const handleCloseLoginModal = () => {
    setOpenLoginModal(false);
  };

  const handleNavigateToLogin = () => {
    navigate("/login");
    handleCloseLoginModal();
  };

  const handleOpenImageModal = () => {
    setOpenImageModal(true);
  };

  const handleCloseImageModal = () => {
    setOpenImageModal(false);
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress size={40} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Alert severity="error">خطا در دریافت اطلاعات محصول</Alert>
      </Container>
    );
  }

  if (!product?.data?.product) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Alert severity="warning">محصول مورد نظر یافت نشد</Alert>
      </Container>
    );
  }

  const productImages = productData.images
    ? Array.isArray(productData.images)
      ? productData.images.map((img) => getImageUrl(img))
      : [getImageUrl(productData.images)]
    : [];

  const mainImage = productImages[selectedImage] || "";

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3, color: "#666" }}>
        <Link
          color="inherit"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate("/");
          }}
          sx={{ cursor: "pointer", "&:hover": { color: "#FF6B00" } }}
        >
          صفحه اصلی
        </Link>
        <Link
          color="inherit"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate("/shop");
          }}
          sx={{ cursor: "pointer", "&:hover": { color: "#FF6B00" } }}
        >
          فروشگاه
        </Link>
        <Typography color="text.primary">{productData.title}</Typography>
      </Breadcrumbs>

      {/* Product Box */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: "1px solid #e0e0e0",
          backgroundColor: "#fff",
          overflow: "hidden",
          mb: 4,
        }}
      >
        <Grid container>
          {/* Product Images */}
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 3 }}>
              {/* Main Image */}
              {mainImage && (
                <Box sx={{ position: "relative" }}>
                  <Box
                    component="img"
                    src={mainImage}
                    alt={productData.title}
                    onClick={handleOpenImageModal}
                    sx={{
                      width: "100%",
                      height: { xs: 300, sm: 400 },
                      objectFit: "contain",
                      mb: 2,
                      borderRadius: 2,
                      backgroundColor: "#fafafa",
                      cursor: "pointer",
                      transition: "transform 0.2s ease",
                      "&:hover": {
                        transform: "scale(1.02)",
                      },
                    }}
                  />
                  <IconButton
                    onClick={handleOpenImageModal}
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      color: "#666",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 1)",
                        color: "#FF6B00",
                      },
                    }}
                  >
                    <ZoomInIcon />
                  </IconButton>
                </Box>
              )}

              {/* Thumbnail Images */}
              {productImages && productImages.length > 1 && (
                <Grid container spacing={1}>
                  {productImages.map((image, index) => (
                    <Grid item key={index} xs={3}>
                      <Box
                        component="img"
                        src={image}
                        alt={`Image ${index + 1}`}
                        onClick={() => setSelectedImage(index)}
                        sx={{
                          width: "100%",
                          height: 80,
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
                            transform: "scale(1.05)",
                          },
                        }}
                      />
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          </Grid>

          {/* Product Information */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                p: 4,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              {/* Category */}
              {productData.category?.title && (
                <Chip
                  label={productData.category.title}
                  size="small"
                  sx={{
                    backgroundColor: "#f5f5f5",
                    color: "#666",
                    mb: 3,
                    alignSelf: "flex-start",
                  }}
                />
              )}

              {/* Title */}
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  fontSize: { xs: "1.75rem", sm: "2.25rem", md: "2.5rem" },
                  color: "#333",
                  fontWeight: 700,
                  mb: 2,
                  textAlign: "center",
                  lineHeight: 1.2,
                }}
              >
                {productData.title}
              </Typography>

              {/* Price */}
              <Typography
                variant="h4"
                sx={{
                  color: "#FF6B00",
                  fontWeight: "bold",
                  mb: 3,
                  textAlign: "center",
                }}
              >
                {convertPriceToPersian(productData.price || 0)} تومان
              </Typography>

              {/* Summary */}
              {productData.summary && (
                <Typography
                  variant="body1"
                  sx={{
                    color: "#666",
                    mb: 4,
                    lineHeight: 1.8,
                    textAlign: "center",
                    fontSize: "1.1rem",
                  }}
                >
                  {productData.summary}
                </Typography>
              )}

              {/* Description */}
              {productData.description && (
                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#333",
                      mb: 2,
                      textAlign: "center",
                      fontWeight: 600,
                    }}
                  >
                    {/* Product Description */}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      lineHeight: 2,
                      color: "#666",
                      fontSize: "1rem",
                      textAlign: "justify",
                    }}
                  >
                    {productData.description}
                  </Typography>
                </Box>
              )}

              {/* دکمه‌های سبد خرید */}
              <Box sx={{ mb: 4, textAlign: "center" }}>
                {isPending ? (
                  <Button
                    fullWidth
                    variant="outlined"
                    disabled
                    sx={{
                      maxWidth: 400,
                      opacity: 0.6,
                      padding: "12px",
                      borderRadius: 2,
                      borderColor: "#FF6B00",
                      color: "#FF6B00",
                    }}
                  >
                    <CircularProgress size={20} />
                  </Button>
                ) : productInCart ? (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      border: "1px solid #e0e0e0",
                      borderRadius: 2,
                      width: "100%",
                      maxWidth: 400,
                      mx: "auto",
                      p: 1,
                      backgroundColor: "#fff",
                    }}
                  >
                    <IconButton
                      onClick={handleIncrease}
                      color="primary"
                      disabled={loadingAction === "increase"}
                      sx={{ color: "#FF6B00" }}
                    >
                      {loadingAction === "increase" ? (
                        <CircularProgress size={20} />
                      ) : (
                        <AddIcon />
                      )}
                    </IconButton>

                    <Typography
                      variant="body1"
                      fontWeight={600}
                      sx={{
                        minWidth: 60,
                        textAlign: "center",
                        color: "#333",
                        fontSize: "1.1rem",
                      }}
                    >
                      {productInCart?.quantity}
                    </Typography>

                    <IconButton
                      onClick={
                        productInCart?.quantity === 1
                          ? handleRemove
                          : handleDecrease
                      }
                      color={
                        productInCart?.quantity === 1 ? "error" : "primary"
                      }
                      disabled={
                        loadingAction === "remove" ||
                        loadingAction === "decrease"
                      }
                      sx={{
                        color:
                          productInCart?.quantity === 1 ? "#d32f2f" : "#FF6B00",
                      }}
                    >
                      {loadingAction === "remove" ||
                      loadingAction === "decrease" ? (
                        <CircularProgress size={20} />
                      ) : productInCart?.quantity === 1 ? (
                        <DeleteIcon />
                      ) : (
                        <RemoveIcon />
                      )}
                    </IconButton>
                  </Box>
                ) : (
                  <Button
                    fullWidth
                    variant="contained"
                    size="medium"
                    onClick={handleAddToCart}
                    disabled={loadingAction === "add"}
                    sx={{
                      maxWidth: 400,
                      borderRadius: 2,
                      backgroundColor: "#FF6B00",
                      color: "#fff",
                      fontWeight: 600,
                      textTransform: "none",
                      py: 1.5,
                      px: 3,
                      "&:hover": {
                        backgroundColor: "#E65A00",
                        transform: "translateY(-1px)",
                        boxShadow: "0 4px 8px rgba(255, 107, 0, 0.3)",
                      },
                      transition: "all 0.2s ease",
                      "& .MuiButton-startIcon": {
                        marginRight: 1,
                      },
                    }}
                    startIcon={<ShoppingCartIcon />}
                  >
                    {loadingAction === "add" ? (
                      <CircularProgress size={20} sx={{ color: "#fff" }} />
                    ) : (
                      "افزودن به سبد خرید"
                    )}
                  </Button>
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Login Modal */}
      <Dialog
        open={openLoginModal}
        onClose={handleCloseLoginModal}
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: 2,
            padding: 2,
            maxWidth: 400,
            width: "90%",
          },
        }}
      >
        <DialogTitle
          sx={{
            textAlign: "center",
            color: "#222222",
            fontWeight: "bold",
            fontSize: "1.2rem",
          }}
        >
          ورود به حساب کاربری
        </DialogTitle>
        <DialogContent>
          <Typography
            variant="body1"
            sx={{
              textAlign: "center",
              color: "#666",
              mt: 1,
            }}
          >
            برای افزودن محصول به سبد خرید، لطفاً ابتدا وارد حساب کاربری خود
            شوید.
          </Typography>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: "center",
            gap: 1,
            padding: 2,
          }}
        >
          <Button
            onClick={handleCloseLoginModal}
            variant="outlined"
            sx={{
              color: "#666",
              borderColor: "#666",
              "&:hover": {
                borderColor: "#222222",
                color: "#222222",
              },
            }}
          >
            انصراف
          </Button>
          <Button
            onClick={handleNavigateToLogin}
            variant="contained"
            sx={{
              bgcolor: "#FF6B00",
              color: "#fff",
              "&:hover": { backgroundColor: "#E65A00" },
            }}
          >
            ورود به حساب
          </Button>
        </DialogActions>
      </Dialog>

      {/* Image Modal */}
      <ImageModal
        open={openImageModal}
        onClose={handleCloseImageModal}
        imageSrc={mainImage}
        imageAlt={productData?.title || "Product Image"}
        images={productImages}
        currentImageIndex={selectedImage}
        onImageChange={setSelectedImage}
      />

      {/* Similar Products */}
      {/* {productData && (
        <SimilarProducts
          categoryId={productData.category?._id || ""}
          currentProductId={productData._id}
          limit={8}
        />
      )} */}
    </Container>
  );
};

export default ProductDetails;
