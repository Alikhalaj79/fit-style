import api from "../configs/api";

// add to cart for the first time
const addToCart = async (productId, quantity) => {
  try {
    const formData = new URLSearchParams();
    formData.append("productId", productId);
    formData.append("quantity", quantity);

    const headers = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    const response = await api.post("cart/add", formData, headers);
    return response.data;
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
};

// get or fetch cart
const fetchCart = async () => {
  const response = await api.get("cart");
  return response.data.data.cart;
};

// increase items quantity
const increaseCartItemQuantity = async (productId, currentQuantity) => {
  try {
    const newQuantity = currentQuantity + 1;

    const formData = new URLSearchParams();
    formData.append("productId", productId);
    formData.append("quantity", newQuantity);

    const headers = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    const response = await api.put("cart/update", formData, headers);
    return response.data;
  } catch (error) {
    console.error("Error increasing cart item quantity:", error);
    throw error;
  }
};

//decrease item's quantity
const decreaseCartItemQuantity = async (productId, currentQuantity) => {
  try {
    const newQuantity = currentQuantity - 1;

    if (newQuantity < 1) {
      console.warn("Quantity can't be less than 1.");
      return;
    }

    const formData = new URLSearchParams();
    formData.append("productId", productId);
    formData.append("quantity", newQuantity);

    const headers = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    const response = await api.put("cart/update", formData, headers);
    return response.data;
  } catch (error) {
    console.error("Error decreasing cart item quantity:", error);
    throw error;
  }
};

const removeFromCart = async (productId) => {
  try {
    const response = await api.delete(`cart/remove/${productId}`);
    return response.data;
  } catch (error) {
    console.error("Error removing cart item:", error);
    throw error;
  }
};

const clearCart = async () => {
  try {
    const response = await api.get("cart/clear-cart");
    return response.data;
  } catch (error) {
    throw new Error("خطا در پاک کردن سبد خرید");
  }
};

export {
  addToCart,
  fetchCart,
  increaseCartItemQuantity,
  decreaseCartItemQuantity,
  removeFromCart,
  clearCart,
};
