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
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getUserProfile } from "../../../services/users";

const ProductCard = ({ product, variant }) => {
  const [openImage, setOpenImage] = useState(false);
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [loadingAction, setLoadingAction] = useState(null); // "add" | "increase" | "decrease" | "remove"
  const [pendingProductId, setPendingProductId] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: cartData, isFetching } = useQuery({
    queryKey: ["cart"],
    queryFn: fetchCart,
    staleTime: 1000 * 60,
  });
  // console.log(product);

  const { addMutation, increaseMutation, decreaseMutation, removeMutation } =
    useCartMutations({ setPendingProductId });

  const { data: favoriteStatus } = useQuery({
    queryKey: ["favorite"],
    queryFn: fetchFavoriteProducts,
  });

  const addToFavoriteMutation = useMutation({
    mutationFn: addToFavorite,
    onSuccess: () => {
      queryClient.invalidateQueries(["favorite"]);
      setIsFavorite(true);
    },
  });

  const removeFromFavoriteMutation = useMutation({
    mutationFn: removeFromFavorite,
    onSuccess: () => {
      queryClient.invalidateQueries(["favorite"]);
      setIsFavorite(false);
    },
  });

  const handleOpenImage = () => setOpenImage(true);
  const handleCloseImage = () => setOpenImage(false);

  const productInCart = cartData?.items.find(
    (item) => item.productId._id === product.id
  );

  const isPending = pendingProductId === product.id;

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
    if (isFavorite) {
      removeFromFavoriteMutation.mutate(product.id);
    } else {
      addToFavoriteMutation.mutate(product.id);
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
            transform: variant === "cart" ? "none" : "translateY(-4px)",
            boxShadow:
              variant === "cart"
                ? "0 2px 6px rgba(0,0,0,0.15)"
                : "0 8px 20px rgba(0, 0, 0, 0.1)",
          },
          backgroundColor:
            variant === "cart" ? "#fff" : productInCart ? "#FFF8F1" : "#fff",
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

        <IconButton
          onClick={handleFavoriteClick}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            zIndex: 2,
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(4px)",
            padding: "4px",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.9)",
            },
          }}
        >
          {isFavorite ? (
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
          onClick={handleOpenImage}
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
          </Box>
          {variant !== "cart" && (
            <Typography
              component={Link}
              to={`/product/${product.id}`}
              sx={{
                fontSize: "0.875rem",
                color: "#1976d2",
                textDecoration: "none",
                alignSelf: "flex-end",
                "&:hover": {
                  textDecoration: "none",
                  color: "#1976d2",
                  fontWeight: 300,
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
          {isPending ? (
            <Button
              fullWidth
              variant="outlined"
              disabled
              sx={{ opacity: 0.6, padding: "6px", borderRadius: 2 }}
            >
              <CircularProgress size={20} />
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
                disabled={loadingAction === "increase"}
                sx={{}}
              >
                {loadingAction === "increase" ? (
                  <CircularProgress size={20} />
                ) : (
                  <AddIcon />
                )}
              </IconButton>

              <Typography variant="body1" fontWeight={600} sx={{}}>
                {productInCart?.quantity}
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
              component={Link}
              to={`/product/${product.id}`}
              sx={{
                fontSize: { xs: "0.875rem", sm: "0.875rem", md: "0.9rem" },
                color: "#757575",
                textDecoration: "none",
                alignSelf: "flex-end",
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                "&:hover": {
                  textDecoration: "none",
                  color: "#FF6F00",
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
    </>
  );
};

export default ProductCard;
