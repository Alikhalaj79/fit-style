import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Box,
  Typography,
  Button,
  Stack,
  CircularProgress,
  Divider,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import addBasket from "../assets/images/add-basket.png";
import { fetchCart, clearCart } from "../services/cartApi";
import ProductCard from "../components/templates/homePage/ProductCard";
import { convertPriceToPersian } from "../services/productsApi";
import DeleteIcon from "@mui/icons-material/Delete";

const Cart = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const queryClient = useQueryClient();
  const { data: cartItems, isFetching } = useQuery({
    queryKey: ["cart"],
    queryFn: fetchCart,
    staleTime: 1000 * 60,
    select: (data) => data?.items || [],
  });

  const clearCartMutation = useMutation({
    mutationFn: clearCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      setOpenDialog(false);
    },
  });

  const calculateTotalPrice = () => {
    return cartItems?.reduce((total, item) => {
      return total + item.productId.price * item.quantity;
    }, 0);
  };

  const calculateTotalItems = () => {
    return cartItems?.reduce((total, item) => {
      return total + item.quantity;
    }, 0);
  };

  const handleClearCart = () => {
    setOpenDialog(true);
  };

  if (isFetching && !cartItems) {
    return (
      <Box
        sx={{
          height: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <Box
        sx={{
          height: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <Stack spacing={2} alignItems="center">
          <Box
            component="img"
            src={addBasket}
            alt="سبد خرید خالی"
            sx={{
              width: { xs: 150, sm: 200 },
              height: { xs: 150, sm: 200 },
              opacity: 0.8,
            }}
          />
          <Typography variant="h5" fontWeight="bold">
            سبد خریدت خالیه
          </Typography>
          <Typography color="text.secondary">
            هنوز هیچ محصولی به سبدت اضافه نکردی. یه نگاهی به فروشگاه بنداز!
          </Typography>
          <Button
            component={Link}
            to="/shop"
            variant="contained"
            color="primary"
            sx={{
              borderRadius: 2,
              px: 4,
              py: 1.5,
              backgroundColor: "#FF6B00",
              "&:hover": { backgroundColor: "#E65A00" },
            }}
          >
            رفتن به فروشگاه
          </Button>
        </Stack>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: { xs: 1, sm: 2, md: 4 } }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        mb={4}
        sx={{ fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" } }}
      >
        سبد خرید
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: { xs: 2, md: 4 },
        }}
      >
        {/* Products List */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {cartItems.map((item) => (
            <ProductCard
              key={item.productId._id}
              product={{
                id: item.productId._id,
                title: item.productId.title,
                price: item.productId.price,
                images: item.productId.images,
              }}
              variant="cart"
            />
          ))}
        </Box>

        {/* Cart Summary */}
        <Paper
          elevation={0}
          sx={{
            width: { xs: "100%", md: 320 },
            p: { xs: 2, md: 3 },
            borderRadius: 2,
            border: "1px solid #e0e0e0",
            height: "fit-content",
          }}
        >
          <Typography
            variant="h6"
            fontWeight="bold"
            mb={2}
            sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
          >
            نهایی کردن خرید
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Stack spacing={2}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                color="text.secondary"
                sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
              >
                تعداد محصولات
              </Typography>
              <Typography
                fontWeight={600}
                sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
              >
                {calculateTotalItems()} عدد
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                color="text.secondary"
                sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
              >
                مبلغ کل
              </Typography>
              <Typography
                fontWeight={600}
                color="primary"
                sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
              >
                {convertPriceToPersian(calculateTotalPrice())} تومان
              </Typography>
            </Box>
            <Button
              variant="contained"
              fullWidth
              size="large"
              sx={{
                mt: 2,
                borderRadius: 2,
                backgroundColor: "#FF6B00",
                "&:hover": { backgroundColor: "#E65A00" },
                py: { xs: 1, sm: 1.5 },
              }}
            >
              ثبت سفارش
            </Button>
            <Button
              variant="outlined"
              fullWidth
              size="large"
              color="error"
              onClick={handleClearCart}
              disabled={clearCartMutation.isPending}
              sx={{
                borderRadius: 2,
                py: { xs: 1, sm: 1.5 },
              }}
            >
              {clearCartMutation.isPending ? (
                <CircularProgress size={24} />
              ) : (
                "پاک کردن سبد خرید"
              )}
            </Button>
          </Stack>
        </Paper>
      </Box>

      {/* Clear Cart Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        fullScreen={false}
        PaperProps={{
          sx: {
            borderRadius: { xs: 2, sm: 2 },
            maxWidth: { xs: "90%", sm: "400px" },
            width: "100%",
            margin: { xs: "auto", sm: "32px" },
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            backgroundColor: "#fff",
            overflow: "hidden",
            position: "relative",
            maxHeight: { xs: "90vh", sm: "calc(100% - 64px)" },
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontSize: { xs: "1.1rem", sm: "1.25rem" },
            fontWeight: 600,
            color: "#212121",
            textAlign: "center",
            padding: { xs: "16px", sm: "24px 24px 16px" },
            borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
            backgroundColor: "#fafafa",
          }}
        >
          پاک کردن سبد خرید
        </DialogTitle>
        <DialogContent
          sx={{
            padding: { xs: "24px 16px", sm: "32px 24px" },
            textAlign: "center",
            color: "#424242",
            fontSize: { xs: "0.95rem", sm: "1rem" },
            lineHeight: 1.6,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: { xs: 1.5, sm: 2 },
            flex: 1,
            overflowY: "auto",
          }}
        >
          <Box
            sx={{
              width: { xs: 56, sm: 64 },
              height: { xs: 56, sm: 64 },
              borderRadius: "50%",
              backgroundColor: "rgba(255, 111, 0, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: { xs: 0.5, sm: 1 },
            }}
          >
            <DeleteIcon
              sx={{ fontSize: { xs: 28, sm: 32 }, color: "#FF6F00" }}
            />
          </Box>
          <Typography
            sx={{
              fontWeight: 500,
              color: "#212121",
              fontSize: { xs: "1rem", sm: "1.1rem" },
              marginBottom: { xs: 0.5, sm: 1 },
            }}
          >
            آیا از پاک کردن سبد خرید اطمینان دارید؟
          </Typography>
          <Typography
            sx={{
              color: "#757575",
              fontSize: { xs: "0.875rem", sm: "0.95rem" },
              maxWidth: { xs: "90%", sm: "100%" },
            }}
          >
            تمام محصولات از سبد خرید شما حذف خواهند شد
          </Typography>
        </DialogContent>
        <DialogActions
          sx={{
            padding: { xs: "16px", sm: "24px" },
            justifyContent: "center",
            gap: { xs: 1, sm: 2 },
            borderTop: "1px solid rgba(0, 0, 0, 0.08)",
            backgroundColor: "#fafafa",
          }}
        >
          <Button
            onClick={() => setOpenDialog(false)}
            variant="outlined"
            sx={{
              minWidth: { xs: "90px", sm: "120px" },
              borderRadius: 2,
              textTransform: "none",
              fontSize: { xs: "0.875rem", sm: "1rem" },
              fontWeight: 600,
              color: "#757575",
              borderColor: "#e0e0e0",
              padding: { xs: "6px 12px", sm: "10px 20px" },
              "&:hover": {
                borderColor: "#bdbdbd",
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            انصراف
          </Button>
          <Button
            onClick={() => clearCartMutation.mutate()}
            variant="contained"
            disabled={clearCartMutation.isPending}
            sx={{
              minWidth: { xs: "90px", sm: "120px" },
              borderRadius: 2,
              textTransform: "none",
              fontSize: { xs: "0.875rem", sm: "1rem" },
              fontWeight: 600,
              backgroundColor: "#FF6F00",
              padding: { xs: "6px 12px", sm: "10px 20px" },
              "&:hover": {
                backgroundColor: "#F57C00",
                boxShadow: "0 4px 12px rgba(255, 111, 0, 0.3)",
              },
              "&.Mui-disabled": {
                backgroundColor: "rgba(255, 111, 0, 0.5)",
                color: "#fff",
              },
            }}
          >
            {clearCartMutation.isPending ? (
              <CircularProgress size={24} sx={{ color: "#fff" }} />
            ) : (
              "پاک کردن"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Cart;
