import api from "../configs/api";

export const fetchFavoriteProducts = async () => {
  try {
    const response = await api.get("saved-items");

    console.log("=== fetchFavoriteProducts Debug ===");
    console.log("Raw response:", response);
    console.log("Response data:", response.data);
    console.log("Response data.data:", response.data?.data);
    console.log(
      "Response data.data.savedItems:",
      response.data?.data?.savedItems
    );
    console.log(
      "Response data.data.savedItems.items:",
      response.data?.data?.savedItems?.items
    );
    console.log("===================================");

    // Extract items from the new response structure
    if (response.data?.data?.savedItems?.items) {
      console.log("Returning items:", response.data.data.savedItems.items);
      return response.data.data.savedItems.items;
    }

    console.log("No items found, returning empty array");
    return [];
  } catch (error) {
    console.log("=== fetchFavoriteProducts Error ===");
    console.log("Error:", error);
    console.log("Error response:", error.response);
    console.log("Error status:", error.response?.status);
    console.log("Error data:", error.response?.data);
    console.log("================================");

    // Check if it's a 401 (unauthorized) error
    if (error.response?.status === 401) {
      throw new Error("لطفا وارد حساب کاربری شوید");
    }

    // Check if it's a 400 error with specific message
    if (
      error.response?.status === 400 &&
      error.response?.data?.message === "هیچ محصولی در لیست مورد علاقه ها نیست"
    ) {
      return [];
    }

    throw new Error("خطا در دریافت محصولات مورد علاقه");
  }
};

export const addToFavorite = async (productId) => {
  try {
    const response = await api.post("saved-items/save", { productId });
    return response.data;
  } catch (error) {
    // Check if it's a 401 (unauthorized) error
    if (error.response?.status === 401) {
      throw new Error("لطفا وارد حساب کاربری شوید");
    }

    throw new Error("خطا در افزودن به علاقه‌مندی‌ها");
  }
};

export const removeFromFavorite = async (productId) => {
  try {
    const response = await api.post("saved-items/remove", { productId });
    return response.data;
  } catch (error) {
    // Check if it's a 401 (unauthorized) error
    if (error.response?.status === 401) {
      throw new Error("لطفا وارد حساب کاربری شوید");
    }

    throw new Error("خطا در حذف از علاقه‌مندی‌ها");
  }
};

export const checkIfItemIsSaved = async (productId) => {
  try {
    const response = await api.post("saved-items/is-saved", { productId });
    return response.data;
  } catch (error) {
    // Check if it's a 401 (unauthorized) error
    if (error.response?.status === 401) {
      throw new Error("لطفا وارد حساب کاربری شوید");
    }

    throw new Error("خطا در بررسی وضعیت مورد علاقه");
  }
};

export const clearAllFavorites = async () => {
  try {
    const response = await api.delete("saved-items/clear");
    return response.data;
  } catch (error) {
    // Check if it's a 401 (unauthorized) error
    if (error.response?.status === 401) {
      throw new Error("لطفا وارد حساب کاربری شوید");
    }

    throw new Error("خطا در پاک کردن همه موارد علاقه");
  }
};

export const addToCartFromFavorites = async (productId) => {
  try {
    const response = await api.post("saved-items/add-to-cart", { productId });
    return response.data;
  } catch (error) {
    // Check if it's a 401 (unauthorized) error
    if (error.response?.status === 401) {
      throw new Error("لطفا وارد حساب کاربری شوید");
    }

    throw new Error("خطا در افزودن به سبد خرید");
  }
};
