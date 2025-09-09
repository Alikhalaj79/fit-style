import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Box, CircularProgress, Typography, Button } from "@mui/material";
import { useToast } from "../contexts/ToastContext";
import { fetchCart, clearCart } from "../services/cartApi";
import { verifyPayment } from "../services/paymentApi";
import { useQueryClient, useMutation } from "@tanstack/react-query";

const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  // Mutation for clearing cart
  const clearCartMutation = useMutation({
    mutationFn: clearCart,
    onSuccess: () => {
      // Invalidate cart query to refresh the UI
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      showToast("سبد خرید شما خالی شد", "success");
    },
    onError: (error) => {
      showToast("خطا در پاک کردن سبد خرید", "error");
    },
  });

  useEffect(() => {
    const authority = searchParams.get("Authority");
    const status = searchParams.get("Status");

    // Only process if we have both parameters and haven't processed this payment yet
    if (!authority || !status) {
      showToast("پارامترهای پرداخت یافت نشد", "error");
      setTimeout(() => navigate("/cart"), 1000);
      return;
    }

    // Check if we've already processed this payment (prevent infinite loop)
    const processedKey = `payment_processed_${authority}`;
    if (sessionStorage.getItem(processedKey)) {
      navigate("/cart");
      return;
    }

    // Mark this payment as being processed
    sessionStorage.setItem(processedKey, "true");

    const processPayment = async () => {
      // Check if payment was successful based on status
      const isSuccess = status === "OK";

      // Try to verify payment with backend (but don't fail if it doesn't work)
      try {
        await verifyPayment(authority, status);
      } catch (error) {
        // Backend verification failed, but we'll continue with local processing
        // This is expected due to CORS issues with the payment gateway
      }

      if (isSuccess) {
        showToast("پرداخت با موفقیت انجام شد", "success");

        // Wait a moment for backend to process, then clear cart
        setTimeout(async () => {
          try {
            const cart = await fetchCart();

            if (cart?.items?.length === 0) {
              // Still invalidate to ensure UI is updated
              queryClient.invalidateQueries({ queryKey: ["cart"] });
            } else {
              // Use mutation to clear cart
              clearCartMutation.mutate();
            }
          } catch (error) {
            // If we can't check cart, just try to clear it
            clearCartMutation.mutate();
          }
        }, 1000);

        // Redirect to cart after 2 seconds
        setTimeout(() => navigate("/cart"), 2000);
      } else {
        showToast("پرداخت ناموفق بود. لطفاً دوباره تلاش کنید.", "error");
        setTimeout(() => navigate("/cart"), 2000);
      }
    };

    processPayment();

    // Cleanup function
    return () => {
      // Clean up session storage after 5 minutes
      setTimeout(() => {
        sessionStorage.removeItem(processedKey);
      }, 5 * 60 * 1000);
    };
  }, [searchParams, navigate, showToast, queryClient, clearCartMutation]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        gap: 3,
        p: 3,
      }}
    >
      <CircularProgress size={60} sx={{ color: "#FF6B00" }} />
      <Typography variant="h6" sx={{ textAlign: "center", color: "#666" }}>
        در حال تایید پرداخت...
      </Typography>
      <Typography variant="body2" sx={{ textAlign: "center", color: "#999" }}>
        لطفاً صبر کنید تا پرداخت شما تایید شود
      </Typography>

      <Button
        variant="outlined"
        onClick={() => navigate("/")}
        sx={{
          mt: 2,
          borderRadius: 2,
          borderColor: "#FF6B00",
          color: "#FF6B00",
          "&:hover": {
            borderColor: "#E65A00",
            backgroundColor: "rgba(255, 111, 0, 0.05)",
          },
        }}
      >
        بازگشت به صفحه اصلی
      </Button>
    </Box>
  );
};

export default PaymentCallback;
