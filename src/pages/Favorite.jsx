import React from "react";
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Container,
  Button,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import LoginIcon from "@mui/icons-material/Login";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import ProductCard from "../components/templates/homePage/ProductCard";
import {
  fetchFavoriteProducts,
  clearAllFavorites,
  removeFromFavorite,
} from "../services/favoriteApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useOptimisticFavorites } from "../kooks/useOptimisticFavorites";
import { useNavigate } from "react-router-dom";
import { useToast } from "../contexts/ToastContext";

const Favorite = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  // State for confirmation dialogs
  const [clearAllDialog, setClearAllDialog] = React.useState(false);
  const [removeDialog, setRemoveDialog] = React.useState({
    open: false,
    productId: null,
    productTitle: "",
  });

  const {
    data: favoriteProducts,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["favorite"],
    queryFn: fetchFavoriteProducts,
  });

  // Use optimistic favorites hook first
  const { optimisticFavorites, removeFromFavoriteMutation } =
    useOptimisticFavorites();

  // Extract items from response if it's an object
  const items =
    favoriteProducts?.data?.savedItems?.items || favoriteProducts || [];
  
    const clearAllFavoritesMutation = useMutation({
    mutationFn: clearAllFavorites,
    onSuccess: () => {
      queryClient.invalidateQueries(["favorite"]);
      setClearAllDialog(false);
      showToast("همه محصولات مورد علاقه با موفقیت حذف شدند", "success");
    },
    onError: (error) => {
      console.error("خطا در پاک کردن همه موارد علاقه:", error);
      showToast("خطا در حذف محصولات مورد علاقه", "error");
    },
  });

  // Check if current product is in favorites
  // در Favorite page، همه محصولات favorite هستن
  const isProductFavorite = (productId) => {


    // در Favorite page، همه محصولات favorite هستن
    return true;
  };

  const handleClearAll = () => {
    setClearAllDialog(true);
  };

  const handleConfirmClearAll = () => {
    clearAllFavoritesMutation.mutate();
  };

  const handleFavoriteClick = (productId) => {
    // لاگ برای دیباگ - Favorite page
    console.log("=== Favorite Page Debug ===");
    console.log("Received Product ID:", productId);
    console.log("Type of Product ID:", typeof productId);
    console.log("===========================");

    // Find product title for dialog
    const product = items.find(
      (item) =>
        item.productId?._id === productId || item.productId === productId
    );
    const productTitle = product?.productId?.title || "این محصول";

    setRemoveDialog({
      open: true,
      productId,
      productTitle,
    });
  };

  const handleConfirmRemove = () => {
    removeFromFavoriteMutation.mutate(removeDialog.productId);
    setRemoveDialog({ open: false, productId: null, productTitle: "" });
  };

  const handleNavigateToLogin = () => {
    navigate("/login");
  };

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

  // Check if user is not logged in
  if (error && error.message?.includes("لطفا وارد حساب کاربری شوید")) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "50vh",
            gap: 3,
          }}
        >
          <Typography variant="h5" color="text.secondary" textAlign="center">
            برای مشاهده محصولات مورد علاقه ابتدا وارد حساب کاربری خود شوید
          </Typography>
          <Button
            variant="contained"
            startIcon={<LoginIcon />}
            onClick={handleNavigateToLogin}
            sx={{
              bgcolor: "#FF6F00",
              color: "#fff",
              "&:hover": { backgroundColor: "#E65A00" },
            }}
          >
            ورود به حساب کاربری
          </Button>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          خطا در دریافت محصولات مورد علاقه: {error.message}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: "#212121",
          }}
        >
          محصولات مورد علاقه
        </Typography>

        {Array.isArray(items) && items.length > 0 && (
          <Button
            variant="outlined"
            color="error"
            onClick={handleClearAll}
            disabled={clearAllFavoritesMutation.isPending}
          >
            {clearAllFavoritesMutation.isPending
              ? "در حال پاک کردن..."
              : "پاک کردن همه"}
          </Button>
        )}
      </Box>

      {!Array.isArray(items) || items.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "60vh",
            gap: 3,
            textAlign: "center",
            padding: 4,
            background:
              "linear-gradient(135deg, #FFF5F5 0%, #FFFFFF 50%, #F8F9FA 100%)",
            borderRadius: 4,
            border: "1px solid #E9ECEF",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "radial-gradient(circle at 20% 80%, rgba(255, 111, 0, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 111, 0, 0.05) 0%, transparent 50%)",
              pointerEvents: "none",
            },
          }}
        >
          {/* آیکون قلب بزرگ با انیمیشن */}
          <Box
            sx={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              backgroundColor: "#FFF5F5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 2,
              border: "2px dashed #FFB3B3",
              position: "relative",
              zIndex: 1,
              "&:hover": {
                transform: "scale(1.05)",
                transition: "transform 0.3s ease",
              },
            }}
          >
            <FavoriteBorderIcon
              sx={{
                fontSize: 60,
                color: "#FF6F00",
                opacity: 0.7,
                animation: "heartbeat 2s ease-in-out infinite",
                "@keyframes heartbeat": {
                  "0%": {
                    transform: "scale(1)",
                  },
                  "50%": {
                    transform: "scale(1.1)",
                  },
                  "100%": {
                    transform: "scale(1)",
                  },
                },
              }}
            />

            {/* دایره‌های انیمیت شده */}
            <Box
              sx={{
                position: "absolute",
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                border: "2px solid #FFB3B3",
                animation: "pulse 2s ease-in-out infinite",
                "@keyframes pulse": {
                  "0%": {
                    transform: "scale(1)",
                    opacity: 1,
                  },
                  "100%": {
                    transform: "scale(1.3)",
                    opacity: 0,
                  },
                },
              }}
            />
          </Box>

          {/* عنوان اصلی */}
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "#212121",
              marginBottom: 1,
              position: "relative",
              zIndex: 1,
            }}
          >
            لیست علاقه‌مندی‌های شما خالی است
          </Typography>

          {/* توضیحات */}
          <Typography
            variant="body1"
            sx={{
              color: "#666",
              maxWidth: 400,
              lineHeight: 1.6,
              marginBottom: 3,
              position: "relative",
              zIndex: 1,
            }}
          >
            محصولاتی که دوست دارید را با کلیک روی آیکون قلب به لیست
            علاقه‌مندی‌های خود اضافه کنید
          </Typography>

          {/* دکمه‌های عملیات */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexDirection: { xs: "column", sm: "row" },
              alignItems: "center",
              position: "relative",
              zIndex: 1,
            }}
          >
            <Button
              variant="contained"
              onClick={() => navigate("/shop")}
              sx={{
                bgcolor: "#FF6F00",
                color: "#fff",
                padding: "12px 24px",
                borderRadius: 3,
                fontWeight: 600,
                textTransform: "none",
                fontSize: "1rem",
                "&:hover": {
                  backgroundColor: "#E65A00",
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 12px rgba(255, 111, 0, 0.3)",
                },
                transition: "all 0.3s ease",
              }}
            >
              رفتن به فروشگاه
            </Button>
          </Box>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {Array.isArray(items) &&
            items.map((item) => {
              // لاگ برای دیباگ - ID کارد
              console.log("Favorite Item ID:", item._id);
              console.log("Product ID:", item.productId?._id);
              console.log("Full Item:", item);

              return (
                <Grid item xs={12} sm={6} md={4} lg={3} key={item._id}>
                  <ProductCard
                    product={item.productId}
                    isProductFavorite={isProductFavorite}
                    onFavoriteClick={handleFavoriteClick}
                    favoriteItemId={item._id}
                  />
                </Grid>
              );
            })}
        </Grid>
      )}

      {/* Clear All Confirmation Dialog */}
      <Dialog
        open={clearAllDialog}
        onClose={() => setClearAllDialog(false)}
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: 3,
            padding: 2,
            maxWidth: 400,
            width: "90%",
          },
        }}
      >
        <DialogTitle
          sx={{
            textAlign: "center",
            color: "#212121",
            fontWeight: "bold",
            fontSize: "1.2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
          }}
        >
          <DeleteSweepIcon sx={{ color: "#FF6F00" }} />
          حذف همه محصولات
        </DialogTitle>
        <DialogContent>
          <Typography
            variant="body1"
            sx={{
              textAlign: "center",
              color: "#666",
              mt: 1,
              lineHeight: 1.6,
            }}
          >
            محصولات مورد علاقه پاک شود؟
          
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
            onClick={() => setClearAllDialog(false)}
            variant="outlined"
            sx={{
              color: "#666",
              borderColor: "#666",
              "&:hover": {
                borderColor: "#212121",
                color: "#212121",
              },
            }}
          >
            انصراف
          </Button>
          <Button
            onClick={handleConfirmClearAll}
            variant="contained"
            disabled={clearAllFavoritesMutation.isPending}
            sx={{
              bgcolor: "#FF6F00",
              color: "#fff",
              "&:hover": { backgroundColor: "#E65A00" },
            }}
          >
            {clearAllFavoritesMutation.isPending ? "در حال حذف..." : "حذف همه"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Remove Single Product Confirmation Dialog */}
      <Dialog
        open={removeDialog.open}
        onClose={() =>
          setRemoveDialog({ open: false, productId: null, productTitle: "" })
        }
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: 3,
            padding: 2,
            maxWidth: 400,
            width: "90%",
          },
        }}
      >
        <DialogTitle
          sx={{
            textAlign: "center",
            color: "#212121",
            fontWeight: "bold",
            fontSize: "1.2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
          }}
        >
          <FavoriteBorderIcon sx={{ color: "#FF6F00" }} />
          حذف از علاقه‌مندی‌ها
        </DialogTitle>
        <DialogContent>
          <Typography
            variant="body1"
            sx={{
              textAlign: "center",
              color: "#666",
              mt: 1,
              lineHeight: 1.6,
            }}
          >
            آیا مطمئن هستید که می‌خواهید
            <br />
            <strong>"{removeDialog.productTitle}"</strong>
            <br />
            را از علاقه‌مندی‌های خود حذف کنید؟
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
            onClick={() =>
              setRemoveDialog({
                open: false,
                productId: null,
                productTitle: "",
              })
            }
            variant="outlined"
            sx={{
              color: "#666",
              borderColor: "#666",
              "&:hover": {
                borderColor: "#212121",
                color: "#212121",
              },
            }}
          >
            انصراف
          </Button>
          <Button
            onClick={handleConfirmRemove}
            variant="contained"
            disabled={removeFromFavoriteMutation.isPending}
            sx={{
              bgcolor: "#FF6F00",
              color: "#fff",
              "&:hover": { backgroundColor: "#E65A00" },
            }}
          >
            {removeFromFavoriteMutation.isPending ? "در حال حذف..." : "حذف"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Favorite;
