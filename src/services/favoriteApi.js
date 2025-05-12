import api from "../configs/api";

export const fetchFavoriteProducts = async () => {
  try {
    const response = await api.get("saved-items");
    return response.data;
  } catch (error) {
    throw new Error("خطا در دریافت محصولات مورد علاقه");
  }
};

export const addToFavorite = async (productId) => {
  try {
    const response = await api.post(`saved-items/save/${productId}`);
    return response.data;
  } catch (error) {
    throw new Error("خطا در افزودن به علاقه‌مندی‌ها");
  }
};

export const removeFromFavorite = async (productId) => {
  try {
    const response = await api.delete(`saved-items/remove/${productId}`);
    return response.data;
  } catch (error) {
    throw new Error("خطا در حذف از علاقه‌مندی‌ها");
  }
};
