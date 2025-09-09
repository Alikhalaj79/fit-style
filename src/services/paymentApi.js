import api from "../configs/api";

// Submit order for payment
const submitOrder = async (cartId) => {
  try {
    // Use current origin (localhost:5173) for callback
    const callbackUrl = `${window.location.origin}/payment/callback`;
    const response = await api.post("payment", { cartId, callbackUrl });
    return response.data;
  } catch (error) {
    console.error("Error submitting order:", error);
    throw error;
  }
};

// Verify payment callback
const verifyPayment = async (authority, status) => {
  try {
    const response = await api.get("payment/callback", {
      params: { authority, status },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export { submitOrder, verifyPayment };
