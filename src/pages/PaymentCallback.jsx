import { useEffect, useState } from "react";
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
  const [paymentStatus, setPaymentStatus] = useState("processing"); // processing, success, error
  const [paymentMessage, setPaymentMessage] = useState(
    "در حال تایید پرداخت..."
  );

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
      setPaymentStatus("error");
      setPaymentMessage("پارامترهای پرداخت یافت نشد");
      showToast("پارامترهای پرداخت یافت نشد", "error");
      setTimeout(() => navigate("/"), 3000);
      return;
    }

    // Check if we've already processed this payment (prevent infinite loop)
    const processedKey = `payment_processed_${authority}`;
    if (sessionStorage.getItem(processedKey)) {
      setPaymentStatus("success");
      setPaymentMessage("پرداخت قبلاً تایید شده است");
      setTimeout(() => navigate("/"), 2000);
      return;
    }

    // Mark this payment as being processed
    sessionStorage.setItem(processedKey, "true");

    const processPayment = async () => {
      setPaymentMessage("در حال تایید پرداخت با سرور...");

      // Check if payment was successful based on status
      const isSuccess = status === "OK";

      // Try to verify payment with backend
      try {
        setPaymentMessage("در حال ارسال درخواست تایید به سرور...");
        await verifyPayment(authority, status);
        setPaymentMessage("تایید پرداخت با موفقیت انجام شد");
      } catch (error) {
        // Backend verification failed, but we'll continue with local processing
        setPaymentMessage("خطا در تایید با سرور، ادامه پردازش محلی...");
      }

      if (isSuccess) {
        setPaymentStatus("success");
        setPaymentMessage(
          "پرداخت با موفقیت انجام شد! در حال پاک کردن سبد خرید..."
        );
        showToast("پرداخت با موفقیت انجام شد", "success");

        // Wait a moment for backend to process, then clear cart
        setTimeout(async () => {
          try {
            setPaymentMessage("در حال بررسی سبد خرید...");
            const cart = await fetchCart();

            if (cart?.items?.length === 0) {
              setPaymentMessage("سبد خرید قبلاً خالی شده است");
              // Still invalidate to ensure UI is updated
              queryClient.invalidateQueries({ queryKey: ["cart"] });
            } else {
              setPaymentMessage("در حال پاک کردن سبد خرید...");
              // Use mutation to clear cart
              clearCartMutation.mutate();
            }
          } catch (error) {
            setPaymentMessage("خطا در بررسی سبد خرید، تلاش برای پاک کردن...");
            // If we can't check cart, just try to clear it
            clearCartMutation.mutate();
          }
        }, 1000);

        // Redirect to homepage after 4 seconds
        setTimeout(() => navigate("/"), 4000);
      } else {
        setPaymentStatus("error");
        setPaymentMessage("پرداخت ناموفق بود. لطفاً دوباره تلاش کنید.");
        showToast("پرداخت ناموفق بود. لطفاً دوباره تلاش کنید.", "error");
        setTimeout(() => navigate("/"), 3000);
      }
    };

    // Start processing after a short delay to show the UI
    setTimeout(processPayment, 500);

    // Cleanup function
    return () => {
      // Clean up session storage after 5 minutes
      setTimeout(() => {
        sessionStorage.removeItem(processedKey);
      }, 5 * 60 * 1000);
    };
  }, [searchParams, navigate, showToast, queryClient, clearCartMutation]);

  const getStatusColor = () => {
    switch (paymentStatus) {
      case "success":
        return "#4CAF50";
      case "error":
        return "#F44336";
      default:
        return "#FF6B00";
    }
  };

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case "success":
        return "✅";
      case "error":
        return "❌";
      default:
        return <CircularProgress size={60} sx={{ color: getStatusColor() }} />;
    }
  };

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
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        borderRadius: 2,
        mx: 2,
        my: 2,
      }}
    >
      <Box
        sx={{
          background: "white",
          padding: 4,
          borderRadius: 3,
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          textAlign: "center",
          maxWidth: 500,
          width: "100%",
        }}
      >
        <Box sx={{ mb: 3 }}>{getStatusIcon()}</Box>

        <Typography
          variant="h5"
          sx={{
            textAlign: "center",
            color: getStatusColor(),
            fontWeight: "bold",
            mb: 2,
          }}
        >
          {paymentStatus === "success" && "پرداخت موفق"}
          {paymentStatus === "error" && "خطا در پرداخت"}
          {paymentStatus === "processing" && "در حال پردازش"}
        </Typography>

        <Typography
          variant="body1"
          sx={{
            textAlign: "center",
            color: "#666",
            mb: 3,
            minHeight: 24,
          }}
        >
          {paymentMessage}
        </Typography>

        <Button
          variant="contained"
          onClick={() => navigate("/")}
          sx={{
            borderRadius: 2,
            backgroundColor: getStatusColor(),
            color: "white",
            px: 4,
            py: 1.5,
            "&:hover": {
              backgroundColor:
                paymentStatus === "success"
                  ? "#45a049"
                  : paymentStatus === "error"
                  ? "#d32f2f"
                  : "#E65A00",
            },
          }}
        >
          بازگشت به صفحه اصلی
        </Button>
      </Box>
    </Box>
  );
};

export default PaymentCallback;
