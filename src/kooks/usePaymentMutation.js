import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { submitOrder } from "../services/paymentApi";
import { useToast } from "../contexts/ToastContext";

const usePaymentMutation = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: submitOrder,
    onSuccess: (data) => {
      console.log("Order submitted successfully:", data);

      // Check if payment_url exists in response
      if (data?.data?.payment_url) {
        console.log("Redirecting to payment gateway:", data.data.payment_url);

        // Show success toast
        showToast("در حال انتقال به درگاه پرداخت...", "success");

        // Redirect to Zarinpal payment gateway
        window.location.href = data.data.payment_url;
      } else {
        console.error("Payment URL not found in response:", data);
        showToast(
          "خطا در دریافت لینک پرداخت. لطفاً دوباره تلاش کنید.",
          "error"
        );
      }

      // Optionally invalidate cart queries to refresh the cart state
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error) => {
      console.error("Failed to submit order:", error);

      // Check if it's a 400 error with profile completion message
      if (
        error.response?.status === 400 &&
        error.response?.data?.data?.message
      ) {
        const errorData = error.response.data.data;
        console.log("Profile completion required:", errorData);

        // Show toast to inform user
        showToast(
          "برای ثبت سفارش، لطفاً ابتدا اطلاعات کاربری خود را تکمیل کنید.",
          "warning"
        );

        // Redirect to /user route for profile completion
        navigate("/user");
      }
    },
  });
};

export default usePaymentMutation;
