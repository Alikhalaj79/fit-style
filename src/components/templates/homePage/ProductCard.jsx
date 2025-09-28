import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
} from "@mui/material";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useCartMutations } from "../../../kooks/useCartMutation";
import {
  convertPriceToPersian,
  getImageUrl,
} from "../../../services/productsApi";
import { fetchCart } from "../../../services/cartApi";
import ImageModal from "../adminPage/adminComponents/ImageModal";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import {
  addToFavorite,
  removeFromFavorite,
  fetchFavoriteProducts,
} from "../../../services/favoriteApi";
import { useOptimisticFavorites } from "../../../kooks/useOptimisticFavorites";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getUserProfile } from "../../../services/users";

const ProductCard = ({
  product,
  variant,
  isProductFavorite: externalIsProductFavorite,
  onFavoriteClick: externalOnFavoriteClick,
  favoriteItemId,
}) => {
  const [openImage, setOpenImage] = useState(false);
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [loadingAction, setLoadingAction] = useState(null); // "add" | "increase" | "decrease" | "remove"
  const [pendingProductId, setPendingProductId] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: cartData, isFetching } = useQuery({
    queryKey: ["cart"],
    queryFn: fetchCart,
    staleTime: 1000 * 60,
  });

  // Check authentication state
  const { data: profileData } = useQuery({
    queryKey: ["profile"],
    queryFn: getUserProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const isLoggedIn = profileData?.data?.data?.user;
  // console.log(product);

  const { addMutation, increaseMutation, decreaseMutation, removeMutation } =
    useCartMutations({ setPendingProductId });

  // Use optimistic favorites hook only if no external function provided
  const {
    optimisticFavorites,
    addToFavoriteMutation,
    removeFromFavoriteMutation,
    isProductFavorite: optimisticIsProductFavorite,
  } = useOptimisticFavorites();

  // Check if current product is in favorites
  const internalIsProductFavorite = product?.id
    ? optimisticIsProductFavorite(product.id)
    : false;

  // Use external function if provided, otherwise use internal logic
  const isProductFavorite = externalIsProductFavorite
    ? externalIsProductFavorite(product.id)
    : internalIsProductFavorite;

  // Optimistic mutations are now handled by useOptimisticFavorites hook

  const handleOpenImage = () => setOpenImage(true);
  const handleCloseImage = () => setOpenImage(false);

  const productInCart = cartData?.items.find(
    (item) => item.productId._id === product.id
  );

  const isPending = pendingProductId === product.id;

  // Stock count logic
  const stockCount = product.count || 0;
  const isOutOfStock = variant === "cart" ? false : stockCount === 0; // Don't show as out of stock in cart
  const isLowStock = stockCount > 0 && stockCount < 5;

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

      addMutation.mutate(
        { productId: product.id, quantity: 1 },
        {
          onSettled: () => setLoadingAction(null),
        }
      );
    } catch (error) {
      setLoadingAction(null);
      setOpenLoginModal(true);
    }
  };

  const handleCloseLoginModal = () => {
    setOpenLoginModal(false);
  };

  const handleNavigateToLogin = () => {
    navigate("/login");
    handleCloseLoginModal();
  };

  const handleIncrease = () => {
    setLoadingAction("increase");
    increaseMutation.mutate(
      { productId: product.id, quantity: productInCart.quantity },
      {
        onSettled: () => setLoadingAction(null),
      }
    );
  };

  const handleDecrease = () => {
    setLoadingAction("decrease");
    decreaseMutation.mutate(
      { productId: product.id, quantity: productInCart.quantity },
      {
        onSettled: () => setLoadingAction(null),
      }
    );
  };

  const handleRemove = () => {
    setLoadingAction("remove");
    removeMutation.mutate(product.id, {
      onSettled: () => setLoadingAction(null),
    });
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();

    // Check if user is logged in
    if (!isLoggedIn) {
      setShowLoginAlert(true);
      return;
    }

    // Use external function if provided, otherwise use internal logic
    if (externalOnFavoriteClick) {
      // در Favorite page، _id محصول رو ارسال می‌کنیم
      const idToUse = product._id || product.id;
      console.log("Using ID for removal:", idToUse);
      console.log("Product object:", product);
      externalOnFavoriteClick(idToUse);
    } else {
      if (isProductFavorite) {
        removeFromFavoriteMutation.mutate(product.id);
      } else {
        addToFavoriteMutation.mutate(product.id);
      }
    }
  };

  return (
    <>
      <Card
        sx={{
          width: variant === "cart" ? "100%" : { xs: "100%", sm: 240, md: 280 },
          borderRadius: variant === "cart" ? 2 : 4,
          boxShadow:
            variant === "cart"
              ? "0 1px 3px rgba(0,0,0,0.1)"
              : productInCart
              ? "0 0 10px rgba(255, 111, 0, 0.4)"
              : "0 2px 6px rgba(0, 0, 0, 0.05)",
          overflow: "hidden",
          transition: "all 0.3s ease-in-out",
          "&:hover": {
            transform:
              variant === "cart"
                ? "none"
                : isOutOfStock
                ? "none"
                : "translateY(-4px)",
            boxShadow:
              variant === "cart"
                ? "0 2px 6px rgba(0,0,0,0.15)"
                : isOutOfStock
                ? "0 2px 6px rgba(0, 0, 0, 0.05)"
                : "0 8px 20px rgba(0, 0, 0, 0.1)",
          },
          backgroundColor:
            variant === "cart"
              ? "#fff"
              : isOutOfStock
              ? "#fefefe"
              : productInCart
              ? "#FFF8F1"
              : "#fff",
          margin: variant === "cart" ? "0 0 16px 0" : "12px",
          position: "relative",
          display:
            variant === "cart"
              ? { xs: "block", sm: "flex", md: "flex" }
              : "block",
          flexDirection:
            variant === "cart" ? { xs: "row", sm: "row", md: "row" } : "row",
          height:
            variant === "cart" ? { xs: "auto", sm: 160, md: 180 } : "auto",
          cursor: isOutOfStock ? "not-allowed" : "default",
          opacity: isOutOfStock ? 0.8 : 1,
        }}
      >
        {productInCart && variant !== "cart" && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              position: "absolute",
              top: 8,
              left: 8,
              zIndex: 2,
              backgroundColor: "#fff",
              borderRadius: "16px",
              padding: "4px 10px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
              fontSize: "0.75rem",
              fontWeight: 600,
              color: "#FF6F00",
            }}
            component={Link}
            to="/cart"
            underline="none"
            style={{ textDecoration: "none" }}
          >
            <ShoppingBagIcon sx={{ fontSize: 16 }} />
            برو به سبد خرید
          </Box>
        )}

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
              borderRadius: variant === "cart" ? 2 : 4,
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

        <IconButton
          onClick={isOutOfStock ? undefined : handleFavoriteClick}
          disabled={isOutOfStock}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            zIndex: 2,
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(4px)",
            padding: "4px",
            opacity: isOutOfStock ? 0.5 : 1,
            "&:hover": {
              backgroundColor: isOutOfStock
                ? "rgba(255, 255, 255, 0.8)"
                : "rgba(255, 255, 255, 0.9)",
            },
          }}
        >
          {isProductFavorite ? (
            <FavoriteIcon sx={{ color: "#FF6F00", fontSize: 20 }} />
          ) : (
            <FavoriteBorderIcon sx={{ color: "#757575", fontSize: 20 }} />
          )}
        </IconButton>

        {/* image */}
        <Box
          sx={{
            height:
              variant === "cart"
                ? { xs: 240, sm: "100%", md: "100%" }
                : { xs: 240, sm: 200 },
            width:
              variant === "cart" ? { xs: "100%", sm: 160, md: 180 } : "100%",
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#f9f9f9",
            cursor: "pointer",
            flexShrink: variant === "cart" ? { xs: 0, sm: 0, md: 0 } : 0,
            borderBottom:
              variant === "cart"
                ? {
                    xs: "none",
                    sm: "1px solid #e0e0e0",
                    md: "1px solid #e0e0e0",
                  }
                : "none",
            borderRight:
              variant === "cart"
                ? {
                    xs: "none",
                    sm: "1px solid #e0e0e0",
                    md: "1px solid #e0e0e0",
                  }
                : "none",
          }}
          onClick={isOutOfStock ? undefined : handleOpenImage}
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
                transition: "all 0.3s ease-in-out",
                filter: isOutOfStock
                  ? "grayscale(40%) brightness(0.9)"
                  : "none",
                opacity: isOutOfStock ? 0.9 : 1,
              }}
              loading="lazy"
              crossOrigin="anonymous"
            />
          </picture>
        </Box>

        {/* content*/}
        <CardContent
          sx={{
            padding:
              variant === "cart"
                ? { xs: "16px", sm: "16px", md: "20px" }
                : "16px",
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
            flex: 1,
            minWidth: 0,
            justifyContent: "space-between",
            height:
              variant === "cart"
                ? { xs: "auto", sm: "100%", md: "100%" }
                : "auto",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <Typography
              variant="body1"
              sx={{
                fontWeight: 600,
                fontSize:
                  variant === "cart"
                    ? { xs: "0.95rem", sm: "0.95rem", md: "1rem" }
                    : "1rem",
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
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontSize:
                  variant === "cart"
                    ? { xs: "1rem", sm: "1rem", md: "1.1rem" }
                    : "1.1rem",
                color: "#FF6F00",
              }}
            >
              {convertPriceToPersian(product.price)} تومان
            </Typography>

            {/* Stock count display - always reserve space */}
            <Typography
              sx={{
                fontSize: "0.8rem",
                fontWeight: 600,
                color: isLowStock ? "#f44336" : "transparent",
                height: isLowStock ? "auto" : "1.2rem", // Reserve space when not visible
                visibility: isLowStock ? "visible" : "hidden",
              }}
            >
              {isLowStock ? `${stockCount} عدد باقی مانده` : "placeholder"}
            </Typography>
          </Box>
          {variant !== "cart" && (
            <Typography
              component={isOutOfStock ? "span" : Link}
              to={isOutOfStock ? undefined : `/product/${product.id}`}
              sx={{
                fontSize: "0.875rem",
                color: isOutOfStock ? "#9e9e9e" : "#1976d2",
                textDecoration: "none",
                alignSelf: "flex-end",
                cursor: isOutOfStock ? "not-allowed" : "pointer",
                "&:hover": {
                  textDecoration: "none",
                  color: isOutOfStock ? "#9e9e9e" : "#1976d2",
                  fontWeight: isOutOfStock ? "normal" : 300,
                  transition: "all 0.3s ease-in-out",
                },
              }}
            >
              جزئیات محصول
            </Typography>
          )}
        </CardContent>

        {/* add , increase , decrease */}
        <Box
          sx={{
            padding:
              variant === "cart"
                ? { xs: "0 16px 16px", sm: "16px", md: "20px" }
                : "0 16px 16px",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            gap: 1.5,
            borderTop:
              variant === "cart"
                ? {
                    xs: "none",
                    sm: "1px solid #e0e0e0",
                    md: "1px solid #e0e0e0",
                  }
                : "none",
            minWidth:
              variant === "cart"
                ? { xs: "auto", sm: "auto", md: "auto" }
                : "auto",
            justifyContent: "center",
            height:
              variant === "cart"
                ? { xs: "auto", sm: "100%", md: "100%" }
                : "auto",
          }}
        >
          {loadingAction === "add" ? (
            <Button
              fullWidth
              variant="outlined"
              disabled
              sx={{ opacity: 0.6, padding: "6px", borderRadius: 2 }}
            >
              <CircularProgress size={20} />
            </Button>
          ) : isOutOfStock ? (
            <Button
              fullWidth
              // variant="outlined"
              disabled
              sx={{
                padding: "8px 16px",
                borderRadius: "12px",
                color: "#9e9e9e",
                borderColor: "#e0e0e0",
                // backgroundColor: "rgba(158, 158, 158, 0.05)",
                fontSize: "0.9rem",
                fontWeight: 500,
                letterSpacing: "0.3px",
                "&:disabled": {
                  color: "#9e9e9e",
                  borderColor: "#e0e0e0",
                  // backgroundColor: "rgba(158, 158, 158, 0.05)",
                },
              }}
            >
              ناموجود
            </Button>
          ) : productInCart ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                border: "1px solid #e0e0e0",
                borderRadius: 2,
                width: "100%",
              }}
            >
              <IconButton
                onClick={handleIncrease}
                color="primary"
                disabled={
                  loadingAction === "increase" ||
                  (variant !== "cart" && productInCart?.quantity >= stockCount)
                }
                sx={{}}
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
                  minWidth: "24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {loadingAction === "increase" ||
                loadingAction === "decrease" ||
                loadingAction === "remove" ? (
                  <CircularProgress size={16} />
                ) : (
                  productInCart?.quantity
                )}
              </Typography>

              <IconButton
                onClick={
                  productInCart?.quantity === 1 ? handleRemove : handleDecrease
                }
                color={productInCart?.quantity === 1 ? "error" : "primary"}
                disabled={
                  loadingAction === "remove" || loadingAction === "decrease"
                }
                sx={{}}
              >
                {loadingAction === "remove" || loadingAction === "decrease" ? (
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
              {loadingAction === "add" ? (
                <CircularProgress size={20} sx={{ color: "#fff" }} />
              ) : (
                "افزودن به سبد خرید"
              )}
            </Button>
          )}
          {variant === "cart" && (
            <Typography
              component={isOutOfStock ? "span" : Link}
              to={isOutOfStock ? undefined : `/product/${product.id}`}
              sx={{
                fontSize: { xs: "0.875rem", sm: "0.875rem", md: "0.9rem" },
                color: isOutOfStock ? "#9e9e9e" : "#757575",
                textDecoration: "none",
                alignSelf: "flex-end",
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                cursor: isOutOfStock ? "not-allowed" : "pointer",
                "&:hover": {
                  textDecoration: "none",
                  color: isOutOfStock ? "#9e9e9e" : "#FF6F00",
                  transition: "all 0.3s ease-in-out",
                },
              }}
            >
              مشاهده جزئیات
              <ArrowBackIcon sx={{ fontSize: { xs: 16, sm: 16, md: 18 } }} />
            </Typography>
          )}
        </Box>
      </Card>

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
              bgcolor: "#FF6F00",
              color: "#fff",
              "&:hover": { backgroundColor: "#E65A00" },
            }}
          >
            ورود به حساب
          </Button>
        </DialogActions>
      </Dialog>

      <ImageModal
        images={
          product?.images?.length > 0
            ? product.images.map((img) => getImageUrl(img))
            : ["placeholder.jpg"]
        }
        openImage={openImage}
        handleCloseImage={handleCloseImage}
      />

      {/* Login Alert Snackbar */}
      <Snackbar
        open={showLoginAlert}
        autoHideDuration={4000}
        onClose={() => setShowLoginAlert(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setShowLoginAlert(false)}
          severity="warning"
          sx={{
            width: "100%",
            padding: "12px 16px",
            "& .MuiAlert-icon": {
              marginRight: "12px",
            },
            "& .MuiAlert-action": {
              marginLeft: "12px",
            },
          }}
        >
          برای افزودن محصول به علاقه‌مندی‌ها، لطفاً ابتدا وارد حساب کاربری خود
          شوید.
        </Alert>
      </Snackbar>
    </>
  );
};

export default ProductCard;
